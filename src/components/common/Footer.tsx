import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
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

  const handleLinkClick = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-neutral-950 border-t border-neutral-800 text-neutral-300 text-sm mt-20">
      {/* Upper footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg text-white block">
                  {language === 'bn' ? settings.businessNameBn : settings.businessName}
                </span>
                <span className="text-xs text-emerald-400">
                  {language === 'bn' ? 'ডিজিটাল সার্ভিস সেন্টার' : 'Digital Service Center'}
                </span>
              </div>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed">
              {language === 'bn'
                ? 'কম্পিউটার টাইপিং, কালার ও লেজার প্রিন্টিং, ফটো ল্যাব, ফটোকপি, সরকারি ও ডিফেন্স চাকরির আবেদন এবং তেজগাঁও কলেজের ভর্তি সহায়তা।'
                : 'Computer typing, laser printing, instant photo lab, high-speed photocopy, government & defense recruitment application, and Tejgaon College admission assistance.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <div className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-pink-500" />
                <span>bKash: {settings.bkashNumber}</span>
              </div>
              <div className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] text-amber-400 font-medium flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                <span>Nagad: {settings.nagadNumber}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Important Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 border-l-2 border-emerald-500 pl-2">
              {language === 'bn' ? 'বিশেষ সেবাসমূহ' : 'Featured Services'}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="hover:text-emerald-400 cursor-pointer flex items-center gap-1" onClick={() => handleLinkClick('services')}>
                <ChevronRight className="w-3 h-3 text-emerald-500" />
                <span>{language === 'bn' ? 'তেজগাঁও কলেজ ভর্তি ও ফি পেমেন্ট' : 'Tejgaon College Admission & Fees'}</span>
              </li>
              <li className="hover:text-emerald-400 cursor-pointer flex items-center gap-1" onClick={() => handleLinkClick('services')}>
                <ChevronRight className="w-3 h-3 text-emerald-500" />
                <span>{language === 'bn' ? 'বিএমইটি (BMET) ডাটাবেজ রেজিস্ট্রেশন' : 'BMET Foreign Registration'}</span>
              </li>
              <li className="hover:text-emerald-400 cursor-pointer flex items-center gap-1" onClick={() => handleLinkClick('services')}>
                <ChevronRight className="w-3 h-3 text-emerald-500" />
                <span>{language === 'bn' ? 'অনলাইন পুলিশ ক্লিয়ারেন্স আবেদন' : 'Police Clearance Application'}</span>
              </li>
              <li className="hover:text-emerald-400 cursor-pointer flex items-center gap-1" onClick={() => handleLinkClick('services')}>
                <ChevronRight className="w-3 h-3 text-emerald-500" />
                <span>{language === 'bn' ? 'সেনা, নৌ ও বিমানবাহিনী আবেদন' : 'Defense Recruitment Assistance'}</span>
              </li>
              <li className="hover:text-emerald-400 cursor-pointer flex items-center gap-1" onClick={() => handleLinkClick('services')}>
                <ChevronRight className="w-3 h-3 text-emerald-500" />
                <span>{language === 'bn' ? 'জরুরি পাসপোর্ট সাইজ ছবি (ল্যাব প্রিন্ট)' : 'Urgent Passport Photo Print'}</span>
              </li>
              <li className="hover:text-emerald-400 cursor-pointer flex items-center gap-1" onClick={() => handleLinkClick('shop')}>
                <ChevronRight className="w-3 h-3 text-emerald-500" />
                <span>{language === 'bn' ? 'A4 পেপার (৭০/৮০ GSM) ও ফটো পেপার' : 'A4 Paper (70/80 GSM) & Photo Paper'}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Portals & Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 border-l-2 border-emerald-500 pl-2">
              {language === 'bn' ? 'পোর্টালে প্রবেশ' : 'System Portals'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  id="footer-admin-btn"
                  onClick={() => handleLinkClick('admin')}
                  className="text-left text-neutral-300 hover:text-emerald-400 flex items-center gap-2 transition-colors"
                >
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>{t('admin_login')} (Full CMS)</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-staff-btn"
                  onClick={() => handleLinkClick('staff')}
                  className="text-left text-neutral-300 hover:text-teal-400 flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span>{t('staff_login')} & POS Counter</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-app-track-btn"
                  onClick={() => handleLinkClick('applications')}
                  className="text-left text-neutral-300 hover:text-emerald-400 flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-neutral-400" />
                  <span>{t('applications')}</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-shop-btn"
                  onClick={() => handleLinkClick('shop')}
                  className="text-left text-neutral-300 hover:text-emerald-400 flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-neutral-400" />
                  <span>{t('shop')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Shop Location & Direct Contacts */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm mb-4 border-l-2 border-emerald-500 pl-2">
              {language === 'bn' ? 'ঠিকানা ও যোগাযোগ' : 'Address & Contact'}
            </h4>

            <div className="text-xs text-neutral-300 space-y-2">
              <p className="flex items-start gap-2 text-neutral-400">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{language === 'bn' ? settings.addressBn : settings.address}</span>
              </p>

              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href={`tel:${settings.phonePrimary}`} className="text-white hover:text-emerald-400 font-mono">
                  {settings.phonePrimary}
                </a>
                <span>,</span>
                <a href={`tel:${settings.phoneSecondary}`} className="text-white hover:text-emerald-400 font-mono">
                  {settings.phoneSecondary}
                </a>
              </p>

              <p className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href={`https://wa.me/88${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline font-mono"
                >
                  WhatsApp: {settings.whatsappNumber}
                </a>
              </p>

              <p className="flex items-center gap-2 text-neutral-400">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{language === 'bn' ? settings.openingHoursBn : settings.openingHours}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="mt-10 p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-[11px] text-neutral-400 leading-relaxed text-center">
          {t('disclaimer_notice')}
        </div>
      </div>

      {/* Bottom copyright line */}
      <div className="border-t border-neutral-900 bg-neutral-950/80 py-4 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>20/1, Sagar-Saikat Market, Indira Road, Farmgate, Dhaka</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
