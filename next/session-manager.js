(function () {
    const cloneMessage = (message) => ({
        ...message,
        attachments: Array.isArray(message?.attachments) ? message.attachments.map(item => ({ ...item })) : message?.attachments,
        toolContexts: Array.isArray(message?.toolContexts) ? message.toolContexts.map(item => ({ ...item })) : message?.toolContexts,
        variants: Array.isArray(message?.variants)
            ? message.variants.map(variant => ({
                ...variant,
                futureMessages: Array.isArray(variant?.futureMessages)
                    ? variant.futureMessages.map(item => ({ ...item }))
                    : variant?.futureMessages
            }))
            : message?.variants
    });

    const createSessionId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const toTimestamp = (value, fallback = Date.now()) => {
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) return numeric;
        const parsed = Date.parse(String(value || ''));
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const titleFromMessages = (messages, fallback = '新对话') => {
        const first = Array.isArray(messages) ? messages.find(message => message?.role === 'user') : null;
        const visibleText = first && Object.prototype.hasOwnProperty.call(first, 'displayContent') ? first.displayContent : first?.content;
        return visibleText
            ?.slice(0, 20)
            .replace(/!\[.*?\]\(.*?\)/g, '[图片]')
            .trim() || fallback;
    };

    const validSessionTime = value => {
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) return numeric;
        const parsed = Date.parse(String(value || ''));
        return Number.isFinite(parsed) ? parsed : null;
    };

    // 已有窗口的标题与创建时间不随后台保底快照、回复完成快照重置。
    // 新窗口尚无已知元数据时，用生成 ID 的时间作为稳定创建时间。
    const preserveSessionMetadata = (session, known = null) => {
        const result = { ...(session || {}) };
        const incomingTitle = String(result.title || '').trim();
        const knownTitle = String(known?.title || '').trim();
        if ((!incomingTitle || incomingTitle === '新对话') && knownTitle && knownTitle !== '新对话') {
            result.title = knownTitle;
        }
        const incomingCreated = validSessionTime(result.createdAt);
        const knownCreated = validSessionTime(known?.createdAt);
        const idCreated = validSessionTime(String(result.id || '').match(/^\d{13}(?=-|$)/)?.[0]);
        result.createdAt = knownCreated && (!incomingCreated || knownCreated < incomingCreated)
            ? knownCreated
            : incomingCreated || idCreated || validSessionTime(result.timestamp) || Date.now();
        return result;
    };

    const normalizeSession = (session) => ({
        ...session,
        id: String(session?.id || createSessionId()),
        title: String(session?.title || titleFromMessages(session?.messages)).trim() || '新对话',
        messages: Array.isArray(session?.messages) ? session.messages.map(cloneMessage) : [],
        timestamp: toTimestamp(session?.timestamp),
        createdAt: toTimestamp(session?.createdAt, toTimestamp(session?.timestamp))
    });

    const upsertSessionList = (sessions, incoming) => {
        const byId = new Map();
        (Array.isArray(sessions) ? sessions : []).forEach(session => {
            const normalized = normalizeSession(session);
            byId.set(normalized.id, normalized);
        });
        if (incoming) {
            const normalized = normalizeSession(incoming);
            byId.set(normalized.id, normalized);
        }
        return [...byId.values()].sort((a, b) => b.timestamp - a.timestamp);
    };

    const removeSession = (sessions, sessionId) =>
        (Array.isArray(sessions) ? sessions : []).filter(session => String(session.id) !== String(sessionId));

    const filterSessionsByView = (sessions, { desktop = false, view = 'active' } = {}) => {
        const values = Array.isArray(sessions) ? sessions : [];
        if (desktop && view === 'archived') return values.filter(session => session?.archived === true);
        return values.filter(session => session?.archived !== true);
    };

    const summarizeSessionForArchive = (session) => {
        const messages = Array.isArray(session?.messages) ? session.messages : [];
        const attachmentCount = messages.reduce((total, message) => total
            + (Array.isArray(message?.attachments) ? message.attachments.length : 0), 0);
        return {
            id: String(session?.id || ''),
            title: String(session?.title || '未命名对话'),
            messageCount: Number.isFinite(Number(session?.messageCount)) ? Number(session.messageCount) : messages.length,
            attachmentCount: Number.isFinite(Number(session?.attachmentCount)) ? Number(session.attachmentCount) : attachmentCount,
            timestamp: toTimestamp(session?.timestamp, toTimestamp(session?.createdAt))
        };
    };

    const stripHostSessionMetadata = (session) => {
        const { hostRevision, hostSavedAt, syncSource, ...localSession } = session && typeof session === 'object' ? session : {};
        return localSession;
    };

    const syncImageText = message => {
        const raw = String(message?.content || '');
        const content = raw
            .replace(/!\[[^\]]*\]\(data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/_=\r\n-]+\)/gi, '【图片】')
            .replace(/data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/_=\r\n-]+/gi, '【图片】');
        return Array.isArray(message?.attachments) && message.attachments.length > 0 && !content.includes('【图片】')
            ? `${content.trimEnd()}${content.trim() ? '\n\n' : ''}【图片】`
            : content;
    };

    const syncMessageKey = message => {
        const role = String(message?.role || '').toLowerCase();
        return JSON.stringify({
            role: role === 'model' ? 'assistant' : role,
            content: syncImageText(message)
        });
    };

    // 启动时不能只相信“队列为空”。如果手机本地内容比主机长，说明曾经有消息
    // 没有成功入队；此时必须保留手机内容并先补传，不能直接采用较旧主机基线。
    const compareSessionSequence = (hostSession, localSession) => {
        const hostMessages = Array.isArray(hostSession?.messages) ? hostSession.messages : [];
        const localMessages = Array.isArray(localSession?.messages) ? localSession.messages : [];
        if (!hostSession) return localMessages.length ? 'local-only' : 'same';
        let common = 0;
        while (common < hostMessages.length && common < localMessages.length
            && syncMessageKey(hostMessages[common]) === syncMessageKey(localMessages[common])) common += 1;
        if (common === hostMessages.length && common === localMessages.length) return 'same';
        if (common === hostMessages.length) return 'local-extension';
        if (common === localMessages.length) return 'host-extension';
        return 'diverged';
    };

    // 主机按用户选择只保存【图片】；同一设备重新读主机基线时，不能让占位
    // 反向覆盖它本地的原图。只在消息 ID、角色和去图后的正文全部相同时回填。
    const preserveLocalImagesInHostSession = (hostSession, localSession) => {
        const localMessages = Array.isArray(localSession?.messages) ? localSession.messages : [];
        if (String(hostSession?.id || '') !== String(localSession?.id || '') || !localMessages.length) return hostSession;
        const localById = new Map(localMessages.filter(message => message?.id).map(message => [String(message.id), message]));
        return {
            ...hostSession,
            messages: (Array.isArray(hostSession?.messages) ? hostSession.messages : []).map((hostMessage, index) => {
                const localMessage = hostMessage?.id ? localById.get(String(hostMessage.id)) : localMessages[index];
                if (!localMessage || String(hostMessage?.role) !== String(localMessage?.role)) return hostMessage;
                if (hostMessage?.id && String(hostMessage.id) !== String(localMessage.id || '')) return hostMessage;
                const hasLocalImage = (Array.isArray(localMessage.attachments) && localMessage.attachments.some(item => item?.dataUrl))
                    || /data:image\//i.test(String(localMessage.content || ''));
                if (!hasLocalImage || !String(hostMessage?.content || '').includes('【图片】')
                    || syncImageText(hostMessage) !== syncImageText(localMessage)) return hostMessage;
                const restored = cloneMessage(hostMessage);
                restored.content = localMessage.content;
                if (Object.prototype.hasOwnProperty.call(localMessage, 'displayContent')) restored.displayContent = localMessage.displayContent;
                else delete restored.displayContent;
                restored.attachments = Array.isArray(localMessage.attachments) ? localMessage.attachments.map(item => ({ ...item })) : [];
                return restored;
            })
        };
    };

    const mergeAssistantTurnSegments = segments => (Array.isArray(segments) ? segments : [segments])
        .map(value => String(value || '').trim())
        .filter(Boolean)
        .join('\n\n');

    // 流式 chunk 只是同一回复的传输状态；完成时提交到当前版本，不制造后台 A/B 回复。
    const commitStreamedMessageVariant = (message, variantIndex, finalContent, finalReasoningContent, timestamp) => {
        const nextMessage = cloneMessage(message || {});
        const variants = Array.isArray(nextMessage.variants) && nextMessage.variants.length
            ? nextMessage.variants
            : [{
                content: nextMessage.content || '',
                reasoningContent: nextMessage.reasoningContent || '',
                modelName: nextMessage.modelName,
                timestamp: nextMessage.timestamp
            }];
        const targetIndex = Number.isInteger(variantIndex) && variantIndex >= 0 && variantIndex < variants.length
            ? variantIndex
            : Math.max(0, variants.length - 1);
        const streamedVariant = variants[targetIndex] || {};
        variants[targetIndex] = {
            ...streamedVariant,
            content: String(finalContent || ''),
            reasoningContent: finalReasoningContent || '',
            timestamp: timestamp || streamedVariant.timestamp || nextMessage.timestamp
        };
        const selected = variants[targetIndex];
        nextMessage.variants = variants;
        nextMessage.currentVariantIndex = targetIndex;
        nextMessage.content = selected.content || '';
        nextMessage.reasoningContent = selected.reasoningContent || '';
        nextMessage.modelName = selected.modelName || nextMessage.modelName;
        nextMessage.timestamp = selected.timestamp || nextMessage.timestamp;
        return nextMessage;
    };

    const switchMessageVariant = (messages, messageIndex, direction) => {
        const nextMessages = (Array.isArray(messages) ? messages : []).map(cloneMessage);
        const message = nextMessages[messageIndex];
        if (!message || !Array.isArray(message.variants) || message.variants.length < 2) return nextMessages;
        const currentIndex = Number.isInteger(message.currentVariantIndex) ? message.currentVariantIndex : 0;
        const nextIndex = currentIndex + direction;
        if (nextIndex < 0 || nextIndex >= message.variants.length) return nextMessages;

        if (message.role === 'user') {
            message.variants[currentIndex] = {
                ...message.variants[currentIndex],
                futureMessages: nextMessages.slice(messageIndex + 1).map(cloneMessage)
            };
        }

        const variant = message.variants[nextIndex];
        message.currentVariantIndex = nextIndex;
        message.content = variant.content || '';
        message.displayContent = Object.prototype.hasOwnProperty.call(variant, 'displayContent') ? variant.displayContent : message.content;
        if (Array.isArray(variant.attachments)) message.attachments = variant.attachments.map(item => ({ ...item }));
        if (Array.isArray(variant.toolContexts)) message.toolContexts = variant.toolContexts.map(item => ({ ...item }));
        message.reasoningContent = variant.reasoningContent || '';
        message.modelName = variant.modelName || message.modelName;
        message.timestamp = variant.timestamp || message.timestamp;
        nextMessages[messageIndex] = message;

        if (message.role === 'user') {
            return [...nextMessages.slice(0, messageIndex + 1), ...(variant.futureMessages || []).map(cloneMessage)];
        }
        return nextMessages;
    };

    const editAssistantMessage = (messages, messageIndex, content, timestamp) => {
        const nextMessages = (Array.isArray(messages) ? messages : []).map(cloneMessage);
        const message = nextMessages[messageIndex];
        if (!message) return nextMessages;
        const variants = Array.isArray(message.variants) && message.variants.length
            ? message.variants
            : [{
                content: message.content || '',
                reasoningContent: message.reasoningContent || '',
                modelName: message.modelName,
                timestamp: message.timestamp
            }];
        const currentIndex = Number.isInteger(message.currentVariantIndex) ? message.currentVariantIndex : 0;
        variants[currentIndex] = { ...variants[currentIndex], content, timestamp };
        nextMessages[messageIndex] = { ...message, content, timestamp, variants, currentVariantIndex: currentIndex };
        return nextMessages;
    };

    const prepareUserMessageEdit = (messages, messageIndex, content, timestamp) => {
        const nextMessages = (Array.isArray(messages) ? messages : []).map(cloneMessage);
        const message = nextMessages[messageIndex];
        if (!message) return { messages: nextMessages, variantIndex: -1 };

        const variants = Array.isArray(message.variants) && message.variants.length
            ? message.variants
            : [{ content: message.content, timestamp: message.timestamp, futureMessages: [] }];
        const currentIndex = Number.isInteger(message.currentVariantIndex) ? message.currentVariantIndex : 0;
        variants[currentIndex] = {
            ...variants[currentIndex],
            displayContent: Object.prototype.hasOwnProperty.call(message, 'displayContent') ? message.displayContent : message.content,
            attachments: Array.isArray(message.attachments) ? message.attachments.map(item => ({ ...item })) : [],
            toolContexts: Array.isArray(message.toolContexts) ? message.toolContexts.map(item => ({ ...item })) : [],
            futureMessages: nextMessages.slice(messageIndex + 1).map(cloneMessage)
        };
        const variantIndex = variants.length;
        variants.push({
            content,
            displayContent: content,
            timestamp,
            attachments: Array.isArray(message.attachments) ? message.attachments.map(item => ({ ...item })) : [],
            toolContexts: [],
            futureMessages: []
        });
        nextMessages[messageIndex] = {
            ...message,
            content,
            displayContent: content,
            toolContexts: [],
            timestamp,
            variants,
            currentVariantIndex: variantIndex
        };
        return { messages: nextMessages.slice(0, messageIndex + 1), variantIndex };
    };

    window.XingyueSessions = {
        createSessionId,
        titleFromMessages,
        normalizeSession,
        preserveSessionMetadata,
        upsertSessionList,
        removeSession,
        filterSessionsByView,
        summarizeSessionForArchive,
        stripHostSessionMetadata,
        compareSessionSequence,
        preserveLocalImagesInHostSession,
        mergeAssistantTurnSegments,
        commitStreamedMessageVariant,
        switchMessageVariant,
        editAssistantMessage,
        prepareUserMessageEdit
    };
})();
