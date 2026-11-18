(function () {
    const AppShell = ({ children, mobileView = "chat" }) => (
        <div data-mobile-view={mobileView} className="app-shell flex bg-white text-gray-900 font-sans overflow-hidden">
            {children}
        </div>
    );

    const ToastNotice = ({ message, Icon }) => message ? (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm shadow-lg z-50 animate-fade-in flex items-center gap-2">
            <Icon name="Sparkles" size={16} className="text-yellow-400" /> {message}
        </div>
    ) : null;

    const SettingsShell = ({ activeTab, onTabChange, onClose, onSave, vaultUnlocked, desktopAvailable, Icon, children }) => (
        <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50 backdrop-blur-sm animate-fade-in sm:p-4">
            <div className="bg-white w-full max-w-4xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-[85vh] rounded-t-2xl">
                <div className="flex justify-between items-center p-4 md:p-5 border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-800">设置中心</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full"><Icon name="X" size={18} /></button>
                </div>
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    <div className="w-full md:w-48 bg-gray-50 p-2 md:p-3 border-b md:border-b-0 md:border-r border-gray-100 flex flex-row md:flex-col gap-2 overflow-x-auto flex-shrink-0 no-scrollbar">
                        <button onClick={() => onTabChange('general')} className={`flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>通用 & API</button>
                        {desktopAvailable && <button onClick={() => onTabChange('desktop')} className={`flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>桌面程序</button>}
                        {desktopAvailable && <button onClick={() => onTabChange('tasks')} className={`flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'tasks' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>任务中心</button>}
                        <button onClick={() => onTabChange('appearance')} className={`flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>外观 ✨</button>
                        <button onClick={() => onTabChange('memory')} className={`flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'memory' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>记忆管理</button>
                        <button onClick={() => onTabChange('vault')} className={`flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'vault' ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-amber-200 shadow-md' : 'text-amber-700 hover:bg-amber-50'}`}>
                            ☁️ 云书房 {!vaultUnlocked && <span className="opacity-60">🔒</span>}
                        </button>
                        <button onClick={() => onTabChange('backup')} className={`flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'backup' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>数据备份</button>
                        {desktopAvailable && <button onClick={() => onTabChange('migration')} className={`flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'migration' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>旧数据预览</button>}
                        <button onClick={() => onTabChange('devices')} className={`flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'devices' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>手机设备配对</button>
                    </div>
                    <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-white pb-10 md:pb-6">
                        {children}
                    </div>
                </div>
                <div className="p-3 md:p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl flex-shrink-0">
                    <button onClick={onSave} className="w-full md:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">保存设置</button>
                </div>
            </div>
        </div>
    );

    window.XingyueUI = { AppShell, ToastNotice, SettingsShell };
})();
