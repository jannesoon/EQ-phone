(function () {
    const { useEffect, useRef, useState } = React;

    const videoRuntime = window.XingyueVideo || {};
    const MAX_BYTES = Number(videoRuntime.MAX_BYTES || 25 * 1024 * 1024);
    const MAX_SECONDS = Number(videoRuntime.MAX_SECONDS || 60);
    const DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com';
    const VIDEO_CHAT_MODE_KEY = 'xingyue_video_chat_mode_v1';
    const VIDEO_CHAT_TEXT_MODE_KEY = 'xingyue_video_chat_text_mode_v1';
    const VIDEO_CHAT_MODES = Object.freeze({ UNIFIED: 'unified', LEGACY: 'legacy' });
    const VIDEO_CHAT_CHOICES = Object.freeze({ VIDEO_ONLY: 'video-only', UNIFIED: 'unified-text', LEGACY: 'legacy' });
    const readVideoChatMode = () => {
        try {
            return localStorage.getItem(VIDEO_CHAT_MODE_KEY) === VIDEO_CHAT_MODES.LEGACY
                ? VIDEO_CHAT_MODES.LEGACY : VIDEO_CHAT_MODES.UNIFIED;
        } catch (_) { return VIDEO_CHAT_MODES.UNIFIED; }
    };
    const readVideoChatTextMode = () => {
        try {
            const explicit = localStorage.getItem(VIDEO_CHAT_TEXT_MODE_KEY);
            if (explicit !== null) return explicit === '1' || explicit === 'true';
            // Backward compatibility: an existing explicit `unified` choice
            // previously enabled ordinary text/image turns as well. A brand-new
            // install has no mode key and therefore defaults to video-only.
            return localStorage.getItem(VIDEO_CHAT_MODE_KEY) === VIDEO_CHAT_MODES.UNIFIED;
        } catch (_) { return false; }
    };
    const writeVideoChatMode = mode => {
        const next = mode === VIDEO_CHAT_MODES.LEGACY ? VIDEO_CHAT_MODES.LEGACY : VIDEO_CHAT_MODES.UNIFIED;
        try { localStorage.setItem(VIDEO_CHAT_MODE_KEY, next); } catch (_) {}
        try { window.dispatchEvent(new CustomEvent('xingyue-video-chat-mode', { detail: next })); } catch (_) {}
        return next;
    };
    const writeVideoChatTextMode = enabled => {
        const next = Boolean(enabled);
        try { localStorage.setItem(VIDEO_CHAT_TEXT_MODE_KEY, next ? '1' : '0'); } catch (_) {}
        try { window.dispatchEvent(new CustomEvent('xingyue-video-chat-text-mode', { detail: next })); } catch (_) {}
        return next;
    };
    const composeMessage = videoRuntime.composeMessage;
    const splitMessage = videoRuntime.splitMessage;
    const preserveEvidence = videoRuntime.preserveEvidence;
    const inspectFile = videoRuntime.inspectFile;

    const textOf = value => String(value ?? '');
    const formatBytes = value => {
        const bytes = Number(value) || 0;
        if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
        if (bytes >= 1024) return `${Math.round(bytes / 1024)} KiB`;
        return `${bytes} B`;
    };
    const formatDuration = value => {
        const seconds = Number(value);
        if (!Number.isFinite(seconds) || seconds <= 0) return '待核验';
        if (seconds < 60) return `${seconds.toFixed(1).replace(/\.0$/, '')} 秒`;
        return `${Math.floor(seconds / 60)} 分 ${Math.round(seconds % 60)} 秒`;
    };
    const formatAudio = value => value === true ? '已检测到音轨' : value === false ? '未检测到音轨' : '待服务端核验音轨';

    const normalizeStatus = value => {
        if (value && value.video && typeof value.video === 'object' && value.baseUrl === undefined) return value.video;
        return value && typeof value === 'object' ? value : {};
    };

    const getClient = clientRef => {
        if (!clientRef.current && typeof window.XingyueVideo?.createClient === 'function') {
            clientRef.current = window.XingyueVideo.createClient();
        }
        return clientRef.current;
    };

    const VideoComposer = ({ pendingVideo, onClear, onStop, onRetry }) => {
        const phase = pendingVideo?.phase || '';
        if (!pendingVideo) return null;

        return (
            <div className={`xy-video-pending ${phase === 'analyzing' ? 'is-analyzing' : ''}`}>
                <div className="xy-video-pending-preview">
                    <span className="xy-video-pending-icon" aria-hidden="true">🎞️</span>
                </div>
                <div className="xy-video-pending-main">
                    <div className="xy-video-pending-heading">
                        <span className="xy-video-pending-name" title={pendingVideo.name}>{pendingVideo.name || '本地视频'}</span>
                        <span className="xy-video-pending-size">{formatBytes(pendingVideo.size)}</span>
                    </div>
                    <div className="xy-video-pending-meta">
                        {phase === 'selected' && pendingVideo.duration == null ? '已选好，待发送' : `${formatDuration(pendingVideo.duration)} · ${formatAudio(pendingVideo.hasAudio)}`}
                    </div>
                    {phase === 'analyzing' || phase === 'inspecting' ? (
                        <div className="xy-video-pending-status is-progress">
                            <span>{pendingVideo.progress || (phase === 'inspecting' ? '正在读取视频信息…' : '正在发送视频并开始理解…')}</span>
                            <button type="button" onClick={onStop} className="xy-video-inline-button is-stop">停止</button>
                        </div>
                    ) : phase === 'error' || phase === 'cancelled' ? (
                        <div className="xy-video-pending-status is-error">
                            <span>{pendingVideo.error || '视频处理失败，尚未发送聊天消息。'}</span>
                            <button type="button" onClick={onRetry} className="xy-video-inline-button">重试</button>
                        </div>
                    ) : (
                        <div className="xy-video-pending-status">{pendingVideo.duration == null ? '点发送后上传，电脑会检查时长和音轨，再交给视频模型。' : '视频检查完成，点发送后交给视频模型。'}可能消耗视频接口额度。</div>
                    )}
                </div>
                {phase !== 'analyzing' && phase !== 'inspecting' && <button type="button" onClick={onClear} className="xy-video-clear-button" title="取消选择视频">×</button>}
            </div>
        );
    };

    const TextAttachmentCard = ({ pendingText, onClear, onStop, onRetry }) => {
        if (!pendingText) return null;
        const phase = pendingText.phase || '';
        return (
            <div className="xy-text-pending">
                <div className="xy-text-pending-icon" aria-hidden="true">📎</div>
                <div className="xy-text-pending-main">
                    <div className="xy-text-pending-heading">
                        <span className="xy-text-pending-name" title={pendingText.name}>{pendingText.name || '文本附件'}</span>
                        <span className="xy-text-pending-size">{formatBytes(pendingText.size)}</span>
                    </div>
                    <div className={`xy-text-pending-status ${phase === 'error' || phase === 'cancelled' ? 'is-error' : ''}`}>
                        <span>{phase === 'reading' ? (pendingText.progress || '正在读取文本附件…') : phase === 'error' || phase === 'cancelled' ? (pendingText.error || '文本附件读取失败，尚未发送聊天消息。') : `正文 ${Number(pendingText.chars) || 0} 字 · 仅发送有限文字资料`}</span>
                        {phase === 'reading' && <button type="button" onClick={onStop} className="xy-video-inline-button is-stop">停止</button>}
                        {(phase === 'error' || phase === 'cancelled') && <button type="button" onClick={onRetry} className="xy-video-inline-button">重试</button>}
                    </div>
                </div>
                {phase !== 'reading' && <button type="button" onClick={onClear} className="xy-video-clear-button" title="取消选择文本附件">×</button>}
            </div>
        );
    };

    const VideoSettingsPanel = ({ desktopAvailable = false, Icon, showToast }) => {
        const clientRef = useRef(null);
        const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
        const [model, setModel] = useState('');
        const [apiKey, setApiKey] = useState('');
        const [status, setStatus] = useState(null);
        const [busy, setBusy] = useState(false);
        const [statusError, setStatusError] = useState('');
        const [chatMode, setChatMode] = useState(readVideoChatMode);
        const [chatTextMode, setChatTextMode] = useState(readVideoChatTextMode);

        const refreshStatus = async () => {
            const client = getClient(clientRef);
            if (!client || typeof client.status !== 'function') {
                setStatusError('视频接口模块尚未加载');
                return;
            }
            try {
                const next = normalizeStatus(await Promise.resolve(client.status()));
                setStatus(next);
                if (next.baseUrl) setBaseUrl(next.baseUrl);
                if (next.model) setModel(next.model);
                setStatusError(next.configurationError || '');
            } catch (error) {
                setStatusError(textOf(error?.message || '无法读取视频接口状态'));
            }
        };

        useEffect(() => { void refreshStatus(); }, []);
        useEffect(() => {
            const syncChatMode = () => {
                setChatMode(readVideoChatMode());
                setChatTextMode(readVideoChatTextMode());
            };
            window.addEventListener('storage', syncChatMode);
            window.addEventListener('xingyue-video-chat-mode', syncChatMode);
            window.addEventListener('xingyue-video-chat-text-mode', syncChatMode);
            return () => {
                window.removeEventListener('storage', syncChatMode);
                window.removeEventListener('xingyue-video-chat-mode', syncChatMode);
                window.removeEventListener('xingyue-video-chat-text-mode', syncChatMode);
            };
        }, []);

        const chooseChatMode = (mode, useUnifiedText) => {
            const nextMode = writeVideoChatMode(mode);
            const nextTextMode = writeVideoChatTextMode(useUnifiedText);
            setChatMode(nextMode);
            setChatTextMode(nextTextMode);
            const toast = nextMode === VIDEO_CHAT_MODES.LEGACY
                ? '已切换为旧视频方式，文字沿用当前聊天模型'
                : nextTextMode
                    ? '已切换为文字和视频统一模型'
                    : '已切换为视频直读，文字沿用当前聊天模型';
            showToast?.(toast);
        };

        const saveConfig = async () => {
            if (!desktopAvailable) {
                setStatusError('手机端只读取状态，请在电脑端设置视频 Key');
                return;
            }
            const client = getClient(clientRef);
            if (!client || typeof client.configure !== 'function') {
                setStatusError('视频接口模块尚未加载');
                return;
            }
            if (!textOf(apiKey).trim() && !status?.configured) {
                setStatusError('首次配置需要填写视频接口 Key');
                return;
            }
            setBusy(true);
            setStatusError('');
            try {
                const next = await Promise.resolve(client.configure({
                    baseUrl: textOf(baseUrl).trim() || DEFAULT_BASE_URL,
                    model: textOf(model).trim(),
                    ...(textOf(apiKey).trim() ? { apiKey: textOf(apiKey).trim() } : {})
                }));
                setStatus(normalizeStatus(next));
                showToast?.('视频配置已保存到电脑主机私有配置');
            } catch (error) {
                setStatusError(textOf(error?.message || '视频接口保存失败'));
            } finally {
                // Key 只在本组件内存中短暂存在；成功或失败后都不留在表单状态。
                setApiKey('');
                setBusy(false);
            }
        };

        const clearConfig = async () => {
            if (!desktopAvailable) {
                setStatusError('手机端不能修改视频接口配置');
                return;
            }
            const client = getClient(clientRef);
            if (!client || typeof client.configure !== 'function') return;
            setBusy(true);
            try {
                const next = await Promise.resolve(client.configure({ clear: true }));
                setStatus(normalizeStatus(next));
                setApiKey('');
                setModel('');
                setBaseUrl(DEFAULT_BASE_URL);
                showToast?.('视频接口配置已清空');
            } catch (error) {
                setStatusError(textOf(error?.message || '清空视频接口失败'));
            } finally {
                setBusy(false);
            }
        };

        const configured = Boolean(status?.configured && textOf(status?.model).trim());
        return (
            <section className="xy-video-settings rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-indigo-900 flex items-center gap-2"><span aria-hidden="true">🎞️</span> 视频理解（Gemini）</h3>
                        <p className="mt-1 text-[11px] leading-relaxed text-indigo-700">独立视频服务只接收你明确发送的视频和问题；原视频不写入正式聊天同步。分析可能消耗视频服务额度，建议先用 10 秒左右短片。</p>
                    </div>
                    <span className={`xy-video-status-pill ${configured ? 'is-ready' : 'is-empty'}`}>{configured ? '已配置' : '未配置'}</span>
                </div>
                <div className="rounded-lg bg-white/70 border border-indigo-100 px-3 py-2 text-[11px] text-gray-600 leading-relaxed">
                    {desktopAvailable ? 'Key 只在本组件内存中填写，提交后立即清空；配置由电脑主机私有保存，手机只使用，不进入普通设置、聊天或同步。' : '视频配置由电脑主机私有保存，手机只使用并读取状态，不保存或修改视频 Key。'}
                </div>
                <div className="rounded-lg border border-indigo-100 bg-white/80 p-3 space-y-2">
                    <div className="text-[11px] font-semibold text-indigo-900">聊天发送方式（三种模式）</div>
                    <label className="flex items-start gap-2 text-[11px] leading-relaxed text-gray-700 cursor-pointer">
                        <input type="radio" name="xingyue-video-chat-choice" value={VIDEO_CHAT_CHOICES.VIDEO_ONLY} checked={chatMode === VIDEO_CHAT_MODES.UNIFIED && !chatTextMode} onChange={() => chooseChatMode(VIDEO_CHAT_MODES.UNIFIED, false)} className="mt-0.5" />
                        <span><strong>视频直读（默认）</strong><br />仅带视频的发送使用视频配置模型；文字发送、重生成、编辑重发沿用当前聊天模型。原片和问题同一轮发送。</span>
                    </label>
                    <label className="flex items-start gap-2 text-[11px] leading-relaxed text-gray-700 cursor-pointer">
                        <input type="radio" name="xingyue-video-chat-choice" value={VIDEO_CHAT_CHOICES.UNIFIED} checked={chatMode === VIDEO_CHAT_MODES.UNIFIED && chatTextMode} onChange={() => chooseChatMode(VIDEO_CHAT_MODES.UNIFIED, true)} className="mt-0.5" />
                        <span><strong>文字和视频统一</strong><br />文字发送、图片、重生成、编辑重发和视频都使用视频配置模型；视频原片与问题同一轮发送。</span>
                    </label>
                    <label className="flex items-start gap-2 text-[11px] leading-relaxed text-gray-700 cursor-pointer">
                        <input type="radio" name="xingyue-video-chat-choice" value={VIDEO_CHAT_CHOICES.LEGACY} checked={chatMode === VIDEO_CHAT_MODES.LEGACY} onChange={() => chooseChatMode(VIDEO_CHAT_MODES.LEGACY, false)} className="mt-0.5" />
                        <span><strong>旧视频方式（可回切）</strong><br />视频先生成文字依据，再交给当前聊天模型；文字发送、重生成、编辑重发沿用当前配置。</span>
                    </label>
                    <p className="text-[10px] leading-relaxed text-gray-500">首次升级默认只启用视频直读，不会把日常聊天自动换成受限视频模型。统一模型不可用时，普通文字仍可使用原聊天配置；带原视频的请求不会静默改走另一条收费链路。</p>
                </div>
                {desktopAvailable ? (
                    <>
                        <label className="block text-[10px] text-gray-500 font-bold">视频服务 Base URL</label>
                        <input type="text" value={baseUrl} onChange={event => setBaseUrl(event.target.value)} disabled={busy} className="w-full bg-white border border-indigo-200 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none" placeholder={DEFAULT_BASE_URL} />
                        <label className="block text-[10px] text-gray-500 font-bold">视频模型</label>
                        <input type="text" value={model} onChange={event => setModel(event.target.value)} disabled={busy} className="w-full bg-white border border-indigo-200 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none" placeholder="填写已确认支持视频的 Gemini 模型名" />
                        <label className="block text-[10px] text-gray-500 font-bold">视频接口 Key（仅主机保存）</label>
                        <input type="password" value={apiKey} onChange={event => setApiKey(event.target.value)} disabled={busy} autoComplete="new-password" className="w-full bg-white border border-indigo-200 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none" placeholder={status?.configured ? '留空表示沿用主机已保存 Key' : '填写视频服务 Key'} />
                        <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={saveConfig} disabled={busy || (!apiKey.trim() && !status?.configured)} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:opacity-50">{busy ? '保存中…' : '保存到主机私有配置'}</button>
                            <button type="button" onClick={refreshStatus} disabled={busy} className="px-3 py-2 rounded-lg bg-white border border-indigo-200 text-indigo-700 text-xs font-medium hover:bg-indigo-50 disabled:opacity-50">刷新状态</button>
                            <button type="button" onClick={clearConfig} disabled={busy || !status?.configured} className="px-3 py-2 rounded-lg bg-white border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 disabled:opacity-50">清空主机配置</button>
                        </div>
                    </>
                ) : (
                    <button type="button" onClick={refreshStatus} disabled={busy} className="px-3 py-2 rounded-lg bg-white border border-indigo-200 text-indigo-700 text-xs font-medium hover:bg-indigo-50 disabled:opacity-50">刷新电脑主机状态</button>
                )}
                <div className={`text-[11px] leading-relaxed ${statusError ? 'text-red-600' : 'text-gray-500'}`}>
                    {statusError || (status ? `主机状态：${status.configured ? '已保存' : '未保存'} · 地址：${textOf(status.baseUrl).trim() || '未返回'} · 模型：${textOf(status.model).trim() || '未返回'}` : '正在读取主机状态…')}
                </div>
            </section>
        );
    };

    window.XingyueVideoUI = {
        composeMessage,
        splitMessage,
        preserveEvidence,
        inspectFile,
        VIDEO_CHAT_MODE_KEY,
        VIDEO_CHAT_TEXT_MODE_KEY,
        VIDEO_CHAT_MODES,
        VIDEO_CHAT_CHOICES,
        getVideoChatMode: readVideoChatMode,
        setVideoChatMode: writeVideoChatMode,
        getVideoChatTextMode: readVideoChatTextMode,
        setVideoChatTextMode: writeVideoChatTextMode,
        VideoComposer,
        TextAttachmentCard,
        VideoSettingsPanel,
        MAX_BYTES,
        MAX_SECONDS
    };
})();
