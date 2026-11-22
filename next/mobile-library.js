"use strict";

(function (global) {
  function resolve(relative) {
    var _global$document, _global$location;
    var baseURI = ((_global$document = global.document) === null || _global$document === void 0 ? void 0 : _global$document.baseURI) || ((_global$location = global.location) === null || _global$location === void 0 ? void 0 : _global$location.href) || './';
    return new URL(relative, baseURI);
  }
  function MobileLibrary() {
    var libraryGateUrl = resolve('./library/gate.html').href;
    var libraryIndexUrl = resolve('./library/index.html');
    var adaptEmbeddedPage = function adaptEmbeddedPage(event) {
      // Only the exact same-origin library page gets the embedded navigation adjustment.
      try {
        var frame = event.currentTarget;
        var frameLocation = frame.contentWindow.location;
        if (frameLocation.origin !== libraryIndexUrl.origin || frameLocation.pathname !== libraryIndexUrl.pathname) return;
        var doc = frame.contentDocument;
        if (!doc || doc.getElementById('xingyue-embedded-layout')) return;
        var style = doc.createElement('style');
        style.id = 'xingyue-embedded-layout';
        style.textContent = '.mobile-nav{display:none!important}.library-footer{padding-bottom:16px!important}';
        doc.head.appendChild(style);
      } catch (_) {/* The standalone library remains usable if embedding is unavailable. */}
    };
    return /*#__PURE__*/React.createElement("iframe", {
      className: "mc-library-frame",
      src: libraryGateUrl,
      title: "\u4E91\u4E66\u623F\u9605\u8BFB\u4E0E\u7BA1\u7406",
      referrerPolicy: "no-referrer",
      onLoad: adaptEmbeddedPage
    });
  }
  global.XingyueMobileLibrary = {
    MobileLibrary: MobileLibrary
  };
})(window);
