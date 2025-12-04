import React from 'react';
import { Home, BookOpen, Compass, Calendar } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const MosqueIcon = ({ size, strokeWidth }: { size: number, strokeWidth: number }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M12 3L4 9v12h16V9l-8-6z" />
        <path d="M8 14h8" />
        <path d="M12 9v12" />
        <path d="M10 3V1" />
        <path d="M14 3V1" />
    </svg>
);

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'الرئيسية' },
    { id: 'prayers', icon: MosqueIcon, label: 'المؤذن' },
    { id: 'quran', icon: BookOpen, label: 'المصحف' },
    { id: 'qibla', icon: Compass, label: 'القبلة' },
    { id: 'calendar', icon: Calendar, label: 'التقويم' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 pb-safe pt-3 px-4 z-50 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-md mx-auto h-16">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`flex flex-col items-center justify-center w-[18%] transition-all duration-300 group ${
                isActive ? 'text-primary-700 -translate-y-1' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary-50' : 'bg-transparent group-hover:bg-slate-50'}`}>
                {/* @ts-ignore */}
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] mt-1 font-bold ${isActive ? 'opacity-100' : 'opacity-0 h-0'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;