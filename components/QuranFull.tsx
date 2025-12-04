import React, { useState, useEffect } from 'react';
import { SurahBasic, QuranTab, Reciter, QuranPageData, AudioState, AudioTrack } from '../types';
import { fetchSurahList, RECITERS, getAudioUrl, fetchQuranPage, normalizeArabic, SURAH_START_PAGES, toArabicNumerals } from '../utils/api';
import { Play, Pause, Search, ChevronRight, Loader2, BookOpen, Moon, Sun, Bookmark, ChevronLeft, Volume2, X, Headphones, Wifi } from 'lucide-react';

interface QuranFullProps {
    initialSurahId?: number;
    initialMode?: 'reading' | 'audio';
    globalAudioState?: AudioState;
    onPlayTrack?: (track: AudioTrack) => void;
}

const QuranFull: React.FC<QuranFullProps> = ({ initialSurahId, initialMode, globalAudioState, onPlayTrack }) => {
  const [activeTab, setActiveTab] = useState<QuranTab>(initialMode === 'audio' ? 'audio' : 'full');
  const [surahs, setSurahs] = useState<SurahBasic[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<SurahBasic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Page Reader State
  const [readingMode, setReadingMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState<QuranPageData | null>(null);
  const [loadingPage, setLoadingPage] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [bookmarkedPage, setBookmarkedPage] = useState<number | null>(null);
  const [showAudioSuggestion, setShowAudioSuggestion] = useState(false);

  // Selected Reciter
  const [selectedReciter] = useState<Reciter>(RECITERS[0]);

  useEffect(() => {
      if (initialSurahId && initialMode !== 'audio') {
          const startPage = SURAH_START_PAGES[initialSurahId] || 1;
          setCurrentPage(startPage);
          setReadingMode(true);
          setShowAudioSuggestion(true);
      }
      if (initialMode === 'audio') {
          setActiveTab('audio');
      }
  }, [initialSurahId, initialMode]);

  useEffect(() => {
    const saved = localStorage.getItem('quran_bookmark');
    if (saved) setBookmarkedPage(parseInt(saved));

    const loadSurahs = async () => {
      const list = await fetchSurahList();
      if (list.length > 0) {
          setSurahs(list);
          setFilteredSurahs(list);
      }
      setLoading(false);
    };
    loadSurahs();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
        setFilteredSurahs(surahs);
        return;
    }
    const normalizedSearch = normalizeArabic(searchTerm.toLowerCase().replace('سورة', '').trim());
    const results = surahs.filter(s => {
        const normalizedName = normalizeArabic(s.name);
        return normalizedName.includes(normalizedSearch) || 
               s.englishName.toLowerCase().includes(normalizedSearch);
    });
    setFilteredSurahs(results);
  }, [searchTerm, surahs]);

  useEffect(() => {
      if (readingMode) {
          const loadPage = async () => {
              setLoadingPage(true);
              const data = await fetchQuranPage(currentPage);
              setPageData(data);
              setLoadingPage(false);
          };
          loadPage();
      }
  }, [currentPage, readingMode]);

  const handleSurahClick = (surahNumber: number) => {
      const startPage = SURAH_START_PAGES[surahNumber] || 1;
      setCurrentPage(startPage); 
      setReadingMode(true);
      setShowAudioSuggestion(false);
  };

  const handleNextPage = () => { if (currentPage < 604) setCurrentPage(p => p + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };

  const toggleBookmark = () => {
      if (bookmarkedPage === currentPage) {
          setBookmarkedPage(null);
          localStorage.removeItem('quran_bookmark');
      } else {
          setBookmarkedPage(currentPage);
          localStorage.setItem('quran_bookmark', currentPage.toString());
      }
  };

  const triggerPlay = (surah: SurahBasic) => {
      if (onPlayTrack) {
          onPlayTrack({
              title: `سورة ${surah.name}`,
              subtitle: selectedReciter.name,
              url: getAudioUrl(selectedReciter, surah.number),
              surahNumber: surah.number,
              reciterName: selectedReciter.name
          });
      }
  };

  const playCurrentSurahAudio = () => {
      if (!pageData) return;
      const surahNum = pageData.ayahs[0].surah?.number;
      if (surahNum) {
          const s = surahs.find(x => x.number === surahNum);
          if (s) {
              setReadingMode(false);
              setActiveTab('audio');
              triggerPlay(s);
          }
      }
  };

  // --- Reading Mode (Horizontal Page View) ---
  if (readingMode) {
    const isBookmarked = bookmarkedPage === currentPage;
    let headerTitle = `الصفحة ${toArabicNumerals(currentPage)}`;
    if (pageData && pageData.ayahs.length > 0) {
        if (pageData.ayahs[0].surah) {
            headerTitle = pageData.ayahs[0].surah.name;
        }
    }

    return (
        <div className={`fixed inset-0 z-50 flex flex-col ${nightMode ? 'bg-[#1a1a1a] text-[#e0e0e0]' : 'bg-[#1e1e1e]/60'}`}>
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" onClick={() => setReadingMode(false)}></div>
            
            {/* Main Quran Book Container */}
            <div className={`relative z-10 w-full h-full flex flex-col ${nightMode ? 'bg-[#222]' : 'bg-[#FFFBF2]'} overflow-hidden md:max-w-2xl md:mx-auto md:my-4 md:rounded-xl md:shadow-2xl animate-in zoom-in-95 duration-300`}>
                
                {/* Header Controls */}
                <div className={`flex items-center justify-between p-3 border-b border-double border-4 ${nightMode ? 'border-[#444] bg-[#333]' : 'border-[#D4C5A0] bg-[#F4EBD0]'}`}>
                    <div className="flex gap-2">
                        <button onClick={() => setReadingMode(false)} className="p-2 rounded-full hover:bg-black/10 transition-colors">
                            <X size={20} className={nightMode ? 'text-gray-300' : 'text-[#594a36]'} />
                        </button>
                        <button onClick={() => setNightMode(!nightMode)} className="p-2 rounded-full hover:bg-black/10 transition-colors">
                            {nightMode ? <Sun size={20} /> : <Moon size={20} className="text-[#594a36]" />}
                        </button>
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <span className={`font-bold font-quran text-lg ${nightMode ? 'text-gray-300' : 'text-[#594a36]'}`}>{headerTitle}</span>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={toggleBookmark} className={`p-2 rounded-full ${isBookmarked ? 'text-orange-600' : (nightMode ? 'text-gray-500' : 'text-[#9c8e76]')}`}>
                            <Bookmark fill={isBookmarked ? "currentColor" : "none"} />
                        </button>
                    </div>
                </div>

                {/* Page Content (The "Paper" area) */}
                <div className={`flex-1 overflow-hidden relative flex flex-col items-center justify-center p-2 sm:p-4 ${nightMode ? 'bg-[#1a1a1a]' : 'bg-[#FFFBF2]'}`}>
                    
                    {/* Navigation Buttons */}
                    <button 
                        onClick={handleNextPage} 
                        className={`absolute right-0 top-1/2 -translate-y-1/2 p-4 z-20 hover:bg-black/5 active:scale-95 transition-all ${nightMode ? 'text-gray-500' : 'text-[#8C7B65]'}`}
                    >
                        <ChevronRight size={32} />
                    </button>
                    <button 
                        onClick={handlePrevPage} 
                        className={`absolute left-0 top-1/2 -translate-y-1/2 p-4 z-20 hover:bg-black/5 active:scale-95 transition-all ${nightMode ? 'text-gray-500' : 'text-[#8C7B65]'}`}
                    >
                        <ChevronLeft size={32} />
                    </button>

                    {loadingPage ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className={`animate-spin ${nightMode ? 'text-gray-500' : 'text-[#8C7B65]'}`} size={40} />
                            <span className="text-xs text-gray-400">جاري تحميل الصفحة...</span>
                        </div>
                    ) : pageData ? (
                        /* The "Frame" of the page */
                        <div className={`w-full max-w-[95%] h-full max-h-[98%] flex flex-col shadow-inner overflow-hidden border-[3px] border-double ${nightMode ? 'border-[#444] bg-[#252525]' : 'border-[#8C7B65] bg-white'}`}>
                            
                            {/* Inner Scrollable Text Area */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
                                <div className={`font-uthmani text-[22px] sm:text-[26px] leading-[2.2] text-justify ${nightMode ? 'text-[#e0e0e0]' : 'text-[#2d241b]'}`} dir="rtl" style={{ textAlignLast: 'center' }}>
                                    
                                    {pageData.ayahs.map((ayah, idx) => {
                                        // Improved Bismillah removal logic
                                        let text = ayah.text;
                                        const isStartOfSurah = ayah.numberInSurah === 1;
                                        
                                        if (isStartOfSurah && ayah.surah?.number !== 1 && ayah.surah?.number !== 9) {
                                            const bismillahVars = [
                                                'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', 
                                                'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
                                            ];
                                            for (const b of bismillahVars) {
                                                if (text.startsWith(b)) {
                                                    text = text.replace(b, '').trim();
                                                    break; 
                                                }
                                            }
                                        }

                                        return (
                                        <React.Fragment key={ayah.number}>
                                            {isStartOfSurah && (
                                                <div className="mt-6 mb-4">
                                                    {/* Decorative Surah Header Box */}
                                                    <div className={`w-full h-12 flex items-center justify-center mb-2 border-y-2 relative ${nightMode ? 'border-[#444] bg-[#333]' : 'border-[#8C7B65] bg-[#F4EBD0]'}`}>
                                                        {/* Decorative ends */}
                                                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${nightMode ? 'bg-[#555]' : 'bg-[#D4C5A0]'}`}></div>
                                                        <div className={`absolute right-0 top-0 bottom-0 w-2 ${nightMode ? 'bg-[#555]' : 'bg-[#D4C5A0]'}`}></div>
                                                        
                                                        <h2 className={`font-quran font-bold text-xl ${nightMode ? 'text-white' : 'text-[#594a36]'}`}>
                                                            {ayah.surah?.name}
                                                        </h2>
                                                    </div>

                                                    {/* Bismillah Header (Centered & Ornate) - Except Surah 1 & 9 */}
                                                    {ayah.surah?.number !== 1 && ayah.surah?.number !== 9 && (
                                                        <div className={`text-center font-uthmani text-xl mb-2 ${nightMode ? 'text-gray-400' : 'text-[#8C7B65]'}`}>
                                                            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <span className="inline">
                                                {text} 
                                                {/* Verse Marker */}
                                                <span className={`inline-flex items-center justify-center relative mx-1 align-middle w-8 h-8 select-none`}>
                                                   <svg viewBox="0 0 24 24" className={`w-full h-full ${nightMode ? 'text-[#444]' : 'text-[#D4C5A0]'}`} fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <circle cx="12" cy="12" r="10" strokeWidth="1" />
                                                        <path d="M12 2v2 M12 20v2 M2 12h2 M20 12h2" opacity="0.5"/>
                                                    </svg>
                                                    <span className={`absolute inset-0 flex items-center justify-center text-[11px] pt-1 font-bold font-sans ${nightMode ? 'text-gray-300' : 'text-[#594a36]'}`}>
                                                        {toArabicNumerals(ayah.numberInSurah)}
                                                    </span>
                                                </span>
                                            </span>
                                        </React.Fragment>
                                    )})}
                                </div>
                            </div>

                            {/* Page Footer */}
                            <div className={`text-center text-xs py-1 border-t ${nightMode ? 'border-[#333] text-gray-500' : 'border-[#E3D5B0] text-[#8C7B65]'}`}>
                                {toArabicNumerals(currentPage)}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">تعذر تحميل الصفحة</p>
                    )}
                </div>

                {/* Audio Suggestion Bar */}
                {showAudioSuggestion && (
                    <div className="absolute bottom-6 left-6 right-6 bg-[#8C7B65] text-white p-3 rounded-xl shadow-xl flex items-center justify-between animate-in slide-in-from-bottom-4 z-30">
                        <div className="flex items-center gap-3">
                            <Volume2 size={20} className="text-[#F4EBD0]" />
                            <span className="text-sm font-bold">هل تفضل الاستماع؟</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowAudioSuggestion(false)} className="px-3 py-1 text-xs opacity-80 hover:opacity-100">إغلاق</button>
                            <button onClick={playCurrentSurahAudio} className="bg-[#F4EBD0] text-[#594a36] px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-white transition-colors">تشغيل الصوت</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
  }

  // --- List View (Default) ---
  return (
    <div className="pb-32 pt-4 px-4 max-w-md mx-auto">
      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
        <button 
          onClick={() => setActiveTab('full')}
          className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === 'full' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
        >
          المصحف
        </button>
        <button 
          onClick={() => setActiveTab('audio')}
          className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === 'audio' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
        >
          المكتبة الصوتية
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute right-4 top-3.5 text-slate-400" size={18} />
        <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن سورة (مثلاً: الدخان، الكهف)..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pr-11 pl-4 text-sm focus:outline-none focus:border-primary-500 transition-colors shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary-500" /></div>
      ) : activeTab === 'full' ? (
        <div className="space-y-3">
          {bookmarkedPage && (
              <div onClick={() => { setCurrentPage(bookmarkedPage); setReadingMode(true); }} className="bg-gradient-to-r from-primary-50 to-white border border-primary-100 p-4 rounded-2xl flex items-center justify-between cursor-pointer mb-4 shadow-sm group">
                  <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-full shadow-sm">
                          <Bookmark className="text-primary-600" size={20} fill="currentColor" />
                      </div>
                      <div>
                          <h4 className="font-bold text-primary-900">متابعة القراءة</h4>
                          <p className="text-xs text-primary-700">الصفحة {toArabicNumerals(bookmarkedPage)}</p>
                      </div>
                  </div>
                  <ChevronLeft className="text-primary-400 group-hover:-translate-x-1 transition-transform" size={20} />
              </div>
          )}
          
          {filteredSurahs.map((surah) => (
            <div 
                key={surah.number} 
                onClick={() => handleSurahClick(surah.number)}
                className="bg-white p-4 rounded-2xl border border-slate-100 hover:border-primary-100 hover:shadow-md transition-all duration-300 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-bold font-quran text-lg text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                  {toArabicNumerals(surah.number)}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800 font-quran group-hover:text-primary-800 transition-colors">{surah.name}</h4>
                  <p className="text-xs text-slate-400">{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {toArabicNumerals(surah.numberOfAyahs)} آية</p>
                </div>
              </div>
              <BookOpen size={18} className="text-slate-300 group-hover:text-primary-400" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
             <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800 text-sm">القارئ المختار</h3>
                </div>
                <div className="w-full p-3 bg-slate-50 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Headphones size={16} className="text-slate-400" />
                        <span>مشاري العفاسي</span>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Wifi size={10} />
                        Online
                    </span>
                </div>
             </div>
             
            {filteredSurahs.map((surah) => {
                const isCurrent = globalAudioState?.currentTrack?.surahNumber === surah.number;
                const isPlaying = isCurrent && globalAudioState?.isPlaying;

                return (
                <div 
                    key={surah.number} 
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${isCurrent ? 'bg-primary-50 border-primary-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCurrent ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {isCurrent && isPlaying ? (
                                <div className="flex gap-0.5 h-3 items-end">
                                    <div className="w-0.5 bg-white animate-[pulse_0.6s_infinite] h-full"></div>
                                    <div className="w-0.5 bg-white animate-[pulse_0.8s_infinite] h-2/3"></div>
                                    <div className="w-0.5 bg-white animate-[pulse_1.0s_infinite] h-full"></div>
                                </div>
                            ) : (
                                <span className="font-bold text-xs">{surah.number}</span>
                            )}
                        </div>
                        <span className={`font-bold font-quran text-lg ${isCurrent ? 'text-primary-900' : 'text-slate-700'}`}>{surah.name}</span>
                    </div>
                    <button 
                        onClick={() => triggerPlay(surah)} 
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${isCurrent ? 'bg-white text-primary-600 shadow-sm' : 'bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-primary-50'}`}
                    >
                        {isCurrent && isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                    </button>
                </div>
            )})}
        </div>
      )}
    </div>
  );
};

export default QuranFull;