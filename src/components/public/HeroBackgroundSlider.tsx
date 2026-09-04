import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Camera,
  Printer,
  FileText,
  Package,
  Layers,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

interface HeroBackgroundSliderProps {
  onSlideChange?: (index: number) => void;
}

export const HeroBackgroundSlider: React.FC<HeroBackgroundSliderProps> = ({ onSlideChange }) => {
  const { language } = useLanguage();
  const { heroSlides, settings } = useData();
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Interval in seconds configured by admin or defaulted to 35 seconds (30-45s)
  const intervalSeconds = Math.max(15, Math.min(90, settings.heroIntervalSeconds || 35));
  const totalDurationMs = intervalSeconds * 1000;
  const backgroundOpacity = typeof settings.heroBackgroundOpacity === 'number' ? settings.heroBackgroundOpacity : 50;

  const slides = (heroSlides && heroSlides.length > 0) ? heroSlides : [
    {
      id: 'default-1',
      type: 'photo' as const,
      src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1920&auto=format&fit=crop',
      tagEn: 'Live Digital Counter',
      tagBn: 'লাইভ ডিজিটাল কাউন্টার',
      titleEn: 'Computer & Online Services Hub',
      titleBn: 'কম্পিউটার ও অনলাইন সার্ভিসেস হাব',
      descriptionEn: 'High-speed typing, admission forms, defense & government recruitment center in Farmgate.',
      descriptionBn: 'দ্রুত টাইপিং, ভর্তি ফরম, প্রতিরক্ষা বাহিনী ও সরকারি চাকরির আবেদন কেন্দ্র।',
      accentColor: 'emerald',
      order: 1
    }
  ];

  // Reset progress & interval handling
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) {
      return;
    }

    setProgress(0);
    const updateFreqMs = 100;
    const progressStep = (updateFreqMs / totalDurationMs) * 100;

    const intervalTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentIndex(curr => (curr + 1) % slides.length);
          return 0;
        }
        return prev + progressStep;
      });
    }, updateFreqMs);

    return () => clearInterval(intervalTimer);
  }, [currentIndex, isPlaying, slides.length, totalDurationMs]);

  // Safely notify parent of slide changes
  useEffect(() => {
    onSlideChange?.(currentIndex);
  }, [currentIndex, onSlideChange]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none -z-10">
      {/* Slides image container with 50% opacity */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'z-10' : 'z-0 pointer-events-none'
              }`}
              style={{
                opacity: isActive ? backgroundOpacity / 100 : 0
              }}
            >
              <img
                src={slide.src}
                alt={slide.titleEn || 'Saiful Enterprise background'}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="w-full h-full object-cover transition-transform duration-[12000ms] ease-out"
                style={{
                  transform: isActive ? 'scale(1.06)' : 'scale(1.0)'
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Multi-layered Vignettes & Soft Gradients for High-Contrast Text Readability */}
      <div
        className={`absolute inset-0 z-20 transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950'
            : 'bg-gradient-to-b from-slate-100/90 via-slate-100/75 to-slate-100/95'
        }`}
      />
      <div
        className={`absolute inset-0 z-20 pointer-events-none transition-colors duration-300 ${
          isDark
            ? 'bg-radial from-transparent via-neutral-950/50 to-neutral-950/90'
            : 'bg-radial from-transparent via-slate-900/5 to-slate-900/15'
        }`}
      />
      <div
        className={`absolute inset-0 z-20 backdrop-blur-[1px] ${
          isDark ? 'bg-neutral-950/20' : 'bg-white/20'
        }`}
      />

      {/* Ambient glowing orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl z-20 pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl z-20 pointer-events-none" />

      {/* Interactive Controls Overlay Bar */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 container mx-auto px-4 pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Slide Info Pill */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-xl text-xs transition-colors ${
            isDark
              ? 'bg-neutral-900/90 border border-neutral-700/70 text-neutral-200'
              : 'bg-white/95 border border-slate-200 text-slate-800 shadow-slate-300/40'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className={`font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
            {language === 'bn' ? currentSlide.tagBn : currentSlide.tagEn}
          </span>
          <span className={isDark ? 'text-neutral-500' : 'text-slate-400'}>•</span>
          <span className={`font-mono text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
            {currentIndex + 1} / {slides.length}
          </span>
          <span
            className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
              isDark
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
            }`}
          >
            {intervalSeconds}s
          </span>
        </div>

        {/* Slide Indicators & Navigation Controls */}
        <div className="flex items-center gap-2">
          {/* Prev Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Slide"
            className={`p-1.5 rounded-lg backdrop-blur-md transition-all active:scale-95 shadow-sm ${
              isDark
                ? 'bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-300 hover:text-white'
                : 'bg-white/95 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots / Progress Bars */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-md shadow-sm ${
              isDark
                ? 'bg-neutral-900/80 border border-neutral-700/60'
                : 'bg-white/95 border border-slate-200'
            }`}
          >
            {slides.map((slide, idx) => {
              const active = idx === currentIndex;
              return (
                <button
                  key={slide.id || idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 overflow-hidden relative ${
                    active
                      ? isDark ? 'w-8 bg-neutral-700' : 'w-8 bg-slate-200'
                      : isDark ? 'w-2 bg-neutral-600 hover:bg-neutral-400' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                >
                  {active && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Slide"
            className={`p-1.5 rounded-lg backdrop-blur-md transition-all active:scale-95 shadow-sm ${
              isDark
                ? 'bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-300 hover:text-white'
                : 'bg-white/95 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Play/Pause Toggle */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            className={`p-1.5 rounded-lg backdrop-blur-md transition-all active:scale-95 ml-1 shadow-sm ${
              isDark
                ? 'bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-300 hover:text-white'
                : 'bg-white/95 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
            title={isPlaying ? 'Pause Slide Motion' : 'Resume Slide Motion'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
