(function initMemoryGovernancePanel(global) {
    'use strict';

    const { useEffect, useMemo, useState } = React;
    const statusLabel = {
        confirmed: '已确认',
        candidate: '候选',
        'historical-unreviewed': '历史未复核',
        rejected: '已驳回',
        superseded: '已替代',
        conflicted: '待解决冲突'
    };
    const categoryLabel = {
        fact: '事实',
        'shared-agreement': '共同约定',
        'ethan-self-statement': '逸辰自述',
        'interpretive-observation': '解释性观察',
        'historical-unclassified': '旧资料未分类'
    };

    function MemoryGovernancePanel({ showToast = () => {} }) {
        const desktop = typeof global.xingyueDesktop?.requestLocalAgent === 'function';
        const client = useMemo(() => global.XingyueAgentClient?.createMemoryGovernanceClient?.(), []);
        const [governance, setGovernance] = useState(() => {
            try { return JSON.parse(global.localStorage?.getItem('xingyue_memory_governance_summary') || 'null'); } catch (_) { return null; }
        });
        const [loading, setLoading] = useState(true);
        const [busy, setBusy] = useState('');
        const [error, setError] = useState('');

        const publish = value => {
            setGovernance(value);
            try {
                global.localStorage?.setItem('xingyue_memory_governance_summary', JSON.stringify(desktop ? {
                    readOnly: true,
                    activePayload: value?.activePayload || '',
                    counts: value?.counts || {},
                    updatedAt: value?.updatedAt || null
                } : value));
            } catch (_) {}
            global.dispatchEvent(new CustomEvent('xingyue:memory-governance-updated', { detail: value }));
        };

        const refresh = async () => {
            setLoading(true);
            setError('');
            try {
                if (desktop) publish(await client.read());
                else {
                    const data = await global.XingyueAgentClient.createDeviceClient().readHostData();
                    if (!data?.memoryGovernance) throw new Error('主机尚未返回记忆摘要');
                    publish(data.memoryGovernance);
                }
            } catch (reason) {
                setError(reason?.message || '记忆治理仓暂时不可用');
            } finally { setLoading(false); }
        };

        useEffect(() => { refresh(); }, []);

        const act = async (key, action, success) => {
            if (!client || busy) return;
            setBusy(key);
            setError('');
            try {
                const result = await action();
                publish(result.memoryGovernance);
                showToast(success);
            } catch (reason) {
                setError(reason?.message || '记忆治理操作失败');
            } finally { setBusy(''); }
        };

        const records = Array.isArray(governance?.records) ? governance.records : [];
        const candidates = records.filter(record => record.confirmationState === 'candidate');
        const confirmed = records.filter(record => record.confirmationState === 'confirmed' && record.activation !== 'active');
        const counts = governance?.counts || {};

        return (
            <section className="bg-white border border-indigo-100 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">记忆确认与版本仓</h3>
                        <p className="text-[10px] text-indigo-500 mt-1">主机权威 · 原文可追溯 · 修订不覆盖旧版本</p>
                    </div>
                    <button onClick={refresh} disabled={loading} className="text-[10px] px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 disabled:opacity-50">刷新</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                    {[
                        ['confirmed', '已确认'], ['candidate', '候选'], ['historical-unreviewed', '历史未复核'], ['rejected', '已驳回']
                    ].map(([key, label]) => (
                        <div key={key} className="rounded-lg bg-gray-50 border border-gray-100 px-2 py-2">
                            <div className="text-base font-semibold text-gray-700">{Number(counts[key] || 0)}</div>
                            <div className="text-[9px] text-gray-500">{label}</div>
                        </div>
                    ))}
                </div>

                {error && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">{error}</div>}
                {loading && <div className="text-xs text-gray-400">正在读取主机记忆状态…</div>}

                {governance?.activePayload && (
                    <details className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                        <summary className="text-xs font-medium text-emerald-700 cursor-pointer">当前每轮注入：最小活跃摘要</summary>
                        <pre className="mt-3 whitespace-pre-wrap text-[10px] leading-relaxed text-gray-600 font-sans max-h-72 overflow-y-auto">{governance.activePayload}</pre>
                    </details>
                )}

                {!desktop && (
                    <div className="text-[10px] text-gray-500 bg-gray-50 rounded-lg p-3">
                        手机端只显示状态与活跃摘要；确认、驳回、修订和撤回留在电脑星月舱操作台。
                    </div>
                )}

                {desktop && candidates.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-amber-700">等待共同确认</h4>
                        {candidates.map(record => (
                            <article key={`${record.recordId}-${record.version}`} className="border border-amber-100 bg-amber-50/40 rounded-lg p-3 space-y-2">
                                <div className="flex justify-between gap-3">
                                    <div className="text-xs font-medium text-gray-700">{record.title}</div>
                                    <div className="text-[9px] text-gray-400">{categoryLabel[record.category] || record.category} · v{record.version}</div>
                                </div>
                                <div className="text-[11px] text-gray-600 whitespace-pre-wrap">{record.body}</div>
                                <div className="text-[9px] text-gray-400">来源：{record.sourceLabel}</div>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => act(`reject:${record.recordId}`, () => client.reject({ recordId: record.recordId }), '候选已驳回，原版本仍保留')} disabled={Boolean(busy)} className="text-[10px] px-2 py-1 rounded bg-white border border-gray-200 text-gray-600 disabled:opacity-50">驳回</button>
                                    <button onClick={() => act(`confirm:${record.recordId}`, () => client.confirm({ recordId: record.recordId, version: record.version, activation: 'on-demand' }), '候选已共同确认为按需记忆')} disabled={Boolean(busy)} className="text-[10px] px-2 py-1 rounded bg-amber-600 text-white disabled:opacity-50">确认并按需保存</button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {desktop && confirmed.length > 0 && (
                    <details className="rounded-lg border border-gray-100 p-3">
                        <summary className="text-xs font-medium text-gray-700 cursor-pointer">已确认的按需记忆（{confirmed.length}）</summary>
                        <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
                            {confirmed.map(record => (
                                <article key={`${record.recordId}-${record.version}`} className="border border-gray-100 rounded-lg p-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-[11px] font-medium text-gray-700">{record.title}</div>
                                            <div className="text-[9px] text-gray-400">{categoryLabel[record.category] || record.category} · {statusLabel[record.confirmationState]} · v{record.version}</div>
                                        </div>
                                        <button onClick={() => act(`withdraw:${record.recordId}`, () => client.withdraw({ recordId: record.recordId, reason: '柒柒在电脑操作台明确撤回' }), '记忆已撤回，确认版本仍保留在历史链中')} disabled={Boolean(busy)} className="text-[9px] px-2 py-1 rounded bg-red-50 text-red-600 disabled:opacity-50">撤回</button>
                                    </div>
                                    <div className="mt-2 text-[10px] text-gray-600 whitespace-pre-wrap">{record.body}</div>
                                    <div className="mt-1 text-[9px] text-gray-400">来源：{record.sourceLabel}</div>
                                </article>
                            ))}
                        </div>
                    </details>
                )}

                <p className="text-[9px] text-gray-400">后台提炼只能生成候选；“记住这个：具体内容”可直接确认事实，但默认进入按需检索，不会自动塞进每轮上下文。</p>
            </section>
        );
    }

    global.XingyueMemoryGovernancePanel = MemoryGovernancePanel;
})(window);
