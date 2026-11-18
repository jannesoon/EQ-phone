(function initXingyueCloudLibrary(global) {
    'use strict';

    const TABLE_NAME = 'entries';
    const ALL_SHELF_TYPES = Object.freeze([
        'pp', 'contract', 'about-qiqi',
        'photos', 'docs',
        'worklog', 'memos', 'diary', 'letters',
        'board', 'songs', 'covenant'
    ]);
    const FIXED_ANCHOR_SHELVES = Object.freeze(['pp', 'contract', 'about-qiqi', 'covenant']);
    const WRITABLE_AGENT_SHELVES = Object.freeze(['worklog', 'memos', 'diary', 'letters', 'about-qiqi', 'board', 'songs']);
    const PROTECTED_SHELVES = Object.freeze(['pp', 'contract', 'covenant']);

    const friendlyError = (error, action = '操作') => {
        const msg = error?.message || String(error || '未知错误');
        if (/JWT|api key|apikey|key is invalid/i.test(msg)) return `${action}失败：云书房密钥有问题，请重新连接`;
        if (/Failed to fetch|NetworkError|fetch failed/i.test(msg)) return `${action}失败：网络暂时连不上云书房`;
        if (/row-level security|policy/i.test(msg)) return `${action}失败：云书房权限没有放行`;
        return `${action}失败：${msg}`;
    };

    const decodeJwtRole = (key) => {
        if (typeof key !== 'string' || key.split('.').length !== 3 || typeof global.atob !== 'function') return '';
        try {
            const payload = key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const padded = payload + '='.repeat((4 - payload.length % 4) % 4);
            return JSON.parse(global.atob(padded))?.role || '';
        } catch (_) {
            return '';
        }
    };

    const validateCredentials = (url, key) => {
        const cleanUrl = String(url || '').trim().replace(/\/$/, '');
        const cleanKey = String(key || '').trim();
        if (!cleanUrl || !cleanKey) return { ok: false, error: 'URL 和 Publishable Key 都要填哦' };
        let parsed;
        try { parsed = new URL(cleanUrl); } catch (_) { return { ok: false, error: '云书房 URL 格式不正确' }; }
        if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.supabase.co')) {
            return { ok: false, error: '请填写 https://…supabase.co 格式的云书房地址' };
        }
        if (cleanKey.startsWith('sb_secret_') || decodeJwtRole(cleanKey) === 'service_role') {
            return { ok: false, error: '这里不能使用 Secret / service_role 密钥，请改用 Publishable Key 或 anon key' };
        }
        return { ok: true, url: cleanUrl, key: cleanKey };
    };

    const createClient = (url, key, supabaseNamespace = global.supabase) => {
        const checked = validateCredentials(url, key);
        if (!checked.ok) throw new Error(checked.error);
        if (!supabaseNamespace?.createClient) throw new Error('Supabase 客户端库还没加载完，等一下再试');
        return supabaseNamespace.createClient(checked.url, checked.key);
    };

    const createRepository = (client) => {
        if (!client?.from) throw new Error('云书房客户端不可用');

        const fetchEntries = async (shelfType, options = {}) => {
            try {
                let query = client.from(TABLE_NAME).select(options.columns || '*');
                if (shelfType) query = query.eq('shelf_type', shelfType);
                if (options.author) query = query.eq('author', options.author);
                if (options.metadataContains && typeof options.metadataContains === 'object') {
                    query = query.contains('metadata', options.metadataContains);
                }
                if (options.since) query = query.gte('created_at', options.since);
                if (options.until) query = query.lt('created_at', options.until);
                if (options.keyword) {
                    const keyword = String(options.keyword).replace(/[,%()]/g, ' ').trim();
                    if (keyword) query = query.or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`);
                }
                query = query.order(options.orderBy || 'created_at', { ascending: options.ascending === true });
                if (options.limit) query = query.limit(Math.max(1, Math.min(Number(options.limit) || 10, 100)));
                const { data, error } = await query;
                if (error) throw error;
                return { ok: true, data: data || [] };
            } catch (error) {
                return { ok: false, error: friendlyError(error, '读取') };
            }
        };

        const addEntry = async (entry) => {
            if (!entry?.shelf_type || !entry?.author) return { ok: false, error: 'shelf_type 和 author 是必填的' };
            try {
                const row = {
                    shelf_type: entry.shelf_type,
                    title: entry.title || null,
                    content: entry.content || null,
                    metadata: entry.metadata || {},
                    author: entry.author
                };
                if (entry.source !== undefined) row.source = entry.source;
                const { data, error } = await client.from(TABLE_NAME).insert([row]).select().single();
                if (error) throw error;
                return { ok: true, data };
            } catch (error) {
                return { ok: false, error: friendlyError(error, '写入') };
            }
        };

        const updateEntry = async (id, patch = {}) => {
            if (!id) return { ok: false, error: 'id 不能为空' };
            const allowed = {};
            if (patch.title !== undefined) allowed.title = patch.title;
            if (patch.content !== undefined) allowed.content = patch.content;
            if (patch.metadata !== undefined) allowed.metadata = patch.metadata;
            try {
                const { data, error } = await client.from(TABLE_NAME).update(allowed).eq('id', id).select().single();
                if (error) throw error;
                return { ok: true, data };
            } catch (error) {
                return { ok: false, error: friendlyError(error, '更新') };
            }
        };

        const deleteEntry = async (id) => {
            if (!id) return { ok: false, error: 'id 不能为空' };
            try {
                const { error } = await client.from(TABLE_NAME).delete().eq('id', id);
                if (error) throw error;
                return { ok: true };
            } catch (error) {
                return { ok: false, error: friendlyError(error, '删除') };
            }
        };

        const countShelf = async (shelfType) => {
            try {
                const { count, error } = await client.from(TABLE_NAME).select('*', { count: 'exact', head: true }).eq('shelf_type', shelfType);
                if (error) throw error;
                return { ok: true, count: count || 0 };
            } catch (error) {
                return { ok: false, error: friendlyError(error, '统计') };
            }
        };

        const loadStartupMemory = async () => {
            const anchors = {};
            for (const shelf of FIXED_ANCHOR_SHELVES) {
                const result = await fetchEntries(shelf, { columns: 'title, content, author, source, created_at' });
                if (!result.ok) return result;
                anchors[shelf] = result.data;
            }
            const since24h = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
            const [board, diary, worklog] = await Promise.all([
                fetchEntries('board', { columns: 'title, content, author, source, created_at', since: since24h }),
                // 候选池可以比最终注入多；真正进入上下文的篇目由 recent-life 独立预算动态筛选。
                fetchEntries('diary', { columns: 'id, title, content, author, source, created_at, metadata', limit: 24 }),
                fetchEntries('worklog', { columns: 'title, content, author, source, created_at', limit: 3 })
            ]);
            const failed = [board, diary, worklog].find(item => !item.ok);
            if (failed) return failed;
            return { ok: true, anchors, active: { board: board.data, diary: diary.data, worklog: worklog.data } };
        };

        return Object.freeze({ fetchEntries, addEntry, updateEntry, deleteEntry, countShelf, loadStartupMemory });
    };

    const testConnection = async (url, key, supabaseNamespace = global.supabase) => {
        try {
            const client = createClient(url, key, supabaseNamespace);
            const repository = createRepository(client);
            const result = await repository.fetchEntries(null, { columns: 'id, shelf_type', limit: 1 });
            if (!result.ok) return { ok: false, error: result.error };
            return { ok: true, client, repository };
        } catch (error) {
            return { ok: false, error: friendlyError(error, '连接') };
        }
    };

    global.XingyueCloudLibrary = Object.freeze({
        TABLE_NAME,
        ALL_SHELF_TYPES,
        FIXED_ANCHOR_SHELVES,
        WRITABLE_AGENT_SHELVES,
        PROTECTED_SHELVES,
        validateCredentials,
        createClient,
        createRepository,
        testConnection,
        friendlyError
    });
})(window);
