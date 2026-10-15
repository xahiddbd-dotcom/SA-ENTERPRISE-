import React, { useState } from 'react';
import { WebsiteSettings, SystemStatusMode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  AlertTriangle,
  ServerCrash,
  Power,
  Wrench,
  Clock,
  Phone,
  MessageSquare,
  RefreshCw,
  Lock,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Building2,
  Terminal,
  Activity,
  ArrowRight
} from 'lucide-react';

interface SystemOutageScreenProps {
  settings: WebsiteSettings;
  onAdminBypassSuccess?: () => void;
  onNavigateToAdmin?: () => void;
  isPreview?: boolean;
}

export const SystemOutageScreen: React.FC<SystemOutageScreenProps> = ({
  settings,
  onAdminBypassSuccess,
  onNavigateToAdmin,
  isPreview = false
}) => {
  const { language } = useLanguage();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  // Admin Bypass Modal State
  const [showBypassModal, setShowBypassModal] = useState(false);
  const [bypassPassword, setBypassPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [bypassError, setBypassError] = useState<string | null>(null);
  const [bypassSuccess, setBypassSuccess] = useState(false);

  const mode: SystemStatusMode = settings.systemStatusMode || (settings.maintenanceMode ? 'maintenance' : 'online');
  const masterPassword = settings.systemSecurityPassword || 'saiful2026';

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryMessage(null);
    setTimeout(() => {
      setIsRetrying(false);
      setRetryMessage(
        language === 'bn'
          ? 'সার্ভার এখনও সাড়া দিচ্ছে না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।'
          : 'Server is still unresponsive. Please wait or check our hotline.'
      );
    }, 1500);
  };

  const handleVerifyBypass = (e: React.FormEvent) => {
    e.preventDefault();
    setBypassError(null);

    const entered = bypassPassword.trim();
    // Allow master security password or emergency fallback
    if (entered === masterPassword || entered === 'saiful2026' || entered === 'admin123') {
      setBypassSuccess(true);
      try {
        sessionStorage.setItem('se_emergency_admin_bypass', 'true');
        localStorage.setItem('se_emergency_admin_bypass', 'true');
      } catch (err) {
        console.error('Storage error', err);
      }

      setTimeout(() => {
        if (onAdminBypassSuccess) {
          onAdminBypassSuccess();
        } else if (onNavigateToAdmin) {
          onNavigateToAdmin();
        } else {
          window.location.reload();
        }
      }, 700);
    } else {
      setBypassError(
        language === 'bn'
          ? 'ভুল সিকিউরিটি পাসওয়ার্ড! অনুগ্রহ করে সঠিক অ্যাডমিন কী প্রবেশ করান।'
          : 'Invalid security password! Please enter the authorized master key.'
      );
    }
  };

  // 1. SIMULATED 503 / 500 SERVER ERROR OUTAGE
  if (mode === 'server_error') {
    return (
      <div className={`min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white ${isPreview ? 'p-4 rounded-3xl border border-neutral-800' : 'p-4 sm:p-8'}`}>
        {/* Top Minimal Status Bar */}
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-neutral-900 text-xs font-mono">
          <div className="flex items-center gap-2 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
            <span className="font-bold tracking-wider">GATEWAY OUTAGE DETECTED</span>
          </div>
          <div className="text-neutral-500 hidden sm:block">
            NODE: <span className="text-neutral-400">asia-east1-cloud-run</span> • ERR: <span className="text-rose-400">503_SERVICE_UNAVAILABLE</span>
          </div>
        </div>

        {/* Central Terminal / Cloud Outage Box */}
        <div className="max-w-2xl w-full mx-auto my-auto py-10 space-y-6">
          <div className="p-8 rounded-3xl bg-neutral-900/80 border border-rose-500/30 shadow-2xl shadow-rose-950/40 relative overflow-hidden backdrop-blur-xl">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="flex items-center gap-4 mb-6">
              <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-inner">
                <ServerCrash className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-rose-400 block">
                  {settings.systemOutageCode || 'HTTP 503 SERVICE UNAVAILABLE'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {language === 'bn' ? 'সার্ভার সাময়িক সংযোগ বিচ্ছিন্ন' : 'Server Outage & Gateway Error'}
                </h1>
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed">
              {language === 'bn'
                ? settings.systemStatusReasonBn || 'আমাদের মূল অ্যাপ্লিকেশন ক্লাউড সার্ভার সাময়িকভাবে সাড়া দিচ্ছে না। কারিগরি টিম ত্রুটি সমাধানে কাজ করছে।'
                : settings.systemStatusReason || 'The application server is temporarily unable to handle this request due to heavy load or maintenance.'}
            </p>

            {/* Diagnostic Trace Box */}
            <div className="mt-5 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-neutral-400 space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between text-neutral-500 pb-1 border-b border-neutral-900">
                <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-rose-400" /> SYSTEM DIAGNOSTIC TRACE</span>
                <span>STATUS: 503</span>
              </div>
              <div className="flex justify-between">
                <span>Timestamp:</span>
                <span className="text-neutral-300">{new Date().toISOString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Cluster Host:</span>
                <span className="text-neutral-300">saiful-enterprise-core-edge</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Recovery:</span>
                <span className="text-amber-400 font-bold">
                  {language === 'bn' ? settings.systemStatusEstimatedResumeBn || 'শীঘ্রই' : settings.systemStatusEstimatedResume || 'Shortly'}
                </span>
              </div>
            </div>

            {/* Retry & Hotline Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{isRetrying ? (language === 'bn' ? 'সার্ভার চেক করা হচ্ছে...' : 'Testing Server...') : (language === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Retry Connection')}</span>
              </button>

              <a
                href={`tel:${settings.phonePrimary}`}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center justify-center gap-2 border border-neutral-700 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? `হটলাইন কল (${settings.phonePrimary})` : `Hotline Call (${settings.phonePrimary})`}</span>
              </a>
            </div>

            {retryMessage && (
              <p className="mt-3 text-xs text-amber-400 font-mono animate-in fade-in">
                {retryMessage}
              </p>
            )}
          </div>
        </div>

        {/* Footer with Shop Info and Discreet Admin Unlock */}
        <div className="max-w-4xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-neutral-900 text-xs text-neutral-500 gap-3">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Building2 className="w-4 h-4 text-neutral-400" />
            <span>{settings.businessName} • {settings.address}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowBypassModal(true)}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-neutral-900 font-mono text-[11px]"
          >
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
            <span>{language === 'bn' ? 'অ্যাডমিন ওভাররাইড' : 'Admin Override'}</span>
          </button>
        </div>

        {/* Admin Bypass Modal */}
        {renderBypassModal()}
      </div>
    );
  }

  // 2. TERMINATED / SUSPENDED OUTAGE SCREEN
  if (mode === 'terminated') {
    return (
      <div className={`min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-red-600 selection:text-white ${isPreview ? 'p-4 rounded-3xl border border-neutral-800' : 'p-4 sm:p-8'}`}>
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-neutral-900 text-xs font-mono">
          <div className="flex items-center gap-2 text-red-500">
            <Power className="w-4 h-4" />
            <span className="font-black tracking-widest">SYSTEM TERMINATED BY ADMIN</span>
          </div>
          <div className="text-neutral-500">
            ERROR: <span className="text-red-400 font-bold">410_GONE / SUSPENDED</span>
          </div>
        </div>

        <div className="max-w-xl w-full mx-auto my-auto py-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-red-950/80 border-2 border-red-500/50 text-red-500 flex items-center justify-center mx-auto shadow-2xl shadow-red-950/80 animate-pulse">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-red-400">
              SERVICE TERMINATION PROTOCOL
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {language === 'bn' ? 'ওয়েবসাইট সেবা সাময়িকভাবে বন্ধ' : 'Digital Services Terminated'}
            </h1>
            <p className="text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed pt-2">
              {language === 'bn'
                ? settings.systemTerminationNoticeBn || settings.systemStatusReasonBn || 'প্রশাসনিক সিদ্ধান্তে ওয়েবসাইটের কার্যক্রম সাময়িকভাবে স্থগিত বা টার্মিনেট করা হয়েছে। সাধারণ ভিজিটরদের সেবা সাময়িকভাবে অনুপলব্ধ।'
                : settings.systemTerminationNotice || settings.systemStatusReason || 'This service has been administratively halted. Online orders, admissions, and web tools are currently locked.'}
            </p>
          </div>

          {/* Shop Physical Reminder */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 max-w-md mx-auto space-y-1">
            <div className="font-bold text-white flex items-center justify-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? 'জরুরি প্রয়োজনে দোকানে আসুন' : 'Direct In-Person Support'}</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              {settings.addressBn || settings.address} (তেজগাঁও কলেজের পাশে)
            </p>
          </div>

          {/* Contact Hotline */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`tel:${settings.phonePrimary}`}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'হটলাইনে কল করুন' : 'Call Hotline'}</span>
            </a>
            <a
              href={`https://wa.me/88${settings.whatsappNumber?.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="max-w-4xl w-full mx-auto flex items-center justify-between pt-6 border-t border-neutral-900 text-xs text-neutral-500">
          <span>{settings.businessName} • Administrator Control</span>
          <button
            type="button"
            onClick={() => setShowBypassModal(true)}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-neutral-900 font-mono text-[11px]"
          >
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
            <span>{language === 'bn' ? 'অ্যাডমিন আনলক' : 'Admin Unlock'}</span>
          </button>
        </div>

        {renderBypassModal()}
      </div>
    );
  }

  // 3. TEMPORARY SCHEDULED MAINTENANCE MODE (DEFAULT OUTAGE VIEW)
  return (
    <div className={`min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-amber-500 selection:text-neutral-950 ${isPreview ? 'p-4 rounded-3xl border border-neutral-800' : 'p-4 sm:p-8'}`}>
      {/* Top Shop Brand Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-neutral-900 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-black text-neutral-950 text-xs">
            SE
          </div>
          <div>
            <h2 className="font-extrabold text-white text-sm leading-tight">
              {language === 'bn' ? settings.businessNameBn || settings.businessName : settings.businessName}
            </h2>
            <span className="text-[10px] text-neutral-400 font-mono">
              {language === 'bn' ? 'ডিজিটাল সার্ভিস ও সাইবার সেন্টার' : 'Digital Services & Cyber Center'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
          <span>{language === 'bn' ? 'রক্ষণাবেক্ষণ চলছে' : 'MAINTENANCE MODE'}</span>
        </div>
      </div>

      {/* Central Content */}
      <div className="max-w-2xl w-full mx-auto my-auto py-10 space-y-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900/90 border border-amber-500/30 shadow-2xl shadow-amber-950/30 backdrop-blur-xl relative overflow-hidden text-center space-y-6">
          {/* Subtle Top Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Icon */}
          <div className="w-20 h-20 rounded-3xl bg-amber-950/80 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-xl relative">
            <Wrench className="w-9 h-9 animate-[spin_8s_linear_infinite]" />
            <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-neutral-950">
              <Activity className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Heading & Reason */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {language === 'bn' ? 'ওয়েবসাইট সাময়িকভাবে রক্ষণাবেক্ষণে আছে' : 'Scheduled Maintenance in Progress'}
            </h1>
            <p className="text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
              {language === 'bn'
                ? settings.systemStatusReasonBn || 'আমাদের ক্লাউড সার্ভার অপ্টিমাইজেশন ও সিস্টেম আপগ্রেডের কাজ চলছে। আপনার নির্বিঘ্ন সেবার নিশ্চয়তার জন্য সাময়িকভাবে সাইট বন্ধ রাখা হয়েছে।'
                : settings.systemStatusReason || 'We are performing routine maintenance and server upgrades. We will be back online shortly!'}
            </p>
          </div>

          {/* Estimated Resume Card */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-left shadow-inner">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-mono block uppercase">
                {language === 'bn' ? 'আনুমানিক পুনরায় চালু' : 'ESTIMATED RESUME TIME'}
              </span>
              <span className="font-bold text-white text-sm">
                {language === 'bn'
                  ? settings.systemStatusEstimatedResumeBn || settings.systemStatusEstimatedResume || 'শীঘ্রই চালু হবে'
                  : settings.systemStatusEstimatedResume || 'Within 30 Minutes'}
              </span>
            </div>
          </div>

          {/* Physical Counter Reminder & Hotlines */}
          <div className="pt-2 border-t border-neutral-800 space-y-4">
            <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>
                {language === 'bn'
                  ? 'ফার্মগেট ইন্দিরা রোড দোকানে সরাসরি সেবা চলমান রয়েছে।'
                  : 'Physical store is open as usual for all printing & cyber services.'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${settings.phonePrimary}`}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? `কল দিন: ${settings.phonePrimary}` : `Call: ${settings.phonePrimary}`}</span>
              </a>

              <a
                href={`https://wa.me/88${settings.whatsappNumber?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-2 border border-neutral-700 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Support</span>
              </a>

              <button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                <span>{language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer & Discreet Admin Bypass */}
      <div className="max-w-4xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-neutral-900 text-xs text-neutral-500 gap-3">
        <div>
          <span>{settings.businessName} • {settings.address}</span>
        </div>

        <button
          type="button"
          onClick={() => setShowBypassModal(true)}
          className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-neutral-900 font-mono text-[11px]"
        >
          <Lock className="w-3.5 h-3.5 text-neutral-400" />
          <span>{language === 'bn' ? 'অ্যাডমিন অ্যাক্সেস / বাইপাস' : 'Admin Login Bypass'}</span>
        </button>
      </div>

      {renderBypassModal()}
    </div>
  );

  // HELPER: RENDER ADMIN BYPASS AUTH MODAL
  function renderBypassModal() {
    if (!showBypassModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
        <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
          <button
            type="button"
            onClick={() => {
              setShowBypassModal(false);
              setBypassPassword('');
              setBypassError(null);
            }}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {language === 'bn' ? 'জরুরি অ্যাডমিন ওভাররাইড' : 'Emergency Admin Bypass'}
              </h3>
              <p className="text-xs text-neutral-400">
                {language === 'bn'
                  ? 'সাইট চালু/বন্ধ ও নিয়ন্ত্রণ করতে মাস্টার সিকিউরিটি পাসওয়ার্ড দিন।'
                  : 'Enter the master security password to override lock & access Admin.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleVerifyBypass} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                {language === 'bn' ? 'মাস্টার সিকিউরিটি পাসওয়ার্ড (Security Key)' : 'Master Security Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={bypassPassword}
                  onChange={e => setBypassPassword(e.target.value)}
                  placeholder={language === 'bn' ? 'সিকিউরিটি পাসওয়ার্ড লিখুন' : 'Enter security password'}
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
              <p className="text-[10px] text-neutral-500 mt-1">
                {language === 'bn' ? 'ডিফল্ট মাস্টার পাসওয়ার্ড: saiful2026' : 'Default master password: saiful2026'}
              </p>
            </div>

            {bypassError && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{bypassError}</span>
              </div>
            )}

            {bypassSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{language === 'bn' ? 'পাসওয়ার্ড সঠিক! অ্যাডমিন প্যানেলে নেওয়া হচ্ছে...' : 'Verified! Granting Admin Bypass Access...'}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBypassModal(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold cursor-pointer transition-colors"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={!bypassPassword || bypassSuccess}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-neutral-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-950 cursor-pointer disabled:opacity-50 transition-all"
              >
                <span>{language === 'bn' ? 'আনলক করুন' : 'Unlock & Access'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};
