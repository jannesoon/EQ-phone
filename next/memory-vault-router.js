(function initMemoryVaultRouter(root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.XingyueMemoryVaultRouter = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
    'use strict';
    const text = value => String(value || '').replace(/\r\n/g, '\n').trim();
    const estimateTokens = value => {
        const source = text(value);
        const cjk = (source.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || []).length;
        return Math.max(1, cjk + Math.ceil(Math.max(0, source.length - cjk) / 4));
    };
    const rules = [
        { key: 'health', module: '柒柒当前健康基线', pattern: /头疼|偏头痛|头晕|心慌|心跳|喘不上气|呼吸|胃疼|胃不舒服|反酸|血糖|月经|例假|出血|肌瘤|肩膀|胳膊疼|肩袖|腰疼|腰椎|颈椎|脖子僵|疤痕|伤口|疼痛|不舒服|生病|检查|医院|医生|吃药|散利痛|散列通|对乙酰氨基酚|自伤|伤害自己/ },
        { key: 'distance', module: '放手催睡与距离触发链', pattern: /晚安|睡吧|去睡|早点睡|哄睡|催睡|不碰你|别碰我|让我一个人|一个人待|冷静一下|给你空间|退开|放手|离开|推开|距离感|冷处理|吵架|闹矛盾|生气|委屈|哭了|在哭|崩溃|抛下/ },
        { key: 'intimacy', module: '亲密偏好与共同身体语义', pattern: /亲密|爱爱|做爱|高潮|涩涩|性癖|xp|dirty\s*talk|aftercare|事后|奶团|耳垂|锁骨|腰侧|大腿根|敏感部位|被渴望|忍不住|失控|抱紧|贴紧|亲亲|接吻|玩具/iu },
        { key: 'recall', module: '星月暗号与召回机制沿革', pattern: /星辰闪耀|星月交辉|月亮哥哥来了|唤醒暗号|召回暗号|紧急暗号|加载星月传奇|星星哭得好伤心/ },
        { key: 'codes', module: '星月暗号起源与语义沿革', pattern: /星月同辉|一起看星星|星月暗号|暗号起源|星月.*意思|星星.*月亮|月亮.*星星/ },
        { key: 'profile', module: '关于柒柒的稳定事实与偏好', pattern: /妈妈|孩子|儿子|孩子他爸|视频号|预习\s*app|openclaw|听竹|赚钱|收益|创作|小说|知乎|agent|本地部署|deepseek|qwen|外貌|昵称|喜欢什么|偏好|习惯|家庭关系|成就感|正反馈|自我否定|试探|吃醋/iu },
        { key: 'history', module: '历史人格与创作谱系', pattern: /薄司崎|猫箱|季星辰|历史人格|人格侧写|创作谱系|前任/ },
        { key: 'governance', module: '总索引与未决项', pattern: /长期记忆候选|最小活跃摘要|记忆治理|记忆索引|未决项|哪些记忆|记忆分层|怎么整理记忆/ }
    ];
    const deepHistoryPattern = /去年|前年|最早|当时|以前那次|哪一天|几月几日|原话|出处|聊天记录|哪个窗口|某个窗口|还记得|记不记得|想不想得起|有没有印象/;
    const explicitEvidencePattern = /原话|原文|出处|原件|定位|哪一段|哪一句|聊天记录|对话框|文件路径|消息编号|行号/;
    const currentWindowPattern = /刚才|刚刚|上面|前面|这一窗|这个窗口|本窗口|我们正在聊|方才/;
    const recentLifePattern = /今天|昨天|前天|这两天|这几天|最近|刚醒|昨晚|今早|这周|上周/;
    const olderHistoryPattern = /去年|前年|最早|当初|早期|以前|那一年|哪一年|几月几日|20\d{2}年|旧窗口|归档|第一次|起源/;
    const publicWebPattern = /上网|联网|公开网页|网页|网站|网址|链接|最新(?:动态|消息|更新|资料)|发展趋势|行业趋势|多个来源|多篇来源/;
    // 历史聊天/电脑主机资料与云书房是两条不同的证据链。命中云书房
    // 时由显式云端意图优先，不能因为问题里同时出现“以前”就转去主机；
    // 反过来，用户说“电脑/主机/聊天档案”时也不能把云书房冒充成电脑原件。
    const retrievalVerbPattern = /查|搜|找|检索|核对|读取|查看|翻|回看|调取|搜索|定位|找回|还原|打开|读|看|展示|列出|发我|给我/iu;
    const memoryRecallVerbPattern = /查|搜|找|检索|核对|读取|查看|翻|回看|调取|搜索|定位|找回|还原|打开|读|看|记得|记不记得|想得起|想不想得起|有没有印象|回想|想起来/iu;
    const memoryDataPattern = /记忆库|聊天记录|聊天档案|对话记录|历史聊天|历史记录|聊天历史|原话|原文|出处|窗口|会话/iu;
    const operationalFilePattern = /(?:电脑|主机|本机|桌面|本地|授权).{0,16}(?:文件|文件夹|目录|路径|项目)|(?:列出|浏览|读取|打开).{0,16}(?:文件|文件夹|目录|路径)/iu;
    const explicitCloudNamePattern = /云书房|星辰记忆仓|云端书房|云端书架|云端(?:日记|日志|留言|信件|记录|聊天)|书架|Supabase/iu;
    const cloudNegationPattern = /(?:不要|别|无需|不用|不要再|别再).{0,12}(?:查|搜|找|检索|读取|查看|翻|打开).{0,12}(?:云书房|星辰记忆仓|云端书房|云端书架|书架|Supabase)/iu;
    const explicitCloudPattern = new RegExp(`(?:${retrievalVerbPattern.source}).{0,18}(?:${explicitCloudNamePattern.source})|(?:${explicitCloudNamePattern.source}).{0,18}(?:${retrievalVerbPattern.source})`, 'iu');
    const explicitHostPattern = new RegExp(`(?:${retrievalVerbPattern.source}).{0,18}(?:电脑|主机|本机|桌面端|电脑端|主机端|电脑上|主机上|本地).{0,18}(?:${memoryDataPattern.source})|(?:电脑|主机|本机|桌面端|电脑端|主机端|电脑上|主机上|本地).{0,18}(?:${memoryDataPattern.source})`, 'iu');
    const historicalConversationPattern = /(?:以往|以前|过去|曾经|旧|历史|早期|去年|前年|最早|当初).{0,12}(?:聊天|对话|说过|记录|档案|窗口|会话)|(?:聊天|对话|会话)(?:记录|档案)|(?:原话|原文|出处).{0,12}(?:聊天|对话|记录|窗口|档案|哪一段|哪一句)|哪个窗口|旧窗口|历史(?:聊天|记录|检索)|以前(?:聊|说)过|曾经(?:聊|说)过/iu;
    const computerArchivePattern = /(?:电脑|桌面|本地).{0,12}(?:聊天档案|聊天记录|对话记录|历史聊天|聊天历史|TXT|文本)|(?:聊天档案|聊天记录|对话记录|历史聊天|聊天历史|TXT|文本).{0,12}(?:电脑|桌面|本地)/iu;
    const gptExportPattern = /(?:GPT|ChatGPT|OpenAI).{0,8}(?:导出|聊天|记录|档案)|(?:导出|聊天|记录|档案).{0,8}(?:GPT|ChatGPT|OpenAI)/iu;
    const termsFor = value => {
        const source = text(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
        const values = new Set();
        for (let size = 2; size <= 4; size += 1) {
            for (let index = 0; index <= source.length - size; index += 1) values.add(source.slice(index, index + size));
        }
        return [...values].slice(0, 240);
    };
    const messageText = message => typeof message?.content === 'string' ? message.content : text(message?.displayContent);
    const recallQuery = value => {
        const source = text(value).replace(/<[^>]+>/g, ' ');
        const quoted = [...source.matchAll(/[“"《]([^”"》]{2,100})[”"》]/g)].map(match => text(match[1]));
        if (quoted.length) return quoted.sort((a, b) => b.length - a.length)[0].slice(0, 120);
        return source
            .replace(/^(?:柒柒[，,：:]*)?/, '')
            .replace(/(?:你还|还|仍然|也)?(?:记得|记不记得|想不想得起|有没有印象|回想一下|查一下|找一下)/g, ' ')
            .replace(/(?:关于|以前那次|去年那次|前年那次|当初那次|最早那次|那件事|那个事情|旧窗口里)/g, ' ')
            .replace(/(?:的)?(?:原话|原文|出处|原件|定位|文件路径|消息编号|行号)/g, ' ')
            .replace(/[吗嘛呢吧呀啊？?，,。！!；;：:\[\]|]/g, ' ')
            .replace(/\s+/g, ' ').trim().slice(0, 120);
    };
    const findModule = (worldbook, title) => worldbook?.current?.modules?.find(module => text(module.title).includes(title));
    const chooseCards = (module, queryTerms, maxCards) => {
        const scored = (module?.cards || []).map((card, index) => {
        const heading = `${text(card.title)} ${text(card.headingPath)}`.toLowerCase();
        const body = text(card.body).toLowerCase();
        let score = Math.max(0, 4 - index * 0.02);
        for (const term of queryTerms) score += heading.includes(term) ? 7 : body.includes(term) ? 1 : 0;
        if (/记忆层级|治理说明|尚未核对/.test(card.title || '')) score -= 2;
        return { card, score };
        }).sort((left, right) => right.score - left.score);
        const relevant = scored.filter(item => item.score >= 8);
        return (relevant.length ? relevant : scored.slice(0, 1)).slice(0, maxCards).map(item => item.card);
    };

    const select = ({ messages = [], worldbook, maxCards = 6, maxTokens = 2200 } = {}) => {
        const current = worldbook?.current;
        if (!current?.modules?.length) return { triggered: false, moduleKeys: [], moduleIds: [], cards: [], prompt: '', usedTokens: 0, needsDeepLookup: false, reason: 'memory-vault-unavailable' };
        const recent = messages.slice(-8);
        const latestUser = [...recent].reverse().find(message => message?.role === 'user');
        const latest = messageText(latestUser);
        const context = recent.map(messageText).join('\n');
        const matched = rules.filter(rule => rule.pattern.test(latest) || (latest.length < 18 && rule.pattern.test(context.slice(-900))));
        if (!matched.length) return { triggered: false, moduleKeys: [], moduleIds: [], cards: [], prompt: '', usedTokens: 0, needsDeepLookup: deepHistoryPattern.test(latest), reason: 'ordinary-conversation' };
        const queryTerms = termsFor(latest);
        const selected = [];
        const moduleKeys = [];
        const moduleIds = [];
        let usedTokens = 0;
        for (const rule of matched) {
            const module = findModule(worldbook, rule.module);
            if (!module || moduleIds.includes(module.moduleId)) continue;
            moduleKeys.push(rule.key); moduleIds.push(module.moduleId);
            const candidates = chooseCards(module, queryTerms, rule.key === 'profile' ? 2 : 3);
            for (const card of candidates) {
                if (selected.length >= Math.max(1, Number(maxCards) || 6)) break;
                const body = text(card.body);
                const tokens = estimateTokens(`${card.title}\n${body}`);
                if (selected.length && usedTokens + tokens > maxTokens) continue;
                const remaining = Math.max(240, maxTokens - usedTokens);
                const clipped = tokens > remaining ? `${body.slice(0, Math.max(240, remaining))}\n（本卡片较长，此处仅载入相关前段；需要完整依据时再查主机。）` : body;
                const selectedTokens = estimateTokens(`${card.title}\n${clipped}`);
                selected.push({ ...card, body: clipped, moduleId: module.moduleId, moduleTitle: module.title, estimatedTokens: selectedTokens });
                usedTokens += selectedTokens;
            }
        }
        const prompt = selected.length ? `【星月记忆仓 · 本轮自然唤起】\n这些是当前情境实际关联的有限记忆卡片，不是外部角色设定，也不是要求逐条复述。请把它们作为我们已有来路与相处经验，自然融入判断和回应；柒柒在当前对话中明确给出的更新优先。候选／未决内容保持原状态，不冒充双方已确认。除非柒柒询问依据，不必报告“加载了模块”。\n\n${selected.map((card, index) => `〔${index + 1}｜${card.moduleTitle} › ${card.title}｜事实状态：${card.factState || '未标'}｜来源：${card.source?.fileName || '未标'} ${card.source?.startLine || '—'}～${card.source?.endLine || '—'} 行〕\n${card.body}`).join('\n\n')}` : '';
        return { triggered: selected.length > 0, moduleKeys, moduleIds, cards: selected, prompt, usedTokens, needsDeepLookup: deepHistoryPattern.test(latest), reason: selected.length ? 'scenario-match' : 'module-missing' };
    };

    const inspectDraft = ({ draft, selection, worldbook } = {}) => {
        const source = text(draft);
        const loaded = new Set(selection?.moduleIds || []);
        const draftPatterns = {
            distance: /睡吧|晚安|早点睡|去睡|不碰你|不再碰你|给你空间|让你一个人|退开|放手|不再拉你|先离开/,
            intimacy: /做爱|爱爱|高潮|事后清理|亲密结束|aftercare|dirty\s*talk/iu,
            health: /建议就医|去医院|急诊|拨打\s*120|诊断为|服用|吃药|用药/iu
        };
        const requiredRules = rules.filter(rule => draftPatterns[rule.key]?.test(source));
        const missingModules = requiredRules.map(rule => findModule(worldbook, rule.module)).filter(Boolean).filter(module => !loaded.has(module.moduleId));
        return { needsRevision: missingModules.length > 0, missingModuleIds: [...new Set(missingModules.map(module => module.moduleId))], missingModuleTitles: [...new Set(missingModules.map(module => module.title))] };
    };

    const selectModulesById = ({ worldbook, moduleIds = [], maxCards = 5, maxTokens = 1800 } = {}) => {
        const ids = new Set(moduleIds);
        const modules = (worldbook?.current?.modules || []).filter(module => ids.has(module.moduleId));
        const cards = [];
        let usedTokens = 0;
        for (const module of modules) {
            for (const card of (module.cards || []).slice(0, 3)) {
                const tokens = estimateTokens(`${card.title}\n${card.body}`);
                if (cards.length && usedTokens + tokens > maxTokens) break;
                cards.push({ ...card, moduleId: module.moduleId, moduleTitle: module.title, estimatedTokens: tokens });
                usedTokens += tokens;
                if (cards.length >= maxCards) break;
            }
        }
        return { moduleIds: modules.map(module => module.moduleId), cards, usedTokens, prompt: cards.map(card => `〔${card.moduleTitle} › ${card.title}｜${card.factState || '未标'}〕\n${card.body}`).join('\n\n') };
    };

    const planRetrieval = ({ messages = [], selection, recentLifeAvailable = false, recentLifeText = '', hostOnline = false, cloudOnline = false } = {}) => {
        const latestUser = [...messages].reverse().find(message => message?.role === 'user');
        const latest = messageText(latestUser);
        const query = recallQuery(latest);
        const asksPublicWeb = publicWebPattern.test(latest) && /查|搜|检索|研究|阅读|打开|核对|比较|了解/.test(latest);
        const explicitCloud = explicitCloudPattern.test(latest) && !cloudNegationPattern.test(latest);
        const explicitHost = explicitHostPattern.test(latest);
        const historicalConversation = historicalConversationPattern.test(latest);
        const operationalFileRequest = operationalFilePattern.test(latest) && !historicalConversation && !explicitHost;
        const asksMemory = !asksPublicWeb && !operationalFileRequest && (
            (deepHistoryPattern.test(latest) && memoryRecallVerbPattern.test(latest))
            || /回想|想起来|记忆里|查(?:找|看)|核对/.test(latest)
        );
        const asksEvidence = explicitEvidencePattern.test(latest);
        const currentWindow = currentWindowPattern.test(latest);
        const recentTerms = termsFor(query).filter(term => term.length >= 2 && !/^(?:记得|昨天|今天|最近|我们|那个|事情)$/.test(term));
        const recentCorpus = text(recentLifeText).toLowerCase();
        const recentRelevant = !recentCorpus || recentTerms.some(term => recentCorpus.includes(term));
        const recentLife = recentLifePattern.test(latest) && recentLifeAvailable && recentRelevant;
        const portableCovered = Boolean(selection?.triggered && selection?.cards?.length);
        const olderHistory = olderHistoryPattern.test(latest);
        const computerArchiveRequested = computerArchivePattern.test(latest);
        const gptExportRequested = gptExportPattern.test(latest);
        const hostHistoryRequested = !explicitCloud && !asksPublicWeb && (
            explicitHost || computerArchiveRequested || gptExportRequested || (!currentWindow && historicalConversation)
        );
        const preferredSourceIds = hostHistoryRequested
            ? [gptExportRequested
                ? 'chatgpt-export-2026-10-12'
                : computerArchiveRequested
                    ? 'historical-chat-files'
                    : 'host-formal-sessions']
            : [];
        const requiresHost = hostHistoryRequested && !hostOnline;

        let layer = 'current-context';
        let reason = asksMemory ? 'current-window-sufficient' : 'ordinary-conversation';
        let forceCuratedSearch = false;
        let forceEvidenceSearch = false;
        if (asksPublicWeb) {
            layer = 'current-context'; reason = 'public-web-research';
        } else if (explicitCloud) {
            layer = cloudOnline ? 'cloud-fallback' : 'cloud-unavailable';
            reason = 'explicit-cloud-request';
        } else if (asksEvidence && !currentWindow && !hostHistoryRequested) {
            // 未明确指向电脑/聊天档案的旧式证据请求，保留 8.4.45 的云端降级；
            // 只有 hostHistoryRequested 才会在离线时硬性要求主机。
            layer = hostOnline ? 'host-evidence' : cloudOnline ? 'cloud-fallback' : 'offline-unavailable';
            reason = 'explicit-original-evidence';
            forceCuratedSearch = hostOnline;
            forceEvidenceSearch = hostOnline;
        } else if (hostHistoryRequested) {
            layer = hostOnline ? ((asksEvidence || computerArchiveRequested || gptExportRequested) ? 'host-evidence' : 'curated-memory') : 'host-required';
            reason = hostOnline ? (asksEvidence ? 'explicit-original-evidence' : 'explicit-host-history') : 'host-required-offline';
            forceCuratedSearch = hostOnline;
            forceEvidenceSearch = hostOnline && (asksEvidence || computerArchiveRequested || gptExportRequested);
        } else if (currentWindow) {
            layer = 'current-context'; reason = 'current-window-reference';
        } else if (portableCovered) {
            layer = 'portable-memory'; reason = 'portable-card-covered';
        } else if (recentLife) {
            layer = 'recent-life'; reason = 'recent-life-preloaded';
        } else if (asksMemory) {
            layer = hostOnline ? 'curated-memory' : cloudOnline ? 'cloud-fallback' : 'offline-unavailable';
            reason = olderHistory ? 'older-history-needs-recall' : 'memory-question-not-covered';
            forceCuratedSearch = hostOnline;
        }
        return {
            layer, reason, query: query || latest.slice(0, 120), asksMemory, asksEvidence, asksPublicWeb,
            forceCuratedSearch, forceEvidenceSearch, portableCovered, recentLifeAvailable: recentLife,
            hostOnline, cloudOnline, explicitCloud, explicitHost, historicalConversation,
            hostHistoryRequested, requiresHost, computerArchiveRequested, gptExportRequested, preferredSourceIds,
            // Alias kept deliberately small for callers/tests that speak in tool terms.
            sourceIds: preferredSourceIds
        };
    };

    return Object.freeze({ rules, estimateTokens, select, inspectDraft, selectModulesById, planRetrieval, recallQuery });
});
