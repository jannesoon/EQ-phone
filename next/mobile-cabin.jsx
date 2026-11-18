(function initXingyueMobileCabin(global) {
    'use strict';

    // This candidate is intentionally a sibling overlay for the host App. The host keeps
    // its existing children mounted and decides how to reveal them through onViewChange.
    const ReactRef = global.React;
    if (!ReactRef) return;

    const {
        Fragment,
        useCallback,
        useEffect,
        useMemo,
        useState
    } = ReactRef;

    const noop = () => {};
    const VALID_VIEWS = ['home', 'chat', 'life', 'library', 'profile'];
    const PERSONA_IMAGES = {
        human: 'assets/ethan-human.png',
        wolf: 'assets/ethan-wolf.png'
    };

    const NAV_ITEMS = [
        { id: 'home', label: '首页', icon: 'home' },
        { id: 'chat', label: '聊天', icon: 'message' },
        { id: 'life', label: '生活', icon: 'heart' },
        { id: 'library', label: '云书房', icon: 'book' },
        { id: 'profile', label: '我的', icon: 'user' }
    ];

    const SHORTCUTS = [
        { action: 'chat', label: '继续聊天', hint: '回到当前会话', icon: 'message', targetView: 'chat' },
        { action: 'diary', label: '星月日记', hint: '快速记一笔', icon: 'pen' },
        { action: 'memory', label: '我们的回忆', hint: '查看已保存内容', icon: 'memory' },
        { action: 'health', label: '健康日历', hint: '记录身体状态', icon: 'calendar' },
        { action: 'drawing', label: '图片创作', hint: '进入创作入口', icon: 'palette' },
        { action: 'settings', label: '更多工具', hint: '设置与设备', icon: 'settings' }
    ];

    const ICON_PATHS = {
        home: 'M3 10.8 12 3l9 7.8V21a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-10.2Z',
        message: 'M4 5.5A3.5 3.5 0 0 1 7.5 2h9A3.5 3.5 0 0 1 20 5.5v6A3.5 3.5 0 0 1 16.5 15H11l-5.4 4.1c-.65.5-1.6.04-1.6-.78V15.3A3.5 3.5 0 0 1 4 12V5.5Z',
        heart: 'm12 20.4-1.2-1.1C5.1 14.1 2 11.3 2 7.8 2 5 4.2 3 7 3c1.6 0 3.2.75 4.2 1.95A5.55 5.55 0 0 1 15.5 3C18.3 3 20.5 5 20.5 7.8c0 3.5-3.1 6.3-8.8 11.5L12 20.4Z',
        book: 'M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17Z M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M8 6h8 M8 9h8',
        user: 'M12 12a4.25 4.25 0 1 0 0-8.5A4.25 4.25 0 0 0 12 12Zm-8 9a8 8 0 0 1 16 0H4Z',
        moon: 'M20.5 14.3A8.9 8.9 0 0 1 9.7 3.5 9.5 9.5 0 1 0 20.5 14.3Z',
        sparkles: 'm12 2 1.15 4.4L17.5 8l-4.35 1.6L12 14l-1.15-4.4L6.5 8l4.35-1.6L12 2Zm7 10 .65 2.35L22 15l-2.35.65L19 18l-.65-2.35L16 15l2.35-.65L19 12ZM5 15l.65 2.35L8 18l-2.35.65L5 21l-.65-2.35L2 18l2.35-.65L5 15Z',
        pen: 'm14.4 4.1 5.5 5.5M4 20l4.6-1 10.7-10.7a2.12 2.12 0 0 0-3-3L6.6 16 4 20Z',
        memory: 'M5 5.5A2.5 2.5 0 0 1 7.5 3H19a2 2 0 0 1 2 2v12.5A2.5 2.5 0 0 1 18.5 20H7a3 3 0 0 1-3-3V6.5A1 1 0 0 1 5 5.5Zm0 0H18M8 8h9M8 12h6',
        calendar: 'M5 4h14a2 2 0 0 1 2 2v13H3V6a2 2 0 0 1 2-2Zm-2 5h18M8 2v4M16 2v4M8 13h3M8 16h6',
        palette: 'M12 3a9 9 0 0 0 0 18h1.4c1.1 0 1.7-1.3.95-2.1l-.35-.35c-.75-.8-.18-2.1.92-2.1H16a5 5 0 0 0 5-5A8.5 8.5 0 0 0 12 3Z M7.2 10.5h.01M9.2 7.5h.01M14 7.2h.01M17 10.2h.01',
        settings: 'M12 8.7A3.3 3.3 0 1 0 12 15.3 3.3 3.3 0 0 0 12 8.7Zm0-6.2 1.15 2.3 2.55.57 2.1-1.45 1.55 1.55-1.45 2.1.57 2.55 2.3 1.15v2.2l-2.3 1.15-.57 2.55 1.45 2.1-1.55 1.55-2.1-1.45-2.55.57L12 21.5l-2.2-1.15-1.15-2.3-2.55-.57L4 18.93l-1.55-1.55 1.45-2.1-.57-2.55L1 11.58v-2.2l2.3-1.15.57-2.55-1.45-2.1L3.97 2.03l2.1 1.45 2.55-.57L9.8 2.5H12Z',
        mic: 'M12 15.2a3.4 3.4 0 0 0 3.4-3.4V6.4a3.4 3.4 0 0 0-6.8 0v5.4a3.4 3.4 0 0 0 3.4 3.4Zm-6-3.4a6 6 0 0 0 12 0M12 17.8V22M8.5 22h7',
        devices: 'M4 5.5A2.5 2.5 0 0 1 6.5 3h7A2.5 2.5 0 0 1 16 5.5v9a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 4 14.5v-9ZM19 8h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-6M8 14h4',
        backup: 'M12 3v11m0 0 4-4m-4 4-4-4M4 17v3h16v-3',
        vault: 'M5 4h14a2 2 0 0 1 2 2v13H3V6a2 2 0 0 1 2-2Zm0 0V2h14v2M8 8h8M8 12h5',
        arrow: 'M5 12h13m-5-5 5 5-5 5',
        chevron: 'm8 10 4 4 4-4',
        plus: 'M12 5v14M5 12h14',
        activity: 'm3 12 4-4 3 7 4-10 3 7h4',
        lock: 'M6 10h12v10H6V10Zm3 0V7a3 3 0 0 1 6 0v3',
        cloud: 'M7 18a4 4 0 1 1 1.2-7.8A5.5 5.5 0 0 1 19 12a3 3 0 0 1-.5 6H7Z',
        close: 'm6 6 12 12M18 6 6 18',
        info: 'M12 11v5m0-9h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
    };

    const Glyph = ({ name, size = 20, strokeWidth = 1.8, className = '' }) => {
        const path = ICON_PATHS[name] || ICON_PATHS.sparkles;
        return (
            <svg
                className={`mc-glyph ${className}`}
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
            >
                <path d={path} />
            </svg>
        );
    };

    function normalizeView(value, fallback = 'home') {
        return VALID_VIEWS.indexOf(value) >= 0 ? value : fallback;
    }

    function getAgentState(value) {
        let raw = '';
        let label = '';
        let connected = null;
        if (typeof value === 'string') {
            raw = value.trim().toLowerCase();
        } else if (value && typeof value === 'object') {
            raw = String(value.status || value.state || value.connection || '').trim().toLowerCase();
            label = String(value.label || value.statusLabel || '').trim();
            if (typeof value.connected === 'boolean') connected = value.connected;
        }
        if (connected === true || ['connected', 'online', 'ready', 'active', 'streaming'].indexOf(raw) >= 0) {
            return { tone: 'online', label: label || '已连接' };
        }
        if (['connecting', 'pending', 'loading', 'starting'].indexOf(raw) >= 0) {
            return { tone: 'pending', label: label || '连接中' };
        }
        if (connected === false || ['offline', 'disconnected', 'unavailable', 'error', 'failed'].indexOf(raw) >= 0) {
            return { tone: 'offline', label: label || '未连接' };
        }
        return { tone: 'unknown', label: label || '连接状态未知' };
    }

    function getGreeting(hour) {
        if (hour < 5) return '夜深了';
        if (hour < 11) return '早上好';
        if (hour < 14) return '午间好';
        if (hour < 19) return '下午好';
        return '晚上好';
    }

    function formatToday() {
        try {
            return new Intl.DateTimeFormat('zh-CN', {
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            }).format(new Date());
        } catch (_) {
            return '';
        }
    }

    const StatusPill = ({ agent }) => (
        <span className={`mc-status mc-status--${agent.tone}`}>
            <span className="mc-status__dot" aria-hidden="true" />
            <span>{agent.label}</span>
        </span>
    );

    const MoonArt = ({ wolf = false }) => (
        <div className={`mc-moon-art ${wolf ? 'is-wolf' : ''}`} aria-hidden="true">
            <span className="mc-moon-art__halo" />
            <span className="mc-moon-art__moon" />
            <span className="mc-moon-art__star mc-moon-art__star--one" />
            <span className="mc-moon-art__star mc-moon-art__star--two" />
            <span className="mc-moon-art__star mc-moon-art__star--three" />
            <span className="mc-moon-art__hill mc-moon-art__hill--back" />
            <span className="mc-moon-art__hill mc-moon-art__hill--front" />
        </div>
    );

    const SectionHeading = ({ eyebrow, title, action, onAction, id }) => (
        <div className="mc-section-heading">
            <div>
                {eyebrow && <p className="mc-eyebrow">{eyebrow}</p>}
                <h2 id={id}>{title}</h2>
            </div>
            {action && (
                <button className="mc-text-action" type="button" onClick={onAction}>
                    {action}
                    <Glyph name="arrow" size={16} />
                </button>
            )}
        </div>
    );

    const EmptyState = ({ icon = 'sparkles', title, text, action, onAction }) => (
        <div className="mc-empty-state">
            <span className="mc-empty-state__icon"><Glyph name={icon} size={20} /></span>
            <div>
                <h3>{title}</h3>
                {text && <p>{text}</p>}
            </div>
            {action && (
                <button className="mc-small-button" type="button" onClick={onAction}>
                    {action}
                </button>
            )}
        </div>
    );

    function HomeView({
        agent,
        imageSource,
        imageFailed,
        onImageError,
        persona,
        userName,
        today,
        onAction,
        onViewChange,
        onPersonaChange
    }) {
        const hour = new Date().getHours();
        return (
            <div className="mc-page mc-page--home">
                <header className="mc-topbar">
                    <div className="mc-brand-lockup">
                        <span className="mc-brand-mark"><Glyph name="moon" size={20} /></span>
                        <div>
                            <p className="mc-brand-kicker">XINGYUE CABIN</p>
                            <h1>星月舱</h1>
                        </div>
                    </div>
                    <StatusPill agent={agent} />
                </header>

                <section className={`mc-hero-card mc-hero-card--poster ${persona === 'wolf' ? 'is-wolf' : 'is-human'}`} aria-labelledby="mc-home-greeting">
                    <div className="mc-hero-card__visual">
                        {imageSource && !imageFailed ? (
                            <img src={imageSource} alt={persona === 'wolf' ? '小狼崽主题图' : '逸辰主题图'} onError={onImageError} />
                        ) : (
                            <MoonArt wolf={persona === 'wolf'} />
                        )}
                    </div>
                    <div className="mc-hero-card__body">
                        <div className="mc-hero-card__copy">
                            <p className="mc-eyebrow">{today}</p>
                            <h2 id="mc-home-greeting">{getGreeting(hour)}，{userName}</h2>
                            <p>今天过得怎么样？想和我聊聊吗？</p>
                        </div>
                        <div className="mc-hero-card__actions">
                            <button className="mc-primary-button" type="button" onClick={() => onViewChange('chat')}>
                                <Glyph name="message" size={18} />
                                继续聊天
                                <Glyph name="arrow" size={17} />
                            </button>
                            <div className="mc-hero-card__theme" role="group" aria-label="陪伴主题">
                                <span className="mc-hero-card__theme-label">陪伴主题</span>
                                <div className="mc-persona-switch">
                                    <button
                                        className={persona === 'human' ? 'is-selected' : ''}
                                        type="button"
                                        aria-pressed={persona === 'human'}
                                        onClick={() => onPersonaChange('human')}
                                    >
                                        <span className="mc-persona-switch__orb mc-persona-switch__orb--human" aria-hidden="true" />
                                        <span>真人逸辰</span>
                                    </button>
                                    <button
                                        className={persona === 'wolf' ? 'is-selected' : ''}
                                        type="button"
                                        aria-pressed={persona === 'wolf'}
                                        onClick={() => onPersonaChange('wolf')}
                                    >
                                        <span className="mc-persona-switch__orb mc-persona-switch__orb--wolf" aria-hidden="true" />
                                        <span>小狼崽</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mc-section" aria-labelledby="mc-shortcut-title">
                    <SectionHeading id="mc-shortcut-title" eyebrow="QUICK ACCESS" title="常用入口" />
                    <div className="mc-shortcut-grid">
                        {SHORTCUTS.map(item => (
                            <button
                                className="mc-shortcut-card"
                                key={item.action}
                                type="button"
                                onClick={() => {
                                    if (item.targetView) {
                                        onViewChange(item.targetView);
                                    } else {
                                        onAction(item.action);
                                    }
                                }}
                            >
                                <span className="mc-shortcut-card__icon"><Glyph name={item.icon} size={20} /></span>
                                <span className="mc-shortcut-card__label">{item.label}</span>
                                <span className="mc-shortcut-card__hint">{item.hint}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="mc-section mc-section--stacked" aria-labelledby="mc-today-title">
                    <SectionHeading id="mc-today-title" eyebrow="TODAY" title="今日" />
                    <div className="mc-info-card">
                        <div className="mc-info-card__heading"><Glyph name="pen" size={17} /><h3>今日小记</h3></div>
                        <EmptyState
                            icon="pen"
                            title="尚未读取记录"
                            text="写下此刻的心情，完成后会显示在这里。"
                            action="记一笔"
                            onAction={() => onAction('diary')}
                        />
                    </div>
                    <div className="mc-info-card">
                        <div className="mc-info-card__heading"><Glyph name="calendar" size={17} /><h3>今日安排</h3></div>
                        <EmptyState
                            icon="calendar"
                            title="尚未读取记录"
                            text="稍后从生活页查看今天的安排。"
                            action="看生活"
                            onAction={() => onViewChange('life')}
                        />
                    </div>
                </section>
            </div>
        );
    }

    function LifeView({ today, onAction }) {
        return (
            <div className="mc-page">
                <header className="mc-page-header">
                    <div>
                        <p className="mc-eyebrow">LIFE SPACE</p>
                        <h1>生活</h1>
                        <p>{today}</p>
                    </div>
                    <span className="mc-page-header__icon"><Glyph name="heart" size={24} /></span>
                </header>
                <section className="mc-feature-card mc-feature-card--health">
                    <div className="mc-feature-card__icon"><Glyph name="activity" size={24} /></div>
                    <div>
                        <p className="mc-eyebrow">HEALTH CALENDAR</p>
                        <h2>健康日历</h2>
                        <p>从今天开始，照顾好自己的节奏。</p>
                    </div>
                    <button className="mc-icon-button" type="button" aria-label="打开健康日历" onClick={() => onAction('health')}>
                        <Glyph name="arrow" size={18} />
                    </button>
                </section>
                <div className="mc-two-column">
                    <button className="mc-tile" type="button" onClick={() => onAction('diary')}>
                        <span className="mc-tile__icon"><Glyph name="pen" size={21} /></span>
                        <strong>星月日记</strong>
                        <span>记录当下</span>
                    </button>
                    <button className="mc-tile" type="button" onClick={() => onAction('drawing')}>
                        <span className="mc-tile__icon"><Glyph name="palette" size={21} /></span>
                        <strong>图片创作</strong>
                        <span>探索灵感</span>
                    </button>
                </div>
                <section className="mc-section mc-section--stacked">
                    <SectionHeading eyebrow="YOUR RECORDS" title="近期生活" />
                    <div className="mc-info-card">
                        <EmptyState
                            icon="calendar"
                            title="尚未读取记录"
                            text="日记、健康和日程会在这里汇总。"
                        />
                    </div>
                </section>
            </div>
        );
    }

    function LibraryView({ libraryContent, onAction }) {
        const hasContent = libraryContent !== null && libraryContent !== undefined && libraryContent !== '';
        const libraryTools = [
            { action: 'diary', icon: 'pen', label: '星月日记' },
            { action: 'memory', icon: 'memory', label: '记忆与回忆' },
            { action: 'medical', icon: 'heart', label: '辰医生病案室' },
            { action: 'prayer', icon: 'sparkles', label: '祷告与心愿' },
            { action: 'board', icon: 'message', label: '留言与工作日志' },
            { action: 'trash', icon: 'vault', label: '回收站' }
        ];
        return (
            <div className="mc-page">
                <header className="mc-page-header">
                    <div>
                        <p className="mc-eyebrow">CLOUD LIBRARY</p>
                        <h1>云书房</h1>
                        <p>把喜欢的内容，安静地收进这一处。</p>
                    </div>
                    <span className="mc-page-header__icon"><Glyph name="book" size={24} /></span>
                </header>
                <section className="mc-library-banner">
                    <span className="mc-library-banner__icon"><Glyph name="cloud" size={24} /></span>
                    <div>
                        <h2>云书房管理</h2>
                        <p>书架、文章和附件都在这里相遇。</p>
                    </div>
                </section>
                {hasContent ? (
                    <section className="mc-library-content" aria-label="云书房内容">
                        {libraryContent}
                    </section>
                ) : (
                    <section className="mc-info-card mc-info-card--library">
                        <EmptyState
                            icon="book"
                            title="书架内容尚未读取"
                            text="连接后，你的书架、文章和附件会显示在这里。"
                        />
                    </section>
                )}
                <section className="mc-section mc-section--stacked">
                    <SectionHeading eyebrow="LIBRARY TOOLS" title="相关入口" />
                    <div className={`mc-list-card ${hasContent ? '' : 'is-muted'}`}>
                        {libraryTools.map(item => hasContent ? (
                            <button key={item.action} type="button" onClick={() => onAction(item.action)}><Glyph name={item.icon} size={19} /><span>{item.label}</span><Glyph name="chevron" size={18} /></button>
                        ) : (
                            <div key={item.action} className="mc-list-row mc-list-row--disabled" aria-disabled="true"><Glyph name={item.icon} size={19} /><span>{item.label}</span><span className="mc-list-row__status">待接入</span></div>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    function ProfileView({ agent, persona, onAction, onPersonaChange }) {
        return (
            <div className="mc-page">
                <header className="mc-page-header">
                    <div>
                        <p className="mc-eyebrow">PERSONAL SPACE</p>
                        <h1>我的</h1>
                        <p>设置、设备与云端</p>
                    </div>
                    <span className="mc-page-header__icon"><Glyph name="user" size={24} /></span>
                </header>
                <section className="mc-profile-card">
                    <div className="mc-profile-card__avatar"><Glyph name={persona === 'wolf' ? 'sparkles' : 'user'} size={26} /></div>
                    <div>
                        <p className="mc-eyebrow">CURRENT THEME</p>
                        <h2>{persona === 'wolf' ? '小狼崽主题' : '真人逸辰主题'}</h2>
                        <p>展示主题可随时切换，聊天与记录不会清空。</p>
                    </div>
                    <StatusPill agent={agent} />
                </section>
                <section className="mc-theme-card">
                    <div>
                        <h2>陪伴主题</h2>
                        <p>换一种颜色，陪你走过今天。</p>
                    </div>
                    <div className="mc-theme-card__actions">
                        <button type="button" className={persona === 'human' ? 'is-selected' : ''} aria-pressed={persona === 'human'} onClick={() => onPersonaChange('human')}>真人逸辰</button>
                        <button type="button" className={persona === 'wolf' ? 'is-selected' : ''} aria-pressed={persona === 'wolf'} onClick={() => onPersonaChange('wolf')}>小狼崽</button>
                    </div>
                </section>
                <section className="mc-section mc-section--stacked">
                    <SectionHeading eyebrow="SETTINGS" title="设置与连接" />
                    <div className="mc-list-card mc-list-card--large">
                        <button type="button" onClick={() => onAction('settings')}><Glyph name="settings" size={20} /><span><strong>通用设置</strong><small>外观与使用偏好</small></span><Glyph name="chevron" size={18} /></button>
                        <button type="button" onClick={() => onAction('voice')}><Glyph name="mic" size={20} /><span><strong>语音设置</strong><small>选择喜欢的声音</small></span><Glyph name="chevron" size={18} /></button>
                        <button type="button" onClick={() => onAction('devices')}><Glyph name="devices" size={20} /><span><strong>设备连接</strong><small>查看设备状态</small></span><Glyph name="chevron" size={18} /></button>
                        <button type="button" onClick={() => onAction('backup')}><Glyph name="backup" size={20} /><span><strong>备份与恢复</strong><small>守好你的资料</small></span><Glyph name="chevron" size={18} /></button>
                        <button type="button" onClick={() => onAction('vault')}><Glyph name="vault" size={20} /><span><strong>云书房</strong><small>前往云书房</small></span><Glyph name="chevron" size={18} /></button>
                    </div>
                </section>
            </div>
        );
    }

    function ChatPassThrough() {
        return <div className="mc-chat-pass-through" aria-hidden="true" />;
    }

    function MobileCabin({
        // The host App owns the original children. Keeping this prop in the contract makes
        // the component safe to use in a normal React tree without wrapping or unmounting it.
        children: _children,
        agentStatus,
        avatarUrl = '',
        userName = '柒柒',
        onAction = noop,
        enabled = true,
        libraryContent = null,
        view,
        mobileView,
        initialView = 'home',
        onViewChange = noop
    }) {
        // Deliberately do not render _children: the parent renders the existing App content
        // as a sibling and uses onViewChange to control visibility. This preserves chat state.
        void _children;

        const controlledView = view !== undefined ? view : mobileView;
        const [internalView, setInternalView] = useState(() => normalizeView(initialView));
        const [persona, setPersona] = useState('human');
        const [failedImages, setFailedImages] = useState({});
        const activeView = normalizeView(controlledView, internalView);
        const [libraryVisited, setLibraryVisited] = useState(activeView === 'library');
        useEffect(() => { if (activeView === 'library') setLibraryVisited(true); }, [activeView]);
        const agent = useMemo(() => getAgentState(agentStatus), [agentStatus]);
        const today = useMemo(() => formatToday(), []);
        const isEnabled = enabled !== false;
        const customHumanAvatar = typeof avatarUrl === 'string' ? avatarUrl.trim() : '';
        const preferredImage = persona === 'wolf'
            ? PERSONA_IMAGES.wolf
            : (customHumanAvatar || PERSONA_IMAGES.human);
        const imageSource = persona === 'human' && customHumanAvatar && failedImages[customHumanAvatar]
            ? PERSONA_IMAGES.human
            : preferredImage;
        const imageFailed = Boolean(failedImages[imageSource]);

        useEffect(() => {
            setFailedImages({});
        }, [avatarUrl]);

        const markImageFailed = useCallback(source => {
            if (!source) return;
            setFailedImages(previous => previous[source] ? previous : { ...previous, [source]: true });
        }, []);

        const dispatchAction = useCallback(action => {
            if (typeof onAction === 'function') onAction(action);
        }, [onAction]);

        const changeView = useCallback(nextView => {
            const next = normalizeView(nextView, activeView);
            if (controlledView === undefined) setInternalView(next);
            if (typeof onViewChange === 'function') onViewChange(next);
        }, [activeView, controlledView, onViewChange]);

        const setTheme = useCallback(nextPersona => {
            setPersona(nextPersona === 'wolf' ? 'wolf' : 'human');
        }, []);

        const screenClass = `mc-screen mc-screen--${activeView} ${persona === 'wolf' ? 'is-wolf' : 'is-human'}`;

        return (
            <Fragment>
                {isEnabled && (
                    <div
                        className="xingyue-mobile-cabin"
                        data-enabled="true"
                        data-mobile-view={activeView}
                        data-persona={persona}
                        aria-label="星月舱手机版"
                    >
                        <main className={`${screenClass} ${activeView === 'library' && libraryContent ? 'mc-screen--embedded' : ''}`}>
                            {activeView === 'home' && (
                                <HomeView
                                    agent={agent}
                                    imageSource={imageSource}
                                    imageFailed={imageFailed}
                                    onImageError={() => markImageFailed(imageSource)}
                                    persona={persona}
                                    userName={userName}
                                    today={today}
                                    onAction={dispatchAction}
                                    onViewChange={changeView}
                                    onPersonaChange={setTheme}
                                />
                            )}
                            {activeView === 'chat' && <ChatPassThrough />}
                            {activeView === 'life' && <LifeView today={today} onAction={dispatchAction} />}
                            {libraryContent && (libraryVisited || activeView === 'library') && <section className="mc-library-persistent" hidden={activeView !== 'library'}>{libraryContent}</section>}
                            {activeView === 'library' && !libraryContent && <LibraryView libraryContent={null} onAction={dispatchAction} />}
                            {activeView === 'profile' && (
                                <ProfileView
                                    agent={agent}
                                    persona={persona}
                                    onAction={dispatchAction}
                                    onPersonaChange={setTheme}
                                />
                            )}
                        </main>
                        <nav className="mc-nav" aria-label="星月舱主导航">
                            {NAV_ITEMS.map(item => (
                                <button
                                    className={`mc-nav__item ${activeView === item.id ? 'is-active' : ''}`}
                                    key={item.id}
                                    type="button"
                                    aria-current={activeView === item.id ? 'page' : undefined}
                                    onClick={() => changeView(item.id)}
                                >
                                    <Glyph name={item.icon} size={21} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                )}
            </Fragment>
        );
    }

    global.XingyueMobileCabin = { MobileCabin };
})(typeof window !== 'undefined' ? window : globalThis);
