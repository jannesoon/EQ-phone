(function initXingyueReleaseRuntime(global) {
  'use strict';
  const baseURI = global.document?.baseURI || global.location?.href || './';
  const libraryUrl = new URL('./library/index.html', baseURI).href;
  const libraryProbeUrl = "https://jeeapoehmvwpsujsfhao.supabase.co/functions/v1/yunshufang-web-api/api/auth/status";
  global.XINGYUE_MOBILE_RUNTIME = Object.freeze({
    connected: true,
    manualHandoff: true,
    libraryUrl,
    libraryProbeUrl,
    agentBase: "https://desktop-8i3jek4.taild484c1.ts.net",
    hostConnectionAvailable: false
  });
  global.XINGYUE_MOBILE_DESIGN_PREVIEW = false;
})(window);
