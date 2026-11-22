"use strict";

(function () {
  var AppShell = function AppShell(_ref) {
    var children = _ref.children,
      _ref$mobileView = _ref.mobileView,
      mobileView = _ref$mobileView === void 0 ? "chat" : _ref$mobileView;
    return /*#__PURE__*/React.createElement("div", {
      "data-mobile-view": mobileView,
      className: "app-shell flex bg-white text-gray-900 font-sans overflow-hidden"
    }, children);
  };
  var ToastNotice = function ToastNotice(_ref2) {
    var message = _ref2.message,
      Icon = _ref2.Icon;
    return message ? /*#__PURE__*/React.createElement("div", {
      className: "fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm shadow-lg z-50 animate-fade-in flex items-center gap-2"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Sparkles",
      size: 16,
      className: "text-yellow-400"
    }), " ", message) : null;
  };
  var SettingsShell = function SettingsShell(_ref3) {
    var activeTab = _ref3.activeTab,
      onTabChange = _ref3.onTabChange,
      onClose = _ref3.onClose,
      onSave = _ref3.onSave,
      vaultUnlocked = _ref3.vaultUnlocked,
      desktopAvailable = _ref3.desktopAvailable,
      Icon = _ref3.Icon,
      children = _ref3.children;
    return /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50 backdrop-blur-sm animate-fade-in sm:p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-white w-full max-w-4xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-[85vh] rounded-t-2xl"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-center p-4 md:p-5 border-b border-gray-100 flex-shrink-0"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-semibold text-gray-800"
    }, "\u8BBE\u7F6E\u4E2D\u5FC3"), /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      className: "text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "X",
      size: 18
    }))), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col md:flex-row flex-1 overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-full md:w-48 bg-gray-50 p-2 md:p-3 border-b md:border-b-0 md:border-r border-gray-100 flex flex-row md:flex-col gap-2 overflow-x-auto flex-shrink-0 no-scrollbar"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onTabChange('general');
      },
      className: "flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ".concat(activeTab === 'general' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100')
    }, "\u901A\u7528 & API"), desktopAvailable && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onTabChange('desktop');
      },
      className: "flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ".concat(activeTab === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100')
    }, "\u684C\u9762\u7A0B\u5E8F"), desktopAvailable && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onTabChange('tasks');
      },
      className: "flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ".concat(activeTab === 'tasks' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100')
    }, "\u4EFB\u52A1\u4E2D\u5FC3"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onTabChange('appearance');
      },
      className: "flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ".concat(activeTab === 'appearance' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100')
    }, "\u5916\u89C2 \u2728"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onTabChange('memory');
      },
      className: "flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ".concat(activeTab === 'memory' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100')
    }, "\u8BB0\u5FC6\u7BA1\u7406"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onTabChange('vault');
      },
      className: "flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ".concat(activeTab === 'vault' ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-amber-200 shadow-md' : 'text-amber-700 hover:bg-amber-50')
    }, "\u2601\uFE0F \u4E91\u4E66\u623F ", !vaultUnlocked && /*#__PURE__*/React.createElement("span", {
      className: "opacity-60"
    }, "\uD83D\uDD12")), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onTabChange('backup');
      },
      className: "flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ".concat(activeTab === 'backup' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100')
    }, "\u6570\u636E\u5907\u4EFD"), desktopAvailable && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onTabChange('migration');
      },
      className: "flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ".concat(activeTab === 'migration' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100')
    }, "\u65E7\u6570\u636E\u9884\u89C8"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return onTabChange('devices');
      },
      className: "flex-shrink-0 whitespace-nowrap w-auto md:w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ".concat(activeTab === 'devices' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100')
    }, "\u624B\u673A\u8BBE\u5907\u914D\u5BF9")), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 p-4 md:p-6 overflow-y-auto bg-white pb-10 md:pb-6"
    }, children)), /*#__PURE__*/React.createElement("div", {
      className: "p-3 md:p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl flex-shrink-0"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onSave,
      className: "w-full md:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
    }, "\u4FDD\u5B58\u8BBE\u7F6E"))));
  };
  window.XingyueUI = {
    AppShell: AppShell,
    ToastNotice: ToastNotice,
    SettingsShell: SettingsShell
  };
})();
