import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  MapPin,
  CreditCard,
  FileCheck
} from 'lucide-react';

interface TejgaonSpecialProps {
  onSelectService: (serviceId: string) => void;
}

export const TejgaonSpecial: React.FC<TejgaonSpecialProps> = ({ onSelectService }) => {
  const { language, t } = useLanguage();
  const { settings } = useData();

  return (
    <section id="tejgaon-special-section" className="py-8">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/70 via-neutral-900 to-teal-950/60 border-2 border-emerald-500/30 p-6 sm:p-8 lg:p-10 shadow-2xl">
          {/* Subtle glowing elements */}
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Info & Highlight */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('tejgaon_special_badge')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                {t('tejgaon_special_title')}
              </h2>

              <p className="text-neutral-300 text-sm leading-relaxed">
                {t('tejgaon_special_desc')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === 'bn' ? 'অনার্স, ডিগ্রি ও এইচএসসি ভর্তি ফরম' : 'Honors, Degree & HSC Form'}</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200">
                  <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === 'bn' ? 'সোনালী ই-সেবা ও সেমিস্টার ফি জমা' : 'Sonali e-Sheba & College Fees'}</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200">
                  <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === 'bn' ? 'এনইউ মূল সনদ ও মার্কশীট আবেদন' : 'NU Certificate & Transcript'}</span>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === 'bn' ? '৫-১৫ মিনিটে দ্রুত কাজ সম্পন্ন' : 'Fast 5-15 Min Processing'}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  id="tejgaon-admission-btn"
                  onClick={() => onSelectService('srv_tc_admission')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all active:scale-95"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ভর্তি ফরম পূরণ সেবা' : 'Admission Form Service'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="tejgaon-fees-btn"
                  onClick={() => onSelectService('srv_tc_fees')}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 border border-emerald-500/40 hover:border-emerald-400 text-white font-semibold text-sm flex items-center gap-2 transition-all active:scale-95"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'bn' ? 'কলেজ ফি জমা দিন' : 'Pay College Fees'}</span>
                </button>
              </div>
            </div>

            {/* Right Col: Location & Quick Shop Box */}
            <div className="lg:col-span-5 bg-neutral-950/80 border border-neutral-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <MapPin className="w-4 h-4 text-rose-500 animate-bounce" />
                  <span>{language === 'bn' ? 'দোকানের সঠিক অবস্থান' : 'Exact Location'}</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                  দোকান নং ০২
                </span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                <strong className="text-white">সাগর-সৈকত মার্কেট (দোকান নং ০২)</strong>, ইন্দিরা রোড, তেজগাঁও কলেজের প্রধান গেটের পাশেই।
              </p>

              <div className="bg-neutral-900/90 rounded-lg p-3 text-xs space-y-2 border border-neutral-800">
                <div className="flex justify-between items-center text-neutral-300">
                  <span>হোয়াটসঅ্যাপ ও বিকাশ:</span>
                  <span className="font-mono font-bold text-emerald-400">{settings.whatsappNumber}</span>
                </div>
                <div className="flex justify-between items-center text-neutral-300">
                  <span>সরাসরি কল:</span>
                  <span className="font-mono font-bold text-white">{settings.phonePrimary}</span>
                </div>
              </div>

              <div className="text-[11px] text-neutral-400 bg-amber-950/30 border border-amber-500/20 p-2.5 rounded-lg">
                💡 {language === 'bn'
                  ? 'ভর্তি বা ফি পেমেন্টের জন্য জাতীয় পরিচয়পত্র, রোল ও প্রয়োজনীয় ছবি সাথে নিয়ে আসুন।'
                  : 'Please bring your transcript, roll/reg number and photo soft-copy.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
