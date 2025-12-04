import React, { useEffect, useState } from 'react';
import { UI_COPY } from '../constants';
import HabitTracker from './HabitTracker';
import PrayerStrip from './PrayerStrip';
import { Activity, ArrowUpRight, Calendar as CalendarIcon, MapPin, Wind, Droplets, CloudSun, Sun, CloudRain, CloudLightning, CloudFog, Search, X, Navigation as NavIcon, BellRing, BarChart3, WifiOff } from 'lucide-react';
import { ViewState, UserLocation, PrayerTime } from '../types';
import { fetchWeather, getWeatherDescription, searchCities, fetchCityName, fetchPrayerTimesByCoords, formatTime12H, toArabicNumerals } from '../utils/api';

interface DashboardProps {
    setView?: (view: ViewState, params?: any) => void;
    location: UserLocation;
    setLocation: (loc: UserLocation) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView, location, setLocation }) => {
  const [weather, setWeather] = useState<any>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // Logic to determine time of day for greeting
  const hour = new Date().getHours();
  let greeting = UI_COPY.dashboardTitles.morning;
  if (hour >= 12 && hour < 17) greeting = UI_COPY.dashboardTitles.afternoon;
  if (hour >= 17) greeting = UI_COPY.dashboardTitles.evening;

  // Formatting dates
  const date = new Date();
  const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
  
  const gregorianDate = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date);

  useEffect(() => {
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
      }
  }, []);

  // Fetch weather and prayers whenever location changes
  useEffect(() => {
    const loadData = async () => {
        // Weather
        const weatherData = await fetchWeather(location.lat, location.lng);
        setWeather(weatherData);

        // Next Prayer Logic
        const prayerData = await fetchPrayerTimesByCoords(location.lat, location.lng);
        if (prayerData) {
            const timings = prayerData.timings;
            const nowHour = new Date().getHours();
            let nextP = null;
            if (nowHour < 5) nextP = { name: 'الفجر', time: formatTime12H(timings.Fajr.split(' ')[0]) };
            else if (nowHour < 12) nextP = { name: 'الظهر', time: formatTime12H(timings.Dhuhr.split(' ')[0]) };
            else if (nowHour < 15) nextP = { name: 'العصر', time: formatTime12H(timings.Asr.split(' ')[0]) };
            else if (nowHour < 18) nextP = { name: 'المغرب', time: formatTime12H(timings.Maghrib.split(' ')[0]) };
            else if (nowHour < 20) nextP = { name: 'العشاء', time: formatTime12H(timings.Isha.split(' ')[0]) };
            else nextP = { name: 'الفجر', time: formatTime12H(timings.Fajr.split(' ')[0]) };
            
            // @ts-ignore
            setNextPrayer(nextP);
        }
    };
    loadData();
  }, [location]);

  // Handle Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
        if (searchQuery.length > 1) {
            setIsSearching(true);
            const results = await searchCities(searchQuery);
            setSearchResults(results);
            setIsSearching(false);
        } else {
            setSearchResults([]);
        }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleCitySelect = (city: any) => {
      setLocation({
          lat: city.lat,
          lng: city.lng,
          cityName: city.name,
          isAuto: false
      });
      setShowSearch(false);
      setSearchQuery('');
  };

  const handleUseCurrentLocation = () => {
      if ("geolocation" in navigator) {
          setIsSearching(true);
          navigator.geolocation.getCurrentPosition(async (position) => {
              const { latitude, longitude } = position.coords;
              const cityName = await fetchCityName(latitude, longitude);
              setLocation({
                  lat: latitude,
                  lng: longitude,
                  cityName: cityName,
                  isAuto: true
              });
              setShowSearch(false);
              setIsSearching(false);
          }, (err) => {
              console.error(err);
              setIsSearching(false);
          }, { enableHighAccuracy: true });
      }
  };

  const WeatherIcon = ({ code }: { code: number }) => {
      const { icon } = getWeatherDescription(code);
      if (icon === 'Sun') return <Sun className="text-orange-400" size={32} />;
      if (icon === 'CloudRain') return <CloudRain className="text-blue-400" size={32} />;
      if (icon === 'CloudLightning') return <CloudLightning className="text-purple-400" size={32} />;
      return <CloudSun className="text-yellow-500" size={32} />;
  };

  return (
    <div className="pb-24 pt-8 px-6 max-w-md mx-auto relative">
      
      {/* City Search Modal */}
      {showSearch && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSearch(false)}></div>
              <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in slide-in-from-bottom-4">
                  <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                      <Search className="text-slate-400" size={20} />
                      <input 
                        type="text" 
                        placeholder="ابحث عن مدينة (مثلاً: مكة المكرمة)" 
                        className="flex-1 outline-none text-slate-800 font-bold"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button onClick={() => setShowSearch(false)}><X className="text-slate-400" size={20} /></button>
                  </div>
                  
                  <div className="max-h-[60vh] overflow-y-auto">
                      <button 
                        onClick={handleUseCurrentLocation}
                        className="w-full text-right px-4 py-3 text-sm font-bold text-primary-600 hover:bg-primary-50 flex items-center gap-2 border-b border-slate-50"
                      >
                          <NavIcon size={16} />
                          استخدام موقعي الحالي
                      </button>

                      {isSearching ? (
                          <div className="p-4 text-center text-slate-400 text-sm">جاري البحث...</div>
                      ) : (
                          searchResults.map((city, idx) => (
                              <button 
                                key={idx}
                                onClick={() => handleCitySelect(city)}
                                className="w-full text-right px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors"
                              >
                                  <div className="font-bold text-slate-800">{city.name}</div>
                                  <div className="text-xs text-slate-400">{city.country}</div>
                              </button>
                          ))
                      )}
                      
                      {searchResults.length === 0 && searchQuery.length > 1 && !isSearching && (
                          <div className="p-8 text-center text-slate-400 text-sm">
                              لا توجد نتائج مطابقة
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <header className="mb-6 flex justify-between items-start">
        <div>
            <h1 className="text-2xl font-extrabold text-slate-800 leading-tight mb-2 font-quran">
            {greeting}
            </h1>
            <div className="flex flex-col gap-1">
                <p className="text-primary-700 font-bold flex items-center gap-2 text-sm font-sans">
                    <CalendarIcon size={14} />
                    {hijriDate}
                </p>
                <div className="flex items-center gap-2">
                    <p className="text-slate-400 text-xs font-medium font-sans">
                        {gregorianDate}
                    </p>
                    {isOffline && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                            <WifiOff size={10} />
                            وضع عدم الاتصال
                        </span>
                    )}
                </div>
            </div>
        </div>
        <div className="flex flex-col items-end gap-2">
             <button 
                onClick={() => setShowSearch(true)}
                className="bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm px-3 py-1.5 rounded-full flex items-center gap-2 hover:bg-white transition-colors"
             >
                 <MapPin size={14} className={location.isAuto ? "text-primary-500" : "text-orange-500"} />
                 <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">{location.cityName}</span>
             </button>
             
             {/* Prayer Alert Button (Requested Position) */}
             {nextPrayer && (
                 <button 
                    onClick={() => setView && setView('prayers')}
                    className="flex items-center gap-2 bg-primary-600 text-white px-3 py-1.5 rounded-full shadow-lg shadow-primary-500/30 animate-in fade-in zoom-in duration-300"
                 >
                     <BellRing size={14} className="animate-pulse" />
                     <span className="text-[10px] font-bold">{nextPrayer.name} {nextPrayer.time}</span>
                 </button>
             )}
        </div>
      </header>

      {/* Weather Widget */}
      {weather && weather.current && (
        <div className="bg-gradient-to-r from-sky-100 to-blue-50 rounded-3xl p-5 mb-6 shadow-sm border border-sky-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <WeatherIcon code={weather.current.weather_code} />
                <div>
                    <div className="text-3xl font-bold text-slate-800 font-sans">{toArabicNumerals(Math.round(weather.current.temperature_2m))}°</div>
                    <div className="text-xs text-slate-500 font-bold">{getWeatherDescription(weather.current.weather_code).text}</div>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex flex-col items-center">
                    <Wind size={14} className="text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-600">{toArabicNumerals(weather.current.wind_speed_10m)} <span className="text-[9px]">كم/س</span></span>
                </div>
                <div className="flex flex-col items-center">
                    <Droplets size={14} className="text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-600">{toArabicNumerals(weather.current.relative_humidity_2m)}%</span>
                </div>
            </div>
        </div>
      )}

      {/* Prayer Times Strip - Clean scroll */}
      <PrayerStrip location={location} />

      {/* Weekly Summary Card (Redesigned) */}
      <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 mb-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-primary-50 rounded-br-full -z-0 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-50 rounded-tl-full -z-0 opacity-50"></div>
        
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary-100 text-primary-600 rounded-2xl">
              <BarChart3 size={22} />
            </div>
            <div>
                 <h3 className="font-bold text-slate-800 text-lg leading-tight">إحصائياتك الروحية</h3>
                 <span className="text-xs text-slate-500">هذا الأسبوع</span>
            </div>
          </div>
          
          <p className="text-slate-600 text-sm leading-relaxed font-medium mt-1">
             {UI_COPY.weeklySummary.good}
          </p>
        </div>

        {/* Visual Stats Graph */}
        <div className="flex items-end gap-3 h-20 mb-4 mt-6 px-1">
           {[45, 60, 35, 75, 50, 95, 70].map((h, i) => (
               <div key={i} className="flex-1 flex flex-col justify-end gap-1 group relative">
                   <div 
                    className={`w-full rounded-t-lg transition-all duration-700 ease-out ${i === 5 ? 'bg-primary-500' : 'bg-slate-100 group-hover:bg-primary-200'}`} 
                    style={{ height: `${h}%` }} 
                   ></div>
               </div>
           ))}
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 text-slate-700 font-bold text-sm hover:bg-slate-100 hover:text-primary-700 transition-all border border-slate-100 group">
          <span>عرض التقرير الكامل</span>
          <ArrowUpRight size={16} className="group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-transform" />
        </button>
      </div>

      <HabitTracker />

      {/* Quick Access / Suggestions */}
      <div className="grid grid-cols-2 gap-4">
        <div 
            onClick={() => setView && setView('quran', { surahId: 18 })} // Deep link to Kahf
            className="bg-sand-100 p-5 rounded-3xl border border-sand-200 cursor-pointer hover:bg-sand-200 transition-colors relative overflow-hidden"
        >
             <div className="absolute -left-4 -bottom-4 text-sand-300 opacity-20 transform rotate-12">
                 <span className="text-8xl font-quran">۞</span>
             </div>
            <span className="block text-2xl mb-2 relative z-10">📖</span>
            <h4 className="font-bold text-slate-800 mb-1 relative z-10 font-quran">سورة الكهف</h4>
            <p className="text-xs text-slate-500 relative z-10">نور ما بين الجمعتين</p>
        </div>
        <div 
            onClick={() => setView && setView('adhkar')}
            className="bg-slate-50 p-5 rounded-3xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
        >
            <span className="block text-2xl mb-2">📿</span>
            <h4 className="font-bold text-slate-800 mb-1 font-quran">أذكار اليوم</h4>
            <p className="text-xs text-slate-500">حصن نفسك</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;