import './app.js';
import { clearSession, isApiConfigured, readSession, requestJson } from './transport.js?v=phone-r14';

let locking = false;
let checking = false;
let redirecting = false;
let cloudOpened = false;

function clearView() { document.dispatchEvent(new Event('yunshufang-lock')); }
function redirectToGate() {
  if (redirecting) return;
  redirecting = true;
  clearSession();
  clearView();
  location.replace('./gate.html');
}
function showLogoutFailure() {
  const status = document.getElementById('cloud-login-status');
  if (!status) return;
  status.hidden = false;
  status.textContent = '页面内容已清除，但服务器撤销未确认；请恢复连接后重新登录。';
}
function showSessionRetry() {
  const status = document.getElementById('cloud-login-status');
  if (!status) return;
  status.hidden = false;
  status.replaceChildren();
  const copy = document.createElement('span');
  copy.textContent = '暂时无法验证云端会话；页面内容尚未读取，请恢复连接后重试。';
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'text-button';
  retry.dataset.authRetry = 'true';
  retry.textContent = '重新验证';
  retry.addEventListener('click', () => { void checkSession(); });
  status.append(copy, retry);
}
function openAuthenticatedCloud() {
  if (cloudOpened || redirecting || locking) return;
  cloudOpened = true;
  document.getElementById('login-form')?.requestSubmit();
}
async function checkSession() {
  if (checking || locking || redirecting) return;
  checking = true;
  try {
    if (!isApiConfigured()) { redirectToGate(); return; }
    const status = await requestJson('/api/auth/status', { signal: AbortSignal.timeout(10000) });
    if (status?.authenticated === true) openAuthenticatedCloud();
    else redirectToGate();
  } catch (error) {
    if (error?.code === 'API_NOT_CONFIGURED' || error?.status === 401) redirectToGate();
    else showSessionRetry();
  } finally { checking = false; }
}

document.addEventListener('yunshufang-logout', async () => {
  if (locking) return;
  locking = true;
  const session = readSession();
  clearView();
  clearSession();
  try {
    const payload = await requestJson('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Yunshufang-Auth': '1' },
      body: '{}',
      session: session || null,
      signal: AbortSignal.timeout(15000),
    });
    if (payload?.ok !== true) throw new Error('logout not confirmed');
    location.replace('./gate.html');
  } catch {
    showLogoutFailure();
  } finally { locking = false; }
});
document.addEventListener('yunshufang-lock', () => {
  if (!locking) redirectToGate();
});
window.addEventListener('pageshow', () => { void checkSession(); });
window.addEventListener('focus', () => { void checkSession(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) void checkSession(); });
setInterval(() => { if (!document.hidden) void checkSession(); }, 60000);
void checkSession();
