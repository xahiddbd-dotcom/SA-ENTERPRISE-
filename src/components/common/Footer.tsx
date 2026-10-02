import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Printer,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Shield,
  FileText,
  CreditCard,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  openAuthModal: (mode?: 'login' | 'register' | 'staff' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, openAuthModal }) => {
  const { language, t } = useLanguage();
  const { settings } = useData();
  const { isDark } = useTheme();

  const handleLinkClick = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      className={`border-t text-sm mt-20 transition-colors duration-200 ${
        isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
      }`}
    >
      {/* Upper footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-950/20">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <span className={`font-bold text-lg block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'bn' ? settings.businessNameBn : settings.businessName}
                </span>
                <span className={`text-xs font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  {language === 'bn' ? 'ডিজিটাল সার্ভিস সেন্টার' : 'Digital Service Center'}
                </span>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
              {language === 'bn'
                ? 'কম্পিউটার টাইপিং, কালার ও লেজার প্রিন্টিং, ফটো ল্যাব, ফটোকপি, সরকারি ও ডিফেন্স চাকরির আবেদন এবং তেজগাঁও কলেজের ভর্তি সহায়তা।'
                : 'Computer typing, laser printing, instant photo lab, high-speed photocopy, government & defense recruitment application, and Tejgaon College admission assistance.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 ${
                isDark ? 'bg-neutral-900 border-neutral-800 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-700 shadow-2xs'
              }`}>
                <CreditCard className="w-3.5 h-3.5 text-pink-500" />
                <span>bKash: {settings.bkashNumber}</span>
              </div>
              <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 ${
                isDark ? 'bg-neutral-900 border-neutral-800 text-amber-400' : 'bg-slate-50 border-slate-200 text-amber-700 shadow-2xs'
              }`}>
                <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                <span>Nagad: {settings.nagadNumber}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Important Services */}
          <div>
            <h4 className={`font-bold text-sm mb-4 border-l-2 border-emerald-500 pl-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {language === 'bn' ? 'বিশেষ সেবাসমূহ' : 'Featured Services'}
            </h4>
            <ul className={`space-y-2 text-xs ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
              <li className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer flex items-center gap-1.5 transition-colors" onClick={() => handleLinkClick('services')}>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{language === 'bn' ? 'তেজগাঁও কলেজ ভর্তি ও ফি পেমেন্ট' : 'Tejgaon College Admission & Fees'}</span>
              </li>
              <li className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer flex items-center gap-1.5 transition-colors" onClick={() => handleLinkClick('services')}>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{language === 'bn' ? 'বিএমইটি (BMET) ডাটাবেজ রেজিস্ট্রেশন' : 'BMET Foreign Registration'}</span>
              </li>
              <li className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer flex items-center gap-1.5 transition-colors" onClick={() => handleLinkClick('services')}>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{language === 'bn' ? 'অনলাইন পুলিশ ক্লিয়ারেন্স আবেদন' : 'Police Clearance Application'}</span>
              </li>
              <li className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer flex items-center gap-1.5 transition-colors" onClick={() => handleLinkClick('services')}>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{language === 'bn' ? 'সেনা, নৌ ও বিমানবাহিনী আবেদন' : 'Defense Recruitment Assistance'}</span>
              </li>
              <li className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer flex items-center gap-1.5 transition-colors" onClick={() => handleLinkClick('services')}>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{language === 'bn' ? 'জরুরি পাসপোর্ট সাইজ ছবি (ল্যাব প্রিন্ট)' : 'Urgent Passport Photo Print'}</span>
              </li>
              <li className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer flex items-center gap-1.5 transition-colors" onClick={() => handleLinkClick('shop')}>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{language === 'bn' ? 'A4 পেপার (৭০/৮০ GSM) ও ফটো পেপার' : 'A4 Paper (70/80 GSM) & Photo Paper'}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Portals & Quick Links */}
          <div>
            <h4 className={`font-bold text-sm mb-4 border-l-2 border-emerald-500 pl-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {language === 'bn' ? 'পোর্টালে প্রবেশ' : 'System Portals'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  id="footer-admin-btn"
                  onClick={() => handleLinkClick('admin')}
                  className={`text-left flex items-center gap-2 transition-colors ${
                    isDark ? 'text-neutral-300 hover:text-emerald-400' : 'text-slate-700 hover:text-emerald-700 font-medium'
                  }`}
                >
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>{t('admin_login')} (Full CMS)</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-staff-btn"
                  onClick={() => handleLinkClick('staff')}
                  className={`text-left flex items-center gap-2 transition-colors ${
                    isDark ? 'text-neutral-300 hover:text-teal-400' : 'text-slate-700 hover:text-teal-700 font-medium'
                  }`}
                >
                  <FileText className="w-4 h-4 text-teal-500" />
                  <span>{t('staff_login')} & POS Counter</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-app-track-btn"
                  onClick={() => handleLinkClick('tracker')}
                  className={`text-left flex items-center gap-2 transition-colors ${
                    isDark ? 'text-neutral-300 hover:text-emerald-400' : 'text-slate-700 hover:text-emerald-700 font-medium'
                  }`}
                >
                  <ExternalLink className="w-4 h-4 text-emerald-500" />
                  <span>{t('applications')} / {language === 'bn' ? 'আবেদন ট্র্যাকিং' : 'Track App'}</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-shop-btn"
                  onClick={() => handleLinkClick('shop')}
                  className={`text-left flex items-center gap-2 transition-colors ${
                    isDark ? 'text-neutral-300 hover:text-emerald-400' : 'text-slate-700 hover:text-emerald-700 font-medium'
                  }`}
                >
                  <ExternalLink className="w-4 h-4 text-emerald-500" />
                  <span>{t('shop')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Shop Location & Direct Contacts */}
          <div className="space-y-3">
            <h4 className={`font-bold text-sm mb-4 border-l-2 border-emerald-500 pl-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {language === 'bn' ? 'ঠিকানা ও যোগাযোগ' : 'Address & Contact'}
            </h4>

            <div className={`text-xs space-y-2.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
              <p className={`flex items-start gap-2 ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{language === 'bn' ? settings.addressBn : settings.address}</span>
              </p>

              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href={`tel:${settings.phonePrimary}`}
                  className={`font-mono font-bold transition-colors ${
                    isDark ? 'text-white hover:text-emerald-400' : 'text-slate-900 hover:text-emerald-700'
                  }`}
                >
                  {settings.phonePrimary}
                </a>
                <span>,</span>
                <a
                  href={`tel:${settings.phoneSecondary}`}
                  className={`font-mono font-bold transition-colors ${
                    isDark ? 'text-white hover:text-emerald-400' : 'text-slate-900 hover:text-emerald-700'
                  }`}
                >
                  {settings.phoneSecondary}
                </a>
              </p>

              <p className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href={`https://wa.me/88${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono font-bold"
                >
                  WhatsApp: {settings.whatsappNumber}
                </a>
              </p>

              <p className={`flex items-center gap-2 ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{language === 'bn' ? settings.openingHoursBn : settings.openingHours}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className={`mt-10 p-3.5 rounded-2xl border text-[11px] leading-relaxed text-center transition-colors ${
          isDark
            ? 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400'
            : 'bg-slate-50 border-slate-200 text-slate-600 shadow-2xs'
        }`}>
          {t('disclaimer_notice')}
        </div>
      </div>

      {/* Bottom copyright line */}
      <div className={`border-t py-4 px-4 transition-colors ${
        isDark ? 'border-neutral-900 bg-neutral-950/80 text-neutral-500' : 'border-slate-100 bg-slate-50 text-slate-500'
      }`}>
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>20/1, Sagar-Saikat Market, Indira Road, Farmgate, Dhaka</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
