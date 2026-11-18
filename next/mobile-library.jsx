(function (global) {
    function resolve(relative) {
        const baseURI = global.document?.baseURI || global.location?.href || './';
        return new URL(relative, baseURI);
    }
    function MobileLibrary() {
        const libraryGateUrl = resolve('./library/gate.html').href;
        const libraryIndexUrl = resolve('./library/index.html');
        const adaptEmbeddedPage = event => {
            // Only the exact same-origin library page gets the embedded navigation adjustment.
            try {
                const frame = event.currentTarget;
                const frameLocation = frame.contentWindow.location;
                if (frameLocation.origin !== libraryIndexUrl.origin || frameLocation.pathname !== libraryIndexUrl.pathname) return;
                const doc = frame.contentDocument;
                if (!doc || doc.getElementById('xingyue-embedded-layout')) return;
                const style = doc.createElement('style');
                style.id = 'xingyue-embedded-layout';
                style.textContent = '.mobile-nav{display:none!important}.library-footer{padding-bottom:16px!important}';
                doc.head.appendChild(style);
            } catch (_) { /* The standalone library remains usable if embedding is unavailable. */ }
        };
        return <iframe className="mc-library-frame" src={libraryGateUrl} title="云书房阅读与管理" referrerPolicy="no-referrer" onLoad={adaptEmbeddedPage} />;
    }
    global.XingyueMobileLibrary = { MobileLibrary };
})(window);
