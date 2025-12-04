import { SurahBasic, SurahDetail, PrayerTime, Reciter, QuranPageData, Ayah } from '../types';

const BASE_QURAN_URL = 'https://api.alquran.cloud/v1';
const BASE_PRAYER_URL = 'https://api.aladhan.com/v1';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

// Mapping of Surah Number to its Starting Page in Madani Mushaf (604 Pages)
export const SURAH_START_PAGES: { [key: number]: number } = {
  1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 6: 128, 7: 151, 8: 177, 9: 187, 10: 208,
  11: 221, 12: 235, 13: 249, 14: 255, 15: 262, 16: 267, 17: 282, 18: 293, 19: 305, 20: 312,
  21: 322, 22: 332, 23: 342, 24: 350, 25: 359, 26: 367, 27: 377, 28: 385, 29: 396, 30: 404,
  31: 411, 32: 415, 33: 418, 34: 428, 35: 434, 36: 440, 37: 446, 38: 453, 39: 458, 40: 467,
  41: 477, 42: 483, 43: 489, 44: 496, 45: 499, 46: 502, 47: 507, 48: 511, 49: 515, 50: 518,
  51: 520, 52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537, 58: 542, 59: 545, 60: 549,
  61: 551, 62: 553, 63: 554, 64: 556, 65: 558, 66: 560, 67: 562, 68: 564, 69: 566, 70: 568,
  71: 570, 72: 572, 73: 574, 74: 575, 75: 577, 76: 578, 77: 580, 78: 582, 79: 583, 80: 585,
  81: 586, 82: 587, 83: 587, 84: 589, 85: 590, 86: 591, 87: 591, 88: 592, 89: 593, 90: 594,
  91: 595, 92: 595, 93: 596, 94: 596, 95: 597, 96: 597, 97: 598, 98: 598, 99: 599, 100: 599,
  101: 600, 102: 600, 103: 601, 104: 601, 105: 601, 106: 602, 107: 602, 108: 602, 109: 603, 110: 603,
  111: 603, 112: 604, 113: 604, 114: 604
};

// --- Helper: Convert to Arabic-Indic Numerals (١, ٢, ٣) ---
export const toArabicNumerals = (num: number | string): string => {
  if (num === null || num === undefined) return "";
  const str = num.toString();
  const western = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const eastern = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[0-9]/g, x => eastern[western.indexOf(x)]);
};

// --- Text Normalization for Search ---
export const normalizeArabic = (text: string): string => {
  if (!text) return "";
  let norm = text;
  norm = norm.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, "");
  norm = norm.replace(/[أإآ]/g, "ا");
  norm = norm.replace(/[ى]/g, "ي");
  norm = norm.replace(/[ة]/g, "ه");
  return norm;
};

// --- Cache-First Strategy for Professional Speed ---
// We try to serve from cache immediately, but we don't block network requests for updates if needed.
const getFromCache = (key: string): any | null => {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
        return JSON.parse(cached);
    } catch { return null; }
};

const saveToCache = (key: string, data: any) => {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
};

export const fetchSurahList = async (): Promise<SurahBasic[]> => {
  const CACHE_KEY = 'surah_list_simple';
  const cached = getFromCache(CACHE_KEY);
  
  // Return cached immediately if available (Professional Speed)
  if (cached) {
      // Background revalidate could happen here, but for surah list it's static
      return cached;
  }

  try {
    const response = await fetch(`${BASE_QURAN_URL}/surah`);
    const data = await response.json();
    saveToCache(CACHE_KEY, data.data);
    return data.data;
  } catch (error) {
    console.error("Network Error", error);
    return []; // Return empty array gracefully instead of crashing
  }
};

export const fetchQuranPage = async (pageNumber: number): Promise<QuranPageData | null> => {
    const CACHE_KEY = `quran_page_${pageNumber}`;
    const cached = getFromCache(CACHE_KEY);
    
    // Always fetch fresh if not cached, but if cached return it.
    if (cached) return cached;

    try {
        const response = await fetch(`${BASE_QURAN_URL}/page/${pageNumber}/quran-uthmani`);
        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        
        const result = {
            number: pageNumber,
            ayahs: data.data.ayahs,
            surahs: {} 
        };
        saveToCache(CACHE_KEY, result);
        return result;
    } catch (e) {
        console.error("Failed to fetch page", e);
        return null;
    }
}

export const fetchCityName = async (lat: number, lng: number): Promise<string> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`, {
             headers: { 'User-Agent': 'SakinaApp/1.0' }
        });
        const data = await response.json();
        const addr = data.address;
        return addr.city || addr.town || addr.village || addr.county || "موقع محدد";
    } catch (e) {
        return "الموقع الحالي";
    }
};

export const searchCities = async (query: string): Promise<{name: string, lat: number, lng: number, country: string}[]> => {
    try {
        if (!query || query.length < 2) return [];
        const response = await fetch(`${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&accept-language=ar&limit=5&addressdetails=1`, {
            headers: { 'User-Agent': 'SakinaApp/1.0' }
        });
        const data = await response.json();
        if (!data || data.length === 0) return [];
        return data.map((item: any) => {
            const addr = item.address;
            const mainName = addr.city || addr.town || addr.village || item.name;
            const sub = addr.state || addr.region || addr.country;
            return {
                name: `${mainName}، ${sub}`,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                country: addr.country
            };
        });
    } catch (e) {
        return [];
    }
}

export const fetchPrayerTimesByCoords = async (lat: number, lng: number): Promise<any> => {
    const date = new Date();
    // Unique key per day per location
    const CACHE_KEY = `prayers_${lat.toFixed(2)}_${lng.toFixed(2)}_${date.getDate()}_${date.getMonth()}`;
    const cached = getFromCache(CACHE_KEY);
    if(cached) return cached;

    try {
        const response = await fetch(`${BASE_PRAYER_URL}/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${lat}&longitude=${lng}&method=3`); 
        const data = await response.json();
        saveToCache(CACHE_KEY, data.data);
        return data.data;
    } catch (error) {
        return null;
    }
}

export const fetchWeather = async (lat: number, lng: number): Promise<any> => {
    try {
        const response = await fetch(`${WEATHER_URL}?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&timezone=auto`);
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
};

export const getWeatherDescription = (code: number): { text: string, icon: string } => {
    if (code === 0) return { text: 'سماء صافية', icon: 'Sun' };
    if (code >= 1 && code <= 3) return { text: 'غائم جزئياً', icon: 'CloudSun' };
    if (code >= 45 && code <= 48) return { text: 'ضباب', icon: 'CloudFog' };
    if (code >= 51 && code <= 67) return { text: 'ممطر', icon: 'CloudRain' };
    if (code >= 71 && code <= 77) return { text: 'ثلج', icon: 'Snowflake' };
    if (code >= 95) return { text: 'عاصفة رعدية', icon: 'CloudLightning' };
    return { text: 'معتدل', icon: 'Sun' };
}

export const RECITERS: Reciter[] = [
    { identifier: 'alafasy', name: 'مشاري العفاسي', englishName: 'Mishary Rashid Alafasy', urlPrefix: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/' },
];

export const getAudioUrl = (reciter: Reciter, surahNumber: number): string => {
    const paddedNum = surahNumber.toString().padStart(3, '0');
    return `${reciter.urlPrefix}${paddedNum}.mp3`;
}

export const ADHAN_URLS = {
    makkah: 'https://download.quranicaudio.com/adhan/makkah.mp3', 
    madinah: 'https://download.quranicaudio.com/adhan/madina.mp3',
    aqsa: 'https://www.islamcan.com/audio/adhan/azan3.mp3',
    egypt: 'https://www.islamcan.com/audio/adhan/azan4.mp3'
};

export const formatTime12H = (time24: string): string => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(':').map(Number);
    const suffix = hours >= 12 ? 'م' : 'ص';
    const hours12 = hours % 12 || 12;
    return `${toArabicNumerals(hours12)}:${toArabicNumerals(minutes.toString().padStart(2, '0'))} ${suffix}`;
}