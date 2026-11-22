"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function initMemoryOverviewPanel(global) {
  'use strict';

  var _React = React,
    useEffect = _React.useEffect,
    useMemo = _React.useMemo,
    useState = _React.useState;
  var timeLabel = function timeLabel(value) {
    return value ? new Date(value).toLocaleString('zh-CN') : '—';
  };
  function MemoryOverviewPanel() {
    var _global$xingyueDeskto, _state$identity, _state$memory, _state$memory2, _state$memory3;
    var desktop = typeof ((_global$xingyueDeskto = global.xingyueDesktop) === null || _global$xingyueDeskto === void 0 ? void 0 : _global$xingyueDeskto.requestLocalAgent) === 'function';
    var clients = useMemo(function () {
      var _global$XingyueAgentC, _global$XingyueAgentC2, _global$XingyueAgentC3, _global$XingyueAgentC4, _global$XingyueAgentC5, _global$XingyueAgentC6;
      return {
        identity: (_global$XingyueAgentC = global.XingyueAgentClient) === null || _global$XingyueAgentC === void 0 || (_global$XingyueAgentC2 = _global$XingyueAgentC.createIdentityCoreClient) === null || _global$XingyueAgentC2 === void 0 ? void 0 : _global$XingyueAgentC2.call(_global$XingyueAgentC),
        memory: (_global$XingyueAgentC3 = global.XingyueAgentClient) === null || _global$XingyueAgentC3 === void 0 || (_global$XingyueAgentC4 = _global$XingyueAgentC3.createMemoryGovernanceClient) === null || _global$XingyueAgentC4 === void 0 ? void 0 : _global$XingyueAgentC4.call(_global$XingyueAgentC3),
        windows: (_global$XingyueAgentC5 = global.XingyueAgentClient) === null || _global$XingyueAgentC5 === void 0 || (_global$XingyueAgentC6 = _global$XingyueAgentC5.createSessionCheckpointClient) === null || _global$XingyueAgentC6 === void 0 ? void 0 : _global$XingyueAgentC6.call(_global$XingyueAgentC5)
      };
    }, []);
    var _useState = useState({
        identity: null,
        memory: null,
        windowLogs: [],
        loading: true,
        error: ''
      }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];
    var load = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _yield$Promise$all, _yield$Promise$all2, identity, memory, _windowLogs;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (desktop) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return");
            case 2:
              setState(function (value) {
                return _objectSpread(_objectSpread({}, value), {}, {
                  loading: true,
                  error: ''
                });
              });
              _context.prev = 3;
              _context.next = 6;
              return Promise.all([clients.identity.read(), clients.memory.read(), clients.windows.readConfirmedWindowLogs()]);
            case 6:
              _yield$Promise$all = _context.sent;
              _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 3);
              identity = _yield$Promise$all2[0];
              memory = _yield$Promise$all2[1];
              _windowLogs = _yield$Promise$all2[2];
              setState({
                identity: identity,
                memory: memory,
                windowLogs: _windowLogs,
                loading: false,
                error: ''
              });
              _context.next = 17;
              break;
            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](3);
              setState(function (value) {
                return _objectSpread(_objectSpread({}, value), {}, {
                  loading: false,
                  error: (_context.t0 === null || _context.t0 === void 0 ? void 0 : _context.t0.message) || '无法读取当前生效内容'
                });
              });
            case 17:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[3, 14]]);
      }));
      return function load() {
        return _ref.apply(this, arguments);
      };
    }();
    useEffect(function () {
      load();
    }, []);
    if (!desktop) return null;
    var active = (_state$identity = state.identity) === null || _state$identity === void 0 ? void 0 : _state$identity.active;
    var confirmed = (((_state$memory = state.memory) === null || _state$memory === void 0 ? void 0 : _state$memory.records) || []).filter(function (record) {
      return record.confirmationState === 'confirmed' && record.activation !== 'active';
    });
    var windowLogs = _toConsumableArray(state.windowLogs).sort(function (left, right) {
      var rightTime = Date.parse((right === null || right === void 0 ? void 0 : right.confirmedAt) || (right === null || right === void 0 ? void 0 : right.createdAt) || '') || 0;
      var leftTime = Date.parse((left === null || left === void 0 ? void 0 : left.confirmedAt) || (left === null || left === void 0 ? void 0 : left.createdAt) || '') || 0;
      return rightTime - leftTime;
    });
    return /*#__PURE__*/React.createElement("section", {
      className: "rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4 shadow-sm space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "text-sm font-semibold text-gray-900"
    }, "\u5F53\u524D\u751F\u6548\u7684\u8EAB\u4EFD\u4E0E\u8BB0\u5FC6"), /*#__PURE__*/React.createElement("p", {
      className: "mt-1 text-[10px] text-emerald-700"
    }, "\u8FD9\u91CC\u8D1F\u8D23\u67E5\u770B\uFF1B\u7248\u672C\u7F16\u8F91\u3001\u5019\u9009\u786E\u8BA4\u548C\u5386\u53F2\u56DE\u9000\u6536\u8FDB\u4E0B\u65B9\u7BA1\u7406\u533A\u3002")), /*#__PURE__*/React.createElement("button", {
      onClick: load,
      disabled: state.loading,
      className: "rounded-lg bg-white px-3 py-1.5 text-[10px] text-emerald-700 border border-emerald-100 disabled:opacity-50"
    }, "\u5237\u65B0")), state.error && /*#__PURE__*/React.createElement("div", {
      className: "rounded-lg border border-red-100 bg-red-50 p-2 text-xs text-red-600"
    }, state.error), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 md:grid-cols-4 gap-2 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-white bg-white/80 p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-base font-semibold text-purple-700"
    }, "v", (active === null || active === void 0 ? void 0 : active.version) || '—'), /*#__PURE__*/React.createElement("div", {
      className: "text-[9px] text-gray-500"
    }, "\u5F53\u524D\u6B63\u5F0F PP")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-white bg-white/80 p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-base font-semibold text-emerald-700"
    }, (_state$memory2 = state.memory) !== null && _state$memory2 !== void 0 && _state$memory2.activePayload ? 1 : 0), /*#__PURE__*/React.createElement("div", {
      className: "text-[9px] text-gray-500"
    }, "\u5E38\u9A7B\u6D3B\u8DC3\u6458\u8981")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-white bg-white/80 p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-base font-semibold text-sky-700"
    }, confirmed.length), /*#__PURE__*/React.createElement("div", {
      className: "text-[9px] text-gray-500"
    }, "\u5DF2\u786E\u8BA4\u6309\u9700\u8BB0\u5FC6")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-white bg-white/80 p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-base font-semibold text-indigo-700"
    }, windowLogs.length), /*#__PURE__*/React.createElement("div", {
      className: "text-[9px] text-gray-500"
    }, "\u5DF2\u786E\u8BA4\u7A97\u53E3\u65E5\u5FD7"))), active && /*#__PURE__*/React.createElement("details", {
      className: "rounded-xl border border-purple-100 bg-white/80 p-3"
    }, /*#__PURE__*/React.createElement("summary", {
      className: "cursor-pointer text-xs font-medium text-purple-800"
    }, "\u67E5\u770B\u6B63\u5F0F PP v", active.version, " \xB7 ", timeLabel(active.confirmedAt)), /*#__PURE__*/React.createElement("pre", {
      className: "mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-[10px] leading-5 text-gray-600 font-sans"
    }, active.body)), ((_state$memory3 = state.memory) === null || _state$memory3 === void 0 ? void 0 : _state$memory3.activePayload) && /*#__PURE__*/React.createElement("details", {
      className: "rounded-xl border border-emerald-100 bg-white/80 p-3"
    }, /*#__PURE__*/React.createElement("summary", {
      className: "cursor-pointer text-xs font-medium text-emerald-800"
    }, "\u67E5\u770B\u6BCF\u8F6E\u5E38\u9A7B\u7684\u6700\u5C0F\u6D3B\u8DC3\u6458\u8981"), /*#__PURE__*/React.createElement("pre", {
      className: "mt-3 max-h-72 overflow-auto whitespace-pre-wrap text-[10px] leading-5 text-gray-600 font-sans"
    }, state.memory.activePayload)), (confirmed.length > 0 || windowLogs.length > 0) && /*#__PURE__*/React.createElement("details", {
      className: "rounded-xl border border-sky-100 bg-white/80 p-3"
    }, /*#__PURE__*/React.createElement("summary", {
      className: "cursor-pointer text-xs font-medium text-sky-800"
    }, "\u67E5\u770B\u5DF2\u786E\u8BA4\u7684\u6309\u9700\u5185\u5BB9"), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 grid gap-3 md:grid-cols-2"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "mb-2 text-[10px] font-semibold text-gray-500"
    }, "\u6309\u9700\u8BB0\u5FC6"), confirmed.map(function (record) {
      return /*#__PURE__*/React.createElement("div", {
        key: record.recordId,
        className: "mb-1 rounded-lg bg-gray-50 p-2 text-[10px] text-gray-600"
      }, record.title);
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "mb-2 text-[10px] font-semibold text-gray-500"
    }, "\u7A97\u53E3\u65E5\u5FD7 \xB7 \u6309\u786E\u8BA4\u65F6\u95F4\u4ECE\u65B0\u5230\u65E7"), windowLogs.map(function (log) {
      var _log$content, _log$content2, _log$content3;
      return /*#__PURE__*/React.createElement("div", {
        key: ((_log$content = log.content) === null || _log$content === void 0 ? void 0 : _log$content.sessionId) || log.recordId || log.id,
        className: "mb-1 rounded-lg bg-gray-50 p-2"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-[10px] font-medium text-gray-700"
      }, ((_log$content2 = log.content) === null || _log$content2 === void 0 ? void 0 : _log$content2.sessionTitle) || log.sessionTitle || ((_log$content3 = log.content) === null || _log$content3 === void 0 ? void 0 : _log$content3.sessionId) || '未命名窗口日志'), /*#__PURE__*/React.createElement("div", {
        className: "mt-0.5 text-[9px] text-gray-400"
      }, "\u786E\u8BA4\u4E8E ", timeLabel(log.confirmedAt || log.createdAt)));
    })))));
  }
  global.XingyueMemoryOverviewPanel = MemoryOverviewPanel;
})(window);
