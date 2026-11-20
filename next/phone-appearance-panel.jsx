(function initXingyuePhoneAppearancePanel(global) {
    'use strict';

    const ReactRef = global.React;
    const THEME_OPTIONS = [
        { id: 'violet', label: '星月紫', hint: '温柔紫夜', color: '#241f50' },
        { id: 'champagne', label: '香槟暖色', hint: '暖金晨光', color: '#eee2d5' },
        { id: 'moonblue', label: '月光雾蓝', hint: '清透月色', color: '#d9e1f3' },
        { id: 'obsidian', label: '曜石黑金', hint: '深夜静谧', color: '#171a22' },
    ];
    const DEFAULT_SNAPSHOT = Object.freeze({ themeId: 'violet', coverUrl: null, coverPosition: 50 });

    function appearanceApi() {
        return global.XingyuePhoneAppearance || null;
    }

    function errorText(error) {
        return String(error?.message || '本地外观处理失败，请稍后重试。');
    }

    function AppearancePanel() {
        const { useCallback, useEffect, useState } = ReactRef;
        const api = appearanceApi();
        const [snapshot, setSnapshot] = useState(() => api?.getSnapshot?.() || DEFAULT_SNAPSHOT);
        const [busy, setBusy] = useState(false);
        const [message, setMessage] = useState('');

        useEffect(() => {
            const currentApi = appearanceApi();
            if (!currentApi) {
                setMessage('本地外观模块尚未加载，请刷新页面后重试。');
                return undefined;
            }
            const unsubscribe = currentApi.subscribe(next => setSnapshot({ ...next }));
            void currentApi.init?.().then(next => next && setSnapshot({ ...next })).catch(error => setMessage(errorText(error)));
            return unsubscribe;
        }, []);

        const chooseTheme = useCallback(themeId => {
            const currentApi = appearanceApi();
            if (!currentApi) { setMessage('本地外观模块尚未加载，请刷新页面后重试。'); return; }
            const next = currentApi.setTheme(themeId);
            setSnapshot({ ...next });
            setMessage(next?.error || `已切换为${THEME_OPTIONS.find(item => item.id === themeId)?.label || '新主题'}。`);
        }, []);

        const saveCover = useCallback(async file => {
            const currentApi = appearanceApi();
            if (!currentApi || !file) return;
            setBusy(true);
            setMessage('正在处理封面，请稍候…');
            try {
                const next = await currentApi.setCover(file);
                setSnapshot({ ...next });
                if (!next?.coverUrl) throw new Error('封面未能保存，请稍后重试。');
                setMessage('封面已保存到当前设备。');
            } catch (error) {
                setMessage(errorText(error));
            } finally {
                setBusy(false);
            }
        }, []);

        const clearCover = useCallback(async () => {
            const currentApi = appearanceApi();
            if (!currentApi) { setMessage('本地外观模块尚未加载，请刷新页面后重试。'); return; }
            setBusy(true);
            setMessage('正在恢复默认封面…');
            try {
                const next = await currentApi.clearCover();
                setSnapshot({ ...next });
                if (next?.coverUrl) throw new Error('默认封面恢复失败，请稍后重试。');
                setMessage('已恢复默认封面。');
            } catch (error) {
                setMessage(errorText(error));
            } finally {
                setBusy(false);
            }
        }, []);

        const restoreDefaults = useCallback(async () => {
            const currentApi = appearanceApi();
            if (!currentApi) { setMessage('本地外观模块尚未加载，请刷新页面后重试。'); return; }
            setBusy(true);
            setMessage('正在恢复默认外观…');
            try {
                const themeSnapshot = currentApi.setTheme('violet');
                const positionSnapshot = currentApi.setCoverPosition(50);
                const preferenceError = themeSnapshot?.error || positionSnapshot?.error || '';
                const next = await currentApi.clearCover();
                setSnapshot({ ...next });
                if (next?.coverUrl || preferenceError || next?.error) {
                    throw new Error(next?.error || preferenceError || '默认外观恢复失败，请稍后重试。');
                }
                setMessage('已恢复默认外观。');
            } catch (error) {
                setMessage(errorText(error));
            } finally {
                setBusy(false);
            }
        }, []);

        const updatePosition = event => {
            const currentApi = appearanceApi();
            if (!currentApi) return;
            const next = currentApi.setCoverPosition(event.target.value);
            setSnapshot({ ...next });
            if (next?.error) setMessage(next.error);
        };

        const onFileChange = event => {
            const file = event.target.files?.[0] || null;
            event.target.value = '';
            if (file) void saveCover(file);
        };

        return (
            <section className="xy-phone-appearance-panel" aria-label="手机外观与封面">
                <div className="xy-phone-appearance-heading">
                    <div>
                        <p className="xy-phone-appearance-eyebrow">PHONE APPEARANCE</p>
                        <h3>手机外观</h3>
                        <p>只影响这台设备，不会修改电脑端主题或云端资料。</p>
                    </div>
                </div>

                <fieldset className="xy-phone-appearance-themes">
                    <legend>选择主题</legend>
                    <div className="xy-phone-appearance-swatches">
                        {THEME_OPTIONS.map(option => (
                            <label key={option.id} className={`xy-phone-appearance-swatch ${snapshot.themeId === option.id ? 'is-selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="xingyue-phone-theme"
                                    value={option.id}
                                    checked={snapshot.themeId === option.id}
                                    onChange={() => chooseTheme(option.id)}
                                    disabled={busy}
                                />
                                <span className="xy-phone-appearance-swatch-dot" style={{ backgroundColor: option.color }} aria-hidden="true" />
                                <span><strong>{option.label}</strong><small>{option.hint}</small></span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <div className="xy-phone-appearance-cover">
                    <div className="xy-phone-appearance-cover-heading">
                        <div>
                            <h4>首页封面</h4>
                            <p>只更换首页大图，不改变头像和聊天背景；照片保存在当前设备。</p>
                        </div>
                        {snapshot.coverUrl && <span className="xy-phone-appearance-cover-state">已设置</span>}
                    </div>
                    {snapshot.coverUrl ? (
                        <div className="xy-phone-appearance-cover-preview" style={{ backgroundImage: `url("${snapshot.coverUrl}")`, backgroundPosition: `center ${snapshot.coverPosition}%` }} aria-label="当前本地封面预览" />
                    ) : (
                        <div className="xy-phone-appearance-cover-empty">尚未设置自定义封面，将使用默认外观。</div>
                    )}
                    <label className="xy-phone-appearance-file-button">
                        <span>{busy ? '正在处理…' : '选择本地图片'}</span>
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFileChange} disabled={busy} />
                    </label>
                    <label className="xy-phone-appearance-position">
                        <span>封面位置</span>
                        <input type="range" min="0" max="100" value={snapshot.coverPosition} onChange={updatePosition} disabled={busy || !snapshot.coverUrl} />
                        <output>{snapshot.coverPosition}%</output>
                    </label>
                </div>

                <div className="xy-phone-appearance-actions">
                    {snapshot.coverUrl && <button type="button" onClick={() => void clearCover()} disabled={busy}>恢复默认封面</button>}
                    <button type="button" onClick={() => void restoreDefaults()} disabled={busy}>恢复默认外观</button>
                </div>
                <p className="xy-phone-appearance-local-note">当前设备保存：图片会先压缩后存入本机，不会上传到云端。</p>
                {(snapshot.error || message) && <p className={snapshot.error ? 'xy-phone-appearance-error' : 'xy-phone-appearance-status'} role={snapshot.error ? 'alert' : undefined}>{snapshot.error || message}</p>}
            </section>
        );
    }

    global.XingyuePhoneAppearancePanel = Object.freeze({ AppearancePanel });
})(window);
