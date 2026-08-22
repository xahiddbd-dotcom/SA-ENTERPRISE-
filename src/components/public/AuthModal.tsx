import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  User,
  FileCheck,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register' | 'staff' | 'admin';
  onClose: () => void;
  onSuccess: (targetView?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const { language, t } = useLanguage();
  const { loginAdmin, loginStaff, loginCustomer, registerCustomer } = useAuth();

  const [activeTab, setActiveTab] = useState<'admin' | 'staff' | 'customer' | 'register'>('admin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    // Switch to requested mode, keeping password blank and masked
    if (initialMode === 'admin') {
      setActiveTab('admin');
      setIdentifier('');
      setPassword('');
    } else if (initialMode === 'staff') {
      setActiveTab('staff');
      setIdentifier('');
      setPassword('');
    } else if (initialMode === 'register') {
      setActiveTab('register');
      setIdentifier('');
      setPassword('');
    } else {
      setActiveTab('customer');
      setIdentifier('');
      setPassword('');
    }
    setShowPassword(false);
    setErrorMsg(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (activeTab === 'admin') {
        const res = await loginAdmin(identifier, password);
        if (res.success) {
          onSuccess('admin');
          onClose();
        } else {
          setErrorMsg(res.message || 'Admin authentication failed');
        }
      } else if (activeTab === 'staff') {
        const res = await loginStaff(identifier, password);
        if (res.success) {
          onSuccess('staff');
          onClose();
        } else {
          setErrorMsg(res.message || 'Staff authentication failed');
        }
      } else if (activeTab === 'customer') {
        const res = await loginCustomer(identifier, password);
        if (res.success) {
          onSuccess('home');
          onClose();
        } else {
          setErrorMsg(res.message || 'Login failed');
        }
      } else if (activeTab === 'register') {
        const res = await registerCustomer(name, phone);
        if (res.success) {
          onSuccess('home');
          onClose();
        } else {
          setErrorMsg(res.message || 'Registration failed');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAutofill = (type: 'admin' | 'staff' | 'customer') => {
    setErrorMsg(null);
    if (type === 'admin') {
      setActiveTab('admin');
      setIdentifier('Admin');
      setPassword('J@hid2045');
    } else if (type === 'staff') {
      setActiveTab('staff');
      setIdentifier('SE-EMP-001');
      setPassword('staff123');
    } else {
      setActiveTab('customer');
      setIdentifier('01711000000');
      setPassword('customer123');
    }
  };

  const handleInstantMasterLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await loginAdmin('Admin', 'J@hid2045');
      if (res.success) {
        onSuccess('admin');
        onClose();
      } else {
        setErrorMsg(res.message || 'Login failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              {activeTab === 'admin' ? <Shield className="w-4 h-4" /> : activeTab === 'staff' ? <FileCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-none">
                {activeTab === 'admin' 
                  ? (language === 'bn' ? 'অ্যাডমিন CMS প্যানেল লগইন' : 'Admin CMS Portal Login') 
                  : activeTab === 'staff' 
                  ? (language === 'bn' ? 'স্টাফ ও অপারেটর লগইন' : 'Staff & Operator Portal') 
                  : (language === 'bn' ? 'কাস্টমার অ্যাকাউন্ট' : 'Customer Account')}
              </h3>
              <span className="text-[10px] text-neutral-400">
                {language === 'bn' ? 'সাইফুল এন্টারপ্রাইজ সিকিউর পোর্টাল' : 'Saiful Enterprise Secure Access'}
              </span>
            </div>
          </div>

          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 bg-neutral-950/80 p-1.5 border-b border-neutral-800 text-xs font-semibold">
          <button
            type="button"
            id="auth-tab-admin"
            onClick={() => { setActiveTab('admin'); setErrorMsg(null); }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'admin'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'অ্যাডমিন CMS' : 'Admin CMS'}
          </button>

          <button
            type="button"
            id="auth-tab-staff"
            onClick={() => { setActiveTab('staff'); setErrorMsg(null); }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'staff'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'স্টাফ পোর্টাল' : 'Staff Portal'}
          </button>

          <button
            type="button"
            id="auth-tab-customer"
            onClick={() => { setActiveTab('customer'); setErrorMsg(null); }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'customer' || activeTab === 'register'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'গ্রাহক' : 'Customer'}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'register' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {language === 'bn' ? 'আপনার নাম' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Kamrul Hasan"
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {activeTab === 'admin'
                    ? (language === 'bn' ? 'অ্যাডমিন ইউজার আইডি / ইমেইল' : 'Admin Username or Email')
                    : activeTab === 'staff'
                    ? (language === 'bn' ? 'এমপ্লয়ি আইডি (Employee ID)' : 'Employee ID')
                    : (language === 'bn' ? 'মোবাইল নম্বর / ইমেইল' : 'Phone Number or Email')}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    id="auth-identifier-input"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={
                      activeTab === 'admin'
                        ? 'Enter admin username or email'
                        : activeTab === 'staff'
                        ? 'Enter employee ID'
                        : 'Enter mobile number or email'
                    }
                    autoComplete="username"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-neutral-300">
                    {language === 'bn' ? 'পাসওয়ার্ড (Password)' : 'Password'}
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    id="auth-password-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full pl-9 pr-10 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {activeTab === 'admin'
                    ? (language === 'bn' ? 'অ্যাডমিন CMS প্যানেলে প্রবেশ করুন' : 'Sign In to Admin CMS')
                    : activeTab === 'staff'
                    ? (language === 'bn' ? 'স্টাফ পোর্টালে প্রবেশ করুন' : 'Enter Staff Portal')
                    : activeTab === 'register'
                    ? (language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Register Account')
                    : (language === 'bn' ? 'লগইন করুন' : 'Log In')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick test credentials option */}
          <div className="pt-2 border-t border-neutral-800/80 flex flex-col gap-2 text-[11px] text-neutral-400">
            {activeTab === 'admin' && (
              <button
                type="button"
                id="auth-instant-admin-btn"
                onClick={handleInstantMasterLogin}
                disabled={loading}
                className="w-full py-2 px-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold hover:bg-emerald-900/80 hover:text-white flex items-center justify-center gap-1.5 transition-all text-xs"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>⚡ ১-ক্লিকে সরাসরি অ্যাডমিন প্যানেলে প্রবেশ করুন</span>
              </button>
            )}

            <div className="flex items-center justify-between">
              <span>
                {activeTab === 'admin' ? 'Admin: Admin / J@hid2045' : activeTab === 'staff' ? 'Staff operator role' : 'Customer role'}
              </span>
              <button
                type="button"
                onClick={() => handleQuickAutofill(activeTab === 'register' ? 'customer' : activeTab)}
                className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline text-[11px] flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" />
                <span>Auto-fill form</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
