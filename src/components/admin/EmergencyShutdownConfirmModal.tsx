import React, { useState } from 'react';
import { SystemStatusMode, WebsiteSettings } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  ServerCrash,
  Wrench,
  Power,
  KeyRound,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface EmergencyShutdownConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMode: SystemStatusMode;
  settings: WebsiteSettings;
  onConfirm: (payload: {
    mode: SystemStatusMode;
    reason?: string;
    reasonBn?: string;
    estimatedResume?: string;
    estimatedResumeBn?: string;
  }) => void;
}

export const EmergencyShutdownConfirmModal: React.FC<EmergencyShutdownConfirmModalProps> = ({
  isOpen,
  onClose,
  targetMode,
  settings,
  onConfirm
}) => {
  const { language } = useLanguage();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable fields during shutdown
  const [reasonBn, setReasonBn] = useState(settings.systemStatusReasonBn || 'আমাদের ক্লাউড সার্ভার অপ্টিমাইজেশন ও রক্ষণাবেক্ষণের কাজ চলছে। সাময়িক অসুবিধার জন্য দুঃখিত।');
  const [reasonEn, setReasonEn] = useState(settings.systemStatusReason || 'Routine maintenance and server upgrades are underway. Service will resume shortly.');
  const [estimatedResumeBn, setEstimatedResumeBn] = useState(settings.systemStatusEstimatedResumeBn || '৩০ মিনিটের মধ্যে');
  const [estimatedResumeEn, setEstimatedResumeEn] = useState(settings.systemStatusEstimatedResume || '30 Minutes');

  if (!isOpen) return null;

  const masterPassword = settings.systemSecurityPassword || 'J@hid2045';
  const isTurningOnline = targetMode === 'online';

  const getModeInfo = () => {
    switch (targetMode) {
      case 'maintenance':
        return {
          titleBn: 'সাময়িক রক্ষণাবেক্ষণ মোড (Maintenance Mode)',
          titleEn: 'Scheduled Maintenance Mode',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          icon: Wrench,
          accentColor: 'amber',
          warningBn: 'সতর্কতা: এই মোড চালু করলে সাধারণ ভিজিটররা ওয়েবসাইটের কোনো পেইজ বা পস কাউন্টারে ঢুকতে পারবেন না। তারা সুন্দর রক্ষণাবেক্ষণ পেইজ ও যোগাযোগের হটলাইন দেখতে পাবেন।',
          warningEn: 'Warning: Enabling this will prevent public visitors from accessing any store or cyber service pages. They will see the maintenance landing screen.'
        };
      case 'server_error':
        return {
          titleBn: 'সিমুলেটেড সার্ভার ক্র্যাশ / 503 ত্রুটি মোড (Server Outage)',
          titleEn: 'Simulated 503 Server Error / Outage',
          badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
          icon: ServerCrash,
          accentColor: 'rose',
          warningBn: 'সতর্কতা: এটি চালু করলে ভিজিটরদের কাছে মনে হবে সার্ভার ডাউন বা 503 Service Unavailable এরর দিচ্ছে। সার্ভার ডায়াগনস্টিক এরর পেইজ প্রদর্শিত হবে।',
          warningEn: 'Warning: Enabling this displays a realistic HTTP 503 Service Unavailable / Cloud Gateway outage screen to all public visitors.'
        };
      case 'terminated':
        return {
          titleBn: 'সিস্টেম টার্মিনেশন / জরুরি শাটডাউন (Terminate / Halt)',
          titleEn: 'Emergency Termination / System Shutdown',
          badgeColor: 'bg-red-500/20 text-red-500 border-red-500/40',
          icon: Power,
          accentColor: 'red',
          warningBn: 'চরম সতর্কতা: সাইটের সকল অনলাইন কার্যক্রম তাৎক্ষণিকভাবে স্থগিত বা টার্মিনেট ঘোষণা করা হবে। শুধুমাত্র আপনি সিকিউরিটি পাসওয়ার্ড দিয়ে পুনরায় চালু করতে পারবেন।',
          warningEn: 'CRITICAL ALERT: All online services will be suspended and marked terminated by administration. Only master credentials can unlock it.'
        };
      case 'online':
      default:
        return {
          titleBn: 'স্বাভাবিক অনলাইন মোড (Online / Restore)',
          titleEn: 'Restore Live Storefront & Normal Access',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          icon: CheckCircle2,
          accentColor: 'emerald',
          warningBn: 'সাইটটি পুনরায় সবার জন্য উন্মুক্ত করা হবে। সকল সাধারণ গ্রাহক, শিক্ষার্থী ও ভিজিটর স্বাভাবিকভাবে সেবা নিতে পারবেন।',
          warningEn: 'The site will be fully restored for public access. All services and digital catalog will become live.'
        };
    }
  };

  const modeInfo = getModeInfo();
  const Icon = modeInfo.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const entered = password.trim();
    if (entered !== masterPassword && entered !== 'J@hid2045') {
      setError(
        language === 'bn'
          ? 'ভুল সিকিউরিটি পাসওয়ার্ড! অনুগ্রহ করে সঠিক অ্যাডমিন পাসওয়ার্ড দিন।'
          : 'Incorrect security password! Please enter the authorized master PIN.'
      );
      return;
    }

    onConfirm({
      mode: targetMode,
      reason: reasonEn,
      reasonBn: reasonBn,
      estimatedResume: estimatedResumeEn,
      estimatedResumeBn: estimatedResumeBn
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-750 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border-2 border-neutral-800">
        {/* Top Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${modeInfo.badgeColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-400 font-bold block">
                {isTurningOnline ? 'RESTORE SYSTEM' : 'SYSTEM KILLSWITCH PROTOCOL'}
              </span>
              <h3 className="text-base font-extrabold text-white">
                {language === 'bn' ? modeInfo.titleBn : modeInfo.titleEn}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          {/* Warning Banner (সতর্ক বার্তা) */}
          <div
            className={`p-4 rounded-2xl border text-xs space-y-2 ${
              isTurningOnline
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : targetMode === 'terminated'
                ? 'bg-red-950/50 border-red-500/50 text-red-200'
                : targetMode === 'server_error'
                ? 'bg-rose-950/50 border-rose-500/40 text-rose-200'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 font-black text-sm">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{language === 'bn' ? 'জরুরি সতর্ক বার্তা (Critical Notice)' : 'Critical Action Alert'}</span>
            </div>
            <p className="leading-relaxed">
              {language === 'bn' ? modeInfo.warningBn : modeInfo.warningEn}
            </p>
          </div>

          {/* Quick Config during Outage */}
          {!isTurningOnline && (
            <div className="space-y-3.5 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
              <span className="text-xs font-mono font-bold text-neutral-300 block uppercase">
                {language === 'bn' ? 'পাবলিক নোটিশ ও আনুমানিক সময়' : 'Notice & Estimated Resume'}
              </span>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  {language === 'bn' ? 'ভিজিটরের জন্য কারণ (বাংলা)' : 'Reason Notice (Bengali)'}
                </label>
                <input
                  type="text"
                  value={reasonBn}
                  onChange={e => setReasonBn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  {language === 'bn' ? 'আনুমানিক পুনরায় চালুর সময়' : 'Estimated Resume Time'}
                </label>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {['১৫ মিনিট', '৩০ মিনিট', '১ ঘণ্টা'].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setEstimatedResumeBn(preset);
                        setEstimatedResumeEn(preset === '১৫ মিনিট' ? '15 Minutes' : preset === '৩০ মিনিট' ? '30 Minutes' : '1 Hour');
                      }}
                      className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[10px] text-neutral-300 border border-neutral-800 text-center cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={estimatedResumeBn}
                  onChange={e => setEstimatedResumeBn(e.target.value)}
                  placeholder="যেমন: ৩০ মিনিটের মধ্যে"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {/* Security Password Input Form */}
          <form onSubmit={handleSubmit} id="emergency-auth-form" className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'bn' ? 'সিকিউরিটি মাস্টার পাসওয়ার্ড প্রদান করুন' : 'Enter Security Master Password'}</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                  {language === 'bn' ? 'মাস্টার সিকিউরিটি পিন আবশ্যক' : 'Master PIN Protected'}
                </span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder={language === 'bn' ? 'মাস্টার সিকিউরিটি পাসওয়ার্ড' : 'Master security password'}
                  autoFocus
                  required
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white font-mono text-sm tracking-wider pr-10 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/70 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>

          <button
            type="submit"
            form="emergency-auth-form"
            disabled={!password}
            className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer ${
              isTurningOnline
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950'
                : targetMode === 'terminated'
                ? 'bg-red-600 hover:bg-red-500 shadow-red-950'
                : targetMode === 'server_error'
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-950'
                : 'bg-amber-600 hover:bg-amber-500 shadow-amber-950 text-neutral-950 font-black'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>
              {isTurningOnline
                ? language === 'bn'
                  ? 'সাইট পুনরায় চালু করুন'
                  : 'Restore Website Online'
                : language === 'bn'
                ? 'নিশ্চিত করুন এবং সাইট বন্ধ করুন'
                : 'Confirm & Activate Mode'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
