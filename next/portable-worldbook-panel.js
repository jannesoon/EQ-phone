"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function initMemoryVaultPanel(global) {
  'use strict';

  var timeLabel = function timeLabel(value) {
    return value ? new Date(value).toLocaleString('zh-CN') : '—';
  };
  var shortHash = function shortHash(value) {
    return value ? String(value).slice(0, 12) : '—';
  };
  function MemoryCard(_ref) {
    var _card$source, _card$source2, _card$source3;
    var card = _ref.card,
      moduleId = _ref.moduleId,
      revision = _ref.revision,
      onSaved = _ref.onSaved;
    var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      editing = _React$useState2[0],
      setEditing = _React$useState2[1];
    var _React$useState3 = React.useState((revision === null || revision === void 0 ? void 0 : revision.proposedBody) || card.body || ''),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      body = _React$useState4[0],
      setBody = _React$useState4[1];
    var _React$useState5 = React.useState(''),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      note = _React$useState6[0],
      setNote = _React$useState6[1];
    var _React$useState7 = React.useState(false),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      saving = _React$useState8[0],
      setSaving = _React$useState8[1];
    var _React$useState9 = React.useState(''),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      error = _React$useState10[0],
      setError = _React$useState10[1];
    var save = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _global$XingyueAgentC, _global$XingyueAgentC2, client, result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              setSaving(true);
              setError('');
              _context.prev = 2;
              client = (_global$XingyueAgentC = global.XingyueAgentClient) === null || _global$XingyueAgentC === void 0 || (_global$XingyueAgentC2 = _global$XingyueAgentC.createMemoryVaultClient) === null || _global$XingyueAgentC2 === void 0 ? void 0 : _global$XingyueAgentC2.call(_global$XingyueAgentC);
              if (client) {
                _context.next = 6;
                break;
              }
              throw new Error('电脑记忆仓接口暂不可用');
            case 6:
              _context.next = 8;
              return client.proposeRevision({
                cardId: card.cardId,
                moduleId: moduleId,
                proposedBody: body,
                changeNote: note
              });
            case 8:
              result = _context.sent;
              onSaved === null || onSaved === void 0 || onSaved(result.memoryVault, result.saved);
              setEditing(false);
              _context.next = 16;
              break;
            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](2);
              setError((_context.t0 === null || _context.t0 === void 0 ? void 0 : _context.t0.message) || String(_context.t0));
            case 16:
              _context.prev = 16;
              setSaving(false);
              return _context.finish(16);
            case 19:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[2, 13, 16, 19]]);
      }));
      return function save() {
        return _ref2.apply(this, arguments);
      };
    }();
    return /*#__PURE__*/React.createElement("article", {
      className: "rounded-xl border border-gray-100 bg-white p-3 space-y-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", {
      className: "text-xs font-semibold text-gray-800"
    }, card.title), /*#__PURE__*/React.createElement("div", {
      className: "mt-1 text-[9px] text-gray-400"
    }, card.factState || '未标状态', " \xB7 ", ((_card$source = card.source) === null || _card$source === void 0 ? void 0 : _card$source.fileName) || '来源未标', "\uFF1A", ((_card$source2 = card.source) === null || _card$source2 === void 0 ? void 0 : _card$source2.startLine) || '—', "\uFF5E", ((_card$source3 = card.source) === null || _card$source3 === void 0 ? void 0 : _card$source3.endLine) || '—', " \u884C")), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setEditing(function (value) {
          return !value;
        });
        setError('');
      },
      className: "shrink-0 rounded-lg border border-indigo-100 px-2 py-1 text-[10px] text-indigo-700 hover:bg-indigo-50"
    }, editing ? '收起修改' : '修改')), editing ? /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, /*#__PURE__*/React.createElement("textarea", {
      value: body,
      onChange: function onChange(event) {
        return setBody(event.target.value);
      },
      rows: Math.min(16, Math.max(6, String(body).split('\n').length + 2)),
      className: "w-full rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 text-xs leading-6 text-gray-800 outline-none focus:border-indigo-300"
    }), /*#__PURE__*/React.createElement("input", {
      value: note,
      onChange: function onChange(event) {
        return setNote(event.target.value);
      },
      placeholder: "\u53EF\u9009\uFF1A\u4E3A\u4EC0\u4E48\u8981\u4FEE\u8BA2",
      className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-indigo-300"
    }), /*#__PURE__*/React.createElement("div", {
      className: "rounded-lg bg-amber-50 p-2 text-[10px] text-amber-700"
    }, "\u4FDD\u5B58\u540E\u53EA\u5F62\u6210\u5F85\u6574\u7406\u4FEE\u8BA2\uFF0C\u4E0D\u4F1A\u8986\u76D6\u8BB0\u5FC6\u4ED3 v", (revision === null || revision === void 0 ? void 0 : revision.baseWorldbookVersion) || 1, "\uFF0C\u4E5F\u4E0D\u4F1A\u6539\u52A8\u539F\u59CB\u6587\u4EF6\u3002"), error && /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-red-600"
    }, error), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setBody((revision === null || revision === void 0 ? void 0 : revision.proposedBody) || card.body || '');
        setNote('');
        setEditing(false);
      },
      className: "rounded-lg px-3 py-1.5 text-[10px] text-gray-500"
    }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement("button", {
      disabled: saving || body.trim() === String(card.body || '').trim(),
      onClick: save,
      className: "rounded-lg bg-indigo-600 px-3 py-1.5 text-[10px] text-white disabled:opacity-40"
    }, saving ? '保存中…' : '保存为待整理修订'))) : /*#__PURE__*/React.createElement("div", {
      className: "whitespace-pre-wrap text-[11px] leading-6 text-gray-700"
    }, (revision === null || revision === void 0 ? void 0 : revision.proposedBody) || card.body), revision && !editing && /*#__PURE__*/React.createElement("div", {
      className: "rounded-lg border border-amber-100 bg-amber-50 p-2 text-[10px] text-amber-700"
    }, "\u8FD9\u5F20\u5361\u5DF2\u6709\u5F85\u6574\u7406\u4FEE\u8BA2 \xB7 ", timeLabel(revision.createdAt), revision.changeNote ? " \xB7 ".concat(revision.changeNote) : ''));
  }
  function NewMemoryCard(_ref3) {
    var modules = _ref3.modules,
      onSaved = _ref3.onSaved;
    var _React$useState11 = React.useState(false),
      _React$useState12 = _slicedToArray(_React$useState11, 2),
      open = _React$useState12[0],
      setOpen = _React$useState12[1];
    var _React$useState13 = React.useState(''),
      _React$useState14 = _slicedToArray(_React$useState13, 2),
      title = _React$useState14[0],
      setTitle = _React$useState14[1];
    var _React$useState15 = React.useState(''),
      _React$useState16 = _slicedToArray(_React$useState15, 2),
      body = _React$useState16[0],
      setBody = _React$useState16[1];
    var _React$useState17 = React.useState(''),
      _React$useState18 = _slicedToArray(_React$useState17, 2),
      targetModuleId = _React$useState18[0],
      setTargetModuleId = _React$useState18[1];
    var _React$useState19 = React.useState(''),
      _React$useState20 = _slicedToArray(_React$useState19, 2),
      targetModuleTitle = _React$useState20[0],
      setTargetModuleTitle = _React$useState20[1];
    var _React$useState21 = React.useState(''),
      _React$useState22 = _slicedToArray(_React$useState21, 2),
      note = _React$useState22[0],
      setNote = _React$useState22[1];
    var _React$useState23 = React.useState(false),
      _React$useState24 = _slicedToArray(_React$useState23, 2),
      saving = _React$useState24[0],
      setSaving = _React$useState24[1];
    var _React$useState25 = React.useState(''),
      _React$useState26 = _slicedToArray(_React$useState25, 2),
      error = _React$useState26[0],
      setError = _React$useState26[1];
    var reset = function reset() {
      setTitle('');
      setBody('');
      setTargetModuleId('');
      setTargetModuleTitle('');
      setNote('');
      setError('');
    };
    var save = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var _global$XingyueAgentC3, _global$XingyueAgentC4, client, result;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              setSaving(true);
              setError('');
              _context2.prev = 2;
              client = (_global$XingyueAgentC3 = global.XingyueAgentClient) === null || _global$XingyueAgentC3 === void 0 || (_global$XingyueAgentC4 = _global$XingyueAgentC3.createMemoryVaultClient) === null || _global$XingyueAgentC4 === void 0 ? void 0 : _global$XingyueAgentC4.call(_global$XingyueAgentC3);
              if (client) {
                _context2.next = 6;
                break;
              }
              throw new Error('电脑记忆仓接口暂不可用');
            case 6:
              _context2.next = 8;
              return client.createCandidate({
                title: title,
                body: body,
                targetModuleId: targetModuleId,
                targetModuleTitle: targetModuleTitle,
                note: note
              });
            case 8:
              result = _context2.sent;
              onSaved === null || onSaved === void 0 || onSaved(result.memoryVault, result.saved);
              reset();
              setOpen(false);
              _context2.next = 17;
              break;
            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](2);
              setError((_context2.t0 === null || _context2.t0 === void 0 ? void 0 : _context2.t0.message) || String(_context2.t0));
            case 17:
              _context2.prev = 17;
              setSaving(false);
              return _context2.finish(17);
            case 20:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[2, 14, 17, 20]]);
      }));
      return function save() {
        return _ref4.apply(this, arguments);
      };
    }();
    return /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-indigo-100 bg-white/90 p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-xs font-semibold text-gray-800"
    }, "\u624B\u52A8\u8865\u5145\u957F\u671F\u8BB0\u5FC6"), /*#__PURE__*/React.createElement("div", {
      className: "mt-1 text-[9px] text-gray-500"
    }, "\u4E8B\u5B9E\u7531\u4F60\u76F4\u63A5\u786E\u8BA4\uFF1B\u5F52\u7C7B\u4E0E\u5408\u5E76\u7B49\u5F85\u6211\u4EEC\u4E4B\u540E\u5171\u540C\u6574\u7406\u3002")), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setOpen(function (value) {
          return !value;
        });
        setError('');
      },
      className: "shrink-0 rounded-lg bg-indigo-600 px-3 py-2 text-[10px] text-white"
    }, open ? '收起' : '新增记忆卡片')), open && /*#__PURE__*/React.createElement("div", {
      className: "mt-3 space-y-2"
    }, /*#__PURE__*/React.createElement("input", {
      value: title,
      onChange: function onChange(event) {
        return setTitle(event.target.value);
      },
      placeholder: "\u8BB0\u5FC6\u6807\u9898\uFF08\u5FC5\u586B\uFF09",
      className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-indigo-300"
    }), /*#__PURE__*/React.createElement("textarea", {
      value: body,
      onChange: function onChange(event) {
        return setBody(event.target.value);
      },
      rows: "6",
      placeholder: "\u5199\u4E0B\u5E0C\u671B\u6211\u957F\u671F\u8BB0\u5F97\u7684\u4E8B\u5B9E\uFF08\u5FC5\u586B\uFF09",
      className: "w-full rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 text-xs leading-6 text-gray-800 outline-none focus:border-indigo-300"
    }), /*#__PURE__*/React.createElement("div", {
      className: "grid gap-2 md:grid-cols-2"
    }, /*#__PURE__*/React.createElement("select", {
      value: targetModuleId,
      onChange: function onChange(event) {
        return setTargetModuleId(event.target.value);
      },
      className: "rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 outline-none focus:border-indigo-300"
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "\u6682\u4E0D\u5F52\u7C7B / \u65B0\u4E3B\u9898"), modules.map(function (module) {
      return /*#__PURE__*/React.createElement("option", {
        key: module.moduleId,
        value: module.moduleId
      }, module.title);
    })), !targetModuleId && /*#__PURE__*/React.createElement("input", {
      value: targetModuleTitle,
      onChange: function onChange(event) {
        return setTargetModuleTitle(event.target.value);
      },
      placeholder: "\u53EF\u9009\uFF1A\u5EFA\u8BAE\u5F52\u5165\u7684\u65B0\u4E3B\u9898",
      className: "rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-indigo-300"
    })), /*#__PURE__*/React.createElement("input", {
      value: note,
      onChange: function onChange(event) {
        return setNote(event.target.value);
      },
      placeholder: "\u53EF\u9009\uFF1A\u8865\u5145\u8BF4\u660E\u6216\u51FA\u5904",
      className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-indigo-300"
    }), /*#__PURE__*/React.createElement("div", {
      className: "rounded-lg bg-amber-50 p-2 text-[10px] leading-5 text-amber-700"
    }, "\u4FDD\u5B58\u540E\u6807\u8BB0\u4E3A\u201C\u67D2\u67D2\u5DF2\u786E\u8BA4 \xB7 \u7B49\u5F85\u6574\u7406\u201D\u3002\u5B83\u4E0D\u4F1A\u7ACB\u523B\u5199\u8FDB\u6B63\u5F0F\u8BB0\u5FC6\u4ED3 v1\uFF0C\u4E5F\u4E0D\u4F1A\u8986\u76D6\u539F\u59CB\u6587\u4EF6\u3002"), error && /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-red-600"
    }, error), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        reset();
        setOpen(false);
      },
      className: "rounded-lg px-3 py-1.5 text-[10px] text-gray-500"
    }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement("button", {
      disabled: saving || !title.trim() || !body.trim(),
      onClick: save,
      className: "rounded-lg bg-indigo-600 px-3 py-1.5 text-[10px] text-white disabled:opacity-40"
    }, saving ? '保存中…' : '保存为待整理记忆'))));
  }
  function IncrementalCandidate(_ref5) {
    var _source$messageIds, _source$messageIds2, _source$excerpts;
    var card = _ref5.card,
      modules = _ref5.modules,
      onSaved = _ref5.onSaved;
    var _React$useState27 = React.useState(false),
      _React$useState28 = _slicedToArray(_React$useState27, 2),
      editing = _React$useState28[0],
      setEditing = _React$useState28[1];
    var _React$useState29 = React.useState(card.title || ''),
      _React$useState30 = _slicedToArray(_React$useState29, 2),
      title = _React$useState30[0],
      setTitle = _React$useState30[1];
    var _React$useState31 = React.useState(card.body || ''),
      _React$useState32 = _slicedToArray(_React$useState31, 2),
      body = _React$useState32[0],
      setBody = _React$useState32[1];
    var _React$useState33 = React.useState(card.targetModuleId || ''),
      _React$useState34 = _slicedToArray(_React$useState33, 2),
      targetModuleId = _React$useState34[0],
      setTargetModuleId = _React$useState34[1];
    var _React$useState35 = React.useState(''),
      _React$useState36 = _slicedToArray(_React$useState35, 2),
      reason = _React$useState36[0],
      setReason = _React$useState36[1];
    var _React$useState37 = React.useState(false),
      _React$useState38 = _slicedToArray(_React$useState37, 2),
      busy = _React$useState38[0],
      setBusy = _React$useState38[1];
    var _React$useState39 = React.useState(''),
      _React$useState40 = _slicedToArray(_React$useState39, 2),
      error = _React$useState40[0],
      setError = _React$useState40[1];
    var apply = /*#__PURE__*/function () {
      var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(action) {
        var result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              setBusy(true);
              setError('');
              _context3.prev = 2;
              _context3.next = 5;
              return action(global.XingyueAgentClient.createMemoryVaultClient());
            case 5:
              result = _context3.sent;
              onSaved === null || onSaved === void 0 || onSaved(result.memoryVault);
              setEditing(false);
              _context3.next = 13;
              break;
            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](2);
              setError((_context3.t0 === null || _context3.t0 === void 0 ? void 0 : _context3.t0.message) || String(_context3.t0));
            case 13:
              _context3.prev = 13;
              setBusy(false);
              return _context3.finish(13);
            case 16:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[2, 10, 13, 16]]);
      }));
      return function apply(_x) {
        return _ref6.apply(this, arguments);
      };
    }();
    var source = card.source || {};
    return /*#__PURE__*/React.createElement("article", {
      className: "rounded-xl border border-amber-100 bg-white p-3 space-y-2"
    }, editing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
      value: title,
      onChange: function onChange(event) {
        return setTitle(event.target.value);
      },
      className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
    }), /*#__PURE__*/React.createElement("textarea", {
      value: body,
      onChange: function onChange(event) {
        return setBody(event.target.value);
      },
      rows: "6",
      className: "w-full rounded-xl border border-indigo-100 p-3 text-xs leading-6"
    }), /*#__PURE__*/React.createElement("select", {
      value: targetModuleId,
      onChange: function onChange(event) {
        return setTargetModuleId(event.target.value);
      },
      className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "\u4FDD\u6301\u5EFA\u8BAE\u7684\u65B0\u4E3B\u9898"), modules.map(function (module) {
      return /*#__PURE__*/React.createElement("option", {
        key: module.moduleId,
        value: module.moduleId
      }, module.title);
    })), /*#__PURE__*/React.createElement("input", {
      value: reason,
      onChange: function onChange(event) {
        return setReason(event.target.value);
      },
      placeholder: "\u4FEE\u6539\u539F\u56E0\uFF08\u4F1A\u4FDD\u7559\u5728\u5386\u53F2\u4E2D\uFF09",
      className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-xs"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return setEditing(false);
      },
      className: "px-3 py-1.5 text-[10px] text-gray-500"
    }, "\u53D6\u6D88"), /*#__PURE__*/React.createElement("button", {
      disabled: busy || !title.trim() || !body.trim(),
      onClick: function onClick() {
        return apply(function (client) {
          return client.reviseCandidate(card.candidateId, {
            title: title,
            body: body,
            targetModuleId: targetModuleId,
            reason: reason
          });
        });
      },
      className: "rounded-lg bg-indigo-600 px-3 py-1.5 text-[10px] text-white disabled:opacity-40"
    }, "\u4FDD\u5B58\u4FEE\u8BA2"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-start justify-between gap-2"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "text-xs font-semibold text-gray-800"
    }, card.title), /*#__PURE__*/React.createElement("span", {
      className: "rounded-full bg-amber-50 px-2 py-1 text-[9px] text-amber-700"
    }, card.factState === 'qiqi-confirmed' ? '柒柒已确认' : '对话增量候选', " \xB7 \u7B49\u5F85\u6574\u7406")), /*#__PURE__*/React.createElement("div", {
      className: "whitespace-pre-wrap text-[11px] leading-6 text-gray-700"
    }, card.body), /*#__PURE__*/React.createElement("div", {
      className: "text-[9px] leading-5 text-gray-400"
    }, "\u5EFA\u8BAE\u4E66\u67B6\uFF1A", card.targetModuleTitle || '等待归类', " \xB7 \u521B\u5EFA ", timeLabel(card.createdAt), card.updatedAt && card.updatedAt !== card.createdAt ? " \xB7 \u4FEE\u6539 ".concat(timeLabel(card.updatedAt)) : ''), Boolean(source.deviceId || source.windowId || ((_source$messageIds = source.messageIds) === null || _source$messageIds === void 0 ? void 0 : _source$messageIds.length)) && /*#__PURE__*/React.createElement("div", {
      className: "rounded-lg bg-sky-50 p-2 text-[9px] leading-5 text-sky-700"
    }, "\u6765\u6E90\uFF1A", source.kind || '未标', source.deviceId ? " \xB7 \u8BBE\u5907 ".concat(source.deviceId) : '', source.windowId ? " \xB7 \u7A97\u53E3 ".concat(source.windowId) : '', (_source$messageIds2 = source.messageIds) !== null && _source$messageIds2 !== void 0 && _source$messageIds2.length ? " \xB7 \u6D88\u606F ".concat(source.messageIds.join('、')) : ''), ((_source$excerpts = source.excerpts) === null || _source$excerpts === void 0 ? void 0 : _source$excerpts.length) > 0 && /*#__PURE__*/React.createElement("details", {
      className: "rounded-lg border border-gray-100 p-2"
    }, /*#__PURE__*/React.createElement("summary", {
      className: "cursor-pointer text-[9px] text-gray-500"
    }, "\u6838\u5BF9\u5FC5\u8981\u539F\u6587"), /*#__PURE__*/React.createElement("div", {
      className: "mt-2 whitespace-pre-wrap text-[10px] leading-5 text-gray-600"
    }, source.excerpts.join('\n\n'))), /*#__PURE__*/React.createElement("div", {
      className: "flex justify-end gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return setEditing(true);
      },
      className: "rounded-lg border border-indigo-100 px-3 py-1.5 text-[10px] text-indigo-700"
    }, "\u4FEE\u6539"), /*#__PURE__*/React.createElement("button", {
      disabled: busy,
      onClick: function onClick() {
        return apply(function (client) {
          return client.withdrawCandidate(card.candidateId, reason || '由柒柒在电脑操作台撤回');
        });
      },
      className: "rounded-lg border border-red-100 px-3 py-1.5 text-[10px] text-red-600"
    }, "\u64A4\u56DE"))), error && /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-red-600"
    }, error));
  }
  function ReleaseWorkbench(_ref7) {
    var _vault$newCardCandida, _vault$pendingRevisio;
    var vault = _ref7.vault,
      onSaved = _ref7.onSaved;
    var release = vault === null || vault === void 0 ? void 0 : vault.releaseCandidate;
    var history = Array.isArray(vault === null || vault === void 0 ? void 0 : vault.releaseHistory) ? vault.releaseHistory : [];
    var pendingCount = ((vault === null || vault === void 0 || (_vault$newCardCandida = vault.newCardCandidates) === null || _vault$newCardCandida === void 0 ? void 0 : _vault$newCardCandida.length) || 0) + ((vault === null || vault === void 0 || (_vault$pendingRevisio = vault.pendingRevisions) === null || _vault$pendingRevisio === void 0 ? void 0 : _vault$pendingRevisio.length) || 0);
    var _React$useState41 = React.useState(false),
      _React$useState42 = _slicedToArray(_React$useState41, 2),
      busy = _React$useState42[0],
      setBusy = _React$useState42[1];
    var _React$useState43 = React.useState(''),
      _React$useState44 = _slicedToArray(_React$useState43, 2),
      error = _React$useState44[0],
      setError = _React$useState44[1];
    var apply = /*#__PURE__*/function () {
      var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(action) {
        var result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              setBusy(true);
              setError('');
              _context4.prev = 2;
              _context4.next = 5;
              return action(global.XingyueAgentClient.createMemoryVaultClient());
            case 5:
              result = _context4.sent;
              onSaved === null || onSaved === void 0 || onSaved(result.memoryVault);
              _context4.next = 12;
              break;
            case 9:
              _context4.prev = 9;
              _context4.t0 = _context4["catch"](2);
              setError((_context4.t0 === null || _context4.t0 === void 0 ? void 0 : _context4.t0.message) || String(_context4.t0));
            case 12:
              _context4.prev = 12;
              setBusy(false);
              return _context4.finish(12);
            case 15:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[2, 9, 12, 15]]);
      }));
      return function apply(_x2) {
        return _ref8.apply(this, arguments);
      };
    }();
    return /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-violet-100 bg-violet-50/70 p-3 space-y-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-xs font-semibold text-violet-900"
    }, "\u6A21\u5757\u7248\u672C\u6574\u7406\u53F0"), /*#__PURE__*/React.createElement("div", {
      className: "mt-1 text-[9px] text-violet-700"
    }, "\u5148\u5F62\u6210\u5DEE\u5F02\u5019\u9009\uFF1B\u5171\u540C\u786E\u8BA4\u524D\u4E0D\u4F1A\u6539\u53D8\u5F53\u524D\u6B63\u5F0F\u7248\u672C\u3002")), !release && /*#__PURE__*/React.createElement("button", {
      disabled: busy || !pendingCount,
      onClick: function onClick() {
        return apply(function (client) {
          return client.prepareRelease({
            trigger: 'manual'
          });
        });
      },
      className: "rounded-lg bg-violet-600 px-3 py-2 text-[10px] text-white disabled:opacity-40"
    }, "\u6574\u7406 ", pendingCount, " \u6761\u5019\u9009")), release && /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-violet-100 bg-white p-3 space-y-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xs font-semibold text-gray-800"
    }, "\u5F85\u786E\u8BA4 v", release.release.version, " \xB7 ", release.diffs.length, " \u9879\u53D8\u5316"), /*#__PURE__*/React.createElement("div", {
      className: "text-[9px] text-gray-500"
    }, "\u91C7\u7528\u65B0\u5361 ", release.adoptedCandidateIds.length, " \u6761 \xB7 \u4FEE\u8BA2 ", release.adoptedRevisionIds.length, " \u6761 \xB7 \u672A\u91C7\u7528 ", release.notAdoptedCandidateIds.length, " \u6761 \xB7 \u51B2\u7A81 ", release.conflicts.length, " \u6761 \xB7 \u672A\u51B3 ", release.unresolved.length, " \u6761"), /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", {
      className: "cursor-pointer text-[10px] text-violet-700"
    }, "\u67E5\u770B\u9010\u6761\u5DEE\u5F02"), /*#__PURE__*/React.createElement("div", {
      className: "mt-2 space-y-2"
    }, release.diffs.map(function (diff, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: "".concat(diff.cardId, "-").concat(index),
        className: "rounded-lg bg-gray-50 p-2 text-[10px] leading-5"
      }, /*#__PURE__*/React.createElement("b", null, diff.kind === 'add-card' ? '新增' : '修订', " \xB7 ", diff.title), diff.before && /*#__PURE__*/React.createElement("div", {
        className: "mt-1 text-red-500"
      }, "\u539F\uFF1A", diff.before), /*#__PURE__*/React.createElement("div", {
        className: "mt-1 text-emerald-700"
      }, "\u65B0\uFF1A", diff.after));
    }))), release.conflicts.length > 0 || release.unresolved.length > 0 ? /*#__PURE__*/React.createElement("div", {
      className: "rounded-lg bg-red-50 p-2 text-[10px] text-red-600"
    }, "\u4ECD\u6709\u51B2\u7A81\u6216\u672A\u51B3\u5F52\u7C7B\uFF0C\u8BF7\u5148\u4FEE\u6539\u5019\u9009\u540E\u91CD\u65B0\u6574\u7406\u3002") : /*#__PURE__*/React.createElement("button", {
      disabled: busy,
      onClick: function onClick() {
        return apply(function (client) {
          return client.confirmRelease({
            releaseCandidateId: release.releaseCandidateId,
            confirmationText: '柒柒与逸辰共同确认发布'
          });
        });
      },
      className: "rounded-lg bg-emerald-600 px-3 py-2 text-[10px] text-white"
    }, "\u5171\u540C\u786E\u8BA4\u5E76\u53D1\u5E03 v", release.release.version)), history.length > 1 && /*#__PURE__*/React.createElement("details", null, /*#__PURE__*/React.createElement("summary", {
      className: "cursor-pointer text-[10px] text-gray-600"
    }, "\u5386\u53F2\u7248\u672C\u4E0E\u6062\u590D"), /*#__PURE__*/React.createElement("div", {
      className: "mt-2 space-y-2"
    }, history.slice().reverse().map(function (item) {
      return /*#__PURE__*/React.createElement("div", {
        key: item.releaseId,
        className: "flex items-center justify-between gap-2 rounded-lg bg-white p-2 text-[10px]"
      }, /*#__PURE__*/React.createElement("span", null, "v", item.version, " \xB7 ", timeLabel(item.publishedAt), item.releaseKind === 'rollback' ? " \xB7 \u6062\u590D\u81EA v".concat(item.basedOnVersion) : ''), item.version !== vault.current.version && /*#__PURE__*/React.createElement("button", {
        disabled: busy,
        onClick: function onClick() {
          return apply(function (client) {
            return client.rollback(item.version, "\u67D2\u67D2\u4E0E\u9038\u8FB0\u5171\u540C\u786E\u8BA4\u6062\u590D v".concat(item.version));
          });
        },
        className: "rounded border border-gray-200 px-2 py-1 text-gray-600"
      }, "\u6062\u590D\u8FD9\u7248"));
    }))), error && /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-red-600"
    }, error));
  }
  function LocalPendingCandidateQueue() {
    var queueApi = global.XingyueMemoryCandidateIntent;
    var read = function read() {
      var _queueApi$readQueue;
      return (queueApi === null || queueApi === void 0 || (_queueApi$readQueue = queueApi.readQueue) === null || _queueApi$readQueue === void 0 ? void 0 : _queueApi$readQueue.call(queueApi)) || [];
    };
    var _React$useState45 = React.useState(read),
      _React$useState46 = _slicedToArray(_React$useState45, 2),
      items = _React$useState46[0],
      setItems = _React$useState46[1];
    var _React$useState47 = React.useState(false),
      _React$useState48 = _slicedToArray(_React$useState47, 2),
      busy = _React$useState48[0],
      setBusy = _React$useState48[1];
    var _React$useState49 = React.useState(''),
      _React$useState50 = _slicedToArray(_React$useState49, 2),
      notice = _React$useState50[0],
      setNotice = _React$useState50[1];
    var refresh = function refresh() {
      return setItems(read());
    };
    React.useEffect(function () {
      var _global$document2;
      var receive = function receive(event) {
        var _event$detail;
        return setItems(Array.isArray((_event$detail = event.detail) === null || _event$detail === void 0 ? void 0 : _event$detail.items) ? event.detail.items : read());
      };
      var visible = function visible() {
        var _global$document;
        if (!((_global$document = global.document) !== null && _global$document !== void 0 && _global$document.hidden)) refresh();
      };
      global.addEventListener('xingyue:memory-candidate-queue-updated', receive);
      (_global$document2 = global.document) === null || _global$document2 === void 0 || _global$document2.addEventListener('visibilitychange', visible);
      return function () {
        var _global$document3;
        global.removeEventListener('xingyue:memory-candidate-queue-updated', receive);
        (_global$document3 = global.document) === null || _global$document3 === void 0 || _global$document3.removeEventListener('visibilitychange', visible);
      };
    }, []);
    var retry = /*#__PURE__*/function () {
      var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
        var synced, _global$XingyueAgentC5, _global$XingyueAgentC6, client, _iterator, _step, item, result;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              if (items.length) {
                _context5.next = 2;
                break;
              }
              return _context5.abrupt("return");
            case 2:
              setBusy(true);
              setNotice('');
              synced = 0;
              _context5.prev = 5;
              client = (_global$XingyueAgentC5 = global.XingyueAgentClient) === null || _global$XingyueAgentC5 === void 0 || (_global$XingyueAgentC6 = _global$XingyueAgentC5.createMemoryVaultClient) === null || _global$XingyueAgentC6 === void 0 ? void 0 : _global$XingyueAgentC6.call(_global$XingyueAgentC5);
              if (client) {
                _context5.next = 9;
                break;
              }
              throw new Error('主机记忆仓接口暂不可用');
            case 9:
              _iterator = _createForOfIteratorHelper(read());
              _context5.prev = 10;
              _iterator.s();
            case 12:
              if ((_step = _iterator.n()).done) {
                _context5.next = 22;
                break;
              }
              item = _step.value;
              _context5.next = 16;
              return client.createConversationCandidate(item);
            case 16:
              result = _context5.sent;
              queueApi.remove(item.candidateId);
              synced += 1;
              if (result !== null && result !== void 0 && result.memoryVault) global.dispatchEvent(new global.CustomEvent('xingyue:memory-vault-updated', {
                detail: result.memoryVault
              }));
            case 20:
              _context5.next = 12;
              break;
            case 22:
              _context5.next = 27;
              break;
            case 24:
              _context5.prev = 24;
              _context5.t0 = _context5["catch"](10);
              _iterator.e(_context5.t0);
            case 27:
              _context5.prev = 27;
              _iterator.f();
              return _context5.finish(27);
            case 30:
              setNotice("\u5DF2\u8865\u4F20 ".concat(synced, " \u6761\u5230\u4E3B\u673A\u5F85\u6574\u7406\u533A"));
              _context5.next = 36;
              break;
            case 33:
              _context5.prev = 33;
              _context5.t1 = _context5["catch"](5);
              setNotice("\u8FD8\u6709 ".concat(read().length, " \u6761\u672A\u8865\u4F20\uFF1A").concat((_context5.t1 === null || _context5.t1 === void 0 ? void 0 : _context5.t1.message) || String(_context5.t1)));
            case 36:
              _context5.prev = 36;
              refresh();
              setBusy(false);
              return _context5.finish(36);
            case 40:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[5, 33, 36, 40], [10, 24, 27, 30]]);
      }));
      return function retry() {
        return _ref9.apply(this, arguments);
      };
    }();
    return /*#__PURE__*/React.createElement("section", {
      className: "rounded-xl border p-3 ".concat(items.length ? 'border-amber-200 bg-amber-50/80' : 'border-emerald-100 bg-emerald-50/60')
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center justify-between gap-2"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-xs font-semibold ".concat(items.length ? 'text-amber-900' : 'text-emerald-800')
    }, "\u672C\u673A\u5F85\u540C\u6B65\u8BB0\u5FC6 \xB7 ", items.length, " \u6761"), /*#__PURE__*/React.createElement("div", {
      className: "mt-1 text-[9px] leading-5 text-gray-500"
    }, "\u8FD9\u4E9B\u5185\u5BB9\u53EA\u5728\u5F53\u524D\u624B\u673A\uFF0F\u7F51\u9875\u91CC\uFF1B\u6210\u529F\u8FDB\u5165\u4E3B\u673A\u540E\u624D\u4F1A\u4ECE\u8FD9\u91CC\u79FB\u9664\u3002")), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: refresh,
      className: "rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[10px] text-gray-600"
    }, "\u5237\u65B0"), /*#__PURE__*/React.createElement("button", {
      disabled: busy || !items.length,
      onClick: retry,
      className: "rounded-lg bg-amber-600 px-3 py-1.5 text-[10px] text-white disabled:opacity-40"
    }, busy ? '补传中…' : '立即补传'))), notice && /*#__PURE__*/React.createElement("div", {
      className: "mt-2 rounded-lg bg-white/80 p-2 text-[10px] text-gray-600"
    }, notice), items.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "mt-3 space-y-2"
    }, items.map(function (item, index) {
      return /*#__PURE__*/React.createElement("details", {
        key: item.candidateId || index,
        className: "rounded-lg border border-amber-100 bg-white p-2"
      }, /*#__PURE__*/React.createElement("summary", {
        className: "cursor-pointer text-[11px] font-medium text-gray-800"
      }, item.title || "\u672A\u547D\u540D\u5019\u9009 ".concat(index + 1)), /*#__PURE__*/React.createElement("div", {
        className: "mt-2 whitespace-pre-wrap text-[10px] leading-5 text-gray-700"
      }, item.body || '没有可显示的正文'), /*#__PURE__*/React.createElement("div", {
        className: "mt-2 text-[9px] text-gray-400"
      }, "\u5EFA\u8BAE\u4E66\u67B6\uFF1A", item.targetModuleTitle || '等待归类', item.createdAt ? " \xB7 ".concat(timeLabel(item.createdAt)) : ''));
    })));
  }
  function PortableWorldbookPanel(_ref10) {
    var _global$xingyueDeskto, _worldbook$current, _worldbook$current2;
    var worldbook = _ref10.worldbook,
      replicaStatus = _ref10.replicaStatus;
    var desktop = typeof ((_global$xingyueDeskto = global.xingyueDesktop) === null || _global$xingyueDeskto === void 0 ? void 0 : _global$xingyueDeskto.requestLocalAgent) === 'function';
    var _React$useState51 = React.useState(null),
      _React$useState52 = _slicedToArray(_React$useState51, 2),
      managedVault = _React$useState52[0],
      setManagedVault = _React$useState52[1];
    var _React$useState53 = React.useState(''),
      _React$useState54 = _slicedToArray(_React$useState53, 2),
      manageError = _React$useState54[0],
      setManageError = _React$useState54[1];
    React.useEffect(function () {
      var _global$XingyueAgentC7;
      if (!desktop || !((_global$XingyueAgentC7 = global.XingyueAgentClient) !== null && _global$XingyueAgentC7 !== void 0 && _global$XingyueAgentC7.createMemoryVaultClient)) return undefined;
      var cancelled = false;
      global.XingyueAgentClient.createMemoryVaultClient().read().then(function (value) {
        if (!cancelled) setManagedVault(value);
      })["catch"](function (reason) {
        if (!cancelled) setManageError((reason === null || reason === void 0 ? void 0 : reason.message) || String(reason));
      });
      return function () {
        cancelled = true;
      };
    }, [desktop, worldbook === null || worldbook === void 0 || (_worldbook$current = worldbook.current) === null || _worldbook$current === void 0 ? void 0 : _worldbook$current.version, worldbook === null || worldbook === void 0 || (_worldbook$current2 = worldbook.current) === null || _worldbook$current2 === void 0 ? void 0 : _worldbook$current2.contentHash]);
    React.useEffect(function () {
      var receive = function receive(event) {
        return setManagedVault(event.detail || null);
      };
      global.addEventListener('xingyue:memory-vault-updated', receive);
      return function () {
        return global.removeEventListener('xingyue:memory-vault-updated', receive);
      };
    }, []);
    var visibleVault = desktop && managedVault ? managedVault : worldbook;
    var current = visibleVault === null || visibleVault === void 0 ? void 0 : visibleVault.current;
    var modules = Array.isArray(current === null || current === void 0 ? void 0 : current.modules) ? current.modules : [];
    var revisions = Array.isArray(managedVault === null || managedVault === void 0 ? void 0 : managedVault.pendingRevisions) ? managedVault.pendingRevisions : [];
    var newCards = Array.isArray(managedVault === null || managedVault === void 0 ? void 0 : managedVault.newCardCandidates) ? managedVault.newCardCandidates : [];
    var acceptVault = function acceptVault(value) {
      var _worldbook$current3;
      setManagedVault(value);
      if (value !== null && value !== void 0 && value.current && value.current.version !== (worldbook === null || worldbook === void 0 || (_worldbook$current3 = worldbook.current) === null || _worldbook$current3 === void 0 ? void 0 : _worldbook$current3.version) && global.XingyuePortableWorldbook) {
        var replica = global.XingyuePortableWorldbook.saveCache(value, global.localStorage, 'host');
        global.dispatchEvent(new CustomEvent('xingyue:portable-worldbook-published', {
          detail: replica
        }));
      }
    };
    var revisionByCard = new Map(revisions.map(function (item) {
      return [item.cardId, item];
    }));
    var statusColor = (replicaStatus === null || replicaStatus === void 0 ? void 0 : replicaStatus.state) === 'conflict' || (replicaStatus === null || replicaStatus === void 0 ? void 0 : replicaStatus.state) === 'error' ? 'text-red-600 bg-red-50 border-red-100' : (replicaStatus === null || replicaStatus === void 0 ? void 0 : replicaStatus.state) === 'synced' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-sky-700 bg-sky-50 border-sky-100';
    return /*#__PURE__*/React.createElement("section", {
      className: "rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-4 shadow-sm space-y-4"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "text-sm font-semibold text-gray-900"
    }, "\u661F\u6708\u8BB0\u5FC6\u4ED3"), /*#__PURE__*/React.createElement("p", {
      className: "mt-1 text-[10px] text-sky-700"
    }, "\u8BB0\u5FC6\u4ED3\u968F\u8BBE\u5907\u4FDD\u5B58\uFF0C\u4F46\u4E0D\u4F1A\u6574\u4ED3\u585E\u8FDB\u6BCF\u8F6E\u804A\u5929\uFF1B\u53EA\u5728\u76F8\u5173\u60C5\u5883\u4E2D\u53D6\u51FA\u6709\u9650\u8BB0\u5FC6\u5361\u7247\u3002")), /*#__PURE__*/React.createElement(LocalPendingCandidateQueue, null), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border p-3 text-[10px] ".concat(statusColor)
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-medium"
    }, (replicaStatus === null || replicaStatus === void 0 ? void 0 : replicaStatus.label) || '等待记忆仓副本'), (replicaStatus === null || replicaStatus === void 0 ? void 0 : replicaStatus.error) && /*#__PURE__*/React.createElement("div", {
      className: "mt-1 opacity-80"
    }, replicaStatus.error)), current ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 md:grid-cols-4 gap-2 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl bg-white/90 p-3 border border-white"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-base font-semibold text-indigo-700"
    }, "v", current.version), /*#__PURE__*/React.createElement("div", {
      className: "text-[9px] text-gray-500"
    }, "\u8BB0\u5FC6\u4ED3\u7248\u672C")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl bg-white/90 p-3 border border-white"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-base font-semibold text-sky-700"
    }, current.moduleCount || modules.length), /*#__PURE__*/React.createElement("div", {
      className: "text-[9px] text-gray-500"
    }, "\u4E3B\u9898\u4E66\u67B6")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl bg-white/90 p-3 border border-white"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-base font-semibold text-purple-700"
    }, current.cardCount || 0), /*#__PURE__*/React.createElement("div", {
      className: "text-[9px] text-gray-500"
    }, "\u8BB0\u5FC6\u5361\u7247")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl bg-white/90 p-3 border border-white"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xs font-semibold text-gray-700"
    }, shortHash(current.contentHash)), /*#__PURE__*/React.createElement("div", {
      className: "text-[9px] text-gray-500"
    }, "\u5185\u5BB9\u6307\u7EB9"))), desktop ? /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, manageError && /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl bg-red-50 p-3 text-[10px] text-red-600"
    }, manageError), /*#__PURE__*/React.createElement(NewMemoryCard, {
      modules: modules,
      onSaved: acceptVault
    }), /*#__PURE__*/React.createElement(ReleaseWorkbench, {
      vault: managedVault,
      onSaved: acceptVault
    }), newCards.length > 0 && /*#__PURE__*/React.createElement("details", {
      open: true,
      className: "rounded-xl border border-amber-100 bg-amber-50/70 p-3"
    }, /*#__PURE__*/React.createElement("summary", {
      className: "cursor-pointer text-xs font-medium text-amber-800"
    }, "\u5F85\u6574\u7406\u7684\u65B0\u8BB0\u5FC6\u5361\u7247 ", /*#__PURE__*/React.createElement("span", {
      className: "ml-1 text-[9px] font-normal"
    }, newCards.length, " \u5F20")), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 space-y-2"
    }, newCards.map(function (card) {
      return /*#__PURE__*/React.createElement(IncrementalCandidate, {
        key: card.candidateId,
        card: card,
        modules: modules,
        onSaved: acceptVault
      });
    }))), revisions.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-amber-100 bg-amber-50 p-3 text-[10px] text-amber-700"
    }, "\u5F53\u524D\u6709 ", revisions.length, " \u6761\u5F85\u6574\u7406\u4FEE\u8BA2\uFF1B\u5B83\u4EEC\u5C1A\u672A\u6539\u53D8\u6B63\u5F0F v", current.version, "\u3002"), modules.map(function (module) {
      return /*#__PURE__*/React.createElement("details", {
        key: module.moduleId,
        className: "rounded-xl border border-sky-100 bg-white/80 p-3"
      }, /*#__PURE__*/React.createElement("summary", {
        className: "cursor-pointer text-xs font-medium text-sky-800"
      }, module.title, /*#__PURE__*/React.createElement("span", {
        className: "ml-2 text-[9px] font-normal text-gray-400"
      }, module.cardCount, " \u5F20\u8BB0\u5FC6\u5361\u7247")), /*#__PURE__*/React.createElement("div", {
        className: "mt-3 space-y-3"
      }, (module.cards || []).map(function (card) {
        return /*#__PURE__*/React.createElement(MemoryCard, {
          key: card.cardId,
          card: card,
          moduleId: module.moduleId,
          revision: revisionByCard.get(card.cardId),
          onSaved: acceptVault
        });
      })));
    })) : /*#__PURE__*/React.createElement("details", {
      className: "rounded-xl border border-sky-100 bg-white/80 p-3"
    }, /*#__PURE__*/React.createElement("summary", {
      className: "cursor-pointer text-xs font-medium text-sky-800"
    }, "\u67E5\u770B\u4E3B\u9898\u4E66\u67B6"), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 grid gap-2"
    }, modules.map(function (module) {
      return /*#__PURE__*/React.createElement("div", {
        key: module.moduleId,
        className: "rounded-lg border border-gray-100 bg-gray-50 p-2"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-[11px] font-medium text-gray-800"
      }, module.title), /*#__PURE__*/React.createElement("div", {
        className: "mt-1 text-[9px] text-gray-500"
      }, module.cardCount, " \u5F20\u8BB0\u5FC6\u5361\u7247"));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "text-[9px] text-gray-400"
    }, "\u53D1\u5E03\uFF1A", timeLabel(current.publishedAt), " \xB7 ", current.releaseId), visibleVault.pendingCandidate && /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-amber-100 bg-amber-50 p-3 text-[10px] text-amber-700"
    }, "\u53D1\u73B0\u6765\u6E90\u53D8\u5316\uFF0C\u5DF2\u751F\u6210 v", visibleVault.pendingCandidate.version, " \u5019\u9009\uFF1B\u5F53\u524D\u4ECD\u4FDD\u6301 v", current.version, "\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u53D1\u5E03\u3002")) : /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-dashed border-sky-200 bg-white/70 p-5 text-center text-xs text-gray-500"
    }, "\u8FD9\u53F0\u8BBE\u5907\u8FD8\u6CA1\u6709\u661F\u6708\u8BB0\u5FC6\u4ED3\u526F\u672C\u3002\u4E3B\u673A\u8FDE\u63A5\u6216\u4E91\u7AEF\u6062\u590D\u540E\u4F1A\u663E\u793A\u4E3B\u9898\u4E66\u67B6\u3002"));
  }
  global.XingyuePortableWorldbookPanel = PortableWorldbookPanel;
})(window);
