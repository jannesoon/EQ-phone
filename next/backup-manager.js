(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.XingyueBackup = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
    const CURRENT_FORMAT = 1;
    const ALLOWED_PACKAGE_TYPES = new Set(['device-transfer', 'automatic-backup']);

    const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    const cloneJson = (value) => JSON.parse(JSON.stringify(value));
    const toTimestamp = (value, fallback = Date.now()) => {
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) return numeric;
        const parsed = Date.parse(String(value || ''));
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const normalizeMemoryFiles = (value) => (Array.isArray(value) ? value : []).map(file => ({
        ...file,
        name: String(file?.name || '未命名记忆'),
        content: String(file?.content || ''),
        type: file?.type || 'journal'
    }));

    const normalizeLongTermMemories = (value) => (Array.isArray(value) ? value : []).map(item =>
        typeof item === 'string' ? { content: item } : { ...item, content: String(item?.content || '') }
    );

    const normalizeSessions = (value) => (Array.isArray(value) ? value : []).map(session => ({
        ...session,
        id: String(session.id),
        title: String(session.title || '新对话'),
        messages: (Array.isArray(session.messages) ? session.messages : []).map(message => ({ ...message, content: String(message?.content || '') })),
        timestamp: toTimestamp(session.timestamp),
        createdAt: toTimestamp(session.createdAt, toTimestamp(session.timestamp))
    }));

    const normalizeHealthRecords = (value) => {
        if (!isPlainObject(value)) return {};
        const result = {};
        for (const [date, status] of Object.entries(value)) {
            if (/^\d{4}-\d{2}-\d{2}$/.test(date) && typeof status === 'string' && status.trim()) result[date] = status.trim();
        }
        return result;
    };

    const validateBackupData = (raw) => {
        const errors = [];
        const warnings = [];
        if (!isPlainObject(raw)) return { ok: false, errors: ['备份内容必须是 JSON 对象'], warnings, data: null, summary: null };

        const recognized = ['config', 'sessions', 'memories', 'longTermMemories', 'healthRecords'].filter(key => raw[key] !== undefined);
        if (recognized.length === 0) errors.push('没有找到设置、聊天、记忆或健康记录');
        if (raw.packageType !== undefined && !ALLOWED_PACKAGE_TYPES.has(raw.packageType)) errors.push('无法识别该备份包类型');
        if (raw.config !== undefined && !isPlainObject(raw.config)) errors.push('设置数据格式不正确');
        if (raw.sessions !== undefined && !Array.isArray(raw.sessions)) errors.push('聊天窗口数据必须是列表');
        if (raw.memories !== undefined && !Array.isArray(raw.memories)) errors.push('记忆文件数据必须是列表');
        if (raw.longTermMemories !== undefined && !Array.isArray(raw.longTermMemories)) errors.push('长期记忆数据必须是列表');
        if (raw.healthRecords !== undefined && !isPlainObject(raw.healthRecords)) errors.push('健康记录数据必须是对象');

        if (Array.isArray(raw.sessions)) {
            const ids = new Set();
            raw.sessions.forEach((session, sessionIndex) => {
                if (!isPlainObject(session)) { errors.push(`第 ${sessionIndex + 1} 个聊天窗口格式不正确`); return; }
                if (session.id === undefined || session.id === null || String(session.id).trim() === '') errors.push(`第 ${sessionIndex + 1} 个聊天窗口缺少 ID`);
                else if (ids.has(String(session.id))) errors.push(`聊天窗口 ID 重复：${String(session.id)}`);
                else ids.add(String(session.id));
                if (!Array.isArray(session.messages)) { errors.push(`第 ${sessionIndex + 1} 个聊天窗口缺少消息列表`); return; }
                session.messages.forEach((message, messageIndex) => {
                    if (!isPlainObject(message) || typeof message.content !== 'string') {
                        errors.push(`第 ${sessionIndex + 1} 个窗口的第 ${messageIndex + 1} 条消息格式不正确`);
                    }
                });
            });
        }

        if (Array.isArray(raw.memories)) {
            raw.memories.forEach((file, index) => {
                if (!isPlainObject(file) || (file.content !== undefined && typeof file.content !== 'string')) errors.push(`第 ${index + 1} 个记忆文件格式不正确`);
            });
        }
        if (Array.isArray(raw.longTermMemories)) {
            raw.longTermMemories.forEach((item, index) => {
                if (typeof item !== 'string' && (!isPlainObject(item) || (item.content !== undefined && typeof item.content !== 'string'))) {
                    errors.push(`第 ${index + 1} 条长期记忆格式不正确`);
                }
            });
        }

        if (errors.length > 0) return { ok: false, errors, warnings, data: null, summary: null };
        if (!raw.packageType) warnings.push('已按旧版全量备份格式读取');

        const data = {
            formatVersion: Number(raw.formatVersion) || 0,
            version: String(raw.version || '旧版'),
            timestamp: raw.timestamp || null,
            packageType: raw.packageType || 'legacy-backup',
            containsSecrets: raw.containsSecrets === true,
            config: isPlainObject(raw.config) ? cloneJson(raw.config) : {},
            sessions: normalizeSessions(raw.sessions),
            memories: normalizeMemoryFiles(raw.memories),
            longTermMemories: normalizeLongTermMemories(raw.longTermMemories),
            healthRecords: normalizeHealthRecords(raw.healthRecords)
        };
        return {
            ok: true,
            errors,
            warnings,
            data,
            summary: {
                sessions: data.sessions.length,
                messages: data.sessions.reduce((total, session) => total + session.messages.length, 0),
                memories: data.memories.length,
                longTermMemories: data.longTermMemories.length,
                healthRecords: Object.keys(data.healthRecords).length
            }
        };
    };

    const parseBackupText = (text) => {
        try { return validateBackupData(JSON.parse(String(text || ''))); }
        catch (_) { return { ok: false, errors: ['备份文件不是有效的 JSON，未写入任何数据'], warnings: [], data: null, summary: null }; }
    };

    const buildPackage = (input, packageType, containsSecrets, config) => ({
        formatVersion: CURRENT_FORMAT,
        version: input.version,
        timestamp: input.timestamp || new Date().toISOString(),
        packageType,
        containsSecrets,
        config,
        memories: cloneJson(input.memories || []),
        longTermMemories: cloneJson(input.longTermMemories || []),
        sessions: cloneJson(input.sessions || []),
        healthRecords: cloneJson(input.healthRecords || {})
    });

    const createDeviceTransferPackage = (input) => buildPackage(input, 'device-transfer', true, cloneJson(input.config || {}));

    const createAutomaticBackupPackage = (input, sanitizeConfig) =>
        buildPackage(input, 'automatic-backup', false, sanitizeConfig(cloneJson(input.config || {})));

    const mergeSessions = (current, incoming) => {
        const merged = new Map(normalizeSessions(current).map(session => [session.id, session]));
        normalizeSessions(incoming).forEach(session => {
            const existing = merged.get(session.id);
            if (!existing) merged.set(session.id, session);
            else if (session.messages.length > existing.messages.length) merged.set(session.id, { ...session, title: existing.title || session.title });
        });
        return [...merged.values()].sort((a, b) => b.timestamp - a.timestamp);
    };

    const mergeMemoryFiles = (current, incoming) => {
        const existingNames = new Set(normalizeMemoryFiles(current).map(file => file.name));
        return [...normalizeMemoryFiles(current), ...normalizeMemoryFiles(incoming).filter(file => !existingNames.has(file.name))];
    };

    const mergeLongTermMemories = (current, incoming) => {
        const existingContent = new Set(normalizeLongTermMemories(current).map(item => item.content));
        return [...normalizeLongTermMemories(current), ...normalizeLongTermMemories(incoming).filter(item => !existingContent.has(item.content))];
    };

    const mergeHealthRecords = (current, incoming) => ({ ...normalizeHealthRecords(current), ...normalizeHealthRecords(incoming) });

    const createRestoreCollections = (mode, current, incoming) => {
        if (mode === 'overwrite') return {
            sessions: normalizeSessions(incoming.sessions),
            memories: normalizeMemoryFiles(incoming.memories),
            longTermMemories: normalizeLongTermMemories(incoming.longTermMemories),
            healthRecords: normalizeHealthRecords(incoming.healthRecords)
        };
        return {
            sessions: mergeSessions(current.sessions, incoming.sessions),
            memories: mergeMemoryFiles(current.memories, incoming.memories),
            longTermMemories: mergeLongTermMemories(current.longTermMemories, incoming.longTermMemories),
            healthRecords: mergeHealthRecords(current.healthRecords, incoming.healthRecords)
        };
    };

    const writeStorageBatch = (storage, entries, removeKeys = []) => {
        const keys = [...Object.keys(entries), ...removeKeys];
        const snapshot = new Map(keys.map(key => [key, storage.getItem(key)]));
        try {
            Object.entries(entries).forEach(([key, value]) => storage.setItem(key, value));
            removeKeys.forEach(key => storage.removeItem(key));
        } catch (error) {
            snapshot.forEach((value, key) => value === null ? storage.removeItem(key) : storage.setItem(key, value));
            throw error;
        }
    };

    return {
        CURRENT_FORMAT,
        validateBackupData,
        parseBackupText,
        createDeviceTransferPackage,
        createAutomaticBackupPackage,
        mergeSessions,
        mergeMemoryFiles,
        mergeLongTermMemories,
        mergeHealthRecords,
        createRestoreCollections,
        writeStorageBatch
    };
});
