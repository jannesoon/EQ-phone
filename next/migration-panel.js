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
(function initMigrationPanel(global) {
  'use strict';

  function MigrationPanel(_ref) {
    var Icon = _ref.Icon;
    var _React$useState = React.useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      job = _React$useState2[0],
      setJob = _React$useState2[1];
    var _React$useState3 = React.useState(''),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      error = _React$useState4[0],
      setError = _React$useState4[1];
    var _React$useState5 = React.useState(''),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      sourceName = _React$useState6[0],
      setSourceName = _React$useState6[1];
    var running = (job === null || job === void 0 ? void 0 : job.status) === 'queued' || (job === null || job === void 0 ? void 0 : job.status) === 'running';
    var result = (job === null || job === void 0 ? void 0 : job.result) || null;
    var request = function request(payload) {
      return global.xingyueDesktop.requestLocalAgent(payload);
    };
    var waitForJob = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(jobId) {
        var deadline, _response$data, _response$data2, response;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              deadline = Date.now() + 120000;
            case 1:
              if (!(Date.now() < deadline)) {
                _context.next = 16;
                break;
              }
              _context.next = 4;
              return request({
                path: "/api/migration/jobs/".concat(jobId),
                method: 'GET'
              });
            case 4:
              response = _context.sent;
              if (!(!response.ok || !((_response$data = response.data) !== null && _response$data !== void 0 && _response$data.job))) {
                _context.next = 7;
                break;
              }
              throw new Error(((_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : _response$data2.error) || '无法读取预览进度');
            case 7:
              setJob(response.data.job);
              if (!(response.data.job.status === 'succeeded')) {
                _context.next = 10;
                break;
              }
              return _context.abrupt("return");
            case 10:
              if (!(response.data.job.status === 'failed')) {
                _context.next = 12;
                break;
              }
              throw new Error(response.data.job.error || '预览失败');
            case 12:
              _context.next = 14;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 350);
              });
            case 14:
              _context.next = 1;
              break;
            case 16:
              throw new Error('预览时间过长，已停止等待；正式数据没有变化');
            case 17:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function waitForJob(_x) {
        return _ref2.apply(this, arguments);
      };
    }();
    var chooseSource = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var _started$data, _started$data2, selected, started;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              setError('');
              setJob(null);
              _context2.prev = 2;
              _context2.next = 5;
              return global.xingyueDesktop.pickMigrationSource();
            case 5:
              selected = _context2.sent;
              if (selected !== null && selected !== void 0 && selected.path) {
                _context2.next = 8;
                break;
              }
              return _context2.abrupt("return");
            case 8:
              setSourceName(selected.path.split(/[\\/]/).pop());
              _context2.next = 11;
              return request({
                path: '/api/migration/preview',
                method: 'POST',
                body: {
                  path: selected.path
                }
              });
            case 11:
              started = _context2.sent;
              if (!(!started.ok || !((_started$data = started.data) !== null && _started$data !== void 0 && _started$data.jobId))) {
                _context2.next = 14;
                break;
              }
              throw new Error(((_started$data2 = started.data) === null || _started$data2 === void 0 ? void 0 : _started$data2.error) || '没有开始迁移预览');
            case 14:
              setJob({
                status: 'queued',
                progress: '准备只读分析测试副本…',
                percent: 0
              });
              _context2.next = 17;
              return waitForJob(started.data.jobId);
            case 17:
              _context2.next = 22;
              break;
            case 19:
              _context2.prev = 19;
              _context2.t0 = _context2["catch"](2);
              setError(_context2.t0.message || '预览失败；正式数据没有变化');
            case 22:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[2, 19]]);
      }));
      return function chooseSource() {
        return _ref3.apply(this, arguments);
      };
    }();
    var metric = function metric(label, value) {
      var tone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'text-gray-800';
      return /*#__PURE__*/React.createElement("div", {
        className: "rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-xl font-semibold ".concat(tone)
      }, value !== null && value !== void 0 ? value : 0), /*#__PURE__*/React.createElement("div", {
        className: "text-[11px] text-gray-500 mt-0.5"
      }, label));
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-blue-100 bg-blue-50/70 p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Search",
      size: 20,
      className: "text-blue-600 mt-0.5"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "text-sm font-semibold text-gray-800"
    }, "\u65E7\u6570\u636E\u8FC1\u79FB\u9884\u89C8"), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-600 mt-1 leading-relaxed"
    }, "\u53EA\u8BFB\u53D6\u8BBE\u5907\u8FC1\u79FB\u5305\u3001\u6D4F\u89C8\u5668 JSON \u5907\u4EFD\u6216\u65E7 SQLite \u6D4B\u8BD5\u526F\u672C\uFF0C\u7EDF\u8BA1\u5185\u5BB9\u548C\u51B2\u7A81\u3002\u672C\u9875\u6CA1\u6709\u5BFC\u5165\u6309\u94AE\uFF0C\u4E0D\u4F1A\u6539\u52A8\u73B0\u6709\u804A\u5929\u3001\u65E7\u6587\u4EF6\u6216\u6B63\u5F0F\u4E3B\u673A\u6570\u636E\u3002"), /*#__PURE__*/React.createElement("button", {
      disabled: running,
      onClick: chooseSource,
      className: "mt-3 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium flex items-center gap-2"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "FolderOpen",
      size: 16
    }), " ", running ? '正在只读分析…' : '选择测试副本并预览'), sourceName && /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-gray-500 mt-2"
    }, "\u5F53\u524D\u6765\u6E90\uFF1A", sourceName)))), job && running && /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-amber-100 bg-amber-50 p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between text-xs text-amber-800"
    }, /*#__PURE__*/React.createElement("span", null, job.progress), /*#__PURE__*/React.createElement("span", null, job.percent || 0, "%")), /*#__PURE__*/React.createElement("div", {
      className: "h-2 bg-amber-100 rounded-full mt-2 overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full bg-amber-500 transition-all",
      style: {
        width: "".concat(job.percent || 4, "%")
      }
    })), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-amber-700 mt-2"
    }, "\u53EA\u8BFB\u5904\u7406\u4E2D\u3002\u5373\u4F7F\u5173\u95ED\u672C\u9875\uFF0C\u6B63\u5F0F\u6570\u636E\u4E5F\u4E0D\u4F1A\u88AB\u5199\u5165\u3002")), error && /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
    }, error, /*#__PURE__*/React.createElement("div", {
      className: "text-xs mt-1"
    }, "\u6B63\u5F0F\u6570\u636E\u6CA1\u6709\u53D8\u5316\u3002")), result && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-emerald-100 bg-emerald-50 p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-semibold text-emerald-800"
    }, "\u2713 \u9884\u89C8\u5B8C\u6210 \xB7 \u6CA1\u6709\u6267\u884C\u5BFC\u5165"), /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-emerald-700 mt-1"
    }, result.source.type, "\uFF1A", result.source.name)), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 md:grid-cols-4 gap-2"
    }, metric('聊天窗口', result.summary.sessions), metric('消息', result.summary.messages), metric('图片', result.summary.images), metric('其他附件', result.summary.attachments), metric('重复项', result.summary.duplicates, 'text-amber-600'), metric('冲突项', result.summary.conflicts, 'text-red-600'), metric('健康记录（天）', result.summary.healthDays), metric('记忆文件', result.summary.memoryFiles)), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-purple-100 bg-purple-50/60 p-4"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "text-sm font-semibold text-purple-800"
    }, "\u8BB0\u5FC6\u6570\u636E\u6838\u5BF9"), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-2 mt-3"
    }, metric('人设档案 PP', result.memoryAudit.corePersonality), metric('长期记忆', result.memoryAudit.longTermMemories), metric('日志归档', result.memoryAudit.journalArchives)), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-purple-700 mt-3"
    }, result.memoryAudit.note)), (result.conflicts.length > 0 || result.duplicates.length > 0) && /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-gray-200 bg-white p-4"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "text-sm font-semibold text-gray-800"
    }, "\u91CD\u590D\u4E0E\u51B2\u7A81\u6E05\u5355"), /*#__PURE__*/React.createElement("div", {
      className: "mt-2 space-y-2 max-h-56 overflow-y-auto"
    }, result.conflicts.map(function (item, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: "c-".concat(index),
        className: "text-xs p-2 rounded bg-red-50 text-red-700"
      }, /*#__PURE__*/React.createElement("b", null, "\u51B2\u7A81\uFF1A"), item.title, " \xB7 ", item.reason);
    }), result.duplicates.map(function (item, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: "d-".concat(index),
        className: "text-xs p-2 rounded bg-amber-50 text-amber-700"
      }, /*#__PURE__*/React.createElement("b", null, "\u91CD\u590D\uFF1A"), item.title, " \xB7 ", item.reason);
    }))), /*#__PURE__*/React.createElement("div", {
      className: "text-center text-xs text-gray-500 py-2"
    }, result.notice)));
  }
  global.XingyueMigrationPanel = MigrationPanel;
})(window);
