(function initMigrationPanel(global) {
    'use strict';

    function MigrationPanel({ Icon }) {
        const [job, setJob] = React.useState(null);
        const [error, setError] = React.useState('');
        const [sourceName, setSourceName] = React.useState('');
        const running = job?.status === 'queued' || job?.status === 'running';
        const result = job?.result || null;

        const request = payload => global.xingyueDesktop.requestLocalAgent(payload);
        const waitForJob = async jobId => {
            const deadline = Date.now() + 120000;
            while (Date.now() < deadline) {
                const response = await request({ path: `/api/migration/jobs/${jobId}`, method: 'GET' });
                if (!response.ok || !response.data?.job) throw new Error(response.data?.error || '无法读取预览进度');
                setJob(response.data.job);
                if (response.data.job.status === 'succeeded') return;
                if (response.data.job.status === 'failed') throw new Error(response.data.job.error || '预览失败');
                await new Promise(resolve => setTimeout(resolve, 350));
            }
            throw new Error('预览时间过长，已停止等待；正式数据没有变化');
        };

        const chooseSource = async () => {
            setError('');
            setJob(null);
            try {
                const selected = await global.xingyueDesktop.pickMigrationSource();
                if (!selected?.path) return;
                setSourceName(selected.path.split(/[\\/]/).pop());
                const started = await request({ path: '/api/migration/preview', method: 'POST', body: { path: selected.path } });
                if (!started.ok || !started.data?.jobId) throw new Error(started.data?.error || '没有开始迁移预览');
                setJob({ status: 'queued', progress: '准备只读分析测试副本…', percent: 0 });
                await waitForJob(started.data.jobId);
            } catch (previewError) {
                setError(previewError.message || '预览失败；正式数据没有变化');
            }
        };

        const metric = (label, value, tone = 'text-gray-800') => (
            <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                <div className={`text-xl font-semibold ${tone}`}>{value ?? 0}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{label}</div>
            </div>
        );

        return (
            <div className="space-y-4">
                <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                    <div className="flex items-start gap-3">
                        <Icon name="Search" size={20} className="text-blue-600 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-800">旧数据迁移预览</h3>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">只读取设备迁移包、浏览器 JSON 备份或旧 SQLite 测试副本，统计内容和冲突。本页没有导入按钮，不会改动现有聊天、旧文件或正式主机数据。</p>
                            <button disabled={running} onClick={chooseSource} className="mt-3 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium flex items-center gap-2">
                                <Icon name="FolderOpen" size={16} /> {running ? '正在只读分析…' : '选择测试副本并预览'}
                            </button>
                            {sourceName && <div className="text-xs text-gray-500 mt-2">当前来源：{sourceName}</div>}
                        </div>
                    </div>
                </div>

                {job && running && (
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                        <div className="flex justify-between text-xs text-amber-800"><span>{job.progress}</span><span>{job.percent || 0}%</span></div>
                        <div className="h-2 bg-amber-100 rounded-full mt-2 overflow-hidden"><div className="h-full bg-amber-500 transition-all" style={{ width: `${job.percent || 4}%` }} /></div>
                        <p className="text-[11px] text-amber-700 mt-2">只读处理中。即使关闭本页，正式数据也不会被写入。</p>
                    </div>
                )}

                {error && <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}<div className="text-xs mt-1">正式数据没有变化。</div></div>}

                {result && (
                    <>
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                            <div className="text-sm font-semibold text-emerald-800">✓ 预览完成 · 没有执行导入</div>
                            <div className="text-xs text-emerald-700 mt-1">{result.source.type}：{result.source.name}</div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {metric('聊天窗口', result.summary.sessions)}
                            {metric('消息', result.summary.messages)}
                            {metric('图片', result.summary.images)}
                            {metric('其他附件', result.summary.attachments)}
                            {metric('重复项', result.summary.duplicates, 'text-amber-600')}
                            {metric('冲突项', result.summary.conflicts, 'text-red-600')}
                            {metric('健康记录（天）', result.summary.healthDays)}
                            {metric('记忆文件', result.summary.memoryFiles)}
                        </div>
                        <div className="rounded-xl border border-purple-100 bg-purple-50/60 p-4">
                            <h4 className="text-sm font-semibold text-purple-800">记忆数据核对</h4>
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                {metric('人设档案 PP', result.memoryAudit.corePersonality)}
                                {metric('长期记忆', result.memoryAudit.longTermMemories)}
                                {metric('日志归档', result.memoryAudit.journalArchives)}
                            </div>
                            <p className="text-xs text-purple-700 mt-3">{result.memoryAudit.note}</p>
                        </div>
                        {(result.conflicts.length > 0 || result.duplicates.length > 0) && (
                            <div className="rounded-xl border border-gray-200 bg-white p-4">
                                <h4 className="text-sm font-semibold text-gray-800">重复与冲突清单</h4>
                                <div className="mt-2 space-y-2 max-h-56 overflow-y-auto">
                                    {result.conflicts.map((item, index) => <div key={`c-${index}`} className="text-xs p-2 rounded bg-red-50 text-red-700"><b>冲突：</b>{item.title} · {item.reason}</div>)}
                                    {result.duplicates.map((item, index) => <div key={`d-${index}`} className="text-xs p-2 rounded bg-amber-50 text-amber-700"><b>重复：</b>{item.title} · {item.reason}</div>)}
                                </div>
                            </div>
                        )}
                        <div className="text-center text-xs text-gray-500 py-2">{result.notice}</div>
                    </>
                )}
            </div>
        );
    }

    global.XingyueMigrationPanel = MigrationPanel;
})(window);
