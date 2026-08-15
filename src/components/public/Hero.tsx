import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
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
  MapPin
} from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: string) => void;
  openServiceModal?: (serviceId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  const { language, t } = useLanguage();
  const { settings } = useData();

  return (
    <section id="hero-section" className="relative overflow-hidden pt-6 pb-16 lg:py-20">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* Top Badges & Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>
              {language === 'bn' ? 'ফার্মগেট ও ইন্দিরা রোডের বিশ্বস্ত ডিজিটাল সেন্টার' : 'Trusted Digital Center in Farmgate'}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {language === 'bn' ? 'তেজগাঁও কলেজের ঠিক পাশে' : 'Beside Tejgaon College'}
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'bn' ? (
              <>
                <span className="block text-emerald-400">Saiful Enterprise</span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl text-neutral-100 font-bold mt-2">
                  আপনার বিশ্বস্ত ডিজিটাল সার্ভিস ও কম্পিউটার সলিউশন সেন্টার
                </span>
              </>
            ) : (
              <>
                <span className="block text-emerald-400">Saiful Enterprise</span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl text-neutral-100 font-bold mt-2">
                  Digital Service, Online Application & Print Solutions
                </span>
              </>
            )}
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('hero_desc')}
          </p>

          {/* Direct CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              id="hero-services-cta"
              onClick={() => setActiveTab('services')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-950/60 hover:brightness-110 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>{t('our_services', 'আমাদের সেবাসমূহ')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-shop-cta"
              onClick={() => setActiveTab('shop')}
              className="px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-100 font-semibold text-sm sm:text-base hover:border-emerald-500/50 hover:bg-neutral-800/80 active:scale-95 transition-all"
            >
              <span>{t('shop_now', 'পেপার ও প্রিন্টিং শপ')}</span>
            </button>

            <a
              id="hero-call-cta"
              href={`tel:${settings.phonePrimary}`}
              className="px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-emerald-400 font-semibold text-sm sm:text-base flex items-center gap-2 hover:border-emerald-500 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>{t('call_now')}</span>
            </a>

            <a
              id="hero-whatsapp-cta"
              href={`https://wa.me/88${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold text-sm sm:text-base flex items-center gap-2 hover:bg-emerald-900/50 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>{t('whatsapp')}</span>
            </a>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
                className="bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 p-3.5 rounded-xl cursor-pointer hover:bg-neutral-850 transition-all flex flex-col items-center text-center gap-2 group"
              >
                <div className={`p-2 rounded-lg bg-neutral-800/80 group-hover:scale-110 transition-transform ${item.color}`}>
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
