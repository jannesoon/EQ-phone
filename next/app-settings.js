(function () {
    const THEMES = ['default', 'dark', 'claude'];
    const LEGACY_ROLE_SETTING_KEYS = ['systemInstruction', 'localModelOptimize', 'rolePrompt', 'personaPrompt'];
    const LEGACY_ROLE_BACKUP_KEY = 'xingyue_legacy_role_settings_backup_v1';

    const extractLegacyRoleSettings = (stored) => Object.fromEntries(
        LEGACY_ROLE_SETTING_KEYS
            .filter(key => stored && Object.prototype.hasOwnProperty.call(stored, key))
            .map(key => [key, stored[key]])
    );

    const stripLegacyRoleSettings = (stored) => {
        const active = { ...(stored || {}) };
        LEGACY_ROLE_SETTING_KEYS.forEach(key => delete active[key]);
        return active;
    };

    const backupLegacyRoleSettings = (storage, stored) => {
        const legacy = extractLegacyRoleSettings(stored);
        if (!storage || Object.keys(legacy).length === 0) return null;
        const previousRaw = storage.getItem(LEGACY_ROLE_BACKUP_KEY);
        if (previousRaw) {
            try { return JSON.parse(previousRaw); } catch (_) { /* 用本次可验证内容修复损坏的迁移副本 */ }
        }
        const backup = { schemaVersion: 1, capturedAt: new Date().toISOString(), source: 'gemini_app_config', settings: legacy };
        storage.setItem(LEGACY_ROLE_BACKUP_KEY, JSON.stringify(backup));
        return backup;
    };

    const createDefaultConfig = () => ({
        apiKey: '',
        baseUrl: '',
        ttsEngine: 'minimax',
        enableCorsProxy: true,
        openaiTtsKey: '',
        openaiTtsUrl: 'https://api.openai.com/v1',
        openaiTtsVoice: 'echo',
        minimaxKey: '',
        minimaxGroupId: '',
        minimaxVoiceId: 'male-qn-qingse',
        minimaxModel: 'speech-01-turbo',
        minimaxSpeed: 1.0,
        minimaxPitch: 0,
        siliconflowKey: '',
        siliconflowSpeed: 1.0,
        elevenlabsKey: '',
        elevenlabsVoiceId: '',
        elevenlabsModel: 'eleven_v4',
        historyLimit: 10,
        contextWindowTokens: 65536,
        temperature: 0.7,
        frequencyPenalty: 0,
        model: '',
        userAvatar: '',
        aiAvatar: '',
        apiType: 'openai',
        userName: '柒柒',
        aiName: '逸辰',
        streamOutput: true,
        theme: 'default',
        minimaxUrl: 'https://api.minimaxi.com/v1/t2a_v2',
        anniversaries: { '01-01': '元旦', '02-14': '情人节', '05-20': '520纪念日', '12-25': '圣诞节' },
        apiPresets: [],
        userBubbleColor: 'blue',
        userBubbleCustom: '#dbeafe',
        chatBgImage: '',
        chatBgOpacity: 0.25,
        chatBgBlur: 0,
        loveStartDate: '',
        partnerName: '',
        drawMode: 'both',
        drawApiUrl: '',
        drawApiKey: '',
        drawModel: 'image-01',
        drawAspectRatio: '1:1'
    });

    const normalizeStoredConfig = (stored) => {
        const parsed = stripLegacyRoleSettings(stored);
        const wasGeminiNative = parsed.apiType === 'gemini' || (parsed.baseUrl || '').includes('generativelanguage.googleapis.com');
        parsed.apiType = 'openai';
        if (wasGeminiNative) {
            parsed.baseUrl = '';
            parsed.apiKey = '';
            parsed.model = '';
        }
        if (!parsed.userName || parsed.userName === '你' || parsed.userName === '用户') parsed.userName = '柒柒';
        if (!parsed.aiName || parsed.aiName === '星月舱 AI') parsed.aiName = '逸辰';
        if (!parsed.minimaxVoiceId) parsed.minimaxVoiceId = 'male-qn-qingse';
        if (!parsed.minimaxModel) parsed.minimaxModel = 'speech-01-turbo';
        if (parsed.temperature === undefined) parsed.temperature = 0.7;
        if (parsed.frequencyPenalty === undefined) parsed.frequencyPenalty = 0;
        const contextWindowTokens = Number(parsed.contextWindowTokens);
        parsed.contextWindowTokens = Number.isFinite(contextWindowTokens) && contextWindowTokens >= 8192
            ? Math.min(1048576, Math.round(contextWindowTokens))
            : 65536;
        // 旧角色提示只进入迁移副本，不再属于活动配置，也不能随普通设置保存回来。
        if (parsed.streamOutput === undefined) parsed.streamOutput = true;
        if (!parsed.ttsEngine) parsed.ttsEngine = 'minimax';
        if (parsed.enableCorsProxy === undefined) parsed.enableCorsProxy = true;
        if (!parsed.openaiTtsUrl) parsed.openaiTtsUrl = 'https://api.openai.com/v1';
        if (!parsed.openaiTtsVoice) parsed.openaiTtsVoice = 'echo';
        if (parsed.minimaxSpeed === undefined) parsed.minimaxSpeed = 1.0;
        if (parsed.minimaxPitch === undefined) parsed.minimaxPitch = 0;
        if (parsed.siliconflowKey === undefined) parsed.siliconflowKey = '';
        if (parsed.siliconflowSpeed === undefined) parsed.siliconflowSpeed = 1.0;
        if (parsed.elevenlabsKey === undefined) parsed.elevenlabsKey = '';
        if (parsed.elevenlabsVoiceId === undefined) parsed.elevenlabsVoiceId = '';
        if (!['eleven_v4', 'eleven_v4_turbo'].includes(parsed.elevenlabsModel)) parsed.elevenlabsModel = 'eleven_v4';
        if (!parsed.theme) parsed.theme = 'default';
        if (!parsed.minimaxUrl || parsed.minimaxUrl.includes('minimax.chat')) parsed.minimaxUrl = 'https://api.minimaxi.com/v1/t2a_v2';
        if (!parsed.anniversaries) parsed.anniversaries = { '01-01': '元旦', '02-14': '情人节', '05-20': '520纪念日', '12-25': '圣诞节' };
        parsed.apiPresets = (parsed.apiPresets || [])
            .filter(preset => preset.apiType === 'openai' || !preset.apiType)
            .map(preset => ({ ...preset, apiType: 'openai' }));
        if (parsed.loveStartDate === undefined) parsed.loveStartDate = '';
        if (parsed.partnerName === undefined) parsed.partnerName = '';
        if (parsed.drawMode === undefined) parsed.drawMode = 'both';
        if (parsed.drawMode === 'pollinations' || parsed.drawMode === 'api') parsed.drawMode = 'minimax';
        if (parsed.drawApiUrl === undefined) parsed.drawApiUrl = '';
        if (parsed.drawApiKey === undefined) parsed.drawApiKey = '';
        if (parsed.drawModel === undefined) parsed.drawModel = 'image-01';
        if (parsed.drawAspectRatio === undefined) parsed.drawAspectRatio = '1:1';
        return parsed;
    };

    const applyTheme = (theme) => {
        document.body.className = `overflow-hidden ${theme === 'default' ? 'bg-white text-gray-900' : `theme-${theme}`}`;
        document.body.classList.add('mc-force-mobile');
    };

    const getNextTheme = (theme) => {
        const currentIndex = THEMES.indexOf(theme || 'default');
        return THEMES[(currentIndex + 1) % THEMES.length];
    };

    const getThemeLabel = (theme) => theme === 'dark' ? '星空暗夜' : theme === 'claude' ? '琥珀书卷' : '默认极简';

    window.XingyueSettings = {
        createDefaultConfig,
        normalizeStoredConfig,
        extractLegacyRoleSettings,
        stripLegacyRoleSettings,
        backupLegacyRoleSettings,
        LEGACY_ROLE_BACKUP_KEY,
        applyTheme,
        getNextTheme,
        getThemeLabel
    };
})();
