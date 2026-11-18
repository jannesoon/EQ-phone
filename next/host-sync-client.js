(function initXingyueHostSync(global) {
    'use strict';

    const mobileRuntime = global.XINGYUE_MOBILE_RUNTIME && typeof global.XINGYUE_MOBILE_RUNTIME === 'object'
        ? global.XINGYUE_MOBILE_RUNTIME
        : null;
    const runtimeAgentBase = String(mobileRuntime?.agentBase || '').trim();
    const BASE_URL = String(runtimeAgentBase || (global.location?.hostname === 'desktop-8i3jek4.taild484c1.ts.net'
        ? global.location.origin
        : 'http://127.0.0.1:8765')).replace(/\/+$/, '');
    const manualHandoff = mobileRuntime?.manualHandoff === true;
    const desktopRequest = typeof global.xingyueDesktop?.requestLocalAgent === 'function'
        ? global.xingyueDesktop.requestLocalAgent
        : null;
    const queue = global.XingyueSyncQueue?.createQueue();
    const sessionTimers = new Map();
    let collectionsTimer = null;
    let flushing = null;
    let syncSuspendedUntil = 0;
    let offlineContinuationActive = false;
    const requestTimeoutMs = Math.max(1000, Number(global.__XINGYUE_SYNC_TIMEOUT_MS__) || 15000);
    const hasExplicitRequestTimeout = Number.isFinite(Number(global.__XINGYUE_SYNC_TIMEOUT_MS__)) && Number(global.__XINGYUE_SYNC_TIMEOUT_MS__) > 0;
    const MIN_UPLOAD_TIMEOUT_MS = 2 * 60 * 1000;
    const MAX_UPLOAD_TIMEOUT_MS = 30 * 60 * 1000;
    const SLOW_UPLOAD_BYTES_PER_SECOND = 32 * 1024;
    const queueOperationTimeoutMs = Math.max(500, Number(global.__XINGYUE_QUEUE_TIMEOUT_MS__) || 8000);
    const localRole = desktopRequest ? 'desktop' : 'device';
    let state = { state: desktopRequest ? 'readonly' : 'checking', label: desktopRequest ? '主机数据：电脑只读 · 等待交接' : '主机数据：正在核对主机', writer: null, lastSavedAt: null, pendingCount: 0, conflictCount: queue?.getConflicts().length || 0 };

    const publish = next => {
        state = { ...state, ...next };
        if (typeof global.dispatchEvent === 'function' && typeof global.CustomEvent === 'function') {
            global.dispatchEvent(new global.CustomEvent('xingyue-host-sync-status', { detail: state }));
        }
        return state;
    };

    const queueOperation = (factory, label) => new Promise((resolve, reject) => {
        const timeoutId = global.setTimeout?.(() => reject(new Error(`${label}超时，待补传内容仍保留在本机`)), queueOperationTimeoutMs);
        Promise.resolve().then(factory).then(resolve, reject).finally(() => {
            if (timeoutId != null) global.clearTimeout?.(timeoutId);
        });
    });

    const getDeviceToken = () => {
        try { return global.localStorage?.getItem('xingyue_host_device_token') || ''; } catch (_) { return ''; }
    };

    const prepareRequestBody = async body => {
        const json = JSON.stringify(body);
        if (json.length < 256 * 1024 || typeof global.CompressionStream !== 'function' || typeof global.Blob !== 'function' || typeof global.Response !== 'function') {
            return { body: json, headers: {} };
        }
        try {
            const compressedStream = new global.Blob([json], { type: 'application/json' })
                .stream()
                .pipeThrough(new global.CompressionStream('gzip'));
            const compressed = await new global.Response(compressedStream).arrayBuffer();
            return { body: compressed, headers: { 'Content-Encoding': 'gzip' } };
        } catch (error) {
            console.warn('[星月舱] 同步压缩不可用，改用兼容传输', error);
            return { body: json, headers: {} };
        }
    };

    const request = async (path, body) => {
        if (desktopRequest) return desktopRequest({ path, method: body === undefined ? 'GET' : 'POST', body });
        const deviceToken = getDeviceToken();
        const controller = typeof global.AbortController === 'function' ? new global.AbortController() : null;
        let timeoutId = null;
        try {
            const prepared = body === undefined ? { body: undefined, headers: {} } : await prepareRequestBody(body);
            const payloadBytes = typeof prepared.body === 'string'
                ? prepared.body.length * 2
                : Number(prepared.body?.byteLength || 0);
            const effectiveTimeoutMs = body === undefined || hasExplicitRequestTimeout
                ? requestTimeoutMs
                : Math.max(requestTimeoutMs, Math.min(MAX_UPLOAD_TIMEOUT_MS, MIN_UPLOAD_TIMEOUT_MS + Math.ceil(payloadBytes / SLOW_UPLOAD_BYTES_PER_SECOND) * 1000));
            const fetchPromise = global.fetch(`${BASE_URL}${path}`, {
                method: body === undefined ? 'GET' : 'POST',
                cache: 'no-store',
                headers: {
                    ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
                    ...prepared.headers,
                    ...(deviceToken ? { 'X-Xingyue-Device-Token': deviceToken } : {})
                },
                body: prepared.body,
                ...(controller ? { signal: controller.signal } : {})
            });
            const timeoutPromise = new Promise((_, reject) => {
                timeoutId = global.setTimeout?.(() => {
                    controller?.abort();
                    reject(new Error('主机响应超时，内容已保留并会使用原操作编号重试'));
                }, effectiveTimeoutMs);
            });
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
        } catch (error) {
            if (controller?.signal?.aborted && !/原操作编号重试/.test(String(error?.message || ''))) throw new Error('主机响应超时，内容已保留并会使用原操作编号重试');
            throw error;
        } finally {
            if (timeoutId != null) global.clearTimeout?.(timeoutId);
        }
    };

    const stripInlineImageData = value => String(value ?? '')
        .replace(/!\[[^\]]*\]\(data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/_=\r\n-]+\)/gi, '【图片】')
        .replace(/data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/_=\r\n-]+/gi, '【图片】');
    const sanitizeSessionValueForSync = value => {
        if (typeof value === 'string') return stripInlineImageData(value);
        if (Array.isArray(value)) return value.map(sanitizeSessionValueForSync);
        if (!value || typeof value !== 'object') return value;
        const hadAttachments = Array.isArray(value.attachments) && value.attachments.length > 0;
        const sanitized = {};
        for (const [key, nested] of Object.entries(value)) {
            if (key === 'attachments') continue;
            sanitized[key] = sanitizeSessionValueForSync(nested);
        }
        if (hadAttachments) {
            const content = typeof sanitized.content === 'string' ? sanitized.content.trimEnd() : '';
            sanitized.content = content.includes('【图片】') ? content : `${content}${content ? '\n\n' : ''}【图片】`;
        }
        return sanitized;
    };
    const sessionPayloadForSync = session => sanitizeSessionValueForSync(session);
    const bodyFor = item => ({
        ...item.payload,
        ...(item.kind === 'session' && item.payload?.session ? { session: sessionPayloadForSync(item.payload.session) } : {}),
        sync: {
            operationId: item.operationId,
            resourceId: item.resourceId,
            baseRevision: item.baseRevision,
            clientUpdatedAt: item.updatedAt
        }
    });

    const SESSION_TAIL_MESSAGE_LIMIT = 24;
    const MAX_RECOVERY_TAIL_MESSAGES = 256;
    const projectTailMessageForSync = message => {
        const sanitized = sanitizeSessionValueForSync(message || {});
        const projected = {
            role: String(sanitized.role || ''),
            content: String(sanitized.content || '')
        };
        for (const key of ['id', 'timestamp', 'timestampRaw', 'modelName']) {
            if (sanitized[key] !== undefined && sanitized[key] !== null) projected[key] = sanitized[key];
        }
        if (typeof sanitized.displayContent === 'string' && sanitized.displayContent !== projected.content) {
            projected.displayContent = sanitized.displayContent;
        }
        return projected;
    };
    const requestSessionDelta = async item => {
        const session = item?.payload?.session;
        const localMessages = Array.isArray(session?.messages) ? session.messages : null;
        // 已存在的窗口一律先发最近尾段。主机没有该窗口时，接口会明确返回
        // missingHostSession，再回退到首次整窗上传；不再用压缩后的大小猜测发送方式。
        if (!session?.id || !localMessages || localMessages.length < 4) return null;
        const sanitizedSession = sessionPayloadForSync(session);
        const { messages: _messages, hostRevision: _hostRevision, ...sessionMeta } = sanitizedSession;
        const sendTail = limit => request('/api/sync/session/tail', {
            sessionId: String(session.id),
            tailMessages: sanitizedSession.messages.slice(-limit).map(projectTailMessageForSync),
            sessionMeta,
            sync: bodyFor(item).sync
        });
        const hasRewriteEvidence = localMessages.some((message, index) => {
            const variants = Array.isArray(message?.variants) ? message.variants : [];
            const selected = Number(message?.currentVariantIndex);
            if (variants.length < 2 || !Number.isInteger(selected) || selected < 0 || selected >= variants.length) return false;
            if (message.role === 'user') return variants.some((variant, variantIndex) => variantIndex !== selected && Array.isArray(variant?.futureMessages));
            // 主机可能仍停在这条旧回复，而手机选择新版本后已继续聊天；
            // 是否确属这种安全前向分支由主机用完整旧版本证据再次核验。
            return ['model', 'assistant'].includes(message.role);
        });
        const tryVerifiedRewrite = response => response.status === 412 && response.data?.tailMergeRequired === true && hasRewriteEvidence
            ? request('/api/sync/session/rewrite', bodyFor(item))
            : response;
        const first = await sendTail(SESSION_TAIL_MESSAGE_LIMIT);
        if (first.status !== 412 || first.data?.tailMergeRequired !== true) return first;
        const hostEnd = first.data?.hostAnchorMessageCount;
        // 主机有效基线少于三个消息时，尾段接口没有可用的安全锚点；
        // 回退到完整同步，让主机用完整消息对象前缀核验决定快进或保留冲突。
        if (Number.isSafeInteger(hostEnd) && hostEnd < 3) return request(item.path, bodyFor(item));
        if (!Number.isSafeInteger(hostEnd) || hostEnd >= localMessages.length) return tryVerifiedRewrite(first);
        // 主机落后超过 21 条时，固定 24 条尾段不含共同锚点。仅补发缺口和
        // 最多 12 条旧锚点；服务端仍逐条验证，真正分叉继续保留在本机队列。
        const recoveryLimit = Math.max(SESSION_TAIL_MESSAGE_LIMIT, localMessages.length - hostEnd + 12);
        if (recoveryLimit <= SESSION_TAIL_MESSAGE_LIMIT || recoveryLimit > MAX_RECOVERY_TAIL_MESSAGES) return tryVerifiedRewrite(first);
        return tryVerifiedRewrite(await sendTail(recoveryLimit));
    };
    const requestQueuedItem = async item => {
        if (item.kind === 'session') {
            const tailResponse = await requestSessionDelta(item);
            if (tailResponse && !(tailResponse.status === 404 && tailResponse.data?.missingHostSession)) return tailResponse;
        }
        return request(item.path, bodyFor(item));
    };

    const isLocalWriter = () => {
        const writer = state.writer;
        // 主机离线时，手机必须仍能把聊天安全写进本地队列；重连后再按版本关系合并。
        if (localRole === 'device' && (state.state === 'offline' || offlineContinuationActive)) return true;
        // iPhone 从 Safari“添加到主屏幕”后会得到新的 localStorage / IndexedDB 容器。
        // 在设备身份和主机基线核对完成前，绝不能把新容器的空白默认状态当成真实修改上传。
        if (!writer) return localRole === 'device' && !['checking', 'unpaired'].includes(state.state);
        if (writer.type !== localRole) return false;
        if (localRole === 'desktop') return true;
        const localDeviceId = (() => { try { return JSON.parse(global.localStorage?.getItem('xingyue_host_device_info') || 'null')?.id || null; } catch (_) { return null; } })();
        return !writer.id || !localDeviceId || writer.id === localDeviceId;
    };

    const flushQueue = async () => {
        if (Date.now() < syncSuspendedUntil) return state;
        if (!isLocalWriter()) return publish({ state: 'readonly', label: `主机数据：当前由${state.writer?.type === 'desktop' ? '电脑' : '手机'}继续`, reason: '如需在本设备发送，请先同步最新消息并完成交接' });
        if (!queue) return publish({ state: 'offline', label: '主机数据：当前浏览器不支持离线队列', reason: 'IndexedDB 队列模块未加载' });
        if (flushing) return flushing;
        flushing = (async () => {
            const initial = await queueOperation(() => queue.list(), '读取待补传队列');
            if (!initial.length) {
                const conflictCount = queue.getConflicts().length;
                return publish(conflictCount
                    ? { state: 'conflict', label: `主机数据：有 ${conflictCount} 个冲突待确认`, pendingCount: 0, conflictCount }
                    : { pendingCount: 0, conflictCount: 0 });
            }
            publish({ state: 'saving', label: `主机数据：正在补传 ${initial.length} 项…`, pendingCount: initial.length });
            let completed = 0;
            let reclaimedForOfflineQueue = false;
            for (const original of initial) {
                // 不在发送前把整条会话/附件重新写回 IndexedDB。大记录在异常重启后可能卡在这次
                // 非必要的 put，导致真正的网络请求永远没有发出。尝试信息只保留在本轮内存中；
                // operationId 不变，服务端仍可安全识别已提交过的重试。
                let item = { ...original, attempts: Number(original.attempts || 0) + 1, lastAttemptAt: new Date().toISOString() };
                // 图片本体只留在发送设备的本地图片仓；跨设备仅由会话正文里的【图片】占位表示。
                // 旧版本已经排队的附件也在这里本地确认，避免升级后继续上传 Base64 大块头。
                if (item.kind === 'attachment') {
                    await queueOperation(() => queue.acknowledge(item, null), '清理旧图片补传项');
                    completed += 1;
                    continue;
                }
                let response;
                try {
                    response = await requestQueuedItem(item);
                } catch (error) {
                    const pendingCount = await queueOperation(() => queue.pendingCount(), '统计待补传内容').catch(() => initial.length - completed);
                    publish({ state: 'queued', label: `主机数据：已离线保存 ${pendingCount} 项`, pendingCount, reason: error?.message || '主机暂不可用' });
                    break;
                }
                if (response.status === 401 || response.status === 403) {
                    const pendingCount = await queueOperation(() => queue.pendingCount(), '统计待补传内容').catch(() => initial.length - completed);
                    publish({ state: 'unpaired', label: `主机数据：${pendingCount} 项等待设备配对`, pendingCount, reason: response.data?.error || '设备尚未配对' });
                    break;
                }
                if (response.status === 423 && response.data?.writerRequired) {
                    if (localRole === 'device' && !manualHandoff && !reclaimedForOfflineQueue) {
                        try {
                            const handoff = await request('/api/sync/handoff', {});
                            if (handoff.ok && handoff.data?.writer?.type === 'device') {
                                reclaimedForOfflineQueue = true;
                                publish({ state: 'saving', label: `主机数据：主机已恢复，正在合并 ${initial.length} 项离线内容…`, writer: handoff.data.writer, pendingCount: initial.length });
                                response = await requestQueuedItem(item);
                            }
                        } catch (_) {}
                    }
                    if (response.status === 423 && response.data?.writerRequired) {
                        return publish({ state: 'readonly', label: `主机数据：当前由${response.data.writer?.type === 'desktop' ? '电脑' : '手机'}继续`, writer: response.data.writer || state.writer, reason: response.data.error || '请先完成设备交接' });
                    }
                }
                if (response.status === 400 && response.data?.error === '同一同步操作编号携带了不同内容') {
                    // 升级可能只改变传输表示（例如把图片 Base64 换成【图片】），而 IndexedDB
                    // 仍保留旧 operationId。服务端正确地拒绝“同编号、不同内容”；这里只对这条
                    // 明确错误换新编号，并立即重试当前最新队列项，不清空聊天和其他待传内容。
                    const renewed = await queueOperation(() => queue.renewOperation(item), '更新旧补传编号');
                    if (renewed) {
                        item = renewed;
                        publish({ state: 'saving', label: `主机数据：正在修复旧补传编号并继续 ${initial.length - completed} 项…`, pendingCount: initial.length - completed });
                        response = await requestQueuedItem(renewed);
                    }
                }
                if (response.status === 409 && response.data?.conflict) {
                    await queueOperation(() => queue.recordConflict(item, response.data.conflict), '保存同步冲突');
                    completed += 1;
                    continue;
                }
                if (!response.ok || !response.data?.accepted) {
                    const pendingCount = await queueOperation(() => queue.pendingCount(), '统计待补传内容').catch(() => initial.length - completed);
                    publish({ state: 'queued', label: `主机数据：已保留 ${pendingCount} 项待重试`, pendingCount, reason: response.data?.error || `HTTP ${response.status}` });
                    break;
                }
                await queueOperation(() => queue.acknowledge(item, response.data.result?.revision), '确认补传结果');
                completed += 1;
            }
            const pendingCount = await queueOperation(() => queue.pendingCount(), '统计待补传内容').catch(() => Math.max(0, initial.length - completed));
            const conflictCount = queue.getConflicts().length;
            if (reclaimedForOfflineQueue) {
                global.setTimeout?.(() => global.dispatchEvent?.(new global.CustomEvent('xingyue-host-reconciled')), 0);
            }
            if (!pendingCount) offlineContinuationActive = false;
            if (conflictCount) return publish({ state: 'conflict', label: `主机数据：离线内容已保留 · 有 ${conflictCount} 个分叉待确认`, pendingCount, conflictCount, lastSavedAt: completed ? new Date().toISOString() : state.lastSavedAt });
            if (pendingCount) return state;
            return publish({ state: 'saved', label: completed ? `主机数据：补传完成（${completed} 项）` : '主机数据：已保存', pendingCount: 0, conflictCount: 0, lastSavedAt: new Date().toISOString(), reason: '' });
        })().catch(async error => {
            const pendingCount = await queueOperation(() => queue.pendingCount(), '统计待补传内容').catch(() => state.pendingCount || 0);
            return publish({ state: 'queued', label: `主机数据：已保留 ${pendingCount} 项待重试`, pendingCount, reason: error?.message || '补传意外中断' });
        }).finally(() => { flushing = null; });
        return flushing;
    };

    const enqueue = async operation => {
        if (Date.now() < syncSuspendedUntil) return null;
        if (localRole === 'device' && state.state === 'offline') offlineContinuationActive = true;
        if (!isLocalWriter()) {
            if (localRole === 'device' && ['checking', 'unpaired'].includes(state.state)) {
                publish({
                    state: state.state,
                    label: state.state === 'unpaired' ? '主机数据：等待设备配对' : '主机数据：正在核对主机',
                    reason: state.state === 'unpaired' ? '完成配对并读取主机资料前，不会上传本机空白默认数据' : '读取主机资料前暂不允许写入'
                });
                return null;
            }
            publish({ state: 'readonly', label: `主机数据：当前由${state.writer?.type === 'desktop' ? '电脑' : '手机'}继续`, reason: '本设备的本地内容不会回写主机，直到明确交接' });
            return null;
        }
        if (!queue) {
            publish({ state: 'offline', label: '主机数据：离线队列不可用', reason: '同步队列模块未加载' });
            return null;
        }
        let item;
        try {
            item = await queueOperation(() => queue.enqueue(operation), '写入待补传队列');
        } catch (queueError) {
            // iOS 的 IndexedDB 可能因配额、后台挂起或事务损坏而拒绝队列写入。
            // 在线时用同一套尾段协议直接提交；离线时明确告警，绝不继续显示“已保存”。
            const resourceKey = String(operation.resourceKey || `${operation.kind}:${operation.resourceId}`);
            const directItem = {
                ...operation,
                resourceKey,
                operationId: `${Date.now().toString(36)}-direct-${Math.random().toString(36).slice(2, 10)}`,
                baseRevision: queue.getRevision(resourceKey),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                attempts: 1
            };
            publish({ state: 'saving', label: '主机数据：本机队列异常，正在直接保存…', pendingCount: 1, reason: queueError?.message || '离线队列写入失败' });
            try {
                const response = await requestQueuedItem(directItem);
                if (response.status === 409 && response.data?.conflict) {
                    await queue.recordConflict(directItem, response.data.conflict).catch(() => {});
                    publish({ state: 'conflict', label: '主机数据：直接保存发现分叉，已保留待确认', pendingCount: 0, conflictCount: 1, reason: response.data.conflict.message || '' });
                    return directItem;
                }
                if (!response.ok || !response.data?.accepted) throw new Error(response.data?.error || `HTTP ${response.status}`);
                if (response.data.result?.revision) queue.setRevision(resourceKey, response.data.result.revision);
                publish({ state: 'saved', label: '主机数据：已直接保存（本机队列待修复）', pendingCount: 0, conflictCount: 0, lastSavedAt: new Date().toISOString(), reason: '' });
                return directItem;
            } catch (directError) {
                publish({ state: 'offline', label: '主机数据：本机队列写入失败，请勿刷新并立即导出', pendingCount: 1, reason: directError?.message || queueError?.message || '消息尚未保存到主机' });
                throw directError;
            }
        }
        const pendingCount = await queue.pendingCount();
        publish({ state: 'queued', label: `主机数据：已安全排队 ${pendingCount} 项`, pendingCount });
        void flushQueue();
        return item;
    };

    const syncSession = (session, options = {}) => {
        if (!session?.id) return Promise.resolve(null);
        const id = String(session.id);
        if (sessionTimers.has(id)) clearTimeout(sessionTimers.get(id));
        const run = () => {
            sessionTimers.delete(id);
            // 离线队列本身也只保留跨设备所需的文字和【图片】标记。
            // 原图仍在发送设备的聊天仓，不随重试次数复制进补传队列。
            return enqueue({ kind: 'session', resourceKey: `session:${id}`, resourceId: id, path: '/api/sync/session', payload: { session: sessionPayloadForSync(session) } });
        };
        if (options.immediate || localRole === 'device') return run();
        sessionTimers.set(id, setTimeout(() => void run(), 700));
        return Promise.resolve(null);
    };

    const syncCollections = (collections, options = {}) => {
        if (collectionsTimer) clearTimeout(collectionsTimer);
        const run = () => {
            collectionsTimer = null;
            void enqueue({ kind: 'collections', resourceKey: 'collections:singleton', resourceId: 'singleton', path: '/api/sync/collections', payload: { collections } });
        };
        if (options.immediate) run();
        else collectionsTimer = setTimeout(run, 900);
    };

    const deleteSession = id => {
        const key = String(id || '');
        if (!key) return Promise.resolve(null);
        if (sessionTimers.has(key)) clearTimeout(sessionTimers.get(key));
        sessionTimers.delete(key);
        return enqueue({ kind: 'session-delete', resourceKey: `session:${key}`, resourceId: key, path: '/api/sync/session/delete', payload: { id: key } });
    };

    const syncAttachment = attachment => {
        return Promise.resolve(null);
    };

    const refreshStatus = async () => {
        if (isLocalWriter()) await flushQueue();
        const pendingBeforeStatus = Number(await queue?.pendingCount() || 0);
        // 新启动时必须先核对主机写入者；否则一个带旧队列的独立 iPhone 容器会因
        // pendingCount > 0 永远跳过状态请求，既无法交接，也无法安全补传。
        if (pendingBeforeStatus > 0 && !['checking', 'unpaired'].includes(state.state)) return state;
        try {
            const response = await request('/api/sync/status');
            if (response.status === 401 || response.status === 403) return publish({ state: 'unpaired', label: '主机数据：等待设备配对', reason: response.data?.error || '' });
            if (!response.ok || !response.data?.ok) throw new Error(response.data?.error || `HTTP ${response.status}`);
            const writer = response.data.sync?.writer || null;
            state = { ...state, writer };
            if (pendingBeforeStatus > 0 && isLocalWriter()) return flushQueue();
            const conflictCount = Math.max(Number(response.data.sync?.conflictCount || 0), queue?.getConflicts().length || 0);
            if (conflictCount) return publish({ state: 'conflict', label: `主机数据：有 ${conflictCount} 个冲突待确认`, conflictCount, pendingCount: 0 });
            if (!isLocalWriter()) return publish({ state: 'readonly', label: `主机数据：当前由${writer?.type === 'desktop' ? '电脑' : '手机'}继续`, writer, pendingCount: 0, conflictCount: 0, reason: '点击交接按钮后才会在本设备继续写入' });
            return publish(response.data.sync?.saved
                ? { state: 'saved', label: `主机数据：已保存 · 当前在${localRole === 'desktop' ? '电脑' : '手机'}继续`, writer, lastSavedAt: response.data.sync.lastSavedAt, pendingCount: 0, conflictCount: 0, reason: '' }
                : { state: 'idle', label: `主机数据：等待保存 · 当前在${localRole === 'desktop' ? '电脑' : '手机'}继续`, writer, lastSavedAt: null, pendingCount: 0, conflictCount: 0, reason: '' });
        } catch (error) {
            return publish({ state: 'offline', label: '主机数据：等待主机恢复', reason: error?.message || '主机暂不可用' });
        }
    };

    const acceptHost2Conflicts = async () => {
        const response = await request('/api/sync/conflicts/resolve', { resolution: 'host-2.0' });
        if (!response.ok || !response.data?.accepted) throw new Error(response.data?.error || '冲突确认失败');
        // “按主机确认”必须真的把主机快照带回本设备。只清冲突和改基线会让
        // 手机继续保留旧分支，下一次保存时同一个冲突会再次出现。
        await beginRestore(15000);
        const restored = await request('/api/sync/handoff', {});
        if (!restored.ok || !restored.data?.data) {
            syncSuspendedUntil = 0;
            throw new Error(restored.data?.error || '冲突已归档，但无法读取主机最新版');
        }
        const data = restored.data.data;
        const sessions = Array.isArray(data.sessions) ? data.sessions : [];
        for (const session of sessions) {
            if (session?.id && session?.hostRevision) queue?.setRevision(`session:${session.id}`, session.hostRevision);
        }
        const revision = data?.collections?.hostRevision || data?.sync?.collectionsRevision || response.data.result?.collectionsRevision || response.data.sync?.collectionsRevision;
        if (revision) queue?.setRevision('collections:singleton', revision);
        syncSuspendedUntil = 0;
        publish({ state: 'saved', label: '主机数据：已按2.0恢复到本设备', writer: restored.data.writer, pendingCount: 0, conflictCount: 0, lastSavedAt: data?.sync?.lastSavedAt || new Date().toISOString(), reason: '' });
        return data;
    };

    const beginRestore = async (durationMs = 5000) => {
        syncSuspendedUntil = Date.now() + Math.max(1000, Number(durationMs || 5000));
        for (const timer of sessionTimers.values()) clearTimeout(timer);
        sessionTimers.clear();
        if (collectionsTimer) clearTimeout(collectionsTimer);
        collectionsTimer = null;
        await queue?.clearPending?.();
        queue?.clearConflicts();
    };

    const adoptHostData = async data => {
        await beginRestore();
        const sessions = Array.isArray(data?.sessions) ? data.sessions : [];
        for (const session of sessions) {
            if (session?.id && session?.hostRevision) queue?.setRevision(`session:${session.id}`, session.hostRevision);
        }
        const collectionsRevision = data?.collections?.hostRevision || data?.sync?.collectionsRevision;
        if (collectionsRevision) queue?.setRevision('collections:singleton', collectionsRevision);
        return publish({ state: 'saved', label: '主机数据：已恢复到本设备', pendingCount: 0, conflictCount: 0, lastSavedAt: new Date().toISOString(), reason: '' });
    };

    const claimWritingTurn = async () => {
        const pendingBeforeHandoff = Number(await queue?.pendingCount?.() || 0);
        if (!pendingBeforeHandoff) await beginRestore(15000);
        const response = await request('/api/sync/handoff', {});
        if (!response.ok || !response.data?.data) {
            syncSuspendedUntil = 0;
            throw new Error(response.data?.error || '设备交接失败');
        }
        const data = response.data.data;
        if (pendingBeforeHandoff) {
            publish({ state: 'saving', label: `主机数据：交接完成，正在先合并 ${pendingBeforeHandoff} 项本地内容…`, writer: response.data.writer, pendingCount: pendingBeforeHandoff });
            await flushQueue();
            const refreshed = await request('/api/sync/handoff', {});
            if (!refreshed.ok || !refreshed.data?.data) throw new Error(refreshed.data?.error || '本地内容补传后无法重新读取主机');
            response.data = refreshed.data;
        }
        const finalData = response.data.data;
        const sessions = Array.isArray(finalData.sessions) ? finalData.sessions : [];
        for (const session of sessions) {
            if (session?.id && session?.hostRevision) queue?.setRevision(`session:${session.id}`, session.hostRevision);
        }
        const collectionsRevision = finalData?.collections?.hostRevision || finalData?.sync?.collectionsRevision;
        if (collectionsRevision) queue?.setRevision('collections:singleton', collectionsRevision);
        syncSuspendedUntil = 0;
        publish({ state: 'saved', label: `主机数据：交接完成 · 当前在${localRole === 'desktop' ? '电脑' : '手机'}继续`, writer: response.data.writer, pendingCount: 0, conflictCount: 0, lastSavedAt: data?.sync?.lastSavedAt || new Date().toISOString(), reason: '' });
        return finalData;
    };

    const adoptHostBaseline = async data => {
        const sessions = Array.isArray(data?.sessions) ? data.sessions : [];
        for (const session of sessions) {
            if (session?.id && session?.hostRevision) queue?.setRevision(`session:${session.id}`, session.hostRevision);
        }
        const collectionsRevision = data?.collections?.hostRevision || data?.sync?.collectionsRevision;
        if (collectionsRevision) queue?.setRevision('collections:singleton', collectionsRevision);
        return publish({ state: 'saved', label: '主机数据：手机新增内容已同步到电脑', pendingCount: 0, conflictCount: 0, lastSavedAt: data?.sync?.lastSavedAt || new Date().toISOString(), reason: '' });
    };

    const hasLocalChanges = async () => Boolean(sessionTimers.size || collectionsTimer || flushing || (await queue?.pendingCount?.()) > 0);

    const completeAuthoritativeRestore = async (sessions, collections) => {
        const waitMs = Math.max(0, syncSuspendedUntil - Date.now() + 50);
        if (waitMs) await new Promise(resolveWait => setTimeout(resolveWait, waitMs));
        syncSuspendedUntil = 0;
        for (const session of Array.isArray(sessions) ? sessions : []) {
            if (!session?.id) continue;
            const id = String(session.id);
            await queue?.enqueue({ kind: 'session', resourceKey: `session:${id}`, resourceId: id, path: '/api/sync/session', payload: { session: sessionPayloadForSync(session) } });
        }
        if (collections) await queue?.enqueue({ kind: 'collections', resourceKey: 'collections:singleton', resourceId: 'singleton', path: '/api/sync/collections', payload: { collections } });
        return flushQueue();
    };

    if (typeof global.addEventListener === 'function') {
        global.addEventListener('online', () => void refreshStatus());
        global.document?.addEventListener?.('visibilitychange', () => { if (global.document?.visibilityState === 'visible') void refreshStatus(); });
        global.setInterval?.(() => void refreshStatus(), 5000);
    }

    global.XingyueHostSync = Object.freeze({
        syncSession, syncCollections, deleteSession, syncAttachment, refreshStatus, flushQueue, acceptHost2Conflicts, beginRestore, adoptHostData, adoptHostBaseline, claimWritingTurn, isLocalWriter, hasLocalChanges, completeAuthoritativeRestore,
        getStatus: () => ({ ...state }),
        getPendingCount: () => queue?.pendingCount() || Promise.resolve(0),
        getConflicts: () => queue?.getConflicts() || []
    });
})(window);
