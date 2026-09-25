import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CustomerAssistanceModal } from './CustomerAssistanceModal';
import { Headphones, Sparkles, MessageCircleQuestion } from 'lucide-react';

export const CustomerAssistanceButton: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 print:hidden animate-fade-in">
        <button
          id="customer-assistance-floating-btn"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-2xl shadow-emerald-950/60 border border-emerald-400/50 hover:border-emerald-300 hover:scale-105 active:scale-95 transition-all duration-300"
          title={language === 'bn' ? 'স্টাফ সহায়তা ডাকুন (ভয়েস অ্যালার্ট)' : 'Request Staff Assistance (Live Voice Alert)'}
        >
          {/* Subtle Indicator */}
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300 ring-2 ring-emerald-600" />
          </span>

          <div className="p-1 rounded-full bg-white/20">
            <Headphones className="w-4 h-4" />
          </div>

          <div className="text-left">
            <span className="text-xs font-bold block leading-none tracking-wide">
              {language === 'bn' ? 'সহায়তা প্রয়োজন?' : 'Need Assistance?'}
            </span>
            <span className="text-[10px] text-emerald-100 font-medium block leading-tight opacity-90">
              {language === 'bn' ? 'স্টাফ কল করুন 🛎️' : 'Call Counter Staff 🛎️'}
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
