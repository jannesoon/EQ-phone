(function initMemorySourcesPanel(global) {
    'use strict';
    const { useEffect, useMemo, useState } = React;
    const statusText = {
        registered: '待扫描', scanning: '扫描中', catalogued: '已登记', deferred: '稍后接入',
        missing: '原件缺失', failed: '扫描失败', ready: '索引可用', stale: '有新内容待更新', unindexed: '首次查询时建立索引', error: '索引暂不可用'
    };
    const statusStyle = {
        catalogued: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        deferred: 'bg-gray-50 text-gray-500 border-gray-100',
        missing: 'bg-amber-50 text-amber-700 border-amber-100',
        failed: 'bg-red-50 text-red-700 border-red-100',
        scanning: 'bg-blue-50 text-blue-700 border-blue-100',
        registered: 'bg-indigo-50 text-indigo-700 border-indigo-100'
    };
    const formatBytes = value => {
        const bytes = Number(value || 0);
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
        return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
    };

    function MemorySourcesPanel({ showToast = () => {} }) {
        const desktop = typeof global.xingyueDesktop?.requestLocalAgent === 'function';
        const client = useMemo(() => global.XingyueAgentClient?.createMemorySourceClient?.(), []);
        const [catalog, setCatalog] = useState(null);
        const [busy, setBusy] = useState(false);
        const [error, setError] = useState('');
        const refresh = async () => {
            if (!desktop || !client) return;
            setError('');
            try { setCatalog(await client.read()); }
            catch (reason) { setError(reason?.message || '记忆资料目录不可用'); }
        };
        useEffect(() => { refresh(); }, []);
        const scan = async () => {
            if (busy || !client) return;
            setBusy(true); setError('');
            try {
                setCatalog(await client.scan());
                showToast('资料索引检查完成，请核对各来源状态；原件保持只读');
            } catch (reason) { setError(reason?.message || '资料目录扫描失败'); }
            finally { setBusy(false); }
        };
        if (!desktop) return null;
        const sources = (Array.isArray(catalog?.sources) ? catalog.sources : []).map(source => {
            const indexed = (catalog?.historySources || []).find(item => item.id === source.id);
            return indexed ? { ...source, ...indexed } : source;
        });
        return (
            <section className="bg-white border border-sky-100 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">本地记忆资料目录</h3>
                        <p className="text-[10px] text-sky-600 mt-1">明确白名单 · 原件只读 · 派生目录可重建</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={refresh} disabled={busy} className="text-[10px] px-2 py-1 rounded-lg bg-gray-50 text-gray-600 disabled:opacity-50">刷新</button>
                        <button onClick={scan} disabled={busy} className="text-[10px] px-3 py-1 rounded-lg bg-sky-600 text-white disabled:opacity-50">{busy ? '更新中…' : '更新资料索引'}</button>
                    </div>
                </div>
                <p className="text-[10px] text-gray-500 bg-sky-50/60 rounded-lg p-2">已接入的历史聊天在查询时检查更新，只将相关片段交给模型；新资料不会自动扩大范围。其余目录登记与历史查询索引分开显示。</p>
                {error && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">{error}</div>}
                <div className="space-y-2">
                    {sources.map(source => (
                        <details key={source.id} className="rounded-lg border border-gray-100 bg-gray-50/40 p-3">
                            <summary className="cursor-pointer list-none flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="text-xs font-medium text-gray-700">{source.title}</div>
                                    <div className="text-[9px] text-gray-400 mt-1">{source.id} · {source.fileCount || 0} 个文件 · {formatBytes(source.totalBytes)}</div>
                                </div>
                                <span className={`flex-shrink-0 text-[9px] px-2 py-1 border rounded-full ${statusStyle[source.status] || statusStyle.registered}`}>{statusText[source.status] || source.status}</span>
                            </summary>
                            <div className="mt-3 text-[10px] text-gray-600 space-y-2">
                                <p>{source.description}</p>
                                {(source.indexedAt || source.history?.indexedAt) && <div>查询索引更新：{new Date(source.indexedAt || source.history.indexedAt).toLocaleString('zh-CN')}</div>}
                                <div className="font-mono break-all text-[9px] text-gray-400">{(source.roots || []).join('\n')}</div>
                                {source.fingerprint && <div className="font-mono break-all text-[9px] text-emerald-600">SHA-256 目录指纹：{source.fingerprint}</div>}
                                {source.error && <div className="text-red-600">{source.error}</div>}
                            </div>
                        </details>
                    ))}
                </div>
            </section>
        );
    }
    global.XingyueMemorySourcesPanel = MemorySourcesPanel;
})(window);
