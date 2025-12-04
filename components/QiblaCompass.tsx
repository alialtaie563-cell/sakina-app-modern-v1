import React, { useEffect, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { UserLocation } from '../types';
import { toArabicNumerals } from '../utils/api';

interface QiblaCompassProps {
    location: UserLocation;
}

const KaabaIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 7V19H20V7L12 3L4 7Z" fill="#1e1e1e" stroke="#FBBF24" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M4 7L12 11L20 7" stroke="#FBBF24" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12 11V20" stroke="#FBBF24" strokeWidth="1.5"/>
        <rect x="7" y="12" width="10" height="2" fill="#FBBF24"/>
    </svg>
);

const QiblaCompass: React.FC<QiblaCompassProps> = ({ location }) => {
  const [heading, setHeading] = useState(0); 
  const [qiblaBearing, setQiblaBearing] = useState(0); 
  const [error, setError] = useState<string | null>(null);
  const [isCalibrated, setIsCalibrated] = useState(false);

  // Makkah Coordinates
  const KAABA_LAT = 21.422487;
  const KAABA_LNG = 39.826206;

  const calculateQibla = (lat: number, lng: number) => {
    const PI = Math.PI;
    const latk = KAABA_LAT * PI / 180.0;
    const longk = KAABA_LNG * PI / 180.0;
    const phi = lat * PI / 180.0;
    const lambda = lng * PI / 180.0;
    const q = Math.atan2(Math.sin(longk - lambda), Math.cos(phi) * Math.tan(latk) - Math.sin(phi) * Math.cos(longk - lambda));
    return (q * 180.0 / PI + 360) % 360;
  };

  useEffect(() => {
    const bearing = calculateQibla(location.lat, location.lng);
    setQiblaBearing(bearing);

    const handleOrientation = (event: DeviceOrientationEvent) => {
        let compass = 0;
        // @ts-ignore
        if (event.webkitCompassHeading) {
            // @ts-ignore
            compass = event.webkitCompassHeading;
            setIsCalibrated(true);
        } else if (event.alpha) {
            compass = 360 - event.alpha;
            setIsCalibrated(true);
        }
        setHeading(compass);
    };

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
        setError("مستشعر البوصلة غير مدعوم في هذا الجهاز");
    }
    
    // Simulate slight movement for PC preview if not actual device
    const interval = setInterval(() => {
        if(!isCalibrated) setHeading(prev => (prev + 0.2) % 360);
    }, 100);

    return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
        clearInterval(interval);
    };
  }, [location, isCalibrated]);

  // Calculate the rotation needed for the arrow/compass card
  // We rotate the CARD so that North matches phone's north, then place Qibla marker
  const isAligned = Math.abs(heading - qiblaBearing) < 5 || Math.abs(heading - qiblaBearing) > 355;
  
  // Angle for the Qibla marker relative to the visual top of the phone
  const markerAngle = (qiblaBearing - heading + 360) % 360;

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Background Gradient */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${isAligned ? 'bg-emerald-950/40' : 'bg-slate-900'}`}></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/50 to-transparent"></div>

      {/* Header Info */}
      <div className="absolute top-8 left-0 right-0 text-center z-10">
         <h2 className="text-2xl font-bold font-quran mb-2">تحديد القبلة</h2>
         <div className="flex items-center justify-center gap-2 text-slate-400 text-sm bg-white/5 w-fit mx-auto px-4 py-1.5 rounded-full backdrop-blur-md">
            <MapPin size={14} className="text-emerald-500" />
            <span>{location.cityName}</span>
         </div>
      </div>

      {/* Main Radar Compass */}
      <div className="relative w-72 h-72 z-10">
          
          {/* Static Outer Rings */}
          <div className={`absolute inset-0 rounded-full border-2 transition-colors duration-500 ${isAligned ? 'border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : 'border-slate-700'}`}></div>
          <div className="absolute inset-4 rounded-full border border-slate-700/50 border-dashed"></div>
          
          {/* North Indicator (Fixed to Phone Top) */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-slate-500 text-xs font-bold tracking-widest">
              AT TOP
          </div>

          {/* Dynamic Ring (Rotates with Qibla Direction) */}
          {/* Instead of rotating the whole compass, we rotate the Qibla Indicator relative to the phone */}
          <div 
            className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
            style={{ transform: `rotate(${markerAngle}deg)` }}
          >
              {/* The Qibla Marker (Kaaba) */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                  <div className={`p-2 rounded-xl transition-all duration-300 shadow-lg ${isAligned ? 'bg-emerald-500 scale-110' : 'bg-slate-800 border border-slate-600'}`}>
                      <KaabaIcon size={28} />
                  </div>
                  {/* Direction Beam */}
                  <div className={`w-0.5 h-32 bg-gradient-to-b transition-all duration-300 ${isAligned ? 'from-emerald-500 to-transparent opacity-100' : 'from-slate-600 to-transparent opacity-30'}`}></div>
              </div>
          </div>

          {/* Center Display */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex flex-col items-center justify-center border border-slate-600 shadow-2xl z-20">
                  <span className={`text-3xl font-bold font-mono transition-colors ${isAligned ? 'text-emerald-400' : 'text-white'}`}>
                      {toArabicNumerals(Math.round(heading))}°
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                      {isAligned ? 'ممتاز' : 'درجة'}
                  </span>
              </div>
          </div>
      </div>

      {/* Status Footer */}
      <div className="mt-12 text-center z-10 h-16">
          {isAligned ? (
              <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-2 animate-bounce">
                      <KaabaIcon size={24} />
                  </div>
                  <p className="text-emerald-400 font-bold text-lg">أنت تواجه القبلة الآن</p>
              </div>
          ) : (
             <div className="text-slate-400 flex flex-col items-center">
                 <p className="mb-2">حرك هاتفك حتى تتطابق الكعبة مع المؤشر</p>
                 {!isCalibrated && (
                     <div className="flex items-center gap-2 text-xs bg-amber-500/10 text-amber-500 px-3 py-1 rounded-lg">
                         <AlertCircle size={12} />
                         <span>يرجى تحريك الهاتف على شكل 8 للمعايرة</span>
                     </div>
                 )}
             </div>
          )}
      </div>

    </div>
  );
};

export default QiblaCompass;