(function initPortableWorldbook(global) {
    'use strict';
    const STORAGE_KEY = 'xingyue_portable_worldbook_v1';
    const CLOUD_KIND = 'portable-worldbook';
    const CLOUD_SHELF = 'docs';
    const CLOUD_TITLE = '星月记忆仓｜系统同步副本';
    const PENDING_CANDIDATE_KIND = 'pending-memory-candidate';

    const text = (value, limit = 160000) => String(value || '').replace(/\r\n/g, '\n').trim().slice(0, limit);
    const integer = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : fallback;

    const normalizeCard = card => ({
        cardId: text(card?.cardId, 160),
        title: text(card?.title, 300),
        headingPath: text(card?.headingPath, 600),
        level: Math.max(1, Math.min(integer(card?.level, 1), 4)),
        body: text(card?.body),
        factState: text(card?.factState, 80) || 'candidate',
        source: {
            sourceId: text(card?.source?.sourceId, 120),
            fileName: text(card?.source?.fileName, 260),
            startLine: Math.max(1, integer(card?.source?.startLine, 1)),
            endLine: Math.max(1, integer(card?.source?.endLine, 1))
        }
    });

    const normalizeModule = module => {
        const cards = (Array.isArray(module?.cards) ? module.cards : []).slice(0, 600).map(normalizeCard).filter(card => card.cardId && card.body);
        return {
            moduleId: text(module?.moduleId, 160),
            title: text(module?.title, 300),
            sourceFileName: text(module?.sourceFileName, 260),
            lifecycleState: ['active', 'portable-candidate'].includes(module?.lifecycleState) ? module.lifecycleState : 'portable-candidate',
            factStates: [...new Set((Array.isArray(module?.factStates) ? module.factStates : []).map(value => text(value, 80)).filter(Boolean))],
            cardCount: cards.length,
            contentHash: text(module?.contentHash, 128),
            cards
        };
    };

    const normalizeCurrent = current => {
        if (!current || current.worldbookId && current.worldbookId !== 'xingyue-portable-worldbook') return null;
        const modules = (Array.isArray(current.modules) ? current.modules : []).slice(0, 48).map(normalizeModule).filter(module => module.moduleId && module.cards.length);
        if (!modules.length) return null;
        return {
            schemaVersion: 1,
            worldbookId: 'xingyue-portable-worldbook',
            version: Math.max(1, integer(current.version, 1)),
            releaseId: text(current.releaseId, 180),
            contentHash: text(current.contentHash, 128),
            publishedAt: current.publishedAt || null,
            publishedBy: text(current.publishedBy, 160),
            sourceId: text(current.sourceId, 120),
            moduleCount: modules.length,
            cardCount: modules.reduce((total, module) => total + module.cards.length, 0),
            modules
        };
    };

    const normalizePayload = payload => {
        const current = normalizeCurrent(payload?.current);
        if (!current) return null;
        return {
            schemaVersion: 1,
            worldbookId: 'xingyue-portable-worldbook',
            current,
            pendingCandidate: payload?.pendingCandidate ? {
                version: Math.max(current.version + 1, integer(payload.pendingCandidate.version, current.version + 1)),
                releaseId: text(payload.pendingCandidate.releaseId, 180),
                contentHash: text(payload.pendingCandidate.contentHash, 128),
                moduleCount: integer(payload.pendingCandidate.moduleCount),
                cardCount: integer(payload.pendingCandidate.cardCount),
                createdAt: payload.pendingCandidate.createdAt || null
            } : null,
            updatedAt: payload?.updatedAt || current.publishedAt || null
        };
    };

    const readCache = (storage = global.localStorage) => {
        try { return normalizePayload(JSON.parse(storage?.getItem(STORAGE_KEY) || 'null')); }
        catch (_) { return null; }
    };

    const saveCache = (payload, storage = global.localStorage, sourceMode = 'host') => {
        const normalized = normalizePayload(payload);
        if (!normalized) throw new Error('星月记忆仓副本格式不正确');
        storage?.setItem(STORAGE_KEY, JSON.stringify({ ...normalized, cachedAt: new Date().toISOString(), sourceMode }));
        return normalized;
    };

    const compare = (left, right) => {
        const a = normalizePayload(left);
        const b = normalizePayload(right);
        if (!a) return b ? -1 : 0;
        if (!b) return 1;
        if (a.current.version !== b.current.version) return a.current.version > b.current.version ? 1 : -1;
        if (a.current.contentHash === b.current.contentHash) return 0;
        return null;
    };

    const parseCloudEntry = entry => {
        try {
            if (entry?.metadata?.xingyue_kind !== CLOUD_KIND) return null;
            return normalizePayload(JSON.parse(String(entry.content || '')));
        } catch (_) { return null; }
    };

    const readCloud = async repository => {
        if (!repository) return { ok: false, error: '云书房未连接' };
        const result = await repository.fetchEntries(CLOUD_SHELF, {
            columns: 'id, shelf_type, title, content, author, source, created_at, metadata',
            metadataContains: { xingyue_kind: CLOUD_KIND },
            limit: 10
        });
        if (!result.ok) return result;
        const candidates = (result.data || []).map(entry => ({ entry, payload: parseCloudEntry(entry) })).filter(item => item.payload)
            .sort((left, right) => right.payload.current.version - left.payload.current.version);
        return { ok: true, entry: candidates[0]?.entry || null, payload: candidates[0]?.payload || null, duplicates: Math.max(0, candidates.length - 1) };
    };

    const publishCloud = async (repository, payload) => {
        const normalized = normalizePayload(payload);
        if (!normalized) return { ok: false, error: '没有可发布的星月记忆仓' };
        const cloud = await readCloud(repository);
        if (!cloud.ok) return cloud;
        const relation = compare(normalized, cloud.payload);
        if (relation === null) return { ok: false, conflict: true, error: '云端与主机的记忆仓版本相同但内容不同，已停止覆盖' };
        if (relation < 0) return { ok: false, newerCloud: true, error: '云端记忆仓版本更新，已停止用旧主机副本覆盖' };
        if (relation === 0 && cloud.entry) return { ok: true, outcome: 'unchanged', entry: cloud.entry, payload: normalized };
        const metadata = {
            xingyue_kind: CLOUD_KIND,
            worldbook_id: normalized.worldbookId,
            version: normalized.current.version,
            content_hash: normalized.current.contentHash,
            schema_version: normalized.schemaVersion
        };
        const content = JSON.stringify(normalized);
        const result = cloud.entry
            ? await repository.updateEntry(cloud.entry.id, { title: CLOUD_TITLE, content, metadata })
            : await repository.addEntry({ shelf_type: CLOUD_SHELF, title: CLOUD_TITLE, content, metadata, author: 'ethan', source: 'xingyue-portable-worldbook' });
        return result.ok ? { ok: true, outcome: cloud.entry ? 'updated' : 'created', entry: result.data, payload: normalized } : result;
    };

    const publishPendingCandidate = async (repository, candidate) => {
        if (!repository || !candidate?.candidateId) return { ok: false, error: '云端待同步队列未连接' };
        const existing = await repository.fetchEntries(CLOUD_SHELF, { columns: 'id,content,metadata', metadataContains: { xingyue_kind: PENDING_CANDIDATE_KIND, candidate_id: candidate.candidateId }, limit: 4 });
        if (!existing.ok) return existing;
        const same = (existing.data || []).find(entry => {
            try { const value = JSON.parse(String(entry.content || '')); return value.candidateId === candidate.candidateId && JSON.stringify(value) === JSON.stringify(candidate); } catch (_) { return false; }
        });
        if (same) return { ok: true, outcome: 'unchanged', entry: same };
        const conflictSuffix = (existing.data || []).length ? ` · 冲突副本 ${(existing.data || []).length + 1}` : '';
        return repository.addEntry({ shelf_type: CLOUD_SHELF, title: `待同步记忆候选｜${text(candidate.title, 80)}${conflictSuffix}`, content: JSON.stringify(candidate), metadata: { xingyue_kind: PENDING_CANDIDATE_KIND, candidate_id: candidate.candidateId, content_hash: text(candidate.idempotencyKey, 180) }, author: 'Ethan', source: 'xingyue-offline-memory-candidate' });
    };

    const readPendingCandidates = async repository => {
        if (!repository) return { ok: false, error: '云端待同步队列未连接', items: [] };
        const result = await repository.fetchEntries(CLOUD_SHELF, { columns: 'id,title,content,metadata,created_at', metadataContains: { xingyue_kind: PENDING_CANDIDATE_KIND }, limit: 100 });
        if (!result.ok) return { ...result, items: [] };
        const items = (result.data || []).map(entry => { try { return { entry, candidate: JSON.parse(String(entry.content || '')) }; } catch (_) { return null; } }).filter(item => item?.candidate?.candidateId);
        return { ok: true, items };
    };

    global.XingyuePortableWorldbook = Object.freeze({
        STORAGE_KEY, CLOUD_KIND, CLOUD_SHELF, PENDING_CANDIDATE_KIND, normalizePayload, readCache, saveCache, compare, readCloud, publishCloud, publishPendingCandidate, readPendingCandidates
    });
})(window);
