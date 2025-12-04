import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause, Bell, BellOff, MapPin, Check, AlertCircle } from 'lucide-react';
import { UserLocation, AdhanSettings, PrayerTime } from '../types';
import { fetchPrayerTimesByCoords, formatTime12H, ADHAN_URLS, toArabicNumerals } from '../utils/api';

interface PrayersViewProps {
    location: UserLocation;
}

const PrayersView: React.FC<PrayersViewProps> = ({ location }) => {
    const [settings, setSettings] = useState<AdhanSettings>({
        voice: 'makkah',
        enabledPrayers: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true }
    });
    const [prayers, setPrayers] = useState<PrayerTime[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const loadPrayers = async () => {
            const data = await fetchPrayerTimesByCoords(location.lat, location.lng);
            if (data) {
                const t = data.timings;
                setPrayers([
                    { name: 'الفجر', time: formatTime12H(t.Fajr.split(' ')[0]), isNext: false },
                    { name: 'الظهر', time: formatTime12H(t.Dhuhr.split(' ')[0]), isNext: false },
                    { name: 'العصر', time: formatTime12H(t.Asr.split(' ')[0]), isNext: false },
                    { name: 'المغرب', time: formatTime12H(t.Maghrib.split(' ')[0]), isNext: false },
                    { name: 'العشاء', time: formatTime12H(t.Isha.split(' ')[0]), isNext: false },
                ]);
            }
        };
        loadPrayers();
    }, [location]);

    const togglePrayer = (key: keyof AdhanSettings['enabledPrayers']) => {
        setSettings(prev => ({
            ...prev,
            enabledPrayers: { ...prev.enabledPrayers, [key]: !prev.enabledPrayers[key] }
        }));
    };

    const handlePlayTest = () => {
        if (!audioRef.current) return;
        setAudioError(null);
        
        if (isPlaying) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        } else {
            // Force reload to ensure new source is picked up
            try {
                audioRef.current.src = ADHAN_URLS[settings.voice];
                audioRef.current.load();
                
                const playPromise = audioRef.current.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => setIsPlaying(true))
                        .catch(() => {
                            // Removed console logging of error object to prevent circular JSON errors
                            setIsPlaying(false);
                            setAudioError("تعذر تشغيل الصوت. يرجى التحقق من الاتصال.");
                        });
                }
            } catch (err) {
                 setIsPlaying(false);
                 setAudioError("خطأ غير متوقع أثناء تشغيل الصوت.");
            }
        }
    };

    const voices = [
        { id: 'makkah', label: 'الحرم المكي' },
        { id: 'madinah', label: 'الحرم النبوي' },
        { id: 'aqsa', label: 'المسجد الأقصى' },
        { id: 'egypt', label: 'الأذان المصري' },
    ];

    const prayerKeys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    return (
        <div className="pb-24 pt-8 px-6 max-w-md mx-auto">
            <header className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 font-quran mb-2">المؤذن والتنبيهات</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 w-fit px-3 py-1 rounded-full">
                    <MapPin size={14} />
                    <span>توقيت: {location.cityName}</span>
                </div>
            </header>

            {/* Voice Selector */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Volume2 size={18} className="text-primary-600" />
                    صوت المؤذن
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {voices.map(v => (
                        <button
                            key={v.id}
                            onClick={() => {
                                setIsPlaying(false);
                                setSettings(prev => ({ ...prev, voice: v.id as any }));
                            }}
                            className={`p-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-between ${
                                settings.voice === v.id 
                                ? 'bg-primary-50 border-primary-500 text-primary-700' 
                                : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {v.label}
                            {settings.voice === v.id && <Check size={16} />}
                        </button>
                    ))}
                </div>
                
                {audioError && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle size={14} />
                        {audioError}
                    </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                    <button 
                        onClick={handlePlayTest}
                        className="flex items-center gap-2 text-primary-600 font-bold bg-primary-50 px-6 py-2 rounded-full hover:bg-primary-100 transition-colors"
                    >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                        <span>{isPlaying ? 'إيقاف الصوت' : 'تجربة الصوت'}</span>
                    </button>
                    {/* Add key to force re-render/reload when voice changes */}
                    <audio 
                        key={settings.voice}
                        ref={audioRef} 
                        className="hidden" 
                        onEnded={() => setIsPlaying(false)}
                        onError={() => {
                            // Removed console logging to prevent circular JSON errors
                            setIsPlaying(false);
                            setAudioError("حدث خطأ أثناء تحميل الملف الصوتي.");
                        }}
                    />
                </div>
            </div>

            {/* Prayers List */}
            <div className="space-y-3">
                <h3 className="font-bold text-slate-800 mb-2">تنبيهات الصلوات</h3>
                {prayers.map((prayer, idx) => {
                    const key = prayerKeys[idx] as keyof AdhanSettings['enabledPrayers'];
                    const isEnabled = settings.enabledPrayers[key];
                    
                    return (
                        <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isEnabled ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <span className="font-bold text-sm">{toArabicNumerals(idx + 1)}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{prayer.name}</h4>
                                    <p className="text-xs text-slate-500 dir-ltr text-right">{prayer.time}</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => togglePrayer(key)}
                                className={`w-12 h-8 rounded-full flex items-center transition-colors px-1 ${isEnabled ? 'bg-primary-500 justify-end' : 'bg-slate-200 justify-start'}`}
                            >
                                <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                                    {isEnabled ? <Bell size={12} className="text-primary-600" /> : <BellOff size={12} className="text-slate-400" />}
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PrayersView;