(function () {
    const { useState } = React;
    const api = window.XingyueOpenAI;

    const ApiSettingsPanel = ({ config, setConfig, showToast, Icon }) => {
        const [currentPresetId, setCurrentPresetId] = useState('');
        const [presetName, setPresetName] = useState('');
        const [isNamingPreset, setIsNamingPreset] = useState(false);
        const [availableModels, setAvailableModels] = useState([]);
        const [isFetchingModels, setIsFetchingModels] = useState(false);

        const changeField = (field, value) => {
            setConfig(prev => ({ ...prev, apiType: 'openai', [field]: value }));
            setCurrentPresetId('');
        };

        const selectPreset = (event) => {
            const presetId = event.target.value;
            setCurrentPresetId(presetId);
            const preset = (config.apiPresets || []).find(item => item.id === presetId);
            if (preset) {
                setConfig(prev => api.applyPreset(prev, preset));
                showToast(`已切换至：${preset.name}`);
            }
        };

        const saveNewPreset = () => {
            if (!presetName.trim()) return showToast('预设名字不能为空哦');
            const preset = api.createPreset(presetName, config);
            setConfig(prev => ({ ...prev, apiType: 'openai', apiPresets: [...(prev.apiPresets || []), preset] }));
            setCurrentPresetId(preset.id);
            setPresetName('');
            setIsNamingPreset(false);
            showToast('API 预设已保存在当前设备');
        };

        const updatePreset = () => {
            setConfig(prev => ({
                ...prev,
                apiType: 'openai',
                apiPresets: (prev.apiPresets || []).map(preset => preset.id === currentPresetId
                    ? { ...preset, apiType: 'openai', baseUrl: api.normalizeBaseUrl(prev.baseUrl), apiKey: prev.apiKey, model: prev.model }
                    : preset)
            }));
            showToast('API 预设已更新');
        };

        const deletePreset = () => {
            setConfig(prev => ({ ...prev, apiPresets: (prev.apiPresets || []).filter(preset => preset.id !== currentPresetId) }));
            setCurrentPresetId('');
            showToast('API 预设已删除');
        };

        const testAndFetchModels = async () => {
            setIsFetchingModels(true);
            try {
                const models = await api.fetchModels(config);
                setAvailableModels(models);
                if (!models.includes(config.model)) setConfig(prev => ({ ...prev, model: models[0] }));
                showToast(`连接成功，读取到 ${models.length} 个模型`);
            } catch (error) {
                setAvailableModels([]);
                showToast(error.message);
            } finally {
                setIsFetchingModels(false);
            }
        };

        return (
            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">API 预设管理</h3>
                    <div className="space-y-2">
                        <label className="block text-[10px] text-gray-500 font-bold">选择或切换预设</label>
                        <div className="flex gap-2 items-center">
                            {isNamingPreset ? (
                                <div className="flex-1 flex gap-2">
                                    <input type="text" autoFocus value={presetName} onChange={e => setPresetName(e.target.value)} placeholder="给这个预设起个名字..." className="flex-1 bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" />
                                    <button onClick={saveNewPreset} className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-blue-100">确认</button>
                                    <button onClick={() => setIsNamingPreset(false)} className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-100">取消</button>
                                </div>
                            ) : (
                                <>
                                    <select value={currentPresetId} onChange={selectPreset} className="flex-1 bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none cursor-pointer">
                                        <option value="">当前配置（未保存）</option>
                                        {(config.apiPresets || []).map(preset => <option key={preset.id} value={preset.id}>{preset.name}</option>)}
                                    </select>
                                    <button onClick={() => currentPresetId ? updatePreset() : setIsNamingPreset(true)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors whitespace-nowrap font-medium">{currentPresetId ? '更新' : '保存'}</button>
                                    {currentPresetId && <button onClick={deletePreset} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm transition-colors whitespace-nowrap font-medium">删除</button>}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">OpenAI 兼容 API</h3>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">仅保存在当前设备</span>
                    </div>
                    <div className="bg-gray-100 text-gray-500 text-[10px] p-2.5 rounded-lg border border-gray-200/50">
                        图片消息需要所选模型本身支持视觉理解。
                    </div>
                    <div><label className="block text-[10px] text-gray-500 font-bold mb-1">API Base URL（通常以 /v1 结尾）</label><input type="text" value={config.baseUrl} onChange={e => changeField('baseUrl', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" placeholder="例如：https://api.openai.com/v1" /></div>
                    <div><label className="block text-[10px] text-gray-500 font-bold mb-1">API Key</label><input type="password" value={config.apiKey} onChange={e => changeField('apiKey', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" placeholder="只保存在这台设备" /></div>
                    <div>
                        <label className="block text-[10px] text-gray-500 font-bold mb-1">模型</label>
                        {availableModels.length > 0
                            ? <select value={config.model} onChange={e => changeField('model', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none">{availableModels.map(model => <option key={model} value={model}>{model}</option>)}</select>
                            : <input type="text" value={config.model} onChange={e => changeField('model', e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" placeholder="填写服务商提供的模型名" />}
                    </div>
                    <button onClick={testAndFetchModels} disabled={isFetchingModels} className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <Icon name="RefreshCw" size={16} className={isFetchingModels ? 'animate-spin' : ''} />
                        {isFetchingModels ? '正在测试...' : '测试连接并读取模型'}
                    </button>
                </div>
            </div>
        );
    };

    window.XingyueApiSettings = { ApiSettingsPanel };
})();
