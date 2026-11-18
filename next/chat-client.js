(function () {
    const DEFAULT_BASE_URL = 'http://127.0.0.1:8765';
    // Formal host chat already owns this authenticated route. Video is an
    // optional field on the same request; do not introduce a second provider
    // endpoint that would bypass the existing desktop allow-list.
    const UNIFIED_CHAT_PATH = '/api/chat/completions';
    const UNIFIED_CANCEL_PATH = '/api/chat/cancel';
    const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

    const request = async ({ url, headers, payload, signal }) => {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
            signal
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `请求失败（HTTP ${response.status}）`);
        }
        return response;
    };

    const readMessage = (data) => {
        const message = data?.choices?.[0]?.message;
        return {
            content: message?.content || '',
            reasoningContent: message?.reasoning_content || '',
            message,
            finishReason: data?.choices?.[0]?.finish_reason || ''
        };
    };

    const readStreamLine = (line) => {
        const trimmed = (line || '').trim();
        if (!trimmed.startsWith('data: ') || trimmed === 'data: [DONE]') return null;
        try {
            const data = JSON.parse(trimmed.slice(6));
            const delta = data?.choices?.[0]?.delta;
            return delta ? {
                content: delta.content || '',
                reasoningContent: delta.reasoning_content || ''
            } : null;
        } catch {
            return null;
        }
    };

    const isAbortError = (error) => error?.name === 'AbortError';

    const createAbortError = () => Object.assign(new Error('统一模型请求已停止'), { name: 'AbortError', code: 'UNIFIED_CANCELLED' });
    const checkAbort = signal => {
        if (signal?.aborted) throw createAbortError();
    };

    const normalizeResponseError = (response, data) => {
        const body = data && typeof data === 'object' ? data : {};
        const raw = body.error;
        const message = typeof raw === 'string'
            ? raw
            : raw?.message || body.message || `统一模型请求失败（HTTP ${response?.status || '连接失败'}）`;
        const error = new Error(String(message));
        error.name = response?.status === 499 || body.code === 'UNIFIED_CANCELLED' ? 'AbortError' : 'UnifiedChatError';
        error.code = body.code || raw?.code || '';
        error.status = Number(response?.status) || 0;
        error.serverMessage = String(message);
        return error;
    };

    const readUnifiedMessage = data => {
        const choicesMessage = data?.choices?.[0]?.message;
        return {
            content: String(data?.text ?? choicesMessage?.content ?? ''),
            reasoningContent: String(data?.reasoningContent ?? data?.reasoning_content ?? choicesMessage?.reasoning_content ?? ''),
            message: choicesMessage || data?.message || null,
            finishReason: String(data?.finishReason ?? data?.finish_reason ?? data?.choices?.[0]?.finish_reason ?? ''),
            model: String(data?.model || ''),
            turnCalls: Number.isFinite(Number(data?.turnCalls)) ? Number(data.turnCalls) : undefined,
            transport: String(data?.transport || '')
        };
    };

    // Unified video/chat goes through the host so the video key never reaches the page.
    // The request is intentionally single-shot: a caller may retry explicitly, but this
    // client never falls back or repeats a potentially billable model request.
    const createUnifiedClient = (options = {}) => {
        const desktopRequest = options.desktopRequest || globalThis.xingyueDesktop?.requestLocalAgent;
        const fetchImpl = options.fetchImpl || globalThis.fetch?.bind(globalThis);
        const baseUrl = String(options.baseUrl || globalThis.XingyueAgentClient?.DEFAULT_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
        const chatPath = String(options.chatPath || UNIFIED_CHAT_PATH);
        const cancelPath = String(options.cancelPath || UNIFIED_CANCEL_PATH);
        if (!desktopRequest && typeof fetchImpl !== 'function') throw new Error('统一模型请求模块尚未加载');

        const deviceToken = () => {
            try { return globalThis.localStorage?.getItem('xingyue_host_device_token') || ''; } catch (_) { return ''; }
        };

        const readJson = async response => {
            if (response?.data && typeof response.data === 'object') return response.data;
            if (typeof response?.json === 'function') return response.json().catch(() => ({}));
            return {};
        };

        const post = async (path, body, signal) => {
            checkAbort(signal);
            let response;
            if (desktopRequest) {
                response = await desktopRequest({ path, method: 'POST', body });
                checkAbort(signal);
                const data = await readJson(response);
                if (!response?.ok || data?.ok === false) throw normalizeResponseError(response, data);
                return data;
            }
            let raw;
            try {
                raw = await fetchImpl(`${baseUrl}${path}`, {
                    method: 'POST', cache: 'no-store', signal,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        ...(deviceToken() ? { 'X-Xingyue-Device-Token': deviceToken() } : {})
                    },
                    body: JSON.stringify(body)
                });
            } catch (error) {
                if (error?.name === 'AbortError') throw error;
                throw Object.assign(new Error('统一模型连接失败，请检查电脑主机和设备连接'), { code: 'UNIFIED_NETWORK', cause: error });
            }
            const data = await raw.json().catch(() => ({}));
            if (!raw.ok || data?.ok === false) throw normalizeResponseError(raw, data);
            return data;
        };

        const encodeFile = async (file, signal, onProgress) => {
            checkAbort(signal);
            if (!file || !Number.isFinite(Number(file.size)) || Number(file.size) <= 0) throw new Error('请选择有效的视频文件');
            if (Number(file.size) > MAX_VIDEO_BYTES) throw new Error('视频超过 25 MiB，请先选取更短片段');
            const bytes = new Uint8Array(await file.arrayBuffer());
            checkAbort(signal);
            const blockSize = 96 * 1024;
            const parts = [];
            for (let offset = 0; offset < bytes.length; offset += blockSize) {
                checkAbort(signal);
                const block = bytes.subarray(offset, Math.min(bytes.length, offset + blockSize));
                let binary = '';
                for (let cursor = 0; cursor < block.length; cursor += 8192) {
                    binary += String.fromCharCode(...block.subarray(cursor, Math.min(block.length, cursor + 8192)));
                }
                parts.push(globalThis.btoa(binary));
                onProgress?.({ stage: 'encoding', message: `正在准备视频… ${Math.min(100, Math.round((offset + block.length) / bytes.length * 100))}%` });
                if (offset + blockSize < bytes.length) await new Promise(resolve => setTimeout(resolve, 0));
            }
            checkAbort(signal);
            return parts.join('');
        };

        const chat = async ({ messages = [], text = '', video = null, images = [], tools = undefined, toolChoice = undefined, options: requestOptions = {}, requestId, signal, onProgress } = {}) => {
            const clientRequestId = requestId || globalThis.crypto?.randomUUID?.() || `unified-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            const payload = {
                messages: Array.isArray(messages) ? messages : [],
                ...(tools !== undefined ? { tools } : {}),
                ...(toolChoice !== undefined ? { tool_choice: toolChoice } : {}),
                ...(requestOptions && typeof requestOptions === 'object' ? requestOptions : {})
            };
            const body = {
                // requestId/question/videoBase64 are the formal host route's
                // established wire names; clientRequestId/text remain aliases
                // for newer adapters and make the contract self-describing.
                requestId: clientRequestId,
                clientRequestId,
                question: String(text || ''),
                text: String(text || ''),
                payload,
                images: Array.isArray(images) ? images : []
            };
            if (video) {
                const file = video.file || video;
                const mimeType = String(video.mimeType || file?.type || '').toLowerCase() || (/\.mov$/i.test(file?.name || '') ? 'video/quicktime' : 'video/mp4');
                onProgress?.({ stage: 'receiving', message: '正在把原视频和问题交给统一模型…' });
                body.videoBase64 = await encodeFile(file, signal, onProgress);
                body.videoMimeType = mimeType;
                body.videoName = String(video.name || file?.name || '视频片段').slice(0, 180);
            }
            checkAbort(signal);
            onProgress?.({ stage: 'waiting_upstream_headers', message: video ? '正在等待统一模型读取视频…' : '正在等待统一模型回复…' });

            // Browser fetch cancellation closes the request. Electron IPC needs an explicit
            // cancel message because aborting the renderer Promise cannot cancel main-process work.
            let cancelSent = false;
            const onAbort = () => {
                if (cancelSent) return;
                cancelSent = true;
                void post(cancelPath, { requestId: clientRequestId }).catch(() => {});
            };
            signal?.addEventListener('abort', onAbort, { once: true });
            try {
                const data = await post(chatPath, body, signal);
                checkAbort(signal);
                onProgress?.({ stage: 'completed', message: '统一模型已完成回复' });
                const parsed = readUnifiedMessage(data);
                const hasToolCalls = Array.isArray(parsed.message?.tool_calls) && parsed.message.tool_calls.length > 0;
                if (!parsed.content.trim() && !hasToolCalls) throw Object.assign(new Error('统一模型没有返回可显示正文'), { code: 'UNIFIED_EMPTY_CONTENT' });
                return { ...data, ...parsed, requestId: clientRequestId };
            } finally {
                signal?.removeEventListener('abort', onAbort);
            }
        };

        const cancel = requestId => post(cancelPath, { requestId });
        return Object.freeze({ chat, cancel, readUnifiedMessage, chatPath, cancelPath });
    };

    // OpenAI-compatible adapter used by the existing formal tool loop. It
    // intentionally forces JSON/non-streaming responses so the established
    // assistant tool_call -> tool result -> assistant continuation logic can
    // preserve authorization, Gemini signatures and host-memory searches.
    const createUnifiedRequest = (options = {}) => {
        const client = createUnifiedClient(options);
        const textFromContent = content => Array.isArray(content)
            ? content.filter(part => part?.type === 'text').map(part => String(part.text || '')).join('\n')
            : String(content ?? '');
        const request = async ({ payload = {}, signal, onProgress } = {}) => {
            const messages = Array.isArray(payload?.messages) ? payload.messages : [];
            const latest = [...messages].reverse().find(message => message?.role === 'user');
            const text = textFromContent(latest?.content).trim();
            const data = await client.chat({
                messages,
                text,
                tools: payload?.tools,
                toolChoice: payload?.tool_choice,
                options: { ...payload, stream: false },
                requestId: payload?.requestId,
                signal,
                onProgress
            });
            return {
                ok: true,
                status: 200,
                json: async () => data,
                data
            };
        };
        return Object.freeze({ request, chatPath: client.chatPath, cancelPath: client.cancelPath });
    };

    window.XingyueChatClient = {
        request,
        readMessage,
        readStreamLine,
        readUnifiedMessage,
        isAbortError,
        createUnifiedClient,
        createUnifiedRequest,
        UNIFIED_CHAT_PATH,
        UNIFIED_CANCEL_PATH
    };
})();
