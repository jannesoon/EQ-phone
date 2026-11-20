(function initXingyuePhoneAppearance(global) {
    'use strict';

    const PREFS_KEY = 'xingyue_phone_appearance_v1';
    const DB_NAME = 'xingyue-phone-appearance';
    const STORE_NAME = 'cover';
    const COVER_KEY = 'home-cover';
    const DEFAULT_THEME = 'violet';
    const DEFAULT_POSITION = 50;
    const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
    const MAX_RESULT_BYTES = 1024 * 1024;
    const MAX_LONG_SIDE = 1600;
    const THEME_DEFINITIONS = Object.freeze({
        violet: Object.freeze({ label: '星月紫', color: '#241f50' }),
        champagne: Object.freeze({ label: '香槟暖色', color: '#eee2d5' }),
        moonblue: Object.freeze({ label: '月光雾蓝', color: '#d9e1f3' }),
        obsidian: Object.freeze({ label: '曜石黑金', color: '#171a22' }),
    });
    const THEME_IDS = new Set(Object.keys(THEME_DEFINITIONS));
    const QUALITY_STEPS = [0.86, 0.74, 0.62, 0.50, 0.38, 0.26, 0.18];
    const DIMENSION_STEPS = [1600, 1280, 1024, 800, 640];

    let state = {
        themeId: DEFAULT_THEME,
        coverUrl: null,
        coverPosition: DEFAULT_POSITION,
    };
    let errorMessage = '';
    let loadPromise = null;
    let databasePromise = null;
    let coverUrl = null;
    const subscribers = new Set();

    function appearanceError(message, code = 'PHONE_APPEARANCE_ERROR') {
        const error = new Error(String(message));
        error.code = code;
        return error;
    }

    function getDocument() {
        try { return global.document || null; } catch (_) { return null; }
    }

    function getStorage() {
        try { return global.localStorage || null; } catch (_) { return null; }
    }

    function getIndexedDb() {
        try { return global.indexedDB || null; } catch (_) { return null; }
    }

    function clampPosition(value) {
        const number = Number(value);
        if (!Number.isFinite(number)) return DEFAULT_POSITION;
        return Math.max(0, Math.min(100, Math.round(number)));
    }

    function snapshot() {
        const value = {
            themeId: state.themeId,
            coverUrl: state.coverUrl,
            coverPosition: state.coverPosition,
        };
        if (errorMessage) value.error = errorMessage;
        return Object.freeze(value);
    }

    function publish() {
        const next = snapshot();
        for (const callback of [...subscribers]) {
            try { callback(next); } catch (_) { /* A subscriber must not break local state. */ }
        }
        return next;
    }

    function setError(error) {
        errorMessage = error instanceof Error ? error.message : String(error || '本地外观处理失败');
        return publish();
    }

    function clearError() {
        errorMessage = '';
    }

    function applyTheme(themeId) {
        const theme = THEME_DEFINITIONS[themeId] || THEME_DEFINITIONS[DEFAULT_THEME];
        const documentRef = getDocument();
        if (!documentRef) return;
        const root = documentRef.documentElement;
        if (!root) return;
        try {
            root.dataset.phoneTheme = themeId;
            root.style?.setProperty('--phone-canvas-bg', theme.color);
            if (documentRef.body) {
                documentRef.body.dataset.phoneTheme = themeId;
            } else {
                global.addEventListener?.('DOMContentLoaded', () => applyTheme(state.themeId), { once: true });
            }

            let meta = documentRef.querySelector?.('meta[name="theme-color"]') || null;
            if (!meta && documentRef.createElement && documentRef.head?.appendChild) {
                meta = documentRef.createElement('meta');
                meta.name = 'theme-color';
                documentRef.head.appendChild(meta);
            }
            if (meta) {
                meta.content = theme.color;
                meta.setAttribute?.('content', theme.color);
            }
        } catch (_) {
            // Appearance is local enhancement; an incomplete document must not stop the app.
        }
    }

    function readPrefs() {
        const storage = getStorage();
        if (!storage || typeof storage.getItem !== 'function') return { prefs: null };
        try {
            const raw = storage.getItem(PREFS_KEY);
            if (!raw) return { prefs: null };
            const parsed = JSON.parse(raw);
            return {
                prefs: {
                    themeId: THEME_IDS.has(parsed?.themeId) ? parsed.themeId : DEFAULT_THEME,
                    coverPosition: clampPosition(parsed?.coverPosition),
                },
            };
        } catch (_) {
            return { prefs: null, error: '本地外观设置无法读取，已暂时使用默认外观。' };
        }
    }

    function persistPrefs() {
        const storage = getStorage();
        if (!storage || typeof storage.setItem !== 'function') return false;
        try {
            storage.setItem(PREFS_KEY, JSON.stringify({
                themeId: state.themeId,
                coverPosition: state.coverPosition,
            }));
            return true;
        } catch (_) {
            return false;
        }
    }

    function hasObjectStore(database, name) {
        const names = database?.objectStoreNames;
        if (names?.contains) return names.contains(name);
        try { return Array.from(names || []).includes(name); } catch (_) { return false; }
    }

    function openDatabase() {
        if (databasePromise) return databasePromise;
        const indexedDb = getIndexedDb();
        if (!indexedDb || typeof indexedDb.open !== 'function') {
            return Promise.reject(appearanceError('当前浏览器不支持本地封面存储。', 'IDB_UNAVAILABLE'));
        }
        databasePromise = new Promise((resolve, reject) => {
            let request;
            try {
                request = indexedDb.open(DB_NAME, 1);
            } catch (error) {
                reject(appearanceError('本地封面存储无法打开。', 'IDB_OPEN_FAILED'));
                return;
            }
            request.onupgradeneeded = event => {
                try {
                    const database = event.target.result;
                    if (!hasObjectStore(database, STORE_NAME)) database.createObjectStore(STORE_NAME);
                } catch (_) {
                    reject(appearanceError('本地封面存储初始化失败。', 'IDB_UPGRADE_FAILED'));
                }
            };
            request.onerror = () => reject(appearanceError('本地封面存储无法打开。', 'IDB_OPEN_FAILED'));
            request.onblocked = () => reject(appearanceError('本地封面存储正在被其他页面占用。', 'IDB_BLOCKED'));
            request.onsuccess = () => resolve(request.result);
        }).catch(error => {
            databasePromise = null;
            throw error;
        });
        return databasePromise;
    }

    function withStore(mode, operation) {
        return openDatabase().then(database => new Promise((resolve, reject) => {
            let transaction;
            let request;
            let settled = false;
            const finish = (handler, value) => {
                if (settled) return;
                settled = true;
                handler(value);
            };
            try {
                transaction = database.transaction(STORE_NAME, mode);
                request = operation(transaction.objectStore(STORE_NAME));
            } catch (_) {
                finish(reject, appearanceError('本地封面存储操作失败。', 'IDB_OPERATION_FAILED'));
                return;
            }
            request.onsuccess = () => finish(resolve, request.result);
            request.onerror = () => finish(reject, appearanceError('本地封面存储操作失败。', 'IDB_OPERATION_FAILED'));
            transaction.onerror = () => finish(reject, appearanceError('本地封面存储操作失败。', 'IDB_OPERATION_FAILED'));
            transaction.onabort = () => finish(reject, appearanceError('本地封面存储操作已取消。', 'IDB_ABORTED'));
        }));
    }

    function readCoverBlob() {
        return withStore('readonly', store => store.get(COVER_KEY));
    }

    function writeCoverBlob(blob) {
        return withStore('readwrite', store => store.put(blob, COVER_KEY));
    }

    function deleteCoverBlob() {
        return withStore('readwrite', store => store.delete(COVER_KEY));
    }

    function getUrlApi() {
        try { return global.URL || null; } catch (_) { return null; }
    }

    function createObjectUrl(blob) {
        const urlApi = getUrlApi();
        if (!urlApi || typeof urlApi.createObjectURL !== 'function') {
            throw appearanceError('当前浏览器无法显示本地封面。', 'OBJECT_URL_UNAVAILABLE');
        }
        return urlApi.createObjectURL(blob);
    }

    function revokeObjectUrl(url) {
        if (!url) return;
        try { getUrlApi()?.revokeObjectURL?.(url); } catch (_) { /* Best effort cleanup. */ }
    }

    function decodeWithImage(file) {
        const ImageConstructor = global.Image;
        const urlApi = getUrlApi();
        if (typeof ImageConstructor !== 'function') {
            return Promise.reject(appearanceError('当前浏览器无法读取图片。', 'IMAGE_DECODE_UNAVAILABLE'));
        }
        return new Promise((resolve, reject) => {
            const image = new ImageConstructor();
            let sourceUrl = null;
            let settled = false;
            const fail = () => {
                if (settled) return;
                settled = true;
                if (sourceUrl) revokeObjectUrl(sourceUrl);
                reject(appearanceError('图片无法读取，请换一张图片重试。', 'IMAGE_DECODE_FAILED'));
            };
            image.onload = () => {
                if (settled) return;
                settled = true;
                if (sourceUrl) revokeObjectUrl(sourceUrl);
                const width = Number(image.naturalWidth || image.width);
                const height = Number(image.naturalHeight || image.height);
                if (!width || !height) {
                    reject(appearanceError('图片尺寸无法读取，请换一张图片重试。', 'IMAGE_DIMENSIONS_INVALID'));
                    return;
                }
                resolve({ source: image, width, height, close() {} });
            };
            image.onerror = fail;
            try {
                if (urlApi?.createObjectURL) {
                    sourceUrl = urlApi.createObjectURL(file);
                    image.src = sourceUrl;
                } else if (typeof global.FileReader === 'function') {
                    const reader = new global.FileReader();
                    reader.onload = () => { image.src = reader.result; };
                    reader.onerror = fail;
                    reader.readAsDataURL(file);
                } else {
                    fail();
                }
            } catch (_) { fail(); }
        });
    }

    async function decodeImage(file) {
        if (typeof global.createImageBitmap === 'function') {
            try {
                const bitmap = await global.createImageBitmap(file);
                const width = Number(bitmap.width);
                const height = Number(bitmap.height);
                if (width > 0 && height > 0) return { source: bitmap, width, height, close: () => bitmap.close?.() };
                bitmap.close?.();
            } catch (_) {
                // Safari and some older WebViews may expose createImageBitmap but reject a file.
            }
        }
        return decodeWithImage(file);
    }

    function canvasToBlob(canvas, type, quality) {
        return new Promise(resolve => {
            try {
                canvas.toBlob(blob => {
                    resolve(blob || null);
                }, type, quality);
            } catch (_) {
                resolve(null);
            }
        });
    }

    async function compressImage(file) {
        if (!file || typeof file !== 'object') {
            throw appearanceError('请选择一张图片。', 'IMAGE_REQUIRED');
        }
        const fileSize = Number(file.size);
        if (Number.isFinite(fileSize) && fileSize > MAX_UPLOAD_BYTES) {
            throw appearanceError('图片不能超过 20 MB，请换一张图片。', 'IMAGE_TOO_LARGE');
        }
        if (file.type && !/^image\//i.test(file.type)) {
            throw appearanceError('只支持图片文件，请选择 JPG、PNG 或 WebP。', 'IMAGE_TYPE_INVALID');
        }
        const documentRef = getDocument();
        if (!documentRef?.createElement) {
            throw appearanceError('当前浏览器无法处理图片。', 'IMAGE_COMPRESS_UNAVAILABLE');
        }
        const decoded = await decodeImage(file);
        try {
            const longest = Math.max(decoded.width, decoded.height);
            if (!Number.isFinite(longest) || longest <= 0) {
                throw appearanceError('图片尺寸无法读取，请换一张图片重试。', 'IMAGE_DIMENSIONS_INVALID');
            }
            const maximum = Math.min(MAX_LONG_SIDE, longest);
            const dimensions = [...new Set(DIMENSION_STEPS.map(step => Math.min(step, maximum)))];
            const canvas = documentRef.createElement('canvas');
            const context = canvas.getContext?.('2d');
            if (!context || typeof canvas.toBlob !== 'function') {
                throw appearanceError('当前浏览器无法压缩图片。', 'IMAGE_COMPRESS_UNAVAILABLE');
            }
            let lastBlob = null;
            for (const targetLongSide of dimensions) {
                const scale = targetLongSide / longest;
                const width = Math.max(1, Math.round(decoded.width * scale));
                const height = Math.max(1, Math.round(decoded.height * scale));
                canvas.width = width;
                canvas.height = height;
                context.clearRect?.(0, 0, width, height);
                context.drawImage(decoded.source, 0, 0, width, height);
                for (const type of ['image/webp', 'image/jpeg']) {
                    for (const quality of QUALITY_STEPS) {
                        const blob = await canvasToBlob(canvas, type, quality);
                        if (!blob) continue;
                        if (!/^image\/(?:webp|jpeg)$/i.test(String(blob.type || ''))) continue;
                        lastBlob = blob;
                        if (blob.size <= MAX_RESULT_BYTES) return blob;
                    }
                }
            }
            if (lastBlob && lastBlob.size > MAX_RESULT_BYTES) {
                throw appearanceError('图片压缩后仍超过 1 MB，请选择尺寸更小或更简单的图片。', 'IMAGE_RESULT_TOO_LARGE');
            }
            throw appearanceError('图片压缩失败，请换一张图片重试。', 'IMAGE_COMPRESS_FAILED');
        } finally {
            decoded.close?.();
        }
    }

    async function loadInternal() {
        const read = readPrefs();
        if (read.prefs) {
            state.themeId = read.prefs.themeId;
            state.coverPosition = read.prefs.coverPosition;
        }
        applyTheme(state.themeId);
        errorMessage = read.error || '';
        try {
            const blob = await readCoverBlob();
            if (blob) {
                const nextUrl = createObjectUrl(blob);
                revokeObjectUrl(coverUrl);
                coverUrl = nextUrl;
                state.coverUrl = nextUrl;
            } else {
                revokeObjectUrl(coverUrl);
                coverUrl = null;
                state.coverUrl = null;
            }
        } catch (error) {
            errorMessage = error instanceof Error ? error.message : '本地封面读取失败，请稍后重试。';
        }
        return publish();
    }

    function load() {
        if (!loadPromise) loadPromise = loadInternal().catch(error => setError(error));
        return loadPromise;
    }

    function setTheme(themeId) {
        if (!THEME_IDS.has(themeId)) return setError(appearanceError('主题选择无效，请重新选择。', 'THEME_INVALID'));
        state.themeId = themeId;
        applyTheme(themeId);
        clearError();
        if (!persistPrefs()) errorMessage = '主题已应用，但当前设备无法保存外观设置。';
        return publish();
    }

    function setCoverPosition(value) {
        state.coverPosition = clampPosition(value);
        clearError();
        if (!persistPrefs()) errorMessage = '封面位置已调整，但当前设备无法保存外观设置。';
        return publish();
    }

    async function setCover(file) {
        clearError();
        publish();
        try {
            const blob = await compressImage(file);
            const nextUrl = createObjectUrl(blob);
            try {
                await writeCoverBlob(blob);
            } catch (error) {
                revokeObjectUrl(nextUrl);
                throw error;
            }
            revokeObjectUrl(coverUrl);
            coverUrl = nextUrl;
            state.coverUrl = nextUrl;
            if (!persistPrefs()) errorMessage = '封面已保存，但当前设备无法保存外观偏好。';
            return publish();
        } catch (error) {
            setError(error);
            throw error;
        }
    }

    async function clearCover() {
        clearError();
        publish();
        try {
            await deleteCoverBlob();
            revokeObjectUrl(coverUrl);
            coverUrl = null;
            state.coverUrl = null;
            return publish();
        } catch (error) {
            setError(error);
            throw error;
        }
    }

    function subscribe(callback) {
        if (typeof callback !== 'function') return () => {};
        subscribers.add(callback);
        try { callback(snapshot()); } catch (_) { /* Ignore subscriber errors. */ }
        return () => subscribers.delete(callback);
    }

    applyTheme(DEFAULT_THEME);
    const api = {
        getSnapshot: snapshot,
        subscribe,
        setTheme,
        setCover,
        clearCover,
        setCoverPosition,
        init: load,
        load,
        themes: THEME_DEFINITIONS,
    };
    global.XingyuePhoneAppearance = Object.freeze(api);
    void load();
})(window);
