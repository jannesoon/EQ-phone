"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function initIdentityCorePanel(global) {
  'use strict';

  var ReactRef = global.React;
  if (!ReactRef) return;
  var useEffect = ReactRef.useEffect,
    useMemo = ReactRef.useMemo,
    useState = ReactRef.useState;
  var shortHash = function shortHash(value) {
    return value ? "".concat(value.slice(0, 12), "\u2026").concat(value.slice(-8)) : '—';
  };
  var stateLabel = function stateLabel(value) {
    return {
      confirmed: '已共同确认',
      candidate: '候选待确认',
      superseded: '已被后续正式版本替代'
    }[value] || value || '未知';
  };
  var replicaLabel = function replicaLabel(value) {
    return {
      'in-sync': '已同步',
      'out-of-sync': '版本不一致',
      'not-synced': '尚未建立副本',
      'waiting-for-active-version': '等待正式版本'
    }[value] || value || '未知';
  };
  var timeLabel = function timeLabel(value) {
    return value ? new Date(value).toLocaleString('zh-CN') : '—';
  };
  function IdentityCorePanel(_ref) {
    var _global$xingyueDeskto;
    var _ref$showToast = _ref.showToast,
      showToast = _ref$showToast === void 0 ? function () {} : _ref$showToast,
      _ref$cloudRepository = _ref.cloudRepository,
      cloudRepository = _ref$cloudRepository === void 0 ? null : _ref$cloudRepository;
    var isDesktop = Boolean((_global$xingyueDeskto = global.xingyueDesktop) === null || _global$xingyueDeskto === void 0 ? void 0 : _global$xingyueDeskto.isDesktop);
    var client = useMemo(function () {
      var _global$XingyueAgentC, _global$XingyueAgentC2;
      return (_global$XingyueAgentC = global.XingyueAgentClient) === null || _global$XingyueAgentC === void 0 || (_global$XingyueAgentC2 = _global$XingyueAgentC.createIdentityCoreClient) === null || _global$XingyueAgentC2 === void 0 ? void 0 : _global$XingyueAgentC2.call(_global$XingyueAgentC);
    }, []);
    var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      identity = _useState2[0],
      setIdentity = _useState2[1];
    var _useState3 = useState(true),
      _useState4 = _slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];
    var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      busy = _useState6[0],
      setBusy = _useState6[1];
    var _useState7 = useState(''),
      _useState8 = _slicedToArray(_useState7, 2),
      error = _useState8[0],
      setError = _useState8[1];
    var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      editing = _useState10[0],
      setEditing = _useState10[1];
    var _useState11 = useState(''),
      _useState12 = _slicedToArray(_useState11, 2),
      draft = _useState12[0],
      setDraft = _useState12[1];
    var _useState13 = useState(''),
      _useState14 = _slicedToArray(_useState13, 2),
      changeNote = _useState14[0],
      setChangeNote = _useState14[1];
    var _useState15 = useState(''),
      _useState16 = _slicedToArray(_useState15, 2),
      leftVersion = _useState16[0],
      setLeftVersion = _useState16[1];
    var _useState17 = useState(''),
      _useState18 = _slicedToArray(_useState17, 2),
      rightVersion = _useState18[0],
      setRightVersion = _useState18[1];
    var _useState19 = useState(function () {
        try {
          var _global$localStorage;
          return JSON.parse(((_global$localStorage = global.localStorage) === null || _global$localStorage === void 0 ? void 0 : _global$localStorage.getItem('xingyue_identity_core_summary')) || 'null');
        } catch (_) {
          return null;
        }
      }),
      _useState20 = _slicedToArray(_useState19, 2),
      deviceSummary = _useState20[0],
      setDeviceSummary = _useState20[1];
    var _useState21 = useState(!isDesktop),
      _useState22 = _slicedToArray(_useState21, 2),
      deviceLoading = _useState22[0],
      setDeviceLoading = _useState22[1];
    var load = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _value$pendingCandida, _value$active, value, versions;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!(!client || !isDesktop)) {
                _context.next = 3;
                break;
              }
              setLoading(false);
              return _context.abrupt("return");
            case 3:
              setLoading(true);
              setError('');
              _context.prev = 5;
              _context.next = 8;
              return client.read();
            case 8:
              value = _context.sent;
              setIdentity(value);
              setDraft(((_value$pendingCandida = value.pendingCandidate) === null || _value$pendingCandida === void 0 ? void 0 : _value$pendingCandida.body) || ((_value$active = value.active) === null || _value$active === void 0 ? void 0 : _value$active.body) || '');
              versions = value.history || [];
              setLeftVersion(function (current) {
                var _versions$, _versions$2;
                return current || String(((_versions$ = versions[1]) === null || _versions$ === void 0 ? void 0 : _versions$.version) || ((_versions$2 = versions[0]) === null || _versions$2 === void 0 ? void 0 : _versions$2.version) || '');
              });
              setRightVersion(function (current) {
                var _versions$3;
                return current || String(((_versions$3 = versions[0]) === null || _versions$3 === void 0 ? void 0 : _versions$3.version) || '');
              });
              _context.next = 19;
              break;
            case 16:
              _context.prev = 16;
              _context.t0 = _context["catch"](5);
              setError((_context.t0 === null || _context.t0 === void 0 ? void 0 : _context.t0.message) || '无法读取身份核心');
            case 19:
              _context.prev = 19;
              setLoading(false);
              return _context.finish(19);
            case 22:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[5, 16, 19, 22]]);
      }));
      return function load() {
        return _ref2.apply(this, arguments);
      };
    }();
    useEffect(function () {
      load();
    }, []);
    useEffect(function () {
      var _global$XingyueAgentC3;
      if (isDesktop || !((_global$XingyueAgentC3 = global.XingyueAgentClient) !== null && _global$XingyueAgentC3 !== void 0 && _global$XingyueAgentC3.createDeviceClient)) return;
      var cancelled = false;
      var read = /*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
          var data, _global$localStorage2;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                setDeviceLoading(true);
                _context2.prev = 1;
                _context2.next = 4;
                return global.XingyueAgentClient.createDeviceClient().readHostData();
              case 4:
                data = _context2.sent;
                if (!cancelled && data.identityCore) {
                  setDeviceSummary(data.identityCore);
                  try {
                    (_global$localStorage2 = global.localStorage) === null || _global$localStorage2 === void 0 || _global$localStorage2.setItem('xingyue_identity_core_summary', JSON.stringify(data.identityCore));
                  } catch (_) {}
                }
                _context2.next = 10;
                break;
              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](1);
              case 10:
                _context2.prev = 10;
                if (!cancelled) setDeviceLoading(false);
                return _context2.finish(10);
              case 13:
              case "end":
                return _context2.stop();
            }
          }, _callee2, null, [[1, 8, 10, 13]]);
        }));
        return function read() {
          return _ref3.apply(this, arguments);
        };
      }();
      read();
      return function () {
        cancelled = true;
      };
    }, [isDesktop]);
    var apply = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(action, success) {
        var _value$pendingCandida2, _value$active2, value;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              setBusy(true);
              setError('');
              _context3.prev = 2;
              _context3.next = 5;
              return action();
            case 5:
              value = _context3.sent;
              setIdentity(value);
              setDraft(((_value$pendingCandida2 = value.pendingCandidate) === null || _value$pendingCandida2 === void 0 ? void 0 : _value$pendingCandida2.body) || ((_value$active2 = value.active) === null || _value$active2 === void 0 ? void 0 : _value$active2.body) || '');
              setEditing(false);
              showToast(success);
              global.dispatchEvent(new CustomEvent('xingyue:identity-core-updated', {
                detail: value
              }));
              _context3.next = 16;
              break;
            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](2);
              setError((_context3.t0 === null || _context3.t0 === void 0 ? void 0 : _context3.t0.message) || '身份核心操作失败');
            case 16:
              _context3.prev = 16;
              setBusy(false);
              return _context3.finish(16);
            case 19:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[2, 13, 16, 19]]);
      }));
      return function apply(_x, _x2) {
        return _ref4.apply(this, arguments);
      };
    }();
    var createCandidate = function createCandidate() {
      if (!draft.trim()) {
        setError('身份核心正文不能为空');
        return;
      }
      apply(function () {
        return client.createCandidate(draft, changeNote || '电脑端生成候选版本');
      }, '已生成候选版本，正式版本未改变');
    };
    var confirmCandidate = function confirmCandidate() {
      var candidate = identity === null || identity === void 0 ? void 0 : identity.pendingCandidate;
      if (!candidate) return;
      var accepted = global.confirm("\u786E\u8BA4\u628A\u5019\u9009 v".concat(candidate.version, " \u5EFA\u7ACB\u4E3A\u65B0\u7684\u6B63\u5F0F\u8EAB\u4EFD\u6838\u5FC3\u5417\uFF1F\n\n\u8FD9\u4F1A\u751F\u6210\u65B0\u7684\u786E\u8BA4\u7248\u672C\uFF0C\u65E7\u7248\u672C\u4ECD\u5B8C\u6574\u4FDD\u7559\u3002"));
      if (!accepted) return;
      apply(function () {
        return client.confirm(candidate.version, '柒柒与逸辰在电脑端共同确认');
      }, '新的正式身份核心已确认并激活');
    };
    var rollback = function rollback(version) {
      var _identity$history;
      var record = identity === null || identity === void 0 || (_identity$history = identity.history) === null || _identity$history === void 0 ? void 0 : _identity$history.find(function (item) {
        return item.version === version;
      });
      if (!record || record.confirmationState !== 'confirmed') return;
      var reason = global.prompt("\u56DE\u9000\u4E0D\u4F1A\u5220\u9664\u5F53\u524D\u7248\u672C\uFF0C\u800C\u662F\u7528 v".concat(version, " \u7684\u6B63\u6587\u751F\u6210\u4E00\u4E2A\u65B0\u7684\u6B63\u5F0F\u7248\u672C\u3002\n\u8BF7\u5199\u4E00\u53E5\u56DE\u9000\u539F\u56E0\uFF1A"), "\u5171\u540C\u786E\u8BA4\u6062\u590D v".concat(version));
      if (reason === null) return;
      apply(function () {
        return client.rollback(version, reason || "\u5171\u540C\u786E\u8BA4\u6062\u590D v".concat(version));
      }, "\u5DF2\u4ECE v".concat(version, " \u751F\u6210\u65B0\u7684\u6B63\u5F0F\u7248\u672C"));
    };
    var syncCloudReplica = /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        var activeRecord, existing, sameRecord, conflict, matched, written, value;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!(!cloudRepository || !(identity !== null && identity !== void 0 && identity.active))) {
                _context4.next = 3;
                break;
              }
              setError('请先在云书房完成连接，再同步身份核心副本');
              return _context4.abrupt("return");
            case 3:
              setBusy(true);
              setError('');
              _context4.prev = 5;
              activeRecord = identity.active;
              _context4.next = 9;
              return cloudRepository.fetchEntries('pp', {
                columns: 'id, title, metadata, created_at'
              });
            case 9:
              existing = _context4.sent;
              if (existing.ok) {
                _context4.next = 12;
                break;
              }
              throw new Error(existing.error || '无法核对云书房副本');
            case 12:
              sameRecord = (existing.data || []).filter(function (entry) {
                var _entry$metadata;
                return ((_entry$metadata = entry.metadata) === null || _entry$metadata === void 0 ? void 0 : _entry$metadata.identityCoreRecordId) === identity.recordId;
              });
              conflict = sameRecord.find(function (entry) {
                var _entry$metadata2, _entry$metadata3;
                return Number((_entry$metadata2 = entry.metadata) === null || _entry$metadata2 === void 0 ? void 0 : _entry$metadata2.version) === activeRecord.version && ((_entry$metadata3 = entry.metadata) === null || _entry$metadata3 === void 0 ? void 0 : _entry$metadata3.contentHash) !== activeRecord.contentHash;
              });
              if (!conflict) {
                _context4.next = 16;
                break;
              }
              throw new Error("\u4E91\u4E66\u623F\u5DF2\u6709 v".concat(activeRecord.version, " \u7684\u4E0D\u540C\u54C8\u5E0C\uFF0C\u5DF2\u4FDD\u7559\u51B2\u7A81\uFF0C\u4E0D\u80FD\u7528\u65F6\u95F4\u6233\u8986\u76D6"));
            case 16:
              matched = sameRecord.find(function (entry) {
                var _entry$metadata4, _entry$metadata5;
                return Number((_entry$metadata4 = entry.metadata) === null || _entry$metadata4 === void 0 ? void 0 : _entry$metadata4.version) === activeRecord.version && ((_entry$metadata5 = entry.metadata) === null || _entry$metadata5 === void 0 ? void 0 : _entry$metadata5.contentHash) === activeRecord.contentHash;
              });
              if (matched) {
                _context4.next = 23;
                break;
              }
              _context4.next = 20;
              return cloudRepository.addEntry({
                shelf_type: 'pp',
                title: "\u8EAB\u4EFD\u6838\u5FC3\u53EA\u8BFB\u526F\u672C\uFF5C".concat(identity.recordId, "\uFF5Cv").concat(activeRecord.version),
                content: activeRecord.body,
                author: 'Ethan.desktop',
                source: 'desktop-step8-identity-replica',
                metadata: {
                  artifactType: 'identity-core-replica',
                  authority: 'host',
                  readOnlyReplica: true,
                  identityCoreRecordId: identity.recordId,
                  version: activeRecord.version,
                  contentHash: activeRecord.contentHash,
                  confirmedAt: activeRecord.confirmedAt
                }
              });
            case 20:
              written = _context4.sent;
              if (written.ok) {
                _context4.next = 23;
                break;
              }
              throw new Error(written.error || '云书房副本写入失败');
            case 23:
              _context4.next = 25;
              return client.reportReplica('cloudLibrary', activeRecord.version, activeRecord.contentHash);
            case 25:
              value = _context4.sent;
              setIdentity(value);
              showToast(matched ? '云书房已有同版本副本，哈希核对一致' : '当前正式身份核心已同步到云书房');
              _context4.next = 33;
              break;
            case 30:
              _context4.prev = 30;
              _context4.t0 = _context4["catch"](5);
              setError((_context4.t0 === null || _context4.t0 === void 0 ? void 0 : _context4.t0.message) || '云书房副本同步失败');
            case 33:
              _context4.prev = 33;
              setBusy(false);
              return _context4.finish(33);
            case 36:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[5, 30, 33, 36]]);
      }));
      return function syncCloudReplica() {
        return _ref5.apply(this, arguments);
      };
    }();
    if (!isDesktop) {
      return /*#__PURE__*/React.createElement("section", {
        className: "rounded-xl border border-purple-200 bg-purple-50/70 p-4"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center justify-between gap-2"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-sm font-semibold text-purple-900"
      }, "\u8EAB\u4EFD\u6838\u5FC3 \xB7 \u624B\u673A\u53EA\u8BFB"), /*#__PURE__*/React.createElement("span", {
        className: "rounded-full bg-white px-2 py-1 text-[10px] text-purple-600"
      }, deviceLoading ? '正在核对主机' : deviceSummary ? '已保存只读摘要' : '尚未同步')), deviceSummary ? /*#__PURE__*/React.createElement("div", {
        className: "mt-3 space-y-2 rounded-xl border border-purple-100 bg-white/80 p-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "break-all text-xs font-medium text-gray-800"
      }, deviceSummary.recordId), /*#__PURE__*/React.createElement("div", {
        className: "text-[10px] text-gray-500"
      }, "v", deviceSummary.version, " \xB7 ", shortHash(deviceSummary.contentHash), " \xB7 ", timeLabel(deviceSummary.confirmedAt)), /*#__PURE__*/React.createElement("p", {
        className: "text-xs leading-5 text-gray-600"
      }, deviceSummary.summary), /*#__PURE__*/React.createElement("p", {
        className: "line-clamp-4 text-[11px] leading-5 text-gray-500"
      }, deviceSummary.excerpt)) : /*#__PURE__*/React.createElement("p", {
        className: "mt-2 text-xs leading-5 text-purple-600"
      }, "\u8FDE\u63A5\u4E3B\u673A\u5E76\u5B8C\u6210\u8BBE\u5907\u914D\u5BF9\u540E\uFF0C\u8FD9\u91CC\u53EA\u4FDD\u5B58\u5F53\u524D\u6B63\u5F0F\u7248\u672C\u7684\u7F16\u53F7\u3001\u6458\u8981\u548C\u54C8\u5E0C\u3002"), /*#__PURE__*/React.createElement("p", {
        className: "mt-2 text-[10px] leading-5 text-purple-500"
      }, "\u7F16\u8F91\u3001\u5171\u540C\u786E\u8BA4\u3001\u56DE\u9000\u548C\u4E91\u526F\u672C\u540C\u6B65\u53EA\u5728\u7535\u8111\u661F\u6708\u8231\u64CD\u4F5C\u53F0\u5F00\u653E\u3002"));
    }
    if (loading) return /*#__PURE__*/React.createElement("section", {
      className: "rounded-xl border border-purple-200 bg-white/70 p-4 text-xs text-purple-500"
    }, "\u6B63\u5728\u4ECE\u4E3B\u673A\u8BFB\u53D6\u8EAB\u4EFD\u6838\u5FC3\u2026");
    if (!identity) return /*#__PURE__*/React.createElement("section", {
      className: "rounded-xl border border-red-200 bg-red-50 p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-semibold text-red-700"
    }, "\u8EAB\u4EFD\u6838\u5FC3\u6682\u4E0D\u53EF\u7528"), /*#__PURE__*/React.createElement("p", {
      className: "mt-1 text-xs text-red-600"
    }, error || '本地主机没有返回身份核心。'), /*#__PURE__*/React.createElement("button", {
      onClick: load,
      className: "mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white"
    }, "\u91CD\u65B0\u8BFB\u53D6"));
    var active = identity.active;
    var pending = identity.pendingCandidate;
    var history = identity.history || [];
    var left = history.find(function (item) {
      return String(item.version) === leftVersion;
    });
    var right = history.find(function (item) {
      return String(item.version) === rightVersion;
    });
    var confirmedHistory = history.filter(function (item) {
      return item.confirmationState === 'confirmed' && item.version !== identity.activeVersion;
    });
    return /*#__PURE__*/React.createElement("section", {
      className: "rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-start justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rounded-lg bg-purple-600 px-2 py-1 text-[10px] font-semibold text-white"
    }, "\u4E3B\u673A\u6743\u5A01"), /*#__PURE__*/React.createElement("h3", {
      className: "text-sm font-semibold text-gray-900"
    }, "\u8EAB\u4EFD\u6838\u5FC3")), /*#__PURE__*/React.createElement("p", {
      className: "mt-1 text-[11px] leading-5 text-gray-500"
    }, "\u552F\u4E00\u56FA\u5B9A ID\uFF1B\u7F16\u8F91\u5148\u751F\u6210\u5019\u9009\uFF0C\u53EA\u6709\u5171\u540C\u786E\u8BA4\u540E\u624D\u4F1A\u66FF\u6362\u5F53\u524D\u6B63\u5F0F\u7248\u672C\u3002")), /*#__PURE__*/React.createElement("button", {
      onClick: load,
      disabled: busy,
      className: "rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-[11px] text-purple-700 disabled:opacity-50"
    }, "\u5237\u65B0\u72B6\u6001")), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 grid gap-2 md:grid-cols-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-purple-100 bg-white/80 p-3 md:col-span-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-gray-400"
    }, "\u56FA\u5B9A\u8EAB\u4EFD ID"), /*#__PURE__*/React.createElement("div", {
      className: "mt-1 break-all text-xs font-medium text-gray-800"
    }, identity.recordId)), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-purple-100 bg-white/80 p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-gray-400"
    }, "\u5F53\u524D\u6B63\u5F0F\u7248\u672C"), /*#__PURE__*/React.createElement("div", {
      className: "mt-1 text-xs font-semibold text-purple-700"
    }, "v", (active === null || active === void 0 ? void 0 : active.version) || '—', " \xB7 ", stateLabel(active === null || active === void 0 ? void 0 : active.confirmationState))), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-purple-100 bg-white/80 p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-gray-400"
    }, "\u6B63\u6587 SHA-256"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        var _navigator$clipboard;
        return (active === null || active === void 0 ? void 0 : active.contentHash) && ((_navigator$clipboard = navigator.clipboard) === null || _navigator$clipboard === void 0 ? void 0 : _navigator$clipboard.writeText(active.contentHash));
      },
      className: "mt-1 break-all text-left font-mono text-[10px] text-gray-700",
      title: (active === null || active === void 0 ? void 0 : active.contentHash) || ''
    }, shortHash(active === null || active === void 0 ? void 0 : active.contentHash)))), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 grid gap-2 md:grid-cols-2"
    }, [identity.replicas.cloudLibrary, identity.replicas.device].map(function (replica) {
      return /*#__PURE__*/React.createElement("div", {
        key: replica.kind,
        className: "flex items-center justify-between rounded-xl border border-gray-100 bg-white/70 p-3"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "text-xs font-medium text-gray-700"
      }, replica.label), /*#__PURE__*/React.createElement("div", {
        className: "mt-0.5 text-[10px] text-gray-400"
      }, replica.version ? "v".concat(replica.version, " \xB7 ").concat(shortHash(replica.contentHash)) : '尚未报告副本')), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2"
      }, replica.kind === 'cloud-library' && replica.status !== 'in-sync' && /*#__PURE__*/React.createElement("button", {
        onClick: syncCloudReplica,
        disabled: busy,
        className: "rounded-lg border border-purple-200 bg-white px-2 py-1 text-[10px] text-purple-700 disabled:opacity-50"
      }, "\u540C\u6B65\u6B63\u5F0F\u7248\u672C"), /*#__PURE__*/React.createElement("span", {
        className: "rounded-full px-2 py-1 text-[10px] ".concat(replica.status === 'in-sync' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')
      }, replicaLabel(replica.status))));
    })), error && /*#__PURE__*/React.createElement("div", {
      className: "mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
    }, error), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 rounded-xl border border-purple-100 bg-white/80 p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center justify-between gap-2"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-xs font-semibold text-gray-800"
    }, pending ? "\u5019\u9009 v".concat(pending.version, " \u7B49\u5F85\u5171\u540C\u786E\u8BA4") : "\u6B63\u5F0F\u6B63\u6587 v".concat(active === null || active === void 0 ? void 0 : active.version)), /*#__PURE__*/React.createElement("div", {
      className: "mt-0.5 text-[10px] text-gray-400"
    }, pending ? '当前聊天继续使用上一份正式版本，候选不会自动生效。' : "\u786E\u8BA4\u65F6\u95F4\uFF1A".concat(timeLabel(active === null || active === void 0 ? void 0 : active.confirmedAt)))), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, pending && /*#__PURE__*/React.createElement("button", {
      onClick: confirmCandidate,
      disabled: busy,
      className: "rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-medium text-white disabled:opacity-50"
    }, "\u5171\u540C\u786E\u8BA4\u5E76\u6FC0\u6D3B"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setEditing(function (value) {
          return !value;
        });
        setDraft((pending === null || pending === void 0 ? void 0 : pending.body) || (active === null || active === void 0 ? void 0 : active.body) || '');
      },
      disabled: busy,
      className: "rounded-lg bg-purple-600 px-3 py-1.5 text-[11px] font-medium text-white disabled:opacity-50"
    }, editing ? '收起编辑' : '生成新版本'))), editing ? /*#__PURE__*/React.createElement("div", {
      className: "mt-3 space-y-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-lg bg-amber-50 px-3 py-2 text-[10px] leading-5 text-amber-700"
    }, "\u8FD9\u91CC\u4FDD\u5B58\u7684\u662F\u201C\u5019\u9009\u201D\uFF0C\u4E0D\u4F1A\u8986\u76D6\u6B63\u5F0F\u7248\u672C\u3002\u8BF7\u5148\u6BD4\u8F83\u3001\u4E00\u8D77\u786E\u8BA4\uFF0C\u518D\u6FC0\u6D3B\u3002"), /*#__PURE__*/React.createElement("input", {
      value: changeNote,
      onChange: function onChange(event) {
        return setChangeNote(event.target.value);
      },
      placeholder: "\u672C\u6B21\u4E3A\u4EC0\u4E48\u4FEE\u6539\uFF08\u5FC5\u8BFB\u8BF4\u660E\uFF09",
      className: "w-full rounded-lg border border-purple-200 bg-white px-3 py-2 text-xs outline-none focus:border-purple-500"
    }), /*#__PURE__*/React.createElement("textarea", {
      value: draft,
      onChange: function onChange(event) {
        return setDraft(event.target.value);
      },
      className: "h-72 w-full rounded-lg border border-purple-200 bg-white p-3 font-mono text-xs leading-5 outline-none focus:border-purple-500"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: createCandidate,
      disabled: busy || !draft.trim(),
      className: "rounded-lg bg-purple-600 px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
    }, "\u4FDD\u5B58\u4E3A\u5019\u9009\u7248\u672C"))) : /*#__PURE__*/React.createElement("pre", {
      className: "mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-[11px] leading-5 text-gray-700"
    }, (pending === null || pending === void 0 ? void 0 : pending.body) || (active === null || active === void 0 ? void 0 : active.body))), /*#__PURE__*/React.createElement("details", {
      className: "mt-4 rounded-xl border border-gray-200 bg-white/70 p-3"
    }, /*#__PURE__*/React.createElement("summary", {
      className: "cursor-pointer text-xs font-semibold text-gray-800"
    }, "\u7248\u672C\u5BF9\u7167\u4E0E\u56DE\u9000 \xB7 \u5171 ", history.length, " \u4E2A\u4E0D\u53EF\u8986\u76D6\u7248\u672C"), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 grid gap-3 md:grid-cols-2"
    }, [{
      value: leftVersion,
      set: setLeftVersion,
      record: left
    }, {
      value: rightVersion,
      set: setRightVersion,
      record: right
    }].map(function (column, index) {
      var _column$record;
      return /*#__PURE__*/React.createElement("div", {
        key: index
      }, /*#__PURE__*/React.createElement("select", {
        value: column.value,
        onChange: function onChange(event) {
          return column.set(event.target.value);
        },
        className: "w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs"
      }, history.map(function (item) {
        return /*#__PURE__*/React.createElement("option", {
          key: item.version,
          value: item.version
        }, "v", item.version, " \xB7 ", stateLabel(item.lifecycleState || item.confirmationState), " \xB7 ", shortHash(item.contentHash));
      })), /*#__PURE__*/React.createElement("pre", {
        className: "mt-2 h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-[10px] leading-5 text-gray-600"
      }, ((_column$record = column.record) === null || _column$record === void 0 ? void 0 : _column$record.body) || '请选择版本'));
    })), confirmedHistory.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "mt-3 border-t border-gray-100 pt-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-2 text-[10px] text-gray-400"
    }, "\u56DE\u9000\u4F1A\u521B\u5EFA\u65B0\u6B63\u5F0F\u7248\u672C\uFF0C\u4E0D\u4F1A\u5220\u9664\u5F53\u524D\u7248\u672C\uFF1A"), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-2"
    }, confirmedHistory.map(function (item) {
      return /*#__PURE__*/React.createElement("button", {
        key: item.version,
        onClick: function onClick() {
          return rollback(item.version);
        },
        disabled: busy,
        className: "rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] text-gray-600"
      }, "\u4ECE v", item.version, " \u6062\u590D");
    })))));
  }
  global.XingyueIdentityCorePanel = IdentityCorePanel;
})(window);
