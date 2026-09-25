import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  BellRing,
  X,
  Send,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  HelpCircle,
  Sparkles,
  GraduationCap,
  Printer,
  ShoppingBag,
  FileText,
  CreditCard,
  Headphones
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

  const [category, setCategory] = useState<'order_help' | 'print_copy' | 'college_admission' | 'judicial_stamp' | 'payment' | 'general'>(defaultCategory);
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState('Online Website Visitor');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedReqNum, setSubmittedReqNum] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    {
      id: 'college_admission',
      labelEn: 'College Admission & Form Fill-up',
      labelBn: 'তেজগাঁও কলেজ ভর্তি ও অনলাইন আবেদন',
      icon: GraduationCap,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 'print_copy',
      labelEn: 'Photocopy, Typing & Laser Print',
      labelBn: 'ফটোকপি, টাইপিং ও প্রিন্টিং সেবা',
      icon: Printer,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    {
      id: 'order_help',
      labelEn: 'Online Order & Cart Checkout',
      labelBn: 'অনলাইন অর্ডার ও পণ্য ক্রয় সহায়তা',
      icon: ShoppingBag,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'judicial_stamp',
      labelEn: 'Judicial Stamp & Legal Agreement',
      labelBn: 'জুডিশিয়াল স্ট্যাম্প ও দলিল ড্রাফটিং',
      icon: FileText,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    },
    {
      id: 'payment',
      labelEn: 'bKash/Nagad Payment & Cash Memo',
      labelBn: 'পেমেন্ট ও মানি রিসিট অনুসন্ধান',
      icon: CreditCard,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    },
    {
      id: 'general',
      labelEn: 'Direct Staff Call / Other Support',
      labelBn: 'সরাসরি কাউন্টার স্টাফকে ডাকুন',
      icon: Headphones,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/30'
    }
  ];

  const locationPresets = [
    { en: 'Online Website Visitor', bn: 'অনলাইন ওয়েবসাইট ভিজিটর' },
    { en: 'Counter 1 (Fast Service)', bn: 'কাউন্টার ১ (দ্রুত সেবা)' },
    { en: 'Counter 2 (Cyber & Admission)', bn: 'কাউন্টার ২ (সাইবার ও ভর্তি)' },
    { en: 'Shop Waiting Area', bn: 'দোকান ওয়েটিং এরিয়া' },
    { en: 'Computer Typing Workstation', bn: 'কম্পিউটার টাইপিং ওয়ার্কস্টেশন' }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{language === 'bn' ? 'স্টাফ সহায়তা অনুরোধ' : 'Request Staff Assistance'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-semibold">
                  Live Voice Alert
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                {language === 'bn'
                  ? 'অনুরোধ পাঠানো মাত্রই দোকানে ভয়েস স্পিচ অ্যালার্ট বাজবে'
                  : 'Instant text-to-speech audio alert will notify counter staff'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">
                  {language === 'bn' ? 'সহায়তা অনুরোধ সফলভাবে পাঠানো হয়েছে!' : 'Assistance Request Dispatched!'}
                </h3>
                <p className="text-xs text-emerald-400 font-mono">
                  {language === 'bn' ? 'টোকেন নং: ' : 'Token Number: '}
                  <strong>{submittedReqNum}</strong>
                </p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-2 text-left">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {language === 'bn'
                      ? 'টেক্সট-টু-স্পিচ ভয়েস অ্যালার্ট কাউন্টারে বেজে উঠেছে।'
                      : 'Text-to-speech voice alert has been broadcasted to staff.'}
                  </span>
                </div>
                <p className="text-neutral-400">
                  {language === 'bn'
                    ? 'আমাদের দায়িত্বপ্রাপ্ত অপারেটর অতিদ্রুত আপনার সাথে যোগাযোগ করছেন বা কাউন্টারে সাড়া দিচ্ছেন।'
                    : 'Our staff operator has received the speech alert and is responding immediately.'}
                </p>
                <div className="pt-2 border-t border-neutral-800 flex justify-between text-[11px] text-neutral-400">
                  <span>হটলাইন: {settings.phonePrimary}</span>
                  <span>লোকেশন: {settings.businessNameBn}</span>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                {language === 'bn' ? 'ঠিক আছে / বন্ধ করুন' : 'Got it / Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Picker */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  {language === 'bn' ? '১. সহায়তার বিষয় নির্বাচন করুন:' : '1. Select Assistance Topic:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as any)}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all text-xs ${
                          isSelected
                            ? 'bg-emerald-950/70 border-emerald-500 ring-1 ring-emerald-500 text-white'
                            : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-300 hover:bg-neutral-800'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg border ${cat.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold leading-snug">
                            {language === 'bn' ? cat.labelBn : cat.labelEn}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location or Table selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {language === 'bn' ? '২. আপনার অবস্থান:' : '2. Your Location / Station:'}
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {locationPresets.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLocation(language === 'bn' ? loc.bn : loc.en)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        location === (language === 'bn' ? loc.bn : loc.en)
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      {language === 'bn' ? loc.bn : loc.en}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: কাউন্টার ১ / অনলাইন' : 'e.g. Counter 1 / Online'}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Customer Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'আপনার নাম (ঐচ্ছিক):' : 'Your Name (Optional):'}
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder={language === 'bn' ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'মোবাইল নম্বর (ঐচ্ছিক):' : 'Phone Number (Optional):'}
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Specific message or question */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {language === 'bn' ? 'অতিরিক্ত বিবরণ বা প্রশ্ন (যদি থাকে):' : 'Additional Note or Question (Optional):'}
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  placeholder={
                    language === 'bn'
                      ? 'কী সেবা প্রয়োজন সংক্ষেপে লিখুন...'
                      : 'Briefly explain what you need help with...'
                  }
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {language === 'bn'
                      ? 'সহায়তা অনুরোধ পাঠান (ভয়েস অ্যালার্ট বাজান)'
                      : 'Send Assistance Request (Trigger TTS Voice Alert)'}
                  </span>
                </button>
                <p className="text-[11px] text-neutral-400 text-center mt-2">
                  {language === 'bn'
                    ? '📞 জরুরি সরাসরি কলের জন্য: '
                    : '📞 Direct Urgent Call: '}
                  <a href={`tel:${settings.phonePrimary}`} className="text-emerald-400 underline font-semibold">
                    {settings.phonePrimary}
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
