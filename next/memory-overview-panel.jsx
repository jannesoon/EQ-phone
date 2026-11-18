(function initMemoryOverviewPanel(global) {
    'use strict';
    const { useEffect, useMemo, useState } = React;
    const timeLabel = value => value ? new Date(value).toLocaleString('zh-CN') : '—';

    function MemoryOverviewPanel() {
        const desktop = typeof global.xingyueDesktop?.requestLocalAgent === 'function';
        const clients = useMemo(() => ({
            identity: global.XingyueAgentClient?.createIdentityCoreClient?.(),
            memory: global.XingyueAgentClient?.createMemoryGovernanceClient?.(),
            windows: global.XingyueAgentClient?.createSessionCheckpointClient?.()
        }), []);
        const [state, setState] = useState({ identity: null, memory: null, windowLogs: [], loading: true, error: '' });
        const load = async () => {
            if (!desktop) return;
            setState(value => ({ ...value, loading: true, error: '' }));
            try {
                const [identity, memory, windowLogs] = await Promise.all([
                    clients.identity.read(), clients.memory.read(), clients.windows.readConfirmedWindowLogs()
                ]);
                setState({ identity, memory, windowLogs, loading: false, error: '' });
            } catch (reason) {
                setState(value => ({ ...value, loading: false, error: reason?.message || '无法读取当前生效内容' }));
            }
        };
        useEffect(() => { load(); }, []);
        if (!desktop) return null;
        const active = state.identity?.active;
        const confirmed = (state.memory?.records || []).filter(record => record.confirmationState === 'confirmed' && record.activation !== 'active');
        const windowLogs = [...state.windowLogs].sort((left, right) => {
            const rightTime = Date.parse(right?.confirmedAt || right?.createdAt || '') || 0;
            const leftTime = Date.parse(left?.confirmedAt || left?.createdAt || '') || 0;
            return rightTime - leftTime;
        });
        return (
            <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">当前生效的身份与记忆</h3>
                        <p className="mt-1 text-[10px] text-emerald-700">这里负责查看；版本编辑、候选确认和历史回退收进下方管理区。</p>
                    </div>
                    <button onClick={load} disabled={state.loading} className="rounded-lg bg-white px-3 py-1.5 text-[10px] text-emerald-700 border border-emerald-100 disabled:opacity-50">刷新</button>
                </div>
                {state.error && <div className="rounded-lg border border-red-100 bg-red-50 p-2 text-xs text-red-600">{state.error}</div>}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                    <div className="rounded-xl border border-white bg-white/80 p-3"><div className="text-base font-semibold text-purple-700">v{active?.version || '—'}</div><div className="text-[9px] text-gray-500">当前正式 PP</div></div>
                    <div className="rounded-xl border border-white bg-white/80 p-3"><div className="text-base font-semibold text-emerald-700">{state.memory?.activePayload ? 1 : 0}</div><div className="text-[9px] text-gray-500">常驻活跃摘要</div></div>
                    <div className="rounded-xl border border-white bg-white/80 p-3"><div className="text-base font-semibold text-sky-700">{confirmed.length}</div><div className="text-[9px] text-gray-500">已确认按需记忆</div></div>
                    <div className="rounded-xl border border-white bg-white/80 p-3"><div className="text-base font-semibold text-indigo-700">{windowLogs.length}</div><div className="text-[9px] text-gray-500">已确认窗口日志</div></div>
                </div>
                {active && <details className="rounded-xl border border-purple-100 bg-white/80 p-3"><summary className="cursor-pointer text-xs font-medium text-purple-800">查看正式 PP v{active.version} · {timeLabel(active.confirmedAt)}</summary><pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-[10px] leading-5 text-gray-600 font-sans">{active.body}</pre></details>}
                {state.memory?.activePayload && <details className="rounded-xl border border-emerald-100 bg-white/80 p-3"><summary className="cursor-pointer text-xs font-medium text-emerald-800">查看每轮常驻的最小活跃摘要</summary><pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap text-[10px] leading-5 text-gray-600 font-sans">{state.memory.activePayload}</pre></details>}
                {(confirmed.length > 0 || windowLogs.length > 0) && <details className="rounded-xl border border-sky-100 bg-white/80 p-3"><summary className="cursor-pointer text-xs font-medium text-sky-800">查看已确认的按需内容</summary><div className="mt-3 grid gap-3 md:grid-cols-2"><div><div className="mb-2 text-[10px] font-semibold text-gray-500">按需记忆</div>{confirmed.map(record => <div key={record.recordId} className="mb-1 rounded-lg bg-gray-50 p-2 text-[10px] text-gray-600">{record.title}</div>)}</div><div><div className="mb-2 text-[10px] font-semibold text-gray-500">窗口日志 · 按确认时间从新到旧</div>{windowLogs.map(log => <div key={log.content?.sessionId || log.recordId || log.id} className="mb-1 rounded-lg bg-gray-50 p-2"><div className="text-[10px] font-medium text-gray-700">{log.content?.sessionTitle || log.sessionTitle || log.content?.sessionId || '未命名窗口日志'}</div><div className="mt-0.5 text-[9px] text-gray-400">确认于 {timeLabel(log.confirmedAt || log.createdAt)}</div></div>)}</div></div></details>}
            </section>
        );
    }
    global.XingyueMemoryOverviewPanel = MemoryOverviewPanel;
})(window);
