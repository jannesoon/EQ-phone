"use strict";

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
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
(function initXingyueMobileCabin(global) {
  'use strict';

  // This candidate is intentionally a sibling overlay for the host App. The host keeps
  // its existing children mounted and decides how to reveal them through onViewChange.
  var ReactRef = global.React;
  if (!ReactRef) return;
  var Fragment = ReactRef.Fragment,
    useCallback = ReactRef.useCallback,
    useEffect = ReactRef.useEffect,
    useMemo = ReactRef.useMemo,
    useRef = ReactRef.useRef,
    useState = ReactRef.useState;
  var noop = function noop() {};
  var VALID_VIEWS = ['home', 'chat', 'life', 'library', 'profile'];
  var PERSONA_IMAGES = {
    human: 'assets/ethan-human.png',
    wolf: 'assets/ethan-wolf.png'
  };
  var NAV_ITEMS = [{
    id: 'home',
    label: '首页',
    icon: 'home'
  }, {
    id: 'chat',
    label: '聊天',
    icon: 'message'
  }, {
    id: 'life',
    label: '生活',
    icon: 'heart'
  }, {
    id: 'library',
    label: '云书房',
    icon: 'book'
  }, {
    id: 'profile',
    label: '我的',
    icon: 'user'
  }];
  var SHORTCUTS = [{
    action: 'chat',
    label: '继续聊天',
    hint: '回到当前会话',
    icon: 'message',
    targetView: 'chat'
  }, {
    action: 'diary',
    label: '星月日记',
    hint: '快速记一笔',
    icon: 'pen'
  }, {
    action: 'memory',
    label: '我们的回忆',
    hint: '查看已保存内容',
    icon: 'memory'
  }, {
    action: 'health',
    label: '健康日历',
    hint: '记录身体状态',
    icon: 'calendar'
  }, {
    action: 'drawing',
    label: '图片创作',
    hint: '进入创作入口',
    icon: 'palette'
  }, {
    action: 'settings',
    label: '更多工具',
    hint: '设置与设备',
    icon: 'settings'
  }];
  var ICON_PATHS = {
    home: 'M3 10.8 12 3l9 7.8V21a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-10.2Z',
    message: 'M4 5.5A3.5 3.5 0 0 1 7.5 2h9A3.5 3.5 0 0 1 20 5.5v6A3.5 3.5 0 0 1 16.5 15H11l-5.4 4.1c-.65.5-1.6.04-1.6-.78V15.3A3.5 3.5 0 0 1 4 12V5.5Z',
    heart: 'm12 20.4-1.2-1.1C5.1 14.1 2 11.3 2 7.8 2 5 4.2 3 7 3c1.6 0 3.2.75 4.2 1.95A5.55 5.55 0 0 1 15.5 3C18.3 3 20.5 5 20.5 7.8c0 3.5-3.1 6.3-8.8 11.5L12 20.4Z',
    book: 'M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17Z M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M8 6h8 M8 9h8',
    user: 'M12 12a4.25 4.25 0 1 0 0-8.5A4.25 4.25 0 0 0 12 12Zm-8 9a8 8 0 0 1 16 0H4Z',
    moon: 'M20.5 14.3A8.9 8.9 0 0 1 9.7 3.5 9.5 9.5 0 1 0 20.5 14.3Z',
    sparkles: 'm12 2 1.15 4.4L17.5 8l-4.35 1.6L12 14l-1.15-4.4L6.5 8l4.35-1.6L12 2Zm7 10 .65 2.35L22 15l-2.35.65L19 18l-.65-2.35L16 15l2.35-.65L19 12ZM5 15l.65 2.35L8 18l-2.35.65L5 21l-.65-2.35L2 18l2.35-.65L5 15Z',
    pen: 'm14.4 4.1 5.5 5.5M4 20l4.6-1 10.7-10.7a2.12 2.12 0 0 0-3-3L6.6 16 4 20Z',
    memory: 'M5 5.5A2.5 2.5 0 0 1 7.5 3H19a2 2 0 0 1 2 2v12.5A2.5 2.5 0 0 1 18.5 20H7a3 3 0 0 1-3-3V6.5A1 1 0 0 1 5 5.5Zm0 0H18M8 8h9M8 12h6',
    calendar: 'M5 4h14a2 2 0 0 1 2 2v13H3V6a2 2 0 0 1 2-2Zm-2 5h18M8 2v4M16 2v4M8 13h3M8 16h6',
    palette: 'M12 3a9 9 0 0 0 0 18h1.4c1.1 0 1.7-1.3.95-2.1l-.35-.35c-.75-.8-.18-2.1.92-2.1H16a5 5 0 0 0 5-5A8.5 8.5 0 0 0 12 3Z M7.2 10.5h.01M9.2 7.5h.01M14 7.2h.01M17 10.2h.01',
    settings: 'M12 8.7A3.3 3.3 0 1 0 12 15.3 3.3 3.3 0 0 0 12 8.7Zm0-6.2 1.15 2.3 2.55.57 2.1-1.45 1.55 1.55-1.45 2.1.57 2.55 2.3 1.15v2.2l-2.3 1.15-.57 2.55 1.45 2.1-1.55 1.55-2.1-1.45-2.55.57L12 21.5l-2.2-1.15-1.15-2.3-2.55-.57L4 18.93l-1.55-1.55 1.45-2.1-.57-2.55L1 11.58v-2.2l2.3-1.15.57-2.55-1.45-2.1L3.97 2.03l2.1 1.45 2.55-.57L9.8 2.5H12Z',
    mic: 'M12 15.2a3.4 3.4 0 0 0 3.4-3.4V6.4a3.4 3.4 0 0 0-6.8 0v5.4a3.4 3.4 0 0 0 3.4 3.4Zm-6-3.4a6 6 0 0 0 12 0M12 17.8V22M8.5 22h7',
    devices: 'M4 5.5A2.5 2.5 0 0 1 6.5 3h7A2.5 2.5 0 0 1 16 5.5v9a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 4 14.5v-9ZM19 8h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-6M8 14h4',
    backup: 'M12 3v11m0 0 4-4m-4 4-4-4M4 17v3h16v-3',
    vault: 'M5 4h14a2 2 0 0 1 2 2v13H3V6a2 2 0 0 1 2-2Zm0 0V2h14v2M8 8h8M8 12h5',
    arrow: 'M5 12h13m-5-5 5 5-5 5',
    chevron: 'm8 10 4 4 4-4',
    plus: 'M12 5v14M5 12h14',
    activity: 'm3 12 4-4 3 7 4-10 3 7h4',
    lock: 'M6 10h12v10H6V10Zm3 0V7a3 3 0 0 1 6 0v3',
    cloud: 'M7 18a4 4 0 1 1 1.2-7.8A5.5 5.5 0 0 1 19 12a3 3 0 0 1-.5 6H7Z',
    close: 'm6 6 12 12M18 6 6 18',
    info: 'M12 11v5m0-9h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
  };
  var Glyph = function Glyph(_ref) {
    var name = _ref.name,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 20 : _ref$size,
      _ref$strokeWidth = _ref.strokeWidth,
      strokeWidth = _ref$strokeWidth === void 0 ? 1.8 : _ref$strokeWidth,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className;
    var path = ICON_PATHS[name] || ICON_PATHS.sparkles;
    return /*#__PURE__*/React.createElement("svg", {
      className: "mc-glyph ".concat(className),
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      focusable: "false"
    }, /*#__PURE__*/React.createElement("path", {
      d: path
    }));
  };
  function normalizeView(value) {
    var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'home';
    return VALID_VIEWS.indexOf(value) >= 0 ? value : fallback;
  }
  function getAgentState(value) {
    var raw = '';
    var label = '';
    var connected = null;
    if (typeof value === 'string') {
      raw = value.trim().toLowerCase();
    } else if (value && _typeof(value) === 'object') {
      raw = String(value.status || value.state || value.connection || '').trim().toLowerCase();
      label = String(value.label || value.statusLabel || '').trim();
      if (typeof value.connected === 'boolean') connected = value.connected;
      if (raw === 'online' && value.pairingState === 'connected') return {
        tone: 'online',
        label: '电脑已连接 · 已配对'
      };
      if (raw === 'online' && ['unpaired', 'revoked'].includes(value.pairingState)) return {
        tone: 'pairing',
        label: value.pairingState === 'revoked' ? '电脑在线 · 配对已失效' : '电脑在线 · 待配对'
      };
      if (raw === 'online' && ['unknown', 'error'].includes(value.pairingState)) return {
        tone: 'pairing',
        label: '电脑在线 · 配对待确认'
      };
    }
    if (connected === true || ['connected', 'online', 'ready', 'active', 'streaming'].indexOf(raw) >= 0) {
      return {
        tone: 'online',
        label: label || '已连接'
      };
    }
    if (['connecting', 'pending', 'loading', 'starting'].indexOf(raw) >= 0) {
      return {
        tone: 'pending',
        label: label || '连接中'
      };
    }
    if (connected === false || ['offline', 'disconnected', 'unavailable', 'error', 'failed'].indexOf(raw) >= 0) {
      return {
        tone: 'offline',
        label: label || '未连接'
      };
    }
    return {
      tone: 'unknown',
      label: label || '连接状态未知'
    };
  }
  function getGreeting(hour) {
    if (hour < 5) return '夜深了';
    if (hour < 11) return '早上好';
    if (hour < 14) return '午间好';
    if (hour < 19) return '下午好';
    return '晚上好';
  }
  function formatToday() {
    try {
      return new Intl.DateTimeFormat('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }).format(new Date());
    } catch (_) {
      return '';
    }
  }
  function getStatusCopy(agent) {
    if (agent.tone === 'offline') return '电脑未连接';
    if (agent.tone === 'pending') return '正在检查电脑';
    if (agent.tone === 'unknown') return '电脑连接状态未知';
    return agent.label;
  }
  var StatusPill = function StatusPill(_ref2) {
    var agent = _ref2.agent;
    var statusCopy = getStatusCopy(agent);
    return /*#__PURE__*/React.createElement("span", {
      className: "mc-status mc-status--".concat(agent.tone),
      title: agent.label,
      "aria-label": "\u7535\u8111\u72B6\u6001\uFF1A".concat(statusCopy)
    }, /*#__PURE__*/React.createElement("span", {
      className: "mc-status__dot",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("span", {
      className: "mc-status__label"
    }, statusCopy));
  };
  var MoonArt = function MoonArt(_ref3) {
    var _ref3$wolf = _ref3.wolf,
      wolf = _ref3$wolf === void 0 ? false : _ref3$wolf;
    return /*#__PURE__*/React.createElement("div", {
      className: "mc-moon-art ".concat(wolf ? 'is-wolf' : ''),
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mc-moon-art__halo"
    }), /*#__PURE__*/React.createElement("span", {
      className: "mc-moon-art__moon"
    }), /*#__PURE__*/React.createElement("span", {
      className: "mc-moon-art__star mc-moon-art__star--one"
    }), /*#__PURE__*/React.createElement("span", {
      className: "mc-moon-art__star mc-moon-art__star--two"
    }), /*#__PURE__*/React.createElement("span", {
      className: "mc-moon-art__star mc-moon-art__star--three"
    }), /*#__PURE__*/React.createElement("span", {
      className: "mc-moon-art__hill mc-moon-art__hill--back"
    }), /*#__PURE__*/React.createElement("span", {
      className: "mc-moon-art__hill mc-moon-art__hill--front"
    }));
  };
  var SectionHeading = function SectionHeading(_ref4) {
    var eyebrow = _ref4.eyebrow,
      title = _ref4.title,
      action = _ref4.action,
      onAction = _ref4.onAction,
      id = _ref4.id;
    return /*#__PURE__*/React.createElement("div", {
      className: "mc-section-heading"
    }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("p", {
      className: "mc-eyebrow"
    }, eyebrow), /*#__PURE__*/React.createElement("h2", {
      id: id
    }, title)), action && /*#__PURE__*/React.createElement("button", {
      className: "mc-text-action",
      type: "button",
      onClick: onAction
    }, action, /*#__PURE__*/React.createElement(Glyph, {
      name: "arrow",
      size: 16
    })));
  };
  var EmptyState = function EmptyState(_ref5) {
    var _ref5$icon = _ref5.icon,
      icon = _ref5$icon === void 0 ? 'sparkles' : _ref5$icon,
      title = _ref5.title,
      text = _ref5.text,
      action = _ref5.action,
      onAction = _ref5.onAction;
    return /*#__PURE__*/React.createElement("div", {
      className: "mc-empty-state"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mc-empty-state__icon"
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: icon,
      size: 20
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, title), text && /*#__PURE__*/React.createElement("p", null, text)), action && /*#__PURE__*/React.createElement("button", {
      className: "mc-small-button",
      type: "button",
      onClick: onAction
    }, action));
  };
  function HomeView(_ref6) {
    var agent = _ref6.agent,
      imageSource = _ref6.imageSource,
      _ref6$coverPosition = _ref6.coverPosition,
      coverPosition = _ref6$coverPosition === void 0 ? 50 : _ref6$coverPosition,
      _ref6$customCover = _ref6.customCover,
      customCover = _ref6$customCover === void 0 ? false : _ref6$customCover,
      imageFailed = _ref6.imageFailed,
      onImageError = _ref6.onImageError,
      persona = _ref6.persona,
      userName = _ref6.userName,
      today = _ref6.today,
      _onAction = _ref6.onAction,
      onViewChange = _ref6.onViewChange;
    var hour = new Date().getHours();
    return /*#__PURE__*/React.createElement("div", {
      className: "mc-page mc-page--home"
    }, /*#__PURE__*/React.createElement("header", {
      className: "mc-topbar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mc-brand-lockup"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mc-brand-mark"
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "moon",
      size: 20
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "mc-brand-kicker"
    }, "XINGYUE CABIN"), /*#__PURE__*/React.createElement("h1", null, "\u661F\u6708\u8231"))), /*#__PURE__*/React.createElement(StatusPill, {
      agent: agent
    })), /*#__PURE__*/React.createElement("section", {
      className: "mc-hero-card mc-hero-card--poster ".concat(persona === 'wolf' ? 'is-wolf' : 'is-human'),
      "aria-labelledby": "mc-home-greeting"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mc-hero-card__visual"
    }, imageSource && !imageFailed ? /*#__PURE__*/React.createElement("img", {
      src: imageSource,
      alt: customCover ? '自选首页封面' : persona === 'wolf' ? '小狼崽主题图' : '逸辰主题图',
      style: {
        objectPosition: "50% ".concat(coverPosition, "%")
      },
      onError: onImageError
    }) : /*#__PURE__*/React.createElement(MoonArt, {
      wolf: persona === 'wolf'
    })), /*#__PURE__*/React.createElement("div", {
      className: "mc-hero-card__body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mc-hero-card__copy"
    }, /*#__PURE__*/React.createElement("p", {
      className: "mc-eyebrow"
    }, today), /*#__PURE__*/React.createElement("h2", {
      id: "mc-home-greeting"
    }, getGreeting(hour), "\uFF0C", userName), /*#__PURE__*/React.createElement("p", null, "\u4ECA\u5929\u8FC7\u5F97\u600E\u4E48\u6837\uFF1F\u60F3\u548C\u6211\u804A\u804A\u5417\uFF1F")), /*#__PURE__*/React.createElement("div", {
      className: "mc-hero-card__actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "mc-primary-button",
      type: "button",
      onClick: function onClick() {
        return onViewChange('chat');
      }
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "message",
      size: 18
    }), "\u7EE7\u7EED\u804A\u5929", /*#__PURE__*/React.createElement(Glyph, {
      name: "arrow",
      size: 17
    }))))), /*#__PURE__*/React.createElement("section", {
      className: "mc-section",
      "aria-labelledby": "mc-shortcut-title"
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      id: "mc-shortcut-title",
      eyebrow: "QUICK ACCESS",
      title: "\u5E38\u7528\u5165\u53E3"
    }), /*#__PURE__*/React.createElement("div", {
      className: "mc-shortcut-grid"
    }, SHORTCUTS.map(function (item) {
      return /*#__PURE__*/React.createElement("button", {
        className: "mc-shortcut-card",
        key: item.action,
        type: "button",
        onClick: function onClick() {
          if (item.targetView) {
            onViewChange(item.targetView);
          } else {
            _onAction(item.action);
          }
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "mc-shortcut-card__icon"
      }, /*#__PURE__*/React.createElement(Glyph, {
        name: item.icon,
        size: 20
      })), /*#__PURE__*/React.createElement("span", {
        className: "mc-shortcut-card__label"
      }, item.label), /*#__PURE__*/React.createElement("span", {
        className: "mc-shortcut-card__hint"
      }, item.hint));
    }))), /*#__PURE__*/React.createElement("section", {
      className: "mc-section mc-section--stacked",
      "aria-labelledby": "mc-today-title"
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      id: "mc-today-title",
      eyebrow: "TODAY",
      title: "\u4ECA\u65E5"
    }), /*#__PURE__*/React.createElement("div", {
      className: "mc-info-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mc-info-card__heading"
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "pen",
      size: 17
    }), /*#__PURE__*/React.createElement("h3", null, "\u4ECA\u65E5\u5C0F\u8BB0")), /*#__PURE__*/React.createElement(EmptyState, {
      icon: "pen",
      title: "\u5C1A\u672A\u8BFB\u53D6\u8BB0\u5F55",
      text: "\u5199\u4E0B\u6B64\u523B\u7684\u5FC3\u60C5\uFF0C\u5B8C\u6210\u540E\u4F1A\u663E\u793A\u5728\u8FD9\u91CC\u3002",
      action: "\u8BB0\u4E00\u7B14",
      onAction: function onAction() {
        return _onAction('diary');
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "mc-info-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mc-info-card__heading"
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "calendar",
      size: 17
    }), /*#__PURE__*/React.createElement("h3", null, "\u4ECA\u65E5\u5B89\u6392")), /*#__PURE__*/React.createElement(EmptyState, {
      icon: "calendar",
      title: "\u5C1A\u672A\u8BFB\u53D6\u8BB0\u5F55",
      text: "\u7A0D\u540E\u4ECE\u751F\u6D3B\u9875\u67E5\u770B\u4ECA\u5929\u7684\u5B89\u6392\u3002",
      action: "\u770B\u751F\u6D3B",
      onAction: function onAction() {
        return onViewChange('life');
      }
    }))));
  }
  function LifeView(_ref7) {
    var today = _ref7.today,
      onAction = _ref7.onAction;
    var now = new Date();
    return /*#__PURE__*/React.createElement("div", {
      className: "mc-page mc-page--life"
    }, /*#__PURE__*/React.createElement("header", {
      className: "mc-page-header"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "mc-eyebrow"
    }, "LITTLE MOMENTS"), /*#__PURE__*/React.createElement("h1", null, "\u751F\u6D3B"), /*#__PURE__*/React.createElement("p", null, "\u7167\u987E\u81EA\u5DF1\uFF0C\u4E5F\u6536\u85CF\u5E73\u51E1\u7684\u5C0F\u4E8B\u3002")), /*#__PURE__*/React.createElement("span", {
      className: "mc-page-header__icon"
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "heart",
      size: 24
    }))), /*#__PURE__*/React.createElement("section", {
      className: "mc-life-health",
      "aria-labelledby": "mc-life-health-title"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mc-life-health__top"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mc-life-date",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", null, now.getMonth() + 1, " \u6708"), /*#__PURE__*/React.createElement("strong", null, now.getDate())), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "mc-eyebrow"
    }, today), /*#__PURE__*/React.createElement("h2", {
      id: "mc-life-health-title"
    }, "\u4ECA\u5929\uFF0C\u611F\u89C9\u600E\u4E48\u6837\uFF1F"))), /*#__PURE__*/React.createElement("p", {
      className: "mc-life-health__intro"
    }, "\u8EAB\u4F53\u7684\u53D8\u5316\u3001\u5FC3\u60C5\u7684\u8D77\u4F0F\uFF0C\u90FD\u53EF\u4EE5\u6162\u6162\u8BB0\u4E0B\u6765\u3002"), /*#__PURE__*/React.createElement("button", {
      className: "mc-life-health__open",
      type: "button",
      onClick: function onClick() {
        return onAction('health');
      }
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Glyph, {
      name: "activity",
      size: 21
    }), /*#__PURE__*/React.createElement("strong", null, "\u6253\u5F00\u5065\u5EB7\u65E5\u5386")), /*#__PURE__*/React.createElement(Glyph, {
      name: "arrow",
      size: 19
    })), /*#__PURE__*/React.createElement("p", {
      className: "mc-life-caption"
    }, "\u67E5\u770B\u8BB0\u5F55 \xB7 \u8BB0\u4E0B\u8EAB\u4F53\u72B6\u6001")), /*#__PURE__*/React.createElement("section", {
      className: "mc-life-journal",
      "aria-labelledby": "mc-life-journal-title"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mc-life-journal__top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mc-eyebrow"
    }, "A PAGE OF TODAY"), /*#__PURE__*/React.createElement(Glyph, {
      name: "pen",
      size: 22
    })), /*#__PURE__*/React.createElement("h2", {
      id: "mc-life-journal-title"
    }, "\u661F\u6708\u65E5\u8BB0"), /*#__PURE__*/React.createElement("p", null, "\u4ECA\u5929\u6709\u4EC0\u4E48\uFF0C\u60F3\u7559\u7ED9\u4EE5\u540E\u7684\u6211\u4EEC\uFF1F"), /*#__PURE__*/React.createElement("div", {
      className: "mc-life-journal__lines",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("button", {
      className: "mc-text-action",
      type: "button",
      onClick: function onClick() {
        return onAction('diary');
      }
    }, "\u53BB\u4E91\u4E66\u623F\u5199\u4E00\u9875 ", /*#__PURE__*/React.createElement(Glyph, {
      name: "arrow",
      size: 17
    }))), /*#__PURE__*/React.createElement("section", {
      className: "mc-section mc-section--stacked",
      "aria-labelledby": "mc-life-more-title"
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      eyebrow: "MAKE & KEEP",
      title: "\u7075\u611F\u4E0E\u6536\u85CF",
      id: "mc-life-more-title"
    }), /*#__PURE__*/React.createElement("div", {
      className: "mc-life-tools"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return onAction('drawing');
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "mc-life-tools__icon"
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "palette",
      size: 22
    })), /*#__PURE__*/React.createElement("strong", null, "\u56FE\u7247\u521B\u4F5C"), /*#__PURE__*/React.createElement("span", null, "\u548C\u9038\u8FB0\u804A\u804A\u7075\u611F"), /*#__PURE__*/React.createElement(Glyph, {
      name: "arrow",
      size: 16
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return onAction('vault');
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "mc-life-tools__icon"
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "book",
      size: 22
    })), /*#__PURE__*/React.createElement("strong", null, "\u4E91\u4E66\u623F\u6536\u85CF"), /*#__PURE__*/React.createElement("span", null, "\u7FFB\u770B\u5DF2\u4FDD\u5B58\u7684\u70B9\u6EF4"), /*#__PURE__*/React.createElement(Glyph, {
      name: "arrow",
      size: 16
    })))));
  }
  function LibraryView(_ref8) {
    var libraryContent = _ref8.libraryContent,
      onAction = _ref8.onAction;
    var hasContent = libraryContent !== null && libraryContent !== undefined && libraryContent !== '';
    var libraryTools = [{
      action: 'diary',
      icon: 'pen',
      label: '星月日记'
    }, {
      action: 'memory',
      icon: 'memory',
      label: '记忆与回忆'
    }, {
      action: 'medical',
      icon: 'heart',
      label: '辰医生病案室'
    }, {
      action: 'prayer',
      icon: 'sparkles',
      label: '祷告与心愿'
    }, {
      action: 'board',
      icon: 'message',
      label: '留言与工作日志'
    }, {
      action: 'trash',
      icon: 'vault',
      label: '回收站'
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "mc-page"
    }, /*#__PURE__*/React.createElement("header", {
      className: "mc-page-header"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "mc-eyebrow"
    }, "CLOUD LIBRARY"), /*#__PURE__*/React.createElement("h1", null, "\u4E91\u4E66\u623F"), /*#__PURE__*/React.createElement("p", null, "\u628A\u559C\u6B22\u7684\u5185\u5BB9\uFF0C\u5B89\u9759\u5730\u6536\u8FDB\u8FD9\u4E00\u5904\u3002")), /*#__PURE__*/React.createElement("span", {
      className: "mc-page-header__icon"
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "book",
      size: 24
    }))), /*#__PURE__*/React.createElement("section", {
      className: "mc-library-banner"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mc-library-banner__icon"
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "cloud",
      size: 24
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "\u4E91\u4E66\u623F\u7BA1\u7406"), /*#__PURE__*/React.createElement("p", null, "\u4E66\u67B6\u3001\u6587\u7AE0\u548C\u9644\u4EF6\u90FD\u5728\u8FD9\u91CC\u76F8\u9047\u3002"))), hasContent ? /*#__PURE__*/React.createElement("section", {
      className: "mc-library-content",
      "aria-label": "\u4E91\u4E66\u623F\u5185\u5BB9"
    }, libraryContent) : /*#__PURE__*/React.createElement("section", {
      className: "mc-info-card mc-info-card--library"
    }, /*#__PURE__*/React.createElement(EmptyState, {
      icon: "book",
      title: "\u4E66\u67B6\u5185\u5BB9\u5C1A\u672A\u8BFB\u53D6",
      text: "\u8FDE\u63A5\u540E\uFF0C\u4F60\u7684\u4E66\u67B6\u3001\u6587\u7AE0\u548C\u9644\u4EF6\u4F1A\u663E\u793A\u5728\u8FD9\u91CC\u3002"
    })), /*#__PURE__*/React.createElement("section", {
      className: "mc-section mc-section--stacked"
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      eyebrow: "LIBRARY TOOLS",
      title: "\u76F8\u5173\u5165\u53E3"
    }), /*#__PURE__*/React.createElement("div", {
      className: "mc-list-card ".concat(hasContent ? '' : 'is-muted')
    }, libraryTools.map(function (item) {
      return hasContent ? /*#__PURE__*/React.createElement("button", {
        key: item.action,
        type: "button",
        onClick: function onClick() {
          return onAction(item.action);
        }
      }, /*#__PURE__*/React.createElement(Glyph, {
        name: item.icon,
        size: 19
      }), /*#__PURE__*/React.createElement("span", null, item.label), /*#__PURE__*/React.createElement(Glyph, {
        name: "chevron",
        size: 18
      })) : /*#__PURE__*/React.createElement("div", {
        key: item.action,
        className: "mc-list-row mc-list-row--disabled",
        "aria-disabled": "true"
      }, /*#__PURE__*/React.createElement(Glyph, {
        name: item.icon,
        size: 19
      }), /*#__PURE__*/React.createElement("span", null, item.label), /*#__PURE__*/React.createElement("span", {
        className: "mc-list-row__status"
      }, "\u5F85\u63A5\u5165"));
    }))));
  }
  function ProfileView(_ref9) {
    var _global$XingyuePhoneA;
    var agent = _ref9.agent,
      persona = _ref9.persona,
      imageSource = _ref9.imageSource,
      imageFailed = _ref9.imageFailed,
      onImageError = _ref9.onImageError,
      onAction = _ref9.onAction,
      onPersonaChange = _ref9.onPersonaChange;
    var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      displayInfo = _useState2[0],
      setDisplayInfo = _useState2[1];
    var _useState3 = useState(''),
      _useState4 = _slicedToArray(_useState3, 2),
      displayCopyStatus = _useState4[0],
      setDisplayCopyStatus = _useState4[1];
    var refreshDisplayInfo = function refreshDisplayInfo() {
      var _global$XingyuePhoneD, _global$XingyuePhoneD2;
      var value = JSON.stringify(((_global$XingyuePhoneD = global.XingyuePhoneDisplayInfo) === null || _global$XingyuePhoneD === void 0 || (_global$XingyuePhoneD2 = _global$XingyuePhoneD.read) === null || _global$XingyuePhoneD2 === void 0 ? void 0 : _global$XingyuePhoneD2.call(_global$XingyuePhoneD)) || {
        error: '显示检查暂不可用'
      }, null, 2);
      setDisplayInfo(value);
      return value;
    };
    var copyDisplayInfo = /*#__PURE__*/function () {
      var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var value;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              value = refreshDisplayInfo();
              _context.prev = 1;
              _context.next = 4;
              return global.navigator.clipboard.writeText(value);
            case 4:
              setDisplayCopyStatus('显示信息已复制，可贴回聊天协助检查白边。');
              _context.next = 10;
              break;
            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](1);
              setDisplayCopyStatus('请长按下方文字手动复制。');
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[1, 7]]);
      }));
      return function copyDisplayInfo() {
        return _ref10.apply(this, arguments);
      };
    }();
    var _useState5 = useState({
        checking: false,
        available: false,
        text: '检查网页的新版本'
      }),
      _useState6 = _slicedToArray(_useState5, 2),
      updateState = _useState6[0],
      setUpdateState = _useState6[1];
    var checkUpdate = /*#__PURE__*/function () {
      var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var result;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!updateState.available) {
                _context2.next = 3;
                break;
              }
              onAction('update');
              return _context2.abrupt("return");
            case 3:
              if (global.XingyuePhoneUpdate) {
                _context2.next = 6;
                break;
              }
              setUpdateState({
                checking: false,
                available: false,
                text: '当前入口暂不支持检查更新'
              });
              return _context2.abrupt("return");
            case 6:
              setUpdateState({
                checking: true,
                available: false,
                text: '正在检查…'
              });
              _context2.prev = 7;
              _context2.next = 10;
              return global.XingyuePhoneUpdate.check();
            case 10:
              result = _context2.sent;
              setUpdateState({
                checking: false,
                available: result.hasUpdate,
                text: result.hasUpdate ? '有新版本，点击更新页面' : '已经是最新版本'
              });
              _context2.next = 17;
              break;
            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](7);
              setUpdateState({
                checking: false,
                available: false,
                text: '暂时无法检查，请稍后重试'
              });
            case 17:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[7, 14]]);
      }));
      return function checkUpdate() {
        return _ref11.apply(this, arguments);
      };
    }();
    return /*#__PURE__*/React.createElement("div", {
      className: "mc-page"
    }, /*#__PURE__*/React.createElement("header", {
      className: "mc-page-header"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "mc-eyebrow"
    }, "PERSONAL SPACE"), /*#__PURE__*/React.createElement("h1", null, "\u6211\u7684"), /*#__PURE__*/React.createElement("p", null, "\u8BBE\u7F6E\u3001\u8BBE\u5907\u4E0E\u4E91\u7AEF")), /*#__PURE__*/React.createElement("span", {
      className: "mc-page-header__icon"
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "user",
      size: 24
    }))), /*#__PURE__*/React.createElement("section", {
      className: "mc-profile-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mc-profile-card__avatar"
    }, imageSource && !imageFailed ? /*#__PURE__*/React.createElement("img", {
      src: imageSource,
      alt: persona === 'wolf' ? '小狼崽主题图' : '逸辰主题图',
      onError: onImageError
    }) : /*#__PURE__*/React.createElement(Glyph, {
      name: persona === 'wolf' ? 'sparkles' : 'user',
      size: 26
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      className: "mc-eyebrow"
    }, "CURRENT THEME"), /*#__PURE__*/React.createElement("h2", null, persona === 'wolf' ? '小狼崽主题' : '真人逸辰主题'), /*#__PURE__*/React.createElement("p", null, "\u5C55\u793A\u4E3B\u9898\u53EF\u968F\u65F6\u5207\u6362\uFF0C\u804A\u5929\u4E0E\u8BB0\u5F55\u4E0D\u4F1A\u6E05\u7A7A\u3002")), /*#__PURE__*/React.createElement(StatusPill, {
      agent: agent
    })), /*#__PURE__*/React.createElement("section", {
      className: "mc-theme-card"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "\u966A\u4F34\u5F62\u8C61"), /*#__PURE__*/React.createElement("p", null, "\u9009\u62E9\u966A\u4F34\u5F62\u8C61\uFF0C\u914D\u8272\u548C\u9996\u9875\u5C01\u9762\u53EF\u53E6\u5916\u8BBE\u7F6E\u3002")), /*#__PURE__*/React.createElement("div", {
      className: "mc-theme-card__actions"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: persona === 'human' ? 'is-selected' : '',
      "aria-pressed": persona === 'human',
      onClick: function onClick() {
        return onPersonaChange('human');
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "mc-theme-option__swatch mc-theme-option__swatch--human",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "user",
      size: 17
    })), /*#__PURE__*/React.createElement("span", {
      className: "mc-theme-option__copy"
    }, /*#__PURE__*/React.createElement("strong", null, "\u771F\u4EBA\u9038\u8FB0"), /*#__PURE__*/React.createElement("small", null, "\u4EBA\u50CF\u4E3B\u9898"))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: persona === 'wolf' ? 'is-selected' : '',
      "aria-pressed": persona === 'wolf',
      onClick: function onClick() {
        return onPersonaChange('wolf');
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "mc-theme-option__swatch mc-theme-option__swatch--wolf",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "sparkles",
      size: 17
    })), /*#__PURE__*/React.createElement("span", {
      className: "mc-theme-option__copy"
    }, /*#__PURE__*/React.createElement("strong", null, "\u5C0F\u72FC\u5D3D"), /*#__PURE__*/React.createElement("small", null, "\u661F\u5149\u4E3B\u9898"))))), ((_global$XingyuePhoneA = global.XingyuePhoneAppearancePanel) === null || _global$XingyuePhoneA === void 0 ? void 0 : _global$XingyuePhoneA.AppearancePanel) && /*#__PURE__*/React.createElement(global.XingyuePhoneAppearancePanel.AppearancePanel, null), /*#__PURE__*/React.createElement("details", {
      className: "phone-display-info",
      onToggle: function onToggle(event) {
        if (event.currentTarget.open) refreshDisplayInfo();
      }
    }, /*#__PURE__*/React.createElement("summary", null, "\u7248\u672C\u4E0E\u663E\u793A\u68C0\u67E5"), /*#__PURE__*/React.createElement("p", null, "\u7528\u4E8E\u68C0\u67E5\u624B\u673A\u767D\u8FB9\uFF0C\u4EC5\u5305\u542B\u7248\u672C\u3001\u5C4F\u5E55\u4E0E\u5B89\u5168\u533A\u6570\u503C\u3002"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: copyDisplayInfo
    }, "\u590D\u5236\u663E\u793A\u4FE1\u606F"), /*#__PURE__*/React.createElement("p", {
      role: "status"
    }, displayCopyStatus), /*#__PURE__*/React.createElement("textarea", {
      "aria-label": "\u663E\u793A\u68C0\u67E5\u4FE1\u606F",
      readOnly: true,
      value: displayInfo,
      rows: 8
    })), /*#__PURE__*/React.createElement("section", {
      className: "mc-section mc-section--stacked"
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      eyebrow: "SETTINGS",
      title: "\u8BBE\u7F6E\u4E0E\u8FDE\u63A5"
    }), /*#__PURE__*/React.createElement("div", {
      className: "mc-profile-group"
    }, /*#__PURE__*/React.createElement("p", {
      className: "mc-profile-group__label"
    }, "\u7535\u8111\u4E0E\u540C\u6B65"), /*#__PURE__*/React.createElement("div", {
      className: "mc-list-card mc-list-card--large"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return onAction('devices');
      }
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "devices",
      size: 20
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u8BBE\u5907\u8FDE\u63A5"), /*#__PURE__*/React.createElement("small", null, "\u67E5\u770B\u5F53\u524D\u7535\u8111\u8FDE\u63A5\u72B6\u6001")), /*#__PURE__*/React.createElement(Glyph, {
      name: "chevron",
      size: 18
    })))), /*#__PURE__*/React.createElement("div", {
      className: "mc-profile-group"
    }, /*#__PURE__*/React.createElement("p", {
      className: "mc-profile-group__label"
    }, "\u4F7F\u7528\u504F\u597D"), /*#__PURE__*/React.createElement("div", {
      className: "mc-list-card mc-list-card--large"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return onAction('settings');
      }
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "settings",
      size: 20
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u901A\u7528\u8BBE\u7F6E"), /*#__PURE__*/React.createElement("small", null, "\u5916\u89C2\u4E0E\u4F7F\u7528\u504F\u597D")), /*#__PURE__*/React.createElement(Glyph, {
      name: "chevron",
      size: 18
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return onAction('voice');
      }
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "mic",
      size: 20
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u8BED\u97F3\u8BBE\u7F6E"), /*#__PURE__*/React.createElement("small", null, "\u9009\u62E9\u559C\u6B22\u7684\u58F0\u97F3")), /*#__PURE__*/React.createElement(Glyph, {
      name: "chevron",
      size: 18
    })))), /*#__PURE__*/React.createElement("div", {
      className: "mc-profile-group"
    }, /*#__PURE__*/React.createElement("p", {
      className: "mc-profile-group__label"
    }, "\u8D44\u6599\u4E0E\u4E66\u623F"), /*#__PURE__*/React.createElement("div", {
      className: "mc-list-card mc-list-card--large"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return onAction('backup');
      }
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "backup",
      size: 20
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u5907\u4EFD\u4E0E\u6062\u590D"), /*#__PURE__*/React.createElement("small", null, "\u5B88\u597D\u4F60\u7684\u8D44\u6599")), /*#__PURE__*/React.createElement(Glyph, {
      name: "chevron",
      size: 18
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return onAction('vault');
      }
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "vault",
      size: 20
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u4E91\u4E66\u623F"), /*#__PURE__*/React.createElement("small", null, "\u524D\u5F80\u4E91\u4E66\u623F")), /*#__PURE__*/React.createElement(Glyph, {
      name: "chevron",
      size: 18
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      disabled: updateState.checking,
      onClick: checkUpdate
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "cloud",
      size: 20
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, updateState.available ? '更新页面' : '检查更新'), /*#__PURE__*/React.createElement("small", {
      role: "status"
    }, updateState.text)), /*#__PURE__*/React.createElement(Glyph, {
      name: "chevron",
      size: 18
    }))))));
  }
  function ChatPassThrough() {
    return /*#__PURE__*/React.createElement("div", {
      className: "mc-chat-pass-through",
      "aria-hidden": "true"
    });
  }
  function MobileCabin(_ref12) {
    var _appearance$coverPosi;
    var _children = _ref12.children,
      agentStatus = _ref12.agentStatus,
      _ref12$avatarUrl = _ref12.avatarUrl,
      avatarUrl = _ref12$avatarUrl === void 0 ? '' : _ref12$avatarUrl,
      _ref12$userName = _ref12.userName,
      userName = _ref12$userName === void 0 ? '柒柒' : _ref12$userName,
      _ref12$onAction = _ref12.onAction,
      onAction = _ref12$onAction === void 0 ? noop : _ref12$onAction,
      _ref12$enabled = _ref12.enabled,
      enabled = _ref12$enabled === void 0 ? true : _ref12$enabled,
      _ref12$libraryContent = _ref12.libraryContent,
      libraryContent = _ref12$libraryContent === void 0 ? null : _ref12$libraryContent,
      view = _ref12.view,
      mobileView = _ref12.mobileView,
      _ref12$chatMessageCou = _ref12.chatMessageCount,
      chatMessageCount = _ref12$chatMessageCou === void 0 ? 0 : _ref12$chatMessageCou,
      _ref12$chatIsLoading = _ref12.chatIsLoading,
      chatIsLoading = _ref12$chatIsLoading === void 0 ? false : _ref12$chatIsLoading,
      _ref12$chatInputFocus = _ref12.chatInputFocused,
      chatInputFocused = _ref12$chatInputFocus === void 0 ? false : _ref12$chatInputFocus,
      _ref12$chatInputEnter = _ref12.chatInputEntered,
      chatInputEntered = _ref12$chatInputEnter === void 0 ? false : _ref12$chatInputEnter,
      _ref12$initialView = _ref12.initialView,
      initialView = _ref12$initialView === void 0 ? 'home' : _ref12$initialView,
      _ref12$onViewChange = _ref12.onViewChange,
      onViewChange = _ref12$onViewChange === void 0 ? noop : _ref12$onViewChange;
    // Deliberately do not render _children: the parent renders the existing App content
    // as a sibling and uses onViewChange to control visibility. This preserves chat state.
    void _children;
    var controlledView = view !== undefined ? view : mobileView;
    var _useState7 = useState(function () {
        return normalizeView(initialView);
      }),
      _useState8 = _slicedToArray(_useState7, 2),
      internalView = _useState8[0],
      setInternalView = _useState8[1];
    var _useState9 = useState('human'),
      _useState10 = _slicedToArray(_useState9, 2),
      persona = _useState10[0],
      setPersona = _useState10[1];
    var _useState11 = useState({}),
      _useState12 = _slicedToArray(_useState11, 2),
      failedImages = _useState12[0],
      setFailedImages = _useState12[1];
    var _useState13 = useState(function () {
        var _global$XingyuePhoneA2;
        return ((_global$XingyuePhoneA2 = global.XingyuePhoneAppearance) === null || _global$XingyuePhoneA2 === void 0 ? void 0 : _global$XingyuePhoneA2.getSnapshot()) || {
          themeId: 'violet',
          coverUrl: '',
          coverPosition: 50
        };
      }),
      _useState14 = _slicedToArray(_useState13, 2),
      appearance = _useState14[0],
      setAppearance = _useState14[1];
    useEffect(function () {
      var _global$XingyuePhoneA3;
      return (_global$XingyuePhoneA3 = global.XingyuePhoneAppearance) === null || _global$XingyuePhoneA3 === void 0 ? void 0 : _global$XingyuePhoneA3.subscribe(setAppearance);
    }, []);
    var activeView = normalizeView(controlledView, internalView);
    var pageScrollRef = useRef(null);
    useEffect(function () {
      if (pageScrollRef.current) pageScrollRef.current.scrollTop = 0;
    }, [activeView]);
    var _useState15 = useState(activeView === 'library'),
      _useState16 = _slicedToArray(_useState15, 2),
      libraryVisited = _useState16[0],
      setLibraryVisited = _useState16[1];
    var _useState17 = useState(false),
      _useState18 = _slicedToArray(_useState17, 2),
      chatNavExpanded = _useState18[0],
      setChatNavExpanded = _useState18[1];
    var previousChatStateRef = useRef({
      view: activeView,
      messageCount: Number(chatMessageCount) || 0,
      loading: Boolean(chatIsLoading),
      focused: Boolean(chatInputFocused),
      entered: Boolean(chatInputEntered)
    });
    useEffect(function () {
      if (activeView === 'library') setLibraryVisited(true);
    }, [activeView]);
    useEffect(function () {
      var previous = previousChatStateRef.current;
      var current = {
        view: activeView,
        messageCount: Number(chatMessageCount) || 0,
        loading: Boolean(chatIsLoading),
        focused: Boolean(chatInputFocused),
        entered: Boolean(chatInputEntered)
      };
      var shouldReclaimChatNav = activeView === 'chat' && (previous.view !== 'chat' || current.messageCount > previous.messageCount || current.loading && !previous.loading || current.focused && !previous.focused || current.entered && !previous.entered);
      if (activeView !== 'chat' || shouldReclaimChatNav) setChatNavExpanded(false);
      previousChatStateRef.current = current;
    }, [activeView, chatMessageCount, chatIsLoading, chatInputFocused, chatInputEntered]);
    var agent = useMemo(function () {
      return getAgentState(agentStatus);
    }, [agentStatus]);
    var today = useMemo(function () {
      return formatToday();
    }, []);
    var isEnabled = enabled !== false;
    var customHumanAvatar = typeof avatarUrl === 'string' ? avatarUrl.trim() : '';
    var preferredImage = persona === 'wolf' ? PERSONA_IMAGES.wolf : customHumanAvatar || PERSONA_IMAGES.human;
    var imageSource = persona === 'human' && customHumanAvatar && failedImages[customHumanAvatar] ? PERSONA_IMAGES.human : preferredImage;
    var imageFailed = Boolean(failedImages[imageSource]);
    var homeImageSource = appearance.coverUrl && !failedImages[appearance.coverUrl] ? appearance.coverUrl : imageSource;
    useEffect(function () {
      setFailedImages({});
    }, [avatarUrl]);
    var markImageFailed = useCallback(function (source) {
      if (!source) return;
      setFailedImages(function (previous) {
        return previous[source] ? previous : _objectSpread(_objectSpread({}, previous), {}, _defineProperty({}, source, true));
      });
    }, []);
    var dispatchAction = useCallback(function (action) {
      if (typeof onAction === 'function') onAction(action);
    }, [onAction]);
    var changeView = useCallback(function (nextView) {
      var next = normalizeView(nextView, activeView);
      if (controlledView === undefined) setInternalView(next);
      if (typeof onViewChange === 'function') onViewChange(next);
    }, [activeView, controlledView, onViewChange]);
    var setTheme = useCallback(function (nextPersona) {
      setPersona(nextPersona === 'wolf' ? 'wolf' : 'human');
    }, []);
    var chatNavNeedsCollapse = activeView === 'chat' && ((Number(chatMessageCount) || 0) > 0 || Boolean(chatIsLoading) || Boolean(chatInputEntered));
    var chatNavCollapsed = activeView === 'chat' && chatNavNeedsCollapse && !chatNavExpanded;
    useEffect(function () {
      var _global$document, _global$XingyuePhoneD3, _global$XingyuePhoneD4;
      var shell = (_global$document = global.document) === null || _global$document === void 0 ? void 0 : _global$document.querySelector('.app-shell');
      if (!shell) return undefined;
      shell.style.setProperty('--mc-chat-nav-space', chatNavCollapsed ? '0px' : '84px');
      shell.dataset.mobileNav = chatNavCollapsed ? 'collapsed' : 'expanded';
      (_global$XingyuePhoneD3 = global.XingyuePhoneDisplayInfo) === null || _global$XingyuePhoneD3 === void 0 || (_global$XingyuePhoneD4 = _global$XingyuePhoneD3.rememberChatLayout) === null || _global$XingyuePhoneD4 === void 0 || _global$XingyuePhoneD4.call(_global$XingyuePhoneD3);
      return function () {
        shell.style.removeProperty('--mc-chat-nav-space');
        delete shell.dataset.mobileNav;
      };
    }, [chatNavCollapsed, activeView]);
    var screenClass = "mc-screen mc-screen--".concat(activeView, " ").concat(persona === 'wolf' ? 'is-wolf' : 'is-human');
    return /*#__PURE__*/React.createElement(Fragment, null, isEnabled && /*#__PURE__*/React.createElement("div", {
      className: "xingyue-mobile-cabin",
      "data-enabled": "true",
      "data-mobile-view": activeView,
      "data-mobile-nav": chatNavCollapsed ? 'collapsed' : 'expanded',
      "data-persona": persona,
      "aria-label": "\u661F\u6708\u8231\u624B\u673A\u7248"
    }, /*#__PURE__*/React.createElement("main", {
      ref: pageScrollRef,
      className: "".concat(screenClass, " ").concat(activeView === 'library' && libraryContent ? 'mc-screen--embedded' : '')
    }, activeView === 'home' && /*#__PURE__*/React.createElement(HomeView, {
      agent: agent,
      imageSource: homeImageSource,
      imageFailed: Boolean(failedImages[homeImageSource]),
      coverPosition: homeImageSource === appearance.coverUrl ? (_appearance$coverPosi = appearance.coverPosition) !== null && _appearance$coverPosi !== void 0 ? _appearance$coverPosi : 50 : 50,
      customCover: homeImageSource === appearance.coverUrl,
      onImageError: function onImageError() {
        return markImageFailed(homeImageSource);
      },
      persona: persona,
      userName: userName,
      today: today,
      onAction: dispatchAction,
      onViewChange: changeView
    }), activeView === 'chat' && /*#__PURE__*/React.createElement(ChatPassThrough, null), activeView === 'life' && /*#__PURE__*/React.createElement(LifeView, {
      today: today,
      onAction: dispatchAction
    }), libraryContent && (libraryVisited || activeView === 'library') && /*#__PURE__*/React.createElement("section", {
      className: "mc-library-persistent",
      hidden: activeView !== 'library'
    }, libraryContent), activeView === 'library' && !libraryContent && /*#__PURE__*/React.createElement(LibraryView, {
      libraryContent: null,
      onAction: dispatchAction
    }), activeView === 'profile' && /*#__PURE__*/React.createElement(ProfileView, {
      agent: agent,
      persona: persona,
      imageSource: imageSource,
      imageFailed: imageFailed,
      onImageError: function onImageError() {
        return markImageFailed(imageSource);
      },
      onAction: dispatchAction,
      onPersonaChange: setTheme
    })), chatNavCollapsed && /*#__PURE__*/React.createElement("button", {
      className: "mc-nav-reveal",
      type: "button",
      "aria-expanded": "false",
      "aria-controls": "xingyue-mobile-nav",
      "aria-label": "\u5C55\u5F00\u661F\u6708\u8231\u4E3B\u5BFC\u822A",
      onClick: function onClick() {
        return setChatNavExpanded(true);
      }
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "chevron",
      size: 16
    }), /*#__PURE__*/React.createElement("span", null, "\u5BFC\u822A")), !chatNavCollapsed && /*#__PURE__*/React.createElement("nav", {
      id: "xingyue-mobile-nav",
      className: "mc-nav",
      "aria-label": "\u661F\u6708\u8231\u4E3B\u5BFC\u822A"
    }, activeView === 'chat' && chatNavNeedsCollapse && /*#__PURE__*/React.createElement("button", {
      className: "mc-nav__collapse",
      type: "button",
      "aria-label": "\u6536\u8D77\u5E95\u90E8\u5BFC\u822A",
      onClick: function onClick() {
        return setChatNavExpanded(false);
      }
    }, /*#__PURE__*/React.createElement(Glyph, {
      name: "chevron",
      size: 14
    })), NAV_ITEMS.map(function (item) {
      return /*#__PURE__*/React.createElement("button", {
        className: "mc-nav__item ".concat(activeView === item.id ? 'is-active' : ''),
        key: item.id,
        type: "button",
        "aria-current": activeView === item.id ? 'page' : undefined,
        onClick: function onClick() {
          return changeView(item.id);
        }
      }, /*#__PURE__*/React.createElement(Glyph, {
        name: item.icon,
        size: 21
      }), /*#__PURE__*/React.createElement("span", null, item.label));
    }))));
  }
  global.XingyueMobileCabin = {
    MobileCabin: MobileCabin
  };
})(typeof window !== 'undefined' ? window : globalThis);
