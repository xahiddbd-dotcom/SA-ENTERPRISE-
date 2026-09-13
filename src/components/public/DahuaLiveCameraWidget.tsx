import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { Video, Shield, Eye, X, ChevronDown, ChevronUp, Radio, Sparkles } from 'lucide-react';

interface DahuaLiveCameraWidgetProps {
  onOpenLiveModal: () => void;
}

export const DahuaLiveCameraWidget: React.FC<DahuaLiveCameraWidgetProps> = ({ onOpenLiveModal }) => {
  const { language } = useLanguage();
  const { settings } = useData();
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  const cameraConfig = settings.cctvCamera || {
    model: 'Dahua DH-IPC-H5AS 5MP Indoor Pan & Tilt WiFi Camera',
    locationName: 'Main Counter & Service Area',
    locationNameBn: 'প্রধান কাউন্টার ও সেবা কেন্দ্র',
    enabled: true
  };

  if (cameraConfig.enabled === false) return null;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="dahua-cctv-corner-widget"
      className="fixed bottom-6 right-6 z-40 max-w-[320px] w-full animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      {isMinimized ? (
        /* Minimized floating pill badge */
        <button
          onClick={() => setIsMinimized(false)}
          className="ml-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-neutral-900/95 border border-rose-500/40 text-white shadow-2xl backdrop-blur-xl hover:bg-neutral-800 transition-all group"
          title="Open CCTV Live View"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
          </span>
          <Video className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-neutral-200">
            {language === 'bn' ? 'দোকান লাইভ সিসিটিভি' : 'Shop Live CCTV'}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
        </button>
      ) : (
        /* Expanded Corner Card */
        <div className="bg-neutral-950/90 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl transition-all relative overflow-hidden text-white">
          {/* Subtle top indicator bar */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <span>LIVE FEED</span>
                <span className="text-neutral-500">•</span>
                <span className="text-emerald-400">5MP 3K</span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Minimize"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model Name & Location */}
          <div className="mb-2.5">
            <h4 className="text-xs font-extrabold text-white leading-tight">
              Dahua DH-IPC-H5AS 5MP
            </h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Indoor Pan &amp; Tilt WiFi Camera •{' '}
              {language === 'bn' ? cameraConfig.locationNameBn : cameraConfig.locationName}
            </p>
          </div>

          {/* Mini Live Preview Thumbnail */}
          <div
            onClick={onOpenLiveModal}
            className="relative h-24 w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer group mb-3"
          >
            {/* Background simulated CCTV viewport */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 flex items-center justify-center">
              <div className="w-full h-full opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px]" />
            </div>

            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent animate-pulse" />

            {/* Simulated camera watermark and time */}
            <div className="absolute top-2 left-2 text-[9px] font-mono text-emerald-400 drop-shadow">
              CAM-01 [MAIN_COUNTER]
            </div>
            <div className="absolute top-2 right-2 text-[9px] font-mono text-neutral-300 drop-shadow">
              {currentTimeStr}
            </div>

            {/* Center Play / Watch Live Trigger Button */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/90 group-hover:bg-rose-600 text-white font-bold text-xs shadow-lg group-hover:scale-105 transition-all">
                <Eye className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সরাসরি দেখুন' : 'Watch Live'}</span>
              </div>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-1.5 left-2 right-2 flex justify-between text-[8px] font-mono text-neutral-400">
              <span>360° PAN/TILT</span>
              <span>TWO-WAY TALK</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onOpenLiveModal}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
          >
            <Video className="w-3.5 h-3.5" />
            <span>
              {language === 'bn'
                ? 'ক্যামেরার সরাসরি সম্প্রচার চালু করুন'
                : 'Access Live Camera Broadcast'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
