import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  Mail,
  Store,
  CreditCard
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings, addNotification } = useData();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    addNotification({
      title: "New Customer Inquiry",
      titleBn: "নতুন গ্রাহক অনুসন্ধান বার্তা",
      message: `${name} (${phone}): ${message}`,
      messageBn: `${name} (${phone}) বার্তা পাঠিয়েছেন: ${message}`,
      type: "system"
    });

    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contact-section" className="py-16 bg-neutral-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Store className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'দোকানের ঠিকানা ও সাপোর্ট' : 'Location & Support'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t('contact')}
          </h2>

          <p className="text-neutral-400 text-xs sm:text-sm">
            {language === 'bn'
              ? 'সরাসরি আমাদের দোকানে চলে আসুন অথবা ফোন ও হোয়াটসঅ্যাপে যোগাযোগ করুন।'
              : 'Visit our physical shop beside Tejgaon College or reach us directly via call or WhatsApp.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left Col: Shop Address & Contact Cards */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>{language === 'bn' ? 'দোকানের সঠিক ঠিকানা' : 'Physical Shop Address'}</span>
              </h3>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
                <p className="text-sm font-semibold text-white">
                  {language === 'bn' ? settings.businessNameBn : settings.businessName}
                </p>
                <p className="text-xs text-emerald-400 font-medium">
                  {language === 'bn' ? 'সাগর-সৈকত মার্কেট, দোকান নং ০২ (নিচতলা)' : 'Sagar-Saikat Market, Shop #02 (Ground Floor)'}
                </p>
                <p className="text-xs text-neutral-300">
                  {language === 'bn' ? 'ইন্দিরা রোড, তেজগাঁও কলেজের পাশে, ফার্মগেট, ঢাকা-১২১৫' : 'Indira Road, Beside Tejgaon College, Farmgate, Dhaka-1215'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${settings.phonePrimary}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 transition-all text-xs"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">Primary Call</span>
                    <span className="text-white font-mono font-bold">{settings.phonePrimary}</span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/88${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 transition-all text-xs"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">WhatsApp / bKash</span>
                    <span className="text-emerald-400 font-mono font-bold">{settings.whatsappNumber}</span>
                  </div>
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3 text-xs">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">{language === 'bn' ? 'কার্যদিবস ও সময়' : 'Working Hours'}</span>
                  <span className="text-neutral-200">
                    {language === 'bn' ? settings.openingHoursBn : settings.openingHours}
                  </span>
                </div>
              </div>
            </div>

            {/* Map visual card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 overflow-hidden space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Google Maps Location</span>
                </span>
                <a
                  href={settings.googleMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  {language === 'bn' ? 'ম্যাপে ওপেন করুন' : 'Open in Maps'} ↗
                </a>
              </div>

              <div className="w-full h-44 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                <MapPin className="w-8 h-8 text-rose-500 animate-bounce mb-2 relative z-10" />
                <p className="text-xs font-bold text-white relative z-10">Saiful Enterprise</p>
                <p className="text-[11px] text-neutral-400 relative z-10">20/1 Sagar-Saikat Market, Indira Road, Beside Tejgaon College</p>
              </div>
            </div>
          </div>

          {/* Right Col: Quick Message Form */}
          <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white">
                {language === 'bn' ? 'সরাসরি মেসেজ বা অনুসন্ধান পাঠান' : 'Send an Inquiry / Message'}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                {language === 'bn'
                  ? 'আপনার কোনো সেবা বা পেপার সম্পর্কিত প্রশ্ন থাকলে নিচের ফর্মে লিখুন।'
                  : 'Have a query about services or wholesale paper orders? Send us a message.'}
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">
                  {language === 'bn' ? 'বার্তাটি সফলভাবে পাঠানো হয়েছে!' : 'Message Sent Successfully!'}
                </h4>
                <p className="text-xs text-neutral-300">
                  {language === 'bn'
                    ? 'আমাদের টিম খুব দ্রুত আপনার সাথে ফোনে যোগাযোগ করবে।'
                    : 'Our team will contact you on your phone shortly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitMessage} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    id="contact-name-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Md. Hasan"
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    id="contact-phone-input"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'আপনার মেসেজ বা জানতে চাওয়া বিষয় *' : 'Your Message / Inquiry *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    id="contact-message-input"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার প্রশ্ন বা প্রয়োজনীয় সেবার বিস্তারিত লিখুন...' : 'Write your question or request details...'}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  id="contact-send-btn"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'bn' ? 'মেসেজ পাঠান' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
