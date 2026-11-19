import { isApiConfigured, login, requestJson } from './transport.js?v=phone-r4';

const gateIcons = {
  lock: '<rect x="5" y="10" width="14" height="12" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 15v3"/>',
  book: '<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1ZM12 5v15"/>',
  layers: '<path d="m12 2 10 6-10 6L2 8ZM2 12l10 6 10-6M2 16l10 6 10-6"/>',
  file: '<path d="M5 2h10l4 4v16H5zM8 11h8M8 15h8"/>',
  people: '<circle cx="9" cy="7" r="4"/><path d="M2 22v-3a7 7 0 0 1 14 0v3M18 4a4 4 0 0 1 0 8M18 15a6 6 0 0 1 4 5"/>',
  shield: '<path d="m12 2 8 3v6c0 6-8 11-8 11S4 17 4 11V5Z"/><path d="m8 11 3 3 5-6"/>'
};
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">${gateIcons[el.dataset.icon] || gateIcons.book}</svg>`; });
const byId = id => document.getElementById(id);
let configured = null;
let busy = false;
function message(text) { byId('gate-message').textContent = text; }
function setUnavailable(text) {
  configured = false;
  byId('gate-fields').hidden = true;
  byId('gate-confirmation').disabled = true;
  byId('gate-confirmation').required = false;
  byId('confirm-field').hidden = true;
  byId('gate-submit').disabled = true;
  byId('gate-submit').textContent = '云端入口暂不可用';
  message(text);
}
function enter() { location.replace('./index.html'); }
async function prepare() {
  busy = true;
  configured = null;
  byId('gate-submit').disabled = true;
  byId('gate-retry').hidden = true;
  message('');
  if (!isApiConfigured()) {
    setUnavailable('云端 API 尚未配置；当前入口暂不可用，请在部署后再试。');
    busy = false;
    return;
  }
  try {
    const status = await requestJson('/api/auth/status', { signal: AbortSignal.timeout(15000) });
    if (status?.authenticated === true) { enter(); return; }
    if (status?.configured !== true) {
      setUnavailable('云端登录尚未启用；此入口不提供云端初始化。');
      return;
    }
    configured = true;
    byId('gate-heading').textContent = '欢迎回到云书房';
    byId('gate-description').textContent = '柒柒，输入密码，就能翻开我们的记忆。';
    byId('password-hint').textContent = '输入你为这间书房设置的密码。';
    byId('gate-password').autocomplete = 'current-password';
    byId('gate-confirmation').disabled = true;
    byId('gate-confirmation').required = false;
    byId('confirm-field').hidden = true;
    byId('gate-fields').hidden = false;
    byId('gate-submit').textContent = '打开云书房 →';
    byId('gate-submit').disabled = false;
  } catch (error) {
    if (error?.code === 'API_NOT_CONFIGURED') setUnavailable('云端 API 尚未配置；当前入口暂不可用，请在部署后再试。');
    else {
      configured = null;
      message(error?.name === 'TimeoutError' || error instanceof TypeError ? '连接暂时中断，请重新连接后再试。' : (error?.message || '书房暂时没有连接上，点击下面重新连接。'));
      byId('gate-retry').hidden = false;
    }
  } finally { busy = false; }
}
byId('gate-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (busy || configured !== true) return;
  const password = byId('gate-password').value;
  busy = true;
  byId('gate-submit').disabled = true;
  message('正在打开书房…');
  try {
    await login({ password, remember: byId('gate-remember').checked });
    byId('gate-form').reset();
    enter();
  } catch (error) {
    message(error?.name === 'TimeoutError' || error instanceof TypeError ? '连接暂时中断，请重新连接后再试。' : (error?.message || '密码验证失败，请稍后再试。'));
    byId('gate-retry').hidden = false;
    byId('gate-password').value = '';
    byId('gate-password').focus();
  } finally { busy = false; byId('gate-submit').disabled = false; }
});
byId('show-password').addEventListener('click', () => {
  const show = byId('gate-password').type === 'password';
  for (const id of ['gate-password', 'gate-confirmation']) byId(id).type = show ? 'text' : 'password';
  byId('show-password').textContent = show ? '隐藏' : '显示';
  byId('show-password').setAttribute('aria-label', show ? '隐藏密码' : '显示密码');
  byId('show-password').setAttribute('aria-pressed', String(show));
});
byId('gate-retry').addEventListener('click', prepare);
void prepare();
