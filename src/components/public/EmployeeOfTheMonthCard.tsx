import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { triggerThanosSnap } from '../common/ThanosSnapEffect';
import { Award, Star, Sparkles, Quote, Heart } from 'lucide-react';

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
  const [clicked, setClicked] = useState(false);

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

  const handlePhotoClick = () => {
    setClicked(true);
    triggerThanosSnap();
    setTimeout(() => setClicked(false), 2000);
  };

  if (variant === 'badge') {
    return (
      <div
        onClick={handlePhotoClick}
        title={language === 'bn' ? 'মাসের সেরা কর্মী (ক্লিক করলে থ্যানোস স্ন্যাপ হবে! 🫰)' : 'Employee of the Month (Click for Thanos Snap! 🫰)'}
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
          <span className="absolute -bottom-1 -right-1 text-[10px]">🫰</span>
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
    );
  }

  return (
    <div
      id="employee-of-the-month-section"
      className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-neutral-900 via-amber-950/20 to-neutral-900 border-amber-500/30 shadow-2xl shadow-amber-950/40'
          : 'bg-gradient-to-br from-white via-amber-50/60 to-white border-amber-200 shadow-xl shadow-amber-100/50'
      } ${className}`}
    >
      {/* Decorative Golden Orbs & Sparks */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8">
          {/* Worker Photo Column with Interactive Snap Trigger */}
          <div className="relative shrink-0 text-center flex flex-col items-center">
            <div
              onClick={handlePhotoClick}
              className={`relative cursor-pointer group rounded-full p-1.5 transition-all duration-300 hover:scale-105 active:scale-95 ${
                clicked ? 'animate-ping' : ''
              }`}
              title={
                language === 'bn'
                  ? 'ছবিতে ক্লিক করুন এবং পুরো ইন্টারফেসে থ্যানোসের স্ন্যাপ জাদু দেখুন! 🫰✨'
                  : 'Click photo to trigger Thanos Snap disintegration effect! 🫰✨'
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

                {/* Hover Snap Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                  <span className="text-2xl animate-bounce">🫰</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                    Snap Magic!
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
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-500 hover:bg-amber-500/25 transition-all active:scale-95"
            >
              <span>🫰</span>
              <span>{language === 'bn' ? 'ছবিতে ক্লিক করুন (ম্যাজিক)' : 'Click photo for snap magic'}</span>
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
              <span className="text-xs font-bold ml-1.5 text-neutral-400">
                5.0 / 5.0 {language === 'bn' ? '(সার্বক্ষণিক সেরা মূল্যায়ন)' : '(Exceptional Performance)'}
              </span>
            </div>

            {/* Comments & Remarks (তার ব্যাপারে মন্তব্য) */}
            {comment && (
              <div className={`relative p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed italic ${
                isDark
                  ? 'bg-neutral-950/70 border-neutral-800 text-neutral-300'
                  : 'bg-white/80 border-amber-100 text-slate-700 shadow-xs'
              }`}>
                <Quote className="w-5 h-5 text-amber-500/40 absolute -top-2.5 -left-2 fill-amber-500/20" />
                <p className="relative z-10 pl-2">
                  "{comment}"
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] not-italic text-neutral-400 font-sans border-t pt-2 border-neutral-800/40">
                  <span className="font-semibold text-amber-500">
                    — সাইফুল এন্টারপ্রাইজ ম্যানেজমেন্ট মূল্যায়ন
                  </span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <Heart className="w-3 h-3 fill-rose-400" />
                    <span>{language === 'bn' ? 'অসাধারণ কর্মনিষ্ঠা' : 'Star Performer'}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
