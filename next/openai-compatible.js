(function () {
    const SECRET_FIELDS = ['apiKey', 'openaiTtsKey', 'minimaxKey', 'siliconflowKey', 'elevenlabsKey', 'drawApiKey'];
    const API_SETTING_FIELDS = [
        'apiType', 'baseUrl', 'apiKey', 'model', 'enableCorsProxy', 'apiPresets',
        'ttsEngine', 'openaiTtsKey', 'openaiTtsUrl', 'openaiTtsVoice',
        'minimaxKey', 'minimaxGroupId', 'minimaxVoiceId', 'minimaxModel', 'minimaxUrl',
        'siliconflowKey', 'elevenlabsKey', 'elevenlabsVoiceId', 'elevenlabsModel',
        'drawMode', 'drawApiUrl', 'drawApiKey', 'drawModel', 'drawAspectRatio'
    ];

    const normalizeBaseUrl = (value) => (value || '').trim().replace(/\/$/, '');

    const fetchModels = async ({ baseUrl, apiKey }) => {
        const normalizedUrl = normalizeBaseUrl(baseUrl);
        if (!normalizedUrl) throw new Error('请先填写 API Base URL');
        if (!apiKey) throw new Error('请先填写 API Key');
        const response = await fetch(`${normalizedUrl}/models`, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        if (!response.ok) throw new Error(`连接失败（HTTP ${response.status}）`);
        const data = await response.json();
        const models = Array.isArray(data.data)
            ? [...new Set(data.data.map(item => String(item?.id ?? '').trim()).filter(Boolean))].slice(0, 500)
            : [];
        if (!models.length) throw new Error('连接成功，但没有读取到模型');
        return models;
    };

    const createPreset = (name, config) => ({
        id: Date.now().toString(),
        name: name.trim(),
        apiType: 'openai',
        baseUrl: normalizeBaseUrl(config.baseUrl),
        apiKey: config.apiKey || '',
        model: config.model || ''
    });

    const applyPreset = (config, preset) => ({
        ...config,
        apiType: 'openai',
        baseUrl: preset.baseUrl || '',
        apiKey: preset.apiKey || '',
        model: preset.model || ''
    });

    const sanitizeConfigForBackup = (config) => {
        const safe = { ...config, apiType: 'openai' };
        for (const field of SECRET_FIELDS) safe[field] = '';
        safe.apiPresets = (safe.apiPresets || []).map(preset => ({
            ...preset,
            apiType: 'openai',
            apiKey: ''
        }));
        return safe;
    };

    const restoreConfigFromPackage = (current, incoming = {}, containsSecrets = false) => {
        const restored = { ...current, ...incoming, apiType: 'openai' };
        for (const field of SECRET_FIELDS) {
            restored[field] = containsSecrets ? (incoming[field] || '') : (current[field] || '');
        }

        const localPresets = new Map((current.apiPresets || []).map(preset => [preset.id, preset]));
        restored.apiPresets = (incoming.apiPresets || current.apiPresets || [])
            .filter(preset => preset.apiType === 'openai' || !preset.apiType)
            .map(preset => ({
                ...preset,
                apiType: 'openai',
                apiKey: containsSecrets ? (preset.apiKey || '') : (localPresets.get(preset.id)?.apiKey || '')
            }));
        return restored;
    };

    const preserveDeviceApiSettings = (current = {}, restored = {}) => {
        const result = { ...restored };
        for (const field of API_SETTING_FIELDS) {
            if (Object.prototype.hasOwnProperty.call(current, field)) result[field] = current[field];
        }
        result.apiType = 'openai';
        result.apiPresets = (current.apiPresets || []).map(preset => ({ ...preset, apiType: 'openai' }));
        return result;
    };

    const replaceApiSettings = (current = {}, incoming = {}) => {
        const result = { ...current, apiType: 'openai' };
        for (const field of API_SETTING_FIELDS) {
            if (field !== 'apiPresets' && Object.prototype.hasOwnProperty.call(incoming, field)) result[field] = incoming[field];
        }
        result.apiPresets = (incoming.apiPresets || []).map(preset => ({ ...preset, apiType: 'openai' }));
        return result;
    };

    const mergeApiSettingsNonDestructive = (current = {}, incoming = {}) => {
        const result = { ...current, apiType: 'openai' };
        const stats = { addedSecrets: 0, preservedSecrets: 0, differingSecretsSkipped: 0, addedPresets: 0, preservedPresets: 0 };

        for (const field of API_SETTING_FIELDS) {
            if (field === 'apiPresets' || SECRET_FIELDS.includes(field)) continue;
            if ((result[field] === undefined || result[field] === null || result[field] === '') && incoming[field] !== undefined) result[field] = incoming[field];
        }
        for (const field of SECRET_FIELDS) {
            const localValue = current[field] || '';
            const incomingValue = incoming[field] || '';
            if (localValue) {
                stats.preservedSecrets += 1;
                if (incomingValue && incomingValue !== localValue) stats.differingSecretsSkipped += 1;
                result[field] = localValue;
            } else if (incomingValue) {
                result[field] = incomingValue;
                stats.addedSecrets += 1;
            }
        }

        const localPresets = new Map((current.apiPresets || []).map(preset => [String(preset.id), { ...preset, apiType: 'openai' }]));
        const mergedPresets = [...localPresets.values()];
        for (const incomingPreset of incoming.apiPresets || []) {
            const id = String(incomingPreset.id || '');
            const index = mergedPresets.findIndex(preset => String(preset.id) === id);
            if (index < 0) {
                mergedPresets.push({ ...incomingPreset, apiType: 'openai' });
                stats.addedPresets += 1;
                if (incomingPreset.apiKey) stats.addedSecrets += 1;
                continue;
            }
            const localPreset = mergedPresets[index];
            const localKey = localPreset.apiKey || '';
            const incomingKey = incomingPreset.apiKey || '';
            stats.preservedPresets += 1;
            if (localKey) {
                stats.preservedSecrets += 1;
                if (incomingKey && incomingKey !== localKey) stats.differingSecretsSkipped += 1;
            } else if (incomingKey) {
                stats.addedSecrets += 1;
            }
            mergedPresets[index] = { ...incomingPreset, ...localPreset, apiType: 'openai', apiKey: localKey || incomingKey };
        }
        result.apiPresets = mergedPresets;
        return { config: result, stats };
    };

    const countConfiguredSecrets = (config = {}) => {
        let count = SECRET_FIELDS.filter(field => Boolean(config[field])).length;
        count += (config.apiPresets || []).filter(preset => Boolean(preset.apiKey)).length;
        return count;
    };

    const secretsMatch = (expected = {}, actual = {}) => {
        if (SECRET_FIELDS.some(field => (expected[field] || '') !== (actual[field] || ''))) return false;
        const actualPresets = new Map((actual.apiPresets || []).map(preset => [preset.id, preset.apiKey || '']));
        return (expected.apiPresets || []).every(preset => (preset.apiKey || '') === (actualPresets.get(preset.id) || ''));
    };

    window.XingyueOpenAI = {
        normalizeBaseUrl,
        fetchModels,
        createPreset,
        applyPreset,
        sanitizeConfigForBackup,
        restoreConfigFromPackage,
        preserveDeviceApiSettings,
        replaceApiSettings,
        mergeApiSettingsNonDestructive,
        countConfiguredSecrets,
        secretsMatch
    };
})();
