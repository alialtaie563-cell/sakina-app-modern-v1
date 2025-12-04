import React from 'react';
import { FAJR_NOTIFICATIONS, ASR_NOTIFICATIONS, MIDDAY_MOTIVATION, SLEEP_TRANQUILITY } from '../constants';
import { Bell, Moon, Sun, Briefcase, Zap } from 'lucide-react';

const NotificationCenter: React.FC = () => {
  const sections = [
    { title: 'إعادة ضبط البوصلة (فجر)', data: FAJR_NOTIFICATIONS.slice(0, 3), icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50' },
    { title: 'التحفيز العميق (ظهر)', data: MIDDAY_MOTIVATION.slice(0, 3), icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { title: 'استراحة العقل (عصر)', data: ASR_NOTIFICATIONS.slice(0, 3), icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'الهدوء قبل النوم', data: SLEEP_TRANQUILITY.slice(0, 3), icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="pb-24 pt-8 px-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">الإشعارات الذكية</h2>
      <p className="text-slate-500 mb-8 text-sm">نماذج حية من محرك التخصيص السياقي.</p>
      
      <div className="space-y-8">
        {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
            <div key={idx}>
                <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-lg ${section.bg}`}>
                        <Icon size={16} className={section.color} />
                    </div>
                    <h3 className="font-bold text-slate-700 text-sm">{section.title}</h3>
                </div>
                <div className="space-y-3">
                {section.data.map((note) => (
                    <div key={note.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                        <div>
                            <p className="text-slate-800 font-medium leading-relaxed">{note.content}</p>
                            {note.tag && (
                                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                                    {note.tag}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                </div>
            </div>
            )
        })}
      </div>
    </div>
  );
};

export default NotificationCenter;