(function initDevicePairingPanel(global) {
    'use strict';

    const mobileManualHandoff = global.XINGYUE_MOBILE_RUNTIME?.manualHandoff === true;

    function DevicePairingPanel({ Icon, desktopAvailable, apiConfig }) {
        const client = React.useMemo(() => global.XingyueAgentClient.createDeviceClient(), []);
        const [pairing, setPairing] = React.useState(null);
        const [devices, setDevices] = React.useState([]);
        const [deviceState, setDeviceState] = React.useState({ state: 'checking', device: null });
        const [deviceName, setDeviceName] = React.useState(() => client.getSavedDevice()?.name || '柒柒的手机');
        const [code, setCode] = React.useState('');
        const [message, setMessage] = React.useState('');
        const [hostSummary, setHostSummary] = React.useState(null);
        const [busy, setBusy] = React.useState(false);

        const refresh = React.useCallback(async () => {
            setDeviceState(await client.check());
            if (desktopAvailable) {
                const response = await client.listDevices();
                if (response.ok) setDevices(response.data?.devices || []);
            }
        }, [client, desktopAvailable]);

        React.useEffect(() => { void refresh(); }, [refresh]);

        const startPairing = async () => {
            setBusy(true); setMessage(''); setPairing(null);
            try {
                const response = await client.startPairing();
                if (!response.ok || !response.data?.pairing) throw new Error(response.data?.error || '无法生成配对码');
                setPairing(response.data.pairing);
                setCode(response.data.pairing.code);
                setMessage('一次性配对码已生成，5 分钟内使用一次后立即失效。');
            } catch (error) { setMessage(error.message); }
            finally { setBusy(false); }
        };

        const pairThisDevice = async () => {
            setBusy(true); setMessage(''); setHostSummary(null);
            try {
                const device = await client.pair(code.trim(), deviceName.trim());
                setDeviceState({ state: 'connected', device });
                setPairing(null); setCode('');
                setMessage(`✓ ${device.name} 已成功配对，访问凭证只保存在这台设备。`);
                await refresh();
                const hostData = await client.readHostData();
                setHostSummary({
                    sessions: hostData.sessions?.length || 0,
                    healthDays: Object.keys(hostData.collections?.healthRecords || {}).length,
                    memories: (hostData.collections?.memories?.length || 0) + (hostData.collections?.longTermMemories?.length || 0)
                });
                if (!(hostData.sessions?.length || 0)) await global.XingyueHostSync?.flushQueue();
            } catch (error) { setMessage(error.message); }
            finally { setBusy(false); }
        };

        const verifyRead = async () => {
            setBusy(true); setMessage('');
            try {
                const data = await client.readHostData();
                setHostSummary({
                    sessions: data.sessions?.length || 0,
                    healthDays: Object.keys(data.collections?.healthRecords || {}).length,
                    memories: (data.collections?.memories?.length || 0) + (data.collections?.longTermMemories?.length || 0)
                });
                setMessage('✓ 设备凭证有效，已成功读取主机数据摘要。');
            } catch (error) { setHostSummary(null); setMessage(error.message); await refresh(); }
            finally { setBusy(false); }
        };

        const restoreFromHost = async () => {
            setBusy(true); setMessage('正在从主机恢复聊天和记忆…'); setHostSummary(null);
            try {
                let data = await client.readHostData();
                if (Number(data.sync?.conflictCount || 0) > 0) {
                    if (mobileManualHandoff) {
                        throw new Error('检测到主机与手机存在未解决的同步冲突。请先查看冲突并明确交接写入权，再恢复到手机；手机不会自动接受主机冲突。');
                    }
                    await global.XingyueHostSync?.acceptHost2Conflicts();
                    data = await client.readHostData();
                }
                const apiTransfer = await client.claimApiSettings();
                if (apiTransfer?.apiSettings) data = { ...data, apiSettings: apiTransfer.apiSettings, apiSecretCount: apiTransfer.secretCount, apiSettingsMode: apiTransfer.mode };
                if (typeof global.XingyueRestoreHostData !== 'function') throw new Error('星月舱恢复模块尚未就绪');
                await global.XingyueHostSync?.adoptHostData(data);
                const summary = await global.XingyueRestoreHostData(data);
                setHostSummary(summary);
                const apiNote = summary.apiTransferStats?.replaced
                    ? `，已从确认的备份恢复 ${summary.apiSecrets} 项 API Key`
                    : summary.apiTransferStats
                        ? `，API 安全合并：新增 ${summary.apiTransferStats.addedSecrets} 项、保留 ${summary.apiTransferStats.preservedSecrets} 项${summary.apiTransferStats.differingSecretsSkipped ? `、跳过 ${summary.apiTransferStats.differingSecretsSkipped} 项不同 Key` : ''}`
                        : mobileManualHandoff && apiTransfer === null
                            ? '，本次未领取到 API 设置；若需同步，请在电脑为这台设备授权后重试（授权 5 分钟内有效）'
                        : '';
                setMessage(`✓ 已从主机恢复 ${summary.sessions} 个聊天窗口${apiNote}，侧边栏已更新。`);
            } catch (error) { setHostSummary(null); setMessage(error.message); }
            finally { setBusy(false); }
        };

        const authorizeApiSettings = async device => {
            setBusy(true); setMessage('');
            try {
                const response = await client.offerApiSettings(device.id, apiConfig || {}, 'merge');
                if (!response.ok || !response.data?.offer) throw new Error(response.data?.error || '无法创建 API 设置直传授权');
                setMessage(`✓ 已允许 ${device.name} 在 5 分钟内领取一次 API 设置（${response.data.offer.secretCount} 项 Key）。请到手机点击“从主机恢复到这台设备”。`);
            } catch (error) { setMessage(error.message); }
            finally { setBusy(false); }
        };

        const authorizeApiSettingsFromBackup = async (device, file) => {
            if (!file) return;
            setBusy(true); setMessage('正在只读检查备份中的 API 设置…');
            try {
                const data = JSON.parse(await file.text());
                const backupConfig = data?.config || {};
                const secretCount = global.XingyueOpenAI?.countConfiguredSecrets?.(backupConfig) || 0;
                const presetCount = Array.isArray(backupConfig.apiPresets) ? backupConfig.apiPresets.length : 0;
                if (!secretCount) throw new Error('这份备份中没有可恢复的 API Key');
                if (!window.confirm(`确认只用这份备份恢复手机 API 设置？\n\n检测到 ${presetCount} 个预设、${secretCount} 项 Key。\n聊天、记忆和健康记录不会从这份备份恢复。`)) {
                    setMessage('已取消 API 设置恢复。'); return;
                }
                const response = await client.offerApiSettings(device.id, backupConfig, 'replace-confirmed');
                if (!response.ok || !response.data?.offer) throw new Error(response.data?.error || '无法创建备份 API 设置恢复授权');
                setMessage(`✓ 已准备从备份恢复 ${presetCount} 个预设、${response.data.offer.secretCount} 项 Key；5 分钟内请到手机点击“从主机恢复到这台设备”。`);
            } catch (error) { setMessage(`API 设置恢复失败：${error.message}`); }
            finally { setBusy(false); }
        };

        const revoke = async device => {
            setBusy(true); setMessage('');
            try {
                const response = await client.revokeDevice(device.id);
                if (!response.ok) throw new Error(response.data?.error || '撤销失败');
                setMessage(`已撤销 ${device.name}；它原来的凭证不能再读取主机。`);
                await refresh();
            } catch (error) { setMessage(error.message); }
            finally { setBusy(false); }
        };

        const statusText = deviceState.state === 'connected'
            ? `已连接：${deviceState.device?.name || '这台设备'}`
            : deviceState.state === 'revoked' ? '访问已撤销或凭证失效' : '这台设备尚未配对';

        return (
            <div className="space-y-4">
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
                    <div className="flex gap-3 items-start">
                        <Icon name="ShieldCheck" size={21} className="text-indigo-600 mt-0.5" />
                        <div><h3 className="text-sm font-semibold text-gray-800">手机设备配对</h3><p className="text-xs text-gray-600 mt-1 leading-relaxed">未配对设备不能读取主机数据。配对码只能使用一次；手机凭证撤销后立即失效。本步只建立星月舱自己的设备锁，不配置远程网络。</p></div>
                    </div>
                </div>

                {desktopAvailable && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <div className="flex-1"><h4 className="text-sm font-semibold text-gray-800">电脑主机</h4><p className="text-xs text-gray-500 mt-1">在电脑端生成一次性配对码。</p></div>
                            <button disabled={busy} onClick={startPairing} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium">生成一次性配对码</button>
                        </div>
                        {pairing && <div className="mt-4 rounded-xl bg-slate-900 text-white text-center p-5"><div className="text-xs text-slate-300">5 分钟内有效 · 仅可使用一次</div><div className="font-mono text-4xl tracking-[0.28em] mt-2 pl-[0.28em]">{pairing.code}</div></div>}
                    </div>
                )}

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3"><div><h4 className="text-sm font-semibold text-gray-800">这台设备</h4><p className={`text-xs mt-1 ${deviceState.state === 'connected' ? 'text-emerald-600' : 'text-gray-500'}`}>{statusText}</p></div><span className={`w-3 h-3 rounded-full ${deviceState.state === 'connected' ? 'bg-emerald-500' : 'bg-gray-300'}`}></span></div>
                    {mobileManualHandoff && deviceState.device?.id && <div className="mt-2 space-y-0.5 text-[10px] text-gray-500"><div>设备 ID：<span className="font-mono break-all">{deviceState.device.id}</span></div><div>最近验证：{deviceState.device.lastSeenAt ? new Date(deviceState.device.lastSeenAt).toLocaleString('zh-CN') : '尚未'}</div></div>}
                    {deviceState.state !== 'connected' ? (
                        <div className="grid md:grid-cols-[1fr_160px_auto] gap-2 mt-4">
                            <input value={deviceName} onChange={event => setDeviceName(event.target.value)} placeholder="设备名称，例如：柒柒的手机" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                            <input value={code} onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="6 位配对码" className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono tracking-widest" />
                            <button disabled={busy || code.length !== 6} onClick={pairThisDevice} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium">配对这台设备</button>
                        </div>
                    ) : (
                        <div className="mt-4 flex flex-wrap gap-2">
                            <button disabled={busy} onClick={restoreFromHost} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium">从主机恢复到这台设备</button>
                            <button disabled={busy} onClick={verifyRead} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium">验证读取主机数据</button>
                            <button onClick={() => { client.forget(); setDeviceState({ state: 'unpaired', device: null }); setHostSummary(null); }} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm">仅清除本机凭证</button>
                        </div>
                    )}
                    {hostSummary && <div className="grid grid-cols-3 gap-2 mt-3 text-center"><div className="bg-emerald-50 rounded-lg p-2"><b>{hostSummary.sessions}</b><div className="text-[10px] text-gray-500">聊天窗口</div></div><div className="bg-emerald-50 rounded-lg p-2"><b>{hostSummary.healthDays}</b><div className="text-[10px] text-gray-500">健康记录</div></div><div className="bg-emerald-50 rounded-lg p-2"><b>{hostSummary.memories}</b><div className="text-[10px] text-gray-500">记忆条目</div></div></div>}
                </div>

                {desktopAvailable && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <h4 className="text-sm font-semibold text-gray-800">已配对设备</h4>
                        <div className="mt-3 space-y-2">
                            {devices.length === 0 && <div className="text-xs text-gray-500">还没有设备完成配对。</div>}
                            {devices.map(device => <div key={device.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-gray-50 p-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${device.status === 'connected' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                <div className="flex-1 min-w-[160px]"><div className="text-sm text-gray-800">{device.name}</div><div className="text-[10px] text-gray-500">{device.status === 'connected' ? '已连接' : '已撤销'} · 最近验证 {device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString() : '尚未'}</div></div>
                                {device.status === 'connected' && <button disabled={busy} onClick={() => authorizeApiSettings(device)} className="px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 text-xs hover:bg-indigo-50">允许本次同步 API 设置</button>}
                                {device.status === 'connected' && <label className={`px-3 py-1.5 rounded-lg border border-amber-200 text-amber-700 text-xs hover:bg-amber-50 cursor-pointer ${busy ? 'opacity-50 pointer-events-none' : ''}`}>从备份恢复 API 设置<input type="file" accept="application/json,.json" className="hidden" onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; void authorizeApiSettingsFromBackup(device, file); }} /></label>}
                                {device.status === 'connected' && <button disabled={busy} onClick={() => revoke(device)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs hover:bg-red-50">撤销访问</button>}
                            </div>)}
                        </div>
                    </div>
                )}

                {message && <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 text-xs text-gray-700">{message}</div>}
            </div>
        );
    }

    global.XingyueDevicePairingPanel = DevicePairingPanel;
})(window);
