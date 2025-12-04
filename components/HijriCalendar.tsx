import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';

const HijriCalendar: React.FC = () => {
  // Mock calendar data
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const weekDays = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  
  return (
    <div className="pb-24 pt-8 px-6 max-w-md mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">التقويم</h2>
            <p className="text-primary-600 font-medium">ربيع الآخر 1445</p>
        </div>
        <div className="flex gap-2">
            <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50"><ChevronRight size={20} /></button>
            <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50"><ChevronLeft size={20} /></button>
        </div>
      </header>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="grid grid-cols-7 gap-2 mb-4 text-center">
            {weekDays.map(d => (
                <span key={d} className="text-xs font-bold text-slate-400">{d}</span>
            ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
            {/* Empty slots for start of month */}
            {[1, 2].map(k => <div key={`e-${k}`} />)}
            
            {days.map(day => {
                const isToday = day === 12;
                const isEvent = day === 13 || day === 14 || day === 15; // White days
                return (
                    <div key={day} className="flex flex-col items-center gap-1">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                            isToday 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}>
                            {day}
                        </div>
                        {isEvent && <div className="w-1 h-1 bg-orange-400 rounded-full"></div>}
                    </div>
                );
            })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800">مناسبات قادمة</h3>
        <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="p-3 bg-white rounded-xl text-orange-500"><CalIcon size={20} /></div>
            <div>
                <h4 className="font-bold text-slate-800 text-sm">الأيام البيض</h4>
                <p className="text-xs text-slate-500">13 - 15 ربيع الآخر</p>
            </div>
            <button className="mr-auto text-xs font-bold text-orange-600 bg-white px-3 py-1.5 rounded-lg">تذكير</button>
        </div>
      </div>
    </div>
  );
};

export default HijriCalendar;