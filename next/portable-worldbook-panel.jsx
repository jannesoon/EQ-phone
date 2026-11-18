(function initMemoryVaultPanel(global) {
    'use strict';
    const timeLabel = value => value ? new Date(value).toLocaleString('zh-CN') : '—';
    const shortHash = value => value ? String(value).slice(0, 12) : '—';

    function MemoryCard({ card, moduleId, revision, onSaved }) {
        const [editing, setEditing] = React.useState(false);
        const [body, setBody] = React.useState(revision?.proposedBody || card.body || '');
        const [note, setNote] = React.useState('');
        const [saving, setSaving] = React.useState(false);
        const [error, setError] = React.useState('');
        const save = async () => {
            setSaving(true); setError('');
            try {
                const client = global.XingyueAgentClient?.createMemoryVaultClient?.();
                if (!client) throw new Error('电脑记忆仓接口暂不可用');
                const result = await client.proposeRevision({ cardId: card.cardId, moduleId, proposedBody: body, changeNote: note });
                onSaved?.(result.memoryVault, result.saved);
                setEditing(false);
            } catch (reason) { setError(reason?.message || String(reason)); }
            finally { setSaving(false); }
        };
        return <article className="rounded-xl border border-gray-100 bg-white p-3 space-y-2">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h5 className="text-xs font-semibold text-gray-800">{card.title}</h5>
                    <div className="mt-1 text-[9px] text-gray-400">{card.factState || '未标状态'} · {card.source?.fileName || '来源未标'}：{card.source?.startLine || '—'}～{card.source?.endLine || '—'} 行</div>
                </div>
                <button onClick={() => { setEditing(value => !value); setError(''); }} className="shrink-0 rounded-lg border border-indigo-100 px-2 py-1 text-[10px] text-indigo-700 hover:bg-indigo-50">{editing ? '收起修改' : '修改'}</button>
            </div>
            {editing ? <div className="space-y-2">
                <textarea value={body} onChange={event => setBody(event.target.value)} rows={Math.min(16, Math.max(6, String(body).split('\n').length + 2))} className="w-full rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 text-xs leading-6 text-gray-800 outline-none focus:border-indigo-300" />
                <input value={note} onChange={event => setNote(event.target.value)} placeholder="可选：为什么要修订" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-indigo-300" />
                <div className="rounded-lg bg-amber-50 p-2 text-[10px] text-amber-700">保存后只形成待整理修订，不会覆盖记忆仓 v{revision?.baseWorldbookVersion || 1}，也不会改动原始文件。</div>
                {error && <div className="text-[10px] text-red-600">{error}</div>}
                <div className="flex justify-end gap-2">
                    <button onClick={() => { setBody(revision?.proposedBody || card.body || ''); setNote(''); setEditing(false); }} className="rounded-lg px-3 py-1.5 text-[10px] text-gray-500">取消</button>
                    <button disabled={saving || body.trim() === String(card.body || '').trim()} onClick={save} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[10px] text-white disabled:opacity-40">{saving ? '保存中…' : '保存为待整理修订'}</button>
                </div>
            </div> : <div className="whitespace-pre-wrap text-[11px] leading-6 text-gray-700">{revision?.proposedBody || card.body}</div>}
            {revision && !editing && <div className="rounded-lg border border-amber-100 bg-amber-50 p-2 text-[10px] text-amber-700">这张卡已有待整理修订 · {timeLabel(revision.createdAt)}{revision.changeNote ? ` · ${revision.changeNote}` : ''}</div>}
        </article>;
    }

    function NewMemoryCard({ modules, onSaved }) {
        const [open, setOpen] = React.useState(false);
        const [title, setTitle] = React.useState('');
        const [body, setBody] = React.useState('');
        const [targetModuleId, setTargetModuleId] = React.useState('');
        const [targetModuleTitle, setTargetModuleTitle] = React.useState('');
        const [note, setNote] = React.useState('');
        const [saving, setSaving] = React.useState(false);
        const [error, setError] = React.useState('');
        const reset = () => { setTitle(''); setBody(''); setTargetModuleId(''); setTargetModuleTitle(''); setNote(''); setError(''); };
        const save = async () => {
            setSaving(true); setError('');
            try {
                const client = global.XingyueAgentClient?.createMemoryVaultClient?.();
                if (!client) throw new Error('电脑记忆仓接口暂不可用');
                const result = await client.createCandidate({ title, body, targetModuleId, targetModuleTitle, note });
                onSaved?.(result.memoryVault, result.saved);
                reset(); setOpen(false);
            } catch (reason) { setError(reason?.message || String(reason)); }
            finally { setSaving(false); }
        };
        return <div className="rounded-xl border border-indigo-100 bg-white/90 p-3">
            <div className="flex items-center justify-between gap-3">
                <div><div className="text-xs font-semibold text-gray-800">手动补充长期记忆</div><div className="mt-1 text-[9px] text-gray-500">事实由你直接确认；归类与合并等待我们之后共同整理。</div></div>
                <button onClick={() => { setOpen(value => !value); setError(''); }} className="shrink-0 rounded-lg bg-indigo-600 px-3 py-2 text-[10px] text-white">{open ? '收起' : '新增记忆卡片'}</button>
            </div>
            {open && <div className="mt-3 space-y-2">
                <input value={title} onChange={event => setTitle(event.target.value)} placeholder="记忆标题（必填）" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-indigo-300" />
                <textarea value={body} onChange={event => setBody(event.target.value)} rows="6" placeholder="写下希望我长期记得的事实（必填）" className="w-full rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 text-xs leading-6 text-gray-800 outline-none focus:border-indigo-300" />
                <div className="grid gap-2 md:grid-cols-2">
                    <select value={targetModuleId} onChange={event => setTargetModuleId(event.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 outline-none focus:border-indigo-300">
                        <option value="">暂不归类 / 新主题</option>
                        {modules.map(module => <option key={module.moduleId} value={module.moduleId}>{module.title}</option>)}
                    </select>
                    {!targetModuleId && <input value={targetModuleTitle} onChange={event => setTargetModuleTitle(event.target.value)} placeholder="可选：建议归入的新主题" className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-indigo-300" />}
                </div>
                <input value={note} onChange={event => setNote(event.target.value)} placeholder="可选：补充说明或出处" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-indigo-300" />
                <div className="rounded-lg bg-amber-50 p-2 text-[10px] leading-5 text-amber-700">保存后标记为“柒柒已确认 · 等待整理”。它不会立刻写进正式记忆仓 v1，也不会覆盖原始文件。</div>
                {error && <div className="text-[10px] text-red-600">{error}</div>}
                <div className="flex justify-end gap-2"><button onClick={() => { reset(); setOpen(false); }} className="rounded-lg px-3 py-1.5 text-[10px] text-gray-500">取消</button><button disabled={saving || !title.trim() || !body.trim()} onClick={save} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[10px] text-white disabled:opacity-40">{saving ? '保存中…' : '保存为待整理记忆'}</button></div>
            </div>}
        </div>;
    }

    function IncrementalCandidate({ card, modules, onSaved }) {
        const [editing, setEditing] = React.useState(false);
        const [title, setTitle] = React.useState(card.title || '');
        const [body, setBody] = React.useState(card.body || '');
        const [targetModuleId, setTargetModuleId] = React.useState(card.targetModuleId || '');
        const [reason, setReason] = React.useState('');
        const [busy, setBusy] = React.useState(false);
        const [error, setError] = React.useState('');
        const apply = async action => {
            setBusy(true); setError('');
            try { const result = await action(global.XingyueAgentClient.createMemoryVaultClient()); onSaved?.(result.memoryVault); setEditing(false); }
            catch (cause) { setError(cause?.message || String(cause)); }
            finally { setBusy(false); }
        };
        const source = card.source || {};
        return <article className="rounded-xl border border-amber-100 bg-white p-3 space-y-2">
            {editing ? <>
                <input value={title} onChange={event => setTitle(event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs" />
                <textarea value={body} onChange={event => setBody(event.target.value)} rows="6" className="w-full rounded-xl border border-indigo-100 p-3 text-xs leading-6" />
                <select value={targetModuleId} onChange={event => setTargetModuleId(event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"><option value="">保持建议的新主题</option>{modules.map(module => <option key={module.moduleId} value={module.moduleId}>{module.title}</option>)}</select>
                <input value={reason} onChange={event => setReason(event.target.value)} placeholder="修改原因（会保留在历史中）" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs" />
                <div className="flex justify-end gap-2"><button onClick={() => setEditing(false)} className="px-3 py-1.5 text-[10px] text-gray-500">取消</button><button disabled={busy || !title.trim() || !body.trim()} onClick={() => apply(client => client.reviseCandidate(card.candidateId, { title, body, targetModuleId, reason }))} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[10px] text-white disabled:opacity-40">保存修订</button></div>
            </> : <>
                <div className="flex flex-wrap items-start justify-between gap-2"><h5 className="text-xs font-semibold text-gray-800">{card.title}</h5><span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] text-amber-700">{card.factState === 'qiqi-confirmed' ? '柒柒已确认' : '对话增量候选'} · 等待整理</span></div>
                <div className="whitespace-pre-wrap text-[11px] leading-6 text-gray-700">{card.body}</div>
                <div className="text-[9px] leading-5 text-gray-400">建议书架：{card.targetModuleTitle || '等待归类'} · 创建 {timeLabel(card.createdAt)}{card.updatedAt && card.updatedAt !== card.createdAt ? ` · 修改 ${timeLabel(card.updatedAt)}` : ''}</div>
                {Boolean(source.deviceId || source.windowId || source.messageIds?.length) && <div className="rounded-lg bg-sky-50 p-2 text-[9px] leading-5 text-sky-700">来源：{source.kind || '未标'}{source.deviceId ? ` · 设备 ${source.deviceId}` : ''}{source.windowId ? ` · 窗口 ${source.windowId}` : ''}{source.messageIds?.length ? ` · 消息 ${source.messageIds.join('、')}` : ''}</div>}
                {source.excerpts?.length > 0 && <details className="rounded-lg border border-gray-100 p-2"><summary className="cursor-pointer text-[9px] text-gray-500">核对必要原文</summary><div className="mt-2 whitespace-pre-wrap text-[10px] leading-5 text-gray-600">{source.excerpts.join('\n\n')}</div></details>}
                <div className="flex justify-end gap-2"><button onClick={() => setEditing(true)} className="rounded-lg border border-indigo-100 px-3 py-1.5 text-[10px] text-indigo-700">修改</button><button disabled={busy} onClick={() => apply(client => client.withdrawCandidate(card.candidateId, reason || '由柒柒在电脑操作台撤回'))} className="rounded-lg border border-red-100 px-3 py-1.5 text-[10px] text-red-600">撤回</button></div>
            </>}
            {error && <div className="text-[10px] text-red-600">{error}</div>}
        </article>;
    }

    function ReleaseWorkbench({ vault, onSaved }) {
        const release = vault?.releaseCandidate;
        const history = Array.isArray(vault?.releaseHistory) ? vault.releaseHistory : [];
        const pendingCount = (vault?.newCardCandidates?.length || 0) + (vault?.pendingRevisions?.length || 0);
        const [busy, setBusy] = React.useState(false); const [error, setError] = React.useState('');
        const apply = async action => { setBusy(true); setError(''); try { const result = await action(global.XingyueAgentClient.createMemoryVaultClient()); onSaved?.(result.memoryVault); } catch (cause) { setError(cause?.message || String(cause)); } finally { setBusy(false); } };
        return <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-3 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-xs font-semibold text-violet-900">模块版本整理台</div><div className="mt-1 text-[9px] text-violet-700">先形成差异候选；共同确认前不会改变当前正式版本。</div></div>{!release && <button disabled={busy || !pendingCount} onClick={() => apply(client => client.prepareRelease({ trigger: 'manual' }))} className="rounded-lg bg-violet-600 px-3 py-2 text-[10px] text-white disabled:opacity-40">整理 {pendingCount} 条候选</button>}</div>
            {release && <div className="rounded-xl border border-violet-100 bg-white p-3 space-y-2">
                <div className="text-xs font-semibold text-gray-800">待确认 v{release.release.version} · {release.diffs.length} 项变化</div>
                <div className="text-[9px] text-gray-500">采用新卡 {release.adoptedCandidateIds.length} 条 · 修订 {release.adoptedRevisionIds.length} 条 · 未采用 {release.notAdoptedCandidateIds.length} 条 · 冲突 {release.conflicts.length} 条 · 未决 {release.unresolved.length} 条</div>
                <details><summary className="cursor-pointer text-[10px] text-violet-700">查看逐条差异</summary><div className="mt-2 space-y-2">{release.diffs.map((diff, index) => <div key={`${diff.cardId}-${index}`} className="rounded-lg bg-gray-50 p-2 text-[10px] leading-5"><b>{diff.kind === 'add-card' ? '新增' : '修订'} · {diff.title}</b>{diff.before && <div className="mt-1 text-red-500">原：{diff.before}</div>}<div className="mt-1 text-emerald-700">新：{diff.after}</div></div>)}</div></details>
                {(release.conflicts.length > 0 || release.unresolved.length > 0) ? <div className="rounded-lg bg-red-50 p-2 text-[10px] text-red-600">仍有冲突或未决归类，请先修改候选后重新整理。</div> : <button disabled={busy} onClick={() => apply(client => client.confirmRelease({ releaseCandidateId: release.releaseCandidateId, confirmationText: '柒柒与逸辰共同确认发布' }))} className="rounded-lg bg-emerald-600 px-3 py-2 text-[10px] text-white">共同确认并发布 v{release.release.version}</button>}
            </div>}
            {history.length > 1 && <details><summary className="cursor-pointer text-[10px] text-gray-600">历史版本与恢复</summary><div className="mt-2 space-y-2">{history.slice().reverse().map(item => <div key={item.releaseId} className="flex items-center justify-between gap-2 rounded-lg bg-white p-2 text-[10px]"><span>v{item.version} · {timeLabel(item.publishedAt)}{item.releaseKind === 'rollback' ? ` · 恢复自 v${item.basedOnVersion}` : ''}</span>{item.version !== vault.current.version && <button disabled={busy} onClick={() => apply(client => client.rollback(item.version, `柒柒与逸辰共同确认恢复 v${item.version}`))} className="rounded border border-gray-200 px-2 py-1 text-gray-600">恢复这版</button>}</div>)}</div></details>}
            {error && <div className="text-[10px] text-red-600">{error}</div>}
        </div>;
    }

    function LocalPendingCandidateQueue() {
        const queueApi = global.XingyueMemoryCandidateIntent;
        const read = () => queueApi?.readQueue?.() || [];
        const [items, setItems] = React.useState(read);
        const [busy, setBusy] = React.useState(false);
        const [notice, setNotice] = React.useState('');
        const refresh = () => setItems(read());
        React.useEffect(() => {
            const receive = event => setItems(Array.isArray(event.detail?.items) ? event.detail.items : read());
            const visible = () => { if (!global.document?.hidden) refresh(); };
            global.addEventListener('xingyue:memory-candidate-queue-updated', receive);
            global.document?.addEventListener('visibilitychange', visible);
            return () => {
                global.removeEventListener('xingyue:memory-candidate-queue-updated', receive);
                global.document?.removeEventListener('visibilitychange', visible);
            };
        }, []);
        const retry = async () => {
            if (!items.length) return;
            setBusy(true); setNotice('');
            let synced = 0;
            try {
                const client = global.XingyueAgentClient?.createMemoryVaultClient?.();
                if (!client) throw new Error('主机记忆仓接口暂不可用');
                for (const item of read()) {
                    const result = await client.createConversationCandidate(item);
                    queueApi.remove(item.candidateId);
                    synced += 1;
                    if (result?.memoryVault) global.dispatchEvent(new global.CustomEvent('xingyue:memory-vault-updated', { detail: result.memoryVault }));
                }
                setNotice(`已补传 ${synced} 条到主机待整理区`);
            } catch (reason) {
                setNotice(`还有 ${read().length} 条未补传：${reason?.message || String(reason)}`);
            } finally { refresh(); setBusy(false); }
        };
        return <section className={`rounded-xl border p-3 ${items.length ? 'border-amber-200 bg-amber-50/80' : 'border-emerald-100 bg-emerald-50/60'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <div className={`text-xs font-semibold ${items.length ? 'text-amber-900' : 'text-emerald-800'}`}>本机待同步记忆 · {items.length} 条</div>
                    <div className="mt-1 text-[9px] leading-5 text-gray-500">这些内容只在当前手机／网页里；成功进入主机后才会从这里移除。</div>
                </div>
                <div className="flex gap-2">
                    <button onClick={refresh} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[10px] text-gray-600">刷新</button>
                    <button disabled={busy || !items.length} onClick={retry} className="rounded-lg bg-amber-600 px-3 py-1.5 text-[10px] text-white disabled:opacity-40">{busy ? '补传中…' : '立即补传'}</button>
                </div>
            </div>
            {notice && <div className="mt-2 rounded-lg bg-white/80 p-2 text-[10px] text-gray-600">{notice}</div>}
            {items.length > 0 && <div className="mt-3 space-y-2">{items.map((item, index) => <details key={item.candidateId || index} className="rounded-lg border border-amber-100 bg-white p-2">
                <summary className="cursor-pointer text-[11px] font-medium text-gray-800">{item.title || `未命名候选 ${index + 1}`}</summary>
                <div className="mt-2 whitespace-pre-wrap text-[10px] leading-5 text-gray-700">{item.body || '没有可显示的正文'}</div>
                <div className="mt-2 text-[9px] text-gray-400">建议书架：{item.targetModuleTitle || '等待归类'}{item.createdAt ? ` · ${timeLabel(item.createdAt)}` : ''}</div>
            </details>)}</div>}
        </section>;
    }

    function PortableWorldbookPanel({ worldbook, replicaStatus }) {
        const desktop = typeof global.xingyueDesktop?.requestLocalAgent === 'function';
        const [managedVault, setManagedVault] = React.useState(null);
        const [manageError, setManageError] = React.useState('');
        React.useEffect(() => {
            if (!desktop || !global.XingyueAgentClient?.createMemoryVaultClient) return undefined;
            let cancelled = false;
            global.XingyueAgentClient.createMemoryVaultClient().read()
                .then(value => { if (!cancelled) setManagedVault(value); })
                .catch(reason => { if (!cancelled) setManageError(reason?.message || String(reason)); });
            return () => { cancelled = true; };
        }, [desktop, worldbook?.current?.version, worldbook?.current?.contentHash]);
        React.useEffect(() => {
            const receive = event => setManagedVault(event.detail || null);
            global.addEventListener('xingyue:memory-vault-updated', receive);
            return () => global.removeEventListener('xingyue:memory-vault-updated', receive);
        }, []);
        const visibleVault = desktop && managedVault ? managedVault : worldbook;
        const current = visibleVault?.current;
        const modules = Array.isArray(current?.modules) ? current.modules : [];
        const revisions = Array.isArray(managedVault?.pendingRevisions) ? managedVault.pendingRevisions : [];
        const newCards = Array.isArray(managedVault?.newCardCandidates) ? managedVault.newCardCandidates : [];
        const acceptVault = value => {
            setManagedVault(value);
            if (value?.current && value.current.version !== worldbook?.current?.version && global.XingyuePortableWorldbook) {
                const replica = global.XingyuePortableWorldbook.saveCache(value, global.localStorage, 'host');
                global.dispatchEvent(new CustomEvent('xingyue:portable-worldbook-published', { detail: replica }));
            }
        };
        const revisionByCard = new Map(revisions.map(item => [item.cardId, item]));
        const statusColor = replicaStatus?.state === 'conflict' || replicaStatus?.state === 'error'
            ? 'text-red-600 bg-red-50 border-red-100'
            : replicaStatus?.state === 'synced'
                ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                : 'text-sky-700 bg-sky-50 border-sky-100';
        return <section className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-4 shadow-sm space-y-4">
            <div><h3 className="text-sm font-semibold text-gray-900">星月记忆仓</h3><p className="mt-1 text-[10px] text-sky-700">记忆仓随设备保存，但不会整仓塞进每轮聊天；只在相关情境中取出有限记忆卡片。</p></div>
            <LocalPendingCandidateQueue />
            <div className={`rounded-xl border p-3 text-[10px] ${statusColor}`}><div className="font-medium">{replicaStatus?.label || '等待记忆仓副本'}</div>{replicaStatus?.error && <div className="mt-1 opacity-80">{replicaStatus.error}</div>}</div>
            {current ? <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                    <div className="rounded-xl bg-white/90 p-3 border border-white"><div className="text-base font-semibold text-indigo-700">v{current.version}</div><div className="text-[9px] text-gray-500">记忆仓版本</div></div>
                    <div className="rounded-xl bg-white/90 p-3 border border-white"><div className="text-base font-semibold text-sky-700">{current.moduleCount || modules.length}</div><div className="text-[9px] text-gray-500">主题书架</div></div>
                    <div className="rounded-xl bg-white/90 p-3 border border-white"><div className="text-base font-semibold text-purple-700">{current.cardCount || 0}</div><div className="text-[9px] text-gray-500">记忆卡片</div></div>
                    <div className="rounded-xl bg-white/90 p-3 border border-white"><div className="text-xs font-semibold text-gray-700">{shortHash(current.contentHash)}</div><div className="text-[9px] text-gray-500">内容指纹</div></div>
                </div>
                {desktop ? <div className="space-y-2">
                    {manageError && <div className="rounded-xl bg-red-50 p-3 text-[10px] text-red-600">{manageError}</div>}
                    <NewMemoryCard modules={modules} onSaved={acceptVault} />
                    <ReleaseWorkbench vault={managedVault} onSaved={acceptVault} />
                    {newCards.length > 0 && <details open className="rounded-xl border border-amber-100 bg-amber-50/70 p-3">
                        <summary className="cursor-pointer text-xs font-medium text-amber-800">待整理的新记忆卡片 <span className="ml-1 text-[9px] font-normal">{newCards.length} 张</span></summary>
                        <div className="mt-3 space-y-2">{newCards.map(card => <IncrementalCandidate key={card.candidateId} card={card} modules={modules} onSaved={acceptVault} />)}</div>
                    </details>}
                    {revisions.length > 0 && <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-[10px] text-amber-700">当前有 {revisions.length} 条待整理修订；它们尚未改变正式 v{current.version}。</div>}
                    {modules.map(module => <details key={module.moduleId} className="rounded-xl border border-sky-100 bg-white/80 p-3">
                        <summary className="cursor-pointer text-xs font-medium text-sky-800">{module.title}<span className="ml-2 text-[9px] font-normal text-gray-400">{module.cardCount} 张记忆卡片</span></summary>
                        <div className="mt-3 space-y-3">{(module.cards || []).map(card => <MemoryCard key={card.cardId} card={card} moduleId={module.moduleId} revision={revisionByCard.get(card.cardId)} onSaved={acceptVault} />)}</div>
                    </details>)}
                </div> : <details className="rounded-xl border border-sky-100 bg-white/80 p-3">
                    <summary className="cursor-pointer text-xs font-medium text-sky-800">查看主题书架</summary>
                    <div className="mt-3 grid gap-2">{modules.map(module => <div key={module.moduleId} className="rounded-lg border border-gray-100 bg-gray-50 p-2"><div className="text-[11px] font-medium text-gray-800">{module.title}</div><div className="mt-1 text-[9px] text-gray-500">{module.cardCount} 张记忆卡片</div></div>)}</div>
                </details>}
                <div className="text-[9px] text-gray-400">发布：{timeLabel(current.publishedAt)} · {current.releaseId}</div>
                {visibleVault.pendingCandidate && <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-[10px] text-amber-700">发现来源变化，已生成 v{visibleVault.pendingCandidate.version} 候选；当前仍保持 v{current.version}，不会自动发布。</div>}
            </> : <div className="rounded-xl border border-dashed border-sky-200 bg-white/70 p-5 text-center text-xs text-gray-500">这台设备还没有星月记忆仓副本。主机连接或云端恢复后会显示主题书架。</div>}
        </section>;
    }

    global.XingyuePortableWorldbookPanel = PortableWorldbookPanel;
})(window);
