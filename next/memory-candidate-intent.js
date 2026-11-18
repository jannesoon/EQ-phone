(function initMemoryCandidateIntent(global) {
    'use strict';
    const OPEN = '«memory-candidate»';
    const CLOSE = '«/memory-candidate»';
    const COMPLETE = /«memory-candidate»\s*([\s\S]*?)\s*«\/memory-candidate»/gi;
    const OPEN_ONLY = /«memory-candidate»/i;
    const QUEUE_KEY = 'xingyue_memory_candidate_queue_v1';
    const clean = (value, limit = 6000) => String(value || '').replace(/\r\n/g, '\n').trim().slice(0, limit);
    const prompt = modules => `\n\n【星月记忆仓 · 增量候选】
当柒柒在本轮明确带来新的、会影响以后相处或理解的稳定变化（健康状态、偏好、关系理解、共同约定或重要生活状态），而这项变化尚未出现在已加载记忆中时，你可以在自然回复末尾附一份隐藏的增量候选。普通聊天、临时情绪、你的推测、重复旧事实和项目流水不要记录；拿不准就不写。候选不是正式长期记忆，之后仍会由我们整理并共同确认。

只使用一次以下格式：
«memory-candidate»
《简洁标题》
书架：${(modules || []).map(item => item.title).slice(0, 12).join('／') || '等待归类'}
状态：柒柒明确确认
只写经本轮原话支持的准确正文
«/memory-candidate»

书架必须从已有标题中选；确实是新主题可写“等待归类”。不得在可见回复里声称已经成为正式记忆，程序只会回执“已进入待整理区”。`;
    const stripForDisplay = value => { const text = String(value || ''); const index = text.search(OPEN_ONLY); return index >= 0 ? text.slice(0, index).trimEnd() : text; };
    const parse = value => {
        const raw = String(value || ''); let intent = null;
        const text = raw.replace(COMPLETE, (_, block) => {
            if (intent) return '';
            const lines = clean(block, 8000).split('\n').map(line => line.trim()).filter(Boolean);
            const titleMatch = lines.shift()?.match(/^《(.+?)》$/); if (!titleMatch) return '';
            const moduleLine = lines[0]?.match(/^书架[：:]\s*(.+)$/); if (moduleLine) lines.shift();
            const stateLine = lines[0]?.match(/^状态[：:]\s*(.+)$/); if (stateLine) lines.shift();
            const body = clean(lines.join('\n'));
            if (body) intent = { title: clean(titleMatch[1], 300), body, targetModuleTitle: clean(moduleLine?.[1] || '等待归类', 300), factState: /明确确认/.test(stateLine?.[1] || '') ? 'qiqi-confirmed' : 'conversation-candidate' };
            return '';
        }).replace(/«memory-candidate»[\s\S]*$/i, '').trim();
        return { text, intent, error: !intent && OPEN_ONLY.test(raw) ? '增量候选格式不完整' : '' };
    };
    const readQueue = (storage = global.localStorage) => { try { const value = JSON.parse(storage?.getItem(QUEUE_KEY) || '[]'); return Array.isArray(value) ? value : []; } catch (_) { return []; } };
    const writeQueue = (items, storage = global.localStorage) => { const saved = items.slice(-100); storage?.setItem(QUEUE_KEY, JSON.stringify(saved)); return saved; };
    const announceQueue = items => {
        try {
            if (typeof global.dispatchEvent === 'function' && typeof global.CustomEvent === 'function') {
                global.dispatchEvent(new global.CustomEvent('xingyue:memory-candidate-queue-updated', { detail: { items, count: items.length } }));
            }
        } catch (_) { /* 本地队列本身不能因界面通知失败而丢失 */ }
        return items;
    };
    const enqueue = (item, storage = global.localStorage) => { const queue = readQueue(storage); if (!queue.some(value => value.candidateId === item.candidateId)) queue.push(item); const saved = writeQueue(queue, storage); announceQueue(saved); return saved.length; };
    const remove = (candidateId, storage = global.localStorage) => announceQueue(writeQueue(readQueue(storage).filter(item => item.candidateId !== candidateId), storage));
    global.XingyueMemoryCandidateIntent = Object.freeze({ OPEN, CLOSE, QUEUE_KEY, prompt, stripForDisplay, parse, readQueue, enqueue, remove });
})(window);
