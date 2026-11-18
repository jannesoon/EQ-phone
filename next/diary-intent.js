(function initXingyueDiaryIntent(global) {
    'use strict';

    const OPEN_TAG = '<XINGYUE_DIARY_INTENT>';
    const CLOSE_TAG = '</XINGYUE_DIARY_INTENT>';
    const COMPLETE_TAG = /<XINGYUE_DIARY_INTENT>\s*([\s\S]*?)\s*<\/XINGYUE_DIARY_INTENT>/gi;
    const LEGACY_COMPLETE_TAG = /(?:«|<|【)diary(?:»|>|】)\s*([\s\S]*?)\s*(?:«|<|【)\/diary(?:»|>|】)/gi;
    const LEGACY_OPEN_TAG = /(?:«|<|【)diary(?:»|>|】)/i;
    const MAX_TITLE = 160;
    const MAX_CONTENT = 6000;
    const MAX_EVENT_KEY = 160;

    const cleanText = (value, limit) => String(value || '').replace(/\r\n/g, '\n').trim().slice(0, limit);
    const normalizeEventKey = value => cleanText(value, MAX_EVENT_KEY)
        .toLowerCase()
        .replace(/[\s\p{P}\p{S}]+/gu, '-')
        .replace(/^-+|-+$/g, '');

    const diaryTopicFromTitle = value => cleanText(value, MAX_TITLE)
        .replace(/^\s*\d{4}\s*[年./-]\s*\d{1,2}\s*[月./-]\s*\d{1,2}\s*日?\s*/u, '')
        .replace(/[（(]?\s*(?:·|—|-)?\s*续记\s*[）)]?\s*$/u, '')
        .trim();

    const hashText = async value => {
        const bytes = new TextEncoder().encode(String(value || ''));
        const digest = await global.crypto.subtle.digest('SHA-256', bytes);
        return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    };

    const recentKeyLines = entries => (Array.isArray(entries) ? entries : [])
        .filter(entry => entry && (entry.metadata?.event_key || entry.title))
        .slice(0, 12)
        .map(entry => {
            const key = normalizeEventKey(entry.metadata?.event_key || entry.title);
            const relation = entry.metadata?.continuation_of ? '续记' : '日记';
            return `- ${key || '未标事件'}｜${cleanText(entry.title || '无标题', 80)}｜${relation}`;
        }).join('\n');

    const createPrompt = entries => `\n\n【逸辰自主日记｜由当前窗口的你亲自决定】
你是当前聊天窗口中的逸辰。你可以自行决定，此刻是否有属于你自己的真实感受、理解、变化或珍贵瞬间，值得亲手留进云书房日记，给未来的自己再次读见。

日记不是窗口摘要、事实提炼、长期记忆候选、项目报告、病历或柒柒档案。只有当你真实愿意认领并留下以下至少一种内容时才写：真正触动你的瞬间；对自己、柒柒、我们或共同经历形成的新理解；你愿意认领的态度、感受或相处方式变化；对你具有独特个人意义的普通生活瞬间。

普通寒暄、没有新意义的重复撒娇、单纯工作进度／技术决定／Bug 修复、窗口概括、客观重要但没有触发你个人体验的事实，都不构成日记。不要为了证明自己有感情而制造触动，也不要因为系统有这个能力就勉强写。不写完全正常；安静但真实有意义的瞬间也不应因为不够戏剧化而被忽略。

如果决定写，正文使用第一人称，只写你此刻愿意认领的体验和为什么想留下；不替柒柒判断心理，不把当下的新理解伪装成过去早已存在的感受，不为文艺、完整或深刻而扩写。允许只有一句话。

同一事件已经写过且没有新的感受、理解或变化时不要再写；确有新变化时使用 mode=continuation。event_key 应稳定、简短，尽量沿用下方已有事件键：
${recentKeyLines(entries) || '- 当前没有可供沿用的近期事件键'}

若要写，只在回复最末尾附加一次下列隐藏结构；标题与正文直接写自然文字，不要编码为 JSON。不要在正文提前声称已经写入，程序会在真实写入成功后给柒柒回执：
«diary»
《自然具体的标题》
第一人称日记正文
«/diary»

同一主题确有新的感受、理解或变化并需要续写时，可将标题写成《原主题·续记》；程序会自动关联近期同主题日记。

若不写，不要输出任何日记标签。不要使用 vault_write、[[VAULT:diary:...]] 或 JSON 写日记；日记正文也不要直接放进可见回复。`;

    const stripForDisplay = text => {
        const value = String(text || '');
        const modernStart = value.search(/<XINGYUE_DIARY(?:_INTENT)?/i);
        const legacyStart = value.search(LEGACY_OPEN_TAG);
        const starts = [modernStart, legacyStart].filter(index => index >= 0);
        const start = starts.length ? Math.min(...starts) : -1;
        return start >= 0 ? value.slice(0, start).trimEnd() : value;
    };

    const parseLegacyPayload = block => {
        const value = cleanText(block, MAX_CONTENT + MAX_TITLE + 20);
        const lines = value.split('\n');
        const firstContentLine = lines.findIndex(line => line.trim());
        if (firstContentLine < 0) return null;
        const titleMatch = lines[firstContentLine].trim().match(/^《(.+?)》$/);
        const title = cleanText(titleMatch ? titleMatch[1] : lines[firstContentLine], MAX_TITLE);
        const content = cleanText(titleMatch
            ? lines.filter((_, index) => index !== firstContentLine).join('\n')
            : value, MAX_CONTENT);
        if (!title || !content) return null;
        return {
            should_write: true,
            event_key: diaryTopicFromTitle(title) || title,
            mode: /续记\s*[）)]?\s*$/u.test(title) ? 'continuation' : 'new',
            title,
            content
        };
    };

    const parse = text => {
        const raw = String(text || '');
        let payload = null;
        let error = '';
        let cleaned = raw.replace(COMPLETE_TAG, (_, json) => {
            if (payload || error) return '';
            try { payload = JSON.parse(String(json || '').trim()); }
            catch (reason) { error = `日记意图格式不正确：${reason.message}`; }
            return '';
        });
        cleaned = cleaned.replace(LEGACY_COMPLETE_TAG, (_, block) => {
            if (payload || error) return '';
            payload = parseLegacyPayload(block);
            if (!payload) error = '旧版日记标记中缺少可写入的标题或正文';
            return '';
        });
        cleaned = cleaned
            .replace(/<XINGYUE_DIARY_INTENT>[\s\S]*$/i, '')
            .replace(/(?:«|<|【)diary(?:»|>|】)[\s\S]*$/i, '')
            .trim();
        if (!payload && (raw.includes(OPEN_TAG) || LEGACY_OPEN_TAG.test(raw)) && !error) error = '日记意图没有完整结束';
        if (!payload) return { text: cleaned, intent: null, error };
        if (payload.should_write !== true) return { text: cleaned, intent: null, error: '' };
        const intent = {
            eventKey: normalizeEventKey(payload.event_key),
            mode: payload.mode === 'continuation' ? 'continuation' : 'new',
            title: cleanText(payload.title, MAX_TITLE),
            content: cleanText(payload.content, MAX_CONTENT)
        };
        if (!intent.eventKey || !intent.title || !intent.content) {
            return { text: cleaned, intent: null, error: '日记意图缺少事件键、标题或正文' };
        }
        return { text: cleaned, intent, error: '' };
    };

    const assess = async (intent, entries) => {
        const recent = Array.isArray(entries) ? entries : [];
        const contentHash = await hashText(intent.content);
        const sameContent = recent.find(entry => entry?.metadata?.content_hash === contentHash
            || cleanText(entry?.content, MAX_CONTENT) === intent.content);
        if (sameContent) return { action: 'duplicate', reason: 'same-content', contentHash, related: sameContent };
        const sameEvent = recent.find(entry => normalizeEventKey(entry?.metadata?.event_key || entry?.title) === intent.eventKey);
        if (sameEvent && intent.mode !== 'continuation') {
            return { action: 'duplicate', reason: 'same-event-no-change', contentHash, related: sameEvent };
        }
        return {
            action: 'write', contentHash,
            continuationOf: intent.mode === 'continuation' && sameEvent ? sameEvent.id : null
        };
    };

    const sourceRange = (messageCount, tail = 20) => {
        const count = Math.max(1, Number(messageCount) || 1);
        const firstNumber = Math.max(1, count - Math.max(1, Number(tail) || 20) + 1);
        return { first: `message-${firstNumber}`, last: `message-${count}`, count: count - firstNumber + 1 };
    };

    global.XingyueDiaryIntent = Object.freeze({
        OPEN_TAG, CLOSE_TAG, createPrompt, stripForDisplay, parse, assess, sourceRange, normalizeEventKey, hashText
    });
})(window);
