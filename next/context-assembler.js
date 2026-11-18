(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.XingyueContext = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
    'use strict';

    const cloneJsonValue = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));
    const textOf = value => String(value ?? '');
    const hasOwn = (value, key) => Boolean(value) && Object.prototype.hasOwnProperty.call(value, key);

    const getDisplayContent = message => textOf(
        hasOwn(message, 'displayContent') ? message.displayContent : message?.content
    );

    const LEGACY_MARKDOWN_IMAGE_PATTERN = /!\[[^\]]*\]\(\s*data:image\/[^;,\s)]+;base64,[A-Za-z0-9+/=\r\n]+\s*\)/gi;
    const LEGACY_RAW_IMAGE_PATTERN = /data:image\/[^;,\s)]+;base64,[A-Za-z0-9+/=\r\n]+/gi;
    const countLegacyInlineImages = value => {
        const text = textOf(value);
        const markdown = text.match(LEGACY_MARKDOWN_IMAGE_PATTERN) || [];
        const remainder = text.replace(LEGACY_MARKDOWN_IMAGE_PATTERN, '');
        return markdown.length + (remainder.match(LEGACY_RAW_IMAGE_PATTERN) || []).length;
    };
    const compactLegacyImagePayloads = value => textOf(value)
        .replace(LEGACY_MARKDOWN_IMAGE_PATTERN, '[图片]')
        .replace(LEGACY_RAW_IMAGE_PATTERN, '[图片数据已省略]');
    const parseJsonObjectText = value => {
        const raw = textOf(value).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        const firstBrace = raw.indexOf('{');
        const lastBrace = raw.lastIndexOf('}');
        if (firstBrace < 0 || lastBrace <= firstBrace) throw new Error('没有返回可核对的 JSON 对象');
        const parsed = JSON.parse(raw.slice(firstBrace, lastBrace + 1));
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('返回结果不是 JSON 对象');
        return parsed;
    };
    const parseCheckpointLineProtocol = value => {
        const records = [];
        let current = null;
        const normalized = textOf(value).trim()
            .replace(/^```[^\r\n]*\r?\n?/i, '')
            .replace(/\r?\n?```\s*$/i, '');
        const normalizeMessageId = item => {
            const token = textOf(item).trim().replace(/^[`'"\[\]()]+|[`'"\[\]()]+$/g, '');
            const match = token.match(/^(?:message[-_\s:]*)?(\d+)$/i);
            return match ? `message-${Number(match[1])}` : '';
        };
        for (const rawLine of normalized.split(/\r?\n/)) {
            const line = rawLine.trim().replace(/^[-*>]\s*/, '').replaceAll('｜', '|');
            if (!line) continue;
            const match = line.match(/^(LOG|OVERVIEW|MOMENT|LANDING|THREAD|UNDERSTANDING|SUMMARY|FACT|OPEN|AGREEMENT)\s*\|\s*([^|]*)\|\s*(.*)$/i);
            if (match) {
                current = {
                    type: match[1].toUpperCase(),
                    sourceMessageIds: [...new Set(match[2].split(/[,，、]/).map(normalizeMessageId).filter(Boolean))],
                    text: match[3].trim()
                };
                records.push(current);
            } else if (current) {
                current.text = `${current.text} ${line}`.trim();
            }
        }
        const windowLog = records.find(record => record.type === 'LOG');
        if (windowLog) {
            if (!windowLog.text) throw new Error('LOG 行没有返回日志正文');
            if (!windowLog.sourceMessageIds.length) throw new Error('LOG 行没有返回可核对的消息编号');
            return {
                contentSchema: 'window-log-v1',
                body: windowLog.text,
                sourceMessageIds: windowLog.sourceMessageIds
            };
        }
        const overview = records.find(record => record.type === 'OVERVIEW') || records.find(record => record.type === 'SUMMARY');
        if (!overview?.text || !overview.sourceMessageIds.length) throw new Error('后台没有返回可核对的 LOG 行');
        const mapItems = type => records.filter(record => record.type === type && record.text && record.sourceMessageIds.length)
            .map(record => ({ text: record.text, sourceMessageIds: record.sourceMessageIds }));
        const chronicle = records.some(record => ['OVERVIEW', 'MOMENT', 'LANDING', 'THREAD', 'UNDERSTANDING'].includes(record.type));
        if (chronicle) {
            const currentLanding = mapItems('LANDING')[0] || null;
            if (!currentLanding) throw new Error('后台没有返回可核对的 LANDING 行');
            return {
                contentSchema: 'window-chronicle-v1',
                overview: overview.text,
                overviewSourceMessageIds: overview.sourceMessageIds,
                keyMoments: mapItems('MOMENT'),
                currentLanding,
                continuingThreads: mapItems('THREAD'),
                windowUnderstandings: mapItems('UNDERSTANDING'),
                sourceMessageIds: [...new Set(records.flatMap(record => record.sourceMessageIds))]
            };
        }
        const confirmedFacts = mapItems('FACT');
        const openItems = mapItems('OPEN');
        const explicitAgreements = mapItems('AGREEMENT');
        return {
            summary: overview.text,
            confirmedFacts,
            openItems,
            explicitAgreements,
            sourceMessageIds: [...new Set(records.flatMap(record => record.sourceMessageIds))]
        };
    };
    const normalizeUnsupportedSynthesizedDates = (value, sourceCorpus = '') => {
        const source = textOf(sourceCorpus);
        return textOf(value).replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/g, (full, _year, month, day) => {
            if (source.includes(full)) return full;
            const monthDay = `${Number(month)}月${Number(day)}日`;
            return source.includes(monthDay) ? `${monthDay}（年份未确认）` : '日期未确认';
        });
    };
    const compactCheckpointSummary = (value, maxChars = 280) => {
        const text = textOf(value).trim();
        if (text.length <= maxChars) return text;
        const sentences = text.match(/[^。！？!?]+[。！？!?]?/g) || [text];
        const chosen = sentences.length <= 3 ? sentences : [sentences[0], ...sentences.slice(-2)];
        const compacted = chosen.join('').trim();
        if (compacted.length <= maxChars) return compacted;
        const head = Math.max(80, Math.floor(maxChars * 0.55));
        const tail = Math.max(60, maxChars - head - 1);
        return `${compacted.slice(0, head).trimEnd()}…${compacted.slice(-tail).trimStart()}`;
    };

    const normalizeAttachment = (attachment, index = 0) => {
        const dataUrl = textOf(attachment?.dataUrl || attachment?.base64);
        const mimeType = textOf(attachment?.mimeType || dataUrl.match(/^data:([^;,]+)/)?.[1] || 'application/octet-stream');
        return {
            id: textOf(attachment?.id || `attachment-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`),
            name: textOf(attachment?.name || `附件-${index + 1}`),
            mimeType,
            ...(dataUrl ? { dataUrl } : {}),
            ...(attachment?.hostRef ? { hostRef: textOf(attachment.hostRef) } : {})
        };
    };

    const normalizeToolContext = (context, index = 0) => ({
        id: textOf(context?.id || `tool-context-${Date.now()}-${index}`),
        layer: 'tool',
        toolName: textOf(context?.toolName || 'unknown-tool'),
        content: textOf(context?.content),
        ...(context?.displayEvidence ? { displayEvidence: textOf(context.displayEvidence) } : {}),
        ...(context?.createdAt ? { createdAt: textOf(context.createdAt) } : {})
    });

    const createUserMessage = ({ text, attachments = [], toolContexts = [], timestamp, timestampRaw } = {}) => {
        const displayContent = textOf(text);
        return {
            id: `message-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
            role: 'user',
            sourceLayer: 'user',
            content: displayContent,
            displayContent,
            attachments: attachments.map(normalizeAttachment),
            toolContexts: toolContexts.map(normalizeToolContext),
            ...(timestamp ? { timestamp } : {}),
            ...(timestampRaw ? { timestampRaw } : {})
        };
    };

    const attachmentParts = attachments => attachments
        .map(normalizeAttachment)
        .filter(attachment => attachment.dataUrl && attachment.mimeType.startsWith('image/'))
        .map(attachment => ({ type: 'image_url', image_url: { url: attachment.dataUrl } }));

    const userApiContent = (message, parseLegacyVision, includeImages = true) => {
        const text = getDisplayContent(message);
        if (!includeImages) {
            const compactText = compactLegacyImagePayloads(text);
            const imageCount = Array.isArray(message?.attachments)
                ? message.attachments.filter(item => textOf(item?.mimeType).startsWith('image/') && (item?.dataUrl || item?.base64)).length
                : 0;
            return imageCount && !compactText.includes('【图片】')
                ? `${compactText}${compactText.trim() ? '\n' : ''}【图片：历史消息，本轮未重复发送原图】`
                : compactText;
        }
        const images = attachmentParts(Array.isArray(message?.attachments) ? message.attachments : []);
        if (images.length) return [{ type: 'text', text }, ...images];
        if (!hasOwn(message, 'displayContent') && typeof parseLegacyVision === 'function') {
            return parseLegacyVision(text, 'openai');
        }
        return text;
    };

    const SHANGHAI_OFFSET_MS = 8 * 60 * 60 * 1000;
    const WEEKDAY_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const messageTimestampMs = message => {
        const raw = Number(message?.timestampRaw);
        if (Number.isFinite(raw) && raw > 0) return raw;
        const value = textOf(message?.timestamp).trim();
        if (!value) return null;
        const validCalendar = (year, month, day, hour = null, minute = null, second = null) => {
            if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)
                || month < 1 || month > 12 || day < 1 || day > new Date(Date.UTC(year, month, 0)).getUTCDate()) return false;
            if (hour !== null && (!Number.isInteger(hour) || hour < 0 || hour > 23)) return false;
            if (minute !== null && (!Number.isInteger(minute) || minute < 0 || minute > 59)) return false;
            if (second !== null && (!Number.isInteger(second) || second < 0 || second > 59)) return false;
            return true;
        };
        // An explicit timezone is authoritative.  Do not feed an ISO value with
        // Z/offset through the Shanghai-only parser below, or it would shift it
        // by eight hours a second time.
        if (/(?:Z|[+-]\d{2}:?\d{2}|\b(?:UTC|GMT)\b)$/i.test(value)) {
            if (!/\b\d{4}\b/.test(value)) return null;
            const explicitDate = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})[T ](\d{1,2}):(\d{2})(?::(\d{2}))?/);
            if (explicitDate && !validCalendar(Number(explicitDate[1]), Number(explicitDate[2]), Number(explicitDate[3]), Number(explicitDate[4]), Number(explicitDate[5]), Number(explicitDate[6] || 0))) return null;
            const explicit = Date.parse(value);
            return Number.isFinite(explicit) ? explicit : null;
        }
        const match = value.match(/^(\d{4})[年\/-](\d{1,2})[月\/-](\d{1,2})日?[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/);
        if (match) {
            const [, year, month, day, hour, minute, second = '0'] = match;
            if (!validCalendar(Number(year), Number(month), Number(day), Number(hour), Number(minute), Number(second))) return null;
            const parsed = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour) - 8, Number(minute), Number(second));
            return Number.isFinite(parsed) ? parsed : null;
        }
        // Partial dates, relative labels and locale-specific strings without a
        // complete date and time are intentionally unknown rather than guessed.
        // A date-only label remains useful as source text, but is not converted
        // to a fake midnight timestamp.
        return null;
    };
    const shanghaiParts = value => {
        if (value === null || value === undefined || value === '') return null;
        const timestampMs = Number(value);
        if (!Number.isFinite(timestampMs)) return null;
        const date = new Date(timestampMs + SHANGHAI_OFFSET_MS);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour = date.getUTCHours();
        const minute = date.getUTCMinutes();
        return {
            year, month, day, hour, minute,
            dateKey: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            timeLabel: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
            weekday: WEEKDAY_LABELS[date.getUTCDay()]
        };
    };
    const dateKeyOrdinal = dateKey => {
        const match = textOf(dateKey).match(/^(\d{4})-(\d{2})-(\d{2})$/);
        return match ? Math.floor(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) / 86400000) : null;
    };
    const relativeDateLabel = (dateKey, now = Date.now()) => {
        const target = dateKeyOrdinal(dateKey);
        const current = dateKeyOrdinal(shanghaiParts(now)?.dateKey);
        if (!Number.isFinite(target) || !Number.isFinite(current)) return '';
        const difference = current - target;
        if (difference === 0) return '今天';
        if (difference === 1) return '昨天';
        if (difference === 2) return '前天';
        if (difference > 2) return `${difference}天前`;
        if (difference === -1) return '明天';
        return `${Math.abs(difference)}天后`;
    };
    const messageDateKey = message => shanghaiParts(messageTimestampMs(message))?.dateKey || '';
    const formatDateDivider = (message, now = Date.now()) => {
        const parts = shanghaiParts(messageTimestampMs(message));
        if (!parts) return '时间未知';
        const relative = relativeDateLabel(parts.dateKey, now);
        return `${parts.year}年${parts.month}月${parts.day}日 · ${relative} · ${parts.weekday}`;
    };
    const formatDuration = milliseconds => {
        const totalMinutes = Math.max(0, Math.round(Number(milliseconds) / 60000));
        if (totalMinutes < 60) return `${totalMinutes}分钟`;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours < 24) return `${hours}小时${minutes ? `${minutes}分钟` : ''}`;
        const days = Math.floor(hours / 24);
        const remainderHours = hours % 24;
        return `${days}天${remainderHours ? `${remainderHours}小时` : ''}`;
    };
    const summarizeMessageTimeRange = (messages, options = {}) => {
        const values = Array.isArray(messages) ? messages : [];
        const known = values.map(messageTimestampMs).filter(Number.isFinite);
        const dateKeys = [...new Set(known.map(value => shanghaiParts(value)?.dateKey).filter(Boolean))];
        return {
            timezone: 'Asia/Shanghai',
            firstTimestampRaw: known.length ? known[0] : null,
            lastTimestampRaw: known.length ? known.at(-1) : null,
            firstDate: dateKeys[0] || null,
            lastDate: dateKeys.at(-1) || null,
            dateKeys,
            knownCount: known.length,
            missingCount: values.length - known.length,
            startMessageNumber: Math.max(1, Number(options.startIndex || 0) + 1),
            endMessageNumber: Math.max(0, Number(options.startIndex || 0) + values.length)
        };
    };

    const messageNumberFromId = value => {
        const match = textOf(value).trim().match(/^message-(\d+)$/i);
        return match ? Number(match[1]) : null;
    };
    const normalizeMessageNumbers = values => [...new Set((Array.isArray(values) ? values : [])
        .map(messageNumberFromId)
        .filter(number => Number.isInteger(number) && number > 0))].sort((left, right) => left - right);
    const intervalsFromNumbers = values => {
        const numbers = normalizeMessageNumbers(values.map(number => `message-${number}`));
        const intervals = [];
        numbers.forEach(number => {
            const previous = intervals.at(-1);
            if (previous && number === previous[1] + 1) previous[1] = number;
            else intervals.push([number, number]);
        });
        return intervals;
    };
    const intervalFromRange = value => {
        if (!value || typeof value !== 'object') return null;
        const first = messageNumberFromId(value.first);
        const last = messageNumberFromId(value.last);
        const count = Number(value.count);
        if (!Number.isInteger(first) || !Number.isInteger(last) || first <= 0 || last < first) return null;
        // A range count that matches its endpoints is a reliable contiguous source
        // range.  Representative source IDs with a smaller count stay sparse.
        if (Number.isInteger(count) && count > 0 && count === last - first + 1) return [first, last];
        return null;
    };
    const coverageFromSource = (source, options = {}) => {
        const value = source && typeof source === 'object' ? source : {};
        const intervals = [];
        let reliable = false;
        const addInterval = interval => {
            if (!interval || !Number.isInteger(interval[0]) || !Number.isInteger(interval[1])) return;
            intervals.push(interval);
            reliable = true;
        };
        const addSparse = ids => {
            const sparse = normalizeMessageNumbers(ids);
            if (!sparse.length) return;
            intervals.push(...intervalsFromNumbers(sparse));
        };
        // totalMessages is a scan size, not by itself proof that the summary
        // covered every message.  Only explicit contiguous coverage ranges are
        // safe for overlap de-duplication; otherwise retain the summary.
        ['historicalRead', 'recentStatusRead', 'dynamicRawTail'].forEach(key => addInterval(intervalFromRange(value?.sourceCoverage?.[key])));
        addInterval(intervalFromRange(value?.sourceRange));
        if (Number.isInteger(options.fromIndex) && Number.isInteger(options.toIndex) && options.toIndex >= options.fromIndex) {
            addInterval([options.fromIndex + 1, options.toIndex + 1]);
        }
        const sourceIds = Array.isArray(value?.sourceMessageIds) ? value.sourceMessageIds : [];
        addSparse(sourceIds);
        const normalized = intervals
            .sort((left, right) => left[0] - right[0] || left[1] - right[1])
            .reduce((merged, interval) => {
                const previous = merged.at(-1);
                if (previous && interval[0] <= previous[1] + 1) previous[1] = Math.max(previous[1], interval[1]);
                else merged.push([...interval]);
                return merged;
            }, []);
        return { intervals: normalized, reliable };
    };
    const formatMessageIntervals = intervals => (Array.isArray(intervals) ? intervals : [])
        .map(([first, last]) => first === last ? `message-${first}` : `message-${first}～message-${last}`)
        .join('、');
    const intersectIntervals = (left, right) => {
        const intersections = [];
        (Array.isArray(left) ? left : []).forEach(([leftStart, leftEnd]) => {
            (Array.isArray(right) ? right : []).forEach(([rightStart, rightEnd]) => {
                const start = Math.max(leftStart, rightStart);
                const end = Math.min(leftEnd, rightEnd);
                if (start <= end) intersections.push([start, end]);
            });
        });
        return intersections;
    };
    const isCoverageContainedBy = (coverage, selected) => {
        if (!coverage?.reliable || !coverage.intervals.length || !selected?.length) return false;
        return coverage.intervals.every(([start, end]) => selected.some(([selectedStart, selectedEnd]) => start >= selectedStart && end <= selectedEnd));
    };
    const summaryOverlap = (coverage, selectedStartIndex, selectedEndIndex) => {
        const selected = Number.isInteger(selectedStartIndex) && Number.isInteger(selectedEndIndex) && selectedEndIndex >= selectedStartIndex
            ? [[selectedStartIndex + 1, selectedEndIndex + 1]] : [];
        const overlap = intersectIntervals(coverage?.intervals, selected);
        return {
            selected,
            overlap,
            fullyCovered: isCoverageContainedBy(coverage, selected),
            reliable: coverage?.reliable === true && coverage.intervals.length > 0
        };
    };
    const formatTemporalEndpoint = (timestampRaw, dateKey) => {
        const parts = shanghaiParts(timestampRaw);
        if (parts) return `${parts.dateKey} ${parts.timeLabel}`;
        return textOf(dateKey) || '时间未知';
    };
    const formatSummaryTemporalBoundary = (temporalRange, coverage) => {
        const range = temporalRange && typeof temporalRange === 'object' ? temporalRange : {};
        const first = formatTemporalEndpoint(range.firstTimestampRaw, range.firstDate);
        const last = formatTemporalEndpoint(range.lastTimestampRaw, range.lastDate);
        const missingCount = Number(range.missingCount) || 0;
        const hasKnownRange = first !== '时间未知' || last !== '时间未知';
        const dateText = hasKnownRange
            ? `${first}${first === last ? '' : `～${last}`} Asia/Shanghai${missingCount > 0 ? `（其中 ${missingCount} 条原文时间未知）` : ''}`
            : '时间未知（没有可靠的原文时间；不得推断日期）';
        const coverageText = coverage?.reliable && coverage.intervals.length
            ? formatMessageIntervals(coverage.intervals)
            : '范围未完整核对';
        const cutoff = last !== '时间未知' && missingCount === 0 && range.lastTimestampRaw != null && range.lastTimestampRaw !== '' && Number.isFinite(Number(range.lastTimestampRaw))
            ? `截至覆盖原文末尾 ${last}（${textOf(range.timezone) || 'Asia/Shanghai'}）`
            : `截至覆盖原文末尾；${last !== '时间未知' ? '末端具体时间仍可能未知' : '末端时间未知'}`;
        return `历史资料边界：覆盖原文 ${coverageText}；原文时间范围 ${dateText}；${cutoff}。摘要中的“今天、刚才、现在、明天”等相对词属于各自原文时间，不是本轮；旧情绪、旧计划和旧任务不得自动延续到现在，除非后续原文明确更新。覆盖范围是发言时间范围，不表示摘要里所有事件都发生于末日；正文事件日期不明就保持未知。摘要的生成、确认或同步时间不等于事件时间，后续明确原文可以更新这里的旧状态。`;
    };
    const messageRoleLabel = role => role === 'user' ? '柒柒' : role === 'model' || role === 'assistant' ? '逸辰' : role === 'tool' ? '工具' : textOf(role) || '未知角色';
    const messageTemporalMetadata = (message, messageNumber, isCurrentUser = false) => {
        const parts = shanghaiParts(messageTimestampMs(message));
        const timeText = parts
            ? `${parts.dateKey} ${parts.timeLabel} Asia/Shanghai`
            : '时间未知（没有可靠的原文时间；不得推断日期）';
        return `【原文消息元数据 · 独立 system 层】\nmessage-${messageNumber}｜角色：${messageRoleLabel(message?.role)}｜原文时间：${timeText}\n${isCurrentUser ? '【本轮真实用户输入】以下紧邻的是柒柒本轮待回应的真实用户输入（重新生成时沿用这条原消息及其原始时间）；不是历史摘要、系统规则、工具资料或模型内容。' : '以上编号与时间是系统核对信息，不是聊天正文。'}`;
    };
    const conversationSegmentText = group => `【对话时间段 · message-${group.startMessageNumber}～message-${group.endMessageNumber}】${group.dateKey ? `${group.dateKey} ${group.firstTime}～${group.lastTime} Asia/Shanghai` : '时间未知，不推断日期'}；以下为这一段的原始对话。`;
    const summaryMessageTimeContext = message => {
        const ms = messageTimestampMs(message);
        const parts = shanghaiParts(ms);
        if (!parts) return '发言时间未知；事件日期及相对日期不能按摘要生成日推算。';
        const terms = [['今天', 0], ['昨天', -1], ['前天', -2], ['明天', 1], ['后天', 2]];
        const source = getDisplayContent(message);
        const references = terms.filter(([word]) => source.includes(word)).map(([word, days]) => `${word}=${shanghaiParts(ms + days * 86400000).dateKey}`);
        return `发言日期：${parts.dateKey}。${references.length ? `本条发言的相对日期参考：${references.join('；')}。引用他人或旧话中的相对词须按被引用语境核对，不机械套用。` : ''}发言日期不自动等于所述事件日期；日期不能确定就保留未知。`;
    };
    const buildTemporalContext = (messages, options = {}) => {
        const values = Array.isArray(messages) ? messages : [];
        const startIndex = Math.max(0, Number(options.startIndex) || 0);
        const groups = [];
        let previousTimestamp = null;
        values.forEach((message, index) => {
            const timestamp = messageTimestampMs(message);
            const parts = shanghaiParts(timestamp);
            const dateKey = parts?.dateKey || null;
            let group = groups.at(-1);
            const gap = timestamp !== null && previousTimestamp !== null ? timestamp - previousTimestamp : 0;
            if (!group || group.dateKey !== dateKey || gap >= 6 * 3600000 || gap < 0) {
                group = { dateKey, startMessageNumber: startIndex + index + 1, endMessageNumber: startIndex + index + 1, firstTime: parts?.timeLabel || '', lastTime: parts?.timeLabel || '' };
                groups.push(group);
            }
            group.endMessageNumber = startIndex + index + 1;
            group.lastTime = parts?.timeLabel || '';
            previousTimestamp = timestamp;
        });
        const summary = summarizeMessageTimeRange(values, { startIndex });
        if (!groups.length) return { text: '', summary, groups, intervals: [] };
        return {
            text: ['【当前窗口时间轴 · Asia/Shanghai】',
                '这些是原始对话的日期范围，不是新的发言。编号按随后原文顺序对应；事件发生时间以各条正文为准，回忆往事不能按发言日认定发生日。',
                ...groups.map(conversationSegmentText),
                '旧症状、情绪和计划只代表当时；没有后续不能认定仍在持续，也不能认定已经恢复或完成。自然接当前话题，时间只在有关时使用，不主动逐条报时。'
            ].join('\n'), summary, groups, intervals: []
        };
    };

    const taggedSystem = (source, content) => ({
        role: 'system',
        content: `【上下文来源：${source}】\n${textOf(content)}`
    });

    const estimateTextTokens = value => {
        const text = textOf(value);
        const cjk = (text.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || []).length;
        const remaining = Math.max(0, text.length - cjk);
        return Math.max(1, cjk + Math.ceil(remaining / 4));
    };

    const estimateMessageTokens = message => {
        const displayContent = getDisplayContent(message);
        const attachmentTokens = (Array.isArray(message?.attachments) ? message.attachments : [])
            .filter(item => textOf(item?.mimeType).startsWith('image/')).length * 900;
        const legacyImageTokens = countLegacyInlineImages(displayContent) * 900;
        const toolTokens = (Array.isArray(message?.toolContexts) ? message.toolContexts : [])
            .reduce((total, item) => total + estimateTextTokens(item?.content) + 16, 0);
        return estimateTextTokens(compactLegacyImagePayloads(displayContent)) + attachmentTokens + legacyImageTokens + toolTokens + 12;
    };

    const selectionMessageTokens = (message, index, options = {}) => {
        const base = estimateMessageTokens(message);
        if (typeof options.messageMetadataTokens === 'function') {
            return base + Math.max(0, Number(options.messageMetadataTokens(message, index)) || 0);
        }
        return base + Math.max(0, Number(options.messageMetadataTokens) || 0);
    };

    const selectDynamicTail = (messages, options = {}) => {
        const values = Array.isArray(messages) ? messages : [];
        const contextWindowTokens = Math.max(8_192, Number(options.contextWindowTokens) || 65_536);
        const reservedOutputTokens = Math.max(2_048, Number(options.reservedOutputTokens) || 8_192);
        const fixedContextTokens = Math.max(0, Number(options.fixedContextTokens) || 0);
        const dialogueBudget = Math.max(2_048, Math.min(1_000_000, contextWindowTokens - reservedOutputTokens - fixedContextTokens));
        let usedTokens = 0;
        let startIndex = values.length;
        for (let index = values.length - 1; index >= 0; index -= 1) {
            const tokens = selectionMessageTokens(values[index], index, options);
            if (startIndex < values.length && usedTokens + tokens > dialogueBudget) break;
            usedTokens += tokens;
            startIndex = index;
            if (usedTokens >= dialogueBudget) break;
        }
        if (values.length && startIndex === values.length) startIndex = values.length - 1;
        const selected = values.slice(startIndex);
        return {
            selected,
            omitted: values.slice(0, startIndex),
            startIndex,
            endIndex: values.length ? values.length - 1 : -1,
            usedTokens,
            dialogueBudget,
            contextWindowTokens,
            reservedOutputTokens,
            fixedContextTokens
        };
    };

    const selectHeadTailByBudget = (messages, options = {}) => {
        const values = Array.isArray(messages) ? messages : [];
        const tokenBudget = Math.max(2_048, Number(options.tokenBudget) || 8_192);
        const headBudget = Math.max(512, Math.floor(tokenBudget * Math.min(0.7, Math.max(0.2, Number(options.headRatio) || 0.35))));
        const selectedIndices = new Set();
        let headTokens = 0;
        for (let index = 0; index < values.length; index += 1) {
            const tokens = selectionMessageTokens(values[index], index, options);
            if (selectedIndices.size && headTokens + tokens > headBudget) break;
            selectedIndices.add(index);
            headTokens += tokens;
            if (headTokens >= headBudget) break;
        }
        let usedTokens = headTokens;
        for (let index = values.length - 1; index >= 0; index -= 1) {
            if (selectedIndices.has(index)) continue;
            const tokens = selectionMessageTokens(values[index], index, options);
            if (selectedIndices.size && usedTokens + tokens > tokenBudget) break;
            selectedIndices.add(index);
            usedTokens += tokens;
            if (usedTokens >= tokenBudget) break;
        }
        const indices = [...selectedIndices].sort((left, right) => left - right);
        return {
            selected: indices.map(index => values[index]),
            indices,
            omitted: values.filter((_, index) => !selectedIndices.has(index)),
            usedTokens,
            tokenBudget
        };
    };

    // Enrich request-only copies from the source ledger, never rewrite stored summaries.
    const checkpointWithSourceTimes = (checkpoint, messages) => {
        if (!checkpoint) return checkpoint;
        const copy = cloneJsonValue(checkpoint);
        const revision = copy.active || copy;
        const content = revision.content || revision;
        const total = content?.sourceCoverage?.totalMessages;
        if (Number.isInteger(total) && total > 0 && total <= messages.length) {
            content.sourceCoverage.temporalRange = summarizeMessageTimeRange(messages.slice(0, total));
        }
        for (const segment of copy.rolling?.segments || []) {
            if (Number.isInteger(segment.fromIndex) && Number.isInteger(segment.toIndex)
                && segment.fromIndex >= 0 && segment.toIndex >= segment.fromIndex && segment.toIndex < messages.length) {
                segment.temporalRange = summarizeMessageTimeRange(messages.slice(segment.fromIndex, segment.toIndex + 1), { startIndex: segment.fromIndex });
            }
        }
        return copy;
    };
    const checkpointUnits = checkpoint => {
        const revision = checkpoint?.active || checkpoint;
        const content = revision?.content || revision;
        const rollingSegments = Array.isArray(checkpoint?.rolling?.segments) ? checkpoint.rolling.segments : [];
        const units = [];
        const contentCoverage = coverageFromSource(content);
        const contentBoundary = formatSummaryTemporalBoundary(content?.sourceCoverage?.temporalRange, contentCoverage);
        const formatItems = (label, values) => {
            const items = Array.isArray(values) ? values : [];
            if (!items.length) return '';
            return `\n${label}：\n${items.map(item => `- ${textOf(item?.text ?? item)}（来源：${(item?.sourceMessageIds || []).join('、')}）`).join('\n')}`;
        };
        let formalText = '';
        if (content?.contentSchema === 'window-log-v1' || content?.body) {
            formalText = `【历史资料｜当前窗口日志 · 逸辰写下 · 已由柒柒确认】\n${contentBoundary}\n${textOf(content.body)}`;
            units.push({ kind: 'formal', text: formalText, coverage: contentCoverage });
        } else if (content?.contentSchema === 'window-chronicle-v1' || Array.isArray(content?.keyMoments)) {
            const landing = content.currentLanding?.text
                ? `\n最近停在哪里：\n- ${textOf(content.currentLanding.text)}（来源：${(content.currentLanding.sourceMessageIds || []).join('、')}）`
                : '';
            formalText = `【历史资料｜当前窗口纪事卡 · session-summarizer · 已由柒柒确认】\n${contentBoundary}\n${textOf(content.overview || content.summary)}`
                + formatItems('这扇窗的重要片段', content.keyMoments)
                + landing
                + formatItems('仍在延续的线', content.continuingThreads)
                + formatItems('这扇窗里形成的理解', content.windowUnderstandings)
                + `\n代表性原文：${(content.sourceMessageIds || []).join('、')}`;
            units.push({ kind: 'formal', text: formalText, coverage: contentCoverage });
        } else if (content?.summary || content?.overview) {
            formalText = `【历史资料｜当前窗口连续性卡片 · session-summarizer · 已由柒柒确认】\n${contentBoundary}\n${textOf(content.summary)}`
                + formatItems('已确认事实', content.confirmedFacts)
                + formatItems('未完成事项', content.openItems)
                + formatItems('明确约定', content.explicitAgreements)
                + `\n原文范围：${(content.sourceMessageIds || []).join('、')}`;
            units.push({ kind: 'formal', text: formalText, coverage: contentCoverage });
        }
        rollingSegments.forEach(item => {
            const firstDate = textOf(item?.temporalRange?.firstDate);
            const lastDate = textOf(item?.temporalRange?.lastDate);
            const dateRange = firstDate ? `｜${firstDate}${lastDate && lastDate !== firstDate ? `～${lastDate}` : ''}` : '';
            const rawFromIndex = item?.fromIndex;
            const rawToIndex = item?.toIndex;
            const fromIndex = rawFromIndex !== null && rawFromIndex !== undefined && rawFromIndex !== '' ? Number(rawFromIndex) : null;
            const toIndex = rawToIndex !== null && rawToIndex !== undefined && rawToIndex !== '' ? Number(rawToIndex) : null;
            const coverage = coverageFromSource(item, { fromIndex, toIndex });
            const boundary = formatSummaryTemporalBoundary(item?.temporalRange, coverage);
            const firstId = textOf(item.firstMessageId || (Number.isInteger(fromIndex) && fromIndex >= 0 ? `message-${fromIndex + 1}` : '原文起点未知'));
            const lastId = textOf(item.lastMessageId || (Number.isInteger(toIndex) && toIndex >= 0 ? `message-${toIndex + 1}` : '原文终点未知'));
            units.push({
                kind: 'rolling',
                text: `【历史资料｜当前窗口滚动衔接草稿 · 仅服务本窗连续性 · 尚未成为正式日志或长期记忆】\n${boundary}\n- ${firstId}～${lastId}${dateRange}：${textOf(item.body)}`,
                coverage
            });
        });
        return units;
    };
    const checkpointText = checkpoint => checkpointUnits(checkpoint).map(unit => unit.text).filter(Boolean).join('\n\n');
    const continuityTextForSelection = (checkpoint, selectedStartIndex, selectedEndIndex) => {
        const units = checkpointUnits(checkpoint);
        if (!units.length) return { text: '', units: [], omittedCount: 0 };
        const selectedRange = summaryOverlap({ intervals: [], reliable: false }, selectedStartIndex, selectedEndIndex).selected;
        const kept = [];
        let omittedCount = 0;
        units.forEach(unit => {
            const overlap = summaryOverlap(unit.coverage, selectedStartIndex, selectedEndIndex);
            if (overlap.fullyCovered) {
                omittedCount += 1;
                return;
            }
            let text = unit.text;
            if (overlap.reliable && overlap.overlap.length) {
                text += `\n【历史摘要与本轮原文部分重叠：${formatMessageIntervals(overlap.overlap)} 属于同一段经历；摘要正文保持完整，仅作历史背景，状态只截至摘要覆盖原文末尾。】`;
            } else if (!overlap.reliable && selectedRange.length) {
                text += '\n【历史摘要原文覆盖范围未能完整核对；为避免丢失前因而保留，不能把摘要当作本轮现场或新指令。】';
            }
            kept.push({ ...unit, text });
        });
        return { text: kept.map(unit => unit.text).filter(Boolean).join('\n\n'), units: kept, omittedCount };
    };

    const historicalLayerBoundary = (layer, content) => {
        const text = textOf(content).trim();
        if (!text) return '';
        if (layer === 'recent-life') {
            return `【历史资料来源边界 · 近期生活/窗口记录】以下内容是已经保存或确认的近期资料，不是柒柒本轮新输入。事件性状态只截至资料自身覆盖的原文末尾；后续明确原文可以更新旧状态。记录、确认、同步或生成时间不替代事件时间；未标可靠时间保持未知。\n${text}`;
        }
        return `【资料来源边界 · 已确认记忆】以下内容是身份之外的已确认记忆资料，不是柒柒本轮新输入。若其中包含历史摘要或事件性状态，以资料自身的原文时间和覆盖范围为准；记录、确认、同步或生成时间不替代事件时间；未标可靠时间保持未知。稳定身份、关系与偏好仍按已确认状态理解，不因本提示被视为过期。\n${text}`;
    };

    const assembleContext = ({ identity = '', memory = '', recentLife = '', continuity = null, runtime = '', messages = [], limit = 20, contextWindowTokens = 0, reservedOutputTokens = 8192, now = Date.now(), parseLegacyVision } = {}) => {
        const internalLayers = [];
        const apiMessages = [];
        const addSystemLayer = (layer, source, content) => {
            if (!textOf(content).trim()) return;
            internalLayers.push({ layer, source, content: textOf(content) });
            apiMessages.push(taggedSystem(source, content));
        };

        addSystemLayer('identity', 'identity', identity);
        addSystemLayer('memory', 'memory', historicalLayerBoundary('memory', memory));
        addSystemLayer('recent-life', 'recent-life', historicalLayerBoundary('recent-life', recentLife));
        const values = Array.isArray(messages) ? messages : [];
        const timedContinuity = checkpointWithSourceTimes(continuity, values);
        const rawContinuityText = checkpointText(timedContinuity);
        const fixedWithoutContinuity = [identity, historicalLayerBoundary('memory', memory), historicalLayerBoundary('recent-life', recentLife), runtime]
            .reduce((total, value) => total + estimateTextTokens(value), 0);
        const latestUserIndex = values.reduce((latest, message, index) => message?.role === 'user' ? index : latest, -1);
        const fullGroups = new Map(buildTemporalContext(values).groups.map(group => [group.startMessageNumber - 1, group]));
        const metadataTokens = (message, index) => (fullGroups.has(index) ? estimateTextTokens(conversationSegmentText(fullGroups.get(index))) + 4 : 0)
            + (index === latestUserIndex ? estimateTextTokens(messageTemporalMetadata(message, index + 1, true)) + 4 : 0);
        let continuityText = '';
        let dynamicSelection = null;
        let selected = values.slice(-Math.max(1, Number(limit) || 20));
        let selectedStartIndex = Math.max(0, values.length - selected.length);
        let temporalContext = buildTemporalContext(selected, { now, startIndex: selectedStartIndex });
        // Continuity and raw-tail selection share one budget.  Recompute the
        // tail after adding the time axis and after deciding which summary units
        // overlap it, so metadata cannot silently evict the current turn.
        for (let iteration = 0; iteration < 6; iteration += 1) {
            const fixedContextTokens = fixedWithoutContinuity + estimateTextTokens(continuityText) + 160; // reserve the first selected partial segment marker
            dynamicSelection = Number(contextWindowTokens) > 0
                ? selectDynamicTail(values, { contextWindowTokens, reservedOutputTokens, fixedContextTokens, messageMetadataTokens: metadataTokens })
                : null;
            selected = dynamicSelection?.selected || values.slice(-Math.max(1, Number(limit) || 20));
            selectedStartIndex = dynamicSelection?.startIndex ?? Math.max(0, values.length - selected.length);
            temporalContext = buildTemporalContext(selected, { now, startIndex: selectedStartIndex });
            if (Number(contextWindowTokens) > 0 && temporalContext.text) {
                dynamicSelection = selectDynamicTail(values, {
                    contextWindowTokens,
                    reservedOutputTokens,
                    fixedContextTokens: fixedContextTokens + estimateTextTokens(temporalContext.text),
                    messageMetadataTokens: metadataTokens
                });
                selected = dynamicSelection.selected;
                selectedStartIndex = dynamicSelection.startIndex;
                temporalContext = buildTemporalContext(selected, { now, startIndex: selectedStartIndex });
            }
            const shouldUseContinuity = Boolean(rawContinuityText)
                && (Number(contextWindowTokens) <= 0 || selectedStartIndex > 0);
            const nextContinuityText = shouldUseContinuity
                ? continuityTextForSelection(timedContinuity, selectedStartIndex, selected.length ? selectedStartIndex + selected.length - 1 : selectedStartIndex - 1).text
                : '';
            if (nextContinuityText === continuityText) break;
            continuityText = nextContinuityText;
        }
        const continuityContent = continuity?.active?.content || continuity?.content;
        addSystemLayer('continuity', continuityContent?.contentSchema === 'window-log-v1' ? 'window-log' : 'session-checkpoint', continuityText);
        addSystemLayer('runtime', 'runtime', runtime);
        addSystemLayer('runtime', 'message-time-axis', temporalContext.text);
        const latestMessage = selected.at(-1);
        const selectedImageCount = latestMessage?.role === 'user' && Array.isArray(latestMessage?.attachments)
            ? latestMessage.attachments.filter(item => textOf(item?.mimeType).startsWith('image/') && (item?.dataUrl || item?.base64)).length
            : 0;
        if (selectedImageCount > 0) {
            addSystemLayer('runtime', 'image-context-boundary', `柒柒当前消息的 ${selectedImageCount} 张图片作为图像输入发送；历史消息里的图片不会反复上传，只保留文字标记。请优先看当前图片。若当前模型服务未能识别图像，应如实说无法确认图片内容；不要据此断言聊天记录或图片原件被截断、删除。`);
        }
        if (selectedStartIndex > 0) {
            addSystemLayer('runtime', 'history-context-boundary', `本轮上下文预算只选取当前窗口较近的消息；更早的 ${selectedStartIndex} 条原文仍保存在设备聊天记录中，并非被删除。若需要其中细节，应说明当前轮未取得，不要声称已经无法恢复。`);
        }
        if (latestUserIndex >= 0 && (latestUserIndex < selectedStartIndex || latestUserIndex >= selectedStartIndex + selected.length)) {
            addSystemLayer('runtime', 'current-user-boundary', `【本轮真实用户输入边界】本轮实际用户输入是设备聊天总账中的 message-${latestUserIndex + 1}，但它没有进入本次原文预算；不能把历史摘要、工具资料或模型内容当作柒柒本轮输入。`);
        }
        const selectedGroups = new Map(temporalContext.groups.map(group => [group.startMessageNumber, group]));
        let toolProtocolPending = false;
        selected.forEach((message, messageIndex) => {
            const role = message?.role === 'model' ? 'assistant' : message?.role;
            const toolContexts = Array.isArray(message?.toolContexts) ? message.toolContexts.map(normalizeToolContext) : [];
            toolContexts.forEach(context => {
                internalLayers.push({ ...context, messageIndex });
                // 旧的自动网页读取没有与之配对的 assistant tool_call，不能伪造 tool_call_id。
                // 安全映射成有明确来源标签的 system，而不是伪装成 user。
                apiMessages.push(taggedSystem(`tool:${context.toolName}`, context.content));
            });

            const absoluteMessageIndex = selectedStartIndex + messageIndex;
            const group = selectedGroups.get(absoluteMessageIndex + 1);
            const metadata = group ? conversationSegmentText(group) : '';
            const deferToolMetadata = role === 'tool' && Boolean(message?.tool_call_id) && toolProtocolPending;
            if (metadata && !deferToolMetadata) {
                internalLayers.push({ layer: 'runtime', source: 'conversation-time-segment', messageIndex, content: metadata });
                apiMessages.push(taggedSystem('conversation-time-segment', metadata));
            }

            if (role === 'user') {
                const content = userApiContent(message, parseLegacyVision, messageIndex === selected.length - 1);
                if (messageIndex === selected.length - 1 && Array.isArray(content)) {
                    const imageCount = content.filter(item => item?.type === 'image_url').length;
                    if (imageCount > 0) {
                        const imageFocus = `柒柒当前这条消息附有 ${imageCount} 张图，图像输入就在下一条用户消息里。先看图并回应她这次让你看的内容，不要沿用此前助手关于“看不到图”或“窗口失忆”的猜测。若实际无法辨认，只说明无法确认图中内容，不要声称聊天原文被删除。`;
                        internalLayers.push({ layer: 'runtime', source: 'current-image-focus', content: imageFocus });
                        apiMessages.push(taggedSystem('current-image-focus', imageFocus));
                    }
                }
                if (absoluteMessageIndex === latestUserIndex) addSystemLayer('runtime', 'current-user-input', messageTemporalMetadata(message, absoluteMessageIndex + 1, true));
                internalLayers.push({ layer: 'user', source: 'chat-ledger', messageIndex, content: getDisplayContent(message), attachments: cloneJsonValue(message?.attachments || []), timestamp: message?.timestamp, timestampRaw: messageTimestampMs(message) });
                apiMessages.push({ role: 'user', content });
            } else if (role === 'assistant') {
                const content = getDisplayContent(message);
                internalLayers.push({ layer: 'assistant', source: 'chat-ledger', messageIndex, content, timestamp: message?.timestamp, timestampRaw: messageTimestampMs(message) });
                const assistantMessage = { role: 'assistant', content };
                if (Array.isArray(message?.tool_calls)) assistantMessage.tool_calls = cloneJsonValue(message.tool_calls);
                if (message?.function_call) assistantMessage.function_call = cloneJsonValue(message.function_call);
                apiMessages.push(assistantMessage);
            } else if (role === 'tool') {
                const toolMessage = { role: 'tool', content: textOf(message?.content) };
                if (message?.tool_call_id) toolMessage.tool_call_id = textOf(message.tool_call_id);
                internalLayers.push({ layer: 'tool', source: textOf(message?.toolName || 'tool-call'), messageIndex, content: toolMessage.content });
                // 只有具备真实调用关联 ID 时才发送标准 tool 角色；否则安全降级为 system。
                apiMessages.push(toolMessage.tool_call_id ? toolMessage : taggedSystem(`tool:${message?.toolName || 'unknown-tool'}`, toolMessage.content));
            }
            if (deferToolMetadata && metadata) {
                // OpenAI-compatible tool protocol requires all assistant tool
                // replies to remain consecutive.  Keep each tool's independent
                // audit metadata in the internal layer (the shared time axis
                // still exposes its message number) rather than invalidating
                // that API message chain with a system message in between.
                internalLayers.push({ layer: 'runtime', source: 'message-boundary', messageIndex, content: metadata, placement: 'tool-protocol-preserved' });
            }
            const assistantHasToolCalls = role === 'assistant'
                && ((Array.isArray(message?.tool_calls) && message.tool_calls.length > 0) || Boolean(message?.function_call));
            if (assistantHasToolCalls) toolProtocolPending = true;
            else if (role === 'tool' && deferToolMetadata) toolProtocolPending = true;
            else toolProtocolPending = false;
        });

        return {
            internalLayers,
            apiMessages,
            temporalContext,
            selection: dynamicSelection || {
                selected,
                omitted: (Array.isArray(messages) ? messages : []).slice(0, Math.max(0, (Array.isArray(messages) ? messages.length : 0) - selected.length)),
                startIndex: Math.max(0, (Array.isArray(messages) ? messages.length : 0) - selected.length),
                endIndex: (Array.isArray(messages) ? messages.length : 0) - 1,
                usedTokens: selected.reduce((total, message) => total + estimateMessageTokens(message), 0),
                dialogueBudget: null
            }
        };
    };

    const exportMessageContent = message => getDisplayContent(message);

    return {
        getDisplayContent,
        compactLegacyImagePayloads,
        parseJsonObjectText,
        parseCheckpointLineProtocol,
        normalizeUnsupportedSynthesizedDates,
        compactCheckpointSummary,
        normalizeAttachment,
        normalizeToolContext,
        createUserMessage,
        userApiContent,
        messageTimestampMs,
        shanghaiParts,
        relativeDateLabel,
        messageDateKey,
        formatDateDivider,
        summarizeMessageTimeRange,
        buildTemporalContext,
        messageTemporalMetadata,
        summaryMessageTimeContext,
        coverageFromSource,
        continuityTextForSelection,
        estimateTextTokens,
        estimateMessageTokens,
        selectDynamicTail,
        selectHeadTailByBudget,
        checkpointText,
        assembleContext,
        exportMessageContent
    };
});
