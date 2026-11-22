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
(function () {
  var STATUS = {
    queued: ['排队中', 'bg-sky-50 text-sky-700 border-sky-200'],
    running: ['运行中', 'bg-blue-50 text-blue-700 border-blue-200'],
    'waiting-confirmation': ['等待确认', 'bg-amber-50 text-amber-700 border-amber-200'],
    paused: ['已暂停', 'bg-violet-50 text-violet-700 border-violet-200'],
    succeeded: ['已完成', 'bg-emerald-50 text-emerald-700 border-emerald-200'],
    failed: ['失败', 'bg-rose-50 text-rose-700 border-rose-200'],
    stopped: ['已停止', 'bg-gray-100 text-gray-600 border-gray-200'],
    cancelled: ['已停止', 'bg-gray-100 text-gray-600 border-gray-200']
  };
  var dateText = function dateText(value) {
    var parsed = Date.parse(value || '');
    return Number.isFinite(parsed) ? new Date(parsed).toLocaleString('zh-CN', {
      hour12: false
    }) : '';
  };
  var TaskCenterPanel = function TaskCenterPanel(_ref) {
    var _summary$counts, _summary$counts2;
    var hostOnline = _ref.hostOnline,
      showToast = _ref.showToast,
      Icon = _ref.Icon;
    var _React$useState = React.useState([]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      tasks = _React$useState2[0],
      setTasks = _React$useState2[1];
    var _React$useState3 = React.useState(null),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      summary = _React$useState4[0],
      setSummary = _React$useState4[1];
    var _React$useState5 = React.useState([]),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      grants = _React$useState6[0],
      setGrants = _React$useState6[1];
    var _React$useState7 = React.useState(null),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      codex = _React$useState8[0],
      setCodex = _React$useState8[1];
    var _React$useState9 = React.useState(false),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      loading = _React$useState10[0],
      setLoading = _React$useState10[1];
    var _React$useState11 = React.useState(''),
      _React$useState12 = _slicedToArray(_React$useState11, 2),
      busyId = _React$useState12[0],
      setBusyId = _React$useState12[1];
    var _React$useState13 = React.useState(''),
      _React$useState14 = _slicedToArray(_React$useState13, 2),
      error = _React$useState14[0],
      setError = _React$useState14[1];
    var refresh = React.useCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var _window$XingyueAgentC;
      var quiet,
        client,
        _yield$Promise$all,
        _yield$Promise$all2,
        taskResult,
        authorizations,
        codexStatus,
        _args = arguments;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            quiet = _args.length > 0 && _args[0] !== undefined ? _args[0] : false;
            if (!(!hostOnline || !((_window$XingyueAgentC = window.XingyueAgentClient) !== null && _window$XingyueAgentC !== void 0 && _window$XingyueAgentC.createTaskCenterClient))) {
              _context.next = 3;
              break;
            }
            return _context.abrupt("return");
          case 3:
            if (!quiet) setLoading(true);
            _context.prev = 4;
            client = window.XingyueAgentClient.createTaskCenterClient();
            _context.next = 8;
            return Promise.all([client.list(), client.listAuthorizations(), client.codexStatus(!quiet)["catch"](function () {
              return null;
            })]);
          case 8:
            _yield$Promise$all = _context.sent;
            _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 3);
            taskResult = _yield$Promise$all2[0];
            authorizations = _yield$Promise$all2[1];
            codexStatus = _yield$Promise$all2[2];
            setTasks(taskResult.tasks || []);
            setSummary(taskResult.summary || null);
            setGrants(authorizations || []);
            setCodex(codexStatus || null);
            setError('');
            _context.next = 23;
            break;
          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](4);
            setError((_context.t0 === null || _context.t0 === void 0 ? void 0 : _context.t0.message) || '任务中心读取失败');
          case 23:
            _context.prev = 23;
            if (!quiet) setLoading(false);
            return _context.finish(23);
          case 26:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[4, 20, 23, 26]]);
    })), [hostOnline]);
    React.useEffect(function () {
      void refresh();
      var timer = setInterval(function () {
        return void refresh(true);
      }, 3000);
      return function () {
        return clearInterval(timer);
      };
    }, [refresh]);
    var control = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(task, action) {
        var client, result;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              setBusyId(task.id);
              _context2.prev = 1;
              client = window.XingyueAgentClient.createTaskCenterClient();
              if (!(action === 'stop')) {
                _context2.next = 9;
                break;
              }
              _context2.next = 6;
              return client.stop(task.id);
            case 6:
              _context2.t0 = _context2.sent;
              _context2.next = 12;
              break;
            case 9:
              _context2.next = 11;
              return client.resume(task.id);
            case 11:
              _context2.t0 = _context2.sent;
            case 12:
              result = _context2.t0;
              setTasks(result.tasks || []);
              setSummary(result.summary || null);
              showToast(action === 'stop' ? '任务已停止' : '任务已继续');
              _context2.next = 21;
              break;
            case 18:
              _context2.prev = 18;
              _context2.t1 = _context2["catch"](1);
              showToast((_context2.t1 === null || _context2.t1 === void 0 ? void 0 : _context2.t1.message) || '任务操作失败');
            case 21:
              _context2.prev = 21;
              setBusyId('');
              return _context2.finish(21);
            case 24:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[1, 18, 21, 24]]);
      }));
      return function control(_x, _x2) {
        return _ref3.apply(this, arguments);
      };
    }();
    var revoke = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(grant) {
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (confirm("\u64A4\u9500\u201C".concat(grant.label || grant.id, "\u201D\u7684\u6301\u7EED\u6587\u4EF6\u6388\u6743\uFF1F\u64A4\u9500\u540E\u4E3B\u673A Agent \u5C06\u4E0D\u80FD\u518D\u8BFB\u53D6\u8FD9\u4E2A\u8303\u56F4\uFF0C\u4E5F\u4E0D\u80FD\u518D\u53D1\u8D77\u9010\u6B21\u786E\u8BA4\u5199\u5165\u3002"))) {
                _context3.next = 2;
                break;
              }
              return _context3.abrupt("return");
            case 2:
              setBusyId(grant.id);
              _context3.prev = 3;
              _context3.next = 6;
              return window.XingyueAgentClient.createTaskCenterClient().revokeAuthorization(grant.id);
            case 6:
              _context3.next = 8;
              return refresh(true);
            case 8:
              showToast('持续授权已撤销');
              _context3.next = 14;
              break;
            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](3);
              showToast((_context3.t0 === null || _context3.t0 === void 0 ? void 0 : _context3.t0.message) || '授权撤销失败');
            case 14:
              _context3.prev = 14;
              setBusyId('');
              return _context3.finish(14);
            case 17:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[3, 11, 14, 17]]);
      }));
      return function revoke(_x3) {
        return _ref4.apply(this, arguments);
      };
    }();
    if (!hostOnline) return /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-500"
    }, "\u672C\u5730\u4E3B\u673A\u79BB\u7EBF\uFF0C\u4EFB\u52A1\u4E0D\u4F1A\u5728\u540E\u53F0\u5077\u5077\u8FD0\u884C\u3002\u91CD\u65B0\u6253\u5F00\u7535\u8111\u7AEF\u540E\u53EF\u5728\u8FD9\u91CC\u67E5\u770B\u6062\u590D\u72B6\u6001\u3002");
    var active = Number((summary === null || summary === void 0 ? void 0 : summary.active) || 0);
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start justify-between gap-4"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "text-sm font-semibold text-gray-800"
    }, "\u4EFB\u52A1\u4E2D\u5FC3"), /*#__PURE__*/React.createElement("p", {
      className: "mt-1 text-xs leading-relaxed text-gray-500"
    }, "\u7EDF\u4E00\u663E\u793A\u4E3B\u673A\u5DE5\u5177\u3001\u6587\u4EF6\u3001\u8BB0\u5FC6\u548C\u7F51\u9875\u4EFB\u52A1\u3002\u5173\u95ED\u6216\u91CD\u542F\u540E\uFF0C\u672A\u5B8C\u6210\u7684\u5B89\u5168\u4EFB\u52A1\u4F1A\u8F6C\u4E3A\u201C\u5DF2\u6682\u505C\u201D\uFF0C\u4E0D\u4F1A\u4F2A\u88C5\u6210\u4ECD\u5728\u8FD0\u884C\u3002")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return refresh();
      },
      disabled: loading,
      className: "flex-shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50"
    }, loading ? '刷新中…' : '刷新')), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-blue-100 bg-blue-50 p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xl font-semibold text-blue-700"
    }, active), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-blue-600"
    }, "\u6B63\u5728\u6267\u884C")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-emerald-100 bg-emerald-50 p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xl font-semibold text-emerald-700"
    }, (summary === null || summary === void 0 || (_summary$counts = summary.counts) === null || _summary$counts === void 0 ? void 0 : _summary$counts.succeeded) || 0), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-emerald-600"
    }, "\u5DF2\u5B8C\u6210")), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-violet-100 bg-violet-50 p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xl font-semibold text-violet-700"
    }, (summary === null || summary === void 0 || (_summary$counts2 = summary.counts) === null || _summary$counts2 === void 0 ? void 0 : _summary$counts2.paused) || 0), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-violet-600"
    }, "\u53EF\u7EE7\u7EED"))), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border p-3 ".concat(codex !== null && codex !== void 0 && codex.available && codex !== null && codex !== void 0 && codex.authenticated ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50')
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-medium text-gray-800"
    }, "Codex \u6267\u884C\u5DE5\u4F5C\u5BA4"), /*#__PURE__*/React.createElement("div", {
      className: "mt-1 text-[11px] text-gray-600"
    }, codex !== null && codex !== void 0 && codex.available && codex !== null && codex !== void 0 && codex.authenticated ? "\u5DF2\u8FDE\u63A5 \xB7 ".concat(codex.version || 'Codex', " \xB7 \u590D\u7528\u5F53\u524D ChatGPT \u767B\u5F55") : codex !== null && codex !== void 0 && codex.available ? 'Codex 已安装，但当前登录不可用' : '正在检查 Codex 桌面运行时')), /*#__PURE__*/React.createElement("span", {
      className: "rounded-full px-2 py-1 text-[10px] font-medium ".concat(codex !== null && codex !== void 0 && codex.available && codex !== null && codex !== void 0 && codex.authenticated ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')
    }, codex !== null && codex !== void 0 && codex.available && codex !== null && codex !== void 0 && codex.authenticated ? '可委托' : '未就绪'))), error && /*#__PURE__*/React.createElement("div", {
      className: "rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"
    }, error), /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, tasks.length === 0 && !loading ? /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400"
    }, "\u8FD8\u6CA1\u6709\u540E\u53F0\u4EFB\u52A1\u3002\u65E0\u4EFB\u52A1\u65F6\u4E0D\u4F1A\u8C03\u7528\u6A21\u578B\uFF0C\u4E5F\u4E0D\u4F1A\u4EA7\u751F API \u8D39\u7528\u3002") : tasks.slice(0, 50).map(function (task) {
      var status = STATUS[task.status] || [task.status, 'bg-gray-100 text-gray-600 border-gray-200'];
      var stoppable = ['queued', 'running', 'waiting-confirmation'].includes(task.status);
      var resumable = task.resumable && ['paused', 'stopped', 'failed'].includes(task.status);
      return /*#__PURE__*/React.createElement("div", {
        key: task.id,
        className: "rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-start justify-between gap-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "min-w-0"
      }, /*#__PURE__*/React.createElement("div", {
        className: "truncate text-sm font-medium text-gray-800"
      }, task.title || task.toolName || task.type), /*#__PURE__*/React.createElement("div", {
        className: "mt-1 text-[11px] text-gray-500"
      }, task.progress || '等待状态更新')), /*#__PURE__*/React.createElement("span", {
        className: "flex-shrink-0 rounded-full border px-2 py-1 text-[10px] font-medium ".concat(status[1])
      }, status[0])), Number.isFinite(Number(task.percent)) && /*#__PURE__*/React.createElement("div", {
        className: "mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100"
      }, /*#__PURE__*/React.createElement("div", {
        className: "h-full bg-blue-500",
        style: {
          width: "".concat(Math.max(0, Math.min(100, Number(task.percent))), "%")
        }
      })), /*#__PURE__*/React.createElement("div", {
        className: "mt-2 flex items-center justify-between gap-3 text-[10px] text-gray-400"
      }, /*#__PURE__*/React.createElement("span", null, dateText(task.updatedAt)), /*#__PURE__*/React.createElement("div", {
        className: "flex gap-2"
      }, stoppable && /*#__PURE__*/React.createElement("button", {
        type: "button",
        disabled: busyId === task.id,
        onClick: function onClick() {
          return control(task, 'stop');
        },
        className: "rounded-md border border-rose-200 px-2 py-1 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
      }, "\u505C\u6B62"), resumable && /*#__PURE__*/React.createElement("button", {
        type: "button",
        disabled: busyId === task.id,
        onClick: function onClick() {
          return control(task, 'resume');
        },
        className: "rounded-md border border-violet-200 px-2 py-1 text-violet-700 hover:bg-violet-50 disabled:opacity-50"
      }, "\u7EE7\u7EED"))), task.externalTaskId && /*#__PURE__*/React.createElement("div", {
        className: "mt-2 truncate text-[10px] text-gray-400"
      }, "Codex \u4EFB\u52A1\uFF1A", task.externalTaskId));
    })), /*#__PURE__*/React.createElement("div", {
      className: "border-t border-gray-100 pt-5"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "text-sm font-semibold text-gray-800"
    }, "\u6301\u7EED\u6388\u6743"), /*#__PURE__*/React.createElement("p", {
      className: "mt-1 text-xs text-gray-500"
    }, "\u8FD9\u91CC\u53EA\u663E\u793A\u5DF2\u7531\u7535\u8111\u7AEF\u660E\u786E\u6388\u4E88\u7684\u8303\u56F4\uFF1B\u6A21\u578B\u548C\u624B\u673A\u4E0D\u80FD\u81EA\u884C\u6269\u5927\u6388\u6743\u3002\u6587\u4EF6\u5199\u5165\u4ECD\u4F1A\u9010\u6B21\u663E\u793A\u5DEE\u5F02\u5E76\u8BF7\u4F60\u786E\u8BA4\u3002"), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 space-y-2"
    }, grants.map(function (grant) {
      return /*#__PURE__*/React.createElement("div", {
        key: grant.id,
        className: "flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "text-sm font-medium text-gray-700"
      }, grant.label || grant.id), /*#__PURE__*/React.createElement("div", {
        className: "mt-1 text-[10px] text-gray-500"
      }, grant.scopeMode === 'persistent' ? '持续授权' : '临时授权', " \xB7 ", (grant.permissions || []).join(' / '), " \xB7 ", grant.status === 'active' ? '有效' : '已撤销')), grant.status === 'active' && /*#__PURE__*/React.createElement("button", {
        type: "button",
        disabled: busyId === grant.id,
        onClick: function onClick() {
          return revoke(grant);
        },
        className: "rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-600 hover:border-rose-300 hover:text-rose-600 disabled:opacity-50"
      }, "\u64A4\u9500"));
    }))));
  };
  window.XingyueTaskCenter = {
    TaskCenterPanel: TaskCenterPanel
  };
})();
