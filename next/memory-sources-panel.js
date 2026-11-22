"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function initMemorySourcesPanel(global) {
  'use strict';

  var _React = React,
    useEffect = _React.useEffect,
    useMemo = _React.useMemo,
    useState = _React.useState;
  var statusText = {
    registered: '待扫描',
    scanning: '扫描中',
    catalogued: '已登记',
    deferred: '稍后接入',
    missing: '原件缺失',
    failed: '扫描失败',
    ready: '索引可用',
    stale: '有新内容待更新',
    unindexed: '首次查询时建立索引',
    error: '索引暂不可用'
  };
  var statusStyle = {
    catalogued: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    deferred: 'bg-gray-50 text-gray-500 border-gray-100',
    missing: 'bg-amber-50 text-amber-700 border-amber-100',
    failed: 'bg-red-50 text-red-700 border-red-100',
    scanning: 'bg-blue-50 text-blue-700 border-blue-100',
    registered: 'bg-indigo-50 text-indigo-700 border-indigo-100'
  };
  var formatBytes = function formatBytes(value) {
    var bytes = Number(value || 0);
    if (bytes < 1024) return "".concat(bytes, " B");
    if (bytes < 1024 * 1024) return "".concat((bytes / 1024).toFixed(1), " KiB");
    return "".concat((bytes / 1024 / 1024).toFixed(2), " MiB");
  };
  function MemorySourcesPanel(_ref) {
    var _global$xingyueDeskto;
    var _ref$showToast = _ref.showToast,
      showToast = _ref$showToast === void 0 ? function () {} : _ref$showToast;
    var desktop = typeof ((_global$xingyueDeskto = global.xingyueDesktop) === null || _global$xingyueDeskto === void 0 ? void 0 : _global$xingyueDeskto.requestLocalAgent) === 'function';
    var client = useMemo(function () {
      var _global$XingyueAgentC, _global$XingyueAgentC2;
      return (_global$XingyueAgentC = global.XingyueAgentClient) === null || _global$XingyueAgentC === void 0 || (_global$XingyueAgentC2 = _global$XingyueAgentC.createMemorySourceClient) === null || _global$XingyueAgentC2 === void 0 ? void 0 : _global$XingyueAgentC2.call(_global$XingyueAgentC);
    }, []);
    var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      catalog = _useState2[0],
      setCatalog = _useState2[1];
    var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      busy = _useState4[0],
      setBusy = _useState4[1];
    var _useState5 = useState(''),
      _useState6 = _slicedToArray(_useState5, 2),
      error = _useState6[0],
      setError = _useState6[1];
    var refresh = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!(!desktop || !client)) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return");
            case 2:
              setError('');
              _context.prev = 3;
              _context.t0 = setCatalog;
              _context.next = 7;
              return client.read();
            case 7:
              _context.t1 = _context.sent;
              (0, _context.t0)(_context.t1);
              _context.next = 14;
              break;
            case 11:
              _context.prev = 11;
              _context.t2 = _context["catch"](3);
              setError((_context.t2 === null || _context.t2 === void 0 ? void 0 : _context.t2.message) || '记忆资料目录不可用');
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[3, 11]]);
      }));
      return function refresh() {
        return _ref2.apply(this, arguments);
      };
    }();
    useEffect(function () {
      refresh();
    }, []);
    var scan = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(busy || !client)) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return");
            case 2:
              setBusy(true);
              setError('');
              _context2.prev = 4;
              _context2.t0 = setCatalog;
              _context2.next = 8;
              return client.scan();
            case 8:
              _context2.t1 = _context2.sent;
              (0, _context2.t0)(_context2.t1);
              showToast('资料索引检查完成，请核对各来源状态；原件保持只读');
              _context2.next = 16;
              break;
            case 13:
              _context2.prev = 13;
              _context2.t2 = _context2["catch"](4);
              setError((_context2.t2 === null || _context2.t2 === void 0 ? void 0 : _context2.t2.message) || '资料目录扫描失败');
            case 16:
              _context2.prev = 16;
              setBusy(false);
              return _context2.finish(16);
            case 19:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[4, 13, 16, 19]]);
      }));
      return function scan() {
        return _ref3.apply(this, arguments);
      };
    }();
    if (!desktop) return null;
    var sources = (Array.isArray(catalog === null || catalog === void 0 ? void 0 : catalog.sources) ? catalog.sources : []).map(function (source) {
      var indexed = ((catalog === null || catalog === void 0 ? void 0 : catalog.historySources) || []).find(function (item) {
        return item.id === source.id;
      });
      return indexed ? _objectSpread(_objectSpread({}, source), indexed) : source;
    });
    return /*#__PURE__*/React.createElement("section", {
      className: "bg-white border border-sky-100 rounded-xl p-4 shadow-sm space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "text-sm font-semibold text-gray-800"
    }, "\u672C\u5730\u8BB0\u5FC6\u8D44\u6599\u76EE\u5F55"), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-sky-600 mt-1"
    }, "\u660E\u786E\u767D\u540D\u5355 \xB7 \u539F\u4EF6\u53EA\u8BFB \xB7 \u6D3E\u751F\u76EE\u5F55\u53EF\u91CD\u5EFA")), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: refresh,
      disabled: busy,
      className: "text-[10px] px-2 py-1 rounded-lg bg-gray-50 text-gray-600 disabled:opacity-50"
    }, "\u5237\u65B0"), /*#__PURE__*/React.createElement("button", {
      onClick: scan,
      disabled: busy,
      className: "text-[10px] px-3 py-1 rounded-lg bg-sky-600 text-white disabled:opacity-50"
    }, busy ? '更新中…' : '更新资料索引'))), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-gray-500 bg-sky-50/60 rounded-lg p-2"
    }, "\u5DF2\u63A5\u5165\u7684\u5386\u53F2\u804A\u5929\u5728\u67E5\u8BE2\u65F6\u68C0\u67E5\u66F4\u65B0\uFF0C\u53EA\u5C06\u76F8\u5173\u7247\u6BB5\u4EA4\u7ED9\u6A21\u578B\uFF1B\u65B0\u8D44\u6599\u4E0D\u4F1A\u81EA\u52A8\u6269\u5927\u8303\u56F4\u3002\u5176\u4F59\u76EE\u5F55\u767B\u8BB0\u4E0E\u5386\u53F2\u67E5\u8BE2\u7D22\u5F15\u5206\u5F00\u663E\u793A\u3002"), error && /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-2"
    }, error), /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, sources.map(function (source) {
      var _source$history;
      return /*#__PURE__*/React.createElement("details", {
        key: source.id,
        className: "rounded-lg border border-gray-100 bg-gray-50/40 p-3"
      }, /*#__PURE__*/React.createElement("summary", {
        className: "cursor-pointer list-none flex items-start justify-between gap-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "min-w-0"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-xs font-medium text-gray-700"
      }, source.title), /*#__PURE__*/React.createElement("div", {
        className: "text-[9px] text-gray-400 mt-1"
      }, source.id, " \xB7 ", source.fileCount || 0, " \u4E2A\u6587\u4EF6 \xB7 ", formatBytes(source.totalBytes))), /*#__PURE__*/React.createElement("span", {
        className: "flex-shrink-0 text-[9px] px-2 py-1 border rounded-full ".concat(statusStyle[source.status] || statusStyle.registered)
      }, statusText[source.status] || source.status)), /*#__PURE__*/React.createElement("div", {
        className: "mt-3 text-[10px] text-gray-600 space-y-2"
      }, /*#__PURE__*/React.createElement("p", null, source.description), (source.indexedAt || ((_source$history = source.history) === null || _source$history === void 0 ? void 0 : _source$history.indexedAt)) && /*#__PURE__*/React.createElement("div", null, "\u67E5\u8BE2\u7D22\u5F15\u66F4\u65B0\uFF1A", new Date(source.indexedAt || source.history.indexedAt).toLocaleString('zh-CN')), /*#__PURE__*/React.createElement("div", {
        className: "font-mono break-all text-[9px] text-gray-400"
      }, (source.roots || []).join('\n')), source.fingerprint && /*#__PURE__*/React.createElement("div", {
        className: "font-mono break-all text-[9px] text-emerald-600"
      }, "SHA-256 \u76EE\u5F55\u6307\u7EB9\uFF1A", source.fingerprint), source.error && /*#__PURE__*/React.createElement("div", {
        className: "text-red-600"
      }, source.error)));
    })));
  }
  global.XingyueMemorySourcesPanel = MemorySourcesPanel;
})(window);
