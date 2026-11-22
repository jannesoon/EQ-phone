"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
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
(function initXingyuePhoneAppearancePanel(global) {
  'use strict';

  var ReactRef = global.React;
  var THEME_OPTIONS = [{
    id: 'violet',
    label: '星月紫',
    hint: '温柔紫夜',
    color: '#241f50'
  }, {
    id: 'champagne',
    label: '香槟暖色',
    hint: '暖金晨光',
    color: '#eee2d5'
  }, {
    id: 'moonblue',
    label: '月光雾蓝',
    hint: '清透月色',
    color: '#d9e1f3'
  }, {
    id: 'obsidian',
    label: '曜石黑金',
    hint: '深夜静谧',
    color: '#171a22'
  }];
  var DEFAULT_SNAPSHOT = Object.freeze({
    themeId: 'violet',
    coverUrl: null,
    coverPosition: 50
  });
  function appearanceApi() {
    return global.XingyuePhoneAppearance || null;
  }
  function errorText(error) {
    return String((error === null || error === void 0 ? void 0 : error.message) || '本地外观处理失败，请稍后重试。');
  }
  function AppearancePanel() {
    var useCallback = ReactRef.useCallback,
      useEffect = ReactRef.useEffect,
      useState = ReactRef.useState;
    var api = appearanceApi();
    var _useState = useState(function () {
        var _api$getSnapshot;
        return (api === null || api === void 0 || (_api$getSnapshot = api.getSnapshot) === null || _api$getSnapshot === void 0 ? void 0 : _api$getSnapshot.call(api)) || DEFAULT_SNAPSHOT;
      }),
      _useState2 = _slicedToArray(_useState, 2),
      snapshot = _useState2[0],
      setSnapshot = _useState2[1];
    var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      busy = _useState4[0],
      setBusy = _useState4[1];
    var _useState5 = useState(''),
      _useState6 = _slicedToArray(_useState5, 2),
      message = _useState6[0],
      setMessage = _useState6[1];
    useEffect(function () {
      var _currentApi$init;
      var currentApi = appearanceApi();
      if (!currentApi) {
        setMessage('本地外观模块尚未加载，请刷新页面后重试。');
        return undefined;
      }
      var unsubscribe = currentApi.subscribe(function (next) {
        return setSnapshot(_objectSpread({}, next));
      });
      void ((_currentApi$init = currentApi.init) === null || _currentApi$init === void 0 ? void 0 : _currentApi$init.call(currentApi).then(function (next) {
        return next && setSnapshot(_objectSpread({}, next));
      })["catch"](function (error) {
        return setMessage(errorText(error));
      }));
      return unsubscribe;
    }, []);
    var chooseTheme = useCallback(function (themeId) {
      var _THEME_OPTIONS$find;
      var currentApi = appearanceApi();
      if (!currentApi) {
        setMessage('本地外观模块尚未加载，请刷新页面后重试。');
        return;
      }
      var next = currentApi.setTheme(themeId);
      setSnapshot(_objectSpread({}, next));
      setMessage((next === null || next === void 0 ? void 0 : next.error) || "\u5DF2\u5207\u6362\u4E3A".concat(((_THEME_OPTIONS$find = THEME_OPTIONS.find(function (item) {
        return item.id === themeId;
      })) === null || _THEME_OPTIONS$find === void 0 ? void 0 : _THEME_OPTIONS$find.label) || '新主题', "\u3002"));
    }, []);
    var saveCover = useCallback(/*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(file) {
        var currentApi, next;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              currentApi = appearanceApi();
              if (!(!currentApi || !file)) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return");
            case 3:
              setBusy(true);
              setMessage('正在处理封面，请稍候…');
              _context.prev = 5;
              _context.next = 8;
              return currentApi.setCover(file);
            case 8:
              next = _context.sent;
              setSnapshot(_objectSpread({}, next));
              if (next !== null && next !== void 0 && next.coverUrl) {
                _context.next = 12;
                break;
              }
              throw new Error('封面未能保存，请稍后重试。');
            case 12:
              setMessage('封面已保存到当前设备。');
              _context.next = 18;
              break;
            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](5);
              setMessage(errorText(_context.t0));
            case 18:
              _context.prev = 18;
              setBusy(false);
              return _context.finish(18);
            case 21:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[5, 15, 18, 21]]);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }(), []);
    var clearCover = useCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var currentApi, next;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            currentApi = appearanceApi();
            if (currentApi) {
              _context2.next = 4;
              break;
            }
            setMessage('本地外观模块尚未加载，请刷新页面后重试。');
            return _context2.abrupt("return");
          case 4:
            setBusy(true);
            setMessage('正在恢复默认封面…');
            _context2.prev = 6;
            _context2.next = 9;
            return currentApi.clearCover();
          case 9:
            next = _context2.sent;
            setSnapshot(_objectSpread({}, next));
            if (!(next !== null && next !== void 0 && next.coverUrl)) {
              _context2.next = 13;
              break;
            }
            throw new Error('默认封面恢复失败，请稍后重试。');
          case 13:
            setMessage('已恢复默认封面。');
            _context2.next = 19;
            break;
          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](6);
            setMessage(errorText(_context2.t0));
          case 19:
            _context2.prev = 19;
            setBusy(false);
            return _context2.finish(19);
          case 22:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[6, 16, 19, 22]]);
    })), []);
    var restoreDefaults = useCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var currentApi, themeSnapshot, positionSnapshot, preferenceError, next;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            currentApi = appearanceApi();
            if (currentApi) {
              _context3.next = 4;
              break;
            }
            setMessage('本地外观模块尚未加载，请刷新页面后重试。');
            return _context3.abrupt("return");
          case 4:
            setBusy(true);
            setMessage('正在恢复默认外观…');
            _context3.prev = 6;
            themeSnapshot = currentApi.setTheme('violet');
            positionSnapshot = currentApi.setCoverPosition(50);
            preferenceError = (themeSnapshot === null || themeSnapshot === void 0 ? void 0 : themeSnapshot.error) || (positionSnapshot === null || positionSnapshot === void 0 ? void 0 : positionSnapshot.error) || '';
            _context3.next = 12;
            return currentApi.clearCover();
          case 12:
            next = _context3.sent;
            setSnapshot(_objectSpread({}, next));
            if (!(next !== null && next !== void 0 && next.coverUrl || preferenceError || next !== null && next !== void 0 && next.error)) {
              _context3.next = 16;
              break;
            }
            throw new Error((next === null || next === void 0 ? void 0 : next.error) || preferenceError || '默认外观恢复失败，请稍后重试。');
          case 16:
            setMessage('已恢复默认外观。');
            _context3.next = 22;
            break;
          case 19:
            _context3.prev = 19;
            _context3.t0 = _context3["catch"](6);
            setMessage(errorText(_context3.t0));
          case 22:
            _context3.prev = 22;
            setBusy(false);
            return _context3.finish(22);
          case 25:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[6, 19, 22, 25]]);
    })), []);
    var updatePosition = function updatePosition(event) {
      var currentApi = appearanceApi();
      if (!currentApi) return;
      var next = currentApi.setCoverPosition(event.target.value);
      setSnapshot(_objectSpread({}, next));
      if (next !== null && next !== void 0 && next.error) setMessage(next.error);
    };
    var onFileChange = function onFileChange(event) {
      var _event$target$files;
      var file = ((_event$target$files = event.target.files) === null || _event$target$files === void 0 ? void 0 : _event$target$files[0]) || null;
      event.target.value = '';
      if (file) void saveCover(file);
    };
    return /*#__PURE__*/React.createElement("section", {
      className: "xy-phone-appearance-panel",
      "aria-label": "\u624B\u673A\u5916\u89C2\u4E0E\u5C01\u9762"
    }, /*#__PURE__*/React.createElement("div", {
      className: "xy-phone-appearance-heading"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "xy-phone-appearance-eyebrow"
    }, "PHONE APPEARANCE"), /*#__PURE__*/React.createElement("h3", null, "\u624B\u673A\u5916\u89C2"), /*#__PURE__*/React.createElement("p", null, "\u53EA\u5F71\u54CD\u8FD9\u53F0\u8BBE\u5907\uFF0C\u4E0D\u4F1A\u4FEE\u6539\u7535\u8111\u7AEF\u4E3B\u9898\u6216\u4E91\u7AEF\u8D44\u6599\u3002"))), /*#__PURE__*/React.createElement("fieldset", {
      className: "xy-phone-appearance-themes"
    }, /*#__PURE__*/React.createElement("legend", null, "\u9009\u62E9\u4E3B\u9898"), /*#__PURE__*/React.createElement("div", {
      className: "xy-phone-appearance-swatches"
    }, THEME_OPTIONS.map(function (option) {
      return /*#__PURE__*/React.createElement("label", {
        key: option.id,
        className: "xy-phone-appearance-swatch ".concat(snapshot.themeId === option.id ? 'is-selected' : '')
      }, /*#__PURE__*/React.createElement("input", {
        type: "radio",
        name: "xingyue-phone-theme",
        value: option.id,
        checked: snapshot.themeId === option.id,
        onChange: function onChange() {
          return chooseTheme(option.id);
        },
        disabled: busy
      }), /*#__PURE__*/React.createElement("span", {
        className: "xy-phone-appearance-swatch-dot",
        style: {
          backgroundColor: option.color
        },
        "aria-hidden": "true"
      }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, option.label), /*#__PURE__*/React.createElement("small", null, option.hint)));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "xy-phone-appearance-cover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "xy-phone-appearance-cover-heading"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "\u9996\u9875\u5C01\u9762"), /*#__PURE__*/React.createElement("p", null, "\u53EA\u66F4\u6362\u9996\u9875\u5927\u56FE\uFF0C\u4E0D\u6539\u53D8\u5934\u50CF\u548C\u804A\u5929\u80CC\u666F\uFF1B\u7167\u7247\u4FDD\u5B58\u5728\u5F53\u524D\u8BBE\u5907\u3002")), snapshot.coverUrl && /*#__PURE__*/React.createElement("span", {
      className: "xy-phone-appearance-cover-state"
    }, "\u5DF2\u8BBE\u7F6E")), snapshot.coverUrl ? /*#__PURE__*/React.createElement("div", {
      className: "xy-phone-appearance-cover-preview",
      style: {
        backgroundImage: "url(\"".concat(snapshot.coverUrl, "\")"),
        backgroundPosition: "center ".concat(snapshot.coverPosition, "%")
      },
      "aria-label": "\u5F53\u524D\u672C\u5730\u5C01\u9762\u9884\u89C8"
    }) : /*#__PURE__*/React.createElement("div", {
      className: "xy-phone-appearance-cover-empty"
    }, "\u5C1A\u672A\u8BBE\u7F6E\u81EA\u5B9A\u4E49\u5C01\u9762\uFF0C\u5C06\u4F7F\u7528\u9ED8\u8BA4\u5916\u89C2\u3002"), /*#__PURE__*/React.createElement("label", {
      className: "xy-phone-appearance-file-button"
    }, /*#__PURE__*/React.createElement("span", null, busy ? '正在处理…' : '选择本地图片'), /*#__PURE__*/React.createElement("input", {
      type: "file",
      accept: "image/jpeg,image/png,image/webp,image/gif",
      onChange: onFileChange,
      disabled: busy
    })), /*#__PURE__*/React.createElement("label", {
      className: "xy-phone-appearance-position"
    }, /*#__PURE__*/React.createElement("span", null, "\u5C01\u9762\u4F4D\u7F6E"), /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "0",
      max: "100",
      value: snapshot.coverPosition,
      onChange: updatePosition,
      disabled: busy || !snapshot.coverUrl
    }), /*#__PURE__*/React.createElement("output", null, snapshot.coverPosition, "%"))), /*#__PURE__*/React.createElement("div", {
      className: "xy-phone-appearance-actions"
    }, snapshot.coverUrl && /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return void clearCover();
      },
      disabled: busy
    }, "\u6062\u590D\u9ED8\u8BA4\u5C01\u9762"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return void restoreDefaults();
      },
      disabled: busy
    }, "\u6062\u590D\u9ED8\u8BA4\u5916\u89C2")), /*#__PURE__*/React.createElement("p", {
      className: "xy-phone-appearance-local-note"
    }, "\u5F53\u524D\u8BBE\u5907\u4FDD\u5B58\uFF1A\u56FE\u7247\u4F1A\u5148\u538B\u7F29\u540E\u5B58\u5165\u672C\u673A\uFF0C\u4E0D\u4F1A\u4E0A\u4F20\u5230\u4E91\u7AEF\u3002"), (snapshot.error || message) && /*#__PURE__*/React.createElement("p", {
      className: snapshot.error ? 'xy-phone-appearance-error' : 'xy-phone-appearance-status',
      role: snapshot.error ? 'alert' : undefined
    }, snapshot.error || message));
  }
  global.XingyuePhoneAppearancePanel = Object.freeze({
    AppearancePanel: AppearancePanel
  });
})(window);
