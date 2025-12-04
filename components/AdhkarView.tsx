import React, { useState } from 'react';
import { ADHKAR_DATA } from '../constants';
import { Sun, Moon, CheckCircle2, ChevronRight } from 'lucide-react';
import { Dhikr } from '../types';

interface AdhkarViewProps {
    onBack?: () => void;
}

const AdhkarView: React.FC<AdhkarViewProps> = ({ onBack }) => {
  const [filter, setFilter] = useState<'morning' | 'evening'>('morning');
  const [counts, setCounts] = useState<{[key: string]: number}>({});

  const filteredAdhkar = ADHKAR_DATA.filter(d => d.category === filter);

  const handleTap = (dhikr: Dhikr) => {
    setCounts(prev => {
        const current = prev[dhikr.id] || 0;
        if (current >= dhikr.count) return prev;
        return { ...prev, [dhikr.id]: current + 1 };
    });
  };

  return (
    <div className="pb-24 pt-6 px-6 max-w-md mx-auto min-h-screen bg-sand-50">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-6">
            <ChevronRight size={20} /> عودة
        </button>
      )}
      
      <header className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800">الأذكار اليومية</h2>
        <div className="flex bg-slate-200 p-1 rounded-xl">
            <button 
                onClick={() => setFilter('morning')}
                className={`p-2 rounded-lg transition-all ${filter === 'morning' ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-500'}`}
            >
                <Sun size={20} />
            </button>
            <button 
                onClick={() => setFilter('evening')}
                className={`p-2 rounded-lg transition-all ${filter === 'evening' ? 'bg-white text-indigo-500 shadow-sm' : 'text-slate-500'}`}
            >
                <Moon size={20} />
            </button>
        </div>
      </header>

      <div className="space-y-4">
        {filteredAdhkar.map((item) => {
            const currentCount = counts[item.id] || 0;
            const isDone = currentCount >= item.count;
            
            return (
                <button 
                    key={item.id}
                    onClick={() => handleTap(item)}
                    disabled={isDone}
                    className={`w-full text-right p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden group ${
                        isDone 
                        ? 'bg-emerald-50 border-emerald-100 opacity-60' 
                        : 'bg-white border-slate-100 shadow-sm hover:border-primary-200 active:scale-[0.98]'
                    }`}
                >
                    {/* Progress Bar Background */}
                    <div 
                        className="absolute bottom-0 left-0 h-1 bg-primary-500 transition-all duration-300" 
                        style={{ width: `${(currentCount / item.count) * 100}%` }}
                    />

                    <p className="text-lg font-medium text-slate-800 leading-relaxed mb-4 font-serif">
                        {item.text}
                    </p>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                            {item.count} مرات
                        </span>
                        
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                            isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-primary-600'
                        }`}>
                            {isDone ? <CheckCircle2 size={20} /> : <span className="font-bold text-lg">{item.count - currentCount}</span>}
                        </div>
                    </div>
                </button>
            );
        })}
      </div>
    </div>
  );
};

export default AdhkarView;