import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
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
  const { isDark } = useTheme();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const slides = (heroSlides && heroSlides.length > 0) ? heroSlides : [];
  const currentSlide = slides[activeSlideIndex] || slides[0] || {
    descriptionBn: 'দ্রুত টাইপিং, ভর্তি ফরম, প্রতিরক্ষা বাহিনী ও সরকারি চাকরির আবেদন কেন্দ্র।',
    descriptionEn: 'High-speed typing, admission forms, defense & government recruitment center in Farmgate.'
  };

  const isShopOpen = settings.isShopOpen !== false;

  return (
    <section id="hero-section" className="relative overflow-hidden pt-8 pb-20 lg:py-24 min-h-[580px] lg:min-h-[660px] flex items-center">
      {/* Background Photo & Video Carousel Slide Engine */}
      <HeroBackgroundSlider onSlideChange={idx => setActiveSlideIndex(idx)} />

      <div className="container mx-auto px-4 relative z-20">
        {/* Top Badges & Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-colors shadow-sm ${
              isDark
                ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 shadow-xl'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
            <span>
              {language === 'bn' ? 'ফার্মগেট ও ইন্দিরা রোডের বিশ্বস্ত ডিজিটাল সেন্টার' : 'Trusted Digital Center in Farmgate'}
            </span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-colors shadow-sm ${
              isDark
                ? 'bg-amber-950/80 border border-amber-500/30 text-amber-300 shadow-xl'
                : 'bg-amber-50 border border-amber-200 text-amber-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {language === 'bn' ? 'তেজগাঁও কলেজের ঠিক পাশে' : 'Beside Tejgaon College'}
            </span>
          </div>

          <div
            className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-colors shadow-sm ${
              isDark
                ? 'bg-neutral-900/80 border border-neutral-700 text-neutral-300'
                : 'bg-slate-100 border border-slate-200 text-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-teal-500" />
            <span>
              {language === 'bn' ? '১৫+ বছরের নির্ভরযোগ্য সেবা' : '15+ Years of Service'}
            </span>
          </div>
        </div>

        {/* Main Headline Container with Card Shape behind text */}
        <div
          className={`max-w-4xl mx-auto rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden backdrop-blur-xl border transition-all duration-300 ${
            isDark
              ? 'bg-neutral-950/75 border-neutral-800/80 shadow-2xl shadow-black/70'
              : 'bg-white/90 border-slate-200/90 shadow-xl shadow-slate-200/60'
          }`}
        >
          {/* Subtle ambient decorative gradient shapes inside the card */}
          <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                <span
                  className={`block ${
                    isDark
                      ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-md'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent'
                  }`}
                >
                  Saiful Enterprise
                </span>
                <span
                  className={`block text-xl sm:text-2xl lg:text-3xl font-bold mt-2 tracking-normal ${
                    isDark ? 'text-neutral-100 drop-shadow-md' : 'text-slate-900'
                  }`}
                >
                  {language === 'bn' 
                    ? 'আপনার বিশ্বস্ত ডিজিটাল সার্ভিস ও কম্পিউটার সলিউশন সেন্টার'
                    : 'Digital Service, Online Application & Print Solutions'}
                </span>
              </h1>
            </div>

            {/* Dynamic Active Slide Caption Callout */}
            <div className="inline-block transition-all duration-500 ease-out">
              <p
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm backdrop-blur-md shadow-sm border ${
                  isDark
                    ? 'bg-neutral-900/90 border-neutral-700 text-neutral-200 shadow-black/40'
                    : 'bg-slate-100/90 border-slate-200 text-slate-800 shadow-slate-200/40'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-medium">
                  {language === 'bn' ? currentSlide.descriptionBn : currentSlide.descriptionEn}
                </span>
              </p>
            </div>

            <p
              className={`text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed ${
                isDark ? 'text-neutral-300 drop-shadow-sm' : 'text-slate-600 font-medium'
              }`}
            >
              {t('hero_desc')}
            </p>

            {/* Direct CTA Buttons: আমাদের সেবা / কেনাকাটা / কল করুন / হোয়াটসঅ্যাপ */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                id="hero-services-cta"
                onClick={() => setActiveTab('services')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-emerald-950/40 hover:brightness-110 active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>{t('our_services', 'আমাদের সেবা')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                id="hero-shop-cta"
                onClick={() => setActiveTab('shop')}
                className={`px-6 py-3.5 rounded-xl backdrop-blur-md font-bold text-sm sm:text-base active:scale-95 transition-all shadow-sm ${
                  isDark
                    ? 'bg-neutral-900/90 border border-neutral-700/90 text-neutral-100 hover:border-emerald-500/70 hover:bg-neutral-800'
                    : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-emerald-500'
                }`}
              >
                <span>{language === 'bn' ? 'কেনাকাটা / শপ' : 'Shop / Products'}</span>
              </button>

              <a
                id="hero-call-cta"
                href={`tel:${settings.phonePrimary}`}
                className={`px-5 py-3.5 rounded-xl backdrop-blur-md font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-sm ${
                  isDark
                    ? 'bg-neutral-900/90 border border-neutral-700/90 text-emerald-400 hover:border-emerald-500 hover:text-emerald-300'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>{language === 'bn' ? 'কল করুন' : 'Call Now'}</span>
              </a>

              <a
                id="hero-whatsapp-cta"
                href={`https://wa.me/88${settings.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className={`px-5 py-3.5 rounded-xl backdrop-blur-md font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-sm ${
                  isDark
                    ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Highlights Grid with Frosted Glassmorphic Cards */}
        <div className="mt-10 lg:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { titleBn: 'তেজগাঁও কলেজ ভর্তি', titleEn: 'Tejgaon College Admission', icon: FileCheck, color: 'text-emerald-500' },
            { titleBn: 'বিএমইটি (BMET) আবেদন', titleEn: 'BMET Registration', icon: ShieldCheck, color: 'text-blue-500' },
            { titleBn: 'পুলিশ ক্লিয়ারেন্স', titleEn: 'Police Clearance', icon: ShieldCheck, color: 'text-amber-500' },
            { titleBn: 'সেনা/নৌ/বিমান আবেদন', titleEn: 'Defense Recruitment', icon: Zap, color: 'text-teal-500' },
            { titleBn: 'জরুরি পাসপোর্ট ছবি', titleEn: 'Urgent Passport Photo', icon: Printer, color: 'text-rose-500' },
            { titleBn: 'A4 ও ফটো পেপার', titleEn: 'Paper & Photo Paper', icon: CheckCircle2, color: 'text-emerald-500' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab('services')}
                className={`backdrop-blur-md p-3.5 rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center gap-2 group shadow-sm ${
                  isDark
                    ? 'bg-neutral-900/80 border border-neutral-800/80 hover:border-emerald-500/50 hover:bg-neutral-850'
                    : 'bg-white/95 border border-slate-200/90 hover:border-emerald-500 hover:shadow-md'
                }`}
              >
                <div
                  className={`p-2 rounded-xl group-hover:scale-110 transition-transform ${
                    isDark ? 'bg-neutral-800/90' : 'bg-slate-100'
                  } ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-semibold leading-tight transition-colors ${
                    isDark
                      ? 'text-neutral-200 group-hover:text-white'
                      : 'text-slate-800 group-hover:text-emerald-700'
                  }`}
                >
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

