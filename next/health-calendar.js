"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var _React = React,
    useState = _React.useState;
  var _window$XingyueHealth = window.XingyueHealth,
    toLocalDateKey = _window$XingyueHealth.toLocalDateKey,
    buildMonthDays = _window$XingyueHealth.buildMonthDays;
  var HealthCalendar = function HealthCalendar(_ref) {
    var records = _ref.records,
      anniversaries = _ref.anniversaries,
      onSave = _ref.onSave,
      Icon = _ref.Icon;
    var _useState = useState(new Date()),
      _useState2 = _slicedToArray(_useState, 2),
      currentMonth = _useState2[0],
      setCurrentMonth = _useState2[1];
    var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      editingDate = _useState4[0],
      setEditingDate = _useState4[1];
    var _useState5 = useState(''),
      _useState6 = _slicedToArray(_useState5, 2),
      editValue = _useState6[0],
      setEditValue = _useState6[1];
    var _useState7 = useState(''),
      _useState8 = _slicedToArray(_useState7, 2),
      editAnniversary = _useState8[0],
      setEditAnniversary = _useState8[1];
    var year = currentMonth.getFullYear();
    var month = currentMonth.getMonth();
    var today = toLocalDateKey(new Date());
    var days = buildMonthDays(year, month);
    var fullDate = function fullDate(day) {
      return "".concat(year, "-").concat(String(month + 1).padStart(2, '0'), "-").concat(String(day).padStart(2, '0'));
    };
    var openEditor = function openEditor(date) {
      setEditingDate(date);
      setEditValue(records[date] || '');
      setEditAnniversary((anniversaries === null || anniversaries === void 0 ? void 0 : anniversaries[date.slice(5)]) || '');
    };
    var save = function save() {
      onSave({
        date: editingDate,
        status: editValue,
        anniversary: editAnniversary
      });
      setEditingDate(null);
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col h-full bg-white"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between mb-4 px-2 items-center"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "font-bold flex items-center gap-2 text-gray-800"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Heart",
      size: 18,
      className: "text-pink-500 fill-pink-500"
    }), " \u661F\u6708\u65E5\u5386"), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 items-center text-sm"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return setCurrentMonth(new Date(year, month - 1));
      },
      className: "p-1 hover:bg-gray-100 rounded-full",
      title: "\u4E0A\u4E2A\u6708"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "ChevronLeft",
      size: 16
    })), /*#__PURE__*/React.createElement("span", {
      className: "font-medium"
    }, year, "\u5E74 ", month + 1, "\u6708"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return setCurrentMonth(new Date(year, month + 1));
      },
      className: "p-1 hover:bg-gray-100 rounded-full",
      title: "\u4E0B\u4E2A\u6708"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "ChevronRight",
      size: 16
    })))), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-7 text-center text-[10px] text-gray-400 font-bold mb-2"
    }, ['日', '一', '二', '三', '四', '五', '六'].map(function (day) {
      return /*#__PURE__*/React.createElement("div", {
        key: day
      }, day);
    })), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-7 gap-1"
    }, days.map(function (day, index) {
      if (!day) return /*#__PURE__*/React.createElement("div", {
        key: "empty-".concat(index)
      });
      var date = fullDate(day);
      var record = records[date];
      var anniversary = anniversaries === null || anniversaries === void 0 ? void 0 : anniversaries[date.slice(5)];
      var isToday = date === today;
      return /*#__PURE__*/React.createElement("button", {
        type: "button",
        key: date,
        onClick: function onClick() {
          return openEditor(date);
        },
        "aria-label": "".concat(date).concat(record ? "\uFF0C".concat(record) : ''),
        className: "h-12 border rounded-lg p-1 cursor-pointer hover:border-blue-300 relative text-left ".concat(isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100')
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-[10px] ".concat(isToday ? 'text-blue-600 font-bold' : 'text-gray-500')
      }, day), anniversary && /*#__PURE__*/React.createElement("span", {
        className: "absolute top-0.5 right-0.5 text-[8px] text-pink-500 font-bold max-w-[90%] truncate"
      }, "\u2728", anniversary), record && /*#__PURE__*/React.createElement("span", {
        title: record,
        className: "block mt-1 text-[8px] bg-purple-50 text-purple-600 truncate border border-purple-100 rounded px-0.5"
      }, record), record && /*#__PURE__*/React.createElement("span", {
        className: "calendar-dot"
      }));
    })), editingDate && /*#__PURE__*/React.createElement("div", {
      className: "fixed inset-0 bg-black/40 flex items-center justify-center z-[70] p-4 backdrop-blur-sm animate-fade-in"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-white w-full max-w-xs rounded-xl p-5 shadow-2xl animate-scale-in"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-bold mb-3 text-gray-800"
    }, editingDate, " \u4E13\u5C5E\u6807\u8BB0"), /*#__PURE__*/React.createElement("label", {
      className: "block text-[10px] text-gray-500 mb-1 font-medium"
    }, "\u6BCF\u5E74\u91CD\u590D\u7684\u7EAA\u5FF5\u65E5/\u751F\u65E5"), /*#__PURE__*/React.createElement("input", {
      className: "w-full bg-pink-50 border border-pink-100 rounded-lg p-2 text-xs focus:outline-none focus:border-pink-300 mb-3 text-pink-600 font-medium placeholder:text-pink-300",
      value: editAnniversary,
      onChange: function onChange(event) {
        return setEditAnniversary(event.target.value);
      },
      placeholder: "\u6BD4\u5982\uFF1A\u76F8\u8BC6\u7EAA\u5FF5\u65E5\u3001\u5BB6\u4EBA\u7684\u751F\u65E5..."
    }), /*#__PURE__*/React.createElement("label", {
      className: "block text-[10px] text-gray-500 mb-1 font-medium"
    }, "\u5F53\u5929\u7684\u8EAB\u4F53\u72B6\u6001"), /*#__PURE__*/React.createElement("textarea", {
      autoFocus: true,
      className: "w-full h-20 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:border-blue-400 resize-none",
      value: editValue,
      onChange: function onChange(event) {
        return setEditValue(event.target.value);
      },
      placeholder: "\u8EAB\u4F53\u54EA\u91CC\u4E0D\u8212\u670D\u561B\uFF1F\u6216\u5DF2\u5EB7\u590D\uFF1F"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 mt-4"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return setEditingDate(null);
      },
      className: "flex-1 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
    }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement("button", {
      onClick: save,
      className: "flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
    }, "\u4FDD\u5B58")))));
  };
  window.XingyueHealthUI = {
    HealthCalendar: HealthCalendar
  };
})();
