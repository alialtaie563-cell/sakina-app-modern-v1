import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import QuranWrapper from './components/QuranWrapper';
import QiblaCompass from './components/QiblaCompass';
import HijriCalendar from './components/HijriCalendar';
import AdhkarView from './components/AdhkarView';
import PrayersView from './components/PrayersView';
import Navigation from './components/Navigation';
import MiniPlayer from './components/MiniPlayer';
import { ViewState, UserLocation, AudioTrack, AudioState } from './types';
import { fetchCityName } from './utils/api';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [navParams, setNavParams] = useState<any>({});
  
  // --- Global Audio State ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioState, setAudioState] = useState<AudioState>({
      isPlaying: false,
      currentTrack: null,
      progress: 0,
      duration: 0,
      currentTime: 0
  });

  const playTrack = (track: AudioTrack) => {
      if (!audioRef.current) return;
      
      // If clicking same track, toggle play
      if (audioState.currentTrack?.url === track.url) {
          if (audioState.isPlaying) {
              audioRef.current.pause();
          } else {
              audioRef.current.play();
          }
          return;
      }

      // New Track
      audioRef.current.src = track.url;
      audioRef.current.load();
      audioRef.current.play().catch(e => console.error("Playback error", e));
      
      setAudioState(prev => ({
          ...prev,
          currentTrack: track,
          isPlaying: true,
          progress: 0
      }));
  };

  const togglePlay = () => {
      if (!audioRef.current) return;
      if (audioState.isPlaying) {
          audioRef.current.pause();
      } else {
          audioRef.current.play();
      }
  };

  const closePlayer = () => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
      }
      setAudioState(prev => ({ ...prev, currentTrack: null, isPlaying: false, progress: 0 }));
  };

  // Audio Event Listeners
  useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const onTimeUpdate = () => {
          const progress = (audio.currentTime / audio.duration) * 100 || 0;
          setAudioState(prev => ({
              ...prev,
              currentTime: audio.currentTime,
              duration: audio.duration,
              progress
          }));
      };

      const onPlay = () => setAudioState(prev => ({ ...prev, isPlaying: true }));
      const onPause = () => setAudioState(prev => ({ ...prev, isPlaying: false }));
      const onEnded = () => setAudioState(prev => ({ ...prev, isPlaying: false, progress: 100 }));

      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);
      audio.addEventListener('ended', onEnded);

      return () => {
          audio.removeEventListener('timeupdate', onTimeUpdate);
          audio.removeEventListener('play', onPlay);
          audio.removeEventListener('pause', onPause);
          audio.removeEventListener('ended', onEnded);
      };
  }, []);

  // --- Location State ---
  const [location, setLocation] = useState<UserLocation>({
      lat: 21.4225, // Default Makkah
      lng: 39.8262,
      cityName: 'مكة المكرمة',
      isAuto: true
  });

  useEffect(() => {
    // Initial Geolocation
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const city = await fetchCityName(latitude, longitude);
            setLocation({
                lat: latitude,
                lng: longitude,
                cityName: city,
                isAuto: true
            });
        }, (err) => {
            console.log("Geolocation denied, using default");
        });
    }
  }, []);

  const handleViewChange = (view: ViewState, params?: any) => {
      setCurrentView(view);
      if (params) setNavParams(params);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setView={handleViewChange} location={location} setLocation={setLocation} />;
      case 'quran':
        return <QuranWrapper 
            initialSurahId={navParams.surahId} 
            initialMode={navParams.mode}
            globalAudioState={audioState}
            onPlayTrack={playTrack}
        />;
      case 'qibla':
        return <QiblaCompass location={location} />;
      case 'prayers':
        return <PrayersView location={location} />;
      case 'calendar':
        return <HijriCalendar />;
      case 'adhkar':
        return <AdhkarView onBack={() => setCurrentView('dashboard')} />;
      case 'profile':
        return (
          <div className="flex flex-col items-center justify-center h-screen text-slate-400 p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-full mb-6 shadow-inner"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">الملف الشخصي</h2>
            <p className="max-w-xs mx-auto leading-relaxed">سيتم تفعيل الميزات السحابية وتحليل البيانات الروحية قريباً.</p>
          </div>
        );
      default:
        return <Dashboard setView={handleViewChange} location={location} setLocation={setLocation} />;
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 font-sans text-slate-900 pb-20 overflow-hidden">
      
      {/* Global Hidden Audio Element */}
      <audio ref={audioRef} preload="none" />

      <main className="animate-in fade-in duration-500 min-h-screen">
        {renderView()}
      </main>

      {/* Global Floating Player */}
      <MiniPlayer 
        track={audioState.currentTrack} 
        isPlaying={audioState.isPlaying}
        onTogglePlay={togglePlay}
        onClose={closePlayer}
        progress={audioState.progress}
        onExpand={() => handleViewChange('quran', { mode: 'audio' })}
      />

      <Navigation currentView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;