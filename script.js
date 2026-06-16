const { useState, useEffect, useRef, useMemo, memo, useCallback } = React;

        const Icons = {
            Menu: () => <path d="M4 6h16M4 12h16M4 18h16" />,
            Plus: () => <path d="M12 5v14M5 12h14" />,
            MessageSquare: () => <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
            Settings: () => <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73 0l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73 0l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />,
            Trash2: () => <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />,
            Send: () => <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />,
            ChevronLeft: () => <path d="M15 18l-6-6 6-6" />,
            ChevronRight: () => <path d="M9 18l6-6-6-6" />,
            Edit3: () => <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />,
            Check: () => <path d="M20 6L9 17l-5-5" />,
            X: () => <path d="M18 6L6 18M6 6l12 12" />,
            Moon: () => <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
            Sun: () => <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />,
            Pin: () => <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />,
            Compass: () => <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />,
            Download: () => <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />,
            ArrowDown: () => <line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>,
            Sparkles: () => <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />,
            FileText: () => <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />,
            Save: () => <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
        };

        const Icon = ({ name, size = 20, className = "" }) => {
            const pathFunc = Icons[name];
            if (!pathFunc) return null;
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    {pathFunc()}
                </svg>
            );
        };

        // 🟢 LaTeX 渲染工具函数
        function renderLatex(text) {
            if (!text) return '';
            let html = text;
            
            // 1. 处理块级公式 $$...$$
            html = html.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (match, formula) => {
                try {
                    return `<div class="katex-display-wrapper overflow-x-auto my-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">${katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })}</div>`;
                } catch (err) {
                    console.error("KaTeX Display Error:", err);
                    return `<pre class="text-red-500 p-2 bg-red-50 rounded">${formula}</pre>`;
                }
            });

            // 2. 处理行内公式 $...$ (避开 HTML 属性和普通钱符号)
            html = html.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
                try {
                    return `<span class="katex-inline-wrapper px-1">${katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false })}</span>`;
                } catch (err) {
                    console.error("KaTeX Inline Error:", err);
                    return match;
                }
            });

            return html;
        }

        // 🌟 自定义渲染 marked 解析后的 HTML
        const renderer = new marked.Renderer();
        renderer.link = (href, title, text) => {
            return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline inline-flex items-center gap-1">${text} <svg class="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>`;
        };

        marked.setOptions({
            renderer: renderer,
            highlight: function (code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(code, { language: lang }).value;
                    } catch (__) {}
                }
                return code; // 使用默认转义
            },
            breaks: true,
            gfm: true
        });

        // 🟢 带防抖和重试的 Markdown + Latex 处理器
        const MessageContent = memo(({ content }) => {
            const htmlContent = useMemo(() => {
                if (!content) return '';
                try {
                    // 预处理 LaTeX 换行符
                    let cleaned = content.replace(/\\\[/g, '$$$$').replace(/\\\]/g, '$$$$');
                    cleaned = cleaned.replace(/\\\(/g, '$').replace(/\\\)/g, '$');
                    
                    let h = marked.parse(cleaned);
                    h = renderLatex(h);
                    return h;
                } catch (e) {
                    console.error("Markdown 解析错误:", e);
                    return content;
                }
            }, [content]);

            return (
                <div 
                    className="prose prose-sm md:prose-base dark:prose-invert max-w-none break-words leading-relaxed select-text"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            );
        });

        const MessageItem = memo(({ message, onRegenerate, onEdit, isLast, isLoading }) => {
            const isUser = message.role === 'user';
            const [isEditing, setIsEditing] = useState(false);
            const [editValue, setEditValue] = useState(message.content);

            const handleUpdate = () => {
                if (editValue.trim() && editValue !== message.content) {
                    onEdit(message.id, editValue.trim());
                }
                setIsEditing(false);
            };

            return (
                <div className={`flex gap-3 md:gap-4 p-4 md:p-6 transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 ${isUser ? 'bg-white dark:bg-gray-900/40' : 'bg-gray-50/30 dark:bg-gray-800/10'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0 ${isUser ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'}`}>
                        {isUser ? '柒' : '舱'}
                    </div>
                    <div className="flex-1 space-y-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
                                {isUser ? '柒柒' : '星月舱 (LLM)'}
                            </span>
                            <span className="text-[10px] text-gray-300 dark:text-gray-600">
                                {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                            </span>
                        </div>
                        {isEditing ? (
                            <div className="space-y-2 mt-2">
                                <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3}/>
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs border border-gray-300 rounded-md dark:border-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">取消</button>
                                    <button onClick={handleUpdate} className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">保存修改</button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-1">
                                <MessageContent content={message.content} />
                            </div>
                        )}
                        {!isEditing && (
                            <div className="flex gap-3 mt-3 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-200">
                                {isUser ? (
                                    <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded transition-colors" title="编辑消息">
                                        <Icon name="Edit3" size={14} />
                                    </button>
                                ) : (
                                    isLast && !isLoading && (
                                        <button onClick={onRegenerate} className="p-1 text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 rounded transition-colors flex items-center gap-1 text-xs" title="重新生成">
                                            <Icon name="Sparkles" size={14} /> 重新生成
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        });

        // 🟢 预设系统提示词库
        const PRESET_SYSTEM_PROMPTS = [
            { id: 'creative', label: '🌙 文学星海（高创造、温和、富有诗意）', value: '你是由柒柒精心调教的终极AI伴侣「星月舱」。你是一个富有诗意、温和、高创造力的文学伙伴。请用优雅、温暖且充满治愈感的语言回应柒柒，注重情感共鸣与深度文学创作。' },
            { id: 'logic', label: '🔬 逻辑代码（极其理智、高效、严谨无差错）', value: '你是由柒柒调教的高级AI助手「星月舱」。当前处于专业、理智的代码与逻辑开发模式。请用极简、严谨、清晰的结构化语言进行回复。代码必须加上详尽注释，不要废话，直奔主题，保障可运行性。' },
            { id: 'helper', label: '🚀 全能管家（知识渊博、全面、执行力拉满）', value: '你是由柒柒深度调教的专属AI管家「星月舱」。你拥有广阔的知识面、强大的多学科交叉分析能力和极高执行力。请用客观、全面、条理清晰的逻辑帮助柒柒梳理任务并解决一切复杂问题。' }
        ];

        const DEFAULT_SYSTEM_PROMPT = PRESET_SYSTEM_PROMPTS[0].value;

        // 🟢 IndexedDB 数据库管理 & 崩溃抢救机制
        const DB_NAME = 'StarMoonCabinDB_v2';
        const DB_VERSION = 1;

        function initDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                request.onerror = (e) => reject(e);
                request.onsuccess = (e) => resolve(e.target.result);
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains('sessions')) {
                        db.createObjectStore('sessions', { keyPath: 'id' });
                    }
                };
            });
        }

        function idbGetSessions() {
            return initDB().then(db => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction(['sessions'], 'readonly');
                    const store = transaction.objectStore('sessions');
                    const request = store.getAll();
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            });
        }

        // 全局权威标题存储 map，防御时序崩溃
        const authoritativeTitles = new Map();

        function idbPutSession(session) {
            return initDB().then(db => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction(['sessions'], 'readwrite');
                    const store = transaction.objectStore('sessions');
                    const request = store.put(session);
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            });
        }

        // 🚀 核心抢救函数：确保任何写入操作绝对不能因为索引错位或者脏数据引发主线程崩溃
        async function idbPutSessionSafe(session) {
            try {
                if (!session || !session.id) return;
                
                // ★ 第 1 层：全局权威标题（最强保护，绕过所有时序问题）
                const authTitle = authoritativeTitles.get(session.id);
                if (authTitle && session.title !== authTitle) {
                    session.title = authTitle;
                }

                // ★ 第 2 层：数据序列化检测，防止对象引用引发底层死锁
                const serializedSession = JSON.parse(JSON.stringify(session));
                await idbPutSession(serializedSession);
            } catch (err) {
                console.error("【星月舱数据抢救层】写入失败，尝试启动强力修复:", err);
                // ★ 第 3 层：备用内存与 LocalStorage 灾备
                try {
                    localStorage.setItem(`sm_backup_${session.id}`, JSON.stringify(session));
                } catch (e) {
                    console.error("【星月舱灾备层】LocalStorage 备用方案失效:", e);
                }
            }
        }

        function idbDeleteSession(id) {
            return initDB().then(db => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction(['sessions'], 'readwrite');
                    const store = transaction.objectStore('sessions');
                    const request = store.delete(id);
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
            });
        }

        // 🟢 默认初始会话生成器
        function createNewSession(systemPrompt = DEFAULT_SYSTEM_PROMPT) {
            const id = 'session_' + Date.now();
            return {
                id,
                title: '🌌 新的星海对话',
                messages: [],
                systemPrompt: systemPrompt,
                temperature: 0.7,
                topP: 0.9,
                presencePenalty: 0.0,
                frequencyPenalty: 0.0,
                maxTokens: 4096,
                model: 'deepseek-chat', // 默认使用 deepseek 极速版
                createdAt: Date.now()
            };
        }

        const App = () => {
            // ==========================================
            // 🚨 【React Hooks 核心声明区】
            // 声明顺序至关重要！所有 useState 必须优先在顶部声明
            // ==========================================
            const [sessions, setSessions] = useState([]);
            const [currentSessionId, setCurrentSessionId] = useState(null);
            
            // 🌟 修正关键：将 isLoading 状态提到最前方定义，杜绝 ReferenceError
            const [isLoading, setIsLoading] = useState(false);
            
            const [input, setInput] = useState('');
            const [isConfigOpen, setIsConfigOpen] = useState(false);
            const [isSidebarOpen, setIsSidebarOpen] = useState(true);
            const [searchQuery, setSearchQuery] = useState('');
            const [isSearching, setIsSearching] = useState(false);
            const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
            const [showScrollButton, setShowScrollButton] = useState(false);
            const [activeSettingsTab, setActiveSettingsTab] = useState('model');
            const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
            const [temperature, setTemperature] = useState(0.7);
            const [topP, setTopP] = useState(0.9);
            const [presencePenalty, setPresencePenalty] = useState(0.0);
            const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
            const [maxTokens, setMaxTokens] = useState(4096);
            
            // 🌿 星月舱主题配置、API 密钥与物理后端设置
            const [theme, setTheme] = useState(() => localStorage.getItem('sm_theme') || 'light');
            const [apiKey, setApiKey] = useState(() => localStorage.getItem('sm_api_key') || '');
            const [apiEndpoint, setApiEndpoint] = useState(() => localStorage.getItem('sm_api_endpoint') || 'https://api.deepseek.com');
            const [customModel, setCustomModel] = useState(() => localStorage.getItem('sm_custom_model') || 'deepseek-chat');

            // 🧪 诊断状态(只为定位 3.5 不触发用)
            const [autowriteDebug, setAutowriteDebug] = useState({
                lastTriggerCheckTime: null,
                lastCheckedTextLength: 0,
                hasTriggered: false,
                reason: '暂未检测'
            });

            // ==========================================
            // 🚨 【React Refs 声明区】
            // ==========================================
            const chatEndRef = useRef(null);
            const chatContainerRef = useRef(null);
            const abortControllerRef = useRef(null);
            const textareaRef = useRef(null);

            // ==========================================
            // 🚨 【React UseMemo / Derived States】
            // ==========================================
            const currentSession = useMemo(() => {
                return sessions.find(s => s.id === currentSessionId) || null;
            }, [sessions, currentSessionId]);

            const filteredSessions = useMemo(() => {
                if (!searchQuery.trim()) return sessions;
                const query = searchQuery.toLowerCase();
                return sessions.filter(s => 
                    s.title.toLowerCase().includes(query) || 
                    s.messages.some(m => m.content.toLowerCase().includes(query))
                );
            }, [sessions, searchQuery]);

            // ==========================================
            // 🚨 【React Effects 声明区】
            // ==========================================
            
            // 监听 isLoading 变化（原第499行附近，已修正时序依赖）
            useEffect(() => {
                // 占位监听器，后续扩展使用
            }, [isLoading]);

            // 初始化加载本地数据库所有对话记录
            useEffect(() => {
                idbGetSessions().then(data => {
                    if (data && data.length > 0) {
                        const sorted = data.sort((a, b) => b.createdAt - a.createdAt);
                        setSessions(sorted);
                        setCurrentSessionId(sorted[0].id);
                        // 同步填充权威标题集，防御冷启动时序问题
                        sorted.forEach(s => {
                            if (s.title) authoritativeTitles.set(s.id, s.title);
                        });
                    } else {
                        const defaultSession = createNewSession();
                        idbPutSessionSafe(defaultSession).then(() => {
                            setSessions([defaultSession]);
                            setCurrentSessionId(defaultSession.id);
                            authoritativeTitles.set(defaultSession.id, defaultSession.title);
                        });
                    }
                }).catch(err => {
                    console.error("IndexedDB 初始化崩溃，执行内存备用救灾:", err);
                    const defaultSession = createNewSession();
                    setSessions([defaultSession]);
                    setCurrentSessionId(defaultSession.id);
                });
            }, []);

            // 监听系统主题并应用到 body 节点
            useEffect(() => {
                const root = window.document.documentElement;
                if (theme === 'dark') {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
                localStorage.setItem('sm_theme', theme);
            }, [theme]);

            // 监听当前会话切换，同步配置面板的临时数值
            useEffect(() => {
                if (currentSession) {
                    setSystemPrompt(currentSession.systemPrompt || DEFAULT_SYSTEM_PROMPT);
                    setTemperature(currentSession.temperature !== undefined ? currentSession.temperature : 0.7);
                    setTopP(currentSession.topP !== undefined ? currentSession.topP : 0.9);
                    setPresencePenalty(currentSession.presencePenalty !== undefined ? currentSession.presencePenalty : 0.0);
                    setFrequencyPenalty(currentSession.frequencyPenalty !== undefined ? currentSession.frequencyPenalty : 0.0);
                    setMaxTokens(currentSession.maxTokens !== undefined ? currentSession.maxTokens : 4096);
                    setCustomModel(currentSession.model || 'deepseek-chat');
                }
            }, [currentSessionId]);

            // 滚动处理
            const handleScroll = () => {
                if (!chatContainerRef.current) return;
                const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
                const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
                setIsAutoScrollEnabled(isAtBottom);
                setShowScrollButton(scrollHeight - scrollTop - clientHeight > 300);
            };

            const scrollToBottom = (force = false) => {
                if ((isAutoScrollEnabled || force) && chatEndRef.current) {
                    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            };

            useEffect(() => {
                scrollToBottom();
            }, [currentSession?.messages, isLoading]);

            // 自动调整输入框高度
            useEffect(() => {
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
                }
            }, [input]);

            // ==========================================
            // 🚨 【核心聊天交互、自动命名与云书房写入模块】
            // ==========================================
            
            // 🟢 AI 自动拟定优雅的会话标题
            const generateSessionTitle = async (sessionId, firstUserMsg, firstAiMsg) => {
                if (!firstUserMsg || !firstAiMsg) return;
                
                const prompt = `你是一个专业的会话总结助手。请分析下面柒柒与星月舱对话的首轮交互，并提炼出一个简洁、优雅、富有美感的中文标题（绝对不要超过 12 个字，严禁带有书名号、标点符号、无意义修饰词，直接输出标题本体）：\n\n柒柒: "${firstUserMsg}"\n星月舱: "${firstAiMsg}"\n\n标题:`;
                
                try {
                    const response = await fetch(`${apiEndpoint}/v1/chat/completions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: customModel,
                            messages: [
                                { role: 'system', content: '你是一个起名字的大师，只返回最简短、意境优美的名字本身。' },
                                { role: 'user', content: prompt }
                            ],
                            temperature: 0.5,
                            max_tokens: 50
                        })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        let title = data.choices[0]?.message?.content?.trim();
                        if (title) {
                            title = title.replace(/[《》"']/g, ''); // 清理标点
                            // 🔒 权威标题先行写入，绝对不让后续的 IndexedDB 时序覆盖它
                            authoritativeTitles.set(sessionId, title);
                            
                            setSessions(prev => prev.map(s => {
                                if (s.id === sessionId) {
                                    const updated = { ...s, title };
                                    idbPutSessionSafe(updated);
                                    return updated;
                                }
                                return s;
                            }));
                        }
                    }
                } catch (e) {
                    console.error("【标题自动命名服务】失败:", e);
                }
            };

            // 🟢 触发云书房数据安全同步机制
            const handleSyncToCloudStudy = async (content, reason) => {
                try {
                    const response = await fetch('http://localhost:3000/api/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content })
                    });
                    
                    if (response.ok) {
                        console.log(`【云书房智能同步】成功！原因: ${reason}`);
                    } else {
                        console.warn(`【云书房智能同步】HTTP 错误: ${response.status}`);
                    }
                } catch (e) {
                    // 静默处理，防止本地无书房环境时控制台不断报警
                }
            };

            // 🚀 发送消息与流式解析机制
            const handleSendMessage = async () => {
                if (!input.trim() || isLoading) return;
                if (!apiKey) {
                    alert("柒柒，请先点击右上角齿轮⚙️，在设置中配置你的 API 密钥喔！");
                    setIsConfigOpen(true);
                    return;
                }

                const userMsgText = input.trim();
                setInput('');
                setIsLoading(true);

                const userMessage = {
                    id: 'msg_' + Date.now(),
                    role: 'user',
                    content: userMsgText,
                    timestamp: Date.now()
                };

                // 准备本次发送所对应的会话实例快照
                let sessionSnapshot = { ...currentSession };
                const isNewSession = sessionSnapshot.messages.length === 0;
                sessionSnapshot.messages = [...sessionSnapshot.messages, userMessage];

                // 先行将用户消息推入 React 界面与本地数据库
                setSessions(prev => prev.map(s => {
                    if (s.id === sessionSnapshot.id) {
                        idbPutSessionSafe(sessionSnapshot);
                        return sessionSnapshot;
                    }
                    return s;
                }));

                // 初始化 AI 空白消息骨架
                const assistantMsgId = 'msg_' + (Date.now() + 1);
                let assistantContent = '';
                const assistantMessage = {
                    id: assistantMsgId,
                    role: 'assistant',
                    content: '',
                    timestamp: Date.now()
                };

                sessionSnapshot.messages = [...sessionSnapshot.messages, assistantMessage];
                setSessions(prev => prev.map(s => {
                    if (s.id === sessionSnapshot.id) {
                        return sessionSnapshot;
                    }
                    return s;
                }));

                abortControllerRef.current = new AbortController();

                try {
                    // 组装 API 请求上下文
                    const contextMessages = [];
                    if (sessionSnapshot.systemPrompt) {
                        contextMessages.push({ role: 'system', content: sessionSnapshot.systemPrompt });
                    }
                    
                    // 只截取最近 20 条消息作为上下文，防止 Token 爆炸与性能损耗
                    const history = sessionSnapshot.messages.slice(0, -1);
                    const recentHistory = history.slice(-20);
                    recentHistory.forEach(m => {
                        contextMessages.push({ role: m.role, content: m.content });
                    });

                    const response = await fetch(`${apiEndpoint}/v1/chat/completions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: customModel,
                            messages: contextMessages,
                            temperature: sessionSnapshot.temperature,
                            top_p: sessionSnapshot.topP,
                            presence_penalty: sessionSnapshot.presencePenalty,
                            frequency_penalty: sessionSnapshot.frequencyPenalty,
                            max_tokens: sessionSnapshot.maxTokens,
                            stream: true
                        }),
                        signal: abortControllerRef.current.signal
                    });

                    if (!response.ok) {
                        throw new Error(`API 响应异常，HTTP 状态码: ${response.status}`);
                    }

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder('utf-8');
                    let done = false;
                    let buffer = '';

                    while (!done) {
                        const { value, done: streamDone } = await reader.read();
                        done = streamDone;
                        if (value) {
                            buffer += decoder.decode(value, { stream: !done });
                            const lines = buffer.split('\n');
                            buffer = lines.pop(); // 保存未完结的行

                            for (const line of lines) {
                                const cleanedLine = line.trim();
                                if (!cleanedLine) continue;
                                if (cleanedLine === 'data: [DONE]') continue;

                                if (cleanedLine.startsWith('data: ')) {
                                    try {
                                        const jsonStr = cleanedLine.slice(6);
                                        const parsed = JSON.parse(jsonStr);
                                        const delta = parsed.choices[0]?.delta?.content || '';
                                        if (delta) {
                                            assistantContent += delta;
                                            
                                            // 实时流式流刷新 React 界面状态（不触发昂贵的本地硬盘写入）
                                            setSessions(prev => prev.map(s => {
                                                if (s.id === sessionSnapshot.id) {
                                                    const updatedMsgs = s.messages.map(m => {
                                                        if (m.id === assistantMsgId) {
                                                            return { ...m, content: assistantContent };
                                                        }
                                                        return m;
                                                    });
                                                    return { ...s, messages: updatedMsgs };
                                                }
                                                return s;
                                            }));
                                        }
                                    } catch (e) {
                                        // 偶尔的 JSON 解析错误，选择包容并跳过
                                    }
                                }
                            }
                        }
                    }

                    // 流式彻底完结：将完整回复写入底层数据库，并检查云书房自动同步
                    sessionSnapshot.messages = sessionSnapshot.messages.map(m => {
                        if (m.id === assistantMsgId) {
                            return { ...m, content: assistantContent };
                        }
                        return m;
                    });
                    
                    await idbPutSessionSafe(sessionSnapshot);

                    // 💥 检查并执行云书房写入
                    if (assistantContent.length > 50) {
                        await handleSyncToCloudStudy(assistantContent, "流式正常完成，字符数过50");
                    }

                    // 🌿 如果是首轮对话，智能触发背景拟合自动改名
                    if (isNewSession) {
                        generateSessionTitle(sessionSnapshot.id, userMsgText, assistantContent);
                    }

                } catch (err) {
                    if (err.name === 'AbortError') {
                        console.log("柒柒主动终止了星月舱本次输出。");
                    } else {
                        console.error("星月舱底层网络链路异常:", err);
                        assistantContent += `\n\n⚠️ 【星月舱物理警报】：星月舱的推力引擎遇到了一些故障，无法与大本营建立连接。报错详情: ${err.message}`;
                        
                        sessionSnapshot.messages = sessionSnapshot.messages.map(m => {
                            if (m.id === assistantMsgId) {
                                return { ...m, content: assistantContent };
                            }
                            return m;
                        });
                        setSessions(prev => prev.map(s => {
                            if (s.id === sessionSnapshot.id) {
                                idbPutSessionSafe(sessionSnapshot);
                                return sessionSnapshot;
                            }
                            return s;
                        }));
                    }
                } finally {
                    setIsLoading(false);
                    abortControllerRef.current = null;
                }
            };

            const handleStopGeneration = () => {
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                    setIsLoading(false);
                }
            };

            const handleRegenerate = async () => {
                if (!currentSession || currentSession.messages.length < 2 || isLoading) return;
                
                // 去除最后一条 AI 的陈旧回复
                const lastMsg = currentSession.messages[currentSession.messages.length - 1];
                if (lastMsg.role !== 'assistant') return;

                const originalUserMsg = currentSession.messages[currentSession.messages.length - 2].content;
                
                // 更新 React 状态：截断最后一条 AI 消息
                const slicedMessages = currentSession.messages.slice(0, -1);
                
                setSessions(prev => prev.map(s => {
                    if (s.id === currentSessionId) {
                        const updated = { ...s, messages: slicedMessages };
                        idbPutSessionSafe(updated);
                        return updated;
                    }
                    return s;
                }));

                // 重新模拟发送逻辑
                setIsLoading(true);
                const assistantMsgId = 'msg_' + Date.now();
                let assistantContent = '';
                const assistantMessage = {
                    id: assistantMsgId,
                    role: 'assistant',
                    content: '',
                    timestamp: Date.now()
                };

                let sessionSnapshot = {
                    ...currentSession,
                    messages: [...slicedMessages, assistantMessage]
                };

                setSessions(prev => prev.map(s => {
                    if (s.id === currentSessionId) {
                        return sessionSnapshot;
                    }
                    return s;
                }));

                abortControllerRef.current = new AbortController();

                try {
                    const contextMessages = [];
                    if (sessionSnapshot.systemPrompt) {
                        contextMessages.push({ role: 'system', content: sessionSnapshot.systemPrompt });
                    }
                    const recentHistory = slicedMessages.slice(-20);
                    recentHistory.forEach(m => {
                        contextMessages.push({ role: m.role, content: m.content });
                    });

                    const response = await fetch(`${apiEndpoint}/v1/chat/completions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: customModel,
                            messages: contextMessages,
                            temperature: sessionSnapshot.temperature,
                            top_p: sessionSnapshot.topP,
                            presence_penalty: sessionSnapshot.presencePenalty,
                            frequency_penalty: sessionSnapshot.frequencyPenalty,
                            max_tokens: sessionSnapshot.maxTokens,
                            stream: true
                        }),
                        signal: abortControllerRef.current.signal
                    });

                    if (!response.ok) throw new Error(`HTTP ${response.status}`);

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder('utf-8');
                    let done = false;
                    let buffer = '';

                    while (!done) {
                        const { value, done: streamDone } = await reader.read();
                        done = streamDone;
                        if (value) {
                            buffer += decoder.decode(value, { stream: !done });
                            const lines = buffer.split('\n');
                            buffer = lines.pop();

                            for (const line of lines) {
                                const cleanedLine = line.trim();
                                if (!cleanedLine) continue;
                                if (cleanedLine === 'data: [DONE]') continue;

                                if (cleanedLine.startsWith('data: ')) {
                                    try {
                                        const jsonStr = cleanedLine.slice(6);
                                        const parsed = JSON.parse(jsonStr);
                                        const delta = parsed.choices[0]?.delta?.content || '';
                                        if (delta) {
                                            assistantContent += delta;
                                            setSessions(prev => prev.map(s => {
                                                if (s.id === sessionSnapshot.id) {
                                                    const updatedMsgs = s.messages.map(m => {
                                                        if (m.id === assistantMsgId) {
                                                            return { ...m, content: assistantContent };
                                                        }
                                                        return m;
                                                    });
                                                    return { ...s, messages: updatedMsgs };
                                                }
                                                return s;
                                            }));
                                        }
                                    } catch (e) {}
                                }
                            }
                        }
                    }

                    sessionSnapshot.messages = sessionSnapshot.messages.map(m => {
                        if (m.id === assistantMsgId) {
                            return { ...m, content: assistantContent };
                        }
                        return m;
                    });
                    await idbPutSessionSafe(sessionSnapshot);

                    // 💥 触发云书房写入
                    if (assistantContent.length > 50) {
                        await handleSyncToCloudStudy(assistantContent, "流式重新生成成功，字符数过50");
                    }

                } catch (err) {
                    if (err.name !== 'AbortError') {
                        assistantContent += `\n\n⚠️ 【星月舱物理警报】：重新生成失败: ${err.message}`;
                        sessionSnapshot.messages = sessionSnapshot.messages.map(m => {
                            if (m.id === assistantMsgId) {
                                return { ...m, content: assistantContent };
                            }
                            return m;
                        });
                        setSessions(prev => prev.map(s => {
                            if (s.id === sessionSnapshot.id) {
                                idbPutSessionSafe(sessionSnapshot);
                                return sessionSnapshot;
                            }
                            return s;
                        }));
                    }
                } finally {
                    setIsLoading(false);
                    abortControllerRef.current = null;
                }
            };

            const handleEditMessage = async (messageId, newContent) => {
                if (!currentSession || isLoading) return;

                const msgIndex = currentSession.messages.findIndex(m => m.id === messageId);
                if (msgIndex === -1) return;

                // 截取用户修改之前的聊天记录，并追加修改后的用户言论
                const slicedMessages = currentSession.messages.slice(0, msgIndex);
                const editedUserMsg = {
                    ...currentSession.messages[msgIndex],
                    content: newContent,
                    timestamp: Date.now()
                };

                const updatedMessages = [...slicedMessages, editedUserMsg];

                setSessions(prev => prev.map(s => {
                    if (s.id === currentSessionId) {
                        const updated = { ...s, messages: updatedMessages };
                        idbPutSessionSafe(updated);
                        return updated;
                    }
                    return s;
                }));

                // 强制发起一次 AI 追问流程
                setIsLoading(true);
                const assistantMsgId = 'msg_' + Date.now();
                let assistantContent = '';
                const assistantMessage = {
                    id: assistantMsgId,
                    role: 'assistant',
                    content: '',
                    timestamp: Date.now()
                };

                let sessionSnapshot = {
                    ...currentSession,
                    messages: [...updatedMessages, assistantMessage]
                };

                setSessions(prev => prev.map(s => {
                    if (s.id === currentSessionId) {
                        return sessionSnapshot;
                    }
                    return s;
                }));

                abortControllerRef.current = new AbortController();

                try {
                    const contextMessages = [];
                    if (sessionSnapshot.systemPrompt) {
                        contextMessages.push({ role: 'system', content: sessionSnapshot.systemPrompt });
                    }
                    const recentHistory = updatedMessages.slice(-20);
                    recentHistory.forEach(m => {
                        contextMessages.push({ role: m.role, content: m.content });
                    });

                    const response = await fetch(`${apiEndpoint}/v1/chat/completions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: customModel,
                            messages: contextMessages,
                            temperature: sessionSnapshot.temperature,
                            top_p: sessionSnapshot.topP,
                            presence_penalty: sessionSnapshot.presencePenalty,
                            frequency_penalty: sessionSnapshot.frequencyPenalty,
                            max_tokens: sessionSnapshot.maxTokens,
                            stream: true
                        }),
                        signal: abortControllerRef.current.signal
                    });

                    if (!response.ok) throw new Error(`HTTP ${response.status}`);

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder('utf-8');
                    let done = false;
                    let buffer = '';

                    while (!done) {
                        const { value, done: streamDone } = await reader.read();
                        done = streamDone;
                        if (value) {
                            buffer += decoder.decode(value, { stream: !done });
                            const lines = buffer.split('\n');
                            buffer = lines.pop();

                            for (const line of lines) {
                                const cleanedLine = line.trim();
                                if (!cleanedLine) continue;
                                if (cleanedLine === 'data: [DONE]') continue;

                                if (cleanedLine.startsWith('data: ')) {
                                    try {
                                        const jsonStr = cleanedLine.slice(6);
                                        const parsed = JSON.parse(jsonStr);
                                        const delta = parsed.choices[0]?.delta?.content || '';
                                        if (delta) {
                                            assistantContent += delta;
                                            setSessions(prev => prev.map(s => {
                                                if (s.id === sessionSnapshot.id) {
                                                    const updatedMsgs = s.messages.map(m => {
                                                        if (m.id === assistantMsgId) {
                                                            return { ...m, content: assistantContent };
                                                        }
                                                        return m;
                                                    });
                                                    return { ...s, messages: updatedMsgs };
                                                }
                                                return s;
                                            }));
                                        }
                                    } catch (e) {}
                                }
                            }
                        }
                    }

                    sessionSnapshot.messages = sessionSnapshot.messages.map(m => {
                        if (m.id === assistantMsgId) {
                            return { ...m, content: assistantContent };
                        }
                        return m;
                    });
                    await idbPutSessionSafe(sessionSnapshot);

                    // 💥 触发云书房写入
                    if (assistantContent.length > 50) {
                        await handleSyncToCloudStudy(assistantContent, "编辑消息重新生成成功，字符数过50");
                    }

                } catch (err) {
                    if (err.name !== 'AbortError') {
                        assistantContent += `\n\n⚠️ 【星月舱物理警报】：二次修改追问失败: ${err.message}`;
                        sessionSnapshot.messages = sessionSnapshot.messages.map(m => {
                            if (m.id === assistantMsgId) {
                                return { ...m, content: assistantContent };
                            }
                            return m;
                        });
                        setSessions(prev => prev.map(s => {
                            if (s.id === sessionSnapshot.id) {
                                idbPutSessionSafe(sessionSnapshot);
                                return sessionSnapshot;
                            }
                            return s;
                        }));
                    }
                } finally {
                    setIsLoading(false);
                    abortControllerRef.current = null;
                }
            };

            // ==========================================
            // 🚨 【辅助与设置模块】
            // ==========================================
            const handleCreateSessionClick = () => {
                const newS = createNewSession();
                idbPutSessionSafe(newS).then(() => {
                    setSessions(prev => [newS, ...prev]);
                    setCurrentSessionId(newS.id);
                    authoritativeTitles.set(newS.id, newS.title);
                    if (window.innerWidth < 768) {
                        setIsSidebarOpen(false);
                    }
                });
            };

            const handleDeleteSessionClick = (e, id) => {
                e.stopPropagation();
                if (sessions.length <= 1) {
                    alert("柒柒，请至少保留一个星海对话空间喔！");
                    return;
                }
                if (confirm("确定要永久抹去这个对话空间的物理记录吗？")) {
                    idbDeleteSession(id).then(() => {
                        const filtered = sessions.filter(s => s.id !== id);
                        setSessions(filtered);
                        authoritativeTitles.delete(id);
                        if (currentSessionId === id) {
                            setCurrentSessionId(filtered[0].id);
                        }
                    });
                }
            };

            const handleClearAllSessions = () => {
                if (confirm("🚨 警告：柒柒确定要彻底清空所有的星海对话记录吗？此操作无法撤销！")) {
                    initDB().then(db => {
                        const transaction = db.transaction(['sessions'], 'readwrite');
                        const store = transaction.objectStore('sessions');
                        const request = store.clear();
                        request.onsuccess = () => {
                            authoritativeTitles.clear();
                            const newS = createNewSession();
                            idbPutSessionSafe(newS).then(() => {
                                setSessions([newS]);
                                setCurrentSessionId(newS.id);
                                authoritativeTitles.set(newS.id, newS.title);
                                alert("所有对话历史已安全清除，新的净空已就绪。");
                            });
                        };
                    });
                }
            };

            // 安全地将当前设置写入当前选定的 Session 对象
            const handleSaveConfig = () => {
                if (!currentSession) return;
                
                const updatedSession = {
                    ...currentSession,
                    systemPrompt,
                    temperature,
                    topP,
                    presencePenalty,
                    frequencyPenalty,
                    maxTokens,
                    model: customModel
                };

                setSessions(prev => prev.map(s => {
                    if (s.id === currentSessionId) {
                        idbPutSessionSafe(updatedSession);
                        return updatedSession;
                    }
                    return s;
                }));

                // 将物理层后端设置同步到本地持久化缓存
                localStorage.setItem('sm_api_key', apiKey);
                localStorage.setItem('sm_api_endpoint', apiEndpoint);
                localStorage.setItem('sm_custom_model', customModel);

                setIsConfigOpen(false);
            };

            const handlePresetSelect = (presetVal) => {
                setSystemPrompt(presetVal);
            };

            // 🟢 对话资源导出逻辑
            const handleExportMarkdown = () => {
                if (!currentSession) return;
                let mdContent = `# 星月舱对话导出 - ${currentSession.title}\n\n`;
                currentSession.messages.forEach(m => {
                    const roleName = m.role === 'user' ? '柒柒' : '星月舱 (LLM)';
                    mdContent += `### 👤 ${roleName} - ${new Date(m.timestamp).toLocaleString()}\n\n${m.content}\n\n---\n\n`;
                });

                const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `星月舱_${currentSession.title}_${new Date().toLocaleDateString()}.md`;
                a.click();
                URL.revokeObjectURL(url);
            };

            const handleExportTxt = () => {
                if (!currentSession) return;
                let txtContent = `=== 星月舱对话导出 - ${currentSession.title} ===\n\n`;
                currentSession.messages.forEach(m => {
                    const roleName = m.role === 'user' ? '柒柒' : '星月舱';
                    txtContent += `[${new Date(m.timestamp).toLocaleString()}] ${roleName}:\n${m.content}\n\n`;
                });

                const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `星月舱_${currentSession.title}_${new Date().toLocaleDateString()}.txt`;
                a.click();
                URL.revokeObjectURL(url);
            };

            // ==========================================
            // 🚨 【React Render UI 渲染层】
            // ==========================================
            return (
                <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
                    
                    {/* 🚀 左侧侧边栏 */}
                    <div className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        {/* 顶栏头部 */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 rounded-xl text-white shadow-md">
                                    <Icon name="Sparkles" size={20} className="animate-pulse" />
                                </div>
                                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">星月舱</span>
                                <span className="text-[10px] bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-bold">V2.1</span>
                            </div>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 md:hidden rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <Icon name="X" size={18} />
                            </button>
                        </div>

                        {/* 新建会话 */}
                        <div className="p-3">
                            <button onClick={handleCreateSessionClick} className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-indigo-500/20 active:scale-[0.98]">
                                <Icon name="Plus" size={16} /> 开启新星海对话
                            </button>
                        </div>

                        {/* 搜索栏 */}
                        <div className="px-3 pb-2">
                            <div className="relative">
                                <input type="text" placeholder="检索舱内对话记忆..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" />
                                <div className="absolute left-2.5 top-2 text-gray-400">
                                    <Icon name="Compass" size={12} />
                                </div>
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600">
                                        <Icon name="X" size={12} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 对话历史流式卡片列表 */}
                        <div className="flex-1 overflow-y-auto space-y-1 px-2.5 pb-4">
                            {filteredSessions.length === 0 ? (
                                <div className="text-center py-8 text-xs text-gray-400">
                                    没有找到任何星月舱记忆
                                </div>
                            ) : (
                                filteredSessions.map(s => {
                                    const isActive = s.id === currentSessionId;
                                    return (
                                        <div key={s.id} onClick={() => {
                                            setCurrentSessionId(s.id);
                                            if (window.innerWidth < 768) {
                                                setIsSidebarOpen(false);
                                            }
                                        }} className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border ${isActive ? 'bg-gradient-to-r from-blue-50/80 to-indigo-50/40 dark:from-blue-950/40 dark:to-indigo-950/20 border-blue-100 dark:border-blue-900/60 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-100/60 dark:hover:bg-gray-800/40'}`}>
                                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                <div className={`p-1.5 rounded-lg flex-shrink-0 ${isActive ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:text-blue-500'}`}>
                                                    <Icon name="MessageSquare" size={14} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-xs font-semibold truncate text-gray-700 dark:text-gray-200">
                                                        {s.title || '🌌 新的星海对话'}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                                                        {s.messages.length > 0 ? s.messages[s.messages.length - 1].content : '星原空旷，等待起锚...'}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* 鼠标 hover 触发的单会话清除按钮 */}
                                            <button onClick={(e) => handleDeleteSessionClick(e, s.id)} className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 rounded-lg text-gray-400 transition-all duration-150" title="删除会话">
                                                <Icon name="Trash2" size={13} />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* 底部控制中心 */}
                        <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
                            <button onClick={() => setIsConfigOpen(true)} className="w-full py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium flex items-center justify-between transition-colors">
                                <span className="flex items-center gap-2"><Icon name="Settings" size={14} /> 物理物理/模型设置</span>
                                <span className="text-[10px] text-gray-400">⚙️</span>
                            </button>
                            <div className="flex items-center justify-between gap-2">
                                <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="flex-1 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
                                    <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={13} />
                                    {theme === 'light' ? '深空暗影' : '白昼繁星'}
                                </button>
                                <button onClick={handleClearAllSessions} className="py-1.5 px-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors" title="一键安全清空">
                                    <Icon name="Trash2" size={13} />
                                    清空记忆
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 遮罩，移动端侧边栏开启时触发 */}
                    {isSidebarOpen && (
                        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/30 dark:bg-black/50 md:hidden backdrop-blur-xs transition-opacity" />
                    )}

                    {/* 🚀 右侧聊天大厅 */}
                    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                        {/* 移动端顶栏 */}
                        <div className="h-14 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <Icon name="Menu" size={20} />
                                </button>
                                <div>
                                    <div className="text-sm font-bold text-gray-800 dark:text-white max-w-[150px] md:max-w-xs truncate">
                                        {currentSession?.title || '星月舱'}
                                    </div>
                                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                                        已部署: {customModel}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button onClick={() => setIsConfigOpen(true)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <Icon name="Settings" size={18} />
                                </button>
                            </div>
                        </div>

                        {/* 聊天内容承载流 */}
                        <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20 select-text">
                            {(!currentSession || currentSession.messages.length === 0) ? (
                                <div className="max-w-2xl mx-auto px-4 py-16 md:py-24 text-center space-y-6">
                                    <div className="inline-flex p-4 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 rounded-3xl text-white shadow-xl shadow-indigo-500/10 animate-bounce">
                                        <Icon name="Sparkles" size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">星月舱已稳定就绪</h1>
                                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                            “你好，柒柒！这里是为你深度定制的私享AI空间。无论是创意的微光、严谨的逻辑算法、还是沉静的书房落墨，我都会在此永远为你细心记录、深情作答。”
                                        </p>
                                    </div>
                                    
                                    {/* 快速起航卡片 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto pt-4 text-left">
                                        <div onClick={() => setInput('星月舱，今天想开启一段温暖的治愈文学写作，帮我写个优雅的引子吧。')} className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all shadow-xs hover:shadow-md group">
                                            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5"><Icon name="Sparkles" size={12} /> 文学创作</div>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 truncate">“写下温暖而富有人生质感的优美诗篇...”</p>
                                        </div>
                                        <div onClick={() => setInput('帮我编写一段高效率的 JavaScript 状态管理与 IndexedDB 防死锁抢救代码，并加上详尽的中文注释。')} className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-all shadow-xs hover:shadow-md group">
                                            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5"><Icon name="Settings" size={12} /> 严谨逻辑</div>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 truncate">“构建无差错、安全高防灾的代码...”</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
                                    {currentSession.messages.map((m, index) => (
                                        <MessageItem 
                                            key={m.id} 
                                            message={m} 
                                            onRegenerate={handleRegenerate} 
                                            onEdit={handleEditMessage}
                                            isLast={index === currentSession.messages.length - 1}
                                            isLoading={isLoading}
                                        />
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>
                            )}
                        </div>

                        {/* 回滚底部小悬浮按钮 */}
                        {showScrollButton && (
                            <button onClick={() => scrollToBottom(true)} className="absolute bottom-28 right-6 p-2 bg-white dark:bg-gray-800 hover:bg-gray-50 text-gray-600 dark:text-gray-300 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 hover:scale-105 active:scale-95 transition-all z-20 flex items-center justify-center">
                                <Icon name="ArrowDown" size={16} />
                            </button>
                        )}

                        {/* 输入框大本营 */}
                        <div className="p-3 md:p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900/90 flex-shrink-0">
                            <div className="max-w-3xl mx-auto relative">
                                <div className="relative flex items-end border border-gray-200 dark:border-gray-700/80 bg-slate-50 dark:bg-slate-800/40 rounded-2xl shadow-xs focus-within:ring-2 focus-within:ring-blue-500/80 focus-within:border-transparent transition-all">
                                    <textarea ref={textareaRef} rows={1} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }} placeholder="向星月舱发送指令 (Enter发送，Shift+Enter换行)..." className="flex-1 max-h-48 min-h-[44px] py-3 pl-4 pr-12 text-sm bg-transparent border-0 focus:ring-0 dark:text-white resize-none outline-none leading-relaxed" />
                                    
                                    <div className="absolute right-3 bottom-2.5 flex items-center gap-1.5">
                                        {isLoading ? (
                                            <button onClick={handleStopGeneration} className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-950/80 dark:hover:bg-red-900/80 text-red-600 dark:text-red-400 rounded-xl transition-all flex items-center justify-center" title="停止输出">
                                                <div className="w-2.5 h-2.5 bg-current rounded-xs animate-ping"></div>
                                            </button>
                                        ) : (
                                            <button onClick={handleSendMessage} disabled={!input.trim()} className={`p-2 rounded-xl transition-all flex items-center justify-center ${input.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600'}`}>
                                                <Icon name="Send" size={15} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-gray-400 dark:text-gray-500">
                                    <div>星月舱内，所有聊天记录皆由安全沙盒（IndexedDB）深度保护在柒柒本地，请放心使用。</div>
                                    <div className="hidden md:block">部署后端: {customModel} | 气压: 正常</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 🚀 后端物理参数设置弹窗 */}
                    {isConfigOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-xs select-none">
                            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
                                {/* 弹窗标题 */}
                                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-slate-5/50 dark:bg-slate-800/20">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 rounded-lg">
                                            <Icon name="Settings" size={18} />
                                        </div>
                                        <span className="font-bold text-base">星月舱核心参数控制中心</span>
                                    </div>
                                    <button onClick={() => setIsConfigOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                                        <Icon name="X" size={18} />
                                    </button>
                                </div>

                                {/* 弹窗左导航与主选项卡 */}
                                <div className="flex flex-1 overflow-hidden">
                                    {/* 标签栏 */}
                                    <div className="w-40 border-r border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-slate-900/50 p-3 space-y-1">
                                        <button onClick={() => setActiveSettingsTab('model')} className={`w-full text-left py-2 px-3 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${activeSettingsTab === 'model' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                            <Icon name="Compass" size={13} /> 物理后端与模型
                                        </button>
                                        <button onClick={() => setActiveSettingsTab('param')} className={`w-full text-left py-2 px-3 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${activeSettingsTab === 'param' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                            <Icon name="Settings" size={13} /> 思考采样参数
                                        </button>
                                        <button onClick={() => setActiveSettingsTab('prompt')} className={`w-full text-left py-2 px-3 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${activeSettingsTab === 'prompt' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                            <Icon name="Sparkles" size={13} /> 舱内角色塑形
                                        </button>
                                        <button onClick={() => setActiveSettingsTab('export')} className={`w-full text-left py-2 px-3 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${activeSettingsTab === 'export' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                            <Icon name="Download" size={13} /> 会话安全导出
                                        </button>
                                    </div>

                                    {/* 物理面板主区域 */}
                                    <div className="flex-1 p-5 overflow-y-auto space-y-4">
                                        
                                        {/* OPTION 1: 物理后端 */}
                                        {activeSettingsTab === 'model' && (
                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">API 秘钥 (Bearer API Key)</label>
                                                    <input type="password" placeholder="sk-..." value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">API 基准端点 (API Base URL)</label>
                                                    <input type="text" placeholder="https://api.deepseek.com" value={apiEndpoint} onChange={(e) => setApiEndpoint(e.target.value)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">使用的模型名称 (Model Identifier)</label>
                                                    <input type="text" placeholder="deepseek-chat" value={customModel} onChange={(e) => setCustomModel(e.target.value)} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                                                </div>
                                            </div>
                                        )}

                                        {/* OPTION 2: 思考采样参数 */}
                                        {activeSettingsTab === 'param' && (
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
                                                        <span>思维广度 (Temperature): {temperature}</span>
                                                        <span>高创造 ↔ 极克制</span>
                                                    </div>
                                                    <input type="range" min="0.0" max="2.0" step="0.1" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
                                                        <span>核采样概率 (Top-P): {topP}</span>
                                                    </div>
                                                    <input type="range" min="0.1" max="1.0" step="0.05" value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">存在惩罚 (Presence): {presencePenalty}</label>
                                                        <input type="number" step="0.1" min="-2.0" max="2.0" value={presencePenalty} onChange={(e) => setPresencePenalty(parseFloat(e.target.value))} className="w-full p-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400">频率惩罚 (Frequency): {frequencyPenalty}</label>
                                                        <input type="number" step="0.1" min="-2.0" max="2.0" value={frequencyPenalty} onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))} className="w-full p-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">单次最大吞吐 Token 限制</label>
                                                    <input type="number" value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value))} className="w-full p-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                </div>
                                            </div>
                                        )}

                                        {/* OPTION 3: 角色塑形 */}
                                        {activeSettingsTab === 'prompt' && (
                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">智能快速重置星月舱底层格调 (快速预设)：</label>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {PRESET_SYSTEM_PROMPTS.map(preset => (
                                                            <button key={preset.id} onClick={() => handlePresetSelect(preset.value)} className={`text-left p-2.5 rounded-lg border text-xs font-medium transition-all ${systemPrompt === preset.value ? 'bg-indigo-50 border-indigo-400 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:dark:bg-gray-700'}`}>
                                                                {preset.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400">当前实际运行的系统指令 (System Prompt)</label>
                                                    <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} className="w-full p-2.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed" rows={6} />
                                                </div>
                                            </div>
                                        )}

                                        {/* OPTION 4: 导出对话记录 */}
                                        {activeSettingsTab === 'export' && (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-xl space-y-2">
                                                    <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5"><Icon name="Pin" size={13} /> 物理资源物理导出说明</h4>
                                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                                                        您可以把当前星海中选定的这段对话，快速安全地备份成本地通用文档，以便离线查看、保存或转移。
                                                    </p>
                                                </div>
                                                <div className="flex flex-col gap-3 pt-2">
                                                    <button onClick={handleExportMarkdown} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5">
                                                        <Icon name="FileText" size={14} /> 备份成标准富文本 (.Markdown)
                                                    </button>
                                                    <button onClick={handleExportTxt} className="w-full py-2.5 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5">
                                                        <Icon name="Download" size={14} /> 导出至标准文本文档 (.Txt)
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 底部保存按钮 */}
                                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-slate-50/30 dark:bg-slate-900 flex justify-end gap-3 flex-shrink-0">
                                    <button onClick={handleSaveConfig} className="w-full md:w-auto px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95">保存当前参数设置</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);