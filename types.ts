
export interface NotificationTemplate {
  id: string;
  category: 'fajr' | 'asr' | 'midday' | 'sleep';
  content: string;
  tag?: string; // e.g., #Resilience
}

export interface QuranSegment {
  id: string;
  surahName: string;
  range: string; // e.g., "Verse 1-10"
  moodTag: string; // e.g., "#Planning_Future"
  motivationalText: string;
}

export interface SurahData {
  id: string;
  name: string;
  segments: QuranSegment[];
}

export interface PrayerTime {
  name: string;
  time: string;
  isNext: boolean;
  icon?: any;
}

export interface SurahBasic {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter: number;
  sajda: boolean | any;
  surah?: { // API returns this nested object in page view
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  }; 
}

export interface SurahDetail extends SurahBasic {
  ayahs: Ayah[];
}

export interface QuranPageData {
    number: number;
    ayahs: Ayah[];
    surahs: { [key: number]: SurahBasic }; 
}

export interface Reciter {
  identifier: string;
  name: string;
  englishName: string;
  urlPrefix: string;
}

export interface Dhikr {
  id: string;
  category: 'morning' | 'evening' | 'sleep' | 'prayer';
  text: string;
  count: number;
  reference?: string;
}

export type ViewState = 'dashboard' | 'quran' | 'qibla' | 'calendar' | 'profile' | 'adhkar' | 'prayers';

export type QuranTab = 'thematic' | 'full' | 'audio';

export interface TimeContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  greetings: string[];
}

export interface UserLocation {
    lat: number;
    lng: number;
    cityName: string;
    isAuto: boolean; // true if using GPS, false if manual
}

export interface AdhanSettings {
    voice: 'makkah' | 'madinah' | 'aqsa' | 'egypt';
    enabledPrayers: {
        fajr: boolean;
        dhuhr: boolean;
        asr: boolean;
        maghrib: boolean;
        isha: boolean;
    }
}

// --- NEW AUDIO TYPES ---
export interface AudioTrack {
    title: string;
    subtitle: string;
    url: string;
    surahNumber?: number;
    reciterName?: string;
}

export interface AudioState {
    isPlaying: boolean;
    currentTrack: AudioTrack | null;
    progress: number; // 0 to 100
    duration: number;
    currentTime: number;
}
