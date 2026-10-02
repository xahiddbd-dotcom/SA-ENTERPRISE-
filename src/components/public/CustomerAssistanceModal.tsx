import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  BellRing,
  X,
  Send,
  CheckCircle2,
  Phone,
  User,
  Sparkles,
  GraduationCap,
  Printer,
  ShoppingBag,
  FileText,
  CreditCard,
  Headphones,
  MessageCircle,
  Clock,
  MapPin
} from 'lucide-react';

interface CustomerAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'order_help' | 'print_copy' | 'college_admission' | 'judicial_stamp' | 'payment' | 'general';
}

export const CustomerAssistanceModal: React.FC<CustomerAssistanceModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'general'
}) => {
  const { language } = useLanguage();
  const { createAssistanceRequest, settings } = useData();
  const { currentUser } = useAuth();
  const { isDark } = useTheme();

  const [category, setCategory] = useState<'order_help' | 'print_copy' | 'college_admission' | 'judicial_stamp' | 'payment' | 'general'>(defaultCategory);
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState(language === 'bn' ? 'অনলাইন ওয়েবসাইট' : 'Online Website');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedReqNum, setSubmittedReqNum] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    {
      id: 'college_admission',
      labelEn: 'College Admission',
      labelBn: 'ভর্তি ও অনলাইন আবেদন',
      icon: GraduationCap,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 'print_copy',
      labelEn: 'Photocopy & Printing',
      labelBn: 'ফটোকপি ও প্রিন্টিং',
      icon: Printer,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/30'
    },
    {
      id: 'judicial_stamp',
      labelEn: 'Legal Stamp & Agreement',
      labelBn: 'জুডিশিয়াল স্ট্যাম্প ও দলিল',
      icon: FileText,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/30'
    },
    {
      id: 'order_help',
      labelEn: 'Online Order & Cart',
      labelBn: 'অনলাইন অর্ডার ও পণ্য',
      icon: ShoppingBag,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'payment',
      labelEn: 'bKash / Nagad Payment',
      labelBn: 'পেমেন্ট ও মানি রিসিট',
      icon: CreditCard,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/30'
    },
    {
      id: 'general',
      labelEn: 'Direct Staff / Other',
      labelBn: 'সাধারণ সহায়তা / সরাসরি কথা',
      icon: Headphones,
      color: 'text-teal-500 bg-teal-500/10 border-teal-500/30'
    }
  ];

  const locationPresets = [
    { en: 'Online Website', bn: 'অনলাইন ওয়েবসাইট' },
    { en: 'Counter 1 (Fast Service)', bn: 'কাউন্টার ১ (দ্রুত সেবা)' },
    { en: 'Counter 2 (Admission)', bn: 'কাউন্টার ২ (ভর্তি ডেস্ক)' },
    { en: 'Computer Workstation', bn: 'কম্পিউটার টাইপিং ডেস্ক' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = customerName.trim() || (language === 'bn' ? 'সম্মানিত গ্রাহক' : 'Valued Customer');
    const selectedCat = categories.find(c => c.id === category) || categories[0];

    const newReq = createAssistanceRequest({
      customerName: finalName,
      customerPhone: customerPhone.trim() || undefined,
      category,
      topic: selectedCat.labelEn,
      topicBn: selectedCat.labelBn,
      location: location,
      notes: notes.trim() || undefined
    });

    setSubmittedReqNum(newReq.requestNumber);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedReqNum(null);
    setNotes('');
    onClose();
  };

  const cleanPhone = settings.phonePrimary?.replace(/[^0-9+]/g, '') || '01540004966';
  const cleanWhatsapp = settings.whatsappNumber?.replace(/[^0-9]/g, '') || '01517992585';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh] transition-colors ${
          isDark
            ? 'bg-neutral-900 border-neutral-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Simple & Friendly Header */}
        <div
          className={`flex items-center justify-between p-4 sm:p-5 border-b ${
            isDark ? 'border-neutral-800 bg-neutral-900/90' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight flex items-center gap-2">
                <span>{language === 'bn' ? 'গ্রাহক সহায়তা কেন্দ্র' : 'Customer Help Center'}</span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {language === 'bn' ? 'স্টাফ সক্রিয়' : 'Staff Online'}
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                {language === 'bn'
                  ? 'আপনার যে কোনো প্রশ্ন বা সহায়তায় আমরা সাথে আছি'
                  : 'We are here to assist with all your questions and services'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Quick Direct Actions - Call & WhatsApp (Simplest & Most User Friendly) */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>{language === 'bn' ? 'সরাসরি কল করুন' : 'Call Directly'}</span>
            </a>

            <a
              href={`https://wa.me/88${cleanWhatsapp}?text=${encodeURIComponent(
                language === 'bn'
                  ? 'আসসালামু আলাইকুম, সাইফুল এন্টারপ্রাইজ থেকে কিছু সহায়তা প্রয়োজন ছিল।'
                  : 'Hello, I need assistance regarding Saiful Enterprise services.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ মেসেজ' : 'WhatsApp Chat'}</span>
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 my-1">
            <div className={`h-px flex-1 ${isDark ? 'bg-neutral-800' : 'bg-slate-200'}`} />
            <span className={`text-[11px] font-medium uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
              {language === 'bn' ? 'অথবা কাউন্টার স্টাফ ডাকুন' : 'Or Request Staff Alert'}
            </span>
            <div className={`h-px flex-1 ${isDark ? 'bg-neutral-800' : 'bg-slate-200'}`} />
          </div>

          {isSubmitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">
                  {language === 'bn' ? 'সহায়তা অনুরোধ গ্রহণ করা হয়েছে!' : 'Assistance Request Dispatched!'}
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                  {language === 'bn' ? 'টোকেন নম্বর: ' : 'Token Number: '}
                  <span>{submittedReqNum}</span>
                </p>
                <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                  {language === 'bn'
                    ? 'আমাদের দায়িত্বপ্রাপ্ত স্টাফ আপনার অনুরোধ পেয়েছেন এবং অতি দ্রুত আপনাকে সহায়তা করবেন।'
                    : 'Our staff operator has been notified and is attending to your request immediately.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
              >
                {language === 'bn' ? 'ধন্যবাদ / বন্ধ করুন' : 'Got it / Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Category Picker */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                  {language === 'bn' ? 'কী বিষয়ে সহায়তা প্রয়োজন?' : 'What do you need help with?'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as any)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all text-xs cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600/10 border-emerald-500 ring-1 ring-emerald-500 font-semibold text-emerald-600 dark:text-emerald-300'
                            : isDark
                            ? 'bg-neutral-800/60 border-neutral-700/60 text-neutral-300 hover:bg-neutral-800'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg border shrink-0 ${cat.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate leading-tight">
                          {language === 'bn' ? cat.labelBn : cat.labelEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location Selector */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                  {language === 'bn' ? 'আপনার অবস্থান:' : 'Your Location / Station:'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {locationPresets.map((loc, idx) => {
                    const text = language === 'bn' ? loc.bn : loc.en;
                    const isSelected = location === text;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLocation(text)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : isDark
                            ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        {text}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Phone in one tidy row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                    {language === 'bn' ? 'আপনার নাম (ঐচ্ছিক):' : 'Your Name (Optional):'}
                  </label>
                  <div className="relative">
                    <User className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${isDark ? 'text-neutral-500' : 'text-slate-400'}`} />
                    <input
                      type="text"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder={language === 'bn' ? 'নাম লিখুন' : 'Enter name'}
                      className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${
                        isDark
                          ? 'bg-neutral-950 border-neutral-700 text-white placeholder-neutral-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                    {language === 'bn' ? 'মোবাইল নম্বর (ঐচ্ছিক):' : 'Phone (Optional):'}
                  </label>
                  <div className="relative">
                    <Phone className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${isDark ? 'text-neutral-500' : 'text-slate-400'}`} />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${
                        isDark
                          ? 'bg-neutral-950 border-neutral-700 text-white placeholder-neutral-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Optional brief note */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                  {language === 'bn' ? 'সংক্ষিপ্ত বার্তা (যদি থাকে):' : 'Short Note (Optional):'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={language === 'bn' ? 'কী জানতে চান বা কী কাজ...' : 'What do you need assistance with...'}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${
                    isDark
                      ? 'bg-neutral-950 border-neutral-700 text-white placeholder-neutral-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                >
                  <BellRing className="w-4 h-4" />
                  <span>
                    {language === 'bn'
                      ? 'স্টাফকে কল করুন / সহায়তা চান'
                      : 'Call Staff / Request Help'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
