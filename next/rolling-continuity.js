(function (root, factory) {
    const contextApi = root?.XingyueContext
        || (typeof module === 'object' && module.exports ? require('./context-assembler.js') : null);
    const api = factory(contextApi);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.XingyueRollingContinuity = api;
})(typeof window !== 'undefined' ? window : globalThis, function (contextApi) {
    'use strict';

    const textOf = value => String(value ?? '');
    const displayText = message => textOf(Object.prototype.hasOwnProperty.call(message || {}, 'displayContent')
        ? message.displayContent : message?.content);
    const fallbackEstimate = value => {
        const text = textOf(value);
        const cjk = (text.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || []).length;
        return Math.max(1, cjk + Math.ceil(Math.max(0, text.length - cjk) / 4) + 12);
    };
    const messageTokens = message => contextApi?.estimateMessageTokens?.(message) || fallbackEstimate(displayText(message));
    const messageDigestText = message => `${message?.role || ''}\n${displayText(message)}`;

    // 后台记忆整理只需要关系连续性，不需要把露骨身体动作再次发送给模型供应商。
    // 原文始终保留在窗口总账；这里只抽取同条消息中可安全延续的明确感受／边界表达。
    const graphicIntimacyPattern = /(?:阴茎|龟头|肉棒|鸡巴|阳具|阴道|小穴|蜜穴|骚逼|奶子|乳头|插入|插进|抽插|内射|射精|自慰|口交|肛交|做爱|爱爱|dirty\s*talk|操(?:我|你|她|他|进|烂)|干(?:我|你|她|他))/i;
    const intimateActionPattern = /(?:喘|呻吟|颤抖|痉挛|深处|压住|按住|揉|舔|顶|抽出|湿透|硬挺|夹紧)/i;
    const continuityMeaningPattern = /(?:爱|喜欢|愿意|同意|允许|拒绝|不要我|离开|丢下|害怕|委屈|难过|安心|需要|想要|边界|约定|停下|继续|不舒服|疼|尊重|信任|只属于|在一起)/;

    const memorySummaryInput = value => {
        const text = textOf(value).replace(/\s+/g, ' ').trim();
        if (!text || !graphicIntimacyPattern.test(text)) return text;
        const meaningful = [...new Set(text.split(/[。！？!?；;，,～~…]+/)
            .map(part => part.replace(/^[（(][^）)]*[）)]\s*/, '').trim())
            .filter(part => part.length >= 2 && part.length <= 100)
            .filter(part => continuityMeaningPattern.test(part))
            .filter(part => !graphicIntimacyPattern.test(part) && !intimateActionPattern.test(part)))]
            .slice(0, 4);
        return `【双方成人亲密互动；露骨身体动作与措辞不进入后台记忆整理输入，完整原文仍保存在窗口总账${meaningful.length ? `；明确关系表达：${meaningful.join('；')}` : ''}。】`;
    };

    const hashText = value => {
        // FNV-1a 32 位只用于检测窗口编辑造成的分段失效，不承担安全用途。
        let hash = 0x811c9dc5;
        const text = textOf(value);
        for (let index = 0; index < text.length; index += 1) {
            hash ^= text.charCodeAt(index);
            hash = Math.imul(hash, 0x01000193);
        }
        return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
    };

    const rangeHash = (messages, fromIndex, toIndex) => hashText((Array.isArray(messages) ? messages : [])
        .slice(fromIndex, toIndex + 1).map(messageDigestText).join('\n\u241e\n'));

    const validSegments = (messages, segments) => {
        const values = Array.isArray(messages) ? messages : [];
        const ordered = (Array.isArray(segments) ? segments : [])
            .filter(item => Number.isInteger(item?.fromIndex) && Number.isInteger(item?.toIndex))
            .sort((left, right) => left.fromIndex - right.fromIndex);
        const valid = [];
        let expected = ordered.length ? ordered[0].fromIndex : 0;
        for (const item of ordered) {
            if (item.fromIndex !== expected || item.toIndex < item.fromIndex || item.toIndex >= values.length) break;
            if (item.sourceHash !== rangeHash(values, item.fromIndex, item.toIndex)) break;
            valid.push(item);
            expected = item.toIndex + 1;
        }
        return valid;
    };

    const coveredThrough = (segments, baseCoveredThrough = -1) => (Array.isArray(segments) && segments.length
        ? Math.max(baseCoveredThrough, ...segments.map(item => Number(item.toIndex)))
        : baseCoveredThrough);

    const planNextSegment = (messages, segments, options = {}) => {
        const values = Array.isArray(messages) ? messages : [];
        const baseCoveredThrough = Math.max(-1, Number(options.baseCoveredThrough) || -1);
        const valid = validSegments(values, segments).filter(item => item.toIndex > baseCoveredThrough);
        const startIndex = coveredThrough(valid, baseCoveredThrough) + 1;
        const keepTailMessages = Math.max(2, Number(options.keepTailMessages) || 6);
        const lastEligibleIndex = values.length - keepTailMessages - 1;
        if (startIndex > lastEligibleIndex) return null;

        const unsummarized = values.slice(startIndex);
        const unsummarizedTokens = unsummarized.reduce((total, message) => total + messageTokens(message), 0);
        const completedTurns = unsummarized.filter(message => message?.role === 'model').length;
        const triggerTokens = Math.max(4096, Number(options.triggerTokens) || 16000);
        const triggerTurns = Math.max(6, Number(options.triggerTurns) || 20);
        if (unsummarizedTokens < triggerTokens && completedTurns < triggerTurns && options.force !== true) return null;

        const targetTokens = Math.max(2048, Math.min(triggerTokens, Number(options.targetTokens) || 12000));
        let usedTokens = 0;
        let toIndex = startIndex - 1;
        for (let index = startIndex; index <= lastEligibleIndex; index += 1) {
            usedTokens += messageTokens(values[index]);
            toIndex = index;
            if (usedTokens >= targetTokens) break;
        }
        // 不把一轮的柒柒消息孤零零留在分段末尾；能带上紧随其后的逸辰回复时一并带上。
        if (values[toIndex]?.role === 'user' && toIndex + 1 <= lastEligibleIndex && values[toIndex + 1]?.role === 'model') {
            toIndex += 1;
            usedTokens += messageTokens(values[toIndex]);
        }
        if (toIndex < startIndex) return null;
        return {
            fromIndex: startIndex,
            toIndex,
            firstMessageId: `message-${startIndex + 1}`,
            lastMessageId: `message-${toIndex + 1}`,
            messageCount: toIndex - startIndex + 1,
            usedTokens,
            unsummarizedTokens,
            completedTurns,
            sourceHash: rangeHash(values, startIndex, toIndex),
            temporalRange: contextApi?.summarizeMessageTimeRange?.(values.slice(startIndex, toIndex + 1), { startIndex }) || null,
            messages: values.slice(startIndex, toIndex + 1)
        };
    };

    const bridgeText = (checkpoint, messages, options = {}) => {
        const rolling = checkpoint?.rolling || checkpoint;
        const activeTotal = Number(checkpoint?.active?.content?.sourceCoverage?.totalMessages) || 0;
        const baseCoveredThrough = activeTotal ? activeTotal - 1 : -1;
        const segments = validSegments(messages, rolling?.segments).filter(item => item.toIndex > baseCoveredThrough);
        if (!segments.length) return '';
        const maxTokens = Math.max(2048, Number(options.maxTokens) || 12000);
        const rows = [];
        let usedTokens = 0;
        for (const item of segments) {
            const firstDate = textOf(item?.temporalRange?.firstDate);
            const lastDate = textOf(item?.temporalRange?.lastDate);
            const dateRange = firstDate ? `｜${firstDate}${lastDate && lastDate !== firstDate ? `～${lastDate}` : ''}` : '';
            const row = `【窗口滚动衔接 ${item.firstMessageId}～${item.lastMessageId}${dateRange}】\n${textOf(item.body).trim()}`;
            const tokens = fallbackEstimate(row);
            if (rows.length && usedTokens + tokens > maxTokens) break;
            rows.push(row);
            usedTokens += tokens;
        }
        return rows.join('\n\n');
    };

    return Object.freeze({ hashText, rangeHash, validSegments, coveredThrough, planNextSegment, bridgeText, memorySummaryInput });
});
