import React, { useState, useRef } from 'react';
import { QURAN_DATA } from '../constants';
import { Play, Pause, Heart, Share2 } from 'lucide-react';
import { QuranSegment } from '../types';
import { RECITERS, getAudioUrl } from '../utils/api';

const QuranPlayer: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Default Reciter for Thematic View (Mishary)
  const defaultReciter = RECITERS[0];

  const handlePlay = async (surahId: string, segmentId: string) => {
    if(!audioRef.current) return;

    if (activeSegment === segmentId) {
        // Toggle Pause
        audioRef.current.pause();
        setActiveSegment(null);
    } else {
        // Start New
        const surahNumber = parseInt(surahId);
        const url = getAudioUrl(defaultReciter, surahNumber);
        
        audioRef.current.src = url;
        audioRef.current.load();
        
        setActiveSegment(segmentId);
        
        try {
            await audioRef.current.play();
        } catch (e) {
            console.error("Playback failed", e);
            setActiveSegment(null);
        }
    }
  };

  return (
    <div className="pb-24 pt-8 px-6 max-w-md mx-auto">
      <audio ref={audioRef} className="hidden" onEnded={() => setActiveSegment(null)} onError={() => setActiveSegment(null)} />
      
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">الورد الموضوعي</h2>
        <p className="text-slate-500 mt-1">تلاوة موجهة حسب حالتك الشعورية.</p>
      </header>

      <div className="space-y-8">
        {QURAN_DATA.map((surah) => (
          <div key={surah.id}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-primary-900">{surah.name}</h3>
                <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                    {surah.segments.length} مقاطع
                </span>
            </div>
            
            <div className="grid gap-4">
              {surah.segments.map((segment: QuranSegment) => {
                const isPlaying = activeSegment === segment.id;
                return (
                  <div
                    key={segment.id}
                    className={`relative overflow-hidden rounded-3xl transition-all duration-300 border ${
                      isPlaying 
                        ? 'bg-primary-900 text-white shadow-lg border-transparent' 
                        : 'bg-white text-slate-800 shadow-sm border-slate-100 hover:border-primary-200'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            isPlaying ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {segment.moodTag}
                        </span>
                        <span className={`text-xs ${isPlaying ? 'text-primary-200' : 'text-slate-400'}`}>
                            {segment.range}
                        </span>
                      </div>
                      
                      <p className={`text-sm font-medium leading-relaxed mb-6 ${
                          isPlaying ? 'text-primary-100' : 'text-slate-600'
                      }`}>
                        "{segment.motivationalText}"
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <button
                          onClick={() => handlePlay(surah.id, segment.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                            isPlaying 
                                ? 'bg-white text-primary-900' 
                                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                          }`}
                        >
                          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                          <span className="text-sm font-bold">{isPlaying ? 'إيقاف' : 'استماع'}</span>
                        </button>
                        
                        <div className="flex gap-3">
                            <button className={`${isPlaying ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                                <Heart size={20} />
                            </button>
                            <button className={`${isPlaying ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                                <Share2 size={20} />
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuranPlayer;