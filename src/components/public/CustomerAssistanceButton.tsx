import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CustomerAssistanceModal } from './CustomerAssistanceModal';
import { Headphones, MessageCircleQuestion, HelpCircle, PhoneCall } from 'lucide-react';

export const CustomerAssistanceButton: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-12 right-4 sm:bottom-14 sm:right-6 z-40 print:hidden">
        <button
          id="customer-assistance-floating-btn"
          onClick={() => setIsOpen(true)}
          type="button"
          aria-label={language === 'bn' ? 'গ্রাহক সহায়তা ও সরাসরি যোগাযোগ' : 'Customer assistance and live help'}
          className="group relative flex items-center gap-2.5 px-4 py-3 sm:px-4.5 sm:py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/25 hover:shadow-xl hover:shadow-emerald-600/30 border border-emerald-400/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
          title={language === 'bn' ? 'সহায়তা প্রয়োজন? ক্লিক করুন' : 'Need help? Click for quick support'}
        >
          {/* Friendly Icon with calm online indicator */}
          <div className="relative flex items-center justify-center shrink-0">
            <Headphones className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white transition-transform duration-200 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-60" style={{ animationDuration: '3s' }} />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300 border border-emerald-700" />
            </span>
          </div>

          {/* Simple, Friendly Label */}
          <div className="flex flex-col items-start leading-none pr-0.5">
            <span className="text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap">
              {language === 'bn' ? 'সহায়তা ও সাপোর্ট' : 'Help & Support'}
            </span>
          </div>
        </button>
      </div>

      <CustomerAssistanceModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
