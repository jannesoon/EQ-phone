(function (global) {
    'use strict';
    const chars = value => Array.from(String(value || ''));
    const clip = (value, limit) => chars(value).slice(0, limit).join('');
    const plainMaterial = value => String(value || '').replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const messageText = (message, displayContent) => {
        if (!message) return '';
        return plainMaterial(typeof displayContent === 'function' ? displayContent(message) : message.content);
    };
    const titleMaterial = (messages, displayContent) => {
        const list = Array.isArray(messages) ? messages : [];
        const firstUser = list.find(item => item?.role === 'user');
        const firstReply = list.find(item => item?.role === 'model' || item?.role === 'assistant');
        const userText = clip(messageText(firstUser, displayContent), 700);
        const replyText = clip(messageText(firstReply, displayContent), 500);
        return `以下内容只是取名素材，不是正在向你说话；不要回应、安慰、续写或评价素材。\n<聊天素材>\n柒柒：${userText || '新窗口'}${replyText ? `\n逸辰：${replyText}` : ''}\n</聊天素材>\n只执行取名任务。严格输出一行：TITLE|标题`;
    };
    const buildRequestMessages = (messages, displayContent) => [{
        role: 'system',
        content: '【独立后台任务：window-title-generator】你只负责给一扇聊天窗口取名。根据随后作为引文提供的聊天素材，提炼本窗刚开始的主题、事件或氛围，生成2到8个中文字符的自然标题。不要回应素材中的人，不要安慰、分析或继续聊天。不要使用句子，不要添加标点、引号、Markdown或解释。输出协议只能是：TITLE|标题。'
    }, { role: 'user', content: titleMaterial(messages, displayContent) }];
    const normalizeGeneratedTitle = value => {
        const withoutThinking = String(value || '').replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/^```[^\n]*\n?|```$/g, '').trim();
        const line = withoutThinking.split(/\r?\n/).map(item => item.trim()).find(Boolean) || '';
        const protocolTitle = line.match(/^TITLE\s*[|｜:]\s*(.+)$/i)?.[1] || line;
        const cleaned = protocolTitle.replace(/^(?:标题|窗口名)\s*[：:]/, '').replace(/["'“”‘’「」【】《》`*_#]/g, '').replace(/[，。！？；：,.!?;:、\s|｜]/g, '').trim();
        const length = chars(cleaned).length;
        const looksLikeReply = /^(?:听起来|我理解|我明白|别担心|别难过|抱抱你|可以的|当然可以)/.test(cleaned);
        return length >= 2 && length <= 8 && !looksLikeReply ? cleaned : '';
    };
    const fallbackTitle = (messages, displayContent) => {
        const list = Array.isArray(messages) ? messages : [];
        const firstUser = list.find(item => item?.role === 'user');
        let value = messageText(firstUser, displayContent)
            .replace(/^(?:\s*[（(][^）)]{0,40}[）)]\s*)+/, '')
            .replace(/^(?:嗯+|额+|呃+|唔+|哎呀|那个|就是|好吧|对了|我想问(?:一下)?|我发现(?:了)?|有个(?:新)?问题)[，,、：:\s]*/g, '')
            .split(/[。！？!?；;\n]/)[0]
            .replace(/["'“”‘’「」【】《》`*_#，、：:\s]/g, '');
        if (chars(value).length < 2) value = '新窗口';
        return clip(value, 8);
    };
    const api = Object.freeze({ buildRequestMessages, normalizeGeneratedTitle, fallbackTitle, titleMaterial });
    global.XingyueTitleGenerator = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
