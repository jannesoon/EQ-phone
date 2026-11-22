(function watchPhoneBoot(global) {
    'use strict';
    const doc = global.document;
    if (!doc) return;
    let finished = false;
    let failed = false;
    let observer;
    const timeout = global.setTimeout(() => showHelp(), 20000);

    function rootReady() {
        return Boolean(doc.getElementById('root')?.children.length);
    }

    function finish() {
        if (!rootReady()) return false;
        finished = true;
        global.clearTimeout(timeout);
        observer?.disconnect();
        doc.getElementById('phone-boot-help')?.remove();
        return true;
    }

    function showHelp() {
        if (finished || finish()) return;
        const loader = doc.getElementById('boot-loader');
        if (!loader || doc.getElementById('phone-boot-help')) return;
        const panel = doc.createElement('div');
        panel.id = 'phone-boot-help';
        panel.setAttribute('role', 'status');
        panel.style.cssText = 'max-width:320px;padding:20px;text-align:center;font:14px/1.8 -apple-system,sans-serif;color:#352d30;';
        const text = doc.createElement('p');
        text.textContent = failed
            ? '页面启动资源未能加载。请确认网络可用后重试。'
            : '页面加载比平时慢。可以继续等待，或重新加载试试。';
        const retry = doc.createElement('button');
        retry.type = 'button';
        retry.textContent = '重新加载';
        retry.style.cssText = 'margin-top:14px;padding:12px 22px;border:0;border-radius:14px;color:white;background:#65538e;font:inherit;cursor:pointer;';
        retry.addEventListener('click', () => global.location.reload());
        panel.appendChild(text);
        panel.appendChild(retry);
        loader.appendChild(panel);
    }

    global.addEventListener('error', event => {
        if (finished) return;
        // Only page code/style failures affect startup. No error text or URLs are displayed/sent.
        const target = event.target;
        if (target?.tagName === 'SCRIPT' || target?.tagName === 'LINK' || target === global) {
            failed = true;
            showHelp();
        }
    }, true);
    function watchRoot() {
        if (finish()) return;
        const root = doc.getElementById('root');
        if (root && global.MutationObserver) {
            observer = new global.MutationObserver(finish);
            observer.observe(root, {childList:true});
        }
        if (failed) showHelp();
    }
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', watchRoot, {once:true});
    else watchRoot();
})(window);
