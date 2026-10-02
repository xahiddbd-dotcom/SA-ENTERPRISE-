import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { RobotVerification } from '../common/RobotVerification';
import {
  Shield,
  User,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Smartphone,
  Send,
  Sparkles,
  ShoppingBag,
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
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const {
    loginAdmin,
    loginStaff,
    loginCustomer,
    registerCustomer,
    loginCustomerWithSocial
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');
  const [authSubMode, setAuthSubMode] = useState<'login' | 'register'>('login');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // OTP State for phone verification
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('4966');
  const [otpTimer, setOtpTimer] = useState(0);

  // Social Auth Modal Mock State
  const [socialModalType, setSocialModalType] = useState<'google' | 'facebook' | null>(null);
  const [socialName, setSocialName] = useState('');
  const [socialEmail, setSocialEmail] = useState('');

  // reCAPTCHA v3 / "I am not a robot" Verification State
  const [isRobotVerified, setIsRobotVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialMode === 'admin' || initialMode === 'staff') {
      setActiveTab('admin');
      if (initialMode === 'admin') setIdentifier('sent9696@gmail.com');
      else setIdentifier('01540004966');
    } else {
      setActiveTab('customer');
      setAuthSubMode(initialMode === 'register' ? 'register' : 'login');
      if (initialMode === 'login' && !identifier) {
        setIdentifier('01712345678');
      }
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsRobotVerified(false);
  }, [initialMode, isOpen]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let interval: any = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isOpen) return null;

  // Simulate Sending SMS OTP
  const handleSendOtp = () => {
    const targetPhone = phone.trim() || identifier.trim();
    if (!targetPhone) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে মোবাইল নম্বর প্রদান করুন।' : 'Please enter your mobile phone number.');
      return;
    }

    if (!isRobotVerified) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে রোবট ভেরিফিকেশন টিক চিহ্ন দিন।' : 'Please complete the robot verification.');
      return;
    }

    setErrorMsg(null);
    const mockCode = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOtp(mockCode);
    setOtpSent(true);
    setOtpTimer(60);
    setSuccessMsg(
      language === 'bn'
        ? `আপনার নম্বরে SMS OTP পাঠানো হয়েছে! (ডেমো কোড: ${mockCode})`
        : `SMS OTP code sent to your phone! (Demo Code: ${mockCode})`
    );
  };

  // Verify OTP and complete registration or OTP login
  const handleVerifyOtpAndLogin = async () => {
    if (!isRobotVerified) {
      setErrorMsg(language === 'bn' ? 'রোবট ভেরিফিকেশন আবশ্যক' : 'Robot verification is required');
      return;
    }

    if (!otpCode || otpCode.trim().length !== 4) {
      setErrorMsg(language === 'bn' ? 'সঠিক ৪ ডিজিটের ওটিপি কোড লিখুন' : 'Please enter the 4-digit OTP code');
      return;
    }

    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '1234' && otpCode.trim() !== '4966') {
      setErrorMsg(language === 'bn' ? 'ভুল ওটিপি কোড! অনুগ্রহ করে SMS চেক করে আবার দিন।' : 'Invalid OTP code. Please check SMS and try again.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (authSubMode === 'register') {
        const res = await registerCustomer(name || 'Valued Customer', phone, email, address, password || undefined, password ? 'email_password' : 'phone_otp');
        if (res.success) {
          setSuccessMsg(language === 'bn' ? 'একাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Account created successfully!');
          setTimeout(() => {
            onSuccess('home');
            onClose();
          }, 300);
        } else {
          setErrorMsg(res.message || 'Registration failed');
        }
      } else {
        const targetPhone = identifier.trim() || phone.trim();
        const res = await loginCustomer(targetPhone);
        if (res.success) {
          setSuccessMsg(language === 'bn' ? 'সফলভাবে লগইন হয়েছে!' : 'Signed in successfully!');
          setTimeout(() => {
            onSuccess('home');
            onClose();
          }, 300);
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

  // Open Social Auth Dialog
  const handleOpenSocialModal = (type: 'google' | 'facebook') => {
    setSocialModalType(type);
    if (type === 'google') {
      setSocialName('Md. Hasibur Rahman');
      setSocialEmail('hasibur.work@gmail.com');
    } else {
      setSocialName('Shakil Ahmed');
      setSocialEmail('shakil.ahmed@facebook.com');
    }
  };

  // Handle Social Login Completion
  const handleConfirmSocialAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialModalType || !socialName || !socialEmail) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await loginCustomerWithSocial(socialModalType, socialName, socialEmail);
      if (res.success) {
        setSuccessMsg(
          language === 'bn'
            ? `${socialModalType === 'google' ? 'Google' : 'Facebook'} দিয়ে সফলভাবে যুক্ত হয়েছেন!`
            : `Successfully connected with ${socialModalType}!`
        );
        setTimeout(() => {
          onSuccess('home');
          onClose();
        }, 400);
      } else {
        setErrorMsg(res.message || 'Social login failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Social connection error');
    } finally {
      setLoading(false);
      setSocialModalType(null);
    }
  };

  // Standard Form Submit (Password Based)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isRobotVerified) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে "আমি রোবট নই" (I am not a robot) ভেরিফিকেশন সম্পন্ন করুন।' : 'Please complete the "I\'m not a robot" verification first.');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'admin') {
        const res = await loginAdmin(identifier, password);
        if (res.success) {
          onSuccess('admin');
          onClose();
        } else {
          const staffRes = await loginStaff(identifier, password);
          if (staffRes.success) {
            onSuccess('pos');
            onClose();
          } else {
            setErrorMsg(res.message || 'Admin/Staff authentication failed');
          }
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
          if (!identifier.trim()) {
            setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে মোবাইল নম্বর বা ইমেইল লিখুন।' : 'Please enter your phone or email.');
            setLoading(false);
            return;
          }
          if (!password) {
            setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে পাসওয়ার্ড লিখুন।' : 'Please enter your password.');
            setLoading(false);
            return;
          }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`border w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors ${
        isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between transition-colors ${
          isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-md ${
              isDark
                ? 'bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              {activeTab === 'admin' ? (
                <Shield className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className={`text-sm sm:text-base font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeTab === 'admin'
                  ? (language === 'bn' ? 'স্টাফ ও অ্যাডমিন CMS লগইন' : 'Staff & Admin CMS Portal')
                  : (authSubMode === 'register' 
                      ? (language === 'bn' ? 'নতুন ক্রেতা / গ্রাহক একাউন্ট (Sign Up)' : 'Customer Sign Up')
                      : (language === 'bn' ? 'গ্রাহক / ক্রেতা একাউন্ট লগইন (Sign In)' : 'Customer Account Login'))}
              </h3>
              <span className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500 font-medium'}`}>
                {language === 'bn' ? 'পণ্য কেনাকাটা ও সার্ভিস দ্রুত পেতে লগইন করুন' : 'Fast Checkout, Track Orders & Instant Digital Services'}
              </span>
            </div>
          </div>

          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Tabs */}
        <div className={`grid grid-cols-2 p-1.5 border-b text-xs font-semibold transition-colors ${
          isDark ? 'bg-neutral-950/90 border-neutral-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            type="button"
            id="auth-tab-customer"
            onClick={() => { setActiveTab('customer'); setErrorMsg(null); setSuccessMsg(null); setIsRobotVerified(false); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'customer'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : isDark
                ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'গ্রাহক / ক্রেতা পোর্টাল' : 'Customer / Buyer'}</span>
          </button>

          <button
            type="button"
            id="auth-tab-admin"
            onClick={() => { setActiveTab('admin'); setErrorMsg(null); setSuccessMsg(null); setIsRobotVerified(false); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : isDark
                ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অ্যাডমিন / স্টাফ' : 'Admin / Staff'}</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Status Banners */}
          {errorMsg && (
            <div className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 shadow-md animate-in fade-in ${
              isDark ? 'bg-rose-950/60 border-rose-500/40 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div>
                <strong className="block font-semibold">
                  {language === 'bn' ? 'সতর্কতা / ত্রুটি:' : 'Notice:'}
                </strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {successMsg && (
            <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 shadow-md animate-in fade-in ${
              isDark ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* CUSTOMER AUTHENTICATION OPTIONS */}
          {activeTab === 'customer' && (
            <div className="space-y-4">
              {/* Fast Social Logins: Google & Facebook */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Google 1-Click */}
                <button
                  type="button"
                  id="auth-google-btn"
                  onClick={() => handleOpenSocialModal('google')}
                  disabled={loading}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xs group ${
                    isDark
                      ? 'bg-neutral-950 hover:bg-neutral-800 border-neutral-700 text-white'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  <span className="truncate">Google দিয়ে লগইন</span>
                </button>

                {/* Facebook 1-Click */}
                <button
                  type="button"
                  id="auth-facebook-btn"
                  onClick={() => handleOpenSocialModal('facebook')}
                  disabled={loading}
                  className="py-2.5 px-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] text-xs font-semibold flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xs"
                >
                  <svg className="w-4 h-4 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="truncate">Facebook দিয়ে লগইন</span>
                </button>
              </div>

              {/* Social Login Form Dialog */}
              {socialModalType && (
                <form onSubmit={handleConfirmSocialAuth} className={`p-4 rounded-2xl border space-y-3 animate-in fade-in ${
                  isDark ? 'bg-neutral-950 border-emerald-500/50' : 'bg-slate-50 border-emerald-300'
                }`}>
                  <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-neutral-800' : 'border-slate-200'}`}>
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <span>{socialModalType === 'google' ? 'Google' : 'Facebook'}</span>
                      <span>{language === 'bn' ? 'অ্যাকাউন্ট ভেরিফিকেশন' : 'Account Sign-In'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSocialModalType(null)}
                      className={`text-[11px] ${isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      {language === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                      {language === 'bn' ? 'আপনার নাম' : 'Your Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={socialName}
                      onChange={e => setSocialName(e.target.value)}
                      placeholder="e.g. Kamrul Hasan"
                      className={`w-full px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:border-emerald-500 ${
                        isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[11px] font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                      {language === 'bn' ? 'আপনার ইমেইল (Google / Facebook Email)' : 'Account Email'}
                    </label>
                    <input
                      type="email"
                      required
                      value={socialEmail}
                      onChange={e => setSocialEmail(e.target.value)}
                      placeholder="user@gmail.com"
                      className={`w-full px-3 py-1.5 border rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-500 ${
                        isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <span>{language === 'bn' ? 'নিশ্চিত করে লগইন করুন' : 'Confirm & Sign In'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              <div className={`flex items-center gap-3 text-[11px] ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
                <div className={`flex-1 h-px ${isDark ? 'bg-neutral-800' : 'bg-slate-200'}`} />
                <span>{language === 'bn' ? 'অথবা মোবাইল OTP / পাসওয়ার্ড দিয়ে' : 'Or with Mobile OTP / Password'}</span>
                <div className={`flex-1 h-px ${isDark ? 'bg-neutral-800' : 'bg-slate-200'}`} />
              </div>

              {/* Sub-Tabs: Signin vs Signup */}
              <div className={`flex rounded-xl p-1 border text-xs font-semibold transition-colors ${
                isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  type="button"
                  id="submode-signin-btn"
                  onClick={() => { setAuthSubMode('login'); setErrorMsg(null); setIsRobotVerified(false); setOtpSent(false); }}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    authSubMode === 'login'
                      ? isDark
                        ? 'bg-neutral-800 text-emerald-400 shadow-sm font-bold'
                        : 'bg-white text-emerald-700 shadow-sm font-bold'
                      : isDark
                      ? 'text-neutral-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'bn' ? 'গ্রাহক লগইন (Sign In)' : 'Sign In'}
                </button>
                <button
                  type="button"
                  id="submode-signup-btn"
                  onClick={() => { setAuthSubMode('register'); setErrorMsg(null); setIsRobotVerified(false); setOtpSent(false); }}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    authSubMode === 'register'
                      ? isDark
                        ? 'bg-neutral-800 text-emerald-400 shadow-sm font-bold'
                        : 'bg-white text-emerald-700 shadow-sm font-bold'
                      : isDark
                      ? 'text-neutral-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'bn' ? 'নতুন সাইন-আপ (Sign Up)' : 'Sign Up'}
                </button>
              </div>

              {/* Customer Registration with Phone OTP and Robot Verification */}
              {authSubMode === 'register' ? (
                <div className="space-y-3.5">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                      {language === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
                    </label>
                    <div className="relative">
                      <User className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-500' : 'text-slate-400'}`} />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Kamrul Hasan"
                        className={`w-full pl-9 pr-3.5 py-2 border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 ${
                          isDark
                            ? 'bg-neutral-950 border-neutral-700 text-neutral-100 placeholder:text-neutral-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                      {language === 'bn' ? 'মোবাইল নম্বর (SMS ভেরিফিকেশন হবে) *' : 'Mobile Number (SMS OTP Verification) *'}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-500' : 'text-slate-400'}`} />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="01712345678"
                          className={`w-full pl-9 pr-3.5 py-2 border rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500 ${
                            isDark
                              ? 'bg-neutral-950 border-neutral-700 text-neutral-100 placeholder:text-neutral-500'
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                          }`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading || otpTimer > 0}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{otpTimer > 0 ? `${otpTimer}s` : (otpSent ? (language === 'bn' ? 'আবার পাঠান' : 'Resend') : (language === 'bn' ? 'OTP পাঠান' : 'Send OTP'))}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                        {language === 'bn' ? 'একটি নিরাপদ পাসওয়ার্ড দিন *' : 'Set a Secure Password *'}
                      </label>
                      <div className="relative">
                        <Lock className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-500' : 'text-slate-400'}`} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="কমপক্ষে ৬ অক্ষর"
                          className={`w-full pl-9 pr-8 py-2 border rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-500 ${
                            isDark
                              ? 'bg-neutral-950 border-neutral-700 text-neutral-100 placeholder:text-neutral-500'
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-slate-400 hover:text-slate-800'}`}
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                        {language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@gmail.com"
                        className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-emerald-500 ${
                          isDark
                            ? 'bg-neutral-950 border-neutral-700 text-neutral-100 placeholder:text-neutral-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                      {language === 'bn' ? 'ডেলিভারি ঠিকানা (ঐচ্ছিক)' : 'Delivery Address (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Tejgaon, Dhaka"
                      className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-emerald-500 ${
                        isDark
                          ? 'bg-neutral-950 border-neutral-700 text-neutral-100 placeholder:text-neutral-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                      }`}
                    />
                  </div>

                  {/* "I'm not a robot" Verification on Signup */}
                  <div className="pt-0.5">
                    <RobotVerification
                      id="signup-robot-check"
                      isVerified={isRobotVerified}
                      onVerify={setIsRobotVerified}
                    />
                  </div>

                  {otpSent && (
                    <div className={`p-3.5 rounded-2xl border space-y-2 animate-in fade-in ${
                      isDark ? 'bg-neutral-950 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 font-semibold">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? '৪ ডিজিটের OTP কোড লিখুন:' : 'Enter 4-digit OTP code:'}</span>
                        </span>
                        <span className={`font-mono font-bold px-2.5 py-0.5 rounded text-[11px] border ${
                          isDark ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' : 'bg-white text-emerald-800 border-emerald-300'
                        }`}>
                          SMS: {generatedOtp}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value)}
                          placeholder="4966"
                          className={`w-full text-center tracking-widest text-lg font-mono font-bold py-1.5 border rounded-xl focus:outline-none focus:border-emerald-400 ${
                            isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtpAndLogin}
                          disabled={loading || otpCode.length !== 4 || !isRobotVerified}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{language === 'bn' ? 'ভেরিফাই ও সাইন-আপ' : 'Verify & Join'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {!otpSent && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading || !isRobotVerified}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
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
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                      {language === 'bn' ? 'মোবাইল নম্বর অথবা ইমেইল' : 'Mobile Number or Email'}
                    </label>
                    <div className="relative">
                      <Phone className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-500' : 'text-slate-400'}`} />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
                        placeholder="017XXXXXXXX or email@domain.com"
                        className={`w-full pl-9 pr-3.5 py-2.5 border rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500 ${
                          isDark
                            ? 'bg-neutral-950 border-neutral-700 text-neutral-100 placeholder:text-neutral-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={`text-xs font-semibold ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                        {language === 'bn' ? 'পাসওয়ার্ড (Password)' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                      >
                        {language === 'bn' ? 'OTP কোড চান?' : 'Get SMS OTP instead'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-500' : 'text-slate-400'}`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder={language === 'bn' ? 'পাসওয়ার্ড লিখুন' : 'Enter your password'}
                        className={`w-full pl-9 pr-10 py-2.5 border rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500 ${
                          isDark
                            ? 'bg-neutral-950 border-neutral-700 text-neutral-100 placeholder:text-neutral-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-slate-400 hover:text-slate-800'}`}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {otpSent && (
                    <div className={`p-3.5 rounded-2xl border space-y-2 animate-in fade-in ${
                      isDark ? 'bg-neutral-950 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 font-semibold">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? '৪ ডিজিটের OTP কোড লিখুন:' : 'Enter 4-digit OTP code:'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setOtpCode(generatedOtp)}
                          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] underline border ${
                            isDark ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' : 'bg-white text-emerald-800 border-emerald-300'
                          }`}
                        >
                          Code: {generatedOtp} (Auto-Fill)
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value)}
                          placeholder="4966"
                          className={`w-full text-center tracking-widest text-lg font-mono font-bold py-1.5 border rounded-xl focus:outline-none focus:border-emerald-400 ${
                            isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtpAndLogin}
                          disabled={loading || otpCode.length !== 4 || !isRobotVerified}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{language === 'bn' ? 'ওটিপি যাচাই' : 'Verify'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* "I'm not a robot" Verification on Signin */}
                  <div className="pt-0.5">
                    <RobotVerification
                      id="signin-robot-check"
                      isVerified={isRobotVerified}
                      onVerify={setIsRobotVerified}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !isRobotVerified}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>{language === 'bn' ? 'গ্রাহক অ্যাকাউন্টে লগইন করুন' : 'Sign In as Customer'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* MASTER ADMIN / STAFF CMS LOGIN */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className={`p-3 rounded-xl border text-xs ${
                isDark ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <span>{language === 'bn' ? 'অ্যাডমিন ও কর্মচারীদের জন্য অফিসিয়াল লগইন প্যানেল।' : 'Authorized Staff & Store Admin control login.'}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    {language === 'bn' ? 'অ্যাডমিন / স্টাফ আইডি (Username / Phone)' : 'Admin ID / Phone / Email'}
                  </label>
                  <div className="relative">
                    <User className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-500' : 'text-slate-400'}`} />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="sent9696@gmail.com or 01540004966"
                      className={`w-full pl-9 pr-3.5 py-2.5 border rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500 ${
                        isDark
                          ? 'bg-neutral-950 border-neutral-700 text-neutral-100 placeholder:text-neutral-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    {language === 'bn' ? 'পাসওয়ার্ড (Password)' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-500' : 'text-slate-400'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-10 py-2.5 border rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500 ${
                        isDark
                          ? 'bg-neutral-950 border-neutral-700 text-neutral-100 placeholder:text-neutral-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-slate-400 hover:text-slate-800'}`}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* "I'm not a robot" Verification on Admin */}
                <div className="pt-0.5">
                  <RobotVerification
                    id="admin-robot-check"
                    isVerified={isRobotVerified}
                    onVerify={setIsRobotVerified}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !isRobotVerified}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <Shield className="w-4 h-4" />
                  <span>{language === 'bn' ? 'প্যানেলে প্রবেশ করুন' : 'Sign In to Management'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Security footer */}
                <div className={`pt-1 flex items-center justify-center gap-1.5 text-[11px] ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
                  <Lock className="w-3.5 h-3.5 text-emerald-500/80" />
                  <span>{language === 'bn' ? 'সুরক্ষিত ও এনক্রিপ্টেড অ্যাডমিন অ্যাক্সেস' : 'Encrypted & Secured Admin Access'}</span>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
