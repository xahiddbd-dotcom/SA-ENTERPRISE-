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
  KeyRound,
  Smartphone,
  Sparkles,
  Send,
  RotateCcw
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
  const { language } = useLanguage();
  const { loginAdmin, loginStaff, loginCustomer, loginWithGoogle, registerCustomer } = useAuth();

  const [activeTab, setActiveTab] = useState<'customer' | 'admin' | 'staff' | 'phone_otp'>('customer');
  const [authSubMode, setAuthSubMode] = useState<'login' | 'register'>('login');
  
  // Form fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  
  // OTP Verification state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState('4966');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    if (initialMode === 'admin') {
      setActiveTab('admin');
    } else if (initialMode === 'staff') {
      setActiveTab('staff');
    } else if (initialMode === 'register') {
      setActiveTab('customer');
      setAuthSubMode('register');
    } else {
      setActiveTab('customer');
      setAuthSubMode('login');
    }
    
    setIdentifier('');
    setPassword('');
    setShowPassword(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtpSent(false);
    setOtpCode('');
  }, [initialMode, isOpen]);

  // Timer countdown for OTP
  useEffect(() => {
    let interval: any;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isOpen) return null;

  // Send OTP
  const handleSendOtp = () => {
    if (!phone || phone.length < 11) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)' : 'Please enter a valid 11-digit Bangladeshi phone number');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    
    setTimeout(() => {
      const code = String(Math.floor(1000 + Math.random() * 9000));
      setGeneratedOtp(code);
      setOtpSent(true);
      setOtpTimer(45);
      setLoading(false);
      setSuccessMsg(language === 'bn' ? `ভেরিফিকেশন কোড পাঠানো হয়েছে: ${code}` : `OTP Code sent to ${phone}: ${code}`);
    }, 400);
  };

  // Verify OTP & Register/Login
  const handleVerifyOtpAndLogin = async () => {
    if (!otpCode || otpCode.trim().length !== 4) {
      setErrorMsg(language === 'bn' ? 'সঠিক ৪ ডিজিটের ওটিপি কোড লিখুন' : 'Please enter the 4-digit OTP code');
      return;
    }

    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '1234' && otpCode.trim() !== '4966') {
      setErrorMsg(language === 'bn' ? 'ভুল ওটিপি কোড! অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Invalid OTP code. Please check SMS.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (authSubMode === 'register') {
        const res = await registerCustomer(name || 'Valued Customer', phone, email, address, undefined, 'phone_otp');
        if (res.success) {
          onSuccess('home');
          onClose();
        } else {
          setErrorMsg(res.message || 'Registration failed');
        }
      } else {
        const res = await loginCustomer(phone);
        if (res.success) {
          onSuccess('home');
          onClose();
        } else {
          setErrorMsg(res.message || 'Login failed');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification error');
    } finally {
      setLoading(false);
    }
  };

  // Google Login / Signup
  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await loginWithGoogle({
        name: "Saiful Google User",
        email: "sent9696@gmail.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
      });

      if (res.success) {
        setSuccessMsg(language === 'bn' ? 'Google দিয়ে সফলভাবে সাইন-ইন হয়েছে!' : 'Signed in with Google!');
        setTimeout(() => {
          onSuccess('home');
          onClose();
        }, 300);
      } else {
        setErrorMsg(res.message || 'Google authentication failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Auth error');
    } finally {
      setLoading(false);
    }
  };

  // Standard Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
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
        if (authSubMode === 'register') {
          const res = await registerCustomer(name, phone, email, address, password, 'email_password');
          if (res.success) {
            onSuccess('home');
            onClose();
          } else {
            setErrorMsg(res.message || 'Registration failed');
          }
        } else {
          const res = await loginCustomer(identifier, password);
          if (res.success) {
            onSuccess('home');
            onClose();
          } else {
            setErrorMsg(res.message || 'Login failed');
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
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
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-md shadow-emerald-950">
              {activeTab === 'admin' ? (
                <Shield className="w-5 h-5" />
              ) : activeTab === 'staff' ? (
                <FileCheck className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                {activeTab === 'admin'
                  ? (language === 'bn' ? 'অ্যাডমিন CMS প্যানেল' : 'Admin CMS Portal')
                  : activeTab === 'staff'
                  ? (language === 'bn' ? 'স্টাফ ও অপারেটর পোর্টাল' : 'Staff & Operator Login')
                  : (authSubMode === 'register' 
                      ? (language === 'bn' ? 'নতুন কাস্টমার একাউন্ট খুলুন' : 'Create Customer Account')
                      : (language === 'bn' ? 'কাস্টমার লগইন ও একাউন্ট' : 'Customer Account Login'))}
              </h3>
              <span className="text-[11px] text-neutral-400">
                {language === 'bn' ? 'সাইফুল এন্টারপ্রাইজ ডিজিটাল সার্ভিস ও পেপার স্টোর' : 'Saiful Enterprise Secure Portal'}
              </span>
            </div>
          </div>

          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Role Tabs */}
        <div className="grid grid-cols-3 bg-neutral-950/90 p-1.5 border-b border-neutral-800 text-xs font-semibold">
          <button
            type="button"
            id="auth-tab-customer"
            onClick={() => { setActiveTab('customer'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'customer'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'গ্রাহক (Customer)' : 'Customer'}</span>
          </button>

          <button
            type="button"
            id="auth-tab-staff"
            onClick={() => { setActiveTab('staff'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'staff'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'স্টাফ পোর্টাল' : 'Staff'}</span>
          </button>

          <button
            type="button"
            id="auth-tab-admin"
            onClick={() => { setActiveTab('admin'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অ্যাডমিন CMS' : 'Admin'}</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Status Banners */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 shadow-lg animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">
                  {language === 'bn' ? 'সতর্কতা / ত্রুটি:' : 'Authentication Error:'}
                </strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* CUSTOMER AUTHENTICATION OPTIONS */}
          {activeTab === 'customer' && (
            <div className="space-y-4">
              {/* Google 1-Click Signup/Login */}
              <button
                type="button"
                id="auth-google-btn"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800/90 border border-neutral-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md group"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>
                  {language === 'bn' ? 'গুগল (Google) দিয়ে ১-ক্লিকে সাইন-আপ / লগইন' : 'Continue with Google Account'}
                </span>
              </button>

              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <div className="flex-1 h-px bg-neutral-800" />
                <span>{language === 'bn' ? 'অথবা ফোন ওটিপি / ইমেইল দিয়ে' : 'Or with Phone OTP / Email'}</span>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>

              {/* Sub-Tabs: Login vs Register */}
              <div className="flex rounded-xl bg-neutral-950 p-1 border border-neutral-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setAuthSubMode('login'); setErrorMsg(null); }}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    authSubMode === 'login' ? 'bg-neutral-800 text-emerald-400 shadow-sm' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {language === 'bn' ? 'মোবাইল / আইডি দিয়ে লগইন' : 'Sign In with Mobile/Email'}
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthSubMode('register'); setErrorMsg(null); }}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    authSubMode === 'register' ? 'bg-neutral-800 text-emerald-400 shadow-sm' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {language === 'bn' ? 'নতুন একাউন্ট খুলুন (OTP ভেরিফাইড)' : 'Create Account (Phone OTP)'}
                </button>
              </div>

              {/* Customer Registration with Phone OTP */}
              {authSubMode === 'register' ? (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      {language === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Kamrul Hasan"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      {language === 'bn' ? 'মোবাইল নম্বর (SMS ভেরিফিকেশন হবে) *' : 'Phone Number (SMS Verification) *'}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="01712345678"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading || otpTimer > 0}
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{otpTimer > 0 ? `${otpTimer}s` : (otpSent ? (language === 'bn' ? 'আবার পাঠান' : 'Resend') : (language === 'bn' ? 'OTP পাঠান' : 'Send OTP'))}</span>
                      </button>
                    </div>
                  </div>

                  {otpSent && (
                    <div className="p-3.5 rounded-2xl bg-neutral-950 border border-emerald-500/40 space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between text-xs text-emerald-300">
                        <span className="flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? '৪ ডিজিটের OTP কোড লিখুন:' : 'Enter 4-digit OTP code:'}</span>
                        </span>
                        <span className="font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-400 border border-emerald-500/30">
                          Code: {generatedOtp}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value)}
                          placeholder="4966"
                          className="w-full text-center tracking-widest text-lg font-mono font-bold py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtpAndLogin}
                          disabled={loading || otpCode.length !== 4}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{language === 'bn' ? 'ভেরিফাই ও সম্পন্ন' : 'Verify & Join'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {language === 'bn' ? 'ঠিকানা (ঐচ্ছিক)' : 'Address (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="Tejgaon, Dhaka"
                        className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {!otpSent && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.01]"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>{language === 'bn' ? 'মোবাইল নম্বর যাচাই করে একাউন্ট তৈরি করুন' : 'Verify Phone & Create Account'}</span>
                    </button>
                  )}
                </div>
              ) : (
                /* Customer Login Form */
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      {language === 'bn' ? 'মোবাইল নম্বর অথবা ইমেইল' : 'Mobile Number or Email'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
                        placeholder="017XXXXXXXX or email"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.01]"
                  >
                    <span>{language === 'bn' ? 'গ্রাহক অ্যাকাউন্টে লগইন করুন' : 'Sign In as Customer'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Quick Demo Customer Account */}
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
                    <div>
                      <span className="text-neutral-500">Demo Customer: </span>
                      <strong className="text-emerald-400">01712345678</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIdentifier('01712345678')}
                      className="text-emerald-400 hover:text-emerald-300 font-sans text-[11px] underline"
                    >
                      Fill
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STAFF & OPERATOR LOGIN */}
          {activeTab === 'staff' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {language === 'bn' ? 'এমপ্লয়ি আইডি / মোবাইল / ইমেইল' : 'Employee ID / Mobile / Email'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="SE-EMP-001 or 01517992585"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="staff123"
                    className="w-full pl-9 pr-10 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.01]"
              >
                <span>{language === 'bn' ? 'স্টাফ পোর্টালে লগইন করুন' : 'Sign In as Staff'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
                <div>
                  <span className="text-neutral-500">ID: </span>
                  <strong className="text-emerald-400">SE-EMP-001</strong>
                  <span className="mx-2 text-neutral-600">|</span>
                  <span className="text-neutral-500">Pass: </span>
                  <strong className="text-emerald-400">staff123</strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('SE-EMP-001');
                    setPassword('staff123');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-sans text-[11px] underline"
                >
                  Fill
                </button>
              </div>
            </form>
          )}

          {/* MASTER ADMIN CMS LOGIN */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              {/* 1-Click Instant Master Admin Login */}
              <button
                type="button"
                id="auth-instant-admin-btn"
                onClick={handleInstantMasterLogin}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Shield className="w-4 h-4 text-emerald-200" />
                <span>{language === 'bn' ? '⚡ ১-ক্লিকে সরাসরি অ্যাডমিন প্যানেলে প্রবেশ করুন' : '⚡ 1-Click Direct Admin Access'}</span>
              </button>

              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <div className="flex-1 h-px bg-neutral-800" />
                <span>{language === 'bn' ? 'অথবা ইউজার ও পাসওয়ার্ড দিন' : 'Or enter credentials'}</span>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'অ্যাডমিন ইউজার আইডি (Username / Email)' : 'Admin ID or Email'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="Admin"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড (Password)' : 'Admin Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="J@hid2045"
                      className="w-full pl-9 pr-10 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>{language === 'bn' ? 'অ্যাডমিন প্যানেলে লগইন করুন' : 'Sign In as Admin'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
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
                    className="text-emerald-400 hover:text-emerald-300 font-sans text-[11px] underline"
                  >
                    Fill
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
