import { renderReadableContent } from './content-format.js?v=phone-r7';
import { request as apiRequest } from './transport.js?v=phone-r7';

const $ = id => document.getElementById(id);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const paths = {
  book:'<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Z"/><path d="M12 5v15M5 1v14M19 1v14"/>',
  home:'<path d="m2 11 10-9 10 9M5 9v12h5v-7h4v7h5V9"/>',
  layers:'<path d="m12 2 10 6-10 6L2 8l10-6ZM2 12l10 6 10-6M2 16l10 6 10-6"/>',
  file:'<path d="M5 2h10l4 4v16H5zM14 2v5h5M8 11h8M8 15h8M8 18h5"/>',
  people:'<circle cx="9" cy="7" r="4"/><path d="M2 22v-3a7 7 0 0 1 14 0v3ZM17 3a4 4 0 0 1 0 8M18 14a6 6 0 0 1 4 5v3"/>',
  shield:'<path d="m12 2 8 3v6c0 6-8 11-8 11S4 17 4 11V5l8-3Z"/><path d="m8 11 3 3 5-6"/>',
  user:'<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3Z"/>',
  lock:'<rect x="5" y="10" width="14" height="12" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 15v3"/>',
  eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff:'<path d="m2 2 20 20M9 5c1-.3 2-.4 3-.4 7 0 10 7.4 10 7.4a17 17 0 0 1-3.3 4M6 6a19 19 0 0 0-4 6s3 7 10 7c2 0 3.7-.6 5-1.4M10 10a3 3 0 0 0 4 4"/>',
  arrow:'<path d="M3 12h18m-7-7 7 7-7 7"/>',
  left:'<path d="m15 5-7 7 7 7"/>',
  right:'<path d="m9 5 7 7-7 7"/>',
  chevron:'<path d="m5 9 7 7 7-7"/>',
  planet:'<circle cx="12" cy="12" r="7"/><ellipse cx="12" cy="12" rx="12" ry="4" transform="rotate(-28 12 12)"/>',
  message:'<path d="M3 3h18v14H10l-6 5v-5H3z"/><path d="M7 9h.1M12 9h.1M17 9h.1"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 5 9 8 9-8"/>',
  briefcase:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V3h8v4M2 12c5 4 15 4 20 0M12 12v4"/>',
  edit:'<path d="M14 3H3v18h18V10M9 14l1-4L19 1l4 4-9 9-5 1M17 3l4 4"/>',
  image:'<rect x="2" y="3" width="20" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><path d="m2 17 6-5 4 4 4-7 6 8"/>',
  calendar:'<rect x="3" y="5" width="18" height="17" rx="2"/><path d="M7 2v6M17 2v6M3 10h18M7 14h1M12 14h1M17 14h1M7 18h1M12 18h1"/>',
  search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 7 7"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  settings:'<path d="m9 2 1 3h4l1-3 3 2-1 3 2 3 3-1v4l-3 1-2 3 1 3-3 2-1-3h-4l-1 3-3-2 1-3-2-3-3-1V9l3 1 2-3-1-3z"/><circle cx="12" cy="12" r="3"/>',
  check:'<rect x="4" y="3" width="16" height="19" rx="2"/><path d="m8 12 3 3 6-7"/>',
  folder:'<path d="M2 6V3h7l3 3h10v15H2z"/>',
  feather:'<path d="M5 20 18 5M5 20l-2 3M5 20c-8-12 5-19 14-18 2 10-1 19-14 18ZM10 15h6M12 11h7"/>',
  clipboard:'<rect x="4" y="4" width="16" height="18" rx="2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="m8 13 3 3 5-7"/>',
  music:'<path d="M9 18V5l12-3v13M9 9l12-3"/><ellipse cx="5" cy="19" rx="4" ry="3"/><ellipse cx="17" cy="16" rx="4" ry="3"/>',
  heart:'<path d="M20 4a5.5 5.5 0 0 0-8 1 5.5 5.5 0 0 0-8-1c-7 6 8 17 8 17S27 10 20 4Z"/>',
  star:'<path d="m12 2 3 7 7 .7-5.5 5 1.5 7-6-3.7L6 22l1.5-7-5.5-5L9 9z"/>',
  logout:'<path d="M10 3H3v18h7M9 12h13m-5-5 5 5-5 5"/>',
  plus:'<path d="M12 3v18M3 12h18"/>',
  bell:'<path d="M5 9a7 7 0 0 1 14 0v6l2 3H3l2-3V9M9 21h6"/>',
  menu:'<path d="M3 5h18M3 12h18M3 19h18"/>',
  close:'<path d="m5 5 14 14M5 19 19 5"/>',
  download:'<path d="M12 2v14m-5-5 5 5 5-5M3 16v6h18v-6"/>',
  refresh:'<path d="M21 3v6h-6M3 21v-6h6M4 8a9 9 0 0 1 16-2M20 16a9 9 0 0 1-16 2"/>'
};
const icon = name => `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">${paths[name] || paths.file}</svg>`;
function hydrateIcons(root = document) { root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); }); }
const TYPES = {
  diary:{label:'日记',name:'日记手札',icon:'book',desc:'记录每日心情',cover:'diary'},
  worklog:{label:'工作日志',name:'工作日志',icon:'briefcase',desc:'沉淀成长轨迹',cover:'worklog'},
  memos:{label:'备忘录',name:'备忘录',icon:'file',desc:'随手记录灵感',cover:'memos'},
  board:{label:'留言板',name:'留言板',icon:'mail',desc:'写下此刻的想法',cover:'diary'},
  letters:{label:'书信',name:'书信往来',icon:'mail',desc:'收藏温暖的来信',cover:'letters'},
  pp:{label:'PP 档案',name:'PP 档案',icon:'file',cover:'diary'},
  covenant:{label:'誓约 / 公约',name:'誓约 / 公约',icon:'feather',cover:'letters'},
  contract:{label:'协议',name:'协议',icon:'check',cover:'letters'},
  docs:{label:'文档',name:'文档',icon:'folder',cover:'worklog'},
  tasks:{label:'任务',name:'任务',icon:'clipboard',cover:'worklog'},
  photos:{label:'相册',name:'相册附件',icon:'image',cover:'memos'},
  songs:{label:'歌曲',name:'歌曲',icon:'music',cover:'diary'},
  prayer:{label:'祷告与心愿',name:'祷告与心愿',icon:'heart',desc:'安静记录牵挂与心愿',cover:'letters'},
  'about-qiqi':{label:'关于柒柒',name:'关于柒柒',icon:'heart',cover:'memos'},
  medical:{label:'病案室',name:'辰医生病案室',icon:'lock',desc:'健康记录四分区',cover:'worklog'}
};
const PRAYER_AUTHORS = ['柒柒', '逸辰'];
const PRAYER_GUIDE_STEPS = [
  ['安静', '先让呼吸慢下来，给自己留一点没有催促的时间。'],
  ['感谢', '记下此刻仍然值得珍惜的人、事或一小束光。'],
  ['牵挂与请求', '写下正在牵挂的事和想要表达的请求，可以具体，也可以只写一句。'],
  ['交托', '把暂时无法控制的部分放下片刻，承认它需要时间和陪伴。'],
  ['祝福', '用一句温柔的话结束，愿自己和在意的人都被好好照顾。'],
];
const PRAYER_TEMPLATE = PRAYER_GUIDE_STEPS.map(step => step[0] + '\n' + step[1]).join('\n\n');
const MEDICAL_SECTIONS = {
  baseline: { label: '健康总档案', shortLabel: '总档案', description: '长期健康基线与重要背景' },
  report: { label: '检查报告', shortLabel: '检查报告', description: '检查结果与报告说明' },
  consultation: { label: '诊疗手记', shortLabel: '诊疗手记', description: '诊疗过程、建议与观察' },
  followup: { label: '健康管理与随访', shortLabel: '健康管理', description: '日常管理、复查与随访' },
};
const MEDICAL_SECTION_ORDER = Object.keys(MEDICAL_SECTIONS);
const HEALTH_CALENDAR_SOURCE = 'xingyue-health-calendar';
const HEALTH_CALENDAR_EXTRACTED_FIELDS = ['symptoms', 'medication', 'timing'];
function medicalSectionKey(value) {
  const key = String(value ?? '').trim().toLowerCase();
  return Object.hasOwn(MEDICAL_SECTIONS, key) ? key : 'uncategorized';
}
function medicalSectionInfo(value) {
  const key = medicalSectionKey(value);
  return MEDICAL_SECTIONS[key] || { label: '待归类', shortLabel: '待归类', description: '尚未填写病案分区' };
}
function isMedicalRecord(record) { return typeKey(record?.type) === 'medical'; }
function normalizeHealthCalendarExcerptList(value) {
  return Array.isArray(value) ? value.filter(item => typeof item === 'string' && item.length > 0) : [];
}
function normalizeHealthCalendar(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.source !== HEALTH_CALENDAR_SOURCE) return null;
  const extracted = value.extracted && typeof value.extracted === 'object' && !Array.isArray(value.extracted) ? value.extracted : {};
  return {
    source: HEALTH_CALENDAR_SOURCE,
    date: /^\d{4}-\d{2}-\d{2}$/.test(String(value.date || '')) ? String(value.date) : '',
    originalText: String(value.originalText ?? value.original_text ?? ''),
    sourceHash: String(value.sourceHash ?? value.source_hash ?? ''),
    withdrawn: value.withdrawn === true,
    extracted: Object.fromEntries(HEALTH_CALENDAR_EXTRACTED_FIELDS.map(field => [field, normalizeHealthCalendarExcerptList(extracted[field])])),
    reviewNote: String(value.reviewNote ?? value.review_note ?? ''),
    syncedAt: String(value.syncedAt ?? value.synced_at ?? ''),
  };
}
function isHealthCalendarRecord(record) {
  return isMedicalRecord(record) && record?.healthCalendar?.source === HEALTH_CALENDAR_SOURCE;
}
function healthCalendarDate(record) {
  return record?.healthCalendar?.date || medicalRecordDate(record);
}
function healthCalendarSearchText(record) {
  const healthCalendar = record?.healthCalendar;
  if (!healthCalendar) return '';
  return [
    healthCalendar.source,
    healthCalendar.date,
    healthCalendar.originalText,
    healthCalendar.reviewNote,
    ...HEALTH_CALENDAR_EXTRACTED_FIELDS.flatMap(field => healthCalendar.extracted?.[field] || []),
  ].join(' ');
}
function medicalRecords(rows = records) { return rows.filter(isMedicalRecord); }
function isPrayerRecord(record) { return typeKey(record?.type) === 'prayer'; }
function prayerRecords(rows = records) { return rows.filter(isPrayerRecord); }
function prayerDateValue(record) {
  const value = record?.prayerDate || record?.date || record?.createdAt || record?.updatedAt;
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) ? String(value) : datePartsInShanghai(value || new Date());
}
function normalizePrayerUpdate(value, index = 0) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const id = String(value.id ?? value.updateId ?? value.update_id ?? ('prayer-update-' + index));
  const content = String(value.content ?? '');
  if (!content.trim()) return null;
  const createdAt = value.createdAt ?? value.created_at ?? value.updatedAt ?? value.updated_at ?? '';
  const author = value.author ?? value.prayerAuthor ?? value.prayer_author ?? '';
  return { id, content, createdAt: createdAt == null ? '' : String(createdAt), author: author == null ? '' : String(author) };
}
function medicalRecordDate(record) {
  const value = record?.recordDate || record?.date || record?.createdAt || record?.updatedAt;
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) ? String(value) : datePartsInShanghai(value || new Date());
}
function todayForEditor() { return modeIsCloud() ? datePartsInShanghai() : '2026-10-20'; }
const CLOUD_READ_HEADER = '1';
const CLOUD_WRITE_HEADER = '1';

const CLOUD_BACKUP_WRITE_HEADER = '1';
const BACKUP_POLL_INTERVAL = 4000;
const BACKUP_POLL_LIMIT = 15;
const CLOUD_TITLE_MAX = 300;
const CLOUD_CONTENT_MAX = 1000000;
const HEALTH_REVIEW_NOTE_MAX = 10000;
const PROTECTED_CLOUD_TYPES = new Set(['pp', 'contract', 'covenant']);
const UNKNOWN_TYPE_ICON = 'folder';
const UNKNOWN_TYPE_COVER = 'worklog';
function typeInfo(type) {
  const key = String(type ?? '').trim();
  if (Object.hasOwn(TYPES, key)) return TYPES[key];
  const label = key ? `书架 · ${key}` : '未分类书架';
  return { label, name: label, icon: UNKNOWN_TYPE_ICON, desc: '云书房目录', cover: UNKNOWN_TYPE_COVER, unknown: true };
}
function typeKey(type) { return String(type ?? '').trim(); }
function allRecordTypes() {
  const known = Object.keys(TYPES);
  const present = [...new Set(records.map(r => typeKey(r.type)).filter(Boolean))];
  return [...known.filter(type => present.includes(type)), ...present.filter(type => !known.includes(type))];
}
function modeIsCloud() { return currentMode === 'cloud'; }
function modeIsDemo() { return currentMode === 'demo'; }
function cloudIsManaged() { return modeIsCloud() && cloudCapabilities.manage === true && cloudReadOnly !== true; }
function cloudIsReadOnly() { return modeIsCloud() && !cloudIsManaged(); }
function modeLabel() {
  if (cloudIsManaged()) return '真实云书房 · 可管理';
  if (cloudIsReadOnly()) return '真实云书房 · 只读';
  if (modeIsDemo()) return '本地演示书房';
  return '模式待选择';
}
function recordNoun() { return modeIsCloud() ? '云端记录' : '示例记录'; }
function countLabel(type) { return `${count(type)} 条${modeIsCloud() ? '云端记录' : '示例'}`; }
const NAV = [
  ['home','home','首页'],['stream','layers','记忆流'],['board','message','留言板'],['letters','mail','书信往来'],
  ['archive','briefcase','长期档案'],['about-qiqi','heart','关于柒柒'],['attachments','image','相册附件'],['trash','archive','回收站'],['calendar','calendar','日历'],
  ['timeline','clock','时间轴'],['prayer','heart','祷告与心愿'],['medical','lock','辰医生病案室'],['settings','settings','设置']
];
const seed = [
  {id:'demo-moon',type:'diary',title:'今晚的月色很温柔',date:'2026-10-20',content:'窗外的月光很圆，在忙碌的日子里，依然有这样安静的时刻，真好。\n\n关掉白天的喧闹，给自己留一盏小灯。翻开日记，不需要写下什么惊天动地的事，记住今天闻到的茶香、窗边的光，还有这份慢下来的心情。\n\n愿每一个普通的夜晚，都有值得收藏的温柔。',favorite:false},
  {id:'demo-work',type:'worklog',title:'云书房前端设计记录',date:'2026-10-18',content:'完成了书房界面的第二版设计。暖灯、深蓝的夜色和木书架，构成一个适合慢慢阅读的空间。\n\n今天的演示可以按分类浏览、搜索文字、打开卡片，以及试着写下新的记录。\n\n此条为演示内容，不代表真实项目日志。',favorite:false},
  {id:'demo-cat',type:'memos',title:'周末准备事项',date:'2026-10-16',content:'整理相册，回复邮件，给窗边的植物浇水。\n\n留一点时间读书，也留一点时间什么都不做。猫已经在台灯旁睡着了，周末就从这里开始吧。',favorite:true},
  {id:'demo-letter',type:'letters',title:'来自未来的留言',date:'2026-10-14',content:'今天也要好好吃饭呀。\n\n愿我们一直这样温柔地生活。忙的时候记得抬头看一眼天空，累的时候把脚步放慢。\n\n把现在的小小愿望放进信封，留给未来的某一天拆开。希望那时的你，会笑着说：原来这些日子，也曾如此闪亮。',favorite:false},
  {id:'demo-photo',type:'photos',title:'整理相册素材',date:'2026-10-12',content:'把月夜、书房和日常灵感放在同一个相册里。\n\n这张卡片用于演示相册入口和文字阅读，当前没有上传或连接真实附件。',favorite:false},
  {id:'demo-board',type:'board',title:'给下一次打开书房的你',date:'2026-10-10',content:'这里的灯一直亮着。\n\n书架上的日记、信件和灵感，都可以有各自的位置。你可以先挑一篇喜欢的读，也可以在右上角点“写一笔”，留下这一刻。',favorite:false},
  {id:'demo-pp',type:'pp',title:'身份档案 · 展示示例',date:'2026-10-08',content:'这里将用于阅读有明确版本和出处的身份档案。\n\n演示版只展示布局，不载入、不改写正式的人设或长期记忆。',favorite:false},
  {id:'demo-covenant',type:'covenant',title:'共同约定 · 展示示例',date:'2026-10-07',content:'把重要的约定放在容易找到的位置。\n\n正式接入后，历史版本、来源与修改记录都需要妥善保留。本条只是演示样本。',favorite:false},
  {id:'demo-contract',type:'contract',title:'珍藏每一份认真',date:'2026-10-06',content:'约定是一种认真，也是一段生活的注脚。\n\n这里只展示协议卡片的阅读排版，不包含真实契约。',favorite:false},
  {id:'demo-doc',type:'docs',title:'书房使用小笺',date:'2026-10-05',content:'用上方搜索寻找文字；点击书架筛选类别；点击卡片展开阅读。\n\n右上角“写一笔”可新增演示记录。记录保存在当前浏览器。你也可以在设置里导出演示 JSON，或者恢复最初的示例。\n\n当前没有云端连接，也没有真实身份验证。',favorite:false},
  {id:'demo-task',type:'tasks',title:'留出一个阅读的下午',date:'2026-10-04',content:'选一本一直想读的书，准备一杯温热的茶。\n\n不赶进度，只留出一个没有打扰的下午。',favorite:false},
  {id:'demo-song',type:'songs',title:'给安静夜晚的歌单',date:'2026-10-03',content:'适合阅读的轻音乐、窗外的风声、台灯下翻书的声音。\n\n这里展示歌曲收藏的文字卡片。演示版未连接音频文件，因此不提供播放。',favorite:false}
];
const STORAGE_KEY = 'yunshufang.visual.v2.records';
let storageAvailable = true;
function loadRecords() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!Array.isArray(stored)) return structuredClone(seed);
    const ids = new Set();
    if (!stored.every(r => r && typeof r.id === 'string' && !ids.has(r.id) && ids.add(r.id) && Object.hasOwn(TYPES,r.type) && typeof r.title === 'string' && typeof r.content === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.date))) return structuredClone(seed);
    return stored.map(r => ({ id:r.id, type:r.type, title:r.title.slice(0,100), content:r.content.slice(0,20000), date:r.date, favorite:r.favorite === true }));
  } catch { storageAvailable = false; return structuredClone(seed); }
}
let demoRecords = loadRecords();
let cloudRecords = [];
let trashedRecords = [];
let records = demoRecords;
let currentMode = 'landing';
let cloudStatus = 'idle';
let cloudError = '';
let cloudLoadedAt = '';
let cloudTotal = 0;
let cloudTrashTotal = 0;
let healthSync = null;
let cloudCapabilities = { manage: false };
let cloudReadOnly = true;
let cloudBackup = null;
let backupStatus = 'idle';
let backupError = '';
let backupAbortController = null;
let backupPollTimer = null;
let backupPollCount = 0;
let backupRequestGeneration = 0;
let cloudRequestGeneration = 0;
let cloudAbortController = null;
let historyAbortController = null;
const cloudWriteControllers = new Set();
let purgingId = null;
let view = 'home', typeFilter = '', dateFilter = '', favoritesOnly = false;
let medicalSection = 'baseline';
let medicalFollowupFilter = 'all';
let medicalRoomOpen = false;
let calendarYear = 2026, calendarMonth = 9;
let toastTimeout, lastDialogFocus, lastNavFocus;
let editorSession = null;
let historySession = null;
function toast(message) {
  $('toast').textContent = message;
  $('toast').hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { $('toast').hidden = true; }, 4300);
}
function persist() {
  if (!modeIsDemo()) return false;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); return true; }
  catch { storageAvailable = false; toast('当前浏览器不能保存，改动仅保留到本次页面关闭。'); return false; }
}
function updateDemoReference() {
  if (modeIsDemo()) demoRecords = records;
}
function recordSortValue(record) {
  const precise = modeIsCloud() ? (isHealthCalendarRecord(record) ? healthCalendarDate(record) : record.createdAt || record.updatedAt) : record.date;
  const parsed = precise ? Date.parse(precise) : Number.NaN;
  return Number.isNaN(parsed) ? String(precise || record.date || '') : parsed;
}
const sortRecords = (rows = records) => [...rows].sort((a,b) => {
  const av = recordSortValue(a), bv = recordSortValue(b);
  if (typeof av === 'number' && typeof bv === 'number' && av !== bv) return bv - av;
  return String(bv).localeCompare(String(av)) || String(a.id).localeCompare(String(b.id));
});
const sorted = () => sortRecords(records);
const visibleRecords = () => view === 'trash' && modeIsCloud() ? trashedRecords : records;
const count = type => records.filter(r => r.type === type).length;
const trashCount = type => trashedRecords.filter(r => r.type === type).length;
const coverClass = type => `cover cover-${typeInfo(type).cover}`;
const dateDots = date => date.replaceAll('-','.');
function excerpt(r, length = 50) { return r.content.replace(/\s+/g,' ').slice(0,length); }
function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('zh-CN', { timeZone:'Asia/Shanghai', dateStyle:'medium', timeStyle:'short' }).format(date);
}
function datePartsInShanghai(value = new Date()) {
  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return datePartsInShanghai(new Date());
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone:'Asia/Shanghai', year:'numeric', month:'2-digit', day:'2-digit' }).formatToParts(dateValue);
  const result = Object.fromEntries(parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  return `${result.year}-${result.month}-${result.day}`;
}
function setCalendarFromDate(date) {
  const value = /^\d{4}-\d{2}-\d{2}$/.test(String(date || '')) ? String(date) : datePartsInShanghai();
  calendarYear = Number(value.slice(0,4));
  calendarMonth = Number(value.slice(5,7)) - 1;
}
function latestRecordDate(rows) {
  const date = [...rows].sort((a,b) => {
    const av = Date.parse(a.createdAt || a.updatedAt || a.date || ''), bv = Date.parse(b.createdAt || b.updatedAt || b.date || '');
    return (Number.isNaN(bv) ? 0 : bv) - (Number.isNaN(av) ? 0 : av);
  })[0]?.date;
  return date || datePartsInShanghai();
}
function normalizeAttachment(value, index = 0) {
  if (typeof value === 'string') {
    return { name: value.split(/[\\/]/).pop() || `附件 ${index + 1}`, type: '', size: '', path: value };
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const name = value.originalName ?? value.original_name ?? value.originalFilename ?? value.original_filename ?? value.fileName ?? value.filename ?? value.name ?? value.label ?? `附件 ${index + 1}`;
  const type = value.mimeType ?? value.mime_type ?? value.contentType ?? value.content_type ?? value.fileType ?? value.file_type ?? value.type ?? '';
  const size = value.size ?? value.fileSize ?? value.file_size ?? '';
  const path = value.originalPath ?? value.original_path ?? value.objectPath ?? value.object_path ?? value.storagePath ?? value.storage_path ?? value.path ?? '';
  return {
    name: String(name || `附件 ${index + 1}`),
    type: String(type || ''),
    size: size === '' || size === null || size === undefined ? '' : String(size),
    path: String(path || ''),
  };
}
function attachmentSize(value) {
  const size = Number(value);
  if (!Number.isFinite(size) || size < 0) return String(value || '');
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(size < 10 * 1024 ? 1 : 0)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(size < 10 * 1024 * 1024 ? 1 : 0)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
function friendlyCloudError(error) {
  if (error?.name === 'AbortError') return '';
  if (error?.code === 'CLOUD_TIMEOUT') return '读取云书房超时，请检查本机连接后重试。';
  return error?.message || '读取云书房失败，请重试。';
}
function normalizeCloudRecord(row, index) {
  const id = String(row?.id ?? `cloud-${index}`);
  const metadata = row?.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata) ? row.metadata : {};
  const medicalMetadata = metadata.medical && typeof metadata.medical === 'object' && !Array.isArray(metadata.medical) ? metadata.medical : {};
  const type = typeKey(row?.type ?? row?.shelf_type) || 'uncategorized';
  const title = String(row?.title ?? '未命名记录');
  const content = String(row?.content ?? '');
  const author = row?.author == null ? '' : String(row.author);
  const source = row?.source == null ? '' : String(row.source);
  const createdAt = row?.createdAt == null ? '' : String(row.createdAt);
  const updatedAt = row?.updatedAt == null ? '' : String(row.updatedAt);
  const prayerDateValueRaw = row?.prayerDate ?? row?.prayer_date ?? metadata.prayerDate ?? metadata.prayer_date;
  const prayerDate = /^\d{4}-\d{2}-\d{2}$/.test(String(prayerDateValueRaw || '')) ? String(prayerDateValueRaw) : (type === 'prayer' && /^\d{4}-\d{2}-\d{2}$/.test(String(row?.date || '')) ? String(row.date) : '');
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(row?.date || '')) ? String(row.date) : prayerDate || datePartsInShanghai(createdAt || updatedAt || new Date());
  const recordDateValue = row?.recordDate ?? row?.record_date ?? medicalMetadata.recordDate ?? medicalMetadata.record_date ?? metadata.recordDate ?? metadata.record_date;
  const recordDate = /^\d{4}-\d{2}-\d{2}$/.test(String(recordDateValue || '')) ? String(recordDateValue) : (type === 'medical' ? date : '');
  const sectionValue = row?.medicalSection ?? row?.medical_section ?? medicalMetadata.medicalSection ?? medicalMetadata.medical_section ?? metadata.medicalSection ?? metadata.medical_section;
  const medicalSectionValue = sectionValue == null ? '' : String(sectionValue);
  const sourcePlatformValue = row?.sourcePlatform ?? row?.source_platform ?? medicalMetadata.sourcePlatform ?? medicalMetadata.source_platform ?? metadata.sourcePlatform ?? metadata.source_platform;
  const lastModifiedSourceValue = row?.lastModifiedSource ?? row?.last_modified_source ?? medicalMetadata.lastModifiedSource ?? medicalMetadata.last_modified_source ?? metadata.lastModifiedSource ?? metadata.last_modified_source;
  const attachmentsValue = row?.attachments ?? medicalMetadata.attachments ?? metadata.attachments;
  const attachments = Array.isArray(attachmentsValue) ? attachmentsValue.map((attachment, attachmentIndex) => normalizeAttachment(attachment, attachmentIndex)).filter(Boolean) : [];
  const prayerAuthorValue = row?.prayerAuthor ?? row?.prayer_author ?? metadata.prayerAuthor ?? metadata.prayer_author;
  const prayerOriginalContentValue = row?.prayerOriginalContent ?? row?.prayer_original_content ?? metadata.prayerOriginalContent ?? metadata.prayer_original_content;
  const prayerUpdatesValue = row?.prayerUpdates ?? row?.prayer_updates ?? metadata.prayerUpdates ?? metadata.prayer_updates;
  const prayerUpdates = Array.isArray(prayerUpdatesValue) ? prayerUpdatesValue.map(normalizePrayerUpdate).filter(Boolean) : [];
  const deletedAt = row?.deletedAt == null ? '' : String(row.deletedAt);
  const versionCount = Number.isFinite(Number(row?.versionCount)) ? Number(row.versionCount) : 0;
  const healthCalendarValue = row?.healthCalendar ?? row?.health_calendar ?? medicalMetadata.healthCalendar ?? medicalMetadata.health_calendar ?? metadata.healthCalendar ?? metadata.health_calendar;
  const healthCalendar = normalizeHealthCalendar(healthCalendarValue);
  const normalized = { id, type, title, content, author, createdAt, updatedAt, date, source, recordDate, medicalSection: medicalSectionValue, attachments, sourcePlatform: sourcePlatformValue == null ? '' : String(sourcePlatformValue), lastModifiedSource: lastModifiedSourceValue == null ? '' : String(lastModifiedSourceValue), dbRole: row?.dbRole == null ? '' : String(row.dbRole), actorUid: row?.actorUid == null ? '' : String(row.actorUid), identityVerified: row?.identityVerified === true, deletedAt, versionCount, prayerDate, prayerAuthor: prayerAuthorValue == null ? (type === 'prayer' ? author : '') : String(prayerAuthorValue), prayerOriginalContent: prayerOriginalContentValue == null ? '' : String(prayerOriginalContentValue), prayerUpdates };
  if (healthCalendar) {
    normalized.healthCalendar = healthCalendar;
    normalized.date = healthCalendar.date || normalized.date;
  }
  return normalized;
}
function normalizeHealthSyncStatus(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const count = key => Number.isFinite(Number(value[key])) ? Number(value[key]) : 0;
  return { enabled: value.enabled === true, failed: count('failed'), conflicts: count('conflicts') };
}
function normalizeBackupStatus(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const count = key => {
    const parsed = Number(value.counts?.[key]);
    return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
  };
  const timestamp = key => value[key] == null ? '' : String(value[key]);
  const error = value.lastError == null || value.lastError === '' ? null : String(value.lastError);
  return {
    enabled: value.enabled === true,
    running: value.running === true,
    lastSuccessAt: timestamp('lastSuccessAt'),
    lastAttemptAt: timestamp('lastAttemptAt'),
    lastError: error,
    lastKind: value.lastKind == null ? '' : String(value.lastKind),
    counts: { entries: count('entries'), history: count('history'), attachments: count('attachments') },
    verifiedAt: timestamp('verifiedAt'),
  };
}
function parseCloudPayload(payload) {
  const legacyReadOnly = payload?.readOnly === true;
  const managed = payload?.readOnly === false && payload?.capabilities?.manage === true;
  if (!payload || typeof payload !== 'object' || payload.mode !== 'cloud' || (!legacyReadOnly && !managed) || !Array.isArray(payload.records)) {
    throw new Error('云书房返回的数据格式不完整，请稍后重试。');
  }
  return {
    loadedAt: payload.loadedAt == null ? '' : String(payload.loadedAt),
    total: Number.isFinite(Number(payload.total)) ? Number(payload.total) : payload.records.length,
    trashTotal: Number.isFinite(Number(payload.trashTotal)) ? Number(payload.trashTotal) : Array.isArray(payload.trashedRecords) ? payload.trashedRecords.length : 0,
    readOnly: legacyReadOnly,
    capabilities: managed ? { manage: true } : { manage: false },
    records: payload.records.map(normalizeCloudRecord),
    trashedRecords: Array.isArray(payload.trashedRecords) ? payload.trashedRecords.map(normalizeCloudRecord) : [],
    healthSync: normalizeHealthSyncStatus(payload.healthSync),
    backup: Object.hasOwn(payload, 'backup') ? normalizeBackupStatus(payload.backup) : undefined,
  };
}
function stopBackupPolling() {
  if (backupPollTimer !== null) {
    clearTimeout(backupPollTimer);
    backupPollTimer = null;
  }
}
function invalidateBackupRequest() {
  backupRequestGeneration += 1;
  backupAbortController?.abort();
  backupAbortController = null;
  stopBackupPolling();
}
function backupKindLabel(kind) {
  const value = String(kind || '').toLowerCase();
  if (value.includes('full') || value.includes('complete') || value.includes('完整')) return '完整';
  if (value.includes('increment') || value.includes('delta') || value.includes('增量')) return '增量';
  return kind ? String(kind) : '尚未记录';
}
function backupTimeLabel(value, fallback = '尚未记录') {
  return value ? formatDateTime(value) : fallback;
}
function backupSummary() {
  return cloudBackup || {
    enabled: false,
    running: false,
    lastSuccessAt: '',
    lastAttemptAt: '',
    lastError: null,
    lastKind: '',
    counts: { entries: 0, history: 0, attachments: 0 },
    verifiedAt: '',
  };
}
function backupStateLabel(status) {
  if (status.running) return '正在备份';
  if (!status.enabled) return '自动备份已暂停';
  if (status.lastError) return '上次备份失败';
  if (status.lastSuccessAt) return '备份已完成';
  if (status.enabled) return '等待首次备份';
  return '备份服务未运行';
}
function backupStatusMarkup() {
  const status = backupSummary();
  const busy = backupStatus === 'loading';
  const state = backupStatus === 'loading' ? '正在读取状态' : backupStateLabel(status);
  const stateClass = status.running ? 'is-running' : status.lastError ? 'is-error' : status.lastSuccessAt ? 'is-ready' : 'is-idle';
  const counts = status.counts || { entries: 0, history: 0, attachments: 0 };
  const lastSuccess = status.lastSuccessAt ? `最近成功：${escapeHTML(backupTimeLabel(status.lastSuccessAt))}` : '尚未完成成功备份';
  const verified = status.verifiedAt ? `已校验：${escapeHTML(backupTimeLabel(status.verifiedAt))}` : '尚未完成校验';
  const note = backupStatus === 'error'
    ? '状态读取失败，请稍后刷新。'
    : status.running
      ? '备份完成后会自动更新状态。'
      : status.lastError
        ? '上次备份未完成，原有成功快照仍保留。'
        : '服务与电脑运行时执行；离线后下次启动自动补跑。';
  return `<section class="backup-card" aria-labelledby="backup-card-title"><div class="backup-card-header"><div><p class="eyebrow">CLOUD BACKUP</p><h2 id="backup-card-title">云书房备份</h2><p class="backup-cadence">每周增量 · 每月完整检查</p></div><span class="backup-state ${stateClass}" role="status">${escapeHTML(state)}</span></div><p class="backup-description">云书房服务和电脑运行时执行；服务或电脑关闭时暂停，下次启动后自动补跑。</p><dl class="backup-counts"><div><dt>记录</dt><dd>${counts.entries}</dd></div><div><dt>历史</dt><dd>${counts.history}</dd></div><div><dt>附件</dt><dd>${counts.attachments}</dd></div></dl><div class="backup-details"><span>${lastSuccess}</span><span>最近类型：${escapeHTML(backupKindLabel(status.lastKind))}</span><span>${verified}</span></div>${status.lastError ? '<p class="backup-failure" role="alert">上次备份失败，请刷新状态后重试。</p>' : ''}<div class="backup-actions"><button class="gold-button" data-action="run-backup"${busy || status.running || !status.enabled ? ' disabled' : ''}>${icon('refresh')}立即备份（电脑端）</button><button class="secondary-button" data-action="refresh-backup"${busy ? ' disabled' : ''}>${icon('refresh')}${busy ? '正在刷新…' : '刷新状态'}</button></div><p class="backup-note">${note}</p></section>`;
}
function scheduleBackupPoll() {
  stopBackupPolling();
  if (view !== 'settings' || !modeIsCloud() || !cloudBackup?.running || backupPollCount >= BACKUP_POLL_LIMIT) return;
  backupPollCount += 1;
  backupPollTimer = setTimeout(() => {
    backupPollTimer = null;
    if (view === 'settings' && modeIsCloud()) void loadBackupStatus({ poll: true });
  }, BACKUP_POLL_INTERVAL);
}
async function loadBackupStatus({ poll = false } = {}) {
  if (!modeIsCloud() || view !== 'settings') return;
  if (backupStatus === 'loading' && !poll) return;
  const generation = ++backupRequestGeneration;
  backupAbortController?.abort();
  stopBackupPolling();
  const controller = new AbortController();
  backupAbortController = controller;
  backupStatus = 'loading';
  backupError = '';
  if (view === 'settings') renderContent();
  try {
    const response = await apiRequest('/api/backup/status', {
      method: 'GET',
      headers: { 'X-Yunshufang-Read': CLOUD_READ_HEADER },
      signal: controller.signal,
    });
    if (response.status === 401) {
      document.dispatchEvent(new Event('yunshufang-lock'));
      return;
    }
    let payload = null;
    try { payload = await response.json(); } catch { payload = null; }
    if (!response.ok) throw new Error(payload?.error || `备份状态读取失败（${response.status}）`);
    const loaded = normalizeBackupStatus(payload?.status && typeof payload.status === 'object' ? payload.status : payload);
    if (!loaded) throw new Error('备份状态格式不完整。');
    if (generation !== backupRequestGeneration || controller.signal.aborted) return;
    cloudBackup = loaded;
    backupStatus = 'ready';
    backupError = '';
    if (view === 'settings') renderContent();
    scheduleBackupPoll();
  } catch (error) {
    if (generation !== backupRequestGeneration || controller.signal.aborted) return;
    backupStatus = 'error';
    backupError = error?.message || '备份状态读取失败，请稍后刷新。';
    if (view === 'settings') renderContent();
  } finally {
    if (generation === backupRequestGeneration && backupAbortController === controller) backupAbortController = null;
  }
}
async function runBackup() {
  if (!modeIsCloud() || view !== 'settings' || backupStatus === 'loading' || cloudBackup?.running) return;
  const generation = ++backupRequestGeneration;
  backupAbortController?.abort();
  stopBackupPolling();
  const controller = new AbortController();
  backupAbortController = controller;
  backupStatus = 'loading';
  backupError = '';
  renderContent();
  try {
    const response = await apiRequest('/api/backup/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Yunshufang-Write': CLOUD_BACKUP_WRITE_HEADER },
      body: JSON.stringify({}),
      signal: controller.signal,
    });
    if (response.status === 401) {
      document.dispatchEvent(new Event('yunshufang-lock'));
      return;
    }
    let payload = null;
    try { payload = await response.json(); } catch { payload = null; }
    if (!response.ok) throw new Error(payload?.error || `备份启动失败（${response.status}）`);
    if (generation !== backupRequestGeneration || controller.signal.aborted) return;
    const loaded = normalizeBackupStatus(payload?.status && typeof payload.status === 'object' ? payload.status : payload?.backup);
    if (loaded) cloudBackup = loaded;
    else {
      const current = backupSummary();
      cloudBackup = { ...current, enabled: true, running: payload?.status === 'running' || payload?.ok === true };
    }
    backupStatus = 'ready';
    backupError = '';
    renderContent();
    if (cloudBackup?.running) {
      backupPollCount = 0;
      scheduleBackupPoll();
    }
    toast('已开始备份，完成后会更新状态。');
  } catch (error) {
    if (generation !== backupRequestGeneration || controller.signal.aborted) return;
    backupStatus = 'error';
    backupError = error?.message || '备份启动失败，请稍后重试。';
    renderContent();
    toast('备份未能开始，请稍后重试。');
  } finally {
    if (generation === backupRequestGeneration && backupAbortController === controller) backupAbortController = null;
  }
}
function invalidateCloudRequest() {
  cloudRequestGeneration += 1;
  if (cloudAbortController) cloudAbortController.abort();
  cloudAbortController = null;
  if (historyAbortController) historyAbortController.abort();
  historyAbortController = null;
  for (const controller of cloudWriteControllers) controller.abort();
  cloudWriteControllers.clear();
  invalidateBackupRequest();
  editorSession = null;
  historySession = null;
}
function switchToDemo({ announce = true } = {}) {
  if (!closeDialog()) return false;
  invalidateCloudRequest();
  cloudRecords = [];
  trashedRecords = [];
  cloudLoadedAt = '';
  cloudTotal = 0;
  cloudTrashTotal = 0;
  healthSync = null;
  cloudCapabilities = { manage: false };
  cloudReadOnly = true;
  cloudBackup = null;
  backupStatus = 'idle';
  backupError = '';
  backupPollCount = 0;
  cloudError = '';
  cloudStatus = 'idle';
  currentMode = 'demo';
  records = demoRecords;
  favoritesOnly = false;
  typeFilter = '';
  dateFilter = '';
  view = 'home';
  medicalSection = 'baseline';
  medicalFollowupFilter = 'all';
  medicalRoomOpen = false;
  setCalendarFromDate('2026-10-20');
  $('search').value = '';
  render();
  if (announce) toast('已切换到本机演示。云端内容已从页面内存清除。');
  return true;
}
function clearCloudRecords() {
  cloudRecords = [];
  trashedRecords = [];
  if (modeIsCloud()) records = [];
  cloudLoadedAt = '';
  cloudTotal = 0;
  cloudTrashTotal = 0;
  healthSync = null;
  cloudCapabilities = { manage: false };
  cloudReadOnly = true;
  cloudBackup = null;
  backupStatus = 'idle';
  backupError = '';
  backupPollCount = 0;
}
async function loadCloud({ open = false } = {}) {
  if (cloudStatus === 'loading') return;
  const generation = ++cloudRequestGeneration;
  cloudAbortController?.abort();
  const controller = new AbortController();
  cloudAbortController = controller;
  cloudStatus = 'loading';
  cloudError = '';
  if (open) {
    currentMode = 'landing';
    $('login-view').hidden = false;
    $('library-view').hidden = true;
    document.querySelector('.skip-link').href = '#login-title';
  }
  renderModeChrome();
  renderLoginStatus();
  renderCloudStatus();
  try {
    const response = await apiRequest('/api/library', {
      method: 'GET',
      headers: { 'X-Yunshufang-Read': CLOUD_READ_HEADER },
      signal: controller.signal
    });
    if (response.status === 401) {
      document.dispatchEvent(new Event('yunshufang-lock'));
      return;
    }
    let payload = null;
    try { payload = await response.json(); } catch { payload = null; }
    if (!response.ok) throw new Error(payload?.error || `云书房读取失败（${response.status}）`);
    const loaded = parseCloudPayload(payload);
    if (generation !== cloudRequestGeneration || controller.signal.aborted) return;
    cloudRecords = loaded.records;
    trashedRecords = loaded.trashedRecords;
    records = cloudRecords;
    currentMode = 'cloud';
    cloudLoadedAt = loaded.loadedAt;
    cloudTotal = loaded.total;
    cloudTrashTotal = loaded.trashTotal;
    healthSync = loaded.healthSync;
    cloudCapabilities = loaded.capabilities;
    cloudReadOnly = loaded.readOnly;
    if (loaded.backup !== undefined) cloudBackup = loaded.backup;
    backupStatus = cloudBackup ? 'ready' : 'idle';
    backupError = '';
    backupPollCount = 0;
    cloudError = '';
    cloudStatus = 'ready';
    if (open) {
      favoritesOnly = false;
      typeFilter = '';
      dateFilter = '';
      medicalSection = 'baseline';
      medicalFollowupFilter = 'all';
      medicalRoomOpen = false;
      view = 'home';
      $('search').value = '';
      setCalendarFromDate(latestRecordDate(cloudRecords));
    }
    $('login-view').hidden = true;
    $('library-view').hidden = false;
    document.querySelector('.skip-link').href = '#main-content';
    render();
    $('main-content').focus({ preventScroll:true });
    toast(`已读取 ${cloudRecords.length} 条云端记录，当前为${cloudIsManaged() ? '可管理' : '只读'}模式。`);
  } catch (error) {
    if (generation !== cloudRequestGeneration || controller.signal.aborted) return;
    cloudStatus = 'error';
    cloudError = friendlyCloudError(error);
    if (open) {
      currentMode = 'landing';
      clearCloudRecords();
      $('login-view').hidden = false;
      $('library-view').hidden = true;
    }
    renderModeChrome();
    renderLoginStatus();
    renderCloudStatus();
    if (!open && modeIsCloud()) render();
  } finally {
    if (generation === cloudRequestGeneration && cloudAbortController === controller) cloudAbortController = null;
  }
}
function navMarkup(mobile = false) {
  // Keep the mobile dock focused on the six places used most often in the
  // phone reference: home, memories, board, letters and profile/settings.
  const entries = mobile ? [['home','home','首页'],['stream','layers','记忆'],['board','message','留言'],['letters','mail','书信'],['trash','archive','回收站'],['settings','user','我的']] : NAV;
  return entries.map(([id,i,label]) => `<button class="${mobile?'':'nav-item '}${view===id?'active':''}" data-view="${id}" ${view===id?'aria-current="page"':''}>${icon(i)}<span>${label}</span></button>`).join('');
}
function memoryCard(r) {
  const t = typeInfo(r.type);
  const medical = isMedicalRecord(r);
  const healthCalendar = isHealthCalendarRecord(r);
  const cardLabel = healthCalendar ? '日常身体记录' : medical ? medicalSectionInfo(r.medicalSection).label : t.label;
  const cardDate = healthCalendar ? healthCalendarDate(r) : medical ? medicalRecordDate(r) : r.date;
  const favorite = modeIsDemo() ? `<button class="memory-favorite ${r.favorite?'is-favorite':''}" data-favorite="${escapeHTML(r.id)}" aria-label="${r.favorite?'取消收藏':'收藏'}：${escapeHTML(r.title)}" aria-pressed="${r.favorite}">${icon('star')}</button>` : '';
  const calendarMeta = healthCalendar ? `<small class="medical-card-meta health-calendar-card-meta">自记录 · 来源：星月舱日历 · 日期：${escapeHTML(dateDots(cardDate))}${r.healthCalendar.withdrawn?' · 源日历已移除此日记录，保留历史':''}</small>` : '';
  const medicalMeta = medical && !healthCalendar ? `<small class="medical-card-meta">${escapeHTML(r.sourcePlatform || r.source || '来源未注明')}</small>` : '';
  return `<article class="memory-card ${medical?'medical-memory-card':''} ${healthCalendar?'health-calendar-card':''}"><button class="memory-open" data-open="${escapeHTML(r.id)}" aria-label="阅读：${escapeHTML(r.title)}"><div class="memory-image ${coverClass(r.type)}"><span class="category-badge ${escapeHTML(healthCalendar?'health-calendar':typeKey(r.type))}">${escapeHTML(cardLabel)}</span></div><div class="memory-text"><h3>${escapeHTML(r.title)}</h3><p>${escapeHTML(excerpt(r))}</p><time class="memory-date" datetime="${escapeHTML(r.createdAt || cardDate)}">${escapeHTML(dateDots(cardDate))}</time>${calendarMeta}${medicalMeta}</div></button>${favorite}</article>`;
}
const sectionHeading = (i,title,caption,action='') => `<div class="section-heading"><h2>${icon(i)}${title}</h2>${caption?`<p class="section-caption">${caption}</p>`:''}${action}</div>`;
function phoneCoreMarkup() {
  return `<section class="mobile-core panel">${sectionHeading('layers','核心入口','')}<div class="phone-core-grid">${[['stream','file','记忆流','日常碎片与心情'],['board','message','留言板','想对你说的话'],['letters','mail','书信往来','我们的信件'],['archive','folder','长期档案','重要资料与约定'],['attachments','image','相册附件','照片、歌曲与文件'],['prayer','heart','祷告与心愿','安静放下牵挂']].map(([v,i,t,d])=>`<button data-view="${v}"><span class="phone-core-icon">${icon(i)}</span><span><strong>${t}</strong><small>${d}</small></span>${icon('right')}</button>`).join('')}</div></section>`;
}
function prayerCard(r) {
  const date = prayerDateValue(r);
  const author = r.prayerAuthor || r.author || '未署名';
  const updates = r.prayerUpdates?.length ? ` · ${r.prayerUpdates.length} 条近况` : '';
  return `<article class="prayer-card memory-card"><button class="memory-open" data-open="${escapeHTML(r.id)}" aria-label="阅读：${escapeHTML(r.title)}"><div class="memory-image cover cover-letters"><span class="category-badge prayer">祷告与心愿</span></div><div class="memory-text"><h3>${escapeHTML(r.title)}</h3><p>${escapeHTML(excerpt(r))}</p><time class="memory-date" datetime="${escapeHTML(date)}">${escapeHTML(dateDots(date))}</time><small class="prayer-card-meta">署名：${escapeHTML(author)}${updates}</small></div></button></article>`;
}
function prayerGuideMarkup() {
  const steps = PRAYER_GUIDE_STEPS.map(([title, description], index) => `<li><span class="prayer-step-number">${index + 1}</span><span><strong>${escapeHTML(title)}</strong><small>${escapeHTML(description)}</small></span></li>`).join('');
  return `<section class="prayer-guide" aria-labelledby="prayer-guide-title"><div class="prayer-lamp" aria-hidden="true"><span class="prayer-lamp-flame"></span><span class="prayer-lamp-glow"></span><span class="prayer-lamp-base"></span></div><div class="prayer-guide-copy"><p class="eyebrow">A QUIET PLACE TO PRAY</p><h2 id="prayer-guide-title">给心留一盏小灯</h2><p>祷告与心愿可以从一句话开始。以下五步只是温柔的引导，不是考试；也可以自由书写、跳过任何一步。</p></div><ol class="prayer-guide-steps">${steps}</ol></section>`;
}
function prayerEmptyMarkup(hasQuery) {
  if (hasQuery) return `<div class="empty-state prayer-empty">${icon('search')}<h3>没有找到匹配的祷告</h3><p>搜索只会查看祷告与心愿。可以换个词，或清除搜索继续翻阅。</p><button class="secondary-button" data-action="clear-filters">清除搜索</button></div>`;
  const label = modeIsCloud() && !cloudIsManaged() ? '当前为只读连接' : '写下第一篇';
  return `<div class="empty-state prayer-empty">${icon('heart')}<h3>这里还没有祷告与心愿</h3><p>可以从一句感谢、牵挂或祝福开始，留下这一天真实的心声。</p><button class="gold-button" data-action="prayer-new">${icon('plus')}${label}</button></div>`;
}
function prayerMarkup() {
  const query = $('search').value.trim();
  const rows = filteredRecords();
  const list = `<div class="memory-grid">${rows.map(prayerCard).join('')}</div>`;
  const actionLabel = modeIsCloud() && !cloudIsManaged() ? '只读连接' : '写下一篇';
  return `<section class="prayer-room" aria-labelledby="prayer-room-title"><div class="prayer-room-header"><button class="prayer-back" data-view="home" aria-label="返回云书房">${icon('left')}<span>返回书房</span></button><div><p class="eyebrow">PRAYER &amp; WISHES</p><h1 id="prayer-room-title">祷告与心愿</h1><p class="prayer-room-subtitle">把牵挂轻轻放在这里，让每一次回望都有自己的位置。</p></div><button class="gold-button prayer-new-button" data-action="prayer-new">${icon('plus')}${actionLabel}</button></div>${prayerGuideMarkup()}<div class="prayer-list-heading"><div><h2>${query ? '搜索结果' : '祷告记录'}</h2><p>${query ? `只在祷告与心愿中搜索“${escapeHTML(query)}”` : '每一篇都可以继续记录近况。'}</p></div><span>${rows.length} 篇</span></div><div class="prayer-list">${rows.length ? list : prayerEmptyMarkup(Boolean(query))}</div></section>`;
}
function archiveMarkup() {
  const types = modeIsCloud() ? allRecordTypes() : ['pp','covenant','contract','docs','tasks','about-qiqi','photos','songs'];
  return `<section class="panel archive-section large-panel">${sectionHeading('folder',modeIsCloud()?'云书房目录':'档案分类',modeIsCloud()?'所有已读取书架均可进入，分类来自云端字段':'')}<div class="archive-grid">${types.map(type=>{const t=typeInfo(type);return `<button class="archive-button" data-type="${escapeHTML(type)}"><span>${icon(t.icon)}</span><span><strong>${escapeHTML(t.name)}</strong><small>${escapeHTML(countLabel(type))}</small></span><span>${icon('right')}</span></button>`;}).join('') || '<p class="view-description">当前没有记录。</p>'}</div></section>`;
}
function shelfDirectoryMarkup() {
  const types = allRecordTypes();
  return `<section class="panel home-section core-entry-section">${sectionHeading('layers',modeIsCloud()?'云端书架目录':'核心入口',modeIsCloud()?'按实际书架字段浏览，不会隐藏未知分类':'进入不同的记忆空间，整理生活的一部分')}<div class="shelf-grid">${types.map(type => { const t = typeInfo(type); return `<button class="shelf-card" data-type="${escapeHTML(type)}"><span class="shelf-image ${coverClass(type)}"></span><span class="shelf-details"><span>${icon(t.icon)}</span><span class="shelf-label"><strong>${escapeHTML(t.name)}</strong><small>${escapeHTML(modeIsCloud() ? `${count(type)} 条云端记录 · ${cloudIsManaged()?'可管理':'只读'}` : `${count(type)} 篇示例`)}</small></span><span>${icon('right')}</span></span></button>`; }).join('') || '<p class="view-description">当前没有记录。</p>'}</div></section>`;
}
function medicalSectionButton(section, { compact = false } = {}) {
  const info = medicalSectionInfo(section);
  const selected = medicalSectionKey(section) === medicalSection;
  const rows = medicalRecords().filter(record => medicalSectionKey(record.medicalSection) === medicalSectionKey(section));
  return `<button class="medical-section-button ${selected?'active':''}" data-medical-section="${escapeHTML(section)}" aria-pressed="${selected}"><span class="medical-section-icon">${icon(section === 'baseline' ? 'clipboard' : section === 'report' ? 'file' : section === 'consultation' ? 'feather' : 'calendar')}</span><span><strong>${escapeHTML(info.label)}</strong><small>${rows.length} 条记录${compact?'':` · ${escapeHTML(info.description)}`}</small></span><span class="medical-section-count">${rows.length}</span></button>`;
}
function healthSyncMarkup() {
  if (!modeIsCloud()) return '';
  const failed = Number(healthSync?.failed) || 0;
  const conflicts = Number(healthSync?.conflicts) || 0;
  const attention = failed > 0 || conflicts > 0 ? ' · 有记录待核对/同步未完成' : '';
  return `<p class="health-sync-note">云书房服务运行时自动同步；刷新查看${attention}</p>`;
}
function medicalFollowupFilterMarkup() {
  if (medicalSection !== 'followup') return '';
  return `<div class="medical-followup-filter" role="group" aria-label="随访记录范围"><span>随访记录</span><button type="button" class="filter-chip ${medicalFollowupFilter==='all'?'active':''}" data-medical-followup-filter="all" aria-pressed="${medicalFollowupFilter==='all'}">全部随访</button><button type="button" class="filter-chip ${medicalFollowupFilter==='calendar'?'active':''}" data-medical-followup-filter="calendar" aria-pressed="${medicalFollowupFilter==='calendar'}">日常身体记录</button></div>`;
}
function medicalRoomMarkup() {
  const allRows = medicalRecords();
  const currentInfo = medicalSectionInfo(medicalSection);
  const currentRows = filteredRecords();
  const selectedLabel = $('search').value.trim() ? '病案搜索结果' : medicalSection === 'all' ? '全部病案' : medicalSection === 'followup' && medicalFollowupFilter === 'calendar' ? '日常身体记录' : currentInfo.label;
  const list = `<div class="memory-grid results-grid medical-record-grid">${currentRows.map(memoryCard).join('')}</div>`;
  const uncategorized = allRows.filter(record => medicalSectionKey(record.medicalSection) === 'uncategorized').length;
  const followupNotice = medicalSection === 'followup' ? `${healthSyncMarkup()}<p class="health-calendar-source-note">日常身体记录来自星月舱日历；原文如需修改，请到日历修改原文。</p>` : '';
  return `<section class="panel large-panel medical-room" aria-labelledby="medical-room-title"><div class="medical-room-header"><button class="medical-back" data-view="home" aria-label="返回云书房">${icon('left')}<span>返回书房</span></button><p class="eyebrow">PRIVATE HEALTH ARCHIVE</p><h2 id="medical-room-title">辰医生病案室</h2><p class="medical-room-subtitle">与云书房共用当前登录，按健康记录分区整理。</p><p class="medical-trust-note">署名与来源是记录中的声明信息；匿名通道不代表已验证个人身份。</p></div><div class="medical-section-grid" role="list" aria-label="病案分区">${MEDICAL_SECTION_ORDER.map(section => medicalSectionButton(section)).join('')}${uncategorized ? medicalSectionButton('uncategorized') : `<button class="medical-section-button ${medicalSection==='uncategorized'?'active':''}" data-medical-section="uncategorized" aria-pressed="${medicalSection==='uncategorized'}"><span class="medical-section-icon">${icon('folder')}</span><span><strong>待归类</strong><small>${uncategorized} 条记录</small></span><span class="medical-section-count">${uncategorized}</span></button>`}</div><div class="medical-room-toolbar"><div><strong>${escapeHTML(selectedLabel)}</strong><span>${currentRows.length} 条记录${$('search').value.trim()?` · 搜索“${escapeHTML($('search').value.trim())}”`:''}</span></div><button class="text-button" data-action="medical-all">查看全部 ${icon('arrow')}</button></div>${followupNotice}${medicalFollowupFilterMarkup()}${currentRows.length ? list : emptyMarkup('这个分区还没有记录', medicalSection === 'uncategorized' ? '未填写或未识别分区的记录会继续保留在这里。' : `${escapeHTML(currentInfo.description)}，可以从病案室内新建一笔。`)}</section>`;
}
function prayerHomeMarkup() {
  const countText = count('prayer') ? countLabel('prayer') : '还没有记录 · 随时可以开始';
  return `<section class="panel home-section prayer-home-entry" aria-labelledby="prayer-home-title"><div class="prayer-home-ornament" aria-hidden="true"><span></span></div><div><p class="eyebrow">A QUIET PLACE</p><h2 id="prayer-home-title">祷告与心愿</h2><p>给牵挂一个安静的位置，也给自己留一盏小灯。</p><small>${escapeHTML(countText)}</small></div><button class="secondary-button" data-view="prayer">进入祷告与心愿 ${icon('arrow')}</button></section>`;
}
function homeMarkup() {
  return `<section class="panel home-section recent-memories-section">${sectionHeading('calendar','最近记忆',modeIsCloud()?'最近读取的云端记录':'最近的生活片段，记录此刻的你',`<button class="text-button" data-view="stream">查看全部 ${icon('arrow')}</button>`)}<div class="memory-grid">${sorted().slice(0,4).map(memoryCard).join('') || emptyMarkup(modeIsCloud()?'云书房目前为空':'还没有找到这段记忆',modeIsCloud()?'连接成功，但当前没有可读取的记录。':'换个关键词或清除筛选，看看其他书架吧。')}</div></section>
  ${phoneCoreMarkup()}
  ${modeIsCloud() ? shelfDirectoryMarkup() : `<section class="panel home-section core-entry-section">${sectionHeading('layers','核心入口','进入不同的记忆空间，整理生活的一部分')}<div class="shelf-grid">${['diary','worklog','memos','board','letters'].map(type => { const t = typeInfo(type); return `<button class="shelf-card" data-type="${escapeHTML(type)}"><span class="shelf-image ${coverClass(type)}"></span><span class="shelf-details"><span>${icon(t.icon)}</span><span class="shelf-label"><strong>${escapeHTML(t.name)}</strong><small>${escapeHTML(t.desc)}</small></span><span>${icon('right')}</span></span></button>`; }).join('')}</div></section>`}
  ${modeIsCloud() ? '' : `<section class="panel home-section archive-section">${sectionHeading('folder','长期档案','文件目录与正式记录分开归档')}<div class="archive-grid">${['pp','covenant','contract','docs','tasks'].map(type => { const t=typeInfo(type); return `<button class="archive-button" data-type="${escapeHTML(type)}"><span>${icon(t.icon)}</span><span><strong>${escapeHTML(t.name)}</strong><small>${escapeHTML(countLabel(type))}</small></span><span>${icon('right')}</span></button>`; }).join('')}</div></section>`}
  ${prayerHomeMarkup()}
  <div class="collection-grid home-collections"><button class="collection-button" data-view="attachments"><span>${icon('image')}</span><span><strong>附件收藏</strong><small>${modeIsCloud()?'云端附件记录以文字展示':'珍贵的照片与音频，让回忆更加生动'}</small></span><span>${icon('right')}</span></button><button class="collection-button" data-type="songs"><span>${icon('music')}</span><span><strong>歌曲</strong><small>${count('songs')} ${modeIsCloud()?'条云端记录 · 仅展示文字':'篇示例 · 音频未连接'}</small></span><span>${icon('right')}</span></button></div>
  <div class="mobile-home-medical"><button class="medical-card mobile-medical-card" data-view="medical"><span class="medical-title">${icon('lock')}<span>辰医生病案室</span><small>${modeIsCloud()?`${medicalRecords().length} 条 · 共用当前登录`:'演示入口 · 未载入真实资料'}</small></span><span class="medical-description">健康记录四分区<br>与云书房共用当前登录</span><span data-icon="arrow" class="medical-arrow">${icon('arrow')}</span></button></div>`;
}
function emptyMarkup(title='还没有找到这段记忆',description='换个关键词或清除筛选，看看其他书架吧。') {
  return `<div class="empty-state">${icon('search')}<h3>${escapeHTML(title)}</h3><p>${escapeHTML(description)}</p><button class="secondary-button" data-action="clear-filters">${modeIsCloud()?'查看全部云端记录':'查看全部示例'}</button></div>`;
}
function filteredRecords() {
  let rows = sortRecords(visibleRecords());
  if (view === 'medical') {
    rows = sortRecords(rows.filter(isMedicalRecord));
    if (medicalSection !== 'all' && !$('search').value.trim()) rows = rows.filter(r => medicalSectionKey(r.medicalSection) === medicalSection);
    if (medicalSection === 'followup' && medicalFollowupFilter === 'calendar') rows = rows.filter(isHealthCalendarRecord);
  } else if (view === 'prayer') {
    rows = sortRecords(rows.filter(isPrayerRecord));
  } else if (typeFilter) rows = rows.filter(r => r.type === typeFilter);
  else if (view === 'trash') rows = modeIsCloud() ? rows : [];
  else if (view === 'archive') rows = modeIsCloud() ? rows : rows.filter(r => ['pp','covenant','contract','docs','tasks','about-qiqi','photos','songs'].includes(r.type));
  else if (view === 'attachments') rows = rows.filter(r => ['photos','songs'].includes(r.type));
  else if (['board','letters'].includes(view)) rows = rows.filter(r => r.type === view);
  else if (view === 'about-qiqi') rows = rows.filter(r => r.type === 'about-qiqi');
  if (favoritesOnly || view === 'favorites') rows = rows.filter(r => r.favorite);
  if (dateFilter) rows = rows.filter(r => (isMedicalRecord(r) ? medicalRecordDate(r) : r.date) === dateFilter);
  const query = $('search').value.trim().toLocaleLowerCase();
  if (query) rows = rows.filter(r => `${r.title} ${r.content} ${r.prayerOriginalContent || ''} ${(r.prayerUpdates || []).map(update => update.content + ' ' + update.author).join(' ')} ${healthCalendarSearchText(r)} ${typeInfo(r.type).label} ${r.type} ${r.date} ${r.prayerDate || ''} ${r.recordDate || ''} ${r.medicalSection || ''} ${medicalSectionInfo(r.medicalSection).label} ${r.author || ''} ${r.prayerAuthor || ''} ${r.source || ''} ${r.sourcePlatform || ''} ${r.lastModifiedSource || ''} ${r.createdAt || ''} ${r.updatedAt || ''}`.toLocaleLowerCase().includes(query));
  return rows;
}
function resultsMarkup() {
  const rows = filteredRecords();
  const name = typeFilter ? typeInfo(typeFilter).name : view==='home' && $('search').value.trim() ? '搜索结果' : NAV.find(n=>n[0]===view)?.[2] || (view==='favorites'?'我的收藏':'搜索结果');
  const filters = [typeFilter?typeInfo(typeFilter).label:'',dateFilter,$('search').value.trim()?`“${$('search').value.trim()}”`:''].filter(Boolean);
  const list = view==='timeline' || view==='calendar' ? rows.map(r => `<article class="timeline-group"><time datetime="${escapeHTML(r.createdAt || r.date)}">${escapeHTML(r.date.slice(5).replace('-',' / '))}</time><button data-open="${escapeHTML(r.id)}"><h3>${escapeHTML(r.title)}</h3><p>${escapeHTML(excerpt(r,100))}</p><small>${escapeHTML(typeInfo(r.type).label)} · ${modeIsCloud()?(cloudIsManaged()?'云端可管理':'云端只读'):'演示记录'}</small></button></article>`).join('') : `<div class="memory-grid results-grid">${rows.map(memoryCard).join('')}</div>`;
  return `<section class="panel large-panel">${sectionHeading(view==='favorites'?'star':'layers',escapeHTML(name),'')}<div class="result-bar"><span>${filters.length?escapeHTML(filters.join(' · ')):modeIsCloud()?'全部云端内容':'全部演示内容'} · ${rows.length} 条</span><button class="text-button" data-action="clear-filters">清除筛选 ${icon('refresh')}</button></div>${view==='attachments'?`<div class="notice-box">${modeIsCloud()?'附件记录以云端返回的文字只读展示，当前不提供上传、下载或音频播放。':'相册与歌曲在这里展示为示例文字卡片，当前未上传或连接真实附件。'}</div>`:''}${rows.length?list:emptyMarkup()}</section>`;
}
function trashMarkup() {
  const rows = filteredRecords();
  const list = rows.map(r => memoryCard(r)).join('');
  return `<section class="panel large-panel trash-panel">${sectionHeading('archive','回收站',cloudIsManaged()?'可恢复云端记录':'真实云端回收站只读查看')}<div class="trash-warning" role="note">移入回收站满 30 天后，可打开记录逐条手动清除；不会自动清空。清除前先备份，备份、病案历史和附件原件保留。未清除前，星月舱等旧入口可能仍然显示。</div><div class="result-bar"><span>回收站 · ${rows.length} 条</span><button class="text-button" data-action="clear-filters">清除筛选 ${icon('refresh')}</button></div>${rows.length?`<div class="memory-grid results-grid">${list}</div>`:emptyMarkup('回收站是空的','当前没有被隐藏的云端记录。')}</section>`;
}
function settingsMarkup() {
  if (modeIsCloud()) {
    const loaded = cloudLoadedAt ? `最近读取：${formatDateTime(cloudLoadedAt)}` : '尚未读取';
    const managed = cloudIsManaged();
     return `<section class="panel large-panel">${sectionHeading('settings','书房设置',managed?'真实云书房可管理浏览':'真实云书房只读浏览')}<div class="notice-box cloud-notice">${managed?'当前为真实云书房可管理模式。保存、编辑和回收站操作会直接写入云端，页面不会把真实草稿写入浏览器。':'当前为真实云书房只读模式。页面只保留本次读取的记录，不写入浏览器存储，也不会修改、删除、导出或收藏云端内容。'}</div>
     ${backupStatusMarkup()}
    <div class="settings-row"><div><h3>云端记录</h3><p>共 ${records.length} 条记录，回收站 ${trashedRecords.length} 条。${escapeHTML(loaded)}</p></div><button class="secondary-button" data-action="refresh-cloud" ${cloudStatus==='loading'?'disabled':''}>${icon('refresh')}${cloudStatus==='loading'?'正在刷新…':'刷新云端'}</button></div>
    ${cloudError?`<div class="cloud-error-box" role="alert">${escapeHTML(cloudError)}<button class="secondary-button" data-action="refresh-cloud">${icon('refresh')}重试</button></div>`:''}
    <div class="settings-row"><div><h3>回收站</h3><p>${managed?`${trashedRecords.length} 条记录暂时隐藏，可逐条恢复。`:'只读查看当前连接返回的回收站记录。'}</p></div><button class="secondary-button" data-view="trash">查看回收站</button></div>
    <div class="settings-row"><div><h3>切换到演示</h3><p>清除当前页面内存中的云端记录，回到可编辑的本机示例。</p></div><button class="secondary-button" data-action="switch-demo">体验演示</button></div>
    <div class="settings-row"><div><h3>连接状态</h3><p>已连接现有云书房，当前为${managed?'可管理':'只读'}模式。</p></div><button class="secondary-button" data-action="lock-study">退出并锁定</button></div></section>`;
  }
  return `<section class="panel large-panel">${sectionHeading('settings','书房设置','本机演示模式')}<div class="notice-box">当前为本机演示。记录和收藏只保存在这台设备的演示存储中，不会连接云端。请勿填写真实密码、病历或其他私密资料。</div>
  <div class="settings-row"><div><h3>演示记录</h3><p>当前共 ${records.length} 条，保存于本机浏览器。${storageAvailable?'不上传到任何服务。':'浏览器存储不可用，改动可能不会保留。'}</p></div><button class="secondary-button" data-action="export">${icon('download')}导出演示 JSON</button></div>
  <div class="settings-row"><div><h3>我的收藏</h3><p>保留喜欢的演示卡片，方便下次打开。</p></div><button class="secondary-button" data-view="favorites">查看 ${records.filter(r=>r.favorite).length} 条收藏</button></div>
  <div class="settings-row"><div><h3>恢复初始示例</h3><p>清除本机这份演示的修改，恢复最初的示例。不涉及任何云端内容。</p></div><button class="secondary-button" data-action="reset">恢复示例</button></div>
  <div class="settings-row"><div><h3>打开真实云书房</h3><p>读取已连接的云端内容，只读查看，失败时不会用演示内容替代。</p></div><button class="secondary-button" data-action="open-cloud">打开云书房</button></div>
  <div class="settings-row"><div><h3>连接状态</h3><p>当前没有读取云端，演示数据与真实数据保持分开。</p></div><button class="secondary-button" data-action="lock-study">退出并锁定</button></div></section>`;
}
function renderLoginStatus() {
  const status = $('cloud-login-status');
  if (!status) return;
  const loading = cloudStatus === 'loading';
  const submit = $('login-form')?.querySelector('button[type="submit"]');
  if (submit) submit.disabled = loading;
  if ($('cloud-submit-label')) $('cloud-submit-label').textContent = loading ? '正在读取…' : '打开云书房';
  status.hidden = !(loading || (cloudStatus === 'error' && currentMode === 'landing'));
  status.className = `cloud-login-status ${loading?'is-loading':''} ${cloudStatus==='error'?'is-error':''}`.trim();
  if (loading) {
    status.innerHTML = '<span class="status-spinner" aria-hidden="true"></span><span>正在读取云书房，请稍候…</span>';
    return;
  }
  if (cloudStatus === 'error' && currentMode === 'landing') {
    status.innerHTML = `<span>${escapeHTML(cloudError || '读取云书房失败，请重试。')}</span><span class="status-actions"><button type="button" class="secondary-button" data-action="retry-cloud">重试</button><button type="button" class="text-button" data-action="switch-demo">体验演示</button></span>`;
  }
}
function renderCloudStatus() {
  const banner = $('cloud-status-banner');
  if (!banner) return;
  const visible = modeIsCloud() && (cloudStatus === 'loading' || cloudStatus === 'error');
  banner.hidden = !visible;
  banner.className = `cloud-status-banner ${cloudStatus==='error'?'is-error':''} ${cloudStatus==='loading'?'is-loading':''}`.trim();
  if (!visible) { banner.innerHTML = ''; return; }
  if (cloudStatus === 'loading') {
    banner.innerHTML = `<span class="status-spinner" aria-hidden="true"></span><span>正在刷新真实云端记录，当前页面内容暂时保留。</span>`;
    return;
  }
  banner.innerHTML = `<span>${escapeHTML(cloudError || '刷新云书房失败，当前内容仍保留。')}</span><span class="status-actions"><button type="button" class="secondary-button" data-action="retry-cloud">${icon('refresh')}重试</button></span>`;
}
function renderModeChrome() {
  const cloud = modeIsCloud();
  const managed = cloudIsManaged();
  const demo = modeIsDemo();
  const pill = $('mode-pill-label');
  if (pill) pill.textContent = modeLabel();
  $('library-view')?.classList.toggle('cloud-readonly', cloud);
  $('library-view')?.classList.toggle('demo-mode', demo);
  if ($('library-view')) $('library-view').dataset.mode = currentMode;
  if ($('sidebar-status')) $('sidebar-status').textContent = cloud ? `真实云书房 · ${records.length} 条${managed?'可管理':'只读'}` : demo ? '本地演示 · 可编辑' : '模式待选择';
  if ($('calendar-legend-note')) $('calendar-legend-note').textContent = cloud ? '真实日期' : demo ? '示例日期' : '当前模式日期';
  if ($('privacy-note')) $('privacy-note').innerHTML = `${icon('shield')}${cloud ? `真实云端${managed ? '可管理浏览' : '只读浏览'}` : demo ? '当前内容均为演示示例' : '当前模式内容'}`;
  if ($('library-footer-note')) $('library-footer-note').textContent = cloud ? `真实云端${managed?'可管理':'只读'} · ${cloudTotal} 条记录 · 回收站 ${cloudTrashTotal} 条` : demo ? '此刻展示的，是演示书房的模样。' : '当前模式内容';
  if ($('new-record')) $('new-record').hidden = !(demo || managed);
  if ($('refresh-cloud')) {
    $('refresh-cloud').hidden = !cloud;
    $('refresh-cloud').disabled = cloudStatus === 'loading';
    $('refresh-cloud-label').textContent = cloudStatus === 'loading' ? '正在刷新…' : '刷新云端';
  }
  if ($('notifications')) $('notifications').setAttribute('aria-label', cloud ? '查看云书房读取状态' : '查看演示书房状态');
  if ($('calendar-today')) $('calendar-today').textContent = cloud ? '今天' : '本月';
  if ($('medical-card')) {
    const medicalStatus = cloud ? `${medicalRecords().length} 条记录 · 共用当前登录` : demo ? '演示入口 · 未载入真实资料' : '共用当前登录';
    $('medical-card').innerHTML = `<span class="medical-title">${icon('lock')}辰医生病案室<small>${escapeHTML(medicalStatus)}</small></span><span class="medical-description">健康记录四分区<br>与云书房共用当前登录</span>${icon('arrow')}`;
    $('medical-card').querySelector?.('svg:last-child')?.classList?.add('medical-arrow');
  }
  renderLoginStatus();
  renderCloudStatus();
}
function renderContent() {
  const query = $('search').value.trim();
  if (view === 'prayer') {
    $('content-column').innerHTML = prayerMarkup();
    return;
  }
  $('content-column').innerHTML = view==='medical' ? (medicalRoomOpen ? medicalRoomMarkup() : `<section class="medical-entry" aria-labelledby="medical-entry-title"><button class="medical-back" data-view="home" aria-label="返回云书房">${icon('left')}<span>返回书房</span></button><div class="medical-entry-content"><div class="medical-entry-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M15 5h10v10h10v10H25v10H15V25H5V15h10Z" fill="currentColor" stroke="none"/></svg></div><p class="eyebrow">PRIVATE HEALTH ARCHIVE</p><h2 id="medical-entry-title">辰医生的<br>病案室</h2><p class="medical-entry-subtitle">专属的健康档案，只为守护你</p><span class="medical-entry-rule"></span><p class="medical-entry-note">让健康更清晰，让生活更安心</p><div class="medical-entry-actions"><button class="medical-enter" data-action="medical-enter">进入病案室 ${icon('arrow')}</button><button class="medical-return" data-view="home">回到云书房</button></div><p class="medical-entry-demo">${modeIsCloud()?'与云书房共用当前登录 · 进入后按四个健康分区浏览':'前端演示 · 不载入真实健康资料'}</p></div></section>`) : view==='trash'&&!query&&!typeFilter&&!dateFilter ? trashMarkup() : view==='archive'&&!query&&!typeFilter&&!dateFilter ? archiveMarkup() : view==='settings' ? settingsMarkup() : view==='home'&&!query&&!typeFilter&&!dateFilter ? homeMarkup() : resultsMarkup();
}
function renderFilters() {
  if (view === 'medical' && medicalRoomOpen) {
    $('quick-filters').innerHTML = `<button class="filter-chip ${medicalSection==='all'?'active':''}" data-medical-section="all" aria-pressed="${medicalSection==='all'}">全部病案</button>${MEDICAL_SECTION_ORDER.map(section => `<button class="filter-chip ${medicalSection===section?'active':''}" data-medical-section="${escapeHTML(section)}" aria-pressed="${medicalSection===section}">${escapeHTML(MEDICAL_SECTIONS[section].shortLabel)}</button>`).join('')}<button class="filter-chip ${medicalSection==='uncategorized'?'active':''}" data-medical-section="uncategorized" aria-pressed="${medicalSection==='uncategorized'}">待归类</button>`;
    return;
  }
  if (view === 'prayer') {
    $('quick-filters').innerHTML = '<span class="prayer-search-scope">搜索范围：祷告与心愿</span>';
    return;
  }
  const types = modeIsCloud() ? allRecordTypes() : ['diary','worklog','board','letters','memos'];
  $('quick-filters').innerHTML = types.map(type=>`<button class="filter-chip ${typeFilter===type?'active':''}" data-type="${escapeHTML(type)}" aria-pressed="${typeFilter===type}">${escapeHTML(typeInfo(type).label)}</button>`).join('');
}
function renderActivity() {
  const sourceRows = view === 'medical' ? medicalRecords() : view === 'prayer' ? prayerRecords() : records;
  $('activity-list').innerHTML = sortRecords(sourceRows).slice(0,5).map(r=>{const t=typeInfo(r.type);const date= isMedicalRecord(r) ? medicalRecordDate(r) : r.date;const label=isMedicalRecord(r)?medicalSectionInfo(r.medicalSection).label:t.label;return `<button class="activity-item" data-open="${escapeHTML(r.id)}"><i class="dot ${escapeHTML(typeKey(r.type))}"></i><time class="activity-date" datetime="${escapeHTML(r.createdAt || date)}">${escapeHTML(date.slice(5).replace('-','.'))}</time><span class="activity-thumb ${coverClass(r.type)}"></span><span class="activity-title"><strong>${escapeHTML(r.title)}</strong><small>${icon(t.icon)}${escapeHTML(label)}</small></span></button>`;}).join('') || `<p class="view-description">${view==='medical'?'病案室目前没有记录。':modeIsCloud()?'云书房目前没有记录。':'书架空了，试着写下第一笔。'}</p>`;
}
function renderCalendar() {
  $('calendar-title').textContent = `${calendarYear}年${calendarMonth+1}月`;
  const start = new Date(calendarYear,calendarMonth,1);
  const offset = (start.getDay()+6)%7;
  const days = new Date(calendarYear,calendarMonth+1,0).getDate();
  const total = Math.ceil((offset+days)/7)*7;
  let html='';
  for(let i=0;i<total;i++){
    const d=new Date(calendarYear,calendarMonth,i-offset+1);
    const date=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const calendarRows = view === 'medical' ? medicalRecords() : view === 'prayer' ? prayerRecords() : records;
    const dayRecords=calendarRows.filter(r=>(isMedicalRecord(r)?medicalRecordDate(r):r.date)===date);
    const cls=`calendar-day ${d.getMonth()!==calendarMonth?'outside':''} ${date===(modeIsCloud()?datePartsInShanghai():'2026-10-20')?'today':''} ${dateFilter===date?'selected':''} ${dayRecords.length?'has-record':''} ${dayRecords.some(r=>r.type==='worklog')?'has-worklog':''} ${dayRecords.some(r=>r.type==='letters')?'has-letters':''}`;
    html+=`<button class="${cls}" data-date="${date}" aria-label="${date}，${dayRecords.length} 条${modeIsCloud()?'云端':'示例'}记录" aria-pressed="${dateFilter===date}">${d.getDate()}</button>`;
  }
  $('calendar-days').innerHTML=html;
}
function render() {
  renderModeChrome();
  $('library-view').classList.toggle('medical-mode',view==='medical');
  $('library-view').classList.toggle('prayer-mode',view==='prayer');
  $('library-view').dataset.view=view;
  $('primary-nav').innerHTML=navMarkup();
  $('mobile-nav').innerHTML=navMarkup(true);
  const label=NAV.find(n=>n[0]===view)?.[2] || (view==='favorites'?'我的收藏':'记忆流');
  $('page-heading').textContent=view==='home'?'欢迎回到云书房':view==='medical'?'辰医生病案室':typeFilter?typeInfo(typeFilter).name:label;
  $('hero-description').innerHTML=view==='home'?'在这里，珍藏生活的点滴。<br>让每一份记忆与记录，都成为未来的底气。':view==='medical'?'健康记录按四个分区安放，署名与来源保留为声明信息。':'把散落的片段，安放在自己的位置。<br>每一次翻阅，都是与记忆的重逢。';
  if (view === 'prayer') $('hero-description').innerHTML = '把牵挂安静地放下。<br>每一份祷告与心愿，都可以从一句话开始。';
  renderFilters(); renderContent(); renderActivity(); renderCalendar();
}
function setView(id) {
  if(id==='menu'){ toggleNav(true); return; }
  if(!NAV.some(n=>n[0]===id)&&id!=='favorites') return;
  if(id==='favorites' && modeIsCloud()){ toast('真实云书房为只读模式，不提供收藏。'); return; }
  if(id==='trash' && !modeIsCloud()){ toast('回收站只显示真实云书房内容。'); return; }
  if (id !== 'settings') {
    stopBackupPolling();
    if (view === 'settings') invalidateBackupRequest();
  }
  view=id;typeFilter='';dateFilter='';favoritesOnly=id==='favorites';$('search').value='';
  if (id === 'medical') { medicalRoomOpen = false; medicalSection = 'baseline'; medicalFollowupFilter = 'all'; }
  toggleNav(false);render();$('main-content').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
  if (id === 'settings' && modeIsCloud()) {
    backupPollCount = 0;
    void loadBackupStatus();
  }
}
function toggleNav(open) {
  if(open) lastNavFocus=document.activeElement;
  $('sidebar').classList.toggle('open',open);
  $('nav-scrim').hidden=!open;
  $('open-nav').setAttribute('aria-expanded',String(open));
  if(window.matchMedia('(max-width:760px)').matches){
    document.body.style.overflow=open?'hidden':'';
    $('main-content').inert=open;
    $('mobile-nav').inert=open;
    if(open){$('sidebar').setAttribute('role','dialog');$('sidebar').setAttribute('aria-modal','true');$('close-nav').focus();}
    else{$('sidebar').removeAttribute('role');$('sidebar').removeAttribute('aria-modal');lastNavFocus?.focus?.();}
  }
}
function cloudRecordById(id) {
  const active = cloudRecords.find(record => record.id === id);
  if (active) return { record: active, trashed: false };
  const trashed = trashedRecords.find(record => record.id === id);
  return trashed ? { record: trashed, trashed: true } : null;
}
function isProtectedCloudType(type) { return PROTECTED_CLOUD_TYPES.has(typeKey(type)); }
function editorField(form, name) {
  if (!form) return null;
  return form.elements?.namedItem?.(name) || form.elements?.[name] || form.querySelector?.(`[name="${name}"]`);
}
function readEditorValues(form) {
  const title = editorField(form, 'title');
  const type = editorField(form, 'type');
  const date = editorField(form, 'date');
  const recordDate = editorField(form, 'recordDate');
  const section = editorField(form, 'medicalSection');
  const prayerDate = editorField(form, 'prayerDate');
  const prayerAuthor = editorField(form, 'prayerAuthor');
  const prayerUpdate = editorField(form, 'prayerUpdate');
  const healthReviewNote = editorField(form, 'healthReviewNote');
  const content = editorField(form, 'content');
  const confirmed = editorField(form, 'confirmed');
  return {
    title: String(title?.value ?? '').trim(),
    type: String(type?.value ?? '').trim(),
    date: String(date?.value ?? '').trim(),
    recordDate: String(recordDate?.value ?? '').trim(),
    medicalSection: String(section?.value ?? '').trim(),
    prayerDate: String(prayerDate?.value ?? '').trim(),
    prayerAuthor: String(prayerAuthor?.value ?? '').trim(),
    prayerUpdate: String(prayerUpdate?.value ?? ''),
    healthReviewNote: String(healthReviewNote?.value ?? ''),
    content: String(content?.value ?? ''),
    confirmed: confirmed?.checked === true
  };
}
function editorIsDirty() {
  if (!editorSession || !$('edit-form')) return false;
  const values = readEditorValues($('edit-form'));
  const initial = editorSession.initial || {};
  if (editorSession.healthCalendar === true) return values.healthReviewNote !== String(initial.healthReviewNote || '');
  return values.title !== String(initial.title || '').trim() || values.type !== (initial.type || '') || (editorSession.mode === 'demo' && values.date !== (initial.date || '')) || (editorSession.medical === true && values.recordDate !== (initial.recordDate || '')) || (editorSession.medical === true && values.medicalSection !== (initial.medicalSection || '')) || (editorSession.prayer === true && values.prayerDate !== (initial.prayerDate || '')) || (editorSession.prayer === true && values.prayerAuthor !== (initial.prayerAuthor || '')) || (editorSession.prayer === true && values.prayerUpdate !== (initial.prayerUpdate || '')) || (editorSession.healthCalendar === true && values.healthReviewNote !== (initial.healthReviewNote || '')) || values.content !== (initial.content || '') || values.confirmed !== (initial.confirmed === true);
}
function editorMessage(message) {
  const box = $('editor-error');
  if (!box) return;
  box.textContent = message;
  box.hidden = !message;
}
function setEditorBusy(busy) {
  const form = $('edit-form');
  if (!form) return;
  form.querySelectorAll?.('input, select, textarea, button').forEach(control => { control.disabled = busy; });
}
function cloudWriteErrorMessage(error) {
  if (error?.code === 'CLOUD_WRITE_TIMEOUT') return '请求超时，结果未确认；请先刷新云端核对，未自动重试。';
  if (error?.code === 'ENTRY_CONFLICT' || error?.code === 'CLOUD_CONFLICT') return '云端记录已在其他地方修改。请先刷新后核对，未自动覆盖你的草稿。';
  if (error?.status === 401) return '访问已失效，请重新验证后再试。';
  if (error?.code === 'CLOUD_WRITE_UNCONFIRMED') return '云端返回不完整，结果未确认；请先刷新核对，草稿仍保留，未自动重试。';
  const detail = error?.message ? `（${error.message}）` : '';
  return `云端操作失败，结果未确认；请先刷新云端核对，草稿仍保留${detail}`;
}
async function requestCloudWrite(path, { method = 'POST', body, timeoutMs = 15000 } = {}) {
  const generation = cloudRequestGeneration;
  const controller = new AbortController();
  cloudWriteControllers.add(controller);
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  try {
  const response = await apiRequest(path, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Yunshufang-Write': CLOUD_WRITE_HEADER },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    let payload = null;
    try { payload = await response.json(); } catch { payload = null; }
    if (!response.ok) {
      const error = new Error(payload?.error || `云端操作失败（${response.status}）`);
      error.status = response.status;
      error.code = payload?.code || 'CLOUD_WRITE_FAILED';
      throw error;
    }
    if (generation !== cloudRequestGeneration || controller.signal.aborted) {
      const stale = new Error('云端操作已取消');
      stale.stale = true;
      throw stale;
    }
    return payload;
  } catch (error) {
    if (timedOut) {
      const timeout = new Error('请求超时，结果未确认；请先刷新云端核对，未自动重试。');
      timeout.code = 'CLOUD_WRITE_TIMEOUT';
      throw timeout;
    }
    if (generation !== cloudRequestGeneration || controller.signal.aborted) {
      const stale = new Error('云端操作已取消');
      stale.stale = true;
      throw stale;
    }
    throw error;
  } finally {
    clearTimeout(timer);
    cloudWriteControllers.delete(controller);
  }
}
function applyCloudRecord(record) {
  const normalized = normalizeCloudRecord(record, 0);
  const trashed = Boolean(normalized.deletedAt);
  cloudRecords = cloudRecords.filter(item => item.id !== normalized.id);
  trashedRecords = trashedRecords.filter(item => item.id !== normalized.id);
  if (trashed) trashedRecords.push(normalized); else cloudRecords.push(normalized);
  records = cloudRecords;
  cloudTotal = cloudRecords.length;
  cloudTrashTotal = trashedRecords.length;
  return normalized;
}
function purgeEligibility(record, now = Date.now()) {
  const deleted = Date.parse(record.deletedAt || '');
  const eligibleAt = deleted + 30 * 24 * 60 * 60 * 1000;
  return { eligible: Number.isFinite(eligibleAt) && now >= eligibleAt, eligibleAt };
}
function purgeControlMarkup(record) {
  const { eligible, eligibleAt } = purgeEligibility(record);
  const note = Number.isFinite(eligibleAt) ? `${formatDateTime(new Date(eligibleAt).toISOString())} 起可手动清除` : '回收站时间无效，请刷新核对';
  return `<button class="danger-button" data-action="cloud-purge-request" data-record-id="${escapeHTML(record.id)}" ${eligible ? '' : 'disabled'} aria-describedby="purge-eligibility">永久清除（电脑端）</button><span id="purge-eligibility" class="record-managed-note">${escapeHTML(eligible ? '已满 30 天，可由你逐条确认清除。' : note)}</span>`;
}
function openPurgeConfirmation(id) {
  const found = cloudRecordById(id);
  if (purgingId || !cloudIsManaged() || !found?.trashed || !purgeEligibility(found.record).eligible) return;
  const target = $('cloud-action-confirm');
  if (!target) return;
  target.innerHTML = `<div class="confirm-box cloud-confirm-box" role="alert"><p>永久清除“${escapeHTML(found.record.title)}”？</p><p>云端条目会被移除，其他共用云书房的入口也会受影响。先完成电脑备份，再执行清除；备份、病案历史和附件原件保留。之后不能在回收站直接恢复。身体日历原文仍保留，但这条不会再自动同步回来。</p><label for="purge-confirmation-text">请亲自输入“永久删除”确认</label><input id="purge-confirmation-text" class="purge-confirmation-input" type="text" autocomplete="off" spellcheck="false" maxlength="4"><div class="dialog-actions"><button class="danger-button" data-action="cloud-purge-confirm" data-record-id="${escapeHTML(id)}">备份并永久清除（电脑端）</button><button class="secondary-button" data-action="cancel-cloud-confirm">取消</button></div><p id="cloud-action-error" class="form-error" role="alert" hidden></p></div>`;
  target.scrollIntoView?.({ block: 'nearest' });
  $('purge-confirmation-text')?.focus();
}
async function performPurge(id) {
  const found = cloudRecordById(id);
  if (purgingId || !cloudIsManaged() || !found?.trashed) return;
  const box = $('cloud-action-error');
  const confirmationText = $('purge-confirmation-text')?.value || '';
  if (confirmationText !== '永久删除') {
    if (box) { box.textContent = '请输入“永久删除”，再确认清除。'; box.hidden = false; }
    return;
  }
  purgingId = id;
  const controls = [...($('record-dialog').querySelectorAll?.('button, input') || [])];
  const wasDisabled = controls.map(control => control.disabled);
  controls.forEach(control => { control.disabled = true; });
  if (box) { box.textContent = '正在备份并校验，完成后清除这条记录，请稍候…'; box.hidden = false; }
  try {
    const payload = await requestCloudWrite(`/api/entries/${encodeURIComponent(id)}/purge`, { timeoutMs: 120000, body: { expectedUpdatedAt: found.record.updatedAt || '', confirmationTitle: found.record.title, confirmationText, confirmed: true } });
    if (!payload?.ok || payload.id !== id || payload.purged !== true) throw new Error('清除结果未确认，请刷新核对。');
    trashedRecords = trashedRecords.filter(record => record.id !== id);
    cloudRecords = cloudRecords.filter(record => record.id !== id);
    records = cloudRecords; cloudTotal = cloudRecords.length; cloudTrashTotal = trashedRecords.length;
    purgingId = null;
    closeDialog({ force: true }); render();
    toast('云端条目已清除，电脑备份和附件原件保留。');
  } catch (error) {
    if (error?.stale) return;
    if (error?.status === 401) { document.dispatchEvent(new Event('yunshufang-lock')); return; }
    if (box) { box.textContent = cloudWriteErrorMessage(error); box.hidden = false; }
    else toast(cloudWriteErrorMessage(error));
  } finally {
    purgingId = null;
    controls.forEach((control, index) => { control.disabled = wasDisabled[index]; });
  }
}
function openCloudActionConfirmation(kind, id, versionId = '') {
  if (purgingId) return;
  const found = cloudRecordById(id);
  if (!found) return;
  const targetVersion = kind === 'restore-version' && historySession?.id === id
    ? historySession.versions?.find(version => version.versionId === versionId)
    : null;
  const protectedType = isProtectedCloudType(found.record.type) || isProtectedCloudType(targetVersion?.type);
  const actionText = kind === 'trash' ? '移入回收站' : kind === 'restore' ? '恢复记录' : '恢复到这个版本';
  const target = $('cloud-action-confirm') || $('history-confirm');
  if (!target) return;
  target.innerHTML = `<div class="confirm-box cloud-confirm-box" role="alert"><p>确认${actionText}“${escapeHTML(found.record.title)}”？</p>${protectedType?'<label class="confirm-check"><input type="checkbox" data-cloud-confirm>我确认这是 PP、协议或公约正式记录的操作</label>':''}<div class="dialog-actions"><button class="danger-button" data-action="cloud-${kind}-confirm" data-record-id="${escapeHTML(id)}"${versionId?` data-version-id="${escapeHTML(versionId)}"`:''}>确认${actionText}</button><button class="secondary-button" data-action="cancel-cloud-confirm">取消</button></div><p id="cloud-action-error" class="form-error" role="alert" hidden></p></div>`;
  target.scrollIntoView?.({ block: 'nearest' });
}
async function performCloudAction(kind, id, { versionId = '', confirmed = false } = {}) {
  if (!cloudIsManaged()) { toast('当前云书房为只读模式，不能执行管理操作。'); return; }
  const found = cloudRecordById(id);
  if (!found) return;
  const targetVersion = kind === 'restore-version' && historySession?.id === id
    ? historySession.versions?.find(version => version.versionId === versionId)
    : null;
  const protectedMutation = isProtectedCloudType(found.record.type) || isProtectedCloudType(targetVersion?.type);
  if (protectedMutation && !confirmed) {
    const error = $('cloud-action-error');
    if (error) { error.textContent = '请先勾选确认框，再执行这个正式记录操作。'; error.hidden = false; }
    return;
  }
  const body = { expectedUpdatedAt: found.record.updatedAt || '' };
  if (versionId) body.versionId = versionId;
  if (protectedMutation) body.confirmed = true;
  const path = kind === 'trash' ? `/api/entries/${encodeURIComponent(id)}/trash` : kind === 'restore' ? `/api/entries/${encodeURIComponent(id)}/restore` : `/api/entries/${encodeURIComponent(id)}/restore-version`;
  try {
    const payload = await requestCloudWrite(path, { method: 'POST', body });
    if (!payload?.ok || !payload.record) {
      const error = new Error('云端返回的记录不完整。');
      error.code = 'CLOUD_WRITE_UNCONFIRMED';
      throw error;
    }
    const updated = applyCloudRecord(payload.record);
    historySession = null;
    closeDialog({ force: true });
    render();
    if (kind !== 'trash') openRecord(updated.id);
    toast(kind === 'trash' ? '记录已移入回收站。' : kind === 'restore' ? '记录已恢复。' : '已恢复到所选版本。');
  } catch (error) {
    if (error?.stale) return;
    if (error?.status === 401) { document.dispatchEvent(new Event('yunshufang-lock')); return; }
    const box = $('cloud-action-error');
    if (box) { box.textContent = cloudWriteErrorMessage(error); box.hidden = false; }
    else toast(cloudWriteErrorMessage(error));
  }
}
async function saveCloudEditor(form) {
  if (!cloudIsManaged() || !editorSession || editorSession.saving) return;
  const session = editorSession;
  const values = readEditorValues(form);
  session.draft = values;
  if (!values.title || (!session.healthCalendar && !values.content.trim())) { editorMessage('请填写标题和正文，不能只写空格。'); return; }
  if (values.title.length > CLOUD_TITLE_MAX) { editorMessage(`标题不能超过 ${CLOUD_TITLE_MAX} 个字符。`); return; }
  if (values.content.length > CLOUD_CONTENT_MAX) { editorMessage(`正文不能超过 ${CLOUD_CONTENT_MAX} 个字符。`); return; }
  if (session.healthCalendar && values.healthReviewNote.length > HEALTH_REVIEW_NOTE_MAX) { editorMessage(`核对备注不能超过 ${HEALTH_REVIEW_NOTE_MAX} 个字符。`); return; }
  const existing = session.existing;
  const attemptedMedicalMigration = existing && !isMedicalRecord(existing) && values.type === 'medical';
  if (attemptedMedicalMigration) { editorMessage('其他书架记录不能改成病案室记录，请保留原书架。'); return; }
  const attemptedPrayerMigration = existing && !isPrayerRecord(existing) && values.type === 'prayer';
  if (attemptedPrayerMigration) { editorMessage('其他书架记录不能改成祷告与心愿，请保留原书架。'); return; }
  const medicalMutation = session.medical === true || isMedicalRecord(existing) || values.type === 'medical';
  const prayerMutation = session.prayer === true || isPrayerRecord(existing) || values.type === 'prayer';
  const effectiveType = medicalMutation ? 'medical' : prayerMutation ? 'prayer' : values.type;
  const knownType = Object.hasOwn(TYPES, effectiveType);
  const existingUnknownType = existing && typeKey(existing.type) === effectiveType;
  if (!effectiveType || (!knownType && !existingUnknownType)) { editorMessage('请选择有效的书架分类。'); return; }
  let medicalSectionValue = '';
  let recordDateValue = '';
  if (medicalMutation) {
    const requestedSection = values.medicalSection || existing?.medicalSection || session.initial?.medicalSection || medicalSection;
    medicalSectionValue = MEDICAL_SECTION_ORDER.includes(requestedSection) ? requestedSection : '';
    recordDateValue = /^\d{4}-\d{2}-\d{2}$/.test(values.recordDate) ? values.recordDate : (existing?.recordDate || existing?.date || session.initial?.recordDate || todayForEditor());
    if (!/^\d{4}-\d{2}-\d{2}$/.test(recordDateValue)) { editorMessage('请填写有效的记录日期。'); return; }
  }
  let prayerDateMutation = '';
  if (prayerMutation) {
    prayerDateMutation = /^\d{4}-\d{2}-\d{2}$/.test(values.prayerDate) ? values.prayerDate : (existing?.prayerDate || session.initial?.prayerDate || todayForEditor());
    if (!/^\d{4}-\d{2}-\d{2}$/.test(prayerDateMutation)) { editorMessage('请填写有效的祷告日期。'); return; }
    if (!existing && !PRAYER_AUTHORS.includes(values.prayerAuthor)) { editorMessage('请选择有效的署名。'); return; }
    if (values.prayerUpdate.length > CLOUD_CONTENT_MAX) { editorMessage(`追加近况不能超过 ${CLOUD_CONTENT_MAX} 个字符。`); return; }
  }
  const protectedMutation = isProtectedCloudType(effectiveType) || isProtectedCloudType(existing?.type);
  if (protectedMutation && !values.confirmed) { editorMessage('保存 PP、协议或公约记录前，请先勾选确认框。'); return; }
  const id = session.id || (crypto.randomUUID ? crypto.randomUUID() : `cloud-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  session.id = id;
  form.dataset.id = id;
  const body = existing && prayerMutation ? { expectedUpdatedAt: existing.updatedAt || '', type: 'prayer', title: values.title, content: values.content, prayerDate: prayerDateMutation } : existing ? { expectedUpdatedAt: existing.updatedAt || '', type: effectiveType, title: values.title, content: values.content } : { id, type: effectiveType, title: values.title, content: values.content };
  if (medicalMutation) {
    body.medicalSection = medicalSectionValue || null;
    body.recordDate = recordDateValue;
  }
  if (prayerMutation) {
    body.prayerDate = prayerDateMutation;
    if (!existing) body.prayerAuthor = values.prayerAuthor;
    if (existing && values.prayerUpdate.trim()) body.prayerUpdate = values.prayerUpdate.trim();
  }
  if (session.healthCalendar) body.healthReviewNote = values.healthReviewNote;
  if (session.healthCalendar && existing) {
    body.type = 'medical';
    body.title = String(existing.title ?? '');
    body.content = String(existing.content ?? '');
    body.medicalSection = String(existing.medicalSection || 'followup');
    body.recordDate = String(existing.recordDate || healthCalendarDate(existing));
  }
  if (protectedMutation) body.confirmed = true;
  session.saving = true;
  editorMessage('');
  setEditorBusy(true);
  try {
    const payload = await requestCloudWrite(existing ? `/api/entries/${encodeURIComponent(id)}` : '/api/entries', { method: existing ? 'PATCH' : 'POST', body });
    if (!payload?.ok || !payload.record) {
      const error = new Error('云端返回的记录不完整。');
      error.code = 'CLOUD_WRITE_UNCONFIRMED';
      throw error;
    }
    if (editorSession !== session) return;
    const updated = applyCloudRecord(payload.record);
    editorSession = null;
    closeDialog({ force: true });
    render();
    openRecord(updated.id);
    toast(existing ? '云端记录已保存。' : '云端记录已新建。');
  } catch (error) {
    if (error?.stale) return;
    if (editorSession !== session) return;
    if (error?.status === 401) { document.dispatchEvent(new Event('yunshufang-lock')); return; }
    editorMessage(cloudWriteErrorMessage(error));
  } finally {
    if (editorSession === session) { editorSession.saving = false; setEditorBusy(false); }
  }
}
function openDialog(html) {
  const dialog=$('record-dialog');
  if(!dialog.open) lastDialogFocus=document.activeElement;
  $('dialog-content').innerHTML=html;
  dialog.setAttribute('aria-labelledby','dialog-heading');
  if(!dialog.open) dialog.showModal();
  dialog.scrollTop=0;
  dialog.querySelector('[autofocus]')?.focus();
}
function closeDialog({ force = false } = {}) {
  if (!force && purgingId) { toast('正在备份并清除，请等待结果。'); return false; }
  const abandoningSave = !force && editorSession?.saving;
  if (!force && editorSession?.saving) {
    const accepted = typeof window.confirm === 'function' && window.confirm('记录正在保存，确定放弃当前请求并关闭吗？');
    if (!accepted) return false;
  }
  if (!force && editorSession && editorIsDirty()) {
    const accepted = typeof window.confirm === 'function' ? window.confirm('还有未保存的编辑，确定放弃当前草稿吗？') : false;
    if (!accepted) return false;
  }
  if (abandoningSave) invalidateCloudRequest();
  if ($('record-dialog').open) $('record-dialog').close();
  $('dialog-content').innerHTML = '';
  editorSession = null;
  historySession = null;
  return true;
}
function medicalAttachmentMarkup(attachments = []) {
  if (!Array.isArray(attachments) || !attachments.length) return '';
  const rows = attachments.map((attachment, index) => {
    const name = escapeHTML(attachment?.name || `附件 ${index + 1}`);
    const type = attachment?.type ? `<span>类型：${escapeHTML(attachment.type)}</span>` : '';
    const size = attachment?.size ? `<span>大小：${escapeHTML(attachmentSize(attachment.size))}</span>` : '';
    const path = attachment?.path ? `<code>${escapeHTML(attachment.path)}</code><button type="button" class="text-button attachment-copy" data-action="copy-attachment-path" data-attachment-path="${escapeHTML(attachment.path)}">复制原路径</button>` : '<span>原路径未随记录返回，请沿用现有附件入口。</span>';
    return `<li class="medical-attachment"><strong>${name}</strong><span class="medical-attachment-meta">${type}${size}</span><span class="medical-attachment-path">${path}</span></li>`;
  }).join('');
  return `<section class="medical-attachments" aria-label="关联附件"><h3>关联附件</h3><p>附件只显示原关联信息；页面不上传、不覆盖原件，也不拼接公开地址。</p><ul>${rows}</ul></section>`;
}
function medicalMetadataMarkup(record) {
  const recordDate = medicalRecordDate(record);
  const sourcePlatform = record.sourcePlatform || record.source || '未注明';
  const lastSource = record.lastModifiedSource || sourcePlatform;
  const identity = record.identityVerified === true ? '身份状态由云端返回；仍以记录声明为准' : '匿名通道 · 未验证个人身份';
  return `<time datetime="${escapeHTML(record.createdAt || recordDate)}">记录日期：${escapeHTML(dateDots(recordDate))}</time><span>署名（声明）：${escapeHTML(record.author || '未署名')}</span><span>来源平台（声明）：${escapeHTML(sourcePlatform)}</span><span>最后修改来源（声明）：${escapeHTML(lastSource)}</span><span>分区：${escapeHTML(medicalSectionInfo(record.medicalSection).label)}</span>${record.createdAt?`<span>数据库创建时间：${escapeHTML(formatDateTime(record.createdAt))}</span>`:''}${record.updatedAt?`<span>数据库更新时间：${escapeHTML(formatDateTime(record.updatedAt))}</span>`:''}<span>身份说明：${escapeHTML(identity)}</span>`;
}
function healthCalendarExcerptMarkup(items) {
  const values = Array.isArray(items) ? items.filter(item => typeof item === 'string' && item.length > 0) : [];
  if (!values.length) return '<p class="health-calendar-empty">未注明</p>';
  return `<ul class="health-calendar-excerpts">${values.map(value => `<li>“${escapeHTML(value).replace(/\r\n?|\n/g, '<br>')}”</li>`).join('')}</ul>`;
}
function healthCalendarReadingMarkup(record) {
  const healthCalendar = record?.healthCalendar || {};
  const originalText = String(healthCalendar.originalText || '');
  const original = originalText ? renderReadableContent(originalText) : '<p class="health-calendar-empty">未注明</p>';
  const reviewNote = String(healthCalendar.reviewNote || '');
  const withdrawn = healthCalendar.withdrawn ? '<p class="health-calendar-withdrawn">源日历已移除此日记录，保留历史。</p>' : '';
  return `<div class="health-calendar-reading"><section id="health-calendar-original-section" class="health-calendar-original" tabindex="-1" aria-labelledby="health-calendar-original-title"><div class="health-calendar-reading-heading"><div><h3 id="health-calendar-original-title">日历原文</h3><p>来源：星月舱日历 · 日期：${escapeHTML(dateDots(healthCalendarDate(record)))}</p></div><button type="button" class="text-button" data-action="calendar-original">查看日历原文</button></div><div class="record-body formatted-record">${original}</div>${withdrawn}<p class="health-calendar-source-note">原文如需修改，请到日历修改原文。</p></section><section class="health-calendar-summary" aria-labelledby="health-calendar-summary-title"><div class="health-calendar-reading-heading"><div><h3 id="health-calendar-summary-title">便于回看的整理</h3><p>依据原句整理，供核对</p></div></div><div class="health-calendar-summary-grid"><section><h4>症状线索</h4>${healthCalendarExcerptMarkup(healthCalendar.extracted?.symptoms)}</section><section><h4>服药记录</h4>${healthCalendarExcerptMarkup(healthCalendar.extracted?.medication)}</section><section><h4>时间与持续情况</h4>${healthCalendarExcerptMarkup(healthCalendar.extracted?.timing)}</section></div></section><section class="health-calendar-review" aria-labelledby="health-calendar-review-title"><h3 id="health-calendar-review-title">核对备注</h3><div class="record-body formatted-record">${reviewNote ? renderReadableContent(reviewNote) : '<p class="health-calendar-empty">未填写</p>'}</div></section></div>`;
}
const dialogHeader = label => `<div class="dialog-top"><span>${icon('book')}${escapeHTML(label)} · ${cloudIsManaged()?'真实云端可管理':cloudIsReadOnly()?'真实云端只读':'本地演示'}</span><button class="icon-button" data-action="close-dialog" aria-label="关闭弹窗" autofocus>${icon('close')}</button></div>`;
function prayerReadableContent(value) {
  return modeIsCloud() ? renderReadableContent(value) : escapeHTML(value).replace(/\r\n?|\n/g,'<br>');
}
function prayerReadingMarkup(record) {
  const content = String(record.content || '');
  const original = String(record.prayerOriginalContent || '');
  const changed = Boolean(original && original !== content);
  const originalMarkup = changed ? `<section class="prayer-original"><h3>最初的祷告</h3><div class="record-body ${modeIsCloud()?'formatted-record':''}">${prayerReadableContent(original)}</div></section>` : '';
  const updates = (Array.isArray(record.prayerUpdates) ? record.prayerUpdates : []).map(update => {
    const author = update.author || record.prayerAuthor || record.author || '未署名';
    const stamp = update.createdAt || '';
    return `<article class="prayer-update"><div class="prayer-update-meta"><time datetime="${escapeHTML(stamp)}">${escapeHTML(formatDateTime(stamp) || dateDots(prayerDateValue(record)))}</time><span>署名：${escapeHTML(author)}</span></div><div class="record-body ${modeIsCloud()?'formatted-record':''}">${prayerReadableContent(update.content)}</div></article>`;
  }).join('');
  const updatesMarkup = updates ? `<section class="prayer-updates" aria-labelledby="prayer-updates-title"><h3 id="prayer-updates-title">近况与后续祷告</h3><div class="prayer-updates-timeline">${updates}</div></section>` : '';
  return `<div class="prayer-reading"><section class="prayer-current"><h3>${changed ? '当前祷告' : '祷告正文'}</h3><div class="record-body ${modeIsCloud()?'formatted-record':''}">${prayerReadableContent(content)}</div></section>${originalMarkup}${updatesMarkup}</div>`;
}
function openRecord(id) {
  const found = modeIsCloud() ? cloudRecordById(id) : null;
  const r = found?.record || records.find(record=>record.id===id);
  if(!r) return;
  const t = typeInfo(r.type);
  const medical = modeIsCloud() && isMedicalRecord(r);
  const healthCalendar = medical && isHealthCalendarRecord(r);
  const prayer = isPrayerRecord(r);
  let metadata = modeIsCloud()
    ? medical ? medicalMetadataMarkup(r) : `<time datetime="${escapeHTML(r.createdAt || r.date)}">${escapeHTML(dateDots(r.date))}</time><span>作者：${escapeHTML(r.author || '未署名')}</span><span>目录：${escapeHTML(t.label)}</span>${r.source?`<span>来源：${escapeHTML(r.source)}</span>`:''}${r.createdAt?`<span>创建：${escapeHTML(formatDateTime(r.createdAt))}</span>`:''}${r.updatedAt&&r.updatedAt!==r.createdAt?`<span>更新：${escapeHTML(formatDateTime(r.updatedAt))}</span>`:''}${r.deletedAt?`<span>移入回收站：${escapeHTML(formatDateTime(r.deletedAt))}</span>`:''}${r.versionCount?`<span>历史版本：${escapeHTML(r.versionCount)} 个</span>`:''}`
    : `<time datetime="${escapeHTML(r.date)}">${escapeHTML(dateDots(r.date))}</time><span>作者：演示作者</span><span>${escapeHTML(t.label)}</span>`;
  if (prayer) {
    const prayerAuthor = r.prayerAuthor || r.author || '未署名';
    const prayerDate = prayerDateValue(r);
    metadata = `<time datetime="${escapeHTML(prayerDate)}">祷告日期：${escapeHTML(dateDots(prayerDate))}</time><span>署名：${escapeHTML(prayerAuthor)}</span>${r.createdAt ? `<span>创建：${escapeHTML(formatDateTime(r.createdAt))}</span>` : ''}${r.updatedAt && r.updatedAt !== r.createdAt ? `<span>更新：${escapeHTML(formatDateTime(r.updatedAt))}</span>` : ''}${r.deletedAt ? `<span>移入回收站：${escapeHTML(formatDateTime(r.deletedAt))}</span>` : ''}`;
  }
  let body = healthCalendar ? healthCalendarReadingMarkup(r) : modeIsCloud() ? renderReadableContent(r.content) : escapeHTML(r.content).replace(/\r\n?|\n/g,'<br>');
  if (prayer) body = prayerReadingMarkup(r);
  const medicalExtras = medical ? medicalAttachmentMarkup(r.attachments) : '';
  const cloudEditButton = healthCalendar ? `<button class="secondary-button" data-action="calendar-review-edit" data-record-id="${escapeHTML(r.id)}">${icon('edit')}编辑核对备注</button>` : `<button class="secondary-button" data-edit="${escapeHTML(r.id)}">${icon('edit')}编辑云端记录</button>`;
  const actions = modeIsCloud() ? cloudIsManaged()
    ? `<div class="dialog-actions cloud-record-actions">${found.trashed?`<button class="secondary-button" data-action="cloud-restore-request" data-record-id="${escapeHTML(r.id)}">${icon('refresh')}恢复记录</button>${purgeControlMarkup(r)}`:`${cloudEditButton}<button class="danger-button" data-action="cloud-trash-request" data-record-id="${escapeHTML(r.id)}">移入回收站</button>`}<button class="secondary-button" data-action="history" data-record-id="${escapeHTML(r.id)}">查看历史</button></div><div id="cloud-action-confirm"></div><p class="record-managed-note">${healthCalendar?'日常身体记录来源：星月舱日历；原文如需修改，请到日历修改原文。':medical?'病案记录与云书房共用当前登录；医疗字段会继续保留在 medical 书架。':'云端内容可管理。'}回收站只隐藏本网页中的记录，星月舱等旧入口可能仍然显示。${['photos','songs'].includes(typeKey(r.type))?'封面为界面装饰，未加载真实媒体文件。':''}</p>`
    : `<p class="record-readonly-note">真实内容只读展示，页面不会修改或导出云端记录。${healthCalendar?'原文如需修改，请到日历修改原文。':''}${['photos','songs'].includes(typeKey(r.type))?'封面为界面装饰，未加载真实媒体文件。':''}</p>`
    : `<div class="dialog-actions"><button class="secondary-button" data-edit="${escapeHTML(r.id)}">${icon('edit')}编辑示例</button><button class="secondary-button" data-dialog-favorite="${escapeHTML(r.id)}">${icon('star')}${r.favorite?'取消收藏':'收藏'}</button><button class="danger-button push-right" data-delete-request="${escapeHTML(r.id)}">删除示例</button></div><p class="record-demo-note">示例内容 · 仅用于前端体验，非真实记忆</p><div id="delete-confirm"></div>`;
  openDialog(`${dialogHeader(t.label)}<article class="dialog-body"><h2 id="dialog-heading">${escapeHTML(r.title)}</h2><div class="record-meta">${metadata}</div><div class="record-body ${modeIsCloud()?'formatted-record':''}">${body}${medicalExtras}</div>${actions}</article>`);
  $('record-dialog').setAttribute('aria-labelledby','dialog-heading');
}
function toggleEditorPreview() {
  const form = $('edit-form');
  const preview = form?.querySelector('#editor-preview');
  const fields = form?.querySelector('[data-editor-fields]');
  if (!form || !preview || !fields || !editorSession) return;
  const values = readEditorValues(form);
  const previewContent = editorSession.mode==='cloud' ? renderReadableContent(values.content) : escapeHTML(values.content).replace(/\r\n?|\n/g,'<br>');
  const previewFollowup = editorSession.prayer && values.prayerUpdate.trim() ? `<section class="prayer-preview-followup"><h4>本次追加近况</h4><div class="record-body ${editorSession.mode==='cloud'?'formatted-record':''}">${editorSession.mode==='cloud'?renderReadableContent(values.prayerUpdate):escapeHTML(values.prayerUpdate).replace(/\r\n?|\n/g,'<br>')}</div></section>` : '';
  const previewReviewNote = editorSession.healthCalendar ? `<section class="health-calendar-review"><h4>核对备注</h4><div class="record-body formatted-record">${values.healthReviewNote.trim() ? renderReadableContent(values.healthReviewNote) : '<p class="health-calendar-empty">未填写</p>'}</div></section>` : '';
  preview.innerHTML = `<h3>${escapeHTML(values.title || '未命名记录')}</h3><div class="record-body ${editorSession.mode==='cloud'?'formatted-record':''}">${previewContent}</div>${previewReviewNote}${previewFollowup}`;
  editorSession.preview = !editorSession.preview;
  preview.hidden = !editorSession.preview;
  fields.hidden = editorSession.preview;
  const button = form.querySelector('[data-action="toggle-preview"]');
  if (button) button.textContent = editorSession.preview ? '返回编辑' : '保存前预览';
}
function fillPrayerTemplate() {
  const form = $('edit-form');
  if (!form || !editorSession?.prayer) return;
  const content = editorField(form, 'content');
  const title = editorField(form, 'title');
  const prayerDate = editorField(form, 'prayerDate');
  if (content && String(content.value || '').trim()) {
    toast('正文已有内容，可继续自由书写；模板没有覆盖当前草稿。');
    return;
  }
  if (title && !String(title.value || '').trim()) title.value = '今日的祷告与心愿';
  if (content) content.value = PRAYER_TEMPLATE;
  if (prayerDate && !String(prayerDate.value || '').trim()) prayerDate.value = todayForEditor();
  editorMessage('');
  toast('引导模板已填入当前草稿，保存前仍可继续修改。');
}
function openHealthCalendarReviewEditor(record) {
  if (!record || !isHealthCalendarRecord(record)) return;
  const healthCalendar = record.healthCalendar;
  const initial = {
    title: record.title || '',
    type: 'medical',
    date: record.date || '',
    recordDate: record.recordDate || healthCalendarDate(record),
    medicalSection: record.medicalSection || 'followup',
    prayerDate: '',
    prayerAuthor: '',
    prayerUpdate: '',
    healthReviewNote: healthCalendar.reviewNote || '',
    content: record.content || '',
    confirmed: false,
  };
  editorSession = { id: record.id, existing: record, mode: 'cloud', medical: true, prayer: false, healthCalendar: true, initial, saving: false, preview: false };
  const originalText = String(healthCalendar.originalText || '');
  openDialog(`${dialogHeader('编辑核对备注')}<div class="dialog-body"><h2 id="dialog-heading">编辑核对备注</h2><p class="view-description">日历同步字段只能查看；核对备注会保存到这条病案记录。原文如需修改，请到日历修改原文。</p><p class="editor-readonly-meta">来源：星月舱日历 · 日期：${escapeHTML(dateDots(healthCalendarDate(record)))} · 最近同步：${escapeHTML(formatDateTime(healthCalendar.syncedAt) || '未注明')}</p><form id="edit-form" class="edit-form health-calendar-editor" data-id="${escapeHTML(record.id)}" data-mode="cloud" data-medical="true" data-health-calendar="true"><div data-editor-fields><label>标题（同步字段）<input name="title" value="${escapeHTML(record.title || '')}" readonly aria-readonly="true"></label><input type="hidden" name="type" value="medical"><div class="form-row medical-form-row"><label>病案分区（同步字段）<input name="medicalSection" value="${escapeHTML(record.medicalSection || 'followup')}" readonly aria-readonly="true"><small>${escapeHTML(medicalSectionInfo(record.medicalSection).label)}</small></label><label>记录日期（同步字段）<input name="recordDate" type="date" value="${escapeHTML(record.recordDate || healthCalendarDate(record))}" readonly aria-readonly="true"></label></div><label>同步正文（只读）<textarea name="content" readonly aria-readonly="true">${escapeHTML(record.content || '')}</textarea></label><label>日历原文（只读）<textarea name="healthCalendarOriginal" readonly aria-readonly="true">${escapeHTML(originalText)}</textarea></label><label>核对备注<textarea name="healthReviewNote" maxlength="${HEALTH_REVIEW_NOTE_MAX}" placeholder="写下需要回看或核对的备注…">${escapeHTML(healthCalendar.reviewNote || '')}</textarea><small>备注只用于核对，不会改写日历原文或同步正文。</small></label></div><div id="editor-preview" class="editor-preview" hidden></div><p id="editor-error" class="form-error" role="alert" hidden></p><div class="dialog-actions"><button type="button" class="secondary-button" data-action="toggle-preview">保存前预览</button><button type="submit" class="gold-button">${icon('check')}保存核对备注</button><button type="button" class="secondary-button" data-action="close-dialog">取消</button></div></form></div>`);
  $('record-dialog').setAttribute('aria-labelledby','dialog-heading');
  editorField($('edit-form'), 'healthReviewNote')?.focus?.();
}
function openEditor(id='') {
  if (!modeIsDemo() && !cloudIsManaged()) { toast('真实云书房为只读模式，不能新建或编辑记录。'); return; }
  const cloudEditor = cloudIsManaged();
  const r=id?(cloudEditor?cloudRecords:records).find(record=>record.id===id):null;
  if(id&&!r) return;
  if (cloudEditor && r && isHealthCalendarRecord(r)) { openHealthCalendarReviewEditor(r); return; }
  const selected = r?.type || (view === 'medical' ? 'medical' : view === 'prayer' ? 'prayer' : typeFilter || 'diary');
  const medicalEditor = isMedicalRecord(r) || selected === 'medical' || view === 'medical';
  const prayerEditor = !medicalEditor && (isPrayerRecord(r) || selected === 'prayer' || view === 'prayer');
  // Prayer entries have date, author, guide and follow-up fields of their own.
  // Keep them out of the generic editor so choosing a type can never create a
  // prayer without those fields; the dedicated prayer entry opens this editor.
  const typeOptions = Object.entries(TYPES).filter(([key]) => (key !== 'medical' || cloudEditor) && key !== 'prayer').map(([key,t])=>`<option value="${escapeHTML(key)}" ${selected===key?'selected':''}>${escapeHTML(t.name)}</option>`).join('') + (!Object.hasOwn(TYPES,selected) && selected && selected !== 'prayer' ? `<option value="${escapeHTML(selected)}" selected>${escapeHTML(typeInfo(selected).name)}</option>` : '');
  const initialMedicalSection = r ? (r.medicalSection || '') : (medicalEditor ? (MEDICAL_SECTION_ORDER.includes(medicalSection) ? medicalSection : 'baseline') : '');
  const initialRecordDate = r?.recordDate || (medicalEditor ? medicalRecordDate(r || { date: todayForEditor() }) : '');
  const initialPrayerDate = r?.prayerDate || (prayerEditor ? prayerDateValue(r || { date: todayForEditor() }) : '');
  const initialPrayerAuthor = r?.prayerAuthor || r?.author || PRAYER_AUTHORS[0];
  let cloudMeta = cloudEditor && r ? medicalEditor ? `<p class="editor-readonly-meta">署名（声明）：${escapeHTML(r.author||'未署名')} · 来源平台（声明）：${escapeHTML(r.sourcePlatform||r.source||'未注明')} · 记录日期：${escapeHTML(medicalRecordDate(r))} · 数据库更新时间：${escapeHTML(formatDateTime(r.updatedAt))}</p>` : `<p class="editor-readonly-meta">作者：${escapeHTML(r.author||'未署名')} · 来源：${escapeHTML(r.source||'未注明')} · 创建：${escapeHTML(formatDateTime(r.createdAt))} · 更新时间：${escapeHTML(formatDateTime(r.updatedAt))}</p>` : '';
  if (cloudEditor && prayerEditor && r) cloudMeta = `<p class="editor-readonly-meta">署名：${escapeHTML(initialPrayerAuthor)} · 创建：${escapeHTML(formatDateTime(r.createdAt))} · 更新时间：${escapeHTML(formatDateTime(r.updatedAt))}</p>`;
  const needsConfirmation = cloudEditor && (isProtectedCloudType(selected) || isProtectedCloudType(r?.type));
  const initial = { title:r?.title||'', type:medicalEditor?'medical':prayerEditor?'prayer':selected, date:r?.date||(cloudEditor?'': '2026-10-20'), recordDate:initialRecordDate, medicalSection:initialMedicalSection, prayerDate:initialPrayerDate, prayerAuthor:initialPrayerAuthor, prayerUpdate:'', healthReviewNote:'', content:r?.content||'', confirmed:false };
  editorSession = { id:cloudEditor?(r?.id||''):id, existing:cloudEditor?r:null, mode:cloudEditor?'cloud':'demo', medical:medicalEditor, prayer:prayerEditor, healthCalendar:false, initial, saving:false, preview:false };
  const prayerTemplateButton = prayerEditor && !r ? '<button type="button" class="text-button prayer-template-button" data-action="prayer-template">填入祷告引导模板（仅填入草稿）</button>' : '';
  const prayerFields = prayerEditor ? `<input type="hidden" name="type" value="prayer"><div class="prayer-editor-context"><strong>祷告与心愿</strong><span>可以按引导写，也可以自由写下此刻想说的话。模板只会填入当前草稿，不会自动保存。</span></div><div class="form-row prayer-form-row"><label>祷告日期<input name="prayerDate" type="date" required min="1900-01-01" max="2199-12-31" value="${escapeHTML(initialPrayerDate)}"></label>${r ? `<label>署名<input name="prayerAuthor" value="${escapeHTML(initialPrayerAuthor)}" readonly aria-readonly="true"><small>仅用于区分记录，不是登录身份。</small></label>` : `<label>署名<select name="prayerAuthor">${PRAYER_AUTHORS.map(author=>`<option value="${escapeHTML(author)}" ${author===initialPrayerAuthor?'selected':''}>${escapeHTML(author)}</option>`).join('')}</select></label>`}</div>${prayerTemplateButton}${r ? `<label class="prayer-followup-field">追加近况（追加，不会覆盖原祷告）<textarea name="prayerUpdate" maxlength="${CLOUD_CONTENT_MAX}" placeholder="写下新的近况、感谢或请求；保存后会作为一条近况追加。"></textarea><small>追加内容会保留在近况时间线中。</small></label>` : ''}` : '';
  const medicalFields = medicalEditor ? `<div class="medical-editor-context"><strong>辰医生病案室 · medical</strong><span>病案记录会保留在 medical 书架，其他书架记录不会自动迁入。</span></div><input type="hidden" name="type" value="medical"><div class="form-row medical-form-row"><label>病案分区<select name="medicalSection">${MEDICAL_SECTION_ORDER.map(section=>`<option value="${section}" ${initialMedicalSection===section?'selected':''}>${escapeHTML(MEDICAL_SECTIONS[section].label)}</option>`).join('')}<option value="" ${!MEDICAL_SECTION_ORDER.includes(initialMedicalSection)?'selected':''}>待归类</option></select></label><label>记录日期<input name="recordDate" type="date" required min="1900-01-01" max="2199-12-31" value="${escapeHTML(initialRecordDate)}"></label></div>` : prayerEditor ? prayerFields : `<div class="form-row"><label>放入书架<select name="type">${typeOptions}</select></label>${cloudEditor?'':`<label>记录日期<input name="date" type="date" required min="1900-01-01" max="2199-12-31" value="${escapeHTML(r?.date||'2026-10-20')}"></label>`}</div>`;
  const contentPlaceholder = medicalEditor ? '写下检查结果、诊疗观察或随访记录…' : prayerEditor ? '写下此刻想表达的祷告、感谢、牵挂或祝福…' : '写下一个片段、一点灵感，或者一句想留住的话…';
  openDialog(`${dialogHeader(cloudEditor?(r?'编辑云端记录':'新建云端记录'):'写一笔')}<div class="dialog-body"><h2 id="dialog-heading">${r?(cloudEditor?(medicalEditor?'编辑这条病案':'编辑这段云端记录'):'编辑这段示例'):(cloudEditor?(medicalEditor?'新建病案记录':prayerEditor?'新建祷告与心愿':'给云书房新建一笔'):'给今天，留一笔')}</h2><p class="view-description">${cloudEditor?(medicalEditor?'请填写真实记录内容；不会自动生成病案正文。保存后仍可从病案室查看历史。':prayerEditor?'保存前可以预览；真实草稿只保留在当前页面，作者和日期会随祷告记录保存。':'保存前可以预览；真实草稿只保留在当前页面，作者由云端记录。'):'只保存在当前浏览器，请使用演示内容。'}</p>${cloudMeta}<form id="edit-form" class="edit-form" data-id="${escapeHTML(cloudEditor?(r?.id||''):id)}" data-mode="${cloudEditor?'cloud':'demo'}" data-medical="${medicalEditor?'true':'false'}" data-prayer="${prayerEditor?'true':'false'}"><div data-editor-fields><label>标题<input name="title" required maxlength="${cloudEditor?CLOUD_TITLE_MAX:100}" value="${escapeHTML(r?.title||'')}" placeholder="给这段记忆起个名字"></label>${medicalFields}<label>正文<textarea name="content" required maxlength="${cloudEditor?CLOUD_CONTENT_MAX:20000}" placeholder="${contentPlaceholder}">${escapeHTML(r?.content||'')}</textarea></label>${cloudEditor?`<label id="cloud-confirm-label" class="confirm-check"${needsConfirmation?'':' hidden'}><input type="checkbox" name="confirmed">正式类别操作确认（PP、协议、公约保存时必选）</label>`:''}</div><div id="editor-preview" class="editor-preview" hidden></div><p id="editor-error" class="form-error" role="alert" hidden></p><div class="dialog-actions"><button type="button" class="secondary-button" data-action="toggle-preview">保存前预览</button><button type="submit" class="gold-button">${icon('check')}${cloudEditor?'保存云端记录':'保存演示记录'}</button><button type="button" class="secondary-button" data-action="close-dialog">取消</button></div></form></div>`);
  $('record-dialog').setAttribute('aria-labelledby','dialog-heading');
  editorField($('edit-form'),'title')?.focus?.();
}
function historyMarkup(record, versions) {
  const actionLabels = { create:'新建', insert:'写入', update:'修改', delete:'删除', trash:'移入回收站', restore:'恢复', 'restore-version':'恢复版本', baseline:'基线' };
  const actionLabel = action => {
    const raw = String(action || '').trim();
    const [base, suffix] = raw.toLowerCase().split('-');
    const suffixLabel = suffix === 'before' ? '前' : suffix === 'after' ? '后' : suffix === 'baseline' ? '基线' : suffix === 'version' ? '版本' : '';
    if (base === 'baseline' && suffixLabel === '基线') return '基线';
    return `${actionLabels[base] || raw || '保存'}${suffixLabel}`;
  };
  const rows = versions.map((version, index) => {
    const medicalVersion = typeKey(version.type || record.type) === 'medical';
    const sourcePlatform = version.sourcePlatform || version.source || record.sourcePlatform || record.source || '未注明';
    const savedAt = version.savedAt || version.recordedAt || version.recorded_at || version.updatedAt || '';
    const attachments = Array.isArray(version.attachments) ? version.attachments.map((attachment, attachmentIndex) => normalizeAttachment(attachment, attachmentIndex)).filter(Boolean) : [];
    const identityNote = `身份：未提供个人登录身份，署名未验证${version.actorUid ? ` · 数据库登录帐号 UID：${escapeHTML(version.actorUid)}（不等于署名已验证）` : ''}`;
    const medicalMeta = medicalVersion ? `<p class="history-meta medical-history-meta">病案分区：${escapeHTML(medicalSectionInfo(version.medicalSection).label)} · 记录日期：${escapeHTML(version.recordDate || version.date || '未注明')} · 署名（声明）：${escapeHTML(version.author || record.author || '未署名')} · 声明来源：${escapeHTML(sourcePlatform)} · 最后修改来源：${escapeHTML(version.lastModifiedSource || sourcePlatform)} · ${identityNote}${version.dbRole?` · 数据库角色：${escapeHTML(version.dbRole)}`:''}${version.createdAt?` · 数据库时间：${escapeHTML(formatDateTime(version.updatedAt || version.createdAt))}`:''}</p>${medicalAttachmentMarkup(attachments)}` : `<p class="history-meta">${escapeHTML(typeInfo(version.type||record.type).label)} · 作者：${escapeHTML(version.author||record.author||'未署名')}${version.source?` · 来源：${escapeHTML(version.source)}`:''}</p>`;
    const calendarVersion = isHealthCalendarRecord(record) || isHealthCalendarRecord(version);
    const canRestore = !calendarVersion && (!isMedicalRecord(record) || typeKey(version.type || record.type) === 'medical');
    const restoreControl = canRestore ? `<button class="secondary-button" data-action="restore-version-request" data-record-id="${escapeHTML(record.id)}" data-version-id="${escapeHTML(version.versionId||'')}">${icon('refresh')}恢复到此版本</button>` : calendarVersion ? `<button class="secondary-button" type="button" disabled title="日历原文只读，不能在书房恢复">${icon('refresh')}恢复到此版本</button><p class="history-meta">原文请在日历修改。</p>` : `<button class="secondary-button" type="button" disabled title="跨平台快照只读，不能恢复">${icon('refresh')}恢复到此版本</button><p class="history-meta">此快照属于其他书架分区，仅保留为只读历史。</p>`;
    return `<article class="history-version ${medicalVersion?'medical-history-version':''}"><div class="history-version-header"><strong>版本 ${versions.length-index}</strong><time datetime="${escapeHTML(savedAt)}">${escapeHTML(formatDateTime(savedAt)||'未注明时间')}</time><span>${escapeHTML(actionLabel(version.action))}</span></div><h3>${escapeHTML(version.title||'未命名记录')}</h3>${medicalMeta}<div class="record-body formatted-record">${renderReadableContent(version.content||'')}</div>${restoreControl}</article>`;
  }).join('');
  const historyIntro = isHealthCalendarRecord(record) ? '历史版本只读展示；日历原文需要回到星月舱日历修改。病案历史中的署名、来源和匿名通道信息来自记录声明，未代表已验证个人身份。' : '历史版本只读展示，恢复会生成一条新的云端版本。病案历史中的署名、来源和匿名通道信息来自记录声明，未代表已验证个人身份。';
  return `<div class="history-intro">${historyIntro}</div>${rows||'<p class="view-description">暂无历史版本。</p>'}<div id="history-confirm"></div>`;
}
async function copyAttachmentPath(path) {
  const value = String(path || '');
  if (!value) { toast('这条附件没有返回原路径，请沿用现有附件入口。'); return; }
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      toast('已复制附件原路径。');
      return;
    }
  } catch { /* clipboard may be unavailable in a local preview */ }
  toast(`附件原路径：${value}`);
}
async function openHistory(id) {
  if (!cloudIsManaged()) { toast('当前云书房为只读模式，不能查看管理历史。'); return; }
  const found = cloudRecordById(id);
  if (!found) return;
  historyAbortController?.abort();
  const generation = cloudRequestGeneration;
  const session = { id, generation, versions: [] };
  historySession = session;
  const controller = new AbortController();
  historyAbortController = controller;
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 15000);
  openDialog(`${dialogHeader('历史版本')}<div class="dialog-body"><h2 id="dialog-heading">${escapeHTML(found.record.title)} · 历史版本</h2><div id="history-panel"><p class="status-loading">正在读取历史版本…</p></div></div>`);
  try {
    const response = await apiRequest(`/api/entries/${encodeURIComponent(id)}/history`, { method:'GET', headers:{ 'X-Yunshufang-Read': CLOUD_READ_HEADER }, signal: controller.signal });
    if (response.status === 401) {
      if (generation !== cloudRequestGeneration || historySession !== session || controller.signal.aborted) return;
      document.dispatchEvent(new Event('yunshufang-lock'));
      return;
    }
    let payload = null;
    try { payload = await response.json(); } catch { payload = null; }
    if (!response.ok) throw new Error(payload?.error || `读取历史版本失败（${response.status}）`);
    if (generation !== cloudRequestGeneration || historySession !== session || controller.signal.aborted) return;
    const versions = (Array.isArray(payload?.versions) ? payload.versions : []).slice().sort((a, b) => {
      const left = Date.parse(a?.savedAt || a?.recordedAt || a?.recorded_at || a?.updatedAt || '');
      const right = Date.parse(b?.savedAt || b?.recordedAt || b?.recorded_at || b?.updatedAt || '');
      if (Number.isNaN(left) && Number.isNaN(right)) return 0;
      if (Number.isNaN(left)) return 1;
      if (Number.isNaN(right)) return -1;
      return right - left;
    });
    session.versions = versions;
    const panel = $('history-panel');
    if (panel) panel.innerHTML = historyMarkup(found.record, versions);
  } catch (error) {
    if (generation !== cloudRequestGeneration || historySession !== session || (error?.name === 'AbortError' && !timedOut)) return;
    const panel = $('history-panel');
    const message = timedOut ? '读取历史版本超时，请重试。' : (error?.message || '读取历史版本失败，请重试。');
    if (panel) panel.innerHTML = `<p class="form-error" role="alert">${escapeHTML(message)}</p>`;
  } finally {
    clearTimeout(timer);
    if (historyAbortController === controller) historyAbortController = null;
  }
}
function exportRecords() {
  if (!modeIsDemo()) { toast('真实云书房为只读模式，不能导出云端内容。'); return; }
  const data={kind:'yunshufang-demo-only',version:2,exportedAt:new Date().toISOString(),records};
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='云书房-演示记录.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast('已导出演示记录 JSON。');
}
function resetConfirmation(){
  if (!modeIsDemo()) { toast('真实云书房为只读模式，不能恢复云端记录。'); return; }
  openDialog(`${dialogHeader('恢复示例')}<div class="dialog-body"><h2 id="dialog-heading">恢复最初的书房？</h2><p class="view-description">这会清除当前浏览器内的演示修改和收藏，恢复初始示例。云端内容不受影响。你可以先在设置中导出。</p><div class="dialog-actions"><button class="danger-button" data-action="confirm-reset">确认恢复</button><button class="secondary-button" data-action="close-dialog">保留当前内容</button></div></div>`);
  $('record-dialog').setAttribute('aria-labelledby','dialog-heading');
}

document.addEventListener('click',event=>{
  const target=event.target.closest('button');
  if(!target) return;
  if(target.disabled) return;
  if(target.dataset.view){setView(target.dataset.view);return;}
  if(target.dataset.medicalFollowupFilter){
    if (view !== 'medical') view = 'medical';
    medicalRoomOpen = true;
    medicalSection = 'followup';
    medicalFollowupFilter = target.dataset.medicalFollowupFilter === 'calendar' ? 'calendar' : 'all';
    typeFilter='';dateFilter='';favoritesOnly=false;
    render();
    return;
  }
  if(target.dataset.medicalSection){
    if(view !== 'medical') { view = 'medical'; }
    medicalRoomOpen = true;
    medicalSection = target.dataset.medicalSection === 'all' ? 'all' : medicalSectionKey(target.dataset.medicalSection);
    if (medicalSection !== 'followup') medicalFollowupFilter = 'all';
    typeFilter='';dateFilter='';favoritesOnly=false;
    render();
    return;
  }
  if(target.dataset.type){
    if (target.dataset.type === 'medical') {
      view = 'medical';
      medicalRoomOpen = true;
      medicalSection = 'all';
      typeFilter='';dateFilter='';favoritesOnly=false;
      render();
      return;
    }
    typeFilter=typeFilter===target.dataset.type?'':target.dataset.type;
    view='stream';dateFilter='';favoritesOnly=false;
    render();return;
  }
  if(target.dataset.open){openRecord(target.dataset.open);return;}
  if(target.dataset.edit){openEditor(target.dataset.edit);return;}
  const favoriteId=target.dataset.favorite||target.dataset.dialogFavorite;
  if(favoriteId){
    if(!modeIsDemo()){ toast('真实云书房为只读模式，不提供收藏。'); return; }
    const r=records.find(r=>r.id===favoriteId);if(!r)return;
    r.favorite=!r.favorite;updateDemoReference();persist();render();if(target.dataset.dialogFavorite)openRecord(r.id);
    toast(r.favorite?'已加入本机演示收藏。':'已取消收藏。');return;
  }
  if(target.dataset.date){
    dateFilter=dateFilter===target.dataset.date?'':target.dataset.date;
    view='calendar';typeFilter='';favoritesOnly=false;$('search').value='';
    render();
    $('content-column').scrollIntoView({block:'start',behavior:'instant'});
    return;
  }
  if(target.dataset.deleteRequest){
    if(!modeIsDemo()){ toast('真实云书房为只读模式，不能删除记录。'); return; }
    const r=records.find(r=>r.id===target.dataset.deleteRequest);if(!r)return;
    $('delete-confirm').innerHTML=`<div class="confirm-box" role="alert">确认删除这条本地演示记录？<div class="dialog-actions"><button class="danger-button" data-delete-confirm="${escapeHTML(r.id)}">确认删除</button><button class="secondary-button" data-action="cancel-delete">取消</button></div></div>`;
    $('delete-confirm').scrollIntoView({block:'nearest'});
    $('delete-confirm').querySelector('button').focus();return;
  }
  if(target.dataset.deleteConfirm){
    if(!modeIsDemo()){ toast('真实云书房为只读模式，不能删除记录。'); return; }
    records=records.filter(r=>r.id!==target.dataset.deleteConfirm);
    updateDemoReference();persist();render();closeDialog();$('main-content').focus({preventScroll:true});toast('已删除这条本地示例。');return;
  }
  switch(target.dataset.action){
    case 'lock-study':$('logout').onclick();break;
    case 'close-dialog':closeDialog();break;
    case 'toggle-preview':toggleEditorPreview();break;
    case 'prayer-template':fillPrayerTemplate();break;
    case 'calendar-original': {
      const original = document.getElementById('health-calendar-original-section');
      original?.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
      original?.focus?.({ preventScroll: true });
      break;
    }
    case 'calendar-review-edit': openEditor(target.dataset.recordId || ''); break;
    case 'prayer-new':openEditor();break;
    case 'history':void openHistory(target.dataset.recordId);break;
    case 'cloud-trash-request':openCloudActionConfirmation('trash',target.dataset.recordId);break;
    case 'cloud-restore-request':openCloudActionConfirmation('restore',target.dataset.recordId);break;
    case 'cloud-purge-request':openPurgeConfirmation(target.dataset.recordId);break;
    case 'cloud-purge-confirm':void performPurge(target.dataset.recordId);break;
    case 'restore-version-request':openCloudActionConfirmation('restore-version',target.dataset.recordId,target.dataset.versionId);break;
    case 'cloud-trash-confirm':{
      const confirmBox=$('record-dialog').querySelector('[data-cloud-confirm]');
      void performCloudAction('trash',target.dataset.recordId,{confirmed:confirmBox?.checked===true});
      break;
    }
    case 'cloud-restore-confirm':{
      const confirmBox=$('record-dialog').querySelector('[data-cloud-confirm]');
      void performCloudAction('restore',target.dataset.recordId,{confirmed:confirmBox?.checked===true});
      break;
    }
    case 'cloud-restore-version-confirm':{
      const confirmBox=$('record-dialog').querySelector('[data-cloud-confirm]');
      void performCloudAction('restore-version',target.dataset.recordId,{versionId:target.dataset.versionId,confirmed:confirmBox?.checked===true});
      break;
    }
    case 'cancel-cloud-confirm':{
      const box=$('cloud-action-confirm')||$('history-confirm');
      if(box) box.innerHTML='';
      break;
    }
    case 'cancel-delete':$('delete-confirm').innerHTML='';break;
    case 'clear-filters':
      if (view === 'medical') { medicalSection='all'; medicalFollowupFilter='all'; typeFilter=''; dateFilter=''; favoritesOnly=false; $('search').value=''; render(); }
      else if (view === 'prayer') { typeFilter=''; dateFilter=''; favoritesOnly=false; $('search').value=''; render(); }
      else setView('stream');
      break;
    case 'export':exportRecords();break;
    case 'reset':resetConfirmation();break;
    case 'confirm-reset':if(!modeIsDemo())return;records=structuredClone(seed);updateDemoReference();persist();setView('home');closeDialog();$('main-content').focus({preventScroll:true});toast('已恢复初始演示。');break;
    case 'open-cloud':void loadCloud({open:true});break;
    case 'retry-cloud':void loadCloud({open:currentMode==='landing'});break;
    case 'refresh-cloud':if(modeIsCloud())void loadCloud();break;
     case 'refresh-backup':if(modeIsCloud() && view==='settings')void loadBackupStatus();break;
     case 'run-backup':void runBackup();break;
    case 'switch-demo':{
      const fromLanding = !$('login-view').hidden;
      if (!switchToDemo()) break;
      if (fromLanding) {
        $('login-view').hidden = true;
        $('library-view').hidden = false;
        document.querySelector('.skip-link').href = '#main-content';
        setView('home');
      }
      break;
    }
    case 'medical-enter':
      medicalRoomOpen = true;
      medicalSection = 'baseline';
      medicalFollowupFilter = 'all';
      typeFilter='';dateFilter='';favoritesOnly=false;
      render();
      $('main-content').focus({preventScroll:true});
      break;
    case 'medical-all': medicalSection='all'; medicalFollowupFilter='all'; render(); break;
    case 'copy-attachment-path': void copyAttachmentPath(target.dataset.attachmentPath || ''); break;
  }
});
document.addEventListener('change', event => {
  const target = event.target;
  if (target?.name !== 'type' || !editorSession || editorSession.mode !== 'cloud') return;
  const form = target.closest?.('#edit-form');
  const confirmation = form?.querySelector?.('#cloud-confirm-label');
  if (confirmation) confirmation.hidden = isProtectedCloudType(target.value) === false && isProtectedCloudType(editorSession.existing?.type) === false;
});
document.addEventListener('submit',event=>{
  if(event.target.id!=='edit-form')return;
  event.preventDefault();
  if(cloudIsManaged()){ void saveCloudEditor(event.target); return; }
  if(!modeIsDemo()){ toast('真实云书房为只读模式，不能保存记录。'); closeDialog({force:true}); return; }
  const form=event.target,values=new FormData(form);
  const medicalDemo = editorSession?.medical === true;
  const prayerDemo = editorSession?.prayer === true;
  const title=String(values.get('title') ?? '').trim(),content=String(values.get('content') ?? '').trim(),date=medicalDemo?String(values.get('recordDate') || todayForEditor()):prayerDemo?String(values.get('prayerDate') || todayForEditor()):String(values.get('date') || ''),type=medicalDemo?'medical':prayerDemo?'prayer':String(values.get('type') || '');
  if(!title||!content){toast('请填写标题和正文，不能只写空格。');return;}
  if(!Object.hasOwn(TYPES,type)||!/^\d{4}-\d{2}-\d{2}$/.test(date))return;
  const existing=records.find(r=>r.id===form.dataset.id);
  const prayerAuthor = String(values.get('prayerAuthor') || '').trim();
  if (prayerDemo && !existing && !PRAYER_AUTHORS.includes(prayerAuthor)) { toast('请选择有效的署名。'); return; }
  const prayerUpdates = prayerDemo ? structuredClone(existing?.prayerUpdates || []) : [];
  const prayerUpdate = prayerDemo ? String(values.get('prayerUpdate') || '').trim() : '';
  if (prayerDemo && prayerUpdate) prayerUpdates.push({ id: `local-prayer-update-${Date.now()}`, content: prayerUpdate, createdAt: new Date().toISOString(), author: existing?.prayerAuthor || prayerAuthor });
  const entry={id:existing?.id||`local-${crypto.randomUUID()}`,title,content,type,date,recordDate:medicalDemo?date:'',medicalSection:medicalDemo?(String(values.get('medicalSection') || medicalSection) || ''):'',favorite:existing?.favorite||false,prayerDate:prayerDemo?date:'',prayerAuthor:prayerDemo?(existing?.prayerAuthor || prayerAuthor):'',prayerOriginalContent:prayerDemo?(existing?.prayerOriginalContent || ''):'',prayerUpdates};
  if(existing)records=records.map(r=>r.id===existing.id?entry:r);else records.push(entry);
  updateDemoReference();const saved=persist();view='stream';typeFilter='';dateFilter='';favoritesOnly=false;$('search').value='';render();openRecord(entry.id);
  toast(saved?'已保存到本机浏览器，未上传云端。':'本次页面已更新，但浏览器无法持久保存。');
});
$('login-form').addEventListener('submit',event=>{
  event.preventDefault();
  void loadCloud({open:true});
});
$('demo-entry').onclick=()=>{
  if (!switchToDemo({announce:false})) return;
  $('login-view').hidden=true;$('library-view').hidden=false;
  document.querySelector('.skip-link').href='#main-content';setView('home');$('main-content').focus({preventScroll:true});
  toast('欢迎来到本机演示书房。这里的记录都可以放心试用。');
};
$('starlink').onclick=()=>toast('星月舱接入口已预留，当前未连接。');
$('admin-entry').onclick=()=>document.dispatchEvent(new Event('yunshufang-logout'));
$('new-record').onclick=()=>openEditor();
$('refresh-cloud').onclick=()=>{ if(modeIsCloud()) void loadCloud(); };
$('notifications').onclick=()=>toast(modeIsCloud() ? `真实云书房${cloudIsManaged()?'可管理':'只读'} · ${cloudTotal} 条记录${cloudError?' · 刷新失败':''}` : '当前为本地前端演示，没有云端通知或同步。');
$('profile').onclick=()=>setView('settings');
$('medical-card').onclick=()=>setView('medical');
$('search').addEventListener('input',()=>{
  if(view==='settings'){stopBackupPolling();invalidateBackupRequest();view='stream';typeFilter='';dateFilter='';favoritesOnly=false;render();}
  else if(view==='medical'){ if(!medicalRoomOpen) medicalRoomOpen=true; render(); }
  else renderContent();
});
$('calendar-prev').onclick=()=>{calendarMonth--;if(calendarMonth<0){calendarMonth=11;calendarYear--;}renderCalendar();};
$('calendar-next').onclick=()=>{calendarMonth++;if(calendarMonth>11){calendarMonth=0;calendarYear++;}renderCalendar();};
$('calendar-today').onclick=()=>{setCalendarFromDate(modeIsCloud()?datePartsInShanghai():'2026-10-20');dateFilter='';renderCalendar();renderContent();toast(modeIsCloud()?'已回到上海时区的当前月份。':'已回到演示日期所在月：2026 年 10 月。');};
$('open-nav').onclick=()=>toggleNav(true);
$('close-nav').onclick=()=>toggleNav(false);
$('nav-scrim').onclick=()=>toggleNav(false);
function clearSessionView({ force = false } = {}) {
  toggleNav(false);
  if (!closeDialog({ force })) return false;
  invalidateCloudRequest();clearCloudRecords();currentMode='landing';cloudStatus='idle';cloudError='';records=demoRecords;
  view='home';medicalSection='baseline';medicalFollowupFilter='all';medicalRoomOpen=false;typeFilter='';dateFilter='';favoritesOnly=false;$('search').value='';
  setCalendarFromDate('2026-10-20');render();
  $('library-view').hidden=true;$('login-view').hidden=false;
  document.querySelector('.skip-link').href='#login-title';
  window.scrollTo({top:0,behavior:'instant'});$('login-form').querySelector('button[type="submit"]').focus({preventScroll:true});renderModeChrome();renderLoginStatus();
  return true;
}
document.addEventListener('yunshufang-lock',()=>{ clearSessionView({ force:true }); });
$('logout').onclick=()=>{
  if (!clearSessionView()) return;
  document.dispatchEvent(new Event('yunshufang-logout'));
};
$('record-dialog').addEventListener('cancel',event=>{
  if (purgingId) { event.preventDefault(); toast('正在备份并清除，请等待结果。'); return; }
  if (!editorSession || !editorIsDirty()) return;
  event.preventDefault();
  if (typeof window.confirm === 'function' && window.confirm('还有未保存的编辑，确定放弃当前草稿吗？')) closeDialog({force:true});
});
$('record-dialog').addEventListener('close',()=>{if($('record-dialog').open)return;$('dialog-content').innerHTML='';editorSession=null;historySession=null;lastDialogFocus?.isConnected?lastDialogFocus.focus():$('main-content').focus({preventScroll:true});});
$('record-dialog').addEventListener('click',event=>{if(event.target===$('record-dialog')){const r=$('record-dialog').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog();}});
window.addEventListener('beforeunload', event => {
  if (!purgingId && (!editorSession || !editorIsDirty())) return;
  event.preventDefault();
  event.returnValue = '';
});
document.addEventListener('keydown',event=>{
  if(!$('sidebar').classList.contains('open'))return;
  if(event.key==='Escape'){event.preventDefault();toggleNav(false);}
  if(event.key==='Tab'){
    const buttons=[...$('sidebar').querySelectorAll('button')].filter(el=>el.getClientRects().length);
    const first=buttons[0],last=buttons.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
window.matchMedia('(max-width:760px)').addEventListener('change',()=>{
  const hadNavFocus=$('sidebar').contains(document.activeElement);
  $('sidebar').classList.remove('open');$('sidebar').removeAttribute('role');$('sidebar').removeAttribute('aria-modal');
  $('main-content').inert=false;$('mobile-nav').inert=false;$('nav-scrim').hidden=true;document.body.style.overflow='';$('open-nav').setAttribute('aria-expanded','false');
  if(hadNavFocus) $('main-content').focus({preventScroll:true});
});
hydrateIcons();render();

