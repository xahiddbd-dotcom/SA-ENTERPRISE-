import React, { useState } from 'react';
import { Shield, Lock, User as UserIcon, Eye, EyeOff, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface AdminDirectLoginProps {
  onSuccess?: () => void;
}

export const AdminDirectLogin: React.FC<AdminDirectLoginProps> = ({ onSuccess }) => {
  const { loginAdmin } = useAuth();
  const { language } = useLanguage();
  const [identifier, setIdentifier] = useState('sent9696@gmail.com');
  const [password, setPassword] = useState('J@hid2045');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
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

  const handleInstantLogin = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const res = await loginAdmin('Admin', 'J@hid2045');
      if (res.success) {
        setSuccessMsg(language === 'bn' ? 'সরাসরি অ্যাডমিন প্যানেলে প্রবেশ করা হচ্ছে...' : 'Entering Admin Panel...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 300);
      } else {
        setErrorMsg(res.message || 'Direct login failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {language === 'bn' ? 'অ্যাডমিন CMS প্যানেল লগইন' : 'Admin CMS Control Panel'}
          </h2>
          <p className="text-xs text-neutral-400">
            {language === 'bn' 
              ? 'সাইফুল এন্টারপ্রাইজ সেন্ট্রাল ম্যানেজমেন্ট, স্টক ইনভেন্টরি, ডাটাবেজ ব্যাকআপ ও অ্যাকাউন্টস।'
              : 'Full access to services, paper inventory, live orders, POS terminal, and financial ledger.'}
          </p>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1-Click Instant Master Admin Login */}
        <button
          type="button"
          id="admin-direct-instant-login-btn"
          onClick={handleInstantLogin}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          <Shield className="w-4 h-4" />
          <span>{language === 'bn' ? '⚡ ১-ক্লিকে সরাসরি অ্যাডমিন প্যানেলে প্রবেশ করুন' : '⚡ 1-Click Direct Admin Access'}</span>
        </button>

        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <div className="flex-1 h-px bg-neutral-800" />
          <span>{language === 'bn' ? 'অথবা ইউজার ও পাসওয়ার্ড দিয়ে লগইন' : 'Or sign in with credentials'}</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        {/* Direct Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {language === 'bn' ? 'ইউজার নেম (Username)' : 'Username / Admin ID'}
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                id="admin-direct-username"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Admin"
                className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {language === 'bn' ? 'পাসওয়ার্ড (Password)' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                id="admin-direct-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="J@hid2045"
                className="w-full pl-10 pr-10 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
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

          <button
            type="submit"
            id="admin-direct-submit-btn"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Credential Hint Box */}
          <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
            <div>
              <span className="text-neutral-500">User: </span>
              <strong className="text-emerald-400">Admin</strong>
              <span className="mx-2 text-neutral-600">|</span>
              <span className="text-neutral-500">Pass: </span>
              <strong className="text-emerald-400">J@hid2045</strong>
            </div>
            <button
              type="button"
              onClick={() => {
                setIdentifier('Admin');
                setPassword('J@hid2045');
              }}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px] font-sans hover:underline"
            >
              <KeyRound className="w-3 h-3" />
              <span>Fill</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
