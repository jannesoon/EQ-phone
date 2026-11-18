(function () {
    const STATUS = {
        queued: ['排队中', 'bg-sky-50 text-sky-700 border-sky-200'],
        running: ['运行中', 'bg-blue-50 text-blue-700 border-blue-200'],
        'waiting-confirmation': ['等待确认', 'bg-amber-50 text-amber-700 border-amber-200'],
        paused: ['已暂停', 'bg-violet-50 text-violet-700 border-violet-200'],
        succeeded: ['已完成', 'bg-emerald-50 text-emerald-700 border-emerald-200'],
        failed: ['失败', 'bg-rose-50 text-rose-700 border-rose-200'],
        stopped: ['已停止', 'bg-gray-100 text-gray-600 border-gray-200'],
        cancelled: ['已停止', 'bg-gray-100 text-gray-600 border-gray-200']
    };
    const dateText = value => {
        const parsed = Date.parse(value || '');
        return Number.isFinite(parsed) ? new Date(parsed).toLocaleString('zh-CN', { hour12: false }) : '';
    };

    const TaskCenterPanel = ({ hostOnline, showToast, Icon }) => {
        const [tasks, setTasks] = React.useState([]);
        const [summary, setSummary] = React.useState(null);
        const [grants, setGrants] = React.useState([]);
        const [codex, setCodex] = React.useState(null);
        const [loading, setLoading] = React.useState(false);
        const [busyId, setBusyId] = React.useState('');
        const [error, setError] = React.useState('');

        const refresh = React.useCallback(async (quiet = false) => {
            if (!hostOnline || !window.XingyueAgentClient?.createTaskCenterClient) return;
            if (!quiet) setLoading(true);
            try {
                const client = window.XingyueAgentClient.createTaskCenterClient();
                const [taskResult, authorizations, codexStatus] = await Promise.all([
                    client.list(),
                    client.listAuthorizations(),
                    client.codexStatus(!quiet).catch(() => null)
                ]);
                setTasks(taskResult.tasks || []);
                setSummary(taskResult.summary || null);
                setGrants(authorizations || []);
                setCodex(codexStatus || null);
                setError('');
            } catch (reason) {
                setError(reason?.message || '任务中心读取失败');
            } finally {
                if (!quiet) setLoading(false);
            }
        }, [hostOnline]);

        React.useEffect(() => {
            void refresh();
            const timer = setInterval(() => void refresh(true), 3000);
            return () => clearInterval(timer);
        }, [refresh]);

        const control = async (task, action) => {
            setBusyId(task.id);
            try {
                const client = window.XingyueAgentClient.createTaskCenterClient();
                const result = action === 'stop' ? await client.stop(task.id) : await client.resume(task.id);
                setTasks(result.tasks || []);
                setSummary(result.summary || null);
                showToast(action === 'stop' ? '任务已停止' : '任务已继续');
            } catch (reason) {
                showToast(reason?.message || '任务操作失败');
            } finally { setBusyId(''); }
        };

        const revoke = async grant => {
            if (!confirm(`撤销“${grant.label || grant.id}”的持续文件授权？撤销后主机 Agent 将不能再读取这个范围，也不能再发起逐次确认写入。`)) return;
            setBusyId(grant.id);
            try {
                await window.XingyueAgentClient.createTaskCenterClient().revokeAuthorization(grant.id);
                await refresh(true);
                showToast('持续授权已撤销');
            } catch (reason) { showToast(reason?.message || '授权撤销失败'); }
            finally { setBusyId(''); }
        };

        if (!hostOnline) return <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">本地主机离线，任务不会在后台偷偷运行。重新打开电脑端后可在这里查看恢复状态。</div>;
        const active = Number(summary?.active || 0);
        return (
            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">任务中心</h3>
                        <p className="mt-1 text-xs leading-relaxed text-gray-500">统一显示主机工具、文件、记忆和网页任务。关闭或重启后，未完成的安全任务会转为“已暂停”，不会伪装成仍在运行。</p>
                    </div>
                    <button type="button" onClick={() => refresh()} disabled={loading} className="flex-shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50">{loading ? '刷新中…' : '刷新'}</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3"><div className="text-xl font-semibold text-blue-700">{active}</div><div className="text-[11px] text-blue-600">正在执行</div></div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3"><div className="text-xl font-semibold text-emerald-700">{summary?.counts?.succeeded || 0}</div><div className="text-[11px] text-emerald-600">已完成</div></div>
                    <div className="rounded-xl border border-violet-100 bg-violet-50 p-3"><div className="text-xl font-semibold text-violet-700">{summary?.counts?.paused || 0}</div><div className="text-[11px] text-violet-600">可继续</div></div>
                </div>
                <div className={`rounded-xl border p-3 ${codex?.available && codex?.authenticated ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                    <div className="flex items-center justify-between gap-3">
                        <div><div className="text-sm font-medium text-gray-800">Codex 执行工作室</div><div className="mt-1 text-[11px] text-gray-600">{codex?.available && codex?.authenticated ? `已连接 · ${codex.version || 'Codex'} · 复用当前 ChatGPT 登录` : codex?.available ? 'Codex 已安装，但当前登录不可用' : '正在检查 Codex 桌面运行时'}</div></div>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${codex?.available && codex?.authenticated ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{codex?.available && codex?.authenticated ? '可委托' : '未就绪'}</span>
                    </div>
                </div>
                {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
                <div className="space-y-2">
                    {tasks.length === 0 && !loading ? <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">还没有后台任务。无任务时不会调用模型，也不会产生 API 费用。</div> : tasks.slice(0, 50).map(task => {
                        const status = STATUS[task.status] || [task.status, 'bg-gray-100 text-gray-600 border-gray-200'];
                        const stoppable = ['queued', 'running', 'waiting-confirmation'].includes(task.status);
                        const resumable = task.resumable && ['paused', 'stopped', 'failed'].includes(task.status);
                        return <div key={task.id} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0"><div className="truncate text-sm font-medium text-gray-800">{task.title || task.toolName || task.type}</div><div className="mt-1 text-[11px] text-gray-500">{task.progress || '等待状态更新'}</div></div>
                                <span className={`flex-shrink-0 rounded-full border px-2 py-1 text-[10px] font-medium ${status[1]}`}>{status[0]}</span>
                            </div>
                            {Number.isFinite(Number(task.percent)) && <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full bg-blue-500" style={{ width: `${Math.max(0, Math.min(100, Number(task.percent)))}%` }}></div></div>}
                            <div className="mt-2 flex items-center justify-between gap-3 text-[10px] text-gray-400"><span>{dateText(task.updatedAt)}</span><div className="flex gap-2">{stoppable && <button type="button" disabled={busyId === task.id} onClick={() => control(task, 'stop')} className="rounded-md border border-rose-200 px-2 py-1 text-rose-600 hover:bg-rose-50 disabled:opacity-50">停止</button>}{resumable && <button type="button" disabled={busyId === task.id} onClick={() => control(task, 'resume')} className="rounded-md border border-violet-200 px-2 py-1 text-violet-700 hover:bg-violet-50 disabled:opacity-50">继续</button>}</div></div>
                            {task.externalTaskId && <div className="mt-2 truncate text-[10px] text-gray-400">Codex 任务：{task.externalTaskId}</div>}
                        </div>;
                    })}
                </div>
                <div className="border-t border-gray-100 pt-5">
                    <h3 className="text-sm font-semibold text-gray-800">持续授权</h3>
                    <p className="mt-1 text-xs text-gray-500">这里只显示已由电脑端明确授予的范围；模型和手机不能自行扩大授权。文件写入仍会逐次显示差异并请你确认。</p>
                    <div className="mt-3 space-y-2">{grants.map(grant => <div key={grant.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"><div><div className="text-sm font-medium text-gray-700">{grant.label || grant.id}</div><div className="mt-1 text-[10px] text-gray-500">{grant.scopeMode === 'persistent' ? '持续授权' : '临时授权'} · {(grant.permissions || []).join(' / ')} · {grant.status === 'active' ? '有效' : '已撤销'}</div></div>{grant.status === 'active' && <button type="button" disabled={busyId === grant.id} onClick={() => revoke(grant)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-600 hover:border-rose-300 hover:text-rose-600 disabled:opacity-50">撤销</button>}</div>)}</div>
                </div>
            </div>
        );
    };
    window.XingyueTaskCenter = { TaskCenterPanel };
})();
