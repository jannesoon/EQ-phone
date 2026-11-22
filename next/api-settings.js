"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var _React = React,
    useState = _React.useState;
  var api = window.XingyueOpenAI;
  var ApiSettingsPanel = function ApiSettingsPanel(_ref) {
    var config = _ref.config,
      setConfig = _ref.setConfig,
      showToast = _ref.showToast,
      Icon = _ref.Icon;
    var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      currentPresetId = _useState2[0],
      setCurrentPresetId = _useState2[1];
    var _useState3 = useState(''),
      _useState4 = _slicedToArray(_useState3, 2),
      presetName = _useState4[0],
      setPresetName = _useState4[1];
    var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      isNamingPreset = _useState6[0],
      setIsNamingPreset = _useState6[1];
    var _useState7 = useState([]),
      _useState8 = _slicedToArray(_useState7, 2),
      availableModels = _useState8[0],
      setAvailableModels = _useState8[1];
    var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      isFetchingModels = _useState10[0],
      setIsFetchingModels = _useState10[1];
    var changeField = function changeField(field, value) {
      setConfig(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({
          apiType: 'openai'
        }, field, value));
      });
      setCurrentPresetId('');
    };
    var selectPreset = function selectPreset(event) {
      var presetId = event.target.value;
      setCurrentPresetId(presetId);
      var preset = (config.apiPresets || []).find(function (item) {
        return item.id === presetId;
      });
      if (preset) {
        setConfig(function (prev) {
          return api.applyPreset(prev, preset);
        });
        showToast("\u5DF2\u5207\u6362\u81F3\uFF1A".concat(preset.name));
      }
    };
    var saveNewPreset = function saveNewPreset() {
      if (!presetName.trim()) return showToast('预设名字不能为空哦');
      var preset = api.createPreset(presetName, config);
      setConfig(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          apiType: 'openai',
          apiPresets: [].concat(_toConsumableArray(prev.apiPresets || []), [preset])
        });
      });
      setCurrentPresetId(preset.id);
      setPresetName('');
      setIsNamingPreset(false);
      showToast('API 预设已保存在当前设备');
    };
    var updatePreset = function updatePreset() {
      setConfig(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          apiType: 'openai',
          apiPresets: (prev.apiPresets || []).map(function (preset) {
            return preset.id === currentPresetId ? _objectSpread(_objectSpread({}, preset), {}, {
              apiType: 'openai',
              baseUrl: api.normalizeBaseUrl(prev.baseUrl),
              apiKey: prev.apiKey,
              model: prev.model
            }) : preset;
          })
        });
      });
      showToast('API 预设已更新');
    };
    var deletePreset = function deletePreset() {
      setConfig(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          apiPresets: (prev.apiPresets || []).filter(function (preset) {
            return preset.id !== currentPresetId;
          })
        });
      });
      setCurrentPresetId('');
      showToast('API 预设已删除');
    };
    var testAndFetchModels = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var models;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              setIsFetchingModels(true);
              _context.prev = 1;
              _context.next = 4;
              return api.fetchModels(config);
            case 4:
              models = _context.sent;
              setAvailableModels(models);
              if (!models.includes(config.model)) setConfig(function (prev) {
                return _objectSpread(_objectSpread({}, prev), {}, {
                  model: models[0]
                });
              });
              showToast("\u8FDE\u63A5\u6210\u529F\uFF0C\u8BFB\u53D6\u5230 ".concat(models.length, " \u4E2A\u6A21\u578B"));
              _context.next = 14;
              break;
            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](1);
              setAvailableModels([]);
              showToast(_context.t0.message);
            case 14:
              _context.prev = 14;
              setIsFetchingModels(false);
              return _context.finish(14);
            case 17:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[1, 10, 14, 17]]);
      }));
      return function testAndFetchModels() {
        return _ref2.apply(this, arguments);
      };
    }();
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "text-xs font-bold text-gray-400 uppercase tracking-wider"
    }, "API \u9884\u8BBE\u7BA1\u7406"), /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, /*#__PURE__*/React.createElement("label", {
      className: "block text-[10px] text-gray-500 font-bold"
    }, "\u9009\u62E9\u6216\u5207\u6362\u9884\u8BBE"), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 items-center"
    }, isNamingPreset ? /*#__PURE__*/React.createElement("div", {
      className: "flex-1 flex gap-2"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      autoFocus: true,
      value: presetName,
      onChange: function onChange(e) {
        return setPresetName(e.target.value);
      },
      placeholder: "\u7ED9\u8FD9\u4E2A\u9884\u8BBE\u8D77\u4E2A\u540D\u5B57...",
      className: "flex-1 bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: saveNewPreset,
      className: "px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-blue-100"
    }, "\u786E\u8BA4"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return setIsNamingPreset(false);
      },
      className: "px-3 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-gray-100"
    }, "\u53D6\u6D88")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("select", {
      value: currentPresetId,
      onChange: selectPreset,
      className: "flex-1 bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none cursor-pointer"
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "\u5F53\u524D\u914D\u7F6E\uFF08\u672A\u4FDD\u5B58\uFF09"), (config.apiPresets || []).map(function (preset) {
      return /*#__PURE__*/React.createElement("option", {
        key: preset.id,
        value: preset.id
      }, preset.name);
    })), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return currentPresetId ? updatePreset() : setIsNamingPreset(true);
      },
      className: "px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors whitespace-nowrap font-medium"
    }, currentPresetId ? '更新' : '保存'), currentPresetId && /*#__PURE__*/React.createElement("button", {
      onClick: deletePreset,
      className: "px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm transition-colors whitespace-nowrap font-medium"
    }, "\u5220\u9664"))))), /*#__PURE__*/React.createElement("div", {
      className: "border-t border-gray-100 pt-4 space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between gap-3"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "text-xs font-bold text-gray-400 uppercase tracking-wider"
    }, "OpenAI \u517C\u5BB9 API"), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100"
    }, "\u4EC5\u4FDD\u5B58\u5728\u5F53\u524D\u8BBE\u5907")), /*#__PURE__*/React.createElement("div", {
      className: "bg-gray-100 text-gray-500 text-[10px] p-2.5 rounded-lg border border-gray-200/50"
    }, "\u56FE\u7247\u6D88\u606F\u9700\u8981\u6240\u9009\u6A21\u578B\u672C\u8EAB\u652F\u6301\u89C6\u89C9\u7406\u89E3\u3002"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "block text-[10px] text-gray-500 font-bold mb-1"
    }, "API Base URL\uFF08\u901A\u5E38\u4EE5 /v1 \u7ED3\u5C3E\uFF09"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: config.baseUrl,
      onChange: function onChange(e) {
        return changeField('baseUrl', e.target.value);
      },
      className: "w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none",
      placeholder: "\u4F8B\u5982\uFF1Ahttps://api.openai.com/v1"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "block text-[10px] text-gray-500 font-bold mb-1"
    }, "API Key"), /*#__PURE__*/React.createElement("input", {
      type: "password",
      value: config.apiKey,
      onChange: function onChange(e) {
        return changeField('apiKey', e.target.value);
      },
      className: "w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none",
      placeholder: "\u53EA\u4FDD\u5B58\u5728\u8FD9\u53F0\u8BBE\u5907"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      className: "block text-[10px] text-gray-500 font-bold mb-1"
    }, "\u6A21\u578B"), availableModels.length > 0 ? /*#__PURE__*/React.createElement("select", {
      value: config.model,
      onChange: function onChange(e) {
        return changeField('model', e.target.value);
      },
      className: "w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none"
    }, availableModels.map(function (model) {
      return /*#__PURE__*/React.createElement("option", {
        key: model,
        value: model
      }, model);
    })) : /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: config.model,
      onChange: function onChange(e) {
        return changeField('model', e.target.value);
      },
      className: "w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none",
      placeholder: "\u586B\u5199\u670D\u52A1\u5546\u63D0\u4F9B\u7684\u6A21\u578B\u540D"
    })), /*#__PURE__*/React.createElement("button", {
      onClick: testAndFetchModels,
      disabled: isFetchingModels,
      className: "w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "RefreshCw",
      size: 16,
      className: isFetchingModels ? 'animate-spin' : ''
    }), isFetchingModels ? '正在测试...' : '测试连接并读取模型')));
  };
  window.XingyueApiSettings = {
    ApiSettingsPanel: ApiSettingsPanel
  };
})();
