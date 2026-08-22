import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Camera,
  Printer,
  FileText,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

export interface SlideItem {
  id: string;
  type: 'video' | 'photo';
  src: string;
  poster?: string;
  tagEn: string;
  tagBn: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  icon: any;
  accentColor: string;
}

export const SLIDES_DATA: SlideItem[] = [
  {
    id: 'slide-1',
    type: 'video',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-42861-large.mp4',
    poster: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1920&auto=format&fit=crop',
    tagEn: 'Live Digital Counter',
    tagBn: 'লাইভ ডিজিটাল কাউন্টার',
    titleEn: 'Computer & Online Services Hub',
    titleBn: 'কম্পিউটার ও অনলাইন সার্ভিসেস হাব',
    descriptionEn: 'High-speed typing, admission forms, defense & government recruitment center in Farmgate.',
    descriptionBn: 'দ্রুত টাইপিং, ভর্তি ফরম, প্রতিরক্ষা বাহিনী ও সরকারি চাকরির আবেদন কেন্দ্র।',
    icon: Sparkles,
    accentColor: 'emerald'
  },
  {
    id: 'slide-2',
    type: 'photo',
    src: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1920&auto=format&fit=crop',
    tagEn: 'Commercial Printing',
    tagBn: 'কমার্শিয়াল প্রিন্টিং',
    titleEn: 'Heavy Duty Digital Color & B/W Printing',
    titleBn: 'হেভি ডিউটি ডিজিটাল কালার ও সাদা-কালো প্রিন্ট',
    descriptionEn: 'Sharp laser printing, high-speed photocopying, thesis & spiral binding.',
    descriptionBn: 'হাই-স্পিড ফটোকপি, নির্ভুল লেজার প্রিন্ট, প্রজেক্ট ও থিসিস বুক বাইন্ডিং।',
    icon: Printer,
    accentColor: 'sky'
  },
  {
    id: 'slide-3',
    type: 'photo',
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop',
    tagEn: 'Tejgaon College Portal',
    tagBn: 'তেজগাঁও কলেজ পোর্টাল',
    titleEn: 'Academic Forms, NU Marksheet & Fee Deposit',
    titleBn: 'কলেজ ভর্তি, জাতীয় বিশ্ববিদ্যালয় মার্কশীট ও ফি জমা',
    descriptionEn: 'Instant online form submission, admit card download, and verified payment printout.',
    descriptionBn: 'ভর্তি ফরম পূরণ, প্রবেশপত্র ডাউনলোড এবং নিশ্চায়ন ফি পেমেন্ট স্লিপ প্রিন্ট।',
    icon: FileText,
    accentColor: 'amber'
  },
  {
    id: 'slide-4',
    type: 'photo',
    src: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1920&auto=format&fit=crop',
    tagEn: 'Paper & Supply Depot',
    tagBn: 'পেপার ও স্টেশনারি ডিপো',
    titleEn: 'A4, Legal, Double A & Glossy Photo Paper',
    titleBn: 'A4, লিগ্যাল, ডাবল এ ও গ্লসি ফটো পেপার পাইকারি ও খুচরা',
    descriptionEn: 'Premium 70-300 GSM paper reams, sticker paper, ID card lamination sheets.',
    descriptionBn: '৭০ থেকে ৩০০ জিএসএম পেপার রিম, স্টিকার পেপার, ল্যামিনেশন রোল।',
    icon: Package,
    accentColor: 'purple'
  },
  {
    id: 'slide-5',
    type: 'photo',
    src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1920&auto=format&fit=crop',
    tagEn: 'Instant Studio',
    tagBn: 'জরুরি স্টুডিও ফটো',
    titleEn: '5-Minute Biometric Passport & Visa Photo',
    titleBn: '৫ মিনিটে বায়োমেট্রিক পাসপোর্ট ও ভিসা সাইজ ছবি',
    descriptionEn: 'White/blue background change, digital retouching, and premium lab photo print.',
    descriptionBn: 'ব্যাকগ্রাউন্ড পরিবর্তন, ফেস রিটাচ এবং প্রিমিয়াম ল্যাব কোয়ালিটি ছবি ডেলিভারি।',
    icon: Camera,
    accentColor: 'teal'
  }
];

interface HeroBackgroundSliderProps {
  onSlideChange?: (index: number) => void;
}

export const HeroBackgroundSlider: React.FC<HeroBackgroundSliderProps> = ({ onSlideChange }) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const SLIDE_DURATION = 6500; // 6.5s per slide

  // Autoplay slider logic
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % SLIDES_DATA.length);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPlaying]);

  // Safely notify parent of slide changes without setState during rendering
  useEffect(() => {
    onSlideChange?.(currentIndex);
  }, [currentIndex, onSlideChange]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % SLIDES_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const currentSlide = SLIDES_DATA[currentIndex];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none -z-10">
      {/* Slides media container */}
      <div className="relative w-full h-full">
        {SLIDES_DATA.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {slide.type === 'video' ? (
                <div className="relative w-full h-full">
                  {!videoError ? (
                    <video
                      ref={videoRef}
                      src={slide.src}
                      poster={slide.poster}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      onLoadedData={() => setVideoLoaded(true)}
                      onError={() => setVideoError(true)}
                      className="w-full h-full object-cover scale-105 transition-transform duration-[7000ms] ease-out transform"
                      style={{
                        transform: isActive ? 'scale(1.08)' : 'scale(1.0)'
                      }}
                    />
                  ) : (
                    <img
                      src={slide.poster}
                      alt={slide.titleEn}
                      className="w-full h-full object-cover scale-105 transition-transform duration-[7000ms] ease-out"
                      style={{
                        transform: isActive ? 'scale(1.08)' : 'scale(1.0)'
                      }}
                    />
                  )}
                </div>
              ) : (
                <img
                  src={slide.src}
                  alt={slide.titleEn}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover transition-transform duration-[7000ms] ease-out"
                  style={{
                    transform: isActive ? 'scale(1.08)' : 'scale(1.0)'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Multi-layered Dark Vignettes & Gradients for Crisp Text Readability (WCAG AA Compliant) */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-neutral-950/80 to-neutral-950 z-20" />
      <div className="absolute inset-0 bg-radial from-transparent via-neutral-950/70 to-neutral-950/95 z-20" />
      <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] z-20" />

      {/* Ambient glowing orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl z-20 pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl z-20 pointer-events-none" />

      {/* Interactive Controls Overlay Bar (Pointer events enabled for interactive buttons) */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 container mx-auto px-4 pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Slide Info Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/85 backdrop-blur-md border border-neutral-700/60 shadow-xl text-xs text-neutral-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-emerald-300">
            {language === 'bn' ? currentSlide.tagBn : currentSlide.tagEn}
          </span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-400 font-mono text-[11px]">
            {currentIndex + 1} / {SLIDES_DATA.length}
          </span>
          {currentSlide.type === 'video' && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 text-[10px] font-mono uppercase">
              HD Video
            </span>
          )}
        </div>

        {/* Slide Indicators & Navigation Controls */}
        <div className="flex items-center gap-2">
          {/* Prev Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 backdrop-blur-md border border-neutral-700/60 text-neutral-300 hover:text-white transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots / Progress Bars */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-700/60">
            {SLIDES_DATA.map((slide, idx) => {
              const active = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active
                      ? 'w-6 bg-gradient-to-r from-emerald-400 to-teal-400'
                      : 'w-2 bg-neutral-600 hover:bg-neutral-400'
                  }`}
                />
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Slide"
            className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 backdrop-blur-md border border-neutral-700/60 text-neutral-300 hover:text-white transition-all active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Play/Pause Toggle */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 backdrop-blur-md border border-neutral-700/60 text-neutral-300 hover:text-white transition-all active:scale-95 ml-1"
            title={isPlaying ? 'Pause Slide Motion' : 'Resume Slide Motion'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Video Mute Toggle (Shown on video slide) */}
          {currentSlide.type === 'video' && (
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 backdrop-blur-md border border-neutral-700/60 text-neutral-300 hover:text-white transition-all active:scale-95"
              title={isMuted ? 'Unmute Background Audio' : 'Mute Background Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-neutral-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
