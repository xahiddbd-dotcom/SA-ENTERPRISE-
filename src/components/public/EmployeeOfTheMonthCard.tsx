import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { triggerThanosSnap } from '../common/ThanosSnapEffect';
import { Award, Star, Sparkles, Quote, Heart, Play, X, Bot, Volume2, VolumeX, Sparkle, ExternalLink } from 'lucide-react';
import { parseVideoSource } from '../../utils/videoUtils';

interface EmployeeOfTheMonthCardProps {
  variant?: 'featured' | 'compact' | 'badge';
  className?: string;
}

export const EmployeeOfTheMonthCard: React.FC<EmployeeOfTheMonthCardProps> = ({
  variant = 'featured',
  className = ''
}) => {
  const { language } = useLanguage();
  const { settings } = useData();
  const { isDark } = useTheme();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const config = settings.employeeOfTheMonth;

  // If disabled by Admin, do not render
  if (!config || !config.enabled) {
    return null;
  }

  const name = language === 'bn' ? (config.nameBn || config.name) : (config.name || config.nameBn);
  const role = language === 'bn' ? (config.roleBn || config.role) : (config.role || config.roleBn);
  const comment = language === 'bn' ? (config.commentBn || config.comment) : (config.comment || config.commentBn);
  const month = language === 'bn' ? (config.monthBn || config.month) : (config.month || config.monthBn);
  const photo = config.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
  const videoUrl = config.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-young-man-working-with-headphones-40082-large.mp4';

  const handlePhotoClick = () => {
    setIsVideoModalOpen(true);
  };

  if (variant === 'badge') {
    return (
      <>
        <div
          onClick={handlePhotoClick}
          title={language === 'bn' ? 'মাসের সেরা কর্মীর সম্মাননা ভিডিও দেখুন' : 'Watch Employee of the Month Video'}
          className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border cursor-pointer group transition-all hover:scale-105 active:scale-95 shadow-md ${
            isDark
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-950/70'
              : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
          } ${className}`}
        >
          <div className="relative">
            <img
              src={photo}
              alt={name}
              className="w-7 h-7 rounded-full object-cover border-2 border-amber-400 group-hover:rotate-12 transition-transform"
            />
            <span className="absolute -bottom-1 -right-1 text-[10px]">🎬</span>
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-500 leading-tight">
              🏆 {language === 'bn' ? 'মাসের সেরা কর্মী' : 'Employee of the Month'}
            </span>
            <span className="text-xs font-extrabold truncate max-w-[120px] block leading-tight">
              {name}
            </span>
          </div>
        </div>

        {/* Video Player Modal */}
        {isVideoModalOpen && (
          <VideoTributeModal
            isOpen={isVideoModalOpen}
            onClose={() => setIsVideoModalOpen(false)}
            videoUrl={videoUrl}
            name={name}
            role={role}
            month={month}
            comment={comment}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            language={language}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        id="employee-of-the-month-section"
        className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-neutral-900 via-amber-950/20 to-neutral-900 border-amber-500/30 shadow-2xl shadow-amber-950/40'
            : 'bg-gradient-to-br from-white via-amber-50/60 to-white border-amber-200 shadow-xl shadow-amber-100/50'
        } ${className}`}
      >
        {/* Decorative Golden Orbs & Sparks */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at 95% 5%, rgba(245,158,11,0.25) 0%, transparent 45%), radial-gradient(circle at 5% 95%, rgba(16,185,129,0.2) 0%, transparent 45%)'
          }}
        />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8">
            {/* Worker Photo Column with Interactive Video Play Trigger */}
            <div className="relative shrink-0 text-center flex flex-col items-center">
              <div
                onClick={handlePhotoClick}
                className="relative cursor-pointer group rounded-full p-1.5 transition-all duration-300 hover:scale-105 active:scale-95"
                title={
                  language === 'bn'
                    ? 'ছবিতে ক্লিক করুন এবং কর্মীর বিশেষ সম্মাননা ভিডিও দেখুন! 🎬✨'
                    : 'Click photo to watch Employee tribute video! 🎬✨'
                }
              >
                {/* Outer Golden Glow Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 animate-spin opacity-75 blur-xs duration-7000" />
                
                {/* Avatar Image */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-amber-400 bg-neutral-950 shadow-xl">
                  <img
                    src={photo}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Hover Video Play Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white backdrop-blur-xs">
                    <div className="w-10 h-10 rounded-full bg-amber-500/90 text-neutral-950 flex items-center justify-center mb-1 shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-neutral-950 ml-0.5" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                      {language === 'bn' ? 'ভিডিও দেখুন' : 'Watch Video'}
                    </span>
                  </div>
                </div>

                {/* Award Badge Floating Icon */}
                <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 border-2 border-white dark:border-neutral-900 flex items-center justify-center text-neutral-950 shadow-lg">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              {/* Click CTA hint */}
              <button
                type="button"
                onClick={handlePhotoClick}
                className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-500 hover:bg-amber-500/25 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <Play className="w-3 h-3 fill-amber-500" />
                <span>{language === 'bn' ? 'ভিডিও প্লে করুন 🎬' : 'Play Video 🎬'}</span>
              </button>
            </div>

          {/* Details & Comments Column */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-500 text-xs font-extrabold uppercase tracking-wide">
                <Award className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'মাসের সেরা কর্মী' : 'Employee of the Month'}</span>
              </span>

              {month && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  isDark ? 'bg-neutral-800/80 border-neutral-700 text-neutral-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  🗓️ {month}
                </span>
              )}

              {config.joinedYear && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                  isDark ? 'bg-neutral-800/80 border-neutral-700 text-neutral-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  {language === 'bn' ? `সেবায়: ${config.joinedYear}` : `Since ${config.joinedYear}`}
                </span>
              )}
            </div>

            <div>
              <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {name}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-emerald-500 mt-0.5">
                {role}
              </p>
            </div>

            {/* 5-Star Rating */}
            <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
              <span className={`text-xs font-bold ml-1.5 ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                5.0 / 5.0 {language === 'bn' ? '(সার্বক্ষণিক সেরা মূল্যায়ন)' : '(Exceptional Performance)'}
              </span>
            </div>

            {/* Comments & Remarks (তার ব্যাপারে মন্তব্য) */}
            {comment && (
              <div className={`relative p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed italic ${
                isDark
                  ? 'bg-neutral-950/70 border-neutral-800 text-neutral-300'
                  : 'bg-white/95 border-amber-200 text-slate-800 shadow-xs'
              }`}>
                <Quote className="w-5 h-5 text-amber-500/40 absolute -top-2.5 -left-2 fill-amber-500/20" />
                <p className="relative z-10 pl-2">
                  "{comment}"
                </p>
                <div className={`mt-2 flex items-center justify-between text-[11px] not-italic font-sans border-t pt-2 ${
                  isDark ? 'border-neutral-800/60 text-neutral-400' : 'border-slate-200 text-slate-600'
                }`}>
                  <span className="font-semibold text-amber-600 dark:text-amber-500">
                    — সাইফুল এন্টারপ্রাইজ ম্যানেজমেন্ট মূল্যায়ন
                  </span>
                  <span className="flex items-center gap-1 text-rose-500">
                    <Heart className="w-3 h-3 fill-rose-500" />
                    <span>{language === 'bn' ? 'অসাধারণ কর্মনিষ্ঠা' : 'Star Performer'}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Video Player Tribute Modal with Blurred Background and AI Robots on Left & Right */}
      {isVideoModalOpen && (
        <VideoTributeModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={videoUrl}
          name={name}
          role={role}
          month={month}
          comment={comment}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          language={language}
        />
      )}
    </>
  );
};

// ----------------------------------------------------
// FULLSCREEN BLURRED BACKGROUND VIDEO TRIBUTE MODAL
// WITH DUAL AI ROBOT CHEERLEADERS ANIMATION
// ----------------------------------------------------
export interface VideoTributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  name: string;
  role: string;
  month: string;
  comment: string;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  language: string;
}

export const VideoTributeModal: React.FC<VideoTributeModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  name,
  role,
  month,
  comment,
  isMuted,
  setIsMuted,
  language
}) => {
  if (!isOpen) return null;
  const parsed = parseVideoSource(videoUrl, { autoplay: true, muted: isMuted });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-in fade-in duration-300"
    >
      {/* 1. Deep Blurred Background Glass Overlay (সমস্ত কিছু ব্লার হবে) */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-2xl backdrop-saturate-150 transition-all cursor-pointer"
      />

      {/* Subtle liquid glow orbs in the background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sky-500/15 blur-[120px] pointer-events-none" />

      {/* 2. Main Center Content Flex Container */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between gap-3 sm:gap-6 pointer-events-none">
        
        {/* LEFT AI ROBOT (রোবট ১: ফুল ও শুভেচ্ছা জানিয়ে হাত নাড়ছে) */}
        <div className="hidden md:flex flex-col items-center shrink-0 w-44 lg:w-56 pointer-events-auto animate-robot-float">
          {/* Robot Speech Bubble */}
          <div className="mb-3 px-3 py-2 rounded-2xl bg-white/95 dark:bg-neutral-900/95 border-2 border-sky-400/50 shadow-xl backdrop-blur-md text-center max-w-[170px] relative animate-bounce">
            <span className="text-[11px] font-black text-sky-600 dark:text-sky-400 block leading-tight">
              🎉 {language === 'bn' ? 'অভিনন্দন আপনাকে!' : 'Congratulations!'}
            </span>
            <span className="text-[10px] font-semibold text-slate-700 dark:text-neutral-300 block mt-0.5 leading-snug">
              {language === 'bn' ? 'অসাধারণ কর্মনিষ্ঠা ও সাফল্য!' : 'Star Worker of the Month!'}
            </span>
            {/* Bubble arrow tip */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-neutral-900 border-r-2 border-b-2 border-sky-400/50 rotate-45" />
          </div>

          {/* SVG Animated Futuristic AI Robot Left */}
          <div className="relative w-28 h-28 lg:w-36 lg:h-36 drop-shadow-[0_12px_24px_rgba(14,165,233,0.35)]">
            <svg viewBox="0 0 120 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="robotBodyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
                <linearGradient id="robotVisorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>

              {/* Antenna */}
              <line x1="60" y1="18" x2="60" y2="8" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              <circle cx="60" cy="7" r="4" fill="#fbbf24" className="animate-pulse" />

              {/* Head */}
              <rect x="36" y="18" width="48" height="36" rx="14" fill="url(#robotBodyGrad1)" stroke="#e0f2fe" strokeWidth="2" />
              
              {/* Eye Visor Glass */}
              <rect x="42" y="26" width="36" height="16" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="52" cy="34" r="3.5" fill="#38bdf8" className="animate-ping" />
              <circle cx="52" cy="34" r="3.5" fill="#38bdf8" />
              <circle cx="68" cy="34" r="3.5" fill="#38bdf8" className="animate-ping" />
              <circle cx="68" cy="34" r="3.5" fill="#38bdf8" />
              {/* Cute digital smile */}
              <path d="M54 38 Q60 41 66 38" stroke="#38bdf8" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Ears/Side Audios */}
              <rect x="32" y="28" width="4" height="12" rx="2" fill="#fbbf24" />
              <rect x="84" y="28" width="4" height="12" rx="2" fill="#fbbf24" />

              {/* Neck */}
              <rect x="54" y="54" width="12" height="6" rx="2" fill="#64748b" />

              {/* Body Torso */}
              <rect x="34" y="60" width="52" height="42" rx="12" fill="url(#robotBodyGrad1)" stroke="#e0f2fe" strokeWidth="2" />
              {/* Chest Heart / Core Reactor */}
              <circle cx="60" cy="78" r="9" fill="#0284c7" stroke="#e0f2fe" strokeWidth="1.5" />
              <path d="M57 76 C57 73 60 73 60 75 C60 73 63 73 63 76 C63 79 60 81 60 82 C60 81 57 79 57 76 Z" fill="#fbbf24" />

              {/* Left Hand Holding Sparkling Trophy/Flower */}
              <path d="M34 68 Q20 72 20 85" stroke="url(#robotBodyGrad1)" strokeWidth="7" fill="none" strokeLinecap="round" />
              <circle cx="18" cy="88" r="6" fill="#fbbf24" />
              <text x="14" y="92" fontSize="10">💐</text>

              {/* Right Waving Hand (Animated Waving!) */}
              <g className="animate-robot-wave">
                <path d="M86 68 Q100 55 106 42" stroke="url(#robotBodyGrad1)" strokeWidth="7" fill="none" strokeLinecap="round" />
                <circle cx="107" cy="40" r="5" fill="#e0f2fe" />
                <text x="102" y="38" fontSize="12">👋</text>
              </g>
            </svg>
          </div>

          <div className="mt-2 text-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-500/20 text-sky-300 border border-sky-400/30">
              🤖 AI Cheer Bot Alpha
            </span>
          </div>
        </div>

        {/* 3. CENTER VIDEO CARD (আইফোনের পানির গ্লাস স্টাইল ফ্রেম ও নিখুঁত ভিডিও প্লেয়ার) */}
        <div className="flex-1 max-w-2xl w-full pointer-events-auto rounded-3xl overflow-hidden bg-neutral-950/90 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)] backdrop-blur-xl animate-in zoom-in-95 duration-300">
          
          {/* Video Modal Top Bar */}
          <div className="px-4 py-3 bg-gradient-to-r from-amber-600/30 via-neutral-900 to-sky-600/30 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <span className="text-xs sm:text-sm font-black text-white truncate max-w-xs sm:max-w-md">
                🏆 {name} — {language === 'bn' ? 'মাসের সেরা কর্মীর সম্মাননা ভিডিও' : 'Employee Tribute Video'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* External Link button if YouTube / Facebook */}
              {parsed.originalUrl && (parsed.type === 'youtube' || parsed.type === 'facebook') && (
                <a
                  href={parsed.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {/* Mute/Unmute Toggle (only for HTML5 video) */}
              {(parsed.type === 'direct' || parsed.type === 'upload') && (
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-500/80 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Close Video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Video Container (Responsive 16:9 Aspect Ratio) */}
          <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
            {parsed.type === 'youtube' && parsed.embedUrl ? (
              <iframe
                src={parsed.embedUrl}
                title={`${name} Tribute Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : parsed.type === 'facebook' && parsed.embedUrl ? (
              <iframe
                src={parsed.embedUrl}
                title={`${name} Facebook Tribute Video`}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video
                src={parsed.originalUrl || videoUrl}
                autoPlay
                loop
                controls
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Video Modal Bottom Info Banner */}
          <div className="p-4 sm:p-5 bg-neutral-900/90 border-t border-white/10 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                  <span>{name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    {month}
                  </span>
                </h4>
                <p className="text-xs font-semibold text-emerald-400">
                  {role}
                </p>
              </div>

              {/* 5-Star Honor Badge */}
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>5.0 / 5.0 Star Performer</span>
              </div>
            </div>

            {comment && (
              <p className="text-xs text-neutral-300 leading-relaxed italic border-l-2 border-amber-500 pl-3 pt-0.5">
                "{comment}"
              </p>
            )}
          </div>
        </div>

        {/* RIGHT AI ROBOT (রোবট ২: সম্মাননা মেডেল ও ট্রফি নিয়ে শুভেচ্ছা জানাচ্ছে) */}
        <div className="hidden md:flex flex-col items-center shrink-0 w-44 lg:w-56 pointer-events-auto animate-robot-float">
          {/* Robot Speech Bubble */}
          <div className="mb-3 px-3 py-2 rounded-2xl bg-white/95 dark:bg-neutral-900/95 border-2 border-emerald-400/50 shadow-xl backdrop-blur-md text-center max-w-[170px] relative animate-bounce">
            <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 block leading-tight">
              🌟 {language === 'bn' ? 'দারুণ কাজ, স্যালুট!' : 'Great Work, Salute!'}
            </span>
            <span className="text-[10px] font-semibold text-slate-700 dark:text-neutral-300 block mt-0.5 leading-snug">
              {language === 'bn' ? 'আপনার সেবায় আমরা গর্বিত!' : 'Proud of your hard work!'}
            </span>
            {/* Bubble arrow tip */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-neutral-900 border-r-2 border-b-2 border-emerald-400/50 rotate-45" />
          </div>

          {/* SVG Animated Futuristic AI Robot Right */}
          <div className="relative w-28 h-28 lg:w-36 lg:h-36 drop-shadow-[0_12px_24px_rgba(16,185,129,0.35)]">
            <svg viewBox="0 0 120 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="robotBodyGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="50%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>

              {/* Antenna */}
              <line x1="60" y1="18" x2="60" y2="8" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
              <circle cx="60" cy="7" r="4" fill="#38bdf8" className="animate-pulse" />

              {/* Head */}
              <rect x="36" y="18" width="48" height="36" rx="14" fill="url(#robotBodyGrad2)" stroke="#d1fae5" strokeWidth="2" />
              
              {/* Eye Visor Glass */}
              <rect x="42" y="26" width="36" height="16" rx="8" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />
              <circle cx="52" cy="34" r="3.5" fill="#34d399" className="animate-ping" />
              <circle cx="52" cy="34" r="3.5" fill="#34d399" />
              <circle cx="68" cy="34" r="3.5" fill="#34d399" className="animate-ping" />
              <circle cx="68" cy="34" r="3.5" fill="#34d399" />
              {/* Cute digital smile */}
              <path d="M54 38 Q60 41 66 38" stroke="#34d399" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Ears */}
              <rect x="32" y="28" width="4" height="12" rx="2" fill="#38bdf8" />
              <rect x="84" y="28" width="4" height="12" rx="2" fill="#38bdf8" />

              {/* Neck */}
              <rect x="54" y="54" width="12" height="6" rx="2" fill="#64748b" />

              {/* Body Torso */}
              <rect x="34" y="60" width="52" height="42" rx="12" fill="url(#robotBodyGrad2)" stroke="#d1fae5" strokeWidth="2" />
              {/* Chest Core Reactor */}
              <circle cx="60" cy="78" r="9" fill="#047857" stroke="#d1fae5" strokeWidth="1.5" />
              <polygon points="60,72 63,77 68,78 64,81 65,86 60,83 55,86 56,81 52,78 57,77" fill="#fbbf24" />

              {/* Left Waving Hand (Animated Waving!) */}
              <g className="animate-robot-wave">
                <path d="M34 68 Q20 55 14 42" stroke="url(#robotBodyGrad2)" strokeWidth="7" fill="none" strokeLinecap="round" />
                <circle cx="13" cy="40" r="5" fill="#d1fae5" />
                <text x="6" y="38" fontSize="12">👋</text>
              </g>

              {/* Right Hand Holding Gold Star Trophy */}
              <path d="M86 68 Q100 72 100 85" stroke="url(#robotBodyGrad2)" strokeWidth="7" fill="none" strokeLinecap="round" />
              <circle cx="102" cy="88" r="6" fill="#fbbf24" />
              <text x="96" y="92" fontSize="10">🏆</text>
            </svg>
          </div>

          <div className="mt-2 text-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              🤖 AI Cheer Bot Beta
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
