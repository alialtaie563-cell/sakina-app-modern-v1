import React, { useState, useEffect } from 'react';
import QuranPlayer from './QuranPlayer';
import QuranFull from './QuranFull';
import { AudioState, AudioTrack } from '../types';

interface QuranWrapperProps {
    initialSurahId?: number;
    initialMode?: 'reading' | 'audio';
    globalAudioState?: AudioState;
    onPlayTrack?: (track: AudioTrack) => void;
}

const QuranWrapper: React.FC<QuranWrapperProps> = ({ initialSurahId, initialMode, globalAudioState, onPlayTrack }) => {
  const [view, setView] = useState<'thematic' | 'full'>('full');
  const [params, setParams] = useState({ surahId: initialSurahId, mode: initialMode });

  useEffect(() => {
      if (initialSurahId) {
          setView('full');
          setParams({ surahId: initialSurahId, mode: initialMode });
      }
      if (initialMode === 'audio') {
          setView('full'); // We handle audio list in Full view now
      }
  }, [initialSurahId, initialMode]);

  return (
    <div>
        <div className="flex justify-center pt-6 px-6 max-w-md mx-auto mb-2">
            <div className="bg-slate-200/50 p-1 rounded-2xl flex w-full backdrop-blur-md">
                <button 
                    onClick={() => setView('full')} 
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${view === 'full' ? 'bg-white shadow-md text-slate-800 scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    المصحف الكامل
                </button>
                <button 
                    onClick={() => setView('thematic')} 
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${view === 'thematic' ? 'bg-white shadow-md text-slate-800 scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    الورد الموضوعي
                </button>
            </div>
        </div>
        {view === 'full' ? (
            <QuranFull 
                initialSurahId={params.surahId} 
                initialMode={params.mode} 
                globalAudioState={globalAudioState}
                onPlayTrack={onPlayTrack}
            />
        ) : (
            <QuranPlayer />
        )}
    </div>
  );
};

export default QuranWrapper;