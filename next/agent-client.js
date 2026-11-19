(function initXingyueAgentClient(global) {
    'use strict';

    const PRIVATE_TAILSCALE_BASE_URL = 'https://desktop-8i3jek4.taild484c1.ts.net';
    const mobileRuntime = global.XINGYUE_MOBILE_RUNTIME && typeof global.XINGYUE_MOBILE_RUNTIME === 'object'
        ? global.XINGYUE_MOBILE_RUNTIME
        : null;
    const runtimeAgentBase = String(mobileRuntime?.agentBase || '').trim();
    const isMobileRuntime = Boolean(runtimeAgentBase) && global.xingyueDesktop?.isDesktop !== true;
    const isPrivateHostPage = global.location?.hostname === 'desktop-8i3jek4.taild484c1.ts.net';
    const DEFAULT_BASE_URL = runtimeAgentBase || (isPrivateHostPage ? global.location.origin : 'http://127.0.0.1:8765');
    const resolveBaseUrl = options => String(runtimeAgentBase || options?.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
    const desktopRequest = typeof global.xingyueDesktop?.requestLocalAgent === 'function'
        ? global.xingyueDesktop.requestLocalAgent
        : null;

    const createMonitor = (options = {}) => {
        const baseUrl = resolveBaseUrl(options);
        const fetchImpl = options.fetchImpl || global.fetch.bind(global);
        const defaultTimeoutMs = (isPrivateHostPage || isMobileRuntime) && !desktopRequest ? 6000 : 1200;
        const timeoutMs = Math.max(300, Number(options.timeoutMs) || defaultTimeoutMs);
        const intervalMs = Math.max(3000, Number(options.intervalMs) || 15000);
        let timer = null;
        let stopped = false;

        const requestJson = async (path, requestOptions = {}) => {
            const method = requestOptions.method || 'GET';
            if (desktopRequest) {
                const payload = await desktopRequest({
                    path,
                    method,
                    body: requestOptions.body ? JSON.parse(requestOptions.body) : undefined
                });
                return payload;
            }

            const savedDeviceToken = (() => { try { return global.localStorage?.getItem('xingyue_host_device_token') || ''; } catch (_) { return ''; } })();
            const response = await fetchImpl(`${baseUrl}${path}`, {
                ...requestOptions,
                headers: { ...(requestOptions.headers || {}), ...(savedDeviceToken ? { 'X-Xingyue-Device-Token': savedDeviceToken } : {}) }
            });
            return {
                ok: response.ok,
                status: response.status,
                data: await response.json().catch(() => ({}))
            };
        };

        const check = async () => {
            const controller = new AbortController();
            let timeout = null;
            try {
                const timeoutPromise = new Promise((_, reject) => {
                    timeout = setTimeout(() => {
                        controller.abort();
                        const error = new Error('检查超时');
                        error.name = 'AbortError';
                        reject(error);
                    }, timeoutMs);
                });
                const response = await Promise.race([
                    requestJson('/api/health', { method: 'GET', cache: 'no-store', signal: controller.signal }),
                    timeoutPromise
                ]);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = response.data;
                if (!data?.ok || data?.status !== 'online') throw new Error('本地主机返回异常');
                const result = {
                    state: 'online',
                    label: data.storage?.ready ? '本地主机：已连接 · 数据目录已就绪' : '本地主机：已连接',
                    data,
                    checkedAt: Date.now()
                };
                if (isMobileRuntime) {
                    const savedDeviceToken = (() => {
                        try { return global.localStorage?.getItem('xingyue_host_device_token') || ''; } catch (_) { return ''; }
                    })();
                    try {
                        const deviceResponse = await requestJson('/api/device/session', {
                            method: 'GET',
                            cache: 'no-store',
                            signal: controller.signal
                        });
                        if (deviceResponse.ok && deviceResponse.data?.device) {
                            result.pairingState = 'connected';
                            result.device = deviceResponse.data.device;
                            result.label += ' · 手机已配对';
                        } else if (deviceResponse.status === 401 || deviceResponse.status === 403) {
                            result.pairingState = savedDeviceToken ? 'revoked' : 'unpaired';
                            result.device = null;
                            result.reason = deviceResponse.data?.error || (savedDeviceToken ? '手机凭证已撤销' : '手机尚未完成设备配对');
                            result.label += savedDeviceToken ? ' · 手机凭证已撤销' : ' · 等待手机配对';
                        } else {
                            result.pairingState = 'unknown';
                            result.device = null;
                            result.reason = deviceResponse.data?.error || `设备状态检查失败（HTTP ${deviceResponse.status}）`;
                            result.label += ' · 手机设备状态待确认';
                        }
                    } catch (deviceError) {
                        result.pairingState = 'unknown';
                        result.device = null;
                        result.reason = deviceError?.name === 'AbortError' ? '设备状态检查超时' : (deviceError?.message || '设备状态检查失败');
                        result.label += ' · 手机设备状态待确认';
                    }
                }
                return result;
            } catch (error) {
                return {
                    state: 'offline',
                    label: isMobileRuntime ? '手机主机服务：未连接' : '本地主机：未连接（基础聊天正常）',
                    reason: error?.name === 'AbortError' ? '检查超时' : (error?.message || '无法连接'),
                    checkedAt: Date.now()
                };
            } finally {
                clearTimeout(timeout);
            }
        };

        const start = (listener) => {
            stopped = false;
            const run = async () => {
                const status = await check();
                if (!stopped && typeof listener === 'function') listener(status);
            };
            run();
            timer = setInterval(run, intervalMs);
            return () => {
                stopped = true;
                if (timer) clearInterval(timer);
                timer = null;
            };
        };

        const readWebPage = async (url, onProgress = () => {}) => {
            onProgress('正在把网址交给本地主机…');
            const startResponse = await requestJson('/api/browser/read', {
                method: 'POST',
                cache: 'no-store',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const started = startResponse.data || {};
            if (!startResponse.ok || !started.jobId) throw new Error(started.error || '本地主机没有开始浏览网页');

            const deadline = Date.now() + 70000;
            let lastProgress = '';
            while (Date.now() < deadline) {
                const response = await requestJson(`/api/browser/jobs/${started.jobId}`, {
                    cache: 'no-store',
                    method: 'GET'
                });
                const payload = response.data || {};
                if (!response.ok || !payload.job) throw new Error(payload.error || '无法读取网页浏览进度');
                const job = payload.job;
                if (job.progress && job.progress !== lastProgress) {
                    lastProgress = job.progress;
                    onProgress(job.progress);
                }
                if (job.status === 'succeeded') return job.result;
                if (job.status === 'failed') throw new Error(job.error || '本地主机没有读完这个网页');
                await new Promise(resolveWait => setTimeout(resolveWait, 500));
            }
            throw new Error('网页读取时间过长，已停止等待');
        };

        return Object.freeze({ baseUrl, check, start, readWebPage });
    };

    const createDeviceClient = (options = {}) => {
        const baseUrl = resolveBaseUrl(options);
        const fetchImpl = options.fetchImpl || global.fetch.bind(global);
        const storage = options.storage || global.localStorage;
        const tokenKey = 'xingyue_host_device_token';
        const deviceKey = 'xingyue_host_device_info';

        const getToken = () => {
            try { return storage.getItem(tokenKey) || ''; } catch (_) { return ''; }
        };
        const getSavedDevice = () => {
            try { return JSON.parse(storage.getItem(deviceKey) || 'null'); } catch (_) { return null; }
        };
        const request = async (path, { method = 'GET', body, deviceToken = getToken() } = {}) => {
            if (desktopRequest) return desktopRequest({ path, method, body, deviceToken });
            const response = await fetchImpl(`${baseUrl}${path}`, {
                method,
                cache: 'no-store',
                headers: {
                    ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
                    ...(deviceToken ? { 'X-Xingyue-Device-Token': deviceToken } : {})
                },
                body: body === undefined ? undefined : JSON.stringify(body)
            });
            return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
        };
        const pair = async (code, deviceName) => {
            const response = await request('/api/devices/pair', { method: 'POST', body: { code, deviceName }, deviceToken: '' });
            if (!response.ok || !response.data?.token) throw new Error(response.data?.error || '设备配对失败');
            storage.setItem(tokenKey, response.data.token);
            storage.setItem(deviceKey, JSON.stringify(response.data.device));
            return response.data.device;
        };
        const check = async () => {
            const token = getToken();
            if (!token) return { state: 'unpaired', device: null };
            const response = await request('/api/device/session', { deviceToken: token });
            if (!response.ok || !response.data?.device) return { state: 'revoked', device: getSavedDevice(), error: response.data?.error || '设备凭证不可用' };
            storage.setItem(deviceKey, JSON.stringify(response.data.device));
            return { state: 'connected', device: response.data.device };
        };
        const readHostData = async () => {
            const response = await request('/api/device/data');
            if (!response.ok || !response.data?.data) throw new Error(response.data?.error || '无法读取主机数据');
            return response.data.data;
        };
        const claimApiSettings = async () => {
            const response = await request('/api/device/api-settings/claim', { method: 'POST', body: {} });
            if (response.status === 404) return null;
            if (!response.ok || !response.data?.available) throw new Error(response.data?.error || '无法领取 API 设置');
            return { apiSettings: response.data.apiSettings || {}, secretCount: Number(response.data.secretCount || 0), mode: response.data.mode === 'replace-confirmed' ? 'replace-confirmed' : 'merge' };
        };
        const forget = () => {
            try { storage.removeItem(tokenKey); storage.removeItem(deviceKey); } catch (_) {}
        };

        return Object.freeze({
            baseUrl, getToken, getSavedDevice, pair, check, readHostData, claimApiSettings, forget,
            startPairing: () => request('/api/devices/pairing/start', { method: 'POST', body: {} }),
            listDevices: () => request('/api/devices'),
            offerApiSettings: (deviceId, config, mode = 'merge') => request('/api/devices/api-settings/offer', { method: 'POST', body: { deviceId, config, mode } }),
            revokeDevice: id => request('/api/devices/revoke', { method: 'POST', body: { id } })
        });
    };

    const createIdentityCoreClient = (options = {}) => {
        const baseUrl = resolveBaseUrl(options);
        const fetchImpl = options.fetchImpl || global.fetch.bind(global);
        const request = async (path, { method = 'GET', body } = {}) => {
            if (desktopRequest) return desktopRequest({ path, method, body });
            const deviceToken = (() => { try { return global.localStorage?.getItem('xingyue_host_device_token') || ''; } catch (_) { return ''; } })();
            const response = await fetchImpl(`${baseUrl}${path}`, {
                method,
                cache: 'no-store',
                headers: {
                    ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
                    ...(deviceToken ? { 'X-Xingyue-Device-Token': deviceToken } : {})
                },
                body: body === undefined ? undefined : JSON.stringify(body)
            });
            return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
        };
        const unwrap = async promise => {
            const response = await promise;
            if (!response.ok || !response.data?.identityCore) throw new Error(response.data?.error || '身份核心操作失败');
            return response.data.identityCore;
        };
        return Object.freeze({
            read: () => unwrap(request('/api/identity-core')),
            createCandidate: (body, changeNote) => unwrap(request('/api/identity-core/candidates', { method: 'POST', body: { body, changeNote } })),
            confirm: (version, confirmationText) => unwrap(request('/api/identity-core/confirm', { method: 'POST', body: { version, confirmationText } })),
            rollback: (targetVersion, reason) => unwrap(request('/api/identity-core/rollback', { method: 'POST', body: { targetVersion, reason } })),
            reportReplica: (kind, version, contentHash) => unwrap(request('/api/identity-core/replicas/report', { method: 'POST', body: { kind, version, contentHash } }))
        });
    };

    const createMemoryGovernanceClient = (options = {}) => {
        const baseUrl = resolveBaseUrl(options);
        const fetchImpl = options.fetchImpl || global.fetch.bind(global);
        const request = async (path, { method = 'GET', body } = {}) => {
            if (desktopRequest) return desktopRequest({ path, method, body });
            const deviceToken = (() => { try { return global.localStorage?.getItem('xingyue_host_device_token') || ''; } catch (_) { return ''; } })();
            const response = await fetchImpl(`${baseUrl}${path}`, {
                method,
                cache: 'no-store',
                headers: {
                    ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
                    ...(deviceToken ? { 'X-Xingyue-Device-Token': deviceToken } : {})
                },
                body: body === undefined ? undefined : JSON.stringify(body)
            });
            return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
        };
        const unwrap = async promise => {
            const response = await promise;
            if (!response.ok || !response.data?.memoryGovernance) throw new Error(response.data?.error || '记忆治理操作失败');
            return { memoryGovernance: response.data.memoryGovernance, saved: response.data.saved || null, duplicate: response.data.duplicate === true };
        };
        return Object.freeze({
            read: async () => (await unwrap(request('/api/memory-governance'))).memoryGovernance,
            createCandidate: input => unwrap(request('/api/memory-governance/candidates', { method: 'POST', body: input })),
            recordEthanWriting: input => unwrap(request('/api/memory-governance/ethan-writing', { method: 'POST', body: input })),
            remember: input => unwrap(request('/api/memory-governance/remember', { method: 'POST', body: input })),
            confirm: input => unwrap(request('/api/memory-governance/confirm', { method: 'POST', body: input })),
            revise: input => unwrap(request('/api/memory-governance/revise', { method: 'POST', body: input })),
            reject: input => unwrap(request('/api/memory-governance/reject', { method: 'POST', body: input })),
            withdraw: input => unwrap(request('/api/memory-governance/withdraw', { method: 'POST', body: input }))
        });
    };

    const createSessionCheckpointClient = (options = {}) => {
        const baseUrl = resolveBaseUrl(options);
        const fetchImpl = options.fetchImpl || global.fetch.bind(global);
        const request = async (path, { method = 'GET', body } = {}) => {
            if (desktopRequest) return desktopRequest({ path, method, body });
            const deviceToken = (() => { try { return global.localStorage?.getItem('xingyue_host_device_token') || ''; } catch (_) { return ''; } })();
            const response = await fetchImpl(`${baseUrl}${path}`, {
                method,
                cache: 'no-store',
                headers: {
                    ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
                    ...(deviceToken ? { 'X-Xingyue-Device-Token': deviceToken } : {})
                },
                body: body === undefined ? undefined : JSON.stringify(body)
            });
            return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
        };
        const unwrap = async promise => {
            const response = await promise;
            if (!response.ok || !response.data?.sessionCheckpoint) throw new Error(response.data?.error || '窗口连续性操作失败');
            return { sessionCheckpoint: response.data.sessionCheckpoint, saved: response.data.saved || null };
        };
        const pathFor = (sessionId, suffix = '') => `/api/session-checkpoints/${encodeURIComponent(String(sessionId || ''))}${suffix}`;
        return Object.freeze({
            read: async sessionId => (await unwrap(request(pathFor(sessionId)))).sessionCheckpoint,
            readConfirmedWindowLogs: async () => {
                const response = await request('/api/window-logs');
                if (!response.ok || !Array.isArray(response.data?.windowLogs)) throw new Error(response.data?.error || '窗口日志读取失败');
                return response.data.windowLogs;
            },
            createCandidate: (sessionId, content) => unwrap(request(pathFor(sessionId, '/candidates'), { method: 'POST', body: { content } })),
            saveRollingSegment: (sessionId, segment) => unwrap(request(pathFor(sessionId, '/rolling'), { method: 'POST', body: { segment } })),
            reviseCandidate: (sessionId, body) => unwrap(request(pathFor(sessionId, '/revise'), { method: 'POST', body: { body } })),
            confirm: sessionId => unwrap(request(pathFor(sessionId, '/confirm'), { method: 'POST', body: {} })),
            reject: sessionId => unwrap(request(pathFor(sessionId, '/reject'), { method: 'POST', body: {} })),
            withdraw: sessionId => unwrap(request(pathFor(sessionId, '/withdraw'), { method: 'POST', body: {} }))
        });
    };

    const createRecentLifeClient = (options = {}) => {
        const baseUrl = resolveBaseUrl(options);
        const fetchImpl = options.fetchImpl || global.fetch.bind(global);
        const request = async (method = 'GET', body) => {
            if (desktopRequest) return desktopRequest({ path: '/api/recent-life/diaries', method, body });
            const deviceToken = (() => { try { return global.localStorage?.getItem('xingyue_host_device_token') || ''; } catch (_) { return ''; } })();
            const response = await fetchImpl(`${baseUrl}/api/recent-life/diaries`, {
                method, cache: 'no-store',
                headers: {
                    ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
                    ...(deviceToken ? { 'X-Xingyue-Device-Token': deviceToken } : {})
                },
                body: body === undefined ? undefined : JSON.stringify(body)
            });
            return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
        };
        return Object.freeze({
            readLatestDiaries: async () => {
                const response = await request('GET');
                if (!response.ok || !response.data?.recentLife) throw new Error(response.data?.error || '近期云端日记读取失败');
                return response.data.recentLife;
            },
            writeDiaryEntry: async entry => {
                const response = await request('POST', entry);
                if (!response.ok || !response.data?.entry) throw new Error(response.data?.error || '云端日记写入失败');
                return response.data.entry;
            }
        });
    };

    const createVoiceClient = (options = {}) => {
        const baseUrl = resolveBaseUrl(options);
        const fetchImpl = options.fetchImpl || global.fetch.bind(global);
        return Object.freeze({
            generateElevenLabs: async ({ text, apiKey, voiceId, modelId = 'eleven_v4' }) => {
                const body = { text, apiKey, voiceId, modelId };
                let result;
                if (desktopRequest) result = await desktopRequest({ path: '/api/voice/elevenlabs', method: 'POST', body });
                else {
                    const deviceToken = (() => { try { return global.localStorage?.getItem('xingyue_host_device_token') || ''; } catch (_) { return ''; } })();
                    const response = await fetchImpl(`${baseUrl}/api/voice/elevenlabs`, {
                        method: 'POST', cache: 'no-store',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(deviceToken ? { 'X-Xingyue-Device-Token': deviceToken } : {})
                        },
                        body: JSON.stringify(body)
                    });
                    result = { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
                }
                if (!result.ok || !result.data?.audioBase64) throw new Error(result.data?.error || 'ElevenLabs 朗读失败');
                const binary = global.atob(result.data.audioBase64);
                const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
                return new Blob([bytes], { type: 'audio/mpeg' });
            }
        });
    };

    const createHostToolClient = (options = {}) => {
        const baseUrl = resolveBaseUrl(options);
        const fetchImpl = options.fetchImpl || global.fetch.bind(global);
        const request = async (path, { method = 'GET', body } = {}) => {
            if (desktopRequest) return desktopRequest({ path, method, body });
            const deviceToken = (() => { try { return global.localStorage?.getItem('xingyue_host_device_token') || ''; } catch (_) { return ''; } })();
            const response = await fetchImpl(`${baseUrl}${path}`, {
                method,
                cache: 'no-store',
                headers: {
                    ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
                    ...(deviceToken ? { 'X-Xingyue-Device-Token': deviceToken } : {})
                },
                body: body === undefined ? undefined : JSON.stringify(body)
            });
            return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
        };
        return Object.freeze({
            list: async () => {
                const response = await request('/api/tools');
                if (!response.ok || !Array.isArray(response.data?.tools)) throw new Error(response.data?.error || '无法读取主机工具目录');
                return response.data.tools;
            },
            invoke: async (name, args = {}, toolCallId = '') => {
                const response = await request('/api/tools/invoke', { method: 'POST', body: { name, arguments: args, toolCallId } });
                if (!response.ok || !response.data?.call) throw new Error(response.data?.error || '主机工具执行失败');
                return response.data.call;
            },
            cancel: async toolCallId => {
                const response = await request(`/api/tools/calls/${encodeURIComponent(String(toolCallId || ''))}/cancel`, { method: 'POST', body: {} });
                if (!response.ok || !response.data?.result) throw new Error(response.data?.error || '无法停止主机工具');
                return response.data.result;
            }
        });
    };

    const createTaskCenterClient = (options = {}) => {
        const baseUrl = resolveBaseUrl(options);
        const fetchImpl = options.fetchImpl || global.fetch.bind(global);
        const request = async (path, { method = 'GET', body } = {}) => {
            if (desktopRequest) return desktopRequest({ path, method, body });
            const response = await fetchImpl(`${baseUrl}${path}`, {
                method, cache: 'no-store',
                headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
                body: body === undefined ? undefined : JSON.stringify(body)
            });
            return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
        };
        const unwrapTasks = async promise => {
            const response = await promise;
            if (!response.ok || !Array.isArray(response.data?.tasks)) throw new Error(response.data?.error || '任务中心暂时不可用');
            return { tasks: response.data.tasks, summary: response.data.summary || null };
        };
        return Object.freeze({
            list: () => unwrapTasks(request('/api/tasks')),
            codexStatus: async (refresh = false) => {
                const response = await request(`/api/codex/status${refresh ? '?refresh=1' : ''}`);
                if (!response.ok || !response.data?.codex) throw new Error(response.data?.error || 'Codex 工作室状态不可用');
                return response.data.codex;
            },
            stop: taskId => unwrapTasks(request(`/api/tasks/${encodeURIComponent(String(taskId || ''))}/stop`, { method: 'POST', body: {} })),
            resume: taskId => unwrapTasks(request(`/api/tasks/${encodeURIComponent(String(taskId || ''))}/resume`, { method: 'POST', body: {} })),
            listAuthorizations: async () => {
                const response = await request('/api/file-grants');
                if (!response.ok || !Array.isArray(response.data?.fileGrants)) throw new Error(response.data?.error || '无法读取持续授权');
                return response.data.fileGrants;
            },
            revokeAuthorization: async grantId => {
                const response = await request('/api/file-grants/revoke', { method: 'POST', body: { grantId } });
                if (!response.ok || !response.data?.fileGrant) throw new Error(response.data?.error || '无法撤销持续授权');
                return response.data.fileGrant;
            }
        });
    };

    const createMemorySourceClient = (options = {}) => {
        const baseUrl = resolveBaseUrl(options);
        const fetchImpl = options.fetchImpl || global.fetch.bind(global);
        const request = async (path, { method = 'GET', body } = {}) => {
            if (desktopRequest) return desktopRequest({ path, method, body });
            const response = await fetchImpl(`${baseUrl}${path}`, {
                method, cache: 'no-store',
                headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
                body: body === undefined ? undefined : JSON.stringify(body)
            });
            return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
        };
        const unwrap = async responsePromise => {
            const response = await responsePromise;
            if (!response.ok || !response.data?.memorySources) throw new Error(response.data?.error || '记忆资料目录不可用');
            return response.data.memorySources;
        };
        return Object.freeze({
            read: () => unwrap(request('/api/memory-sources')),
            scan: sourceIds => unwrap(request('/api/memory-sources/scan', { method: 'POST', body: { sourceIds } }))
        });
    };

    const createMemoryVaultClient = (options = {}) => {
        const baseUrl = resolveBaseUrl(options);
        const fetchImpl = options.fetchImpl || global.fetch.bind(global);
        const timeoutMs = Math.max(1500, Number(options.timeoutMs) || 8000);
        const request = async (path, { method = 'GET', body } = {}) => {
            if (desktopRequest) return desktopRequest({ path, method, body });
            const savedDeviceToken = (() => { try { return global.localStorage?.getItem('xingyue_host_device_token') || ''; } catch (_) { return ''; } })();
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const response = await fetchImpl(`${baseUrl}${path}`, {
                    method, cache: 'no-store', signal: controller.signal,
                    headers: {
                        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
                        ...(savedDeviceToken ? { 'X-Xingyue-Device-Token': savedDeviceToken } : {})
                    },
                    body: body === undefined ? undefined : JSON.stringify(body)
                });
                return { ok: response.ok, status: response.status, data: await response.json().catch(() => ({})) };
            } catch (error) {
                if (error?.name === 'AbortError') throw new Error('主机记忆仓请求超时，请确认手机仍与电脑主机连接');
                throw error;
            } finally { clearTimeout(timeout); }
        };
        const unwrap = async promise => {
            const response = await promise;
            if (!response.ok || !response.data?.memoryVault) throw new Error(response.data?.error || '星月记忆仓操作失败');
            return { memoryVault: response.data.memoryVault, saved: response.data.saved || null, reused: response.data.reused === true };
        };
        return Object.freeze({
            read: async () => (await unwrap(request('/api/memory-vault/manage'))).memoryVault,
            proposeRevision: input => unwrap(request('/api/memory-vault/revisions', { method: 'POST', body: input })),
            createCandidate: input => unwrap(request('/api/memory-vault/candidates', { method: 'POST', body: input })),
            createConversationCandidate: input => unwrap(request('/api/memory-vault/device-candidates', { method: 'POST', body: input })),
            reviseCandidate: (candidateId, input) => unwrap(request(`/api/memory-vault/candidates/${encodeURIComponent(candidateId)}`, { method: 'PATCH', body: input })),
            withdrawCandidate: (candidateId, reason) => unwrap(request(`/api/memory-vault/candidates/${encodeURIComponent(candidateId)}/withdraw`, { method: 'POST', body: { reason } })),
            prepareRelease: input => unwrap(request('/api/memory-vault/releases/prepare', { method: 'POST', body: input })),
            evaluateRelease: input => unwrap(request('/api/memory-vault/releases/evaluate', { method: 'POST', body: input })),
            confirmRelease: input => unwrap(request('/api/memory-vault/releases/confirm', { method: 'POST', body: input })),
            rollback: (targetVersion, reason) => unwrap(request('/api/memory-vault/releases/rollback', { method: 'POST', body: { targetVersion, reason } }))
        });
    };

    global.XingyueAgentClient = Object.freeze({ DEFAULT_BASE_URL, PRIVATE_TAILSCALE_BASE_URL, createMonitor, createDeviceClient, createIdentityCoreClient, createMemoryGovernanceClient, createSessionCheckpointClient, createRecentLifeClient, createVoiceClient, createHostToolClient, createTaskCenterClient, createMemorySourceClient, createMemoryVaultClient });
})(window);
