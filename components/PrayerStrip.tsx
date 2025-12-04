import React, { useEffect, useState } from 'react';
import { Sun, Moon, Sunrise, Sunset, CloudSun } from 'lucide-react';
import { PrayerTime, UserLocation } from '../types';
import { fetchPrayerTimesByCoords, formatTime12H } from '../utils/api';

interface PrayerStripProps {
    location: UserLocation;
}

const PrayerStrip: React.FC<PrayerStripProps> = ({ location }) => {
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrayers = async () => {
        setLoading(true);
        const data = await fetchPrayerTimesByCoords(location.lat, location.lng);
        if (data) {
             const timings = data.timings;
             // API returns HH:MM string, formatTime12H converts it
             const newPrayers: PrayerTime[] = [
                { name: 'الفجر', time: formatTime12H(timings.Fajr.split(' ')[0]), isNext: false, icon: Sunrise },
                { name: 'الظهر', time: formatTime12H(timings.Dhuhr.split(' ')[0]), isNext: false, icon: Sun },
                { name: 'العصر', time: formatTime12H(timings.Asr.split(' ')[0]), isNext: false, icon: CloudSun },
                { name: 'المغرب', time: formatTime12H(timings.Maghrib.split(' ')[0]), isNext: false, icon: Sunset },
                { name: 'العشاء', time: formatTime12H(timings.Isha.split(' ')[0]), isNext: false, icon: Moon },
             ];
             
             // Highlighting logic (Simplified for demo)
             const now = new Date();
             const currentHour = now.getHours();
             if (currentHour < 5) newPrayers[0].isNext = true;
             else if (currentHour < 12) newPrayers[1].isNext = true;
             else if (currentHour < 15) newPrayers[2].isNext = true;
             else if (currentHour < 18) newPrayers[3].isNext = true;
             else if (currentHour < 20) newPrayers[4].isNext = true;
             else newPrayers[0].isNext = true;

             setPrayers(newPrayers);
        }
        setLoading(false);
    };

    loadPrayers();
  }, [location]);

  if (loading) return <div className="h-28 bg-slate-50 rounded-2xl animate-pulse mb-6"></div>;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-lg font-bold text-slate-800 font-quran">مواقيت الصلاة</h3>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{location.cityName}</span>
      </div>
      
      {/* Scrollable container with hidden scrollbar for clean look */}
      <div className="flex justify-between gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {prayers.map((prayer, idx) => {
          const Icon = prayer.icon;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center min-w-[70px] p-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                prayer.isNext
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                  : 'bg-white text-slate-500 border border-slate-100'
              }`}
            >
              {prayer.isNext && <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent"></div>}
              <span className="text-[10px] font-medium opacity-80 mb-1">{prayer.name}</span>
              <Icon size={20} className={`mb-1 ${prayer.isNext ? 'text-white' : 'text-slate-400'}`} />
              <span className="text-xs font-bold dir-ltr whitespace-nowrap">{prayer.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrayerStrip;