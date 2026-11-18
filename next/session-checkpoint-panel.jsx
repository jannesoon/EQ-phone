(function (global) {
    const { useEffect, useMemo, useState } = React;

    const STATE_LABELS = {
        candidate: '待确认候选',
        confirmed: '已确认使用',
        rejected: '已撤销／驳回'
    };

    const itemList = (title, items) => (
        <div className="rounded-lg border border-slate-100 bg-white/70 p-3">
            <div className="text-[11px] font-semibold text-slate-600 mb-1.5">{title}</div>
            {Array.isArray(items) && items.length ? (
                <div className="space-y-1.5">
                    {items.map((item, index) => (
                        <div key={index} className="text-xs text-slate-700 leading-relaxed">
                            <span>{item.text}</span>
                            <span className="ml-1 text-[9px] text-slate-400">{(item.sourceMessageIds || []).join('、')}</span>
                        </div>
                    ))}
                </div>
            ) : <div className="text-[10px] text-slate-400">无</div>}
        </div>
    );

    const CardBody = ({ revision, messages }) => {
        if (!revision?.content) return null;
        const content = revision.content;
        const sourceMap = new Map((Array.isArray(messages) ? messages : []).map((message, index) => [
            `message-${index + 1}`,
            {
                role: message?.role === 'model' ? '逸辰' : message?.role === 'user' ? '柒柒' : '工具',
                text: String(Object.prototype.hasOwnProperty.call(message || {}, 'displayContent') ? message.displayContent : message?.content || '')
            }
        ]));
        const chronicle = content.contentSchema === 'window-chronicle-v1' || Array.isArray(content.keyMoments);
        const coverage = content.sourceCoverage;
        const coverageLabel = range => range ? `${range.first}～${range.last} · ${range.count} 条` : '无';
        if (content.contentSchema === 'window-log-v1' || content.body) return (
            <div className="space-y-3">
                <div className="rounded-lg border border-sky-100 bg-sky-50/70 p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{content.body}</div>
                <details className="rounded-lg border border-slate-200 bg-white">
                    <summary className="cursor-pointer px-3 py-2 text-[11px] font-medium text-slate-600">技术索引与原文依据（默认收起）</summary>
                    <div className="border-t border-slate-100 p-3 space-y-3">
                        {coverage && <div className="grid md:grid-cols-3 gap-2 text-[10px] text-slate-500">
                            <div>较早原文：{coverageLabel(coverage.historicalRead)}</div>
                            <div>近期核对：{coverageLabel(coverage.recentStatusRead)}</div>
                            <div>聊天逐字尾部：{coverageLabel(coverage.dynamicRawTail)}</div>
                        </div>}
                        <div className="text-[9px] text-slate-400">窗口总账 {coverage?.totalMessages || messages?.length || 0} 条；以下消息编号只是代表性依据，不是日志正文的一部分。</div>
                        <div className="space-y-2 max-h-72 overflow-y-auto">
                            {(content.sourceMessageIds || []).map(id => {
                                const source = sourceMap.get(id);
                                return <div key={id} className="rounded-lg bg-slate-50 px-3 py-2">
                                    <div className="text-[9px] text-slate-400 mb-1">{id} · {source?.role || '原消息'}</div>
                                    <div className="text-[11px] text-slate-600 whitespace-pre-wrap break-words">{source?.text || '原文仍保存在主机聊天账本，可回到窗口按消息编号核对。'}</div>
                                </div>;
                            })}
                        </div>
                    </div>
                </details>
                <div className="text-[9px] text-slate-400">作者：{revision.author === 'qiqi-and-ethan' ? '逸辰与柒柒共同修订' : '逸辰（当前窗口）'} · v{revision.version} · {revision.contentHash}</div>
            </div>
        );
        return (
            <div className="space-y-3">
                <div className="rounded-lg border border-sky-100 bg-sky-50/70 p-3 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{content.overview || content.summary}</div>
                {chronicle ? (
                    <>
                        {coverage && (
                            <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-3">
                                <div className="text-[11px] font-semibold text-indigo-700 mb-2">阅读覆盖与代表性引用</div>
                                <div className="grid md:grid-cols-3 gap-2 text-[10px] text-slate-600">
                                    <div>较早原文：{coverageLabel(coverage.historicalRead)}</div>
                                    <div>近期状态：{coverageLabel(coverage.recentStatusRead)}</div>
                                    <div>聊天逐字尾部：{coverageLabel(coverage.dynamicRawTail)}</div>
                                </div>
                                <div className="mt-1 text-[9px] text-slate-400">窗口总账 {coverage.totalMessages || messages?.length || 0} 条；下方 {content.sourceMessageIds?.length || 0} 条是代表性证据，不是全部阅读量。</div>
                            </div>
                        )}
                        {itemList('这扇窗的重要片段', content.keyMoments)}
                        <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
                            <div className="text-[11px] font-semibold text-amber-700 mb-1.5">最近停在哪里</div>
                            <div className="text-xs text-slate-700 leading-relaxed">{content.currentLanding?.text || '尚未形成明确落点'} <span className="ml-1 text-[9px] text-slate-400">{(content.currentLanding?.sourceMessageIds || []).join('、')}</span></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2">
                            {itemList('仍在延续的线', content.continuingThreads)}
                            {itemList('这扇窗里形成的理解', content.windowUnderstandings)}
                        </div>
                    </>
                ) : (
                    <div className="grid md:grid-cols-3 gap-2">
                        {itemList('已确认事实', content.confirmedFacts)}
                        {itemList('未完成事项', content.openItems)}
                        {itemList('明确约定', content.explicitAgreements)}
                    </div>
                )}
                <details className="rounded-lg border border-slate-200 bg-white">
                    <summary className="cursor-pointer px-3 py-2 text-[11px] font-medium text-slate-600">代表性引用原文（{content.sourceMessageIds?.length || 0} 条）</summary>
                    <div className="border-t border-slate-100 p-3 space-y-2 max-h-72 overflow-y-auto">
                        {(content.sourceMessageIds || []).map(id => {
                            const source = sourceMap.get(id);
                            return (
                                <div key={id} className="rounded-lg bg-slate-50 px-3 py-2">
                                    <div className="text-[9px] text-slate-400 mb-1">{id} · {source?.role || '原消息'}</div>
                                    <div className="text-[11px] text-slate-600 whitespace-pre-wrap break-words">{source?.text || '原文仍保存在主机聊天账本，可回到窗口按消息编号核对。'}</div>
                                </div>
                            );
                        })}
                    </div>
                </details>
                <div className="text-[9px] text-slate-400">历史作者：session-summarizer · v{revision.version} · {revision.contentHash}</div>
            </div>
        );
    };

    const SessionCheckpointPanel = ({ sessionId, messages, onGenerateCandidate, onProtectRolling, onChange, showToast }) => {
        const [value, setValue] = useState(null);
        const [busy, setBusy] = useState('');
        const [error, setError] = useState('');
        const [editing, setEditing] = useState(false);
        const [editBody, setEditBody] = useState('');
        const client = useMemo(() => global.XingyueAgentClient?.createSessionCheckpointClient?.(), []);

        const publish = next => {
            setValue(next);
            onChange?.(next);
            global.dispatchEvent(new CustomEvent('xingyue:session-checkpoint-updated', { detail: next }));
        };

        const refresh = async () => {
            if (!client || !sessionId) { setValue(null); return; }
            setError('');
            try { publish(await client.read(sessionId)); }
            catch (reason) { setError(reason.message); }
        };

        useEffect(() => {
            setEditing(false);
            setEditBody('');
            void refresh();
        }, [client, sessionId]);

        const act = async (name, operation, success) => {
            setBusy(name); setError('');
            try {
                const result = await operation();
                publish(result.sessionCheckpoint);
                showToast?.(success);
            } catch (reason) { setError(reason.message); }
            finally { setBusy(''); }
        };

        const generate = () => act('generate', async () => {
            const content = await onGenerateCandidate?.();
            if (!content) throw new Error('没有生成窗口日志候选');
            return client.createCandidate(sessionId, content);
        }, value?.candidate ? '已重新生成窗口日志候选，旧版本仍保留' : '窗口日志候选已生成，等待共同确认');

        const protectRolling = () => act('rolling', async () => {
            const before = Number(value?.rolling?.segmentCount || 0);
            const next = await onProtectRolling?.();
            if (!next || Number(next?.rolling?.segmentCount || 0) <= before) throw new Error('当前窗口暂时没有需要分段保护的较早原文');
            return { sessionCheckpoint: next };
        }, '较早原文已保存为本窗口滚动衔接草稿');

        const beginEdit = () => {
            setError('');
            setEditBody(String(value?.candidate?.content?.body || ''));
            setEditing(true);
        };

        const saveEdit = async () => {
            const body = editBody.trim();
            if (!body) { setError('窗口日志正文不能为空'); return; }
            setBusy('revise'); setError('');
            try {
                const result = await client.reviseCandidate(sessionId, body);
                publish(result.sessionCheckpoint);
                setEditing(false);
                showToast?.('修改已保存为新的候选版本，原模型稿仍保留在历史链');
            } catch (reason) { setError(reason.message); }
            finally { setBusy(''); }
        };

        if (!sessionId) return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">请先打开一个聊天窗口，再查看它自己的窗口日志。</div>
        );

        const current = value?.candidate || value?.active || value?.current;
        return (
            <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-indigo-50 p-4 space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800">当前窗口日志</h3>
                        <p className="text-[10px] text-sky-600 mt-0.5">窗口独立 · 逸辰写下 · 柒柒确认后成为正式日志</p>
                        <p className="text-[9px] text-slate-400 mt-1 break-all">窗口：{sessionId}</p>
                    </div>
                    <button onClick={() => void refresh()} disabled={Boolean(busy)} className="text-[10px] px-2 py-1 rounded bg-white text-sky-600 border border-sky-100 disabled:opacity-50">刷新</button>
                </div>

                {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}

                <div className="rounded-xl border border-violet-100 bg-white/70 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div className="text-[11px] font-semibold text-violet-700">长窗口滚动保护</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                                {value?.rolling?.segmentCount
                                    ? `已保护 ${value.rolling.segmentCount} 段，连续到 message-${Number(value.rolling.coveredThrough) + 1}`
                                    : '尚未触发；达到约 16K 新原文或 20 个完整来回后自动保护'}
                            </div>
                        </div>
                        <button onClick={protectRolling} disabled={Boolean(busy) || (messages?.length || 0) < 7} className="text-[10px] px-2 py-1 rounded bg-violet-50 text-violet-700 border border-violet-100 disabled:opacity-50">{busy === 'rolling' ? '保护中…' : '现在检查'}</button>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1">分段草稿只接续本窗口，不会自动成为正式日志或长期记忆；编辑过前段原文时，指纹不一致的后续分段会停止使用并重新生成。</div>
                </div>

                {!current ? (
                    <div className="rounded-xl border border-dashed border-sky-200 bg-white/60 p-4 text-center text-xs text-slate-500">这个窗口还没有日志。窗口较长、想转窗，或只是想一起回望时，都可以手动生成候选；不确认就不会进入正式近期生活层。</div>
                ) : (
                    <div className="rounded-xl border border-white bg-white/70 p-3 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className={`text-[10px] px-2 py-1 rounded-full ${current.confirmationState === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : current.confirmationState === 'candidate' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{STATE_LABELS[current.confirmationState] || current.confirmationState}</span>
                            {value?.active && value?.candidate && <span className="text-[9px] text-slate-400">当前正式 v{value.active.version} · 候选 v{value.candidate.version}</span>}
                        </div>
                        {editing && value?.candidate ? (
                            <div className="space-y-2">
                                <textarea value={editBody} onChange={event => setEditBody(event.target.value)} rows={12} maxLength={12000} disabled={Boolean(busy)} className="w-full rounded-lg border border-sky-200 bg-white p-3 text-sm text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:opacity-60" />
                                <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400">
                                    <span>只修改正文；原文编号、阅读覆盖和原候选版本保持不变。</span>
                                    <span>{editBody.length} / 12000</span>
                                </div>
                            </div>
                        ) : <CardBody revision={current} messages={messages} />}
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {!editing && <button onClick={generate} disabled={Boolean(busy) || !messages?.length} className="px-3 py-2 rounded-lg bg-sky-600 text-white text-xs font-medium disabled:opacity-50">{busy === 'generate' ? '生成中…' : current ? '重新生成窗口日志' : '生成窗口日志候选'}</button>}
                    {value?.candidate && !editing && <button onClick={beginEdit} disabled={Boolean(busy)} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium disabled:opacity-50">修改候选</button>}
                    {value?.candidate && editing && <button onClick={() => void saveEdit()} disabled={Boolean(busy) || !editBody.trim()} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium disabled:opacity-50">{busy === 'revise' ? '保存中…' : '保存修改'}</button>}
                    {value?.candidate && editing && <button onClick={() => { setEditing(false); setEditBody(''); setError(''); }} disabled={Boolean(busy)} className="px-3 py-2 rounded-lg bg-white text-slate-600 border border-slate-200 text-xs disabled:opacity-50">取消</button>}
                    {value?.candidate && !editing && <button onClick={() => act('confirm', () => client.confirm(sessionId), '窗口日志已由柒柒确认，成为正式近期日志')} disabled={Boolean(busy)} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium disabled:opacity-50">确认日志</button>}
                    {value?.candidate && !editing && <button onClick={() => act('reject', () => client.reject(sessionId), '候选已驳回，未进入上下文')} disabled={Boolean(busy)} className="px-3 py-2 rounded-lg bg-white text-slate-600 border border-slate-200 text-xs disabled:opacity-50">驳回候选</button>}
                    {value?.active && !value?.candidate && <button onClick={() => act('withdraw', () => client.withdraw(sessionId), '窗口日志已撤回，原版本仍保留在历史链')} disabled={Boolean(busy)} className="px-3 py-2 rounded-lg bg-white text-red-600 border border-red-200 text-xs disabled:opacity-50">撤回日志</button>}
                </div>
            </div>
        );
    };

    global.XingyueSessionCheckpointPanel = SessionCheckpointPanel;
})(window);
