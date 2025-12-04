import React from 'react';
import { Play, Pause, X, Disc, Maximize2 } from 'lucide-react';
import { AudioTrack } from '../types';

interface MiniPlayerProps {
    track: AudioTrack | null;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onClose: () => void;
    onExpand?: () => void;
    progress: number;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ track, isPlaying, onTogglePlay, onClose, onExpand, progress }) => {
    if (!track) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 z-40 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="bg-slate-900/90 backdrop-blur-xl text-white rounded-2xl p-3 shadow-2xl shadow-slate-900/20 border border-white/10 flex items-center gap-3 relative overflow-hidden group">
                
                {/* Progress Bar Background */}
                <div 
                    className="absolute bottom-0 left-0 h-[2px] bg-primary-500 transition-all duration-300 z-10" 
                    style={{ width: `${progress}%` }}
                />

                {/* Disc Animation */}
                <div className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center relative flex-shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                    <Disc size={20} className="text-primary-400" />
                    <div className="absolute inset-0 rounded-full border border-white/10"></div>
                </div>

                <div className="flex-1 min-w-0" onClick={onExpand}>
                    <h4 className="font-bold text-sm truncate font-quran">{track.title}</h4>
                    <p className="text-xs text-slate-400 truncate">{track.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={onTogglePlay}
                        className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-primary-50 transition-colors"
                    >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                    </button>
                    
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
            <style>{`
                .animate-spin-slow { animation: spin 4s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default MiniPlayer;