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
(function initDevicePairingPanel(global, _global$XINGYUE_MOBIL) {
  'use strict';

  var mobileManualHandoff = ((_global$XINGYUE_MOBIL = global.XINGYUE_MOBILE_RUNTIME) === null || _global$XINGYUE_MOBIL === void 0 ? void 0 : _global$XINGYUE_MOBIL.manualHandoff) === true;
  function DevicePairingPanel(_ref) {
    var _deviceState$device, _deviceState$device2;
    var Icon = _ref.Icon,
      desktopAvailable = _ref.desktopAvailable,
      apiConfig = _ref.apiConfig;
    var client = React.useMemo(function () {
      return global.XingyueAgentClient.createDeviceClient();
    }, []);
    var _React$useState = React.useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      pairing = _React$useState2[0],
      setPairing = _React$useState2[1];
    var _React$useState3 = React.useState([]),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      devices = _React$useState4[0],
      setDevices = _React$useState4[1];
    var _React$useState5 = React.useState({
        state: 'checking',
        device: null
      }),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      deviceState = _React$useState6[0],
      setDeviceState = _React$useState6[1];
    var _React$useState7 = React.useState(function () {
        var _client$getSavedDevic;
        return ((_client$getSavedDevic = client.getSavedDevice()) === null || _client$getSavedDevic === void 0 ? void 0 : _client$getSavedDevic.name) || '柒柒的手机';
      }),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      deviceName = _React$useState8[0],
      setDeviceName = _React$useState8[1];
    var _React$useState9 = React.useState(''),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      code = _React$useState10[0],
      setCode = _React$useState10[1];
    var _React$useState11 = React.useState(''),
      _React$useState12 = _slicedToArray(_React$useState11, 2),
      message = _React$useState12[0],
      setMessage = _React$useState12[1];
    var _React$useState13 = React.useState(null),
      _React$useState14 = _slicedToArray(_React$useState13, 2),
      hostSummary = _React$useState14[0],
      setHostSummary = _React$useState14[1];
    var _React$useState15 = React.useState(false),
      _React$useState16 = _slicedToArray(_React$useState15, 2),
      busy = _React$useState16[0],
      setBusy = _React$useState16[1];
    var refresh = React.useCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var _response$data, response;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = setDeviceState;
            _context.next = 3;
            return client.check();
          case 3:
            _context.t1 = _context.sent;
            (0, _context.t0)(_context.t1);
            if (!desktopAvailable) {
              _context.next = 10;
              break;
            }
            _context.next = 8;
            return client.listDevices();
          case 8:
            response = _context.sent;
            if (response.ok) setDevices(((_response$data = response.data) === null || _response$data === void 0 ? void 0 : _response$data.devices) || []);
          case 10:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })), [client, desktopAvailable]);
    React.useEffect(function () {
      void refresh();
    }, [refresh]);
    var startPairing = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var _response$data2, _response$data3, response;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              setBusy(true);
              setMessage('');
              setPairing(null);
              _context2.prev = 3;
              _context2.next = 6;
              return client.startPairing();
            case 6:
              response = _context2.sent;
              if (!(!response.ok || !((_response$data2 = response.data) !== null && _response$data2 !== void 0 && _response$data2.pairing))) {
                _context2.next = 9;
                break;
              }
              throw new Error(((_response$data3 = response.data) === null || _response$data3 === void 0 ? void 0 : _response$data3.error) || '无法生成配对码');
            case 9:
              setPairing(response.data.pairing);
              setCode(response.data.pairing.code);
              setMessage('一次性配对码已生成，5 分钟内使用一次后立即失效。');
              _context2.next = 17;
              break;
            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](3);
              setMessage(_context2.t0.message);
            case 17:
              _context2.prev = 17;
              setBusy(false);
              return _context2.finish(17);
            case 20:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[3, 14, 17, 20]]);
      }));
      return function startPairing() {
        return _ref3.apply(this, arguments);
      };
    }();
    var pairThisDevice = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var _hostData$sessions, _hostData$collections, _hostData$collections2, _hostData$collections3, _hostData$sessions2, _global$XingyueHostSy, device, hostData;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              setBusy(true);
              setMessage('');
              setHostSummary(null);
              _context3.prev = 3;
              _context3.next = 6;
              return client.pair(code.trim(), deviceName.trim());
            case 6:
              device = _context3.sent;
              setDeviceState({
                state: 'connected',
                device: device
              });
              setPairing(null);
              setCode('');
              setMessage("\u2713 ".concat(device.name, " \u5DF2\u6210\u529F\u914D\u5BF9\uFF0C\u8BBF\u95EE\u51ED\u8BC1\u53EA\u4FDD\u5B58\u5728\u8FD9\u53F0\u8BBE\u5907\u3002"));
              _context3.next = 13;
              return refresh();
            case 13:
              _context3.next = 15;
              return client.readHostData();
            case 15:
              hostData = _context3.sent;
              setHostSummary({
                sessions: ((_hostData$sessions = hostData.sessions) === null || _hostData$sessions === void 0 ? void 0 : _hostData$sessions.length) || 0,
                healthDays: Object.keys(((_hostData$collections = hostData.collections) === null || _hostData$collections === void 0 ? void 0 : _hostData$collections.healthRecords) || {}).length,
                memories: (((_hostData$collections2 = hostData.collections) === null || _hostData$collections2 === void 0 || (_hostData$collections2 = _hostData$collections2.memories) === null || _hostData$collections2 === void 0 ? void 0 : _hostData$collections2.length) || 0) + (((_hostData$collections3 = hostData.collections) === null || _hostData$collections3 === void 0 || (_hostData$collections3 = _hostData$collections3.longTermMemories) === null || _hostData$collections3 === void 0 ? void 0 : _hostData$collections3.length) || 0)
              });
              if ((_hostData$sessions2 = hostData.sessions) !== null && _hostData$sessions2 !== void 0 && _hostData$sessions2.length || 0) {
                _context3.next = 20;
                break;
              }
              _context3.next = 20;
              return (_global$XingyueHostSy = global.XingyueHostSync) === null || _global$XingyueHostSy === void 0 ? void 0 : _global$XingyueHostSy.flushQueue();
            case 20:
              _context3.next = 25;
              break;
            case 22:
              _context3.prev = 22;
              _context3.t0 = _context3["catch"](3);
              setMessage(_context3.t0.message);
            case 25:
              _context3.prev = 25;
              setBusy(false);
              return _context3.finish(25);
            case 28:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[3, 22, 25, 28]]);
      }));
      return function pairThisDevice() {
        return _ref4.apply(this, arguments);
      };
    }();
    var verifyRead = /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        var _data$sessions, _data$collections, _data$collections2, _data$collections3, data;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              setBusy(true);
              setMessage('');
              _context4.prev = 2;
              _context4.next = 5;
              return client.readHostData();
            case 5:
              data = _context4.sent;
              setHostSummary({
                sessions: ((_data$sessions = data.sessions) === null || _data$sessions === void 0 ? void 0 : _data$sessions.length) || 0,
                healthDays: Object.keys(((_data$collections = data.collections) === null || _data$collections === void 0 ? void 0 : _data$collections.healthRecords) || {}).length,
                memories: (((_data$collections2 = data.collections) === null || _data$collections2 === void 0 || (_data$collections2 = _data$collections2.memories) === null || _data$collections2 === void 0 ? void 0 : _data$collections2.length) || 0) + (((_data$collections3 = data.collections) === null || _data$collections3 === void 0 || (_data$collections3 = _data$collections3.longTermMemories) === null || _data$collections3 === void 0 ? void 0 : _data$collections3.length) || 0)
              });
              setMessage('✓ 设备凭证有效，已成功读取主机数据摘要。');
              _context4.next = 16;
              break;
            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4["catch"](2);
              setHostSummary(null);
              setMessage(_context4.t0.message);
              _context4.next = 16;
              return refresh();
            case 16:
              _context4.prev = 16;
              setBusy(false);
              return _context4.finish(16);
            case 19:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[2, 10, 16, 19]]);
      }));
      return function verifyRead() {
        return _ref5.apply(this, arguments);
      };
    }();
    var restoreFromHost = /*#__PURE__*/function () {
      var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
        var _data$sync, _global$XingyueHostSy3, _summary$apiTransferS, data, _global$XingyueHostSy2, apiTransfer, summary, apiNote;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              setBusy(true);
              setMessage('正在从主机恢复聊天和记忆…');
              setHostSummary(null);
              _context5.prev = 3;
              _context5.next = 6;
              return client.readHostData();
            case 6:
              data = _context5.sent;
              if (!(Number(((_data$sync = data.sync) === null || _data$sync === void 0 ? void 0 : _data$sync.conflictCount) || 0) > 0)) {
                _context5.next = 15;
                break;
              }
              if (!mobileManualHandoff) {
                _context5.next = 10;
                break;
              }
              throw new Error('检测到主机与手机存在未解决的同步冲突。请先查看冲突并明确交接写入权，再恢复到手机；手机不会自动接受主机冲突。');
            case 10:
              _context5.next = 12;
              return (_global$XingyueHostSy2 = global.XingyueHostSync) === null || _global$XingyueHostSy2 === void 0 ? void 0 : _global$XingyueHostSy2.acceptHost2Conflicts();
            case 12:
              _context5.next = 14;
              return client.readHostData();
            case 14:
              data = _context5.sent;
            case 15:
              _context5.next = 17;
              return client.claimApiSettings();
            case 17:
              apiTransfer = _context5.sent;
              if (apiTransfer !== null && apiTransfer !== void 0 && apiTransfer.apiSettings) data = _objectSpread(_objectSpread({}, data), {}, {
                apiSettings: apiTransfer.apiSettings,
                apiSecretCount: apiTransfer.secretCount,
                apiSettingsMode: apiTransfer.mode
              });
              if (!(typeof global.XingyueRestoreHostData !== 'function')) {
                _context5.next = 21;
                break;
              }
              throw new Error('星月舱恢复模块尚未就绪');
            case 21:
              _context5.next = 23;
              return (_global$XingyueHostSy3 = global.XingyueHostSync) === null || _global$XingyueHostSy3 === void 0 ? void 0 : _global$XingyueHostSy3.adoptHostData(data);
            case 23:
              _context5.next = 25;
              return global.XingyueRestoreHostData(data);
            case 25:
              summary = _context5.sent;
              setHostSummary(summary);
              apiNote = (_summary$apiTransferS = summary.apiTransferStats) !== null && _summary$apiTransferS !== void 0 && _summary$apiTransferS.replaced ? "\uFF0C\u5DF2\u4ECE\u786E\u8BA4\u7684\u5907\u4EFD\u6062\u590D ".concat(summary.apiSecrets, " \u9879 API Key") : summary.apiTransferStats ? "\uFF0CAPI \u5B89\u5168\u5408\u5E76\uFF1A\u65B0\u589E ".concat(summary.apiTransferStats.addedSecrets, " \u9879\u3001\u4FDD\u7559 ").concat(summary.apiTransferStats.preservedSecrets, " \u9879").concat(summary.apiTransferStats.differingSecretsSkipped ? "\u3001\u8DF3\u8FC7 ".concat(summary.apiTransferStats.differingSecretsSkipped, " \u9879\u4E0D\u540C Key") : '') : mobileManualHandoff && apiTransfer === null ? '，本次未领取到 API 设置；若需同步，请在电脑为这台设备授权后重试（授权 5 分钟内有效）' : '';
              setMessage("\u2713 \u5DF2\u4ECE\u4E3B\u673A\u6062\u590D ".concat(summary.sessions, " \u4E2A\u804A\u5929\u7A97\u53E3").concat(apiNote, "\uFF0C\u4FA7\u8FB9\u680F\u5DF2\u66F4\u65B0\u3002"));
              _context5.next = 35;
              break;
            case 31:
              _context5.prev = 31;
              _context5.t0 = _context5["catch"](3);
              setHostSummary(null);
              setMessage(_context5.t0.message);
            case 35:
              _context5.prev = 35;
              setBusy(false);
              return _context5.finish(35);
            case 38:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[3, 31, 35, 38]]);
      }));
      return function restoreFromHost() {
        return _ref6.apply(this, arguments);
      };
    }();
    var authorizeApiSettings = /*#__PURE__*/function () {
      var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(device) {
        var _response$data4, _response$data5, response;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              setBusy(true);
              setMessage('');
              _context6.prev = 2;
              _context6.next = 5;
              return client.offerApiSettings(device.id, apiConfig || {}, 'merge');
            case 5:
              response = _context6.sent;
              if (!(!response.ok || !((_response$data4 = response.data) !== null && _response$data4 !== void 0 && _response$data4.offer))) {
                _context6.next = 8;
                break;
              }
              throw new Error(((_response$data5 = response.data) === null || _response$data5 === void 0 ? void 0 : _response$data5.error) || '无法创建 API 设置直传授权');
            case 8:
              setMessage("\u2713 \u5DF2\u5141\u8BB8 ".concat(device.name, " \u5728 5 \u5206\u949F\u5185\u9886\u53D6\u4E00\u6B21 API \u8BBE\u7F6E\uFF08").concat(response.data.offer.secretCount, " \u9879 Key\uFF09\u3002\u8BF7\u5230\u624B\u673A\u70B9\u51FB\u201C\u4ECE\u4E3B\u673A\u6062\u590D\u5230\u8FD9\u53F0\u8BBE\u5907\u201D\u3002"));
              _context6.next = 14;
              break;
            case 11:
              _context6.prev = 11;
              _context6.t0 = _context6["catch"](2);
              setMessage(_context6.t0.message);
            case 14:
              _context6.prev = 14;
              setBusy(false);
              return _context6.finish(14);
            case 17:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[2, 11, 14, 17]]);
      }));
      return function authorizeApiSettings(_x) {
        return _ref7.apply(this, arguments);
      };
    }();
    var authorizeApiSettingsFromBackup = /*#__PURE__*/function () {
      var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(device, file) {
        var _global$XingyueOpenAI, _global$XingyueOpenAI2, _response$data6, _response$data7, data, backupConfig, secretCount, presetCount, response;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              if (file) {
                _context7.next = 2;
                break;
              }
              return _context7.abrupt("return");
            case 2:
              setBusy(true);
              setMessage('正在只读检查备份中的 API 设置…');
              _context7.prev = 4;
              _context7.t0 = JSON;
              _context7.next = 8;
              return file.text();
            case 8:
              _context7.t1 = _context7.sent;
              data = _context7.t0.parse.call(_context7.t0, _context7.t1);
              backupConfig = (data === null || data === void 0 ? void 0 : data.config) || {};
              secretCount = ((_global$XingyueOpenAI = global.XingyueOpenAI) === null || _global$XingyueOpenAI === void 0 || (_global$XingyueOpenAI2 = _global$XingyueOpenAI.countConfiguredSecrets) === null || _global$XingyueOpenAI2 === void 0 ? void 0 : _global$XingyueOpenAI2.call(_global$XingyueOpenAI, backupConfig)) || 0;
              presetCount = Array.isArray(backupConfig.apiPresets) ? backupConfig.apiPresets.length : 0;
              if (secretCount) {
                _context7.next = 15;
                break;
              }
              throw new Error('这份备份中没有可恢复的 API Key');
            case 15:
              if (window.confirm("\u786E\u8BA4\u53EA\u7528\u8FD9\u4EFD\u5907\u4EFD\u6062\u590D\u624B\u673A API \u8BBE\u7F6E\uFF1F\n\n\u68C0\u6D4B\u5230 ".concat(presetCount, " \u4E2A\u9884\u8BBE\u3001").concat(secretCount, " \u9879 Key\u3002\n\u804A\u5929\u3001\u8BB0\u5FC6\u548C\u5065\u5EB7\u8BB0\u5F55\u4E0D\u4F1A\u4ECE\u8FD9\u4EFD\u5907\u4EFD\u6062\u590D\u3002"))) {
                _context7.next = 18;
                break;
              }
              setMessage('已取消 API 设置恢复。');
              return _context7.abrupt("return");
            case 18:
              _context7.next = 20;
              return client.offerApiSettings(device.id, backupConfig, 'replace-confirmed');
            case 20:
              response = _context7.sent;
              if (!(!response.ok || !((_response$data6 = response.data) !== null && _response$data6 !== void 0 && _response$data6.offer))) {
                _context7.next = 23;
                break;
              }
              throw new Error(((_response$data7 = response.data) === null || _response$data7 === void 0 ? void 0 : _response$data7.error) || '无法创建备份 API 设置恢复授权');
            case 23:
              setMessage("\u2713 \u5DF2\u51C6\u5907\u4ECE\u5907\u4EFD\u6062\u590D ".concat(presetCount, " \u4E2A\u9884\u8BBE\u3001").concat(response.data.offer.secretCount, " \u9879 Key\uFF1B5 \u5206\u949F\u5185\u8BF7\u5230\u624B\u673A\u70B9\u51FB\u201C\u4ECE\u4E3B\u673A\u6062\u590D\u5230\u8FD9\u53F0\u8BBE\u5907\u201D\u3002"));
              _context7.next = 29;
              break;
            case 26:
              _context7.prev = 26;
              _context7.t2 = _context7["catch"](4);
              setMessage("API \u8BBE\u7F6E\u6062\u590D\u5931\u8D25\uFF1A".concat(_context7.t2.message));
            case 29:
              _context7.prev = 29;
              setBusy(false);
              return _context7.finish(29);
            case 32:
            case "end":
              return _context7.stop();
          }
        }, _callee7, null, [[4, 26, 29, 32]]);
      }));
      return function authorizeApiSettingsFromBackup(_x2, _x3) {
        return _ref8.apply(this, arguments);
      };
    }();
    var revoke = /*#__PURE__*/function () {
      var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(device) {
        var _response$data8, response;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              setBusy(true);
              setMessage('');
              _context8.prev = 2;
              _context8.next = 5;
              return client.revokeDevice(device.id);
            case 5:
              response = _context8.sent;
              if (response.ok) {
                _context8.next = 8;
                break;
              }
              throw new Error(((_response$data8 = response.data) === null || _response$data8 === void 0 ? void 0 : _response$data8.error) || '撤销失败');
            case 8:
              setMessage("\u5DF2\u64A4\u9500 ".concat(device.name, "\uFF1B\u5B83\u539F\u6765\u7684\u51ED\u8BC1\u4E0D\u80FD\u518D\u8BFB\u53D6\u4E3B\u673A\u3002"));
              _context8.next = 11;
              return refresh();
            case 11:
              _context8.next = 16;
              break;
            case 13:
              _context8.prev = 13;
              _context8.t0 = _context8["catch"](2);
              setMessage(_context8.t0.message);
            case 16:
              _context8.prev = 16;
              setBusy(false);
              return _context8.finish(16);
            case 19:
            case "end":
              return _context8.stop();
          }
        }, _callee8, null, [[2, 13, 16, 19]]);
      }));
      return function revoke(_x4) {
        return _ref9.apply(this, arguments);
      };
    }();
    var statusText = deviceState.state === 'connected' ? "\u5DF2\u8FDE\u63A5\uFF1A".concat(((_deviceState$device = deviceState.device) === null || _deviceState$device === void 0 ? void 0 : _deviceState$device.name) || '这台设备') : deviceState.state === 'revoked' ? '访问已撤销或凭证失效' : '这台设备尚未配对';
    return /*#__PURE__*/React.createElement("div", {
      className: "space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-indigo-100 bg-indigo-50/70 p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex gap-3 items-start"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "ShieldCheck",
      size: 21,
      className: "text-indigo-600 mt-0.5"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "text-sm font-semibold text-gray-800"
    }, "\u624B\u673A\u8BBE\u5907\u914D\u5BF9"), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-600 mt-1 leading-relaxed"
    }, "\u672A\u914D\u5BF9\u8BBE\u5907\u4E0D\u80FD\u8BFB\u53D6\u4E3B\u673A\u6570\u636E\u3002\u914D\u5BF9\u7801\u53EA\u80FD\u4F7F\u7528\u4E00\u6B21\uFF1B\u624B\u673A\u51ED\u8BC1\u64A4\u9500\u540E\u7ACB\u5373\u5931\u6548\u3002\u672C\u6B65\u53EA\u5EFA\u7ACB\u661F\u6708\u8231\u81EA\u5DF1\u7684\u8BBE\u5907\u9501\uFF0C\u4E0D\u914D\u7F6E\u8FDC\u7A0B\u7F51\u7EDC\u3002")))), desktopAvailable && /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-gray-200 bg-white p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col md:flex-row md:items-center gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "text-sm font-semibold text-gray-800"
    }, "\u7535\u8111\u4E3B\u673A"), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-gray-500 mt-1"
    }, "\u5728\u7535\u8111\u7AEF\u751F\u6210\u4E00\u6B21\u6027\u914D\u5BF9\u7801\u3002")), /*#__PURE__*/React.createElement("button", {
      disabled: busy,
      onClick: startPairing,
      className: "px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium"
    }, "\u751F\u6210\u4E00\u6B21\u6027\u914D\u5BF9\u7801")), pairing && /*#__PURE__*/React.createElement("div", {
      className: "mt-4 rounded-xl bg-slate-900 text-white text-center p-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-slate-300"
    }, "5 \u5206\u949F\u5185\u6709\u6548 \xB7 \u4EC5\u53EF\u4F7F\u7528\u4E00\u6B21"), /*#__PURE__*/React.createElement("div", {
      className: "font-mono text-4xl tracking-[0.28em] mt-2 pl-[0.28em]"
    }, pairing.code))), /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-gray-200 bg-white p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
      className: "text-sm font-semibold text-gray-800"
    }, "\u8FD9\u53F0\u8BBE\u5907"), /*#__PURE__*/React.createElement("p", {
      className: "text-xs mt-1 ".concat(deviceState.state === 'connected' ? 'text-emerald-600' : 'text-gray-500')
    }, statusText)), /*#__PURE__*/React.createElement("span", {
      className: "w-3 h-3 rounded-full ".concat(deviceState.state === 'connected' ? 'bg-emerald-500' : 'bg-gray-300')
    })), mobileManualHandoff && ((_deviceState$device2 = deviceState.device) === null || _deviceState$device2 === void 0 ? void 0 : _deviceState$device2.id) && /*#__PURE__*/React.createElement("div", {
      className: "mt-2 space-y-0.5 text-[10px] text-gray-500"
    }, /*#__PURE__*/React.createElement("div", null, "\u8BBE\u5907 ID\uFF1A", /*#__PURE__*/React.createElement("span", {
      className: "font-mono break-all"
    }, deviceState.device.id)), /*#__PURE__*/React.createElement("div", null, "\u6700\u8FD1\u9A8C\u8BC1\uFF1A", deviceState.device.lastSeenAt ? new Date(deviceState.device.lastSeenAt).toLocaleString('zh-CN') : '尚未')), deviceState.state !== 'connected' ? /*#__PURE__*/React.createElement("div", {
      className: "grid md:grid-cols-[1fr_160px_auto] gap-2 mt-4"
    }, /*#__PURE__*/React.createElement("input", {
      value: deviceName,
      onChange: function onChange(event) {
        return setDeviceName(event.target.value);
      },
      placeholder: "\u8BBE\u5907\u540D\u79F0\uFF0C\u4F8B\u5982\uFF1A\u67D2\u67D2\u7684\u624B\u673A",
      className: "border border-gray-200 rounded-lg px-3 py-2 text-sm"
    }), /*#__PURE__*/React.createElement("input", {
      value: code,
      onChange: function onChange(event) {
        return setCode(event.target.value.replace(/\D/g, '').slice(0, 6));
      },
      inputMode: "numeric",
      placeholder: "6 \u4F4D\u914D\u5BF9\u7801",
      className: "border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono tracking-widest"
    }), /*#__PURE__*/React.createElement("button", {
      disabled: busy || code.length !== 6,
      onClick: pairThisDevice,
      className: "px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium"
    }, "\u914D\u5BF9\u8FD9\u53F0\u8BBE\u5907")) : /*#__PURE__*/React.createElement("div", {
      className: "mt-4 flex flex-wrap gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      disabled: busy,
      onClick: restoreFromHost,
      className: "px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium"
    }, "\u4ECE\u4E3B\u673A\u6062\u590D\u5230\u8FD9\u53F0\u8BBE\u5907"), /*#__PURE__*/React.createElement("button", {
      disabled: busy,
      onClick: verifyRead,
      className: "px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium"
    }, "\u9A8C\u8BC1\u8BFB\u53D6\u4E3B\u673A\u6570\u636E"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        client.forget();
        setDeviceState({
          state: 'unpaired',
          device: null
        });
        setHostSummary(null);
      },
      className: "px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm"
    }, "\u4EC5\u6E05\u9664\u672C\u673A\u51ED\u8BC1")), hostSummary && /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-2 mt-3 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-emerald-50 rounded-lg p-2"
    }, /*#__PURE__*/React.createElement("b", null, hostSummary.sessions), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-gray-500"
    }, "\u804A\u5929\u7A97\u53E3")), /*#__PURE__*/React.createElement("div", {
      className: "bg-emerald-50 rounded-lg p-2"
    }, /*#__PURE__*/React.createElement("b", null, hostSummary.healthDays), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-gray-500"
    }, "\u5065\u5EB7\u8BB0\u5F55")), /*#__PURE__*/React.createElement("div", {
      className: "bg-emerald-50 rounded-lg p-2"
    }, /*#__PURE__*/React.createElement("b", null, hostSummary.memories), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-gray-500"
    }, "\u8BB0\u5FC6\u6761\u76EE")))), desktopAvailable && /*#__PURE__*/React.createElement("div", {
      className: "rounded-xl border border-gray-200 bg-white p-4"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "text-sm font-semibold text-gray-800"
    }, "\u5DF2\u914D\u5BF9\u8BBE\u5907"), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 space-y-2"
    }, devices.length === 0 && /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-gray-500"
    }, "\u8FD8\u6CA1\u6709\u8BBE\u5907\u5B8C\u6210\u914D\u5BF9\u3002"), devices.map(function (device) {
      return /*#__PURE__*/React.createElement("div", {
        key: device.id,
        className: "flex flex-wrap items-center gap-3 rounded-lg bg-gray-50 p-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "w-2.5 h-2.5 rounded-full ".concat(device.status === 'connected' ? 'bg-emerald-500' : 'bg-gray-300')
      }), /*#__PURE__*/React.createElement("div", {
        className: "flex-1 min-w-[160px]"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-sm text-gray-800"
      }, device.name), /*#__PURE__*/React.createElement("div", {
        className: "text-[10px] text-gray-500"
      }, device.status === 'connected' ? '已连接' : '已撤销', " \xB7 \u6700\u8FD1\u9A8C\u8BC1 ", device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString() : '尚未')), device.status === 'connected' && /*#__PURE__*/React.createElement("button", {
        disabled: busy,
        onClick: function onClick() {
          return authorizeApiSettings(device);
        },
        className: "px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 text-xs hover:bg-indigo-50"
      }, "\u5141\u8BB8\u672C\u6B21\u540C\u6B65 API \u8BBE\u7F6E"), device.status === 'connected' && /*#__PURE__*/React.createElement("label", {
        className: "px-3 py-1.5 rounded-lg border border-amber-200 text-amber-700 text-xs hover:bg-amber-50 cursor-pointer ".concat(busy ? 'opacity-50 pointer-events-none' : '')
      }, "\u4ECE\u5907\u4EFD\u6062\u590D API \u8BBE\u7F6E", /*#__PURE__*/React.createElement("input", {
        type: "file",
        accept: "application/json,.json",
        className: "hidden",
        onChange: function onChange(event) {
          var _event$target$files;
          var file = (_event$target$files = event.target.files) === null || _event$target$files === void 0 ? void 0 : _event$target$files[0];
          event.target.value = '';
          void authorizeApiSettingsFromBackup(device, file);
        }
      })), device.status === 'connected' && /*#__PURE__*/React.createElement("button", {
        disabled: busy,
        onClick: function onClick() {
          return revoke(device);
        },
        className: "px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs hover:bg-red-50"
      }, "\u64A4\u9500\u8BBF\u95EE"));
    }))), message && /*#__PURE__*/React.createElement("div", {
      className: "rounded-lg bg-gray-50 border border-gray-100 p-3 text-xs text-gray-700"
    }, message));
  }
  global.XingyueDevicePairingPanel = DevicePairingPanel;
})(window);
