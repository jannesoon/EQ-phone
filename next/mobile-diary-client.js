(function initXingyueMobileDiaryClient(global) {
    'use strict';

    const DIARY_PATH = '/api/chat-diaries';
    const REQUEST_TIMEOUT_MS = 15_000;
    const LOGGED_OUT_MESSAGE = '请先登录云书房后再使用手机日记功能';

    const defaultLoadTransport = () => import('./library/transport.js');

    const authError = () => Object.assign(new Error(LOGGED_OUT_MESSAGE), {
        code: 'AUTH_REQUIRED',
        status: 401
    });

    const invalidResponseError = message => Object.assign(new Error(message), {
        code: 'INVALID_RESPONSE'
    });

    const parseExpiry = value => {
        if (typeof value === 'number' && Number.isFinite(value)) return value;
        const parsed = Date.parse(String(value || ''));
        return Number.isFinite(parsed) ? parsed : Number.NaN;
    };

    const hasUsableSession = session => {
        if (!session || typeof session !== 'object' || typeof session.token !== 'string' || !session.token.trim()) return false;
        if (session.expiresAt === undefined || session.expiresAt === null) return true;
        const expiresAt = parseExpiry(session.expiresAt);
        return Number.isFinite(expiresAt) && expiresAt > Date.now();
    };

    const readSessionOrThrow = async transport => {
        if (!transport || typeof transport.readSession !== 'function') throw authError();
        let session;
        try {
            session = await transport.readSession();
        } catch (error) {
            if (Number(error?.status) === 403) throw error;
            if (Number(error?.status) === 401 || error?.code === 'AUTH_REQUIRED') throw authError();
            throw error;
        }
        if (!hasUsableSession(session)) throw authError();
        return session;
    };

    const normalizeTransport = loaded => {
        const moduleValue = loaded?.default && typeof loaded.default === 'object'
            && (typeof loaded.readSession !== 'function' || typeof loaded.requestJson !== 'function')
            ? loaded.default
            : loaded;
        if (moduleValue && typeof moduleValue.readSession !== 'function'
            && typeof moduleValue.requestJson !== 'function'
            && typeof moduleValue.createTransport === 'function') {
            return moduleValue.createTransport();
        }
        return moduleValue;
    };

    const makeUtf8Bytes = (value, textEncoder, Uint8ArrayRef) => {
        if (typeof textEncoder === 'function') return new textEncoder().encode(value);
        const encoded = unescape(encodeURIComponent(value));
        const bytes = new Uint8ArrayRef(encoded.length);
        for (let index = 0; index < encoded.length; index += 1) bytes[index] = encoded.charCodeAt(index);
        return bytes;
    };

    const hex = byte => byte.toString(16).padStart(2, '0');

    const bytesToUuid = bytes => {
        const text = Array.from(bytes, hex).join('');
        return `${text.slice(0, 8)}-${text.slice(8, 12)}-${text.slice(12, 16)}-${text.slice(16, 20)}-${text.slice(20, 32)}`;
    };

    const stableDiaryId = async ({ title, content, metadata }, cryptoRef) => {
        if (!cryptoRef?.subtle || typeof cryptoRef.subtle.digest !== 'function') {
            throw new Error('当前浏览器不支持日记幂等编号计算');
        }
        const details = metadata && typeof metadata === 'object' ? metadata : {};
        const serialized = JSON.stringify({
            window_id: details.window_id ?? '',
            event_key: details.event_key ?? '',
            content_hash: details.content_hash ?? '',
            title: title == null ? '' : String(title),
            content: content == null ? '' : String(content)
        });
        const digest = await cryptoRef.subtle.digest(
            'SHA-256',
            makeUtf8Bytes(serialized, global.TextEncoder, global.Uint8Array || Uint8Array)
        );
        const bytes = new Uint8Array(digest).slice(0, 16);
        // UUID version 5/variant bits make the SHA-256-derived value a safe UUID.
        bytes[6] = (bytes[6] & 0x0f) | 0x50;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        return bytesToUuid(bytes);
    };

    const timeoutError = () => Object.assign(new Error('云书房日记请求超时，请稍后重试'), {
        code: 'REQUEST_TIMEOUT'
    });

    const callWithTimeout = (operation, timeoutMs, AbortControllerRef, setTimeoutRef, clearTimeoutRef) => new Promise((resolve, reject) => {
        const controller = typeof AbortControllerRef === 'function' ? new AbortControllerRef() : null;
        let settled = false;
        const timer = setTimeoutRef(() => {
            if (settled) return;
            settled = true;
            try { controller?.abort(); } catch { /* an abort is best effort */ }
            reject(timeoutError());
        }, timeoutMs);
        Promise.resolve()
            .then(() => operation(controller?.signal))
            .then(value => {
                if (settled) return;
                settled = true;
                clearTimeoutRef(timer);
                resolve(value);
            }, error => {
                if (settled) return;
                settled = true;
                clearTimeoutRef(timer);
                reject(error);
            });
    });

    const createClient = (options = {}) => {
        if (!global.XINGYUE_MOBILE_RUNTIME?.connected) return null;

        const loadTransport = typeof options.loadTransport === 'function'
            ? options.loadTransport
            : defaultLoadTransport;
        const cryptoRef = options.cryptoRef || global.crypto;
        const setTimeoutRef = global.setTimeout || setTimeout;
        const clearTimeoutRef = global.clearTimeout || clearTimeout;
        const AbortControllerRef = global.AbortController;
        let transportPromise;

        const getTransport = () => {
            if (!transportPromise) {
                transportPromise = Promise.resolve()
                    .then(() => loadTransport())
                    .then(normalizeTransport);
            }
            return transportPromise;
        };

        const requestJson = async (transport, optionsForRequest) => {
            if (typeof transport?.requestJson !== 'function') {
                throw new Error('云书房日记传输模块不可用');
            }
            return callWithTimeout(
                signal => transport.requestJson(DIARY_PATH, {
                    ...optionsForRequest,
                    ...(signal ? { signal } : {})
                }),
                REQUEST_TIMEOUT_MS,
                AbortControllerRef,
                setTimeoutRef,
                clearTimeoutRef
            );
        };

        const mapRequestError = error => {
            if (Number(error?.status) === 403) return error;
            if (Number(error?.status) === 401 || error?.code === 'AUTH_REQUIRED') return authError();
            return error;
        };

        const readLatestDiaries = async () => {
            try {
                const transport = await getTransport();
                await readSessionOrThrow(transport);
                const payload = await requestJson(transport, {
                    method: 'GET',
                    headers: { 'X-Yunshufang-Read': '1' }
                });
                if (!payload || !Array.isArray(payload.entries)) {
                    throw invalidResponseError('云书房日记读取返回格式不正确');
                }
                return { entries: payload.entries };
            } catch (error) {
                throw mapRequestError(error);
            }
        };

        const writeDiaryEntry = async ({ title, content, metadata } = {}) => {
            try {
                const transport = await getTransport();
                await readSessionOrThrow(transport);
                const safeTitle = title == null ? '' : title;
                const safeContent = content == null ? '' : content;
                const safeMetadata = metadata === undefined ? {} : metadata;
                const id = await stableDiaryId({ title: safeTitle, content: safeContent, metadata: safeMetadata }, cryptoRef);
                const payload = await requestJson(transport, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Yunshufang-Write': '1'
                    },
                    body: JSON.stringify({
                        id,
                        title: safeTitle,
                        content: safeContent,
                        metadata: safeMetadata
                    })
                });
                if (payload?.ok !== true || !payload.entry || typeof payload.entry.id !== 'string' || !payload.entry.id) {
                    throw invalidResponseError('云书房日记写入没有返回有效条目编号');
                }
                return payload.entry;
            } catch (error) {
                throw mapRequestError(error);
            }
        };

        return Object.freeze({ readLatestDiaries, writeDiaryEntry });
    };

    global.XingyueMobileDiaryClient = Object.freeze({ createClient });
})(window);
