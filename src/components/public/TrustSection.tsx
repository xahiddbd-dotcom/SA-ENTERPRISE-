import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Zap,
  ShieldCheck,
  Users,
  Printer,
  HeartHandshake,
  Headphones,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const TrustSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { isDark } = useTheme();

  const trustItems = [
    {
      icon: Zap,
      titleBn: 'দ্রুত সেবা ও ইনস্ট্যান্ট ডেলিভারি',
      titleEn: 'Superfast Service & Delivery',
      descBn: 'ফটো ল্যাব প্রিন্ট ও জরুরি কম্পোজ ৫-১০ মিনিটের মধ্যে প্রস্তুত করে দেওয়া হয়।',
      descEn: 'Instant 5-10 minute passport photo printing and urgent typing support.'
    },
    {
      icon: ShieldCheck,
      titleBn: '১০০% নির্ভুল অনলাইন আবেদন',
      titleEn: 'Accurate Online Form Fill-up',
      descBn: 'অভিজ্ঞ অপারেটর দ্বারা সতর্কতার সাথে কলেজ ভর্তি, সরকারি চাকরি ও ডিফেন্স ফরম পূরণ।',
      descEn: 'Meticulous verification of quotas, codes, and documents to prevent errors.'
    },
    {
      icon: Users,
      titleBn: 'অভিজ্ঞ ও দক্ষ অপারেটর টিম',
      titleEn: 'Experienced Technical Staff',
      descBn: 'গত ৮ বছর ধরে ফার্মগেটে হাজারো শিক্ষার্থী ও চাকরিপ্রার্থীদের নির্ভরযোগ্য সেবা।',
      descEn: '8+ years of dedicated service assisting students and job candidates.'
    },
    {
      icon: Printer,
      titleBn: 'আধুনিক কম্পিউটার ও ফটো ল্যাব',
      titleEn: 'Modern Laser & Photo Lab',
      descBn: 'হাই-রেজ্যুলেশন লেজার প্রিন্টার, ওয়াটারপ্রুফ ফটো পেপার এবং ভারী ফটোকপি সুবিধা।',
      descEn: 'High-DPI laser printing, waterproof studio photo paper, and heavy duty copiers.'
    },
    {
      icon: HeartHandshake,
      titleBn: 'শিক্ষার্থীবান্ধব সাশ্রয়ী মূল্য',
      titleEn: 'Student-Friendly Pricing',
      descBn: 'তেজগাঁও কলেজ ও ফার্মগেটের শিক্ষার্থীদের জন্য বিশেষ প্যাকেজ ও ডিসকাউন্ট।',
      descEn: 'Special affordable packages and seasonal discounts for college students.'
    },
    {
      icon: Headphones,
      titleBn: 'সহজ ও সরাসরি যোগাযোগ',
      titleEn: 'Direct Phone & WhatsApp Support',
      descBn: 'হোয়াটসঅ্যাপে ফাইল পাঠিয়ে সরাসরি প্রিন্ট ও পেমেন্ট করার সুব্যবস্থা।',
      descEn: 'Send documents via WhatsApp or Email and pick up freshly printed copies anytime.'
    }
  ];

  return (
    <section
      id="trust-section"
      className={`py-16 border-y transition-colors duration-300 ${
        isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-slate-50/90 border-slate-200'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDark
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>{language === 'bn' ? 'আমাদের বিশেষত্ব ও বিশ্বাসযোগ্যতা' : 'Why We Are Trusted'}</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('why_saiful_title')}
          </h2>

          <p className={`text-xs sm:text-sm ${isDark ? 'text-neutral-400' : 'text-slate-600 font-medium'}`}>
            {language === 'bn'
              ? 'আমরা প্রতিটি গ্রাহকের সময়, ডকুমেন্ট নিরাপত্তা ও তথ্যের গোপনীয়তাকে সর্বোচ্চ অগ্রাধিকার দিই।'
              : 'Prioritizing document safety, data privacy, and prompt assistance for every client.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`border rounded-2xl p-6 transition-all flex flex-col justify-between shadow-xs ${
                  isDark
                    ? 'bg-neutral-950/80 border-neutral-800/80 hover:border-emerald-500/30 hover:bg-neutral-900/60'
                    : 'bg-white/95 border-slate-200/90 hover:border-emerald-400 hover:shadow-md'
                }`}
              >
                <div className="space-y-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      isDark
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className={`text-base font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {language === 'bn' ? item.titleBn : item.titleEn}
                  </h3>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                    {language === 'bn' ? item.descBn : item.descEn}
                  </p>
                </div>

                <div className={`pt-4 mt-2 flex items-center gap-1 text-[11px] font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'গ্যারান্টিযুক্ত সেবা' : 'Verified Quality'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
