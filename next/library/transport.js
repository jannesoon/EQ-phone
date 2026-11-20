import { RUNTIME_CONFIG } from './runtime-config.js?v=phone-r9';

export const SESSION_HEADER = 'X-Yunshufang-Session';
export const SESSION_STORAGE_KEY = 'yunshufang.session.v1';

export class ApiConfigError extends Error {
  constructor(message = '云书房 API 尚未配置') {
    super(message);
    this.name = 'ApiConfigError';
    this.code = 'API_NOT_CONFIGURED';
  }
}

const SESSION_STORAGE_ERROR_CODE = 'SESSION_STORAGE_UNAVAILABLE';

function safeStorage(storage) {
  return storage && typeof storage.getItem === 'function' && typeof storage.setItem === 'function' && typeof storage.removeItem === 'function'
    ? storage
    : null;
}

function readDefaultStorage(name) {
  try { return globalThis[name]; } catch { return null; }
}

function expiryMs(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = Date.parse(String(value || ''));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function readStoredSession(storage, key, now) {
  if (!storage) return null;
  let raw = null;
  try { raw = storage.getItem(key); } catch { return null; }
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.token !== 'string' || !parsed.token || !Number.isFinite(expiryMs(parsed.expiresAt)) || expiryMs(parsed.expiresAt) <= now()) {
      try { storage.removeItem(key); } catch { /* storage may be unavailable */ }
      return null;
    }
    return { token: parsed.token, expiresAt: parsed.expiresAt };
  } catch {
    try { storage.removeItem(key); } catch { /* storage may be unavailable */ }
    return null;
  }
}

function normalizeApiBase(value) {
  const text = String(value ?? '').trim().replace(/\/+$/, '');
  if (!text) return '';
  let parsed;
  try { parsed = new URL(text); } catch { throw new ApiConfigError('云书房 API 地址无效'); }
  const localHttp = parsed.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]', '::1'].includes(parsed.hostname);
  if (parsed.protocol !== 'https:' && !localHttp) throw new ApiConfigError('云书房 API 必须使用 HTTPS');
  if (parsed.username || parsed.password || parsed.search || parsed.hash) throw new ApiConfigError('云书房 API 地址不能包含凭据或查询参数');
  return text;
}

function assertApiPath(path) {
  if (typeof path !== 'string' || !path.startsWith('/api/') || path.startsWith('//') || path.includes('//') || path.includes('\\') || path.includes('\0') || path.includes('?') || path.includes('#')) {
    throw new TypeError('云书房 API 路径无效');
  }
  const rawSegments = path.slice('/api/'.length).split('/');
  try {
    for (const rawSegment of rawSegments) {
      const segment = decodeURIComponent(rawSegment);
      if (!segment || segment === '.' || segment === '..' || segment.includes('/') || segment.includes('\\') || segment.includes('\0') || /%(?:2e|2f|5c|00)/i.test(segment)) {
        throw new TypeError('云书房 API 路径无效');
      }
    }
  } catch (error) {
    if (error instanceof TypeError) throw error;
    throw new TypeError('云书房 API 路径无效');
  }
  return path;
}

function apiUrlFor(base, path) {
  const safePath = assertApiPath(path);
  const baseUrl = new URL(base);
  const basePath = baseUrl.pathname.replace(/\/+$/, '');
  const expectedPrefix = `${basePath}/api/`;
  let result;
  try { result = new URL(`${basePath}${safePath}`, `${baseUrl.origin}/`); } catch { throw new TypeError('云书房 API 路径无效'); }
  if (result.origin !== baseUrl.origin || !result.pathname.startsWith(expectedPrefix) || result.search || result.hash) {
    throw new TypeError('云书房 API 路径无效');
  }
  return result.href;
}

export function sessionStorageKeyForApiBase(apiBase) {
  const normalized = normalizeApiBase(apiBase);
  if (!normalized) return `${SESSION_STORAGE_KEY}:unconfigured`;
  const parsed = new URL(normalized);
  const identity = `${parsed.origin}${parsed.pathname.replace(/\/+$/, '')}`;
  return `${SESSION_STORAGE_KEY}:${encodeURIComponent(identity)}`;
}

function responseError(response, payload) {
  const error = new Error(payload?.error || `云书房请求失败（${response.status}）`);
  error.status = response.status;
  error.payload = payload;
  return error;
}

function sessionStorageError(kind) {
  const message = kind === 'remember'
    ? '云书房登录未完成：无法更新“记住登录”状态，请允许本站使用持久化存储后重试。'
    : '云书房登录未完成：当前浏览器无法保存会话，请允许本站使用存储空间后重试。';
  const error = new Error(message);
  error.name = 'SessionStorageError';
  error.code = SESSION_STORAGE_ERROR_CODE;
  return error;
}

export function createTransport({
  apiBase = RUNTIME_CONFIG.apiBase,
  fetchImpl = globalThis.fetch,
  sessionStorageImpl,
  localStorageImpl,
  clock = () => Date.now(),
} = {}) {
  const base = normalizeApiBase(apiBase);
  const storageKey = sessionStorageKeyForApiBase(base);
  const sessionStore = safeStorage(sessionStorageImpl === undefined ? readDefaultStorage('sessionStorage') : sessionStorageImpl);
  const localStore = safeStorage(localStorageImpl === undefined ? readDefaultStorage('localStorage') : localStorageImpl);

  function isConfigured() { return Boolean(base); }
  function apiUrl(path) {
    if (!base) throw new ApiConfigError();
    return apiUrlFor(base, path);
  }
  function readSession() {
    return readStoredSession(sessionStore, storageKey, clock) || readStoredSession(localStore, storageKey, clock);
  }
  function clearSession() {
    for (const storage of [sessionStore, localStore]) {
      try { storage?.removeItem(storageKey); } catch { /* storage may be unavailable */ }
    }
  }
  function saveSession({ token, expiresAt, remember = false } = {}) {
    if (typeof token !== 'string' || !token || !Number.isFinite(expiryMs(expiresAt)) || expiryMs(expiresAt) <= clock()) {
      throw new Error('云书房登录返回的会话不完整');
    }
    const record = JSON.stringify({ token, expiresAt });
    if (!sessionStore) throw sessionStorageError('session');
    try {
      sessionStore.setItem(storageKey, record);
    } catch {
      clearSession();
      throw sessionStorageError('session');
    }
    if (remember === true) {
      if (!localStore) {
        clearSession();
        throw sessionStorageError('remember');
      }
      try {
        localStore.setItem(storageKey, record);
      } catch {
        clearSession();
        throw sessionStorageError('remember');
      }
    } else {
      try {
        localStore?.removeItem(storageKey);
      } catch {
        clearSession();
        throw sessionStorageError('remember');
      }
    }
    return { token, expiresAt };
  }
  async function request(path, options = {}) {
    const url = apiUrl(path);
    if (typeof fetchImpl !== 'function') throw new TypeError('当前浏览器不支持网络请求');
    const { session, includeSession = true, ...init } = options;
    const headers = new Headers(init.headers || {});
    const selectedSession = session === undefined ? readSession() : session;
    headers.delete(SESSION_HEADER);
    headers.delete('Authorization');
    headers.delete('Cookie');
    if (includeSession && selectedSession?.token) headers.set(SESSION_HEADER, selectedSession.token);
    const response = await fetchImpl(url, {
      ...init,
      headers,
      credentials: 'omit',
      cache: init.cache || 'no-store',
      redirect: 'error',
    });
    return response;
  }
  async function requestJson(path, options = {}) {
    const response = await request(path, options);
    let payload = null;
    try { payload = await response.json(); } catch { payload = null; }
    if (!response.ok) throw responseError(response, payload);
    return payload;
  }
  async function login({ password, remember = false } = {}) {
    const payload = await requestJson('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Yunshufang-Auth': '1' },
      body: JSON.stringify({ password, remember: remember === true }),
      session: null,
    });
    if (payload?.ok !== true || typeof payload.token !== 'string' || typeof payload.remember !== 'boolean' || !Number.isFinite(expiryMs(payload.expiresAt))) throw new Error('云书房登录返回的会话不完整');
    saveSession(payload);
    return payload;
  }

  return Object.freeze({ apiUrl, clearSession, isConfigured, login, readSession, request, requestJson, saveSession });
}

const defaultTransport = createTransport();
export const apiUrl = (...args) => defaultTransport.apiUrl(...args);
export const clearSession = (...args) => defaultTransport.clearSession(...args);
export const isApiConfigured = (...args) => defaultTransport.isConfigured(...args);
export const login = (...args) => defaultTransport.login(...args);
export const readSession = (...args) => defaultTransport.readSession(...args);
export const request = (...args) => defaultTransport.request(...args);
export const requestJson = (...args) => defaultTransport.requestJson(...args);
export const saveSession = (...args) => defaultTransport.saveSession(...args);

