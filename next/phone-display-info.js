(function (global) {
    'use strict';
    let lastChatLayout = null;
    let lastCollapsedChatLayout = null;
    function bounds(element) {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {top:Math.round(rect.top),bottom:Math.round(rect.bottom),height:Math.round(rect.height)};
    }
    function rememberChatLayout() {
        const doc = global.document;
        const shell = doc.querySelector('.app-shell[data-mobile-view="chat"]');
        if (!shell) return;
        const dock = shell.querySelector('.mc-chat-composer-dock');
        lastChatLayout = {
            nav: shell.dataset.mobileNav,
            innerHeight:global.innerHeight,
            visualHeight:global.visualViewport?.height,
            app:bounds(shell),
            chat:bounds(shell.querySelector('.xy-chat-main')),
            inputDock:bounds(dock),
            inputBottomPadding:dock ? global.getComputedStyle(dock).paddingBottom : null,
        };
        if (shell.dataset.mobileNav === 'collapsed') lastCollapsedChatLayout = lastChatLayout;
    }
    // Deliberately excludes URLs, device IDs, credentials, files and messages.
    function read() {
        const doc = global.document;
        const probe = doc.createElement('div');
        probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
        doc.body.appendChild(probe);
        const style = global.getComputedStyle(probe);
        const insets = {top:style.paddingTop,bottom:style.paddingBottom,left:style.paddingLeft,right:style.paddingRight};
        probe.remove();
        const viewport = global.visualViewport;
        return {
            release: global.XINGYUE_MOBILE_RUNTIME?.releaseVersion || 'unknown',
            theme: doc.documentElement.dataset.phoneTheme || 'default',
            standalone: global.navigator?.standalone === true || global.matchMedia?.('(display-mode: standalone)')?.matches === true,
            screen: {width:global.screen?.width,height:global.screen?.height},
            inner: {width:global.innerWidth,height:global.innerHeight},
            visualViewport: viewport ? {width:viewport.width,height:viewport.height,offsetTop:viewport.offsetTop,scale:viewport.scale} : null,
            documentHeight: doc.documentElement.clientHeight,
            rootBackground: global.getComputedStyle(doc.documentElement).backgroundColor,
            bodyBackground: global.getComputedStyle(doc.body).backgroundColor,
            safeArea: insets,
            lastChatLayout,
            lastCollapsedChatLayout,
        };
    }
    global.XingyuePhoneDisplayInfo = Object.freeze({read, rememberChatLayout});
    global.addEventListener?.('resize', rememberChatLayout);
    global.visualViewport?.addEventListener?.('resize', rememberChatLayout);
})(window);
