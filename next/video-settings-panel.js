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
(function () {
  var _React = React,
    useEffect = _React.useEffect,
    useRef = _React.useRef,
    useState = _React.useState;
  var videoRuntime = window.XingyueVideo || {};
  var MAX_BYTES = Number(videoRuntime.MAX_BYTES || 25 * 1024 * 1024);
  var MAX_SECONDS = Number(videoRuntime.MAX_SECONDS || 60);
  var DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com';
  var VIDEO_CHAT_MODE_KEY = 'xingyue_video_chat_mode_v1';
  var VIDEO_CHAT_TEXT_MODE_KEY = 'xingyue_video_chat_text_mode_v1';
  var VIDEO_CHAT_MODES = Object.freeze({
    UNIFIED: 'unified',
    LEGACY: 'legacy'
  });
  var VIDEO_CHAT_CHOICES = Object.freeze({
    VIDEO_ONLY: 'video-only',
    UNIFIED: 'unified-text',
    LEGACY: 'legacy'
  });
  var readVideoChatMode = function readVideoChatMode() {
    try {
      return localStorage.getItem(VIDEO_CHAT_MODE_KEY) === VIDEO_CHAT_MODES.LEGACY ? VIDEO_CHAT_MODES.LEGACY : VIDEO_CHAT_MODES.UNIFIED;
    } catch (_) {
      return VIDEO_CHAT_MODES.UNIFIED;
    }
  };
  var readVideoChatTextMode = function readVideoChatTextMode() {
    try {
      var explicit = localStorage.getItem(VIDEO_CHAT_TEXT_MODE_KEY);
      if (explicit !== null) return explicit === '1' || explicit === 'true';
      // Backward compatibility: an existing explicit `unified` choice
      // previously enabled ordinary text/image turns as well. A brand-new
      // install has no mode key and therefore defaults to video-only.
      return localStorage.getItem(VIDEO_CHAT_MODE_KEY) === VIDEO_CHAT_MODES.UNIFIED;
    } catch (_) {
      return false;
    }
  };
  var writeVideoChatMode = function writeVideoChatMode(mode) {
    var next = mode === VIDEO_CHAT_MODES.LEGACY ? VIDEO_CHAT_MODES.LEGACY : VIDEO_CHAT_MODES.UNIFIED;
    try {
      localStorage.setItem(VIDEO_CHAT_MODE_KEY, next);
    } catch (_) {}
    try {
      window.dispatchEvent(new CustomEvent('xingyue-video-chat-mode', {
        detail: next
      }));
    } catch (_) {}
    return next;
  };
  var writeVideoChatTextMode = function writeVideoChatTextMode(enabled) {
    var next = Boolean(enabled);
    try {
      localStorage.setItem(VIDEO_CHAT_TEXT_MODE_KEY, next ? '1' : '0');
    } catch (_) {}
    try {
      window.dispatchEvent(new CustomEvent('xingyue-video-chat-text-mode', {
        detail: next
      }));
    } catch (_) {}
    return next;
  };
  var composeMessage = videoRuntime.composeMessage;
  var splitMessage = videoRuntime.splitMessage;
  var preserveEvidence = videoRuntime.preserveEvidence;
  var inspectFile = videoRuntime.inspectFile;
  var textOf = function textOf(value) {
    return String(value !== null && value !== void 0 ? value : '');
  };
  var formatBytes = function formatBytes(value) {
    var bytes = Number(value) || 0;
    if (bytes >= 1024 * 1024) return "".concat((bytes / (1024 * 1024)).toFixed(1), " MiB");
    if (bytes >= 1024) return "".concat(Math.round(bytes / 1024), " KiB");
    return "".concat(bytes, " B");
  };
  var formatDuration = function formatDuration(value) {
    var seconds = Number(value);
    if (!Number.isFinite(seconds) || seconds <= 0) return '待核验';
    if (seconds < 60) return "".concat(seconds.toFixed(1).replace(/\.0$/, ''), " \u79D2");
    return "".concat(Math.floor(seconds / 60), " \u5206 ").concat(Math.round(seconds % 60), " \u79D2");
  };
  var formatAudio = function formatAudio(value) {
    return value === true ? '已检测到音轨' : value === false ? '未检测到音轨' : '待服务端核验音轨';
  };
  var normalizeStatus = function normalizeStatus(value) {
    if (value && value.video && _typeof(value.video) === 'object' && value.baseUrl === undefined) return value.video;
    return value && _typeof(value) === 'object' ? value : {};
  };
  var getClient = function getClient(clientRef) {
    var _window$XingyueVideo;
    if (!clientRef.current && typeof ((_window$XingyueVideo = window.XingyueVideo) === null || _window$XingyueVideo === void 0 ? void 0 : _window$XingyueVideo.createClient) === 'function') {
      clientRef.current = window.XingyueVideo.createClient();
    }
    return clientRef.current;
  };
  var VideoComposer = function VideoComposer(_ref) {
    var pendingVideo = _ref.pendingVideo,
      onClear = _ref.onClear,
      onStop = _ref.onStop,
      onRetry = _ref.onRetry;
    var phase = (pendingVideo === null || pendingVideo === void 0 ? void 0 : pendingVideo.phase) || '';
    if (!pendingVideo) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "xy-video-pending ".concat(phase === 'analyzing' ? 'is-analyzing' : '')
    }, /*#__PURE__*/React.createElement("div", {
      className: "xy-video-pending-preview"
    }, /*#__PURE__*/React.createElement("span", {
      className: "xy-video-pending-icon",
      "aria-hidden": "true"
    }, "\uD83C\uDF9E\uFE0F")), /*#__PURE__*/React.createElement("div", {
      className: "xy-video-pending-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "xy-video-pending-heading"
    }, /*#__PURE__*/React.createElement("span", {
      className: "xy-video-pending-name",
      title: pendingVideo.name
    }, pendingVideo.name || '本地视频'), /*#__PURE__*/React.createElement("span", {
      className: "xy-video-pending-size"
    }, formatBytes(pendingVideo.size))), /*#__PURE__*/React.createElement("div", {
      className: "xy-video-pending-meta"
    }, phase === 'selected' && pendingVideo.duration == null ? '已选好，待发送' : "".concat(formatDuration(pendingVideo.duration), " \xB7 ").concat(formatAudio(pendingVideo.hasAudio))), phase === 'analyzing' || phase === 'inspecting' ? /*#__PURE__*/React.createElement("div", {
      className: "xy-video-pending-status is-progress"
    }, /*#__PURE__*/React.createElement("span", null, pendingVideo.progress || (phase === 'inspecting' ? '正在读取视频信息…' : '正在发送视频并开始理解…')), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onStop,
      className: "xy-video-inline-button is-stop"
    }, "\u505C\u6B62")) : phase === 'error' || phase === 'cancelled' ? /*#__PURE__*/React.createElement("div", {
      className: "xy-video-pending-status is-error"
    }, /*#__PURE__*/React.createElement("span", null, pendingVideo.error || '视频处理失败，尚未发送聊天消息。'), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onRetry,
      className: "xy-video-inline-button"
    }, "\u91CD\u8BD5")) : /*#__PURE__*/React.createElement("div", {
      className: "xy-video-pending-status"
    }, pendingVideo.duration == null ? '点发送后上传，电脑会检查时长和音轨，再交给视频模型。' : '视频检查完成，点发送后交给视频模型。', "\u53EF\u80FD\u6D88\u8017\u89C6\u9891\u63A5\u53E3\u989D\u5EA6\u3002")), phase !== 'analyzing' && phase !== 'inspecting' && /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onClear,
      className: "xy-video-clear-button",
      title: "\u53D6\u6D88\u9009\u62E9\u89C6\u9891"
    }, "\xD7"));
  };
  var TextAttachmentCard = function TextAttachmentCard(_ref2) {
    var pendingText = _ref2.pendingText,
      onClear = _ref2.onClear,
      onStop = _ref2.onStop,
      onRetry = _ref2.onRetry;
    if (!pendingText) return null;
    var phase = pendingText.phase || '';
    return /*#__PURE__*/React.createElement("div", {
      className: "xy-text-pending"
    }, /*#__PURE__*/React.createElement("div", {
      className: "xy-text-pending-icon",
      "aria-hidden": "true"
    }, "\uD83D\uDCCE"), /*#__PURE__*/React.createElement("div", {
      className: "xy-text-pending-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "xy-text-pending-heading"
    }, /*#__PURE__*/React.createElement("span", {
      className: "xy-text-pending-name",
      title: pendingText.name
    }, pendingText.name || '文本附件'), /*#__PURE__*/React.createElement("span", {
      className: "xy-text-pending-size"
    }, formatBytes(pendingText.size))), /*#__PURE__*/React.createElement("div", {
      className: "xy-text-pending-status ".concat(phase === 'error' || phase === 'cancelled' ? 'is-error' : '')
    }, /*#__PURE__*/React.createElement("span", null, phase === 'reading' ? pendingText.progress || '正在读取文本附件…' : phase === 'error' || phase === 'cancelled' ? pendingText.error || '文本附件读取失败，尚未发送聊天消息。' : "\u6B63\u6587 ".concat(Number(pendingText.chars) || 0, " \u5B57 \xB7 \u4EC5\u53D1\u9001\u6709\u9650\u6587\u5B57\u8D44\u6599")), phase === 'reading' && /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onStop,
      className: "xy-video-inline-button is-stop"
    }, "\u505C\u6B62"), (phase === 'error' || phase === 'cancelled') && /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onRetry,
      className: "xy-video-inline-button"
    }, "\u91CD\u8BD5"))), phase !== 'reading' && /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onClear,
      className: "xy-video-clear-button",
      title: "\u53D6\u6D88\u9009\u62E9\u6587\u672C\u9644\u4EF6"
    }, "\xD7"));
  };
  var VideoSettingsPanel = function VideoSettingsPanel(_ref3) {
    var _ref3$desktopAvailabl = _ref3.desktopAvailable,
      desktopAvailable = _ref3$desktopAvailabl === void 0 ? false : _ref3$desktopAvailabl,
      Icon = _ref3.Icon,
      showToast = _ref3.showToast;
    var clientRef = useRef(null);
    var _useState = useState(DEFAULT_BASE_URL),
      _useState2 = _slicedToArray(_useState, 2),
      baseUrl = _useState2[0],
      setBaseUrl = _useState2[1];
    var _useState3 = useState(''),
      _useState4 = _slicedToArray(_useState3, 2),
      model = _useState4[0],
      setModel = _useState4[1];
    var _useState5 = useState(''),
      _useState6 = _slicedToArray(_useState5, 2),
      apiKey = _useState6[0],
      setApiKey = _useState6[1];
    var _useState7 = useState(null),
      _useState8 = _slicedToArray(_useState7, 2),
      status = _useState8[0],
      setStatus = _useState8[1];
    var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      busy = _useState10[0],
      setBusy = _useState10[1];
    var _useState11 = useState(''),
      _useState12 = _slicedToArray(_useState11, 2),
      statusError = _useState12[0],
      setStatusError = _useState12[1];
    var _useState13 = useState(readVideoChatMode),
      _useState14 = _slicedToArray(_useState13, 2),
      chatMode = _useState14[0],
      setChatMode = _useState14[1];
    var _useState15 = useState(readVideoChatTextMode),
      _useState16 = _slicedToArray(_useState15, 2),
      chatTextMode = _useState16[0],
      setChatTextMode = _useState16[1];
    var refreshStatus = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var client, next;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              client = getClient(clientRef);
              if (!(!client || typeof client.status !== 'function')) {
                _context.next = 4;
                break;
              }
              setStatusError('视频接口模块尚未加载');
              return _context.abrupt("return");
            case 4:
              _context.prev = 4;
              _context.t0 = normalizeStatus;
              _context.next = 8;
              return Promise.resolve(client.status());
            case 8:
              _context.t1 = _context.sent;
              next = (0, _context.t0)(_context.t1);
              setStatus(next);
              if (next.baseUrl) setBaseUrl(next.baseUrl);
              if (next.model) setModel(next.model);
              setStatusError(next.configurationError || '');
              _context.next = 19;
              break;
            case 16:
              _context.prev = 16;
              _context.t2 = _context["catch"](4);
              setStatusError(textOf((_context.t2 === null || _context.t2 === void 0 ? void 0 : _context.t2.message) || '无法读取视频接口状态'));
            case 19:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[4, 16]]);
      }));
      return function refreshStatus() {
        return _ref4.apply(this, arguments);
      };
    }();
    useEffect(function () {
      void refreshStatus();
    }, []);
    useEffect(function () {
      var syncChatMode = function syncChatMode() {
        setChatMode(readVideoChatMode());
        setChatTextMode(readVideoChatTextMode());
      };
      window.addEventListener('storage', syncChatMode);
      window.addEventListener('xingyue-video-chat-mode', syncChatMode);
      window.addEventListener('xingyue-video-chat-text-mode', syncChatMode);
      return function () {
        window.removeEventListener('storage', syncChatMode);
        window.removeEventListener('xingyue-video-chat-mode', syncChatMode);
        window.removeEventListener('xingyue-video-chat-text-mode', syncChatMode);
      };
    }, []);
    var chooseChatMode = function chooseChatMode(mode, useUnifiedText) {
      var nextMode = writeVideoChatMode(mode);
      var nextTextMode = writeVideoChatTextMode(useUnifiedText);
      setChatMode(nextMode);
      setChatTextMode(nextTextMode);
      var toast = nextMode === VIDEO_CHAT_MODES.LEGACY ? '已切换为旧视频方式，文字沿用当前聊天模型' : nextTextMode ? '已切换为文字和视频统一模型' : '已切换为视频直读，文字沿用当前聊天模型';
      showToast === null || showToast === void 0 || showToast(toast);
    };
    var saveConfig = /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var client, next;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (desktopAvailable) {
                _context2.next = 3;
                break;
              }
              setStatusError('手机端只读取状态，请在电脑端设置视频 Key');
              return _context2.abrupt("return");
            case 3:
              client = getClient(clientRef);
              if (!(!client || typeof client.configure !== 'function')) {
                _context2.next = 7;
                break;
              }
              setStatusError('视频接口模块尚未加载');
              return _context2.abrupt("return");
            case 7:
              if (!(!textOf(apiKey).trim() && !(status !== null && status !== void 0 && status.configured))) {
                _context2.next = 10;
                break;
              }
              setStatusError('首次配置需要填写视频接口 Key');
              return _context2.abrupt("return");
            case 10:
              setBusy(true);
              setStatusError('');
              _context2.prev = 12;
              _context2.next = 15;
              return Promise.resolve(client.configure(_objectSpread({
                baseUrl: textOf(baseUrl).trim() || DEFAULT_BASE_URL,
                model: textOf(model).trim()
              }, textOf(apiKey).trim() ? {
                apiKey: textOf(apiKey).trim()
              } : {})));
            case 15:
              next = _context2.sent;
              setStatus(normalizeStatus(next));
              showToast === null || showToast === void 0 || showToast('视频配置已保存到电脑主机私有配置');
              _context2.next = 23;
              break;
            case 20:
              _context2.prev = 20;
              _context2.t0 = _context2["catch"](12);
              setStatusError(textOf((_context2.t0 === null || _context2.t0 === void 0 ? void 0 : _context2.t0.message) || '视频接口保存失败'));
            case 23:
              _context2.prev = 23;
              // Key 只在本组件内存中短暂存在；成功或失败后都不留在表单状态。
              setApiKey('');
              setBusy(false);
              return _context2.finish(23);
            case 27:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[12, 20, 23, 27]]);
      }));
      return function saveConfig() {
        return _ref5.apply(this, arguments);
      };
    }();
    var clearConfig = /*#__PURE__*/function () {
      var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var client, next;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (desktopAvailable) {
                _context3.next = 3;
                break;
              }
              setStatusError('手机端不能修改视频接口配置');
              return _context3.abrupt("return");
            case 3:
              client = getClient(clientRef);
              if (!(!client || typeof client.configure !== 'function')) {
                _context3.next = 6;
                break;
              }
              return _context3.abrupt("return");
            case 6:
              setBusy(true);
              _context3.prev = 7;
              _context3.next = 10;
              return Promise.resolve(client.configure({
                clear: true
              }));
            case 10:
              next = _context3.sent;
              setStatus(normalizeStatus(next));
              setApiKey('');
              setModel('');
              setBaseUrl(DEFAULT_BASE_URL);
              showToast === null || showToast === void 0 || showToast('视频接口配置已清空');
              _context3.next = 21;
              break;
            case 18:
              _context3.prev = 18;
              _context3.t0 = _context3["catch"](7);
              setStatusError(textOf((_context3.t0 === null || _context3.t0 === void 0 ? void 0 : _context3.t0.message) || '清空视频接口失败'));
            case 21:
              _context3.prev = 21;
              setBusy(false);
              return _context3.finish(21);
            case 24:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[7, 18, 21, 24]]);
      }));
      return function clearConfig() {
        return _ref6.apply(this, arguments);
      };
    }();
    var configured = Boolean((status === null || status === void 0 ? void 0 : status.configured) && textOf(status === null || status === void 0 ? void 0 : status.model).trim());
    return /*#__PURE__*/React.createElement("section", {
      className: "xy-video-settings rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "text-sm font-semibold text-indigo-900 flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true"
    }, "\uD83C\uDF9E\uFE0F"), " \u89C6\u9891\u7406\u89E3\uFF08Gemini\uFF09"), /*#__PURE__*/React.createElement("p", {
      className: "mt-1 text-[11px] leading-relaxed text-indigo-700"
    }, "\u72EC\u7ACB\u89C6\u9891\u670D\u52A1\u53EA\u63A5\u6536\u4F60\u660E\u786E\u53D1\u9001\u7684\u89C6\u9891\u548C\u95EE\u9898\uFF1B\u539F\u89C6\u9891\u4E0D\u5199\u5165\u6B63\u5F0F\u804A\u5929\u540C\u6B65\u3002\u5206\u6790\u53EF\u80FD\u6D88\u8017\u89C6\u9891\u670D\u52A1\u989D\u5EA6\uFF0C\u5EFA\u8BAE\u5148\u7528 10 \u79D2\u5DE6\u53F3\u77ED\u7247\u3002")), /*#__PURE__*/React.createElement("span", {
      className: "xy-video-status-pill ".concat(configured ? 'is-ready' : 'is-empty')
    }, configured ? '已配置' : '未配置')), /*#__PURE__*/React.createElement("div", {
      className: "rounded-lg bg-white/70 border border-indigo-100 px-3 py-2 text-[11px] text-gray-600 leading-relaxed"
    }, desktopAvailable ? 'Key 只在本组件内存中填写，提交后立即清空；配置由电脑主机私有保存，手机只使用，不进入普通设置、聊天或同步。' : '视频配置由电脑主机私有保存，手机只使用并读取状态，不保存或修改视频 Key。'), /*#__PURE__*/React.createElement("div", {
      className: "rounded-lg border border-indigo-100 bg-white/80 p-3 space-y-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] font-semibold text-indigo-900"
    }, "\u804A\u5929\u53D1\u9001\u65B9\u5F0F\uFF08\u4E09\u79CD\u6A21\u5F0F\uFF09"), /*#__PURE__*/React.createElement("label", {
      className: "flex items-start gap-2 text-[11px] leading-relaxed text-gray-700 cursor-pointer"
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: "xingyue-video-chat-choice",
      value: VIDEO_CHAT_CHOICES.VIDEO_ONLY,
      checked: chatMode === VIDEO_CHAT_MODES.UNIFIED && !chatTextMode,
      onChange: function onChange() {
        return chooseChatMode(VIDEO_CHAT_MODES.UNIFIED, false);
      },
      className: "mt-0.5"
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u89C6\u9891\u76F4\u8BFB\uFF08\u9ED8\u8BA4\uFF09"), /*#__PURE__*/React.createElement("br", null), "\u4EC5\u5E26\u89C6\u9891\u7684\u53D1\u9001\u4F7F\u7528\u89C6\u9891\u914D\u7F6E\u6A21\u578B\uFF1B\u6587\u5B57\u53D1\u9001\u3001\u91CD\u751F\u6210\u3001\u7F16\u8F91\u91CD\u53D1\u6CBF\u7528\u5F53\u524D\u804A\u5929\u6A21\u578B\u3002\u539F\u7247\u548C\u95EE\u9898\u540C\u4E00\u8F6E\u53D1\u9001\u3002")), /*#__PURE__*/React.createElement("label", {
      className: "flex items-start gap-2 text-[11px] leading-relaxed text-gray-700 cursor-pointer"
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: "xingyue-video-chat-choice",
      value: VIDEO_CHAT_CHOICES.UNIFIED,
      checked: chatMode === VIDEO_CHAT_MODES.UNIFIED && chatTextMode,
      onChange: function onChange() {
        return chooseChatMode(VIDEO_CHAT_MODES.UNIFIED, true);
      },
      className: "mt-0.5"
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u6587\u5B57\u548C\u89C6\u9891\u7EDF\u4E00"), /*#__PURE__*/React.createElement("br", null), "\u6587\u5B57\u53D1\u9001\u3001\u56FE\u7247\u3001\u91CD\u751F\u6210\u3001\u7F16\u8F91\u91CD\u53D1\u548C\u89C6\u9891\u90FD\u4F7F\u7528\u89C6\u9891\u914D\u7F6E\u6A21\u578B\uFF1B\u89C6\u9891\u539F\u7247\u4E0E\u95EE\u9898\u540C\u4E00\u8F6E\u53D1\u9001\u3002")), /*#__PURE__*/React.createElement("label", {
      className: "flex items-start gap-2 text-[11px] leading-relaxed text-gray-700 cursor-pointer"
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: "xingyue-video-chat-choice",
      value: VIDEO_CHAT_CHOICES.LEGACY,
      checked: chatMode === VIDEO_CHAT_MODES.LEGACY,
      onChange: function onChange() {
        return chooseChatMode(VIDEO_CHAT_MODES.LEGACY, false);
      },
      className: "mt-0.5"
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u65E7\u89C6\u9891\u65B9\u5F0F\uFF08\u53EF\u56DE\u5207\uFF09"), /*#__PURE__*/React.createElement("br", null), "\u89C6\u9891\u5148\u751F\u6210\u6587\u5B57\u4F9D\u636E\uFF0C\u518D\u4EA4\u7ED9\u5F53\u524D\u804A\u5929\u6A21\u578B\uFF1B\u6587\u5B57\u53D1\u9001\u3001\u91CD\u751F\u6210\u3001\u7F16\u8F91\u91CD\u53D1\u6CBF\u7528\u5F53\u524D\u914D\u7F6E\u3002")), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] leading-relaxed text-gray-500"
    }, "\u9996\u6B21\u5347\u7EA7\u9ED8\u8BA4\u53EA\u542F\u7528\u89C6\u9891\u76F4\u8BFB\uFF0C\u4E0D\u4F1A\u628A\u65E5\u5E38\u804A\u5929\u81EA\u52A8\u6362\u6210\u53D7\u9650\u89C6\u9891\u6A21\u578B\u3002\u7EDF\u4E00\u6A21\u578B\u4E0D\u53EF\u7528\u65F6\uFF0C\u666E\u901A\u6587\u5B57\u4ECD\u53EF\u4F7F\u7528\u539F\u804A\u5929\u914D\u7F6E\uFF1B\u5E26\u539F\u89C6\u9891\u7684\u8BF7\u6C42\u4E0D\u4F1A\u9759\u9ED8\u6539\u8D70\u53E6\u4E00\u6761\u6536\u8D39\u94FE\u8DEF\u3002")), desktopAvailable ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      className: "block text-[10px] text-gray-500 font-bold"
    }, "\u89C6\u9891\u670D\u52A1 Base URL"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: baseUrl,
      onChange: function onChange(event) {
        return setBaseUrl(event.target.value);
      },
      disabled: busy,
      className: "w-full bg-white border border-indigo-200 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none",
      placeholder: DEFAULT_BASE_URL
    }), /*#__PURE__*/React.createElement("label", {
      className: "block text-[10px] text-gray-500 font-bold"
    }, "\u89C6\u9891\u6A21\u578B"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: model,
      onChange: function onChange(event) {
        return setModel(event.target.value);
      },
      disabled: busy,
      className: "w-full bg-white border border-indigo-200 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none",
      placeholder: "\u586B\u5199\u5DF2\u786E\u8BA4\u652F\u6301\u89C6\u9891\u7684 Gemini \u6A21\u578B\u540D"
    }), /*#__PURE__*/React.createElement("label", {
      className: "block text-[10px] text-gray-500 font-bold"
    }, "\u89C6\u9891\u63A5\u53E3 Key\uFF08\u4EC5\u4E3B\u673A\u4FDD\u5B58\uFF09"), /*#__PURE__*/React.createElement("input", {
      type: "password",
      value: apiKey,
      onChange: function onChange(event) {
        return setApiKey(event.target.value);
      },
      disabled: busy,
      autoComplete: "new-password",
      className: "w-full bg-white border border-indigo-200 rounded-lg p-2 text-sm focus:border-indigo-500 outline-none",
      placeholder: status !== null && status !== void 0 && status.configured ? '留空表示沿用主机已保存 Key' : '填写视频服务 Key'
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: saveConfig,
      disabled: busy || !apiKey.trim() && !(status !== null && status !== void 0 && status.configured),
      className: "px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:opacity-50"
    }, busy ? '保存中…' : '保存到主机私有配置'), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: refreshStatus,
      disabled: busy,
      className: "px-3 py-2 rounded-lg bg-white border border-indigo-200 text-indigo-700 text-xs font-medium hover:bg-indigo-50 disabled:opacity-50"
    }, "\u5237\u65B0\u72B6\u6001"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: clearConfig,
      disabled: busy || !(status !== null && status !== void 0 && status.configured),
      className: "px-3 py-2 rounded-lg bg-white border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 disabled:opacity-50"
    }, "\u6E05\u7A7A\u4E3B\u673A\u914D\u7F6E"))) : /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: refreshStatus,
      disabled: busy,
      className: "px-3 py-2 rounded-lg bg-white border border-indigo-200 text-indigo-700 text-xs font-medium hover:bg-indigo-50 disabled:opacity-50"
    }, "\u5237\u65B0\u7535\u8111\u4E3B\u673A\u72B6\u6001"), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] leading-relaxed ".concat(statusError ? 'text-red-600' : 'text-gray-500')
    }, statusError || (status ? "\u4E3B\u673A\u72B6\u6001\uFF1A".concat(status.configured ? '已保存' : '未保存', " \xB7 \u5730\u5740\uFF1A").concat(textOf(status.baseUrl).trim() || '未返回', " \xB7 \u6A21\u578B\uFF1A").concat(textOf(status.model).trim() || '未返回') : '正在读取主机状态…')));
  };
  window.XingyueVideoUI = {
    composeMessage: composeMessage,
    splitMessage: splitMessage,
    preserveEvidence: preserveEvidence,
    inspectFile: inspectFile,
    VIDEO_CHAT_MODE_KEY: VIDEO_CHAT_MODE_KEY,
    VIDEO_CHAT_TEXT_MODE_KEY: VIDEO_CHAT_TEXT_MODE_KEY,
    VIDEO_CHAT_MODES: VIDEO_CHAT_MODES,
    VIDEO_CHAT_CHOICES: VIDEO_CHAT_CHOICES,
    getVideoChatMode: readVideoChatMode,
    setVideoChatMode: writeVideoChatMode,
    getVideoChatTextMode: readVideoChatTextMode,
    setVideoChatTextMode: writeVideoChatTextMode,
    VideoComposer: VideoComposer,
    TextAttachmentCard: TextAttachmentCard,
    VideoSettingsPanel: VideoSettingsPanel,
    MAX_BYTES: MAX_BYTES,
    MAX_SECONDS: MAX_SECONDS
  };
})();
