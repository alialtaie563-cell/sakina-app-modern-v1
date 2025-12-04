import React from 'react';
import { Check, Plus } from 'lucide-react';
import { UI_COPY } from '../constants';

const HabitTracker: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">إيقاعك اليومي</h3>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div
              key={day}
              className={`w-2 h-8 rounded-full ${
                day <= 5 ? 'bg-primary-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {UI_COPY.trackHabitButtons.map((text, idx) => (
          <button
            key={idx}
            className="w-full group relative flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-primary-50 transition-all duration-300 border border-slate-100 hover:border-primary-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary-600 group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <span className="font-medium text-slate-700 group-hover:text-primary-800">
                {text}
              </span>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-primary-400 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HabitTracker;