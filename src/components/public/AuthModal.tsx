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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialMode === 'admin') {
      setActiveTab('admin');
      setIdentifier('admin');
      setPassword('admin123');
    } else if (initialMode === 'staff') {
      setActiveTab('staff');
      setIdentifier('SE-EMP-001');
      setPassword('staff123');
    } else if (initialMode === 'register') {
      setActiveTab('register');
      setIdentifier('');
      setPassword('');
    } else {
      setActiveTab('customer');
      setIdentifier('01711000000');
      setPassword('customer123');
    }
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
      setErrorMsg(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type: 'admin' | 'staff' | 'customer') => {
    if (type === 'admin') {
      setActiveTab('admin');
      setIdentifier('admin');
      setPassword('admin123');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              {activeTab === 'admin' ? <Shield className="w-4 h-4" /> : activeTab === 'staff' ? <FileCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-none">
                {activeTab === 'admin' ? 'Super Admin / Manager Login' : activeTab === 'staff' ? 'Staff & Operator Portal' : 'Customer Account'}
              </h3>
              <span className="text-[10px] text-neutral-400">Saiful Enterprise Secure Access</span>
            </div>
          </div>

          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 bg-neutral-950/80 p-1.5 border-b border-neutral-800 text-xs font-semibold">
          <button
            type="button"
            id="auth-tab-admin"
            onClick={() => handleFillDemo('admin')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'admin'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'অ্যাডমিন' : 'Admin'}
          </button>

          <button
            type="button"
            id="auth-tab-staff"
            onClick={() => handleFillDemo('staff')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'staff'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'স্টাফ' : 'Staff'}
          </button>

          <button
            type="button"
            id="auth-tab-customer"
            onClick={() => handleFillDemo('customer')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'customer' || activeTab === 'register'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'গ্রাহক' : 'Customer'}
          </button>
        </div>

        {/* Demo Credentials Quick-box */}
        <div className="p-3 bg-neutral-950/90 border-b border-neutral-800/80 text-[11px] text-neutral-300 flex items-center justify-between">
          <div>
            <span className="text-emerald-400 font-semibold block">
              🔑 {activeTab === 'admin' ? 'Admin Access:' : activeTab === 'staff' ? 'Staff Access:' : 'Customer Access:'}
            </span>
            <span className="font-mono text-neutral-300">
              {activeTab === 'admin' ? 'User: admin | Pass: admin123' : activeTab === 'staff' ? 'ID: SE-EMP-001 | Pass: staff123' : 'Phone: 01711000000 | Pass: customer123'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleFillDemo(activeTab === 'register' ? 'customer' : activeTab)}
            className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 rounded text-[10px] font-bold"
          >
            Fill Demo
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
                    ? (language === 'bn' ? 'অ্যাডমিন ইউজার আইডি / ইমেইল' : 'Admin User ID / Email')
                    : activeTab === 'staff'
                    ? (language === 'bn' ? 'এমপ্লয়ি আইডি (Employee ID)' : 'Employee ID (e.g. SE-EMP-001)')
                    : (language === 'bn' ? 'মোবাইল নম্বর / ইমেইল' : 'Phone Number / Email')}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    id="auth-identifier-input"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={activeTab === 'staff' ? 'SE-EMP-001' : activeTab === 'admin' ? 'admin' : '01711000000'}
                    className="w-full pl-9 pr-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {language === 'bn' ? 'পাসওয়ার্ড (Password)' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    id="auth-password-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {activeTab === 'admin' ? 'Log In to Admin CMS' : activeTab === 'staff' ? 'Enter Staff Portal' : activeTab === 'register' ? 'Register Account' : 'Customer Log In'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
