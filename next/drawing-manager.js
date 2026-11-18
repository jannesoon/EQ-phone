(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.XingyueDrawing = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
    const VALID_ASPECT_RATIOS = ['1:1', '16:9', '4:3', '3:2', '2:3', '3:4', '9:16', '21:9'];

    const normalizeAspectRatio = (value, fallback = '1:1') => {
        const candidate = String(value || fallback || '1:1').trim();
        return VALID_ASPECT_RATIOS.includes(candidate) ? candidate : '1:1';
    };

    const normalizeImageEndpoint = (value) => {
        let url = String(value || 'https://api.minimaxi.com/v1/image_generation').trim();
        if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
        url = url.replace('api.minimax.chat', 'api.minimaxi.com');
        if (!url.includes('/image_generation')) url = `${url.replace(/\/$/, '')}/v1/image_generation`;
        return url;
    };

    const buildMinimaxImageRequest = (config, promptValue, aspectRatio) => {
        const key = String(config.key || '').trim();
        const prompt = String(promptValue || '').trim();
        if (!key) throw new Error('未配置 MiniMax Key（设置→通用→画图功能，或复用语音 Key）');
        if (!prompt) throw new Error('画图 prompt 为空（标记里 | 后面没写内容）');
        return {
            url: normalizeImageEndpoint(config.url),
            options: {
                method: 'POST',
                headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: String(config.model || 'image-01').trim() || 'image-01',
                    prompt,
                    aspect_ratio: normalizeAspectRatio(aspectRatio, config.ar),
                    response_format: 'base64',
                    n: 1,
                    prompt_optimizer: true
                })
            }
        };
    };

    const requestMinimaxImage = async (config, prompt, aspectRatio, fetchImpl) => {
        const request = buildMinimaxImageRequest(config, prompt, aspectRatio);
        const runFetch = fetchImpl || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
        if (!runFetch) throw new Error('当前环境无法连接图片服务');
        const response = await runFetch(request.url, request.options);
        if (!response.ok) {
            let detail = '';
            try {
                const payload = await response.json();
                detail = (payload.base_resp && payload.base_resp.status_msg) || JSON.stringify(payload).slice(0, 200);
            } catch (_) {}
            throw new Error(`MiniMax 返回 ${response.status}${detail ? `：${detail}` : ''}`);
        }
        const payload = await response.json();
        if (payload.base_resp && payload.base_resp.status_code !== 0) {
            throw new Error(`MiniMax 业务错误 ${payload.base_resp.status_code}：${payload.base_resp.status_msg || '未知'}`);
        }
        const base64 = payload.data && Array.isArray(payload.data.image_base64) && payload.data.image_base64[0];
        if (!base64) throw new Error('MiniMax 响应里没有图片数据');
        return `data:image/jpeg;base64,${base64}`;
    };

    const extractSvgDrawBlocks = (value) => {
        const blocks = [];
        const text = String(value || '').replace(/(?:\[\[|【)DRAW[:：]([^|\]】]*)(?:\||｜)([\s\S]*?)(?:\]\]|】)/g, (_, title, svg) => {
            blocks.push({ title: String(title || '').trim(), svg: String(svg || '').trim() });
            return `\x01DRAW${blocks.length - 1}\x01`;
        });
        return { text, blocks };
    };

    const extractLegacyImageBlocks = (value) => {
        const blocks = [];
        const text = String(value || '').replace(/(?:\[\[|【)IMG[:：]([^|\]】]*)(?:\||｜)([\s\S]*?)(?:\]\]|】)/g, (_, desc, prompt) => {
            blocks.push({ desc: String(desc || '').trim(), prompt: String(prompt || '').trim() });
            return `\x01IMG${blocks.length - 1}\x01`;
        });
        return { text, blocks };
    };

    const extractGeneratedImageBlocks = (value) => {
        const blocks = [];
        const text = String(value || '').replace(/(?:\[\[|【)IMGGEN[:：]([^|\]】]*)(?:\||｜)([^|\]】]*)(?:\||｜)([^|\]】]*)(?:(?:\||｜)([^\]】]*))?(?:\]\]|】)/g, (_, desc, imgId, encodedPrompt, ar) => {
            blocks.push({
                desc: String(desc || '').trim(),
                imgId: String(imgId || '').trim(),
                encPrompt: String(encodedPrompt || '').trim(),
                ar: String(ar || '').trim()
            });
            return `\x01IMGGEN${blocks.length - 1}\x01`;
        });
        return { text, blocks };
    };

    const findImageGenerationMarkers = (value) => {
        const matches = [];
        const expression = /(?:\[\[|【)IMG[:：]([^|\]】]*)(?:\||｜)([\s\S]*?)(?:\]\]|】)/g;
        const text = String(value || '');
        let match;
        while ((match = expression.exec(text)) !== null) {
            let prompt = String(match[2] || '').trim();
            let ar = '';
            const arMatch = prompt.match(/^([\s\S]*?)(?:\||｜)\s*ar\s*=\s*([\d]+:[\d]+)\s*$/);
            if (arMatch) {
                prompt = arMatch[1].trim();
                ar = normalizeAspectRatio(arMatch[2]);
            }
            const desc = String(match[1] || '').trim();
            matches.push({ full: match[0], desc, prompt: prompt || desc, ar });
        }
        return matches;
    };

    const createGeneratedImageTag = ({ desc, imgId, prompt, ar }) =>
        `[[IMGGEN:${String(desc || '').trim()}|${String(imgId || '').trim()}|${encodeURIComponent(String(prompt || '').trim())}${ar ? `|${normalizeAspectRatio(ar)}` : ''}]]`;

    const safeDecodePrompt = (value) => {
        try { return decodeURIComponent(String(value || '')); }
        catch (_) { return String(value || ''); }
    };

    const createImageStore = ({ openDatabase, storeName = 'images' }) => ({
        put: async (record) => {
            const db = await openDatabase();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(storeName, 'readwrite');
                transaction.objectStore(storeName).put(record);
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            });
        },
        get: async (id) => {
            const db = await openDatabase();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(storeName, 'readonly');
                const request = transaction.objectStore(storeName).get(id);
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => reject(request.error);
            });
        }
    });

    return {
        VALID_ASPECT_RATIOS,
        normalizeAspectRatio,
        normalizeImageEndpoint,
        buildMinimaxImageRequest,
        requestMinimaxImage,
        extractSvgDrawBlocks,
        extractLegacyImageBlocks,
        extractGeneratedImageBlocks,
        findImageGenerationMarkers,
        createGeneratedImageTag,
        safeDecodePrompt,
        createImageStore
    };
});
