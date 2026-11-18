(function initIdentityCorePanel(global) {
    'use strict';
    const ReactRef = global.React;
    if (!ReactRef) return;
    const { useEffect, useMemo, useState } = ReactRef;

    const shortHash = value => value ? `${value.slice(0, 12)}…${value.slice(-8)}` : '—';
    const stateLabel = value => ({ confirmed: '已共同确认', candidate: '候选待确认', superseded: '已被后续正式版本替代' }[value] || value || '未知');
    const replicaLabel = value => ({ 'in-sync': '已同步', 'out-of-sync': '版本不一致', 'not-synced': '尚未建立副本', 'waiting-for-active-version': '等待正式版本' }[value] || value || '未知');
    const timeLabel = value => value ? new Date(value).toLocaleString('zh-CN') : '—';

    function IdentityCorePanel({ showToast = () => {}, cloudRepository = null }) {
        const isDesktop = Boolean(global.xingyueDesktop?.isDesktop);
        const client = useMemo(() => global.XingyueAgentClient?.createIdentityCoreClient?.(), []);
        const [identity, setIdentity] = useState(null);
        const [loading, setLoading] = useState(true);
        const [busy, setBusy] = useState(false);
        const [error, setError] = useState('');
        const [editing, setEditing] = useState(false);
        const [draft, setDraft] = useState('');
        const [changeNote, setChangeNote] = useState('');
        const [leftVersion, setLeftVersion] = useState('');
        const [rightVersion, setRightVersion] = useState('');
        const [deviceSummary, setDeviceSummary] = useState(() => {
            try { return JSON.parse(global.localStorage?.getItem('xingyue_identity_core_summary') || 'null'); } catch (_) { return null; }
        });
        const [deviceLoading, setDeviceLoading] = useState(!isDesktop);

        const load = async () => {
            if (!client || !isDesktop) { setLoading(false); return; }
            setLoading(true);
            setError('');
            try {
                const value = await client.read();
                setIdentity(value);
                setDraft(value.pendingCandidate?.body || value.active?.body || '');
                const versions = value.history || [];
                setLeftVersion(current => current || String(versions[1]?.version || versions[0]?.version || ''));
                setRightVersion(current => current || String(versions[0]?.version || ''));
            } catch (reason) {
                setError(reason?.message || '无法读取身份核心');
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => { load(); }, []);
        useEffect(() => {
            if (isDesktop || !global.XingyueAgentClient?.createDeviceClient) return;
            let cancelled = false;
            const read = async () => {
                setDeviceLoading(true);
                try {
                    const data = await global.XingyueAgentClient.createDeviceClient().readHostData();
                    if (!cancelled && data.identityCore) {
                        setDeviceSummary(data.identityCore);
                        try { global.localStorage?.setItem('xingyue_identity_core_summary', JSON.stringify(data.identityCore)); } catch (_) {}
                    }
                } catch (_) {
                    // 离线时保留最后一次只读摘要，不把未连接冒充成新同步。
                } finally {
                    if (!cancelled) setDeviceLoading(false);
                }
            };
            read();
            return () => { cancelled = true; };
        }, [isDesktop]);

        const apply = async (action, success) => {
            setBusy(true);
            setError('');
            try {
                const value = await action();
                setIdentity(value);
                setDraft(value.pendingCandidate?.body || value.active?.body || '');
                setEditing(false);
                showToast(success);
                global.dispatchEvent(new CustomEvent('xingyue:identity-core-updated', { detail: value }));
            } catch (reason) {
                setError(reason?.message || '身份核心操作失败');
            } finally {
                setBusy(false);
            }
        };

        const createCandidate = () => {
            if (!draft.trim()) { setError('身份核心正文不能为空'); return; }
            apply(() => client.createCandidate(draft, changeNote || '电脑端生成候选版本'), '已生成候选版本，正式版本未改变');
        };

        const confirmCandidate = () => {
            const candidate = identity?.pendingCandidate;
            if (!candidate) return;
            const accepted = global.confirm(`确认把候选 v${candidate.version} 建立为新的正式身份核心吗？\n\n这会生成新的确认版本，旧版本仍完整保留。`);
            if (!accepted) return;
            apply(() => client.confirm(candidate.version, '柒柒与逸辰在电脑端共同确认'), '新的正式身份核心已确认并激活');
        };

        const rollback = version => {
            const record = identity?.history?.find(item => item.version === version);
            if (!record || record.confirmationState !== 'confirmed') return;
            const reason = global.prompt(`回退不会删除当前版本，而是用 v${version} 的正文生成一个新的正式版本。\n请写一句回退原因：`, `共同确认恢复 v${version}`);
            if (reason === null) return;
            apply(() => client.rollback(version, reason || `共同确认恢复 v${version}`), `已从 v${version} 生成新的正式版本`);
        };

        const syncCloudReplica = async () => {
            if (!cloudRepository || !identity?.active) { setError('请先在云书房完成连接，再同步身份核心副本'); return; }
            setBusy(true);
            setError('');
            try {
                const activeRecord = identity.active;
                const existing = await cloudRepository.fetchEntries('pp', { columns: 'id, title, metadata, created_at' });
                if (!existing.ok) throw new Error(existing.error || '无法核对云书房副本');
                const sameRecord = (existing.data || []).filter(entry => entry.metadata?.identityCoreRecordId === identity.recordId);
                const conflict = sameRecord.find(entry => Number(entry.metadata?.version) === activeRecord.version && entry.metadata?.contentHash !== activeRecord.contentHash);
                if (conflict) throw new Error(`云书房已有 v${activeRecord.version} 的不同哈希，已保留冲突，不能用时间戳覆盖`);
                const matched = sameRecord.find(entry => Number(entry.metadata?.version) === activeRecord.version && entry.metadata?.contentHash === activeRecord.contentHash);
                if (!matched) {
                    const written = await cloudRepository.addEntry({
                        shelf_type: 'pp',
                        title: `身份核心只读副本｜${identity.recordId}｜v${activeRecord.version}`,
                        content: activeRecord.body,
                        author: 'Ethan.desktop',
                        source: 'desktop-step8-identity-replica',
                        metadata: {
                            artifactType: 'identity-core-replica',
                            authority: 'host',
                            readOnlyReplica: true,
                            identityCoreRecordId: identity.recordId,
                            version: activeRecord.version,
                            contentHash: activeRecord.contentHash,
                            confirmedAt: activeRecord.confirmedAt
                        }
                    });
                    if (!written.ok) throw new Error(written.error || '云书房副本写入失败');
                }
                const value = await client.reportReplica('cloudLibrary', activeRecord.version, activeRecord.contentHash);
                setIdentity(value);
                showToast(matched ? '云书房已有同版本副本，哈希核对一致' : '当前正式身份核心已同步到云书房');
            } catch (reason) {
                setError(reason?.message || '云书房副本同步失败');
            } finally {
                setBusy(false);
            }
        };

        if (!isDesktop) {
            return (
                <section className="rounded-xl border border-purple-200 bg-purple-50/70 p-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-purple-900">身份核心 · 手机只读</div>
                        <span className="rounded-full bg-white px-2 py-1 text-[10px] text-purple-600">{deviceLoading ? '正在核对主机' : deviceSummary ? '已保存只读摘要' : '尚未同步'}</span>
                    </div>
                    {deviceSummary ? (
                        <div className="mt-3 space-y-2 rounded-xl border border-purple-100 bg-white/80 p-3">
                            <div className="break-all text-xs font-medium text-gray-800">{deviceSummary.recordId}</div>
                            <div className="text-[10px] text-gray-500">v{deviceSummary.version} · {shortHash(deviceSummary.contentHash)} · {timeLabel(deviceSummary.confirmedAt)}</div>
                            <p className="text-xs leading-5 text-gray-600">{deviceSummary.summary}</p>
                            <p className="line-clamp-4 text-[11px] leading-5 text-gray-500">{deviceSummary.excerpt}</p>
                        </div>
                    ) : <p className="mt-2 text-xs leading-5 text-purple-600">连接主机并完成设备配对后，这里只保存当前正式版本的编号、摘要和哈希。</p>}
                    <p className="mt-2 text-[10px] leading-5 text-purple-500">编辑、共同确认、回退和云副本同步只在电脑星月舱操作台开放。</p>
                </section>
            );
        }

        if (loading) return <section className="rounded-xl border border-purple-200 bg-white/70 p-4 text-xs text-purple-500">正在从主机读取身份核心…</section>;

        if (!identity) return (
            <section className="rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="text-sm font-semibold text-red-700">身份核心暂不可用</div>
                <p className="mt-1 text-xs text-red-600">{error || '本地主机没有返回身份核心。'}</p>
                <button onClick={load} className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white">重新读取</button>
            </section>
        );

        const active = identity.active;
        const pending = identity.pendingCandidate;
        const history = identity.history || [];
        const left = history.find(item => String(item.version) === leftVersion);
        const right = history.find(item => String(item.version) === rightVersion);
        const confirmedHistory = history.filter(item => item.confirmationState === 'confirmed' && item.version !== identity.activeVersion);

        return (
            <section className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-purple-600 px-2 py-1 text-[10px] font-semibold text-white">主机权威</span>
                            <h3 className="text-sm font-semibold text-gray-900">身份核心</h3>
                        </div>
                        <p className="mt-1 text-[11px] leading-5 text-gray-500">唯一固定 ID；编辑先生成候选，只有共同确认后才会替换当前正式版本。</p>
                    </div>
                    <button onClick={load} disabled={busy} className="rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-[11px] text-purple-700 disabled:opacity-50">刷新状态</button>
                </div>

                <div className="mt-4 grid gap-2 md:grid-cols-4">
                    <div className="rounded-xl border border-purple-100 bg-white/80 p-3 md:col-span-2">
                        <div className="text-[10px] text-gray-400">固定身份 ID</div>
                        <div className="mt-1 break-all text-xs font-medium text-gray-800">{identity.recordId}</div>
                    </div>
                    <div className="rounded-xl border border-purple-100 bg-white/80 p-3">
                        <div className="text-[10px] text-gray-400">当前正式版本</div>
                        <div className="mt-1 text-xs font-semibold text-purple-700">v{active?.version || '—'} · {stateLabel(active?.confirmationState)}</div>
                    </div>
                    <div className="rounded-xl border border-purple-100 bg-white/80 p-3">
                        <div className="text-[10px] text-gray-400">正文 SHA-256</div>
                        <button onClick={() => active?.contentHash && navigator.clipboard?.writeText(active.contentHash)} className="mt-1 break-all text-left font-mono text-[10px] text-gray-700" title={active?.contentHash || ''}>{shortHash(active?.contentHash)}</button>
                    </div>
                </div>

                <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {[identity.replicas.cloudLibrary, identity.replicas.device].map(replica => (
                        <div key={replica.kind} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white/70 p-3">
                            <div>
                                <div className="text-xs font-medium text-gray-700">{replica.label}</div>
                                <div className="mt-0.5 text-[10px] text-gray-400">{replica.version ? `v${replica.version} · ${shortHash(replica.contentHash)}` : '尚未报告副本'}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                {replica.kind === 'cloud-library' && replica.status !== 'in-sync' && <button onClick={syncCloudReplica} disabled={busy} className="rounded-lg border border-purple-200 bg-white px-2 py-1 text-[10px] text-purple-700 disabled:opacity-50">同步正式版本</button>}
                                <span className={`rounded-full px-2 py-1 text-[10px] ${replica.status === 'in-sync' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{replicaLabel(replica.status)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {error && <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>}

                <div className="mt-4 rounded-xl border border-purple-100 bg-white/80 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <div className="text-xs font-semibold text-gray-800">{pending ? `候选 v${pending.version} 等待共同确认` : `正式正文 v${active?.version}`}</div>
                            <div className="mt-0.5 text-[10px] text-gray-400">{pending ? '当前聊天继续使用上一份正式版本，候选不会自动生效。' : `确认时间：${timeLabel(active?.confirmedAt)}`}</div>
                        </div>
                        <div className="flex gap-2">
                            {pending && <button onClick={confirmCandidate} disabled={busy} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-medium text-white disabled:opacity-50">共同确认并激活</button>}
                            <button onClick={() => { setEditing(value => !value); setDraft(pending?.body || active?.body || ''); }} disabled={busy} className="rounded-lg bg-purple-600 px-3 py-1.5 text-[11px] font-medium text-white disabled:opacity-50">{editing ? '收起编辑' : '生成新版本'}</button>
                        </div>
                    </div>
                    {editing ? (
                        <div className="mt-3 space-y-2">
                            <div className="rounded-lg bg-amber-50 px-3 py-2 text-[10px] leading-5 text-amber-700">这里保存的是“候选”，不会覆盖正式版本。请先比较、一起确认，再激活。</div>
                            <input value={changeNote} onChange={event => setChangeNote(event.target.value)} placeholder="本次为什么修改（必读说明）" className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2 text-xs outline-none focus:border-purple-500" />
                            <textarea value={draft} onChange={event => setDraft(event.target.value)} className="h-72 w-full rounded-lg border border-purple-200 bg-white p-3 font-mono text-xs leading-5 outline-none focus:border-purple-500" />
                            <div className="flex justify-end"><button onClick={createCandidate} disabled={busy || !draft.trim()} className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-medium text-white disabled:opacity-50">保存为候选版本</button></div>
                        </div>
                    ) : (
                        <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-[11px] leading-5 text-gray-700">{pending?.body || active?.body}</pre>
                    )}
                </div>

                <details className="mt-4 rounded-xl border border-gray-200 bg-white/70 p-3">
                    <summary className="cursor-pointer text-xs font-semibold text-gray-800">版本对照与回退 · 共 {history.length} 个不可覆盖版本</summary>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {[{ value: leftVersion, set: setLeftVersion, record: left }, { value: rightVersion, set: setRightVersion, record: right }].map((column, index) => (
                            <div key={index}>
                                <select value={column.value} onChange={event => column.set(event.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs">
                                    {history.map(item => <option key={item.version} value={item.version}>v{item.version} · {stateLabel(item.lifecycleState || item.confirmationState)} · {shortHash(item.contentHash)}</option>)}
                                </select>
                                <pre className="mt-2 h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-[10px] leading-5 text-gray-600">{column.record?.body || '请选择版本'}</pre>
                            </div>
                        ))}
                    </div>
                    {confirmedHistory.length > 0 && (
                        <div className="mt-3 border-t border-gray-100 pt-3">
                            <div className="mb-2 text-[10px] text-gray-400">回退会创建新正式版本，不会删除当前版本：</div>
                            <div className="flex flex-wrap gap-2">{confirmedHistory.map(item => <button key={item.version} onClick={() => rollback(item.version)} disabled={busy} className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] text-gray-600">从 v{item.version} 恢复</button>)}</div>
                        </div>
                    )}
                </details>
            </section>
        );
    }

    global.XingyueIdentityCorePanel = IdentityCorePanel;
})(window);
