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
(function initMemoryGovernancePanel(global) {
  'use strict';

  var _React = React,
    useEffect = _React.useEffect,
    useMemo = _React.useMemo,
    useState = _React.useState;
  var statusLabel = {
    confirmed: '已确认',
    candidate: '候选',
    'historical-unreviewed': '历史未复核',
    rejected: '已驳回',
    superseded: '已替代',
    conflicted: '待解决冲突'
  };
  var categoryLabel = {
    fact: '事实',
    'shared-agreement': '共同约定',
    'ethan-self-statement': '逸辰自述',
    'interpretive-observation': '解释性观察',
    'historical-unclassified': '旧资料未分类'
  };
  function MemoryGovernancePanel(_ref) {
    var _global$xingyueDeskto;
    var _ref$showToast = _ref.showToast,
      showToast = _ref$showToast === void 0 ? function () {} : _ref$showToast;
    var desktop = typeof ((_global$xingyueDeskto = global.xingyueDesktop) === null || _global$xingyueDeskto === void 0 ? void 0 : _global$xingyueDeskto.requestLocalAgent) === 'function';
    var client = useMemo(function () {
      var _global$XingyueAgentC, _global$XingyueAgentC2;
      return (_global$XingyueAgentC = global.XingyueAgentClient) === null || _global$XingyueAgentC === void 0 || (_global$XingyueAgentC2 = _global$XingyueAgentC.createMemoryGovernanceClient) === null || _global$XingyueAgentC2 === void 0 ? void 0 : _global$XingyueAgentC2.call(_global$XingyueAgentC);
    }, []);
    var _useState = useState(function () {
        try {
          var _global$localStorage;
          return JSON.parse(((_global$localStorage = global.localStorage) === null || _global$localStorage === void 0 ? void 0 : _global$localStorage.getItem('xingyue_memory_governance_summary')) || 'null');
        } catch (_) {
          return null;
        }
      }),
      _useState2 = _slicedToArray(_useState, 2),
      governance = _useState2[0],
      setGovernance = _useState2[1];
    var _useState3 = useState(true),
      _useState4 = _slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];
    var _useState5 = useState(''),
      _useState6 = _slicedToArray(_useState5, 2),
      busy = _useState6[0],
      setBusy = _useState6[1];
    var _useState7 = useState(''),
      _useState8 = _slicedToArray(_useState7, 2),
      error = _useState8[0],
      setError = _useState8[1];
    var publish = function publish(value) {
      setGovernance(value);
      try {
        var _global$localStorage2;
        (_global$localStorage2 = global.localStorage) === null || _global$localStorage2 === void 0 || _global$localStorage2.setItem('xingyue_memory_governance_summary', JSON.stringify(desktop ? {
          readOnly: true,
          activePayload: (value === null || value === void 0 ? void 0 : value.activePayload) || '',
          counts: (value === null || value === void 0 ? void 0 : value.counts) || {},
          updatedAt: (value === null || value === void 0 ? void 0 : value.updatedAt) || null
        } : value));
      } catch (_) {}
      global.dispatchEvent(new CustomEvent('xingyue:memory-governance-updated', {
        detail: value
      }));
    };
    var refresh = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var data;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              setLoading(true);
              setError('');
              _context.prev = 2;
              if (!desktop) {
                _context.next = 11;
                break;
              }
              _context.t0 = publish;
              _context.next = 7;
              return client.read();
            case 7:
              _context.t1 = _context.sent;
              (0, _context.t0)(_context.t1);
              _context.next = 17;
              break;
            case 11:
              _context.next = 13;
              return global.XingyueAgentClient.createDeviceClient().readHostData();
            case 13:
              data = _context.sent;
              if (data !== null && data !== void 0 && data.memoryGovernance) {
                _context.next = 16;
                break;
              }
              throw new Error('主机尚未返回记忆摘要');
            case 16:
              publish(data.memoryGovernance);
            case 17:
              _context.next = 22;
              break;
            case 19:
              _context.prev = 19;
              _context.t2 = _context["catch"](2);
              setError((_context.t2 === null || _context.t2 === void 0 ? void 0 : _context.t2.message) || '记忆治理仓暂时不可用');
            case 22:
              _context.prev = 22;
              setLoading(false);
              return _context.finish(22);
            case 25:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[2, 19, 22, 25]]);
      }));
      return function refresh() {
        return _ref2.apply(this, arguments);
      };
    }();
    useEffect(function () {
      refresh();
    }, []);
    var act = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(key, action, success) {
        var result;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(!client || busy)) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return");
            case 2:
              setBusy(key);
              setError('');
              _context2.prev = 4;
              _context2.next = 7;
              return action();
            case 7:
              result = _context2.sent;
              publish(result.memoryGovernance);
              showToast(success);
              _context2.next = 15;
              break;
            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](4);
              setError((_context2.t0 === null || _context2.t0 === void 0 ? void 0 : _context2.t0.message) || '记忆治理操作失败');
            case 15:
              _context2.prev = 15;
              setBusy('');
              return _context2.finish(15);
            case 18:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[4, 12, 15, 18]]);
      }));
      return function act(_x, _x2, _x3) {
        return _ref3.apply(this, arguments);
      };
    }();
    var records = Array.isArray(governance === null || governance === void 0 ? void 0 : governance.records) ? governance.records : [];
    var candidates = records.filter(function (record) {
      return record.confirmationState === 'candidate';
    });
    var confirmed = records.filter(function (record) {
      return record.confirmationState === 'confirmed' && record.activation !== 'active';
    });
    var counts = (governance === null || governance === void 0 ? void 0 : governance.counts) || {};
    return /*#__PURE__*/React.createElement("section", {
      className: "bg-white border border-indigo-100 rounded-xl p-4 shadow-sm space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "text-sm font-semibold text-gray-800"
    }, "\u8BB0\u5FC6\u786E\u8BA4\u4E0E\u7248\u672C\u4ED3"), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-indigo-500 mt-1"
    }, "\u4E3B\u673A\u6743\u5A01 \xB7 \u539F\u6587\u53EF\u8FFD\u6EAF \xB7 \u4FEE\u8BA2\u4E0D\u8986\u76D6\u65E7\u7248\u672C")), /*#__PURE__*/React.createElement("button", {
      onClick: refresh,
      disabled: loading,
      className: "text-[10px] px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 disabled:opacity-50"
    }, "\u5237\u65B0")), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 md:grid-cols-4 gap-2 text-center"
    }, [['confirmed', '已确认'], ['candidate', '候选'], ['historical-unreviewed', '历史未复核'], ['rejected', '已驳回']].map(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
        key = _ref5[0],
        label = _ref5[1];
      return /*#__PURE__*/React.createElement("div", {
        key: key,
        className: "rounded-lg bg-gray-50 border border-gray-100 px-2 py-2"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-base font-semibold text-gray-700"
      }, Number(counts[key] || 0)), /*#__PURE__*/React.createElement("div", {
        className: "text-[9px] text-gray-500"
      }, label));
    })), error && /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-2"
    }, error), loading && /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-gray-400"
    }, "\u6B63\u5728\u8BFB\u53D6\u4E3B\u673A\u8BB0\u5FC6\u72B6\u6001\u2026"), (governance === null || governance === void 0 ? void 0 : governance.activePayload) && /*#__PURE__*/React.createElement("details", {
      className: "rounded-lg border border-emerald-100 bg-emerald-50/50 p-3"
    }, /*#__PURE__*/React.createElement("summary", {
      className: "text-xs font-medium text-emerald-700 cursor-pointer"
    }, "\u5F53\u524D\u6BCF\u8F6E\u6CE8\u5165\uFF1A\u6700\u5C0F\u6D3B\u8DC3\u6458\u8981"), /*#__PURE__*/React.createElement("pre", {
      className: "mt-3 whitespace-pre-wrap text-[10px] leading-relaxed text-gray-600 font-sans max-h-72 overflow-y-auto"
    }, governance.activePayload)), !desktop && /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-gray-500 bg-gray-50 rounded-lg p-3"
    }, "\u624B\u673A\u7AEF\u53EA\u663E\u793A\u72B6\u6001\u4E0E\u6D3B\u8DC3\u6458\u8981\uFF1B\u786E\u8BA4\u3001\u9A73\u56DE\u3001\u4FEE\u8BA2\u548C\u64A4\u56DE\u7559\u5728\u7535\u8111\u661F\u6708\u8231\u64CD\u4F5C\u53F0\u3002"), desktop && candidates.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "text-xs font-semibold text-amber-700"
    }, "\u7B49\u5F85\u5171\u540C\u786E\u8BA4"), candidates.map(function (record) {
      return /*#__PURE__*/React.createElement("article", {
        key: "".concat(record.recordId, "-").concat(record.version),
        className: "border border-amber-100 bg-amber-50/40 rounded-lg p-3 space-y-2"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex justify-between gap-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-xs font-medium text-gray-700"
      }, record.title), /*#__PURE__*/React.createElement("div", {
        className: "text-[9px] text-gray-400"
      }, categoryLabel[record.category] || record.category, " \xB7 v", record.version)), /*#__PURE__*/React.createElement("div", {
        className: "text-[11px] text-gray-600 whitespace-pre-wrap"
      }, record.body), /*#__PURE__*/React.createElement("div", {
        className: "text-[9px] text-gray-400"
      }, "\u6765\u6E90\uFF1A", record.sourceLabel), /*#__PURE__*/React.createElement("div", {
        className: "flex justify-end gap-2"
      }, /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          return act("reject:".concat(record.recordId), function () {
            return client.reject({
              recordId: record.recordId
            });
          }, '候选已驳回，原版本仍保留');
        },
        disabled: Boolean(busy),
        className: "text-[10px] px-2 py-1 rounded bg-white border border-gray-200 text-gray-600 disabled:opacity-50"
      }, "\u9A73\u56DE"), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          return act("confirm:".concat(record.recordId), function () {
            return client.confirm({
              recordId: record.recordId,
              version: record.version,
              activation: 'on-demand'
            });
          }, '候选已共同确认为按需记忆');
        },
        disabled: Boolean(busy),
        className: "text-[10px] px-2 py-1 rounded bg-amber-600 text-white disabled:opacity-50"
      }, "\u786E\u8BA4\u5E76\u6309\u9700\u4FDD\u5B58")));
    })), desktop && confirmed.length > 0 && /*#__PURE__*/React.createElement("details", {
      className: "rounded-lg border border-gray-100 p-3"
    }, /*#__PURE__*/React.createElement("summary", {
      className: "text-xs font-medium text-gray-700 cursor-pointer"
    }, "\u5DF2\u786E\u8BA4\u7684\u6309\u9700\u8BB0\u5FC6\uFF08", confirmed.length, "\uFF09"), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 space-y-2 max-h-80 overflow-y-auto"
    }, confirmed.map(function (record) {
      return /*#__PURE__*/React.createElement("article", {
        key: "".concat(record.recordId, "-").concat(record.version),
        className: "border border-gray-100 rounded-lg p-2"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-start justify-between gap-3"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "text-[11px] font-medium text-gray-700"
      }, record.title), /*#__PURE__*/React.createElement("div", {
        className: "text-[9px] text-gray-400"
      }, categoryLabel[record.category] || record.category, " \xB7 ", statusLabel[record.confirmationState], " \xB7 v", record.version)), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          return act("withdraw:".concat(record.recordId), function () {
            return client.withdraw({
              recordId: record.recordId,
              reason: '柒柒在电脑操作台明确撤回'
            });
          }, '记忆已撤回，确认版本仍保留在历史链中');
        },
        disabled: Boolean(busy),
        className: "text-[9px] px-2 py-1 rounded bg-red-50 text-red-600 disabled:opacity-50"
      }, "\u64A4\u56DE")), /*#__PURE__*/React.createElement("div", {
        className: "mt-2 text-[10px] text-gray-600 whitespace-pre-wrap"
      }, record.body), /*#__PURE__*/React.createElement("div", {
        className: "mt-1 text-[9px] text-gray-400"
      }, "\u6765\u6E90\uFF1A", record.sourceLabel));
    }))), /*#__PURE__*/React.createElement("p", {
      className: "text-[9px] text-gray-400"
    }, "\u540E\u53F0\u63D0\u70BC\u53EA\u80FD\u751F\u6210\u5019\u9009\uFF1B\u201C\u8BB0\u4F4F\u8FD9\u4E2A\uFF1A\u5177\u4F53\u5185\u5BB9\u201D\u53EF\u76F4\u63A5\u786E\u8BA4\u4E8B\u5B9E\uFF0C\u4F46\u9ED8\u8BA4\u8FDB\u5165\u6309\u9700\u68C0\u7D22\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u585E\u8FDB\u6BCF\u8F6E\u4E0A\u4E0B\u6587\u3002"));
  }
  global.XingyueMemoryGovernancePanel = MemoryGovernancePanel;
})(window);
