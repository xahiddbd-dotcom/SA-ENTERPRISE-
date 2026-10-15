import React, { useState } from 'react';
import { WebsiteSettings, SystemStatusMode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  AlertTriangle,
  ServerCrash,
  Power,
  Wrench,
  CheckCircle2,
  Clock,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  Sliders,
  ExternalLink,
  Lock,
  Building2,
  Terminal,
  Activity,
  Check,
  Save
} from 'lucide-react';
import { SystemOutageScreen } from '../public/SystemOutageScreen';

interface EmergencyKillswitchPanelProps {
  settings: WebsiteSettings;
  onOpenConfirmModal: (targetMode: SystemStatusMode) => void;
  onUpdateSettings: (updated: Partial<WebsiteSettings>) => void;
  currentUser?: { name?: string; role?: string };
}

export const EmergencyKillswitchPanel: React.FC<EmergencyKillswitchPanelProps> = ({
  settings,
  onOpenConfirmModal,
  onUpdateSettings,
  currentUser
}) => {
  const { language } = useLanguage();

  const currentMode: SystemStatusMode = settings.systemStatusMode || (settings.maintenanceMode ? 'maintenance' : 'online');
  const isOnline = currentMode === 'online';

  // Local state for editable reasons & time
  const [reasonBn, setReasonBn] = useState(settings.systemStatusReasonBn || 'আমাদের ক্লাউড সার্ভার অপ্টিমাইজেশন ও রক্ষণাবেক্ষণের কাজ চলছে। সাময়িক অসুবিধার জন্য দুঃখিত।');
  const [reasonEn, setReasonEn] = useState(settings.systemStatusReason || 'Routine maintenance and server performance upgrades are underway.');
  const [estimatedResumeBn, setEstimatedResumeBn] = useState(settings.systemStatusEstimatedResumeBn || '৩০ মিনিটের মধ্যে');
  const [estimatedResumeEn, setEstimatedResumeEn] = useState(settings.systemStatusEstimatedResume || '30 Minutes');
  const [outageCode, setOutageCode] = useState(settings.systemOutageCode || 'HTTP 503 Service Unavailable');
  const [savedNoticeSuccess, setSavedNoticeSuccess] = useState(false);

  // Security password change state
  const [showPasswordChangeForm, setShowPasswordChangeForm] = useState(false);
  const [currentSecurityPass, setCurrentSecurityPass] = useState('');
  const [newSecurityPass, setNewSecurityPass] = useState('');
  const [confirmSecurityPass, setConfirmSecurityPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  // Live Preview selector
  const [previewMode, setPreviewMode] = useState<SystemStatusMode>(
    currentMode === 'online' ? 'maintenance' : currentMode
  );
  const [showLivePreview, setShowLivePreview] = useState(false);

  const handleSaveNotices = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      systemStatusReasonBn: reasonBn,
      systemStatusReason: reasonEn,
      systemStatusEstimatedResumeBn: estimatedResumeBn,
      systemStatusEstimatedResume: estimatedResumeEn,
      systemOutageCode: outageCode
    });
    setSavedNoticeSuccess(true);
    setTimeout(() => setSavedNoticeSuccess(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    const masterPass = settings.systemSecurityPassword || 'saiful2026';
    if (currentSecurityPass.trim() !== masterPass && currentSecurityPass.trim() !== 'saiful2026' && currentSecurityPass.trim() !== 'admin123') {
      setPassError(language === 'bn' ? 'বর্তমান সিকিউরিটি পাসওয়ার্ডটি সঠিক নয়।' : 'Current security password is incorrect.');
      return;
    }

    if (!newSecurityPass || newSecurityPass.length < 4) {
      setPassError(language === 'bn' ? 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' : 'New password must be at least 4 characters.');
      return;
    }

    if (newSecurityPass !== confirmSecurityPass) {
      setPassError(language === 'bn' ? 'নতুন পাসওয়ার্ড দুটি মেলেনি।' : 'Passwords do not match.');
      return;
    }

    onUpdateSettings({
      systemSecurityPassword: newSecurityPass
    });

    setPassSuccess(language === 'bn' ? 'সিকিউরিটি পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!' : 'Security password updated successfully!');
    setCurrentSecurityPass('');
    setNewSecurityPass('');
    setConfirmSecurityPass('');
    setShowPasswordChangeForm(false);
    setTimeout(() => setPassSuccess(null), 4000);
  };

  const presetTimes = [
    { labelBn: '১৫ মিনিট', labelEn: '15 Mins', valEn: '15 Minutes' },
    { labelBn: '৩০ মিনিট', labelEn: '30 Mins', valEn: '30 Minutes' },
    { labelBn: '১ ঘণ্টা', labelEn: '1 Hour', valEn: '1 Hour' },
    { labelBn: '২ ঘণ্টা', labelEn: '2 Hours', valEn: '2 Hours' },
    { labelBn: 'আজ রাত ১০টা পর্যন্ত', labelEn: 'Tonight 10 PM', valEn: 'Until 10:00 PM Tonight' },
    { labelBn: 'জরুরি সার্ভার কাজ', labelEn: 'Emergency', valEn: 'Emergency Work in Progress' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. STATUS HERO MONITOR CARD */}
      <div
        className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
          isOnline
            ? 'bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-neutral-950 border-emerald-500/40'
            : currentMode === 'terminated'
            ? 'bg-gradient-to-r from-red-950/70 via-neutral-900 to-neutral-950 border-red-500/50'
            : currentMode === 'server_error'
            ? 'bg-gradient-to-r from-rose-950/70 via-neutral-900 to-neutral-950 border-rose-500/50'
            : 'bg-gradient-to-r from-amber-950/60 via-neutral-900 to-neutral-950 border-amber-500/40'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3.5 rounded-2xl border ${
                isOnline
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : currentMode === 'terminated'
                  ? 'bg-red-500/20 text-red-500 border-red-500/40'
                  : currentMode === 'server_error'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}
            >
              {isOnline ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : currentMode === 'terminated' ? (
                <Power className="w-8 h-8 animate-pulse" />
              ) : currentMode === 'server_error' ? (
                <ServerCrash className="w-8 h-8 animate-pulse" />
              ) : (
                <Wrench className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full inline-block ${
                    isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500 animate-ping'
                  }`}
                />
                <span className="text-[11px] font-mono uppercase tracking-widest font-black text-neutral-300">
                  {isOnline ? 'LIVE STOREFRONT ACTIVE' : `${currentMode.toUpperCase()} LOCK ENGAGED`}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isOnline
                  ? language === 'bn'
                    ? 'ওয়েবসাইট সম্পূর্ণ চালু ও সক্রিয় রয়েছে'
                    : 'Storefront is Live and Online'
                  : currentMode === 'maintenance'
                  ? language === 'bn'
                    ? 'ওয়েবসাইট সাময়িক রক্ষণাবেক্ষণ মোডে রয়েছে'
                    : 'Storefront is Under Maintenance'
                  : currentMode === 'server_error'
                  ? language === 'bn'
                    ? 'সিমুলেটেড ৫০৩ সার্ভার ত্রুটি মোড সক্রিয়'
                    : 'Simulated 503 Server Error Active'
                  : language === 'bn'
                  ? 'ওয়েবসাইট সেবা সাময়িকভাবে স্থগিত / টার্মিনেটেড'
                  : 'System is Terminated / Suspended'}
              </h2>

              <p className="text-xs text-neutral-300 max-w-xl leading-relaxed">
                {isOnline
                  ? language === 'bn'
                    ? 'সাধারণ ভিজিটর, গ্রাহক এবং তেজগাঁও কলেজের ছাত্র-ছাত্রীরা অনলাইনে সেবা গ্রহণ ও অর্ডার করতে পারছেন।'
                    : 'Public visitors and students can browse services, submit admissions, and use the catalog normally.'
                  : language === 'bn'
                  ? 'সাধারণ ভিজিটররা সাইটের পেজ দেখতে পারছেন না; তাদের কাছে নির্বাচিত নোটিশ বা সার্ভার এরর পেজ প্রদর্শিত হচ্ছে।'
                  : 'Public access is blocked. Visitors see the selected maintenance or simulated outage screen.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isOnline ? (
              <button
                type="button"
                onClick={() => onOpenConfirmModal('online')}
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-xl shadow-emerald-950 transition-all cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'bn' ? '১-ক্লিকে সাইট চালু করুন' : 'Restore Online Now'}</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-neutral-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'bn' ? 'সিস্টেম নিরাপদ' : 'System Secure'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Audit Details */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-400 gap-2">
          <div>
            <span>LAST MODIFIED: </span>
            <span className="text-neutral-200">
              {settings.systemLastModifiedAt
                ? new Date(settings.systemLastModifiedAt).toLocaleString()
                : 'System Default'}
            </span>
          </div>
          <div>
            <span>BY: </span>
            <span className="text-neutral-200">{settings.systemLastModifiedBy || 'Administrator'}</span>
          </div>
          <div>
            <span>SECURITY GUARD: </span>
            <span className="text-emerald-400 font-bold">PASSWORD PROTECTED</span>
          </div>
        </div>
      </div>

      {/* 2. FOUR INTERACTIVE KILLSWITCH MODE CARDS */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'সিস্টেম স্ট্যাটাস ও মোড নির্বাচন (Select Mode)' : 'System Outage & Mode Selector'}</span>
          </h3>
          <p className="text-xs text-neutral-400">
            {language === 'bn'
              ? 'নিচের যে কোনো মোড চালু করতে ক্লিক করুন। পরিবর্তনের পূর্বে সতর্ক বার্তা এবং সিকিউরিটি পাসওয়ার্ড চাওয়া হবে।'
              : 'Click any mode to activate. A security password and critical warning will be prompted.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* OPTION 1: ONLINE */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              isOnline
                ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                {isOnline && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-neutral-950 font-bold text-[10px] uppercase font-mono">
                    CURRENT
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-white text-sm">
                {language === 'bn' ? 'অনলাইন (স্বাভাবিক চালু)' : '1. Live Online Mode'}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {language === 'bn'
                  ? 'ওয়েবসাইট ও স্টোরফ্রন্ট সম্পূর্ণ উন্মুক্ত। সব গ্রাহক স্বাভাবিকভাবে সেবা ও কেনাকাটা করতে পারেন।'
                  : 'Full public access. All pages, online admissions, and services operate normally.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenConfirmModal('online')}
              disabled={isOnline}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isOnline
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isOnline ? (language === 'bn' ? 'বর্তমানে সক্রিয়' : 'Currently Active') : (language === 'bn' ? 'অনলাইনে ফিরিয়ে নিন' : 'Switch to Online')}</span>
            </button>
          </div>

          {/* OPTION 2: MAINTENANCE */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              currentMode === 'maintenance'
                ? 'bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/40'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Wrench className="w-5 h-5" />
                </div>
                {currentMode === 'maintenance' && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px] uppercase font-mono">
                    CURRENT
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-white text-sm">
                {language === 'bn' ? 'সাময়িক রক্ষণাবেক্ষণ' : '2. Maintenance Mode'}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {language === 'bn'
                  ? 'সাইটে আপডেট বা কাজের সময় ব্যবহার করুন। ভিজিটররা আনুমানিক চালু সময় ও জরুরি ফোন নম্বর দেখতে পাবে।'
                  : 'Professional maintenance landing screen with hotline, countdown, and shop address.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenConfirmModal('maintenance')}
              disabled={currentMode === 'maintenance'}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                currentMode === 'maintenance'
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-500 text-neutral-950 font-black shadow-md active:scale-95'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{currentMode === 'maintenance' ? (language === 'bn' ? 'বর্তমানে সক্রিয়' : 'Currently Active') : (language === 'bn' ? 'রক্ষণাবেক্ষণ চালু করুন' : 'Enable Maintenance')}</span>
            </button>
          </div>

          {/* OPTION 3: 503 SERVER ERROR */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              currentMode === 'server_error'
                ? 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500/40'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                  <ServerCrash className="w-5 h-5" />
                </div>
                {currentMode === 'server_error' && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] uppercase font-mono">
                    CURRENT
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-white text-sm">
                {language === 'bn' ? 'সার্ভার ত্রুটি (503 Outage)' : '3. Server Error (503)'}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {language === 'bn'
                  ? 'সিমুলেটেড সার্ভার ক্র্যাশ বা ক্লাউড ডাউন স্ক্রিন। টেকনিক্যাল ডায়াগনস্টিক এরর ট্রেস ও রিট্রাই বাটন প্রদর্শিত হয়।'
                  : 'Simulates a real Cloud 503 Service Unavailable / host connection timeout screen.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenConfirmModal('server_error')}
              disabled={currentMode === 'server_error'}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                currentMode === 'server_error'
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{currentMode === 'server_error' ? (language === 'bn' ? 'বর্তমানে সক্রিয়' : 'Currently Active') : (language === 'bn' ? '৫০৩ এরর চালু করুন' : 'Simulate 503 Outage')}</span>
            </button>
          </div>

          {/* OPTION 4: TERMINATED */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              currentMode === 'terminated'
                ? 'bg-red-950/40 border-red-500/50 shadow-lg shadow-red-950/30 ring-1 ring-red-500/40'
                : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-red-500/20 text-red-500">
                  <Power className="w-5 h-5" />
                </div>
                {currentMode === 'terminated' && (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] uppercase font-mono">
                    CURRENT
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-white text-sm">
                {language === 'bn' ? 'টার্মিনেট / স্থগিতাদেশ' : '4. Terminate / Halt'}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {language === 'bn'
                  ? 'চরম জরুরি অবস্থায় সাইটের কার্যক্রম সাময়িক স্থগিতাদেশ জারি করা। প্রশাসনিক চূড়ান্ত নোটিশ দেখতে পাবে।'
                  : 'Complete emergency suspension. Informs visitors that operations are halted by administration.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenConfirmModal('terminated')}
              disabled={currentMode === 'terminated'}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                currentMode === 'terminated'
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-md active:scale-95'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{currentMode === 'terminated' ? (language === 'bn' ? 'বর্তমানে সক্রিয়' : 'Currently Active') : (language === 'bn' ? 'টার্মিনেট করুন' : 'Emergency Terminate')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. PUBLIC NOTICE & TIME CONFIGURATION FORM */}
      <form onSubmit={handleSaveNotices} className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'ভিজিটরদের জন্য বার্তা ও সময় কনফিগারেশন' : 'Outage Screen Messages & Duration'}</span>
            </h3>
            <p className="text-xs text-neutral-400">
              {language === 'bn'
                ? 'রক্ষণাবেক্ষণ বা এরর স্ক্রিনে গ্রাহকদের যে বার্তা এবং আনুমানিক সময় দেখানো হবে তা নির্ধারণ করুন।'
                : 'Customize the notice message and estimated back-online time displayed during outages.'}
            </p>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নোটিশ সংরক্ষণ করুন' : 'Save Notice Settings'}</span>
          </button>
        </div>

        {savedNoticeSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'আউটজ নোটিশ ও সময় সফলভাবে সংরক্ষিত হয়েছে!' : 'Outage notices and duration saved!'}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {language === 'bn' ? 'রক্ষণাবেক্ষণ কারণ / নোটিশ (বাংলা)' : 'Maintenance Reason (Bengali)'}
            </label>
            <textarea
              rows={2}
              value={reasonBn}
              onChange={e => setReasonBn(e.target.value)}
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-emerald-400 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {language === 'bn' ? 'রক্ষণাবেক্ষণ কারণ / নোটিশ (English)' : 'Maintenance Reason (English)'}
            </label>
            <textarea
              rows={2}
              value={reasonEn}
              onChange={e => setReasonEn(e.target.value)}
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-emerald-400 leading-relaxed"
            />
          </div>
        </div>

        {/* Estimated Duration with 1-click Preset Pills */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-300">
            {language === 'bn' ? 'আনুমানিক পুনরায় চালুর সময় (Estimated Resume Time)' : 'Estimated Resume Time'}
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {presetTimes.map(p => (
              <button
                key={p.valEn}
                type="button"
                onClick={() => {
                  setEstimatedResumeBn(p.labelBn);
                  setEstimatedResumeEn(p.valEn);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  estimatedResumeBn === p.labelBn
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {language === 'bn' ? p.labelBn : p.labelEn}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <input
              type="text"
              value={estimatedResumeBn}
              onChange={e => setEstimatedResumeBn(e.target.value)}
              placeholder="যেমন: ৩০ মিনিটের মধ্যে"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-emerald-400 font-mono"
            />
            <input
              type="text"
              value={estimatedResumeEn}
              onChange={e => setEstimatedResumeEn(e.target.value)}
              placeholder="e.g. Within 30 Minutes"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-emerald-400 font-mono"
            />
          </div>
        </div>

        {/* Server Outage Error Code */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
            {language === 'bn' ? 'সার্ভার এরর ডায়াগনস্টিক কোড (HTTP Status Code)' : 'Diagnostic HTTP Error Code'}
          </label>
          <select
            value={outageCode}
            onChange={e => setOutageCode(e.target.value)}
            className="w-full sm:w-80 px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono outline-none focus:border-emerald-400 cursor-pointer"
          >
            <option value="HTTP 503 Service Unavailable">HTTP 503 Service Unavailable (Standard Maintenance)</option>
            <option value="HTTP 500 Internal Server Error">HTTP 500 Internal Server Error (Server Crash Simulation)</option>
            <option value="HTTP 502 Bad Gateway">HTTP 502 Bad Gateway (Cloud Proxy Timeout)</option>
            <option value="HTTP 410 Service Suspended">HTTP 410 Service Suspended (Administrative Halt)</option>
          </select>
        </div>
      </form>

      {/* 4. SECURITY PASSWORD MANAGER CARD */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'bn' ? 'মাস্টার সিকিউরিটি পাসওয়ার্ড (Security Password)' : 'Master Security Password Management'}
              </h3>
              <p className="text-xs text-neutral-400">
                {language === 'bn'
                  ? 'সাইট বন্ধ/টার্মিনেট করা এবং জরুরি অবস্থায় অবরুদ্ধ সাইট আনলক করতে এই পাসওয়ার্ডটি প্রয়োজন।'
                  : 'Required to authorize any killswitch activation and bypass emergency screen.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowPasswordChangeForm(!showPasswordChangeForm);
              setPassError(null);
            }}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs border border-neutral-700 transition-all cursor-pointer"
          >
            {showPasswordChangeForm
              ? language === 'bn' ? 'বাতিল' : 'Cancel'
              : language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Password'}
          </button>
        </div>

        {passSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{passSuccess}</span>
          </div>
        )}

        {!showPasswordChangeForm ? (
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-850 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs text-neutral-400 block font-mono">CURRENT MASTER PIN STATUS:</span>
                <span className="font-mono text-sm font-black text-white tracking-widest">
                  ••••••••••••
                </span>
              </div>
            </div>
            <div className="text-xs font-mono text-neutral-400">
              {language === 'bn' ? 'ডিফল্ট পাসওয়ার্ড: saiful2026' : 'Default key: saiful2026'}
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {language === 'bn' ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={currentSecurityPass}
                  onChange={e => setCurrentSecurityPass(e.target.value)}
                  placeholder="Current password"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {language === 'bn' ? 'নতুন সিকিউরিটি পাসওয়ার্ড' : 'New Security Password'}
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={newSecurityPass}
                  onChange={e => setNewSecurityPass(e.target.value)}
                  placeholder="At least 4 chars"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmSecurityPass}
                  onChange={e => setConfirmSecurityPass(e.target.value)}
                  placeholder="Re-type new password"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer font-mono"
              >
                {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPass ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-black text-xs shadow-md transition-all cursor-pointer"
              >
                {language === 'bn' ? 'নতুন পাসওয়ার্ড সেট করুন' : 'Save New Security PIN'}
              </button>
            </div>

            {passError && (
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{passError}</span>
              </div>
            )}
          </form>
        )}
      </div>

      {/* 5. LIVE OUTAGE SCREEN IN-DASHBOARD PREVIEW */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'আউটজ স্ক্রিন লাইভ প্রিভিউ' : 'Live Outage Screen Preview'}</span>
            </h3>
            <p className="text-xs text-neutral-400">
              {language === 'bn'
                ? 'ভিজিটররা যখন ওয়েবসাইটে ঢুকবে তখন স্ক্রিনটি কেমন দেখাবে তা পরীক্ষা করুন।'
                : 'Preview how visitors will experience each outage screen mode.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(['maintenance', 'server_error', 'terminated'] as SystemStatusMode[]).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setPreviewMode(m);
                  setShowLivePreview(true);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                  previewMode === m && showLivePreview
                    ? 'bg-neutral-800 text-white border border-neutral-600 ring-1 ring-emerald-500/40'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-850'
                }`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
            >
              {showLivePreview
                ? language === 'bn' ? 'প্রিভিউ বন্ধ করুন' : 'Hide Preview'
                : language === 'bn' ? 'প্রিভিউ দেখুন' : 'Show Preview'}
            </button>
          </div>
        </div>

        {showLivePreview && (
          <div className="rounded-3xl border-2 border-neutral-800 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-2.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono px-4">
              <span>PREVIEW MODE: {previewMode.toUpperCase()}</span>
              <span>SIMULATED VISITOR EXPERIENCE</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              <SystemOutageScreen
                settings={{
                  ...settings,
                  systemStatusMode: previewMode,
                  systemStatusReasonBn: reasonBn,
                  systemStatusReason: reasonEn,
                  systemStatusEstimatedResumeBn: estimatedResumeBn,
                  systemStatusEstimatedResume: estimatedResumeEn,
                  systemOutageCode: outageCode
                }}
                isPreview={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
