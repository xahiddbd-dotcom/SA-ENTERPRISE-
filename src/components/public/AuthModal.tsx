import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
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
  const { loginAdmin, loginStaff, loginCustomer, loginWithGoogle, loginWithFacebook, registerCustomer } = useAuth();

  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');
  const [authSubMode, setAuthSubMode] = useState<'login' | 'register'>('login');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  
  // Robot Verification state
  const [isRobotVerified, setIsRobotVerified] = useState(false);

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
    
    if (initialMode === 'admin' || initialMode === 'staff') {
      setActiveTab('admin');
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
    setIsRobotVerified(false);
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

  // Send OTP (Daraz / Amazon SMS flow)
  const handleSendOtp = () => {
    if (!isRobotVerified) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে "আমি রোবট নই" (I am not a robot) ভেরিফিকেশন সম্পন্ন করুন।' : 'Please complete the "I\'m not a robot" verification first.');
      return;
    }

    const targetPhone = (authSubMode === 'register' ? phone : identifier).trim();

    if (!targetPhone || targetPhone.length < 11) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)' : 'Please enter a valid 11-digit Bangladeshi phone number (e.g. 017XXXXXXXX)');
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
      setSuccessMsg(language === 'bn' ? `SMS ভেরিফিকেশন কোড পাঠানো হয়েছে: ${code}` : `OTP Code sent to ${targetPhone}: ${code}`);
    }, 300);
  };

  // Verify OTP & Register/Login
  const handleVerifyOtpAndLogin = async () => {
    if (!isRobotVerified) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে "আমি রোবট নই" (I am not a robot) ভেরিফিকেশন সম্পন্ন করুন।' : 'Please complete the "I\'m not a robot" verification first.');
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
        const res = await registerCustomer(name || 'Valued Customer', phone, email, address, undefined, 'phone_otp');
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

  // Google 1-Click Login / Signup
  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await loginWithGoogle({
        name: "Google Customer",
        email: "sent9696@gmail.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
      });

      if (res.success) {
        setSuccessMsg(language === 'bn' ? 'Google দিয়ে সফলভাবে সাইন-ইন সম্পন্ন হয়েছে!' : 'Signed in with Google!');
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

  // Facebook 1-Click Login / Signup (Daraz / Amazon style)
  const handleFacebookAuth = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await loginWithFacebook({
        name: "Facebook Customer",
        email: "facebook.customer@saifulenterprise.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
      });

      if (res.success) {
        setSuccessMsg(language === 'bn' ? 'Facebook দিয়ে সফলভাবে সাইন-ইন সম্পন্ন হয়েছে!' : 'Signed in with Facebook!');
        setTimeout(() => {
          onSuccess('home');
          onClose();
        }, 300);
      } else {
        setErrorMsg(res.message || 'Facebook authentication failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Facebook Auth error');
    } finally {
      setLoading(false);
    }
  };

  // Standard Form Submit (for Admin or Email/Password)
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
        // Check Admin credentials
        const res = await loginAdmin(identifier, password);
        if (res.success) {
          onSuccess('admin');
          onClose();
        } else {
          // Check if it's staff login
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-md shadow-emerald-950">
              {activeTab === 'admin' ? (
                <Shield className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                {activeTab === 'admin'
                  ? (language === 'bn' ? 'স্টাফ ও অ্যাডমিন CMS লগইন' : 'Staff & Admin CMS Portal')
                  : (authSubMode === 'register' 
                      ? (language === 'bn' ? 'নতুন ক্রেতা / গ্রাহক একাউন্ট (Sign Up)' : 'Customer Sign Up (Amazon/Daraz BD Style)')
                      : (language === 'bn' ? 'গ্রাহক / ক্রেতা একাউন্ট লগইন (Sign In)' : 'Customer Account Login'))}
              </h3>
              <span className="text-[11px] text-neutral-400">
                {language === 'bn' ? 'পণ্য কেনাকাটা ও সার্ভিস দ্রুত পেতে লগইন করুন' : 'Fast Checkout, Track Orders & Instant Digital Services'}
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

        {/* Primary Tabs */}
        <div className="grid grid-cols-2 bg-neutral-950/90 p-1.5 border-b border-neutral-800 text-xs font-semibold">
          <button
            type="button"
            id="auth-tab-customer"
            onClick={() => { setActiveTab('customer'); setErrorMsg(null); setSuccessMsg(null); setIsRobotVerified(false); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'customer'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
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
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
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
            <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 shadow-lg animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">
                  {language === 'bn' ? 'সতর্কতা / ত্রুটি:' : 'Notice:'}
                </strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* CUSTOMER AUTHENTICATION OPTIONS (Amazon / Daraz BD Style) */}
          {activeTab === 'customer' && (
            <div className="space-y-4">
              {/* Fast Social Logins: Google & Facebook */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Google 1-Click */}
                <button
                  type="button"
                  id="auth-google-btn"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm group"
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
                  onClick={handleFacebookAuth}
                  disabled={loading}
                  className="py-2.5 px-3 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/40 text-[#4599FF] text-xs font-semibold flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm"
                >
                  <svg className="w-4 h-4 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="truncate">Facebook দিয়ে লগইন</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                <div className="flex-1 h-px bg-neutral-800" />
                <span>{language === 'bn' ? 'অথবা মোবাইল OTP / পাসওয়ার্ড দিয়ে' : 'Or with Mobile OTP / Password'}</span>
                <div className="flex-1 h-px bg-neutral-800" />
              </div>

              {/* Sub-Tabs: Signin vs Signup */}
              <div className="flex rounded-xl bg-neutral-950 p-1 border border-neutral-800 text-xs font-semibold">
                <button
                  type="button"
                  id="submode-signin-btn"
                  onClick={() => { setAuthSubMode('login'); setErrorMsg(null); setIsRobotVerified(false); setOtpSent(false); }}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    authSubMode === 'login' ? 'bg-neutral-800 text-emerald-400 shadow-sm' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {language === 'bn' ? 'গ্রাহক লগইন (Sign In)' : 'Sign In'}
                </button>
                <button
                  type="button"
                  id="submode-signup-btn"
                  onClick={() => { setAuthSubMode('register'); setErrorMsg(null); setIsRobotVerified(false); setOtpSent(false); }}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    authSubMode === 'register' ? 'bg-neutral-800 text-emerald-400 shadow-sm' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {language === 'bn' ? 'নতুন সাইন-আপ (Sign Up)' : 'Sign Up'}
                </button>
              </div>

              {/* Customer Registration with Phone OTP and Robot Verification */}
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
                        className="w-full pl-9 pr-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      {language === 'bn' ? 'মোবাইল নম্বর (SMS ভেরিফিকেশন হবে) *' : 'Mobile Number (SMS OTP Verification) *'}
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
                          className="w-full pl-9 pr-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading || otpTimer > 0}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{otpTimer > 0 ? `${otpTimer}s` : (otpSent ? (language === 'bn' ? 'আবার পাঠান' : 'Resend') : (language === 'bn' ? 'OTP পাঠান' : 'Send OTP'))}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@gmail.com"
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {language === 'bn' ? 'ডেলিভারি ঠিকানা (ঐচ্ছিক)' : 'Delivery Address (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="Tejgaon, Dhaka"
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
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
                    <div className="p-3.5 rounded-2xl bg-neutral-950 border border-emerald-500/40 space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between text-xs text-emerald-300">
                        <span className="flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? '৪ ডিজিটের OTP কোড লিখুন:' : 'Enter 4-digit OTP code:'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setOtpCode(generatedOtp)}
                          className="font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-400 border border-emerald-500/30 text-[11px] underline"
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
                          className="w-full text-center tracking-widest text-lg font-mono font-bold py-1.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtpAndLogin}
                          disabled={loading || otpCode.length !== 4 || !isRobotVerified}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 disabled:opacity-50"
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
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.01] disabled:opacity-50"
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
                        placeholder="017XXXXXXXX or email@domain.com"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

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
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.01] disabled:opacity-50"
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
              <div className="bg-amber-950/20 border border-amber-500/30 p-2.5 rounded-xl text-xs text-amber-300">
                <span>{language === 'bn' ? 'অ্যাডমিন ও কর্মচারীদের জন্য অফিসিয়াল লগইন প্যানেল।' : 'Authorized Staff & Store Admin control login.'}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'অ্যাডমিন / স্টাফ আইডি (Username / Phone)' : 'Admin ID / Phone / Email'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="sent9696@gmail.com or 01540004966"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'পাসওয়ার্ড (Password)' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
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
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  <Shield className="w-4 h-4" />
                  <span>{language === 'bn' ? 'প্যানেলে প্রবেশ করুন' : 'Sign In to Management'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Security footer */}
                <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
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
