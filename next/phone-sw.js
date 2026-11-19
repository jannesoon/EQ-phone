(function initXingyuePhoneWorker(scope) {
    'use strict';

    const injectedPaths = (() => {
        try { return ["/","/index.html","/manifest.json","/vendor/tailwind.css","/vendor/react.production.min.js","/vendor/react-dom.production.min.js","/vendor/babel.min.js","/vendor/marked.umd.js","/vendor/katex.min.css","/vendor/katex.min.js","/vendor/supabase.js","/style.css","/mobile-cabin.css","/mobile-integration.css","/mobile-runtime.js","/openai-compatible.js","/app-settings.js","/app-shell.jsx","/api-settings.jsx","/chat-client.js","/session-manager.js","/title-generator.js","/recent-life.js","/context-assembler.js","/rolling-continuity.js","/rich-content.js","/voice-manager.js","/speech-director.js","/drawing-manager.js","/health-manager.js","/health-calendar.jsx","/backup-manager.js","/migration-panel.jsx","/device-pairing-panel.jsx","/cloud-library.js","/diary-intent.js","/memory-candidate-intent.js","/portable-worldbook.js","/memory-vault-router.js","/history-tool-policy.js","/agent-client.js","/video-client.js","/attachment-content.js","/video-settings-panel.jsx","/task-center-panel.jsx","/identity-core-panel.jsx","/memory-governance-panel.jsx","/memory-overview-panel.jsx","/portable-worldbook-panel.jsx","/memory-sources-panel.jsx","/session-checkpoint-panel.jsx","/sync-queue.js","/host-sync-client.js","/mobile-library.jsx","/mobile-cabin.jsx","/script.js","/vendor/fonts/KaTeX_AMS-Regular.woff2","/vendor/fonts/KaTeX_AMS-Regular.woff","/vendor/fonts/KaTeX_AMS-Regular.ttf","/vendor/fonts/KaTeX_Caligraphic-Bold.woff2","/vendor/fonts/KaTeX_Caligraphic-Bold.woff","/vendor/fonts/KaTeX_Caligraphic-Bold.ttf","/vendor/fonts/KaTeX_Caligraphic-Regular.woff2","/vendor/fonts/KaTeX_Caligraphic-Regular.woff","/vendor/fonts/KaTeX_Caligraphic-Regular.ttf","/vendor/fonts/KaTeX_Fraktur-Bold.woff2","/vendor/fonts/KaTeX_Fraktur-Bold.woff","/vendor/fonts/KaTeX_Fraktur-Bold.ttf","/vendor/fonts/KaTeX_Fraktur-Regular.woff2","/vendor/fonts/KaTeX_Fraktur-Regular.woff","/vendor/fonts/KaTeX_Fraktur-Regular.ttf","/vendor/fonts/KaTeX_Main-Bold.woff2","/vendor/fonts/KaTeX_Main-Bold.woff","/vendor/fonts/KaTeX_Main-Bold.ttf","/vendor/fonts/KaTeX_Main-BoldItalic.woff2","/vendor/fonts/KaTeX_Main-BoldItalic.woff","/vendor/fonts/KaTeX_Main-BoldItalic.ttf","/vendor/fonts/KaTeX_Main-Italic.woff2","/vendor/fonts/KaTeX_Main-Italic.woff","/vendor/fonts/KaTeX_Main-Italic.ttf","/vendor/fonts/KaTeX_Main-Regular.woff2","/vendor/fonts/KaTeX_Main-Regular.woff","/vendor/fonts/KaTeX_Main-Regular.ttf","/vendor/fonts/KaTeX_Math-BoldItalic.woff2","/vendor/fonts/KaTeX_Math-BoldItalic.woff","/vendor/fonts/KaTeX_Math-BoldItalic.ttf","/vendor/fonts/KaTeX_Math-Italic.woff2","/vendor/fonts/KaTeX_Math-Italic.woff","/vendor/fonts/KaTeX_Math-Italic.ttf","/vendor/fonts/KaTeX_SansSerif-Bold.woff2","/vendor/fonts/KaTeX_SansSerif-Bold.woff","/vendor/fonts/KaTeX_SansSerif-Bold.ttf","/vendor/fonts/KaTeX_SansSerif-Italic.woff2","/vendor/fonts/KaTeX_SansSerif-Italic.woff","/vendor/fonts/KaTeX_SansSerif-Italic.ttf","/vendor/fonts/KaTeX_SansSerif-Regular.woff2","/vendor/fonts/KaTeX_SansSerif-Regular.woff","/vendor/fonts/KaTeX_SansSerif-Regular.ttf","/vendor/fonts/KaTeX_Script-Regular.woff2","/vendor/fonts/KaTeX_Script-Regular.woff","/vendor/fonts/KaTeX_Script-Regular.ttf","/vendor/fonts/KaTeX_Size1-Regular.woff2","/vendor/fonts/KaTeX_Size1-Regular.woff","/vendor/fonts/KaTeX_Size1-Regular.ttf","/vendor/fonts/KaTeX_Size2-Regular.woff2","/vendor/fonts/KaTeX_Size2-Regular.woff","/vendor/fonts/KaTeX_Size2-Regular.ttf","/vendor/fonts/KaTeX_Size3-Regular.woff2","/vendor/fonts/KaTeX_Size3-Regular.woff","/vendor/fonts/KaTeX_Size3-Regular.ttf","/vendor/fonts/KaTeX_Size4-Regular.woff2","/vendor/fonts/KaTeX_Size4-Regular.woff","/vendor/fonts/KaTeX_Size4-Regular.ttf","/vendor/fonts/KaTeX_Typewriter-Regular.woff2","/vendor/fonts/KaTeX_Typewriter-Regular.woff","/vendor/fonts/KaTeX_Typewriter-Regular.ttf","/assets/ethan-human.png","/assets/ethan-wolf.png","/icons/app-icon.png","/library/app.js","/library/assets/doctor-office-clean.png","/library/assets/hero-cats.png","/library/assets/memory-covers-cats.png","/library/assets/memory-covers.png","/library/assets/mobile-study-clean.png","/library/assets/study-cats-v2.png","/library/assets/study-cats.png","/library/assets/study-clean.png","/library/auth-client.js","/library/cloud-view.css","/library/content-format.js","/library/gate.css","/library/gate.html","/library/gate.js","/library/index.html","/library/phone-refinements.css","/library/runtime-config.js","/library/styles.css","/library/transport.js","/phone-update.js"]; } catch { return []; }
    })();
    const injectedVersion = 'phone-r8';
    const releaseVersionValue = injectedVersion.includes('PHONE_RELEASE') ? 'phone-dev' : injectedVersion;
    const releaseVersion = String(releaseVersionValue || 'phone-dev').replace(/[^a-zA-Z0-9._-]/g, '_');
    const scopeUrl = new URL('./', scope.location.href);
    const scopePath = scopeUrl.pathname;
    const cachePrefix = `xingyue-phone-cache-${encodeURIComponent(scopePath)}-`;
    const cacheName = `${cachePrefix}${releaseVersion}`;
    const managedPaths = new Set();
    const STATIC_EXTENSION = /\.(?:html?|js|jsx|css|png|woff2?|ttf|otf)$/i;
    const SAFE_QUERY = /^\?(?:v|version)=[a-zA-Z0-9._~-]+$/i;
    const SENSITIVE_SEGMENT = /^(?:api|token|password|secret)$/i;

    function relativePath(url) {
        if (url.origin !== scopeUrl.origin || !url.pathname.startsWith(scopePath)) return null;
        const relative = url.pathname.slice(scopePath.length);
        return relative || './';
    }

    function addManagedPath(rawPath) {
        if (typeof rawPath !== 'string' || !rawPath.trim()) return;
        const text = rawPath.trim();
        let url;
        try {
            // The builder emits paths with a leading slash relative to the /next/ scope.
            url = new URL(text.startsWith('/') ? `./${text.slice(1)}` : text, scopeUrl.href);
        } catch { return; }
        const relative = relativePath(url);
        if (relative === null || url.hash) return;
        managedPaths.add(relative);
        managedPaths.add(`./${relative === './' ? '' : relative}`);
    }

    if (Array.isArray(injectedPaths)) injectedPaths.forEach(addManagedPath);

    function isReleaseManifest(url) {
        const relative = relativePath(url);
        return relative === 'release-manifest.json' || relative === './release-manifest.json';
    }

    function isSensitivePath(relative) {
        return relative.split('/').some(segment => SENSITIVE_SEGMENT.test(segment) || /(?:token|password|secret)/i.test(segment));
    }

    function isManagedStatic(url) {
        if (isReleaseManifest(url)) return false;
        const relative = relativePath(url);
        if (relative === null || isSensitivePath(relative)) return false;
        if (url.search && !SAFE_QUERY.test(url.search)) return false;
        if (!managedPaths.has(relative) && !managedPaths.has(relative.replace(/^\.\//, ''))) return false;
        return relative === './' || relative === '' || relative.endsWith('/index.html') || relative === 'index.html'
            || relative.endsWith('/manifest.json') || relative === 'manifest.json'
            || STATIC_EXTENSION.test(relative);
    }

    async function networkFirst(request) {
        const cache = await caches.open(cacheName);
        try {
            const response = await fetch(request);
            if (response.ok) await cache.put(request, response.clone());
            return response;
        } catch {
            const cached = await cache.match(request);
            if (cached) return cached;
            throw new Error('phone-static-network-unavailable');
        }
    }

    scope.addEventListener('install', event => {
        event.waitUntil(Promise.resolve(scope.skipWaiting()));
    });

    scope.addEventListener('activate', event => {
        event.waitUntil(
            caches.keys()
                .then(keys => Promise.all(keys
                    .filter(key => key.startsWith(cachePrefix) && key !== cacheName)
                    .map(key => caches.delete(key))))
                .then(() => scope.clients.claim()),
        );
    });

    scope.addEventListener('fetch', event => {
        const request = event.request;
        if (request.method !== 'GET') return;
        const url = new URL(request.url);
        if (isReleaseManifest(url)) {
            event.respondWith(fetch(request));
            return;
        }
        if (!isManagedStatic(url)) return;
        event.respondWith(networkFirst(request));
    });
})(self);
