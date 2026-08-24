import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { HeroBackgroundSlider } from './HeroBackgroundSlider';
import {
  Printer,
  Sparkles,
  ArrowRight,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Zap,
  MapPin,
  Clock,
  Store,
  Award
} from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: string) => void;
  openServiceModal?: (serviceId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  const { language, t } = useLanguage();
  const { settings, heroSlides } = useData();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const slides = (heroSlides && heroSlides.length > 0) ? heroSlides : [];
  const currentSlide = slides[activeSlideIndex] || slides[0] || {
    descriptionBn: 'দ্রুত টাইপিং, ভর্তি ফরম, প্রতিরক্ষা বাহিনী ও সরকারি চাকরির আবেদন কেন্দ্র।',
    descriptionEn: 'High-speed typing, admission forms, defense & government recruitment center in Farmgate.'
  };

  const isShopOpen = settings.isShopOpen !== false;

  return (
    <section id="hero-section" className="relative overflow-hidden pt-8 pb-20 lg:py-28 min-h-[580px] lg:min-h-[660px] flex items-center">
      {/* Background Photo & Video Carousel Slide Engine */}
      <HeroBackgroundSlider onSlideChange={idx => setActiveSlideIndex(idx)} />

      <div className="container mx-auto px-4 relative z-20">
        {/* Top Badges & Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-xl backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>
              {language === 'bn' ? 'ফার্মগেট ও ইন্দিরা রোডের বিশ্বস্ত ডিজিটাল সেন্টার' : 'Trusted Digital Center in Farmgate'}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-xl">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'bn' ? 'তেজগাঁও কলেজের ঠিক পাশে' : 'Beside Tejgaon College'}
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-700 text-neutral-300 text-xs font-semibold backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-teal-400" />
            <span>
              {language === 'bn' ? '১৫+ বছরের নির্ভরযোগ্য সেবা' : '15+ Years of Service'}
            </span>
          </div>
        </div>

        {/* Main Headline with High-Contrast Typography & Dynamic Slide Badge */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] drop-shadow-2xl">
              <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
                Saiful Enterprise
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-neutral-100 font-bold mt-2 tracking-normal drop-shadow-lg">
                {language === 'bn' 
                  ? 'আপনার বিশ্বস্ত ডিজিটাল সার্ভিস ও কম্পিউটার সলিউশন সেন্টার'
                  : 'Digital Service, Online Application & Print Solutions'}
              </span>
            </h1>
          </div>

          {/* Dynamic Active Slide Caption Callout */}
          <div className="inline-block transition-all duration-500 ease-out">
            <p className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-900/90 border border-neutral-700 text-xs sm:text-sm text-neutral-200 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-medium">
                {language === 'bn' ? currentSlide.descriptionBn : currentSlide.descriptionEn}
              </span>
            </p>
          </div>

          <p className="text-neutral-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            {t('hero_desc')}
          </p>

          {/* Direct CTA Buttons: আমাদের সেবা / কেনাকাটা / কল করুন / হোয়াটসঅ্যাপ */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              id="hero-services-cta"
              onClick={() => setActiveTab('services')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-emerald-950/80 hover:brightness-110 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>{t('our_services', 'আমাদের সেবা')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-shop-cta"
              onClick={() => setActiveTab('shop')}
              className="px-6 py-3.5 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-neutral-700/90 text-neutral-100 font-bold text-sm sm:text-base hover:border-emerald-500/70 hover:bg-neutral-800 active:scale-95 transition-all shadow-lg shadow-black/50"
            >
              <span>{language === 'bn' ? 'কেনাকাটা / শপ' : 'Shop / Products'}</span>
            </button>

            <a
              id="hero-call-cta"
              href={`tel:${settings.phonePrimary}`}
              className="px-5 py-3.5 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-neutral-700/90 text-emerald-400 font-bold text-sm sm:text-base flex items-center gap-2 hover:border-emerald-500 hover:text-emerald-300 transition-all shadow-lg shadow-black/50"
            >
              <Phone className="w-4 h-4" />
              <span>{language === 'bn' ? 'কল করুন' : 'Call Now'}</span>
            </a>

            <a
              id="hero-whatsapp-cta"
              href={`https://wa.me/88${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3.5 rounded-xl bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-bold text-sm sm:text-base flex items-center gap-2 hover:bg-emerald-900/80 transition-all shadow-lg shadow-emerald-950/50"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
            </a>
          </div>
        </div>

        {/* Quick Highlights Grid with Frosted Glassmorphic Cards */}
        <div className="mt-12 lg:mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { titleBn: 'তেজগাঁও কলেজ ভর্তি', titleEn: 'Tejgaon College Admission', icon: FileCheck, color: 'text-emerald-400' },
            { titleBn: 'বিএমইটি (BMET) আবেদন', titleEn: 'BMET Registration', icon: ShieldCheck, color: 'text-blue-400' },
            { titleBn: 'পুলিশ ক্লিয়ারেন্স', titleEn: 'Police Clearance', icon: ShieldCheck, color: 'text-amber-400' },
            { titleBn: 'সেনা/নৌ/বিমান আবেদন', titleEn: 'Defense Recruitment', icon: Zap, color: 'text-teal-400' },
            { titleBn: 'জরুরি পাসপোর্ট ছবি', titleEn: 'Urgent Passport Photo', icon: Printer, color: 'text-pink-400' },
            { titleBn: 'A4 ও ফটো পেপার', titleEn: 'Paper & Photo Paper', icon: CheckCircle2, color: 'text-emerald-400' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab('services')}
                className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800/80 hover:border-emerald-500/50 p-3.5 rounded-xl cursor-pointer hover:bg-neutral-850 transition-all flex flex-col items-center text-center gap-2 group shadow-lg shadow-black/40"
              >
                <div className={`p-2 rounded-lg bg-neutral-800/90 group-hover:scale-110 transition-transform ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-neutral-200 group-hover:text-white leading-tight">
                  {language === 'bn' ? item.titleBn : item.titleEn}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

