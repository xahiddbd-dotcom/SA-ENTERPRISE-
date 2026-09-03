import React, { useState } from 'react';
import { Shield, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Home, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { RobotVerification } from '../common/RobotVerification';

interface AdminDirectLoginProps {
  onSuccess?: () => void;
  onExitToHome?: () => void;
}

export const AdminDirectLogin: React.FC<AdminDirectLoginProps> = ({ onSuccess, onExitToHome }) => {
  const { currentUser, loginAdmin, logout, isAdmin, isSuperAdmin } = useAuth();
  const { language } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isRobotVerified) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে রোবট ভেরিফিকেশন সম্পন্ন করুন।' : 'Please complete the robot verification.');
      return;
    }

    setLoading(true);

    try {
      const res = await loginAdmin(identifier, password);
      if (res.success) {
        setSuccessMsg(language === 'bn' ? 'সফলভাবে লগইন হয়েছে! অ্যাডমিন প্যানেলে নিয়ে যাওয়া হচ্ছে...' : 'Authentication successful! Redirecting to CMS...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 400);
      } else {
        setErrorMsg(res.message || (language === 'bn' ? 'লগইন ব্যর্থ হয়েছে। সঠিক ইউজার ও পাসওয়ার্ড দিন।' : 'Login failed. Please check credentials.'));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in as customer, warn them
  if (currentUser && !isAdmin && !isSuperAdmin) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {language === 'bn' ? 'অ্যাডমিন প্রবেশাধিকার সংরক্ষিত' : 'Administrator Access Only'}
            </h2>
            <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
              {language === 'bn' 
                ? `আপনি বর্তমানে গ্রাহক অ্যাকাউন্ট (${currentUser.name}) হিসেবে লগইন আছেন। এই কন্ট্রোল প্যানেল শুধুমাত্র সাইট অ্যাডমিনিস্ট্রেটরদের জন্য নির্ধারিত।`
                : `You are logged in with customer profile (${currentUser.name}). This administration portal requires authorized staff or admin credentials.`}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {onExitToHome && (
              <button
                type="button"
                onClick={onExitToHome}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>{language === 'bn' ? 'হোমপেজে ফিরে যান' : 'Return to Home Page'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                logout();
                setErrorMsg(null);
              }}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-neutral-700"
            >
              <LogOut className="w-4 h-4" />
              <span>{language === 'bn' ? 'লগআউট করে অ্যাডমিন হিসেবে লগইন করুন' : 'Log Out & Switch to Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      {/* Return to Home link */}
      {onExitToHome && (
        <div className="mb-4">
          <button
            type="button"
            onClick={onExitToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-emerald-400 transition-colors px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/30"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'হোমপেজে ফিরে যান' : 'Back to Home'}</span>
          </button>
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {language === 'bn' ? 'অ্যাডমিন প্যানেল লগইন' : 'Admin CMS Control Panel'}
          </h2>
          <p className="text-xs text-neutral-400">
            {language === 'bn' 
              ? 'সাইফুল এন্টারপ্রাইজ সেন্ট্রাল ম্যানেজমেন্ট, স্টক ইনভেন্টরি, ডাটাবেজ ব্যাকআপ ও অ্যাকাউন্টস।'
              : 'Secure access to services, paper inventory, live orders, POS terminal, and financial ledger.'}
          </p>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Direct Secure Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {language === 'bn' ? 'অ্যাডমিন ইউজারনেম বা ইমেইল' : 'Admin Username / Email'}
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                id="admin-direct-username"
                autoComplete="username"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder={language === 'bn' ? 'অ্যাডমিন আইডি বা ইমেইল' : 'admin or sent9696@gmail.com'}
                className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-sans focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {language === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড' : 'Admin Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                id="admin-direct-password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-sans focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Security Robot Verification */}
          <div className="pt-1">
            <RobotVerification
              id="admin-direct-robot-check"
              isVerified={isRobotVerified}
              onVerify={setIsRobotVerified}
            />
          </div>

          <button
            type="submit"
            id="admin-direct-submit-btn"
            disabled={loading || !isRobotVerified}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <span>{language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying credentials...'}</span>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>{language === 'bn' ? 'নিরাপদ অ্যাডমিন লগইন করুন' : 'Secure Admin Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Security Assurance Footer */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
            <Lock className="w-3.5 h-3.5 text-emerald-500/80" />
            <span>{language === 'bn' ? 'শুধুমাত্র অনুমোদিত প্রশাসকদের জন্য সংরক্ষিত' : 'Authorized Administrators Only'}</span>
          </div>
        </form>
      </div>
    </div>
  );
};
