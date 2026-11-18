(function () {
    const { useState } = React;
    const { toLocalDateKey, buildMonthDays } = window.XingyueHealth;

    const HealthCalendar = ({ records, anniversaries, onSave, Icon }) => {
        const [currentMonth, setCurrentMonth] = useState(new Date());
        const [editingDate, setEditingDate] = useState(null);
        const [editValue, setEditValue] = useState('');
        const [editAnniversary, setEditAnniversary] = useState('');

        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const today = toLocalDateKey(new Date());
        const days = buildMonthDays(year, month);
        const fullDate = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const openEditor = (date) => {
            setEditingDate(date);
            setEditValue(records[date] || '');
            setEditAnniversary(anniversaries?.[date.slice(5)] || '');
        };

        const save = () => {
            onSave({ date: editingDate, status: editValue, anniversary: editAnniversary });
            setEditingDate(null);
        };

        return (
            <div className="flex flex-col h-full bg-white">
                <div className="flex justify-between mb-4 px-2 items-center">
                    <h3 className="font-bold flex items-center gap-2 text-gray-800"><Icon name="Heart" size={18} className="text-pink-500 fill-pink-500"/> 星月日历</h3>
                    <div className="flex gap-2 items-center text-sm">
                        <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-1 hover:bg-gray-100 rounded-full" title="上个月"><Icon name="ChevronLeft" size={16}/></button>
                        <span className="font-medium">{year}年 {month + 1}月</span>
                        <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-1 hover:bg-gray-100 rounded-full" title="下个月"><Icon name="ChevronRight" size={16}/></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 text-center text-[10px] text-gray-400 font-bold mb-2">
                    {['日', '一', '二', '三', '四', '五', '六'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                        if (!day) return <div key={`empty-${index}`}></div>;
                        const date = fullDate(day);
                        const record = records[date];
                        const anniversary = anniversaries?.[date.slice(5)];
                        const isToday = date === today;
                        return (
                            <button type="button" key={date} onClick={() => openEditor(date)} aria-label={`${date}${record ? `，${record}` : ''}`} className={`h-12 border rounded-lg p-1 cursor-pointer hover:border-blue-300 relative text-left ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}>
                                <span className={`text-[10px] ${isToday ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>{day}</span>
                                {anniversary && <span className="absolute top-0.5 right-0.5 text-[8px] text-pink-500 font-bold max-w-[90%] truncate">✨{anniversary}</span>}
                                {record && <span title={record} className="block mt-1 text-[8px] bg-purple-50 text-purple-600 truncate border border-purple-100 rounded px-0.5">{record}</span>}
                                {record && <span className="calendar-dot"></span>}
                            </button>
                        );
                    })}
                </div>
                {editingDate && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[70] p-4 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white w-full max-w-xs rounded-xl p-5 shadow-2xl animate-scale-in">
                            <div className="text-sm font-bold mb-3 text-gray-800">{editingDate} 专属标记</div>
                            <label className="block text-[10px] text-gray-500 mb-1 font-medium">每年重复的纪念日/生日</label>
                            <input className="w-full bg-pink-50 border border-pink-100 rounded-lg p-2 text-xs focus:outline-none focus:border-pink-300 mb-3 text-pink-600 font-medium placeholder:text-pink-300" value={editAnniversary} onChange={event => setEditAnniversary(event.target.value)} placeholder="比如：相识纪念日、家人的生日..." />
                            <label className="block text-[10px] text-gray-500 mb-1 font-medium">当天的身体状态</label>
                            <textarea autoFocus className="w-full h-20 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:border-blue-400 resize-none" value={editValue} onChange={event => setEditValue(event.target.value)} placeholder="身体哪里不舒服嘛？或已康复？"></textarea>
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => setEditingDate(null)} className="flex-1 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">取消</button>
                                <button onClick={save} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">保存</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    window.XingyueHealthUI = { HealthCalendar };
})();
