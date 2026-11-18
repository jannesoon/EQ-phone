(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.XingyueRecentLife = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
    'use strict';

    const textOf = value => String(value ?? '').trim();
    const DAY_MS = 24 * 60 * 60 * 1000;
    const DEFAULT_MAX_AGE_DAYS = 35;
    const DEFAULT_TOTAL_BUDGET = 2400;
    const DEFAULT_LOG_BUDGET = 1500;
    const DEFAULT_DIARY_BUDGET = 900;

    const estimateTokens = value => {
        const text = textOf(value);
        const cjk = (text.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || []).length;
        return Math.max(1, cjk + Math.ceil(Math.max(0, text.length - cjk) / 4));
    };

    const parseDate = value => {
        if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
        const raw = textOf(value).replace(/\s*\(已编辑\)\s*/g, '').replace(/年|月/g, '-').replace(/日/g, '');
        if (!raw) return null;
        const normalized = raw.replace(/\//g, '-');
        const parsed = new Date(normalized);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const safeDateLabel = value => {
        const date = parseDate(value);
        if (!date) return textOf(value) || '日期未标注';
        return new Intl.DateTimeFormat('zh-CN', {
            timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
        }).format(date);
    };

    const normalizeLocalCandidates = memories => (Array.isArray(memories) ? memories : []).flatMap(item => {
        const type = textOf(item?.type).toLowerCase();
        const content = textOf(item?.content);
        if (!content || !['journal', 'diary'].includes(type)) return [];
        const metadata = item?.metadata && typeof item.metadata === 'object' ? item.metadata : {};
        const kind = type === 'journal' ? 'window-log' : 'ethan-diary';
        const author = textOf(item?.author || metadata.author || (kind === 'window-log' ? 'Ethan & Qiqi' : ''));
        // 旧导入日记没有可靠作者字段，先留在资料库，不自动进入活跃近期生活层。
        if (kind === 'ethan-diary' && !/^ethan(?:\b|[._-])/i.test(author)) return [];
        return [{
            id: textOf(item?.id || item?.name), kind, title: textOf(item?.title || item?.name), content,
            author, source: textOf(item?.source || 'host-formal'), date: item?.date,
            sessionId: textOf(item?.sessionId || metadata.sessionId), confirmation: 'formal-host'
        }];
    });

    const normalizeCloudDiaryCandidates = entries => (Array.isArray(entries) ? entries : []).flatMap(item => {
        const content = textOf(item?.content);
        const author = textOf(item?.author);
        if (!content || !/^ethan(?:\b|[._-])/i.test(author)) return [];
        const metadata = item?.metadata && typeof item.metadata === 'object' ? item.metadata : {};
        return [{
            id: textOf(item?.id), kind: 'ethan-diary', title: textOf(item?.title), content,
            author, source: textOf(item?.source || 'cloud-vault'), date: item?.created_at || item?.date,
            sessionId: textOf(metadata.sessionId || metadata.session_id), confirmation: 'ethan-authored'
        }];
    });

    const chooseWithinBudget = (candidates, budget) => {
        const chosen = [];
        const seen = new Set();
        let usedTokens = 0;
        // 启动近期层只回答“最近发生了什么”：严格按时间倒序，不允许当前话题相关性把旧条目顶上来。
        const ranked = [...candidates].sort((left, right) => {
            const dateDiff = (parseDate(right.date)?.getTime() || 0) - (parseDate(left.date)?.getTime() || 0);
            return dateDiff || textOf(left.id).localeCompare(textOf(right.id), 'zh-CN');
        });
        for (const item of ranked) {
            const duplicateKey = item.content.replace(/\s+/g, ' ').trim();
            if (seen.has(duplicateKey)) continue;
            const tokens = estimateTokens(`${item.title}\n${item.content}`) + 28;
            // 不为凑预算机械截断正文；放不下的整篇留在候选池，按需检索。
            if (tokens > budget || usedTokens + tokens > budget) continue;
            chosen.push({ ...item, estimatedTokens: tokens });
            seen.add(duplicateKey);
            usedTokens += tokens;
        }
        return { chosen, usedTokens };
    };

    const formatItem = item => {
        if (item.kind === 'window-log') {
            const title = item.title ? `｜《${item.title}》` : '';
            return `【近期窗口日志｜记录时间：${safeDateLabel(item.date)}${title}｜${item.source}】\n${item.content}`;
        }
        const title = item.title ? `《${item.title}》\n` : '';
        return `【近期逸辰日记｜记录时间：${safeDateLabel(item.date)}｜${item.author}｜${item.source}】\n${title}${item.content}`;
    };

    const selectRecentLife = (options = {}) => {
        const now = options.now instanceof Date ? options.now : new Date(options.now || Date.now());
        const nowMs = now.getTime();
        const maxAgeDays = Math.max(1, Number(options.maxAgeDays) || DEFAULT_MAX_AGE_DAYS);
        const totalBudget = Math.max(512, Number(options.totalTokenBudget) || DEFAULT_TOTAL_BUDGET);
        const requestedLogBudget = Math.max(256, Number(options.logTokenBudget) || DEFAULT_LOG_BUDGET);
        const logBudget = Math.min(totalBudget, requestedLogBudget);
        const diaryBudget = Math.min(totalBudget - Math.min(logBudget, totalBudget - 256), Math.max(256, Number(options.diaryTokenBudget) || DEFAULT_DIARY_BUDGET));
        const currentSessionId = textOf(options.currentSessionId);
        const candidates = [
            ...normalizeLocalCandidates(options.localMemories),
            ...normalizeCloudDiaryCandidates(options.cloudDiaries)
        ].filter(item => {
            if (currentSessionId && item.sessionId && item.sessionId === currentSessionId) return false;
            const date = parseDate(item.date);
            return date && date.getTime() <= nowMs + DAY_MS && nowMs - date.getTime() <= maxAgeDays * DAY_MS;
        });

        const logs = chooseWithinBudget(candidates.filter(item => item.kind === 'window-log'), logBudget);
        const diaries = chooseWithinBudget(candidates.filter(item => item.kind === 'ethan-diary'), diaryBudget);
        const selected = [...logs.chosen, ...diaries.chosen].sort((left, right) =>
            (parseDate(right.date)?.getTime() || 0) - (parseDate(left.date)?.getTime() || 0));
        const usedTokens = logs.usedTokens + diaries.usedTokens;
        return {
            text: selected.length
                ? `【近期生活层 · 按时间取最新 · 非全量】\n以下内容用于接回近期共同生活与我的近期自我状态；它不是完整资料库，也不代表上一窗口的具体话题需要在这里继续。\n各条标题的记录时间不是事件发生时间；正文事件日期优先，旧状态后续未说明就保持未知。\n云端日记来源：${textOf(options.cloudDiarySourceLabel) || '未提供'}。\n\n${selected.map(formatItem).join('\n\n')}`
                : '',
            selected,
            usedTokens,
            candidateCount: candidates.length,
            budgets: { total: totalBudget, logs: logBudget, diaries: diaryBudget },
            sourceStatus: options.cloudDiarySourceStatus || null,
            selectionRule: 'strict-recency-separated-budgets-no-truncation'
        };
    };

    return Object.freeze({
        estimateTokens, parseDate, normalizeLocalCandidates, normalizeCloudDiaryCandidates, selectRecentLife
    });
});
