(function initXingyuePhoneUpdate(global) {
    'use strict';

    const navigatorRef = global.navigator || {};
    const serviceWorker = navigatorRef.serviceWorker;
    const locationRef = global.location || {};
    let registrationPromise = null;

    function isElectron() {
        const userAgent = String(navigatorRef.userAgent || '');
        return /Electron/i.test(userAgent)
            || global.xingyueDesktop?.isDesktop === true
            || global.process?.versions?.electron;
    }

    function canRegister() {
        return locationRef.protocol === 'https:'
            && !isElectron()
            && serviceWorker
            && typeof serviceWorker.register === 'function';
    }

    function registerPhoneWorker() {
        if (!canRegister()) return Promise.resolve(null);
        if (!registrationPromise) {
            registrationPromise = serviceWorker.register('./phone-sw.js', { scope: './' }).catch(() => null);
        }
        return registrationPromise;
    }

    function manifestUrl() {
        const base = global.document?.baseURI || locationRef.href || './';
        return new URL('./release-manifest.json', base).href;
    }

    function currentVersion() {
        const value = global.XINGYUE_MOBILE_RUNTIME?.releaseVersion;
        return typeof value === 'string' ? value : '';
    }

    async function check() {
        const response = await global.fetch(manifestUrl(), {
            cache: 'no-store',
            credentials: 'omit',
            redirect: 'error',
        });
        if (!response.ok) throw new Error('无法读取手机版本清单，请稍后重试。');
        let manifest;
        try {
            manifest = await response.json();
        } catch {
            throw new Error('手机版本清单格式无效，请稍后重试。');
        }
        const latestVersion = typeof manifest?.parameters?.releaseVersion === 'string'
            ? manifest.parameters.releaseVersion
            : typeof manifest?.releaseVersion === 'string' ? manifest.releaseVersion : '';
        if (!latestVersion) throw new Error('手机版本清单缺少版本号，请稍后重试。');
        const current = currentVersion();
        return {
            currentVersion: current,
            latestVersion,
            hasUpdate: Boolean(current && current !== latestVersion),
        };
    }

    function waitForControllerChange() {
        if (!serviceWorker || typeof serviceWorker.addEventListener !== 'function') return Promise.resolve();
        return new Promise(resolve => {
            let finished = false;
            const finish = () => {
                if (finished) return;
                finished = true;
                serviceWorker.removeEventListener?.('controllerchange', finish);
                clearTimeout(timeout);
                resolve();
            };
            const timeout = setTimeout(finish, 10000);
            serviceWorker.addEventListener('controllerchange', finish, { once: true });
        });
    }

    function waitForInstall(worker) {
        if (!worker || worker.state === 'installed' || worker.state === 'activated') return Promise.resolve(true);
        if (worker.state === 'redundant' || typeof worker.addEventListener !== 'function') return Promise.resolve(false);
        return new Promise(resolve => {
            let finished = false;
            const finish = result => {
                if (finished) return;
                finished = true;
                worker.removeEventListener?.('statechange', onStateChange);
                clearTimeout(timeout);
                resolve(result);
            };
            const onStateChange = () => {
                if (worker.state === 'installed' || worker.state === 'activated') finish(true);
                else if (worker.state === 'redundant') finish(false);
            };
            const timeout = setTimeout(() => finish(false), 10000);
            worker.addEventListener('statechange', onStateChange);
        });
    }

    async function apply() {
        const registration = await registerPhoneWorker();
        if (!registration) throw new Error('当前环境暂不支持手机更新。');
        await registration.update();
        let worker = registration.waiting;
        if (!worker && registration.installing) {
            worker = registration.installing;
            const installed = await waitForInstall(worker);
            if (!installed || worker.state === 'redundant') throw new Error('手机更新未能安装，请稍后重试。');
            worker = registration.waiting || worker;
        }
        if (worker) {
            const controllerChange = waitForControllerChange();
            if (typeof worker.postMessage === 'function') worker.postMessage({ type: 'SKIP_WAITING' });
            await controllerChange;
        }
        if (typeof locationRef.reload !== 'function') throw new Error('当前页面暂不支持重新载入。');
        locationRef.reload();
        return true;
    }

    registerPhoneWorker();
    global.XingyuePhoneUpdate = Object.freeze({ check, apply });
})(window);
