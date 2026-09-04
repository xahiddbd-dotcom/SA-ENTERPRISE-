import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
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
  const { isDark } = useTheme();

  return (
    <section id="tejgaon-special-section" className="py-8">
      <div className="container mx-auto px-4">
        <div
          className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all duration-300 shadow-xl ${
            isDark
              ? 'bg-gradient-to-br from-emerald-950/70 via-neutral-900 to-teal-950/60 border-emerald-500/30 shadow-2xl'
              : 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/90 border-emerald-200/90 shadow-slate-200/50'
          }`}
        >
          {/* Subtle glowing elements */}
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Col: Info & Highlight */}
            <div className="lg:col-span-7 space-y-4">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold border ${
                  isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-emerald-100/90 text-emerald-800 border-emerald-300/80 shadow-xs'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('tejgaon_special_badge')}</span>
              </div>

              <h2
                className={`text-2xl sm:text-3xl font-extrabold leading-snug ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {t('tejgaon_special_title')}
              </h2>

              <p
                className={`text-sm leading-relaxed ${
                  isDark ? 'text-neutral-300' : 'text-slate-600 font-medium'
                }`}
              >
                {t('tejgaon_special_desc')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { icon: CheckCircle2, textBn: 'অনার্স, ডিগ্রি ও এইচএসসি ভর্তি ফরম', textEn: 'Honors, Degree & HSC Form' },
                  { icon: CreditCard, textBn: 'সোনালী ই-সেবা ও সেমিস্টার ফি জমা', textEn: 'Sonali e-Sheba & College Fees' },
                  { icon: FileCheck, textBn: 'এনইউ মূল সনদ ও মার্কশীট আবেদন', textEn: 'NU Certificate & Transcript' },
                  { icon: Clock, textBn: '৫-১৫ মিনিটে দ্রুত কাজ সম্পন্ন', textEn: 'Fast 5-15 Min Processing' }
                ].map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs transition-colors ${
                        isDark
                          ? 'bg-neutral-900/80 border-neutral-800 text-neutral-200'
                          : 'bg-white/90 border-slate-200 text-slate-800 shadow-xs'
                      }`}
                    >
                      <ItemIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-medium">{language === 'bn' ? item.textBn : item.textEn}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  id="tejgaon-admission-btn"
                  onClick={() => onSelectService('srv_tc_admission')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/30 transition-all active:scale-95"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ভর্তি ফরম পূরণ সেবা' : 'Admission Form Service'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="tejgaon-fees-btn"
                  onClick={() => onSelectService('srv_tc_fees')}
                  className={`px-5 py-2.5 rounded-xl border font-semibold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xs ${
                    isDark
                      ? 'bg-neutral-900 border-emerald-500/40 hover:border-emerald-400 text-white'
                      : 'bg-white border-slate-200 hover:border-emerald-500 text-slate-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <span>{language === 'bn' ? 'কলেজ ফি জমা দিন' : 'Pay College Fees'}</span>
                </button>
              </div>
            </div>

            {/* Right Col: Location & Quick Shop Box */}
            <div
              className={`lg:col-span-5 border rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm ${
                isDark
                  ? 'bg-neutral-950/80 border-neutral-800'
                  : 'bg-white/95 border-slate-200'
              }`}
            >
              <div
                className={`flex items-center justify-between pb-3 border-b ${
                  isDark ? 'border-neutral-800' : 'border-slate-200'
                }`}
              >
                <div
                  className={`flex items-center gap-2 font-semibold text-sm ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-rose-500 animate-bounce" />
                  <span>{language === 'bn' ? 'দোকানের সঠিক অবস্থান' : 'Exact Location'}</span>
                </div>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                    isDark
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  দোকান নং ০২
                </span>
              </div>

              <p
                className={`text-xs leading-relaxed ${
                  isDark ? 'text-neutral-300' : 'text-slate-600'
                }`}
              >
                <strong className={isDark ? 'text-white' : 'text-slate-900'}>
                  সাগর-সৈকত মার্কেট (দোকান নং ০২)
                </strong>
                , ইন্দিরা রোড, তেজগাঁও কলেজের প্রধান গেটের পাশেই।
              </p>

              <div
                className={`rounded-xl p-3.5 text-xs space-y-2 border ${
                  isDark
                    ? 'bg-neutral-900/90 border-neutral-800 text-neutral-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>হোয়াটসঅ্যাপ ও বিকাশ:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {settings.whatsappNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>সরাসরি কল:</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {settings.phonePrimary}
                  </span>
                </div>
              </div>

              <div
                className={`text-[11px] p-3 rounded-xl border ${
                  isDark
                    ? 'text-neutral-400 bg-amber-950/30 border-amber-500/20'
                    : 'text-amber-950 bg-amber-50 border-amber-200'
                }`}
              >
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
