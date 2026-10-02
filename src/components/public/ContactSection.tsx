import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  Store,
  ExternalLink
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { language, t } = useLanguage();
  const { settings, addNotification } = useData();
  const { isDark } = useTheme();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

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
    <section id="contact-section" className={`py-16 transition-colors duration-200 ${isDark ? 'bg-neutral-950/60' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <Store className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'দোকানের ঠিকানা ও সাপোর্ট' : 'Location & Support'}</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('contact')}
          </h2>

          <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
            {language === 'bn'
              ? 'সরাসরি আমাদের দোকানে চলে আসুন অথবা ফোন ও হোয়াটসঅ্যাপে যোগাযোগ করুন।'
              : 'Visit our physical shop beside Tejgaon College or reach us directly via call or WhatsApp.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Left Col: Shop Address & Contact Cards */}
          <div className="lg:col-span-6 space-y-4">
            <div className={`border rounded-3xl p-6 space-y-4 transition-all shadow-sm ${
              isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span>{language === 'bn' ? 'দোকানের সঠিক ঠিকানা' : 'Physical Shop Address'}</span>
              </h3>

              <div className={`p-4 rounded-2xl border space-y-1.5 transition-colors ${
                isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'bn' ? settings.businessNameBn : settings.businessName}
                </p>
                <p className={`text-xs font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  {language === 'bn' ? 'সাগর-সৈকত মার্কেট, দোকান নং ০২ (নিচতলা)' : 'Sagar-Saikat Market, Shop #02 (Ground Floor)'}
                </p>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-slate-600'}`}>
                  {language === 'bn' ? 'ইন্দিরা রোড, তেজগাঁও কলেজের প্রধান গেটের পাশে, ফার্মগেট, ঢাকা-১২১৫' : 'Indira Road, Beside Tejgaon College Main Gate, Farmgate, Dhaka-1215'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={`tel:${settings.phonePrimary}`}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-xs group ${
                    isDark
                      ? 'bg-neutral-950 border-neutral-800 hover:border-emerald-500/50'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-500 shadow-2xs'
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-colors ${
                    isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`block text-[10px] uppercase font-bold ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                      Primary Call
                    </span>
                    <span className={`font-mono font-bold transition-colors ${
                      isDark ? 'text-white group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-700'
                    }`}>
                      {settings.phonePrimary}
                    </span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/88${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-xs group ${
                    isDark
                      ? 'bg-neutral-950 border-neutral-800 hover:border-emerald-500/50'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-500 shadow-2xs'
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-colors ${
                    isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-teal-100 text-teal-700'
                  }`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`block text-[10px] uppercase font-bold ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                      WhatsApp / bKash
                    </span>
                    <span className={`font-mono font-bold transition-colors ${
                      isDark ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-teal-700 group-hover:text-teal-800'
                    }`}>
                      {settings.whatsappNumber}
                    </span>
                  </div>
                </a>
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs transition-colors ${
                isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className={`block text-[10px] uppercase font-bold ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                    {language === 'bn' ? 'কার্যদিবস ও সময়' : 'Working Hours'}
                  </span>
                  <span className={`font-medium ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>
                    {language === 'bn' ? settings.openingHoursBn : settings.openingHours}
                  </span>
                </div>
              </div>
            </div>

            {/* Map visual card */}
            <div className={`border rounded-3xl p-5 overflow-hidden space-y-3 transition-all shadow-sm ${
              isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>Google Maps Location</span>
                </span>
                <a
                  href={settings.googleMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>{language === 'bn' ? 'ম্যাপে ওপেন করুন' : 'Open in Maps'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className={`w-full h-44 rounded-2xl border flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group transition-colors ${
                isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                <MapPin className="w-8 h-8 text-rose-500 animate-bounce mb-2 relative z-10" />
                <p className={`text-xs font-bold relative z-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {settings.businessName}
                </p>
                <p className={`text-[11px] relative z-10 max-w-sm ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                  20/1 Sagar-Saikat Market, Indira Road, Beside Tejgaon College, Farmgate, Dhaka
                </p>
              </div>
            </div>
          </div>

          {/* Right Col: Quick Message Form */}
          <div className={`border rounded-3xl p-6 sm:p-7 space-y-5 transition-all shadow-sm ${
            isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'bn' ? 'সরাসরি মেসেজ বা অনুসন্ধান পাঠান' : 'Send an Inquiry / Message'}
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                {language === 'bn'
                  ? 'আপনার কোনো সেবা বা পেপার সম্পর্কিত প্রশ্ন থাকলে নিচের ফর্মে লিখুন।'
                  : 'Have a query about services or wholesale paper orders? Send us a message.'}
              </p>
            </div>

            {submitted ? (
              <div className={`p-6 rounded-2xl border text-center space-y-2 animate-in fade-in ${
                isDark ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
              }`}>
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'bn' ? 'বার্তাটি সফলভাবে পাঠানো হয়েছে!' : 'Message Sent Successfully!'}
                </h4>
                <p className={`text-xs ${isDark ? 'text-neutral-300' : 'text-slate-600'}`}>
                  {language === 'bn'
                    ? 'আমাদের টিম খুব দ্রুত আপনার সাথে ফোনে যোগাযোগ করবে।'
                    : 'Our team will contact you on your phone shortly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitMessage} className="space-y-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    {language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    id="contact-name-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Md. Hasan"
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs ${
                      isDark
                        ? 'bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    id="contact-phone-input"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs ${
                      isDark
                        ? 'bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    {language === 'bn' ? 'আপনার মেসেজ বা জানতে চাওয়া বিষয় *' : 'Your Message / Inquiry *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    id="contact-message-input"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার প্রশ্ন বা প্রয়োজনীয় সেবার বিস্তারিত লিখুন...' : 'Write your question or request details...'}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs ${
                      isDark
                        ? 'bg-neutral-950 border-neutral-700 text-white placeholder:text-neutral-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  id="contact-send-btn"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 hover:brightness-110 active:scale-95 transition-all"
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
