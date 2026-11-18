(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.XingyueHealth = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
    const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

    const toLocalDateKey = (dateValue = new Date()) => {
        const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const normalizeHealthRecords = (value) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
        const normalized = {};
        for (const [date, status] of Object.entries(value)) {
            if (!DATE_KEY_PATTERN.test(date) || typeof status !== 'string') continue;
            const cleaned = status.trim();
            if (cleaned) normalized[date] = cleaned;
        }
        return normalized;
    };

    const readStoredHealthRecords = (serialized) => {
        if (!serialized) return {};
        try { return normalizeHealthRecords(JSON.parse(serialized)); }
        catch (_) { return {}; }
    };

    const updateHealthRecord = (records, date, status) => {
        const next = { ...normalizeHealthRecords(records) };
        if (!DATE_KEY_PATTERN.test(String(date || ''))) return next;
        const cleaned = String(status || '').trim();
        if (cleaned) next[date] = cleaned;
        else delete next[date];
        return next;
    };

    const mergeHealthRecords = (current, incoming) => ({
        ...normalizeHealthRecords(current),
        ...normalizeHealthRecords(incoming)
    });

    const updateAnniversary = (anniversaries, date, value) => {
        const next = { ...(anniversaries || {}) };
        const monthDay = String(date || '').slice(5);
        if (!/^\d{2}-\d{2}$/.test(monthDay)) return next;
        const cleaned = String(value || '').trim();
        if (cleaned) next[monthDay] = cleaned;
        else delete next[monthDay];
        return next;
    };

    const parseHealthTag = (value) => {
        const text = String(value || '');
        const match = text.match(/«HEALTH:\s*(.*?)»/);
        if (!match) return { found: false, text };
        const raw = match[1].trim();
        let status = raw;
        let action = 'update';
        const pipeIndex = raw.lastIndexOf('|');
        if (pipeIndex > 0) {
            const candidate = raw.slice(pipeIndex + 1).trim().toLowerCase();
            if (['new', 'update', 'append'].includes(candidate)) {
                action = candidate;
                status = raw.slice(0, pipeIndex).trim();
            }
        }
        return {
            found: true,
            status,
            action,
            text: text.replace(/«HEALTH:\s*.*?»/g, '').trim()
        };
    };

    const applyHealthAction = (records, date, status, action = 'update') => {
        const current = normalizeHealthRecords(records);
        const cleaned = String(status || '').trim();
        if (!cleaned) return current;
        if (action !== 'append' || !current[date]) return updateHealthRecord(current, date, cleaned);
        const parts = current[date].split(/\s*·\s*/).map(item => item.trim()).filter(Boolean);
        if (!parts.includes(cleaned)) parts.push(cleaned);
        return updateHealthRecord(current, date, parts.join(' · '));
    };

    const buildMonthDays = (year, month) => {
        const totalDays = new Date(year, month + 1, 0).getDate();
        const startDay = new Date(year, month, 1).getDay();
        return Array(startDay).fill(null).concat(Array.from({ length: totalDays }, (_, index) => index + 1));
    };

    return {
        DATE_KEY_PATTERN,
        toLocalDateKey,
        normalizeHealthRecords,
        readStoredHealthRecords,
        updateHealthRecord,
        mergeHealthRecords,
        updateAnniversary,
        parseHealthTag,
        applyHealthAction,
        buildMonthDays
    };
});
