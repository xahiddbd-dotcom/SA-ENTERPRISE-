import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Printer,
  ShoppingBag,
  Phone,
  MessageSquare,
  Search,
  Menu,
  X,
  User,
  Shield,
  FileCheck,
  Globe,
  LogOut,
  ChevronDown,
  BookOpen
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openCart: () => void;
  openAuthModal: (mode?: 'login' | 'register' | 'staff' | 'admin') => void;
  openSearchModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openCart,
  openAuthModal,
  openSearchModal
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, isAuthenticated, isAdmin, isStaff, logout } = useAuth();
  const { settings, cartItemCount } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t('home') },
    { id: 'services', label: t('services') },
    { id: 'shop', label: t('shop') },
    { id: 'about', label: t('about') },
    { id: 'contact', label: t('contact') }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      {/* Top micro bar for direct contact & fast access */}
      <div className="bg-neutral-900 border-b border-neutral-800/80 text-xs py-1.5 px-4 hidden md:block">
        <div className="container mx-auto flex items-center justify-between text-neutral-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-emerald-400 font-medium">
                {language === 'bn' ? 'দোকান খোলা আছে' : 'Shop Open Now'}
              </span>
              <span>• {language === 'bn' ? settings.openingHoursBn : settings.openingHours}</span>
            </span>
            <span className="text-neutral-500">|</span>
            <span className="truncate max-w-md text-neutral-400">
              📍 {language === 'bn' ? settings.addressBn : settings.address}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              id="header-call-link"
              href={`tel:${settings.phonePrimary}`}
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              <span>{settings.phonePrimary}</span>
            </a>
            <a
              id="header-whatsapp-link"
              href={`https://wa.me/88${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>{settings.whatsappNumber} (bKash/WhatsApp)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          id="brand-logo-btn"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight tracking-tight text-white flex items-center gap-1.5">
              <span>{language === 'bn' ? settings.businessNameBn : settings.businessName}</span>
            </div>
            <div className="text-[11px] text-neutral-400 truncate max-w-[200px] sm:max-w-xs">
              {language === 'bn' ? 'কম্পিউটার • প্রিন্ট • অনলাইন আবেদন' : 'Digital Services & Online Applications'}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/60 p-1 rounded-xl border border-neutral-800">
          {navLinks.map(link => (
            <button
              key={link.id}
              id={`nav-${link.id}`}
              onClick={() => handleNavClick(link.id)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === link.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search button */}
          <button
            id="global-search-trigger"
            onClick={openSearchModal}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Bilingual Language Switcher */}
          <button
            id="lang-toggle-btn"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-200 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
            title="Switch Language / ভাষা পরিবর্তন করুন"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
            <span className="text-neutral-500 text-[10px]">|</span>
            <span className="text-neutral-400 text-[11px]">{language === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Shopping Cart button */}
          <button
            id="header-cart-btn"
            onClick={openCart}
            className="relative p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-emerald-500/50 transition-colors"
            title="Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Special Button: Daily Shop Ledger (দৈনিক হিসাব খাতা) */}
          <button
            id="header-daily-ledger-special-btn"
            onClick={() => handleNavClick('ledger')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
              activeTab === 'ledger'
                ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-black border border-amber-300 ring-2 ring-amber-400/50 shadow-amber-950'
                : 'bg-gradient-to-r from-amber-500/20 via-emerald-500/10 to-teal-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-400 hover:scale-105 shadow-emerald-950'
            }`}
            title="দৈনিক দোকানের হিসাব খাতা (Daily Shop Ledger & Tally)"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">{language === 'bn' ? 'দৈনিক হিসাব খাতা' : 'Shop Ledger'}</span>
            <span className="sm:hidden">{language === 'bn' ? 'খাতা' : 'Ledger'}</span>
          </button>

          {/* User Account / Staff / Admin buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  id="header-admin-cms-shortcut"
                  onClick={() => handleNavClick('admin')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white shadow-md shadow-emerald-950 hover:brightness-110 active:scale-95 transition-all border border-emerald-400/40"
                  title="Open Admin CMS Control Panel"
                >
                  <Shield className="w-3.5 h-3.5 text-white" />
                  <span>{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin CMS'}</span>
                </button>
              )}

              {isStaff && !isAdmin && (
                <button
                  id="header-staff-pos-shortcut"
                  onClick={() => handleNavClick('pos')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900/60 transition-all"
                  title="Open POS Cashier Counter"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>POS Counter</span>
                </button>
              )}

              <div className="relative">
                <button
                  id="user-menu-trigger"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs sm:text-sm text-neutral-200 hover:border-emerald-500 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline font-medium max-w-[110px] truncate">
                    {currentUser?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-neutral-800 bg-neutral-950/60">
                      <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                      <p className="text-[11px] text-neutral-400 truncate">{currentUser?.email || currentUser?.phone}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 capitalize font-medium">
                        {currentUser?.role === 'customer' ? (language === 'bn' ? 'সম্মানিত গ্রাহক' : 'Customer Account') : currentUser?.role.replace('_', ' ')}
                      </span>
                    </div>

                    <button
                      id="dropdown-profile-orders-link"
                      onClick={() => handleNavClick('profile')}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-emerald-400 font-semibold hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'bn' ? 'আমার প্রোফাইল ও অর্ডার হিস্টোরি' : 'My Profile & Order History'}</span>
                    </button>

                    <button
                      id="dropdown-applications-link"
                      onClick={() => handleNavClick('tracker')}
                      className="w-full text-left px-4 py-2 text-xs sm:text-sm text-neutral-300 hover:bg-neutral-800 hover:text-emerald-400 flex items-center gap-2"
                    >
                      <FileCheck className="w-4 h-4 text-neutral-400" />
                      <span>{language === 'bn' ? 'আমার আবেদন ট্র্যাকিং' : 'My Applications Tracker'}</span>
                    </button>

                    <button
                      id="dropdown-cart-link"
                      onClick={openCart}
                      className="w-full text-left px-4 py-2 text-xs sm:text-sm text-neutral-300 hover:bg-neutral-800 hover:text-emerald-400 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-neutral-400" />
                      <span>{language === 'bn' ? 'শপিং কার্ট ও অর্ডার' : 'My Cart & Orders'}</span>
                    </button>

                    {/* Special Ledger Link */}
                    <button
                      id="dropdown-daily-ledger-link"
                      onClick={() => handleNavClick('ledger')}
                      className="w-full text-left px-4 py-2 text-xs sm:text-sm text-amber-300 hover:bg-amber-950/30 flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>{language === 'bn' ? 'দৈনিক দোকানের হিসাব খাতা' : 'Daily Shop Ledger'}</span>
                    </button>

                    {isAdmin && (
                      <button
                        id="dropdown-admin-link"
                        onClick={() => handleNavClick('admin')}
                        className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-emerald-400 font-semibold hover:bg-emerald-950/40 flex items-center gap-2 border-t border-neutral-800/80 mt-1 pt-2"
                      >
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span>অ্যাডমিন ফুল প্যানেল (CMS)</span>
                      </button>
                    )}

                    {isStaff && (
                      <button
                        id="dropdown-staff-link"
                        onClick={() => handleNavClick('pos')}
                        className="w-full text-left px-4 py-2 text-xs sm:text-sm text-teal-400 hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <FileCheck className="w-4 h-4 text-teal-400" />
                        <span>স্টাফ পিওএস (POS Counter)</span>
                      </button>
                    )}

                    <div className="border-t border-neutral-800 my-1"></div>

                    <button
                      id="dropdown-logout-btn"
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-xs sm:text-sm text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{language === 'bn' ? 'লগ আউট (Log Out)' : 'Log Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {/* Unified Customer / Buyer Account Button (Amazon / Daraz BD style) */}
              <button
                id="customer-account-btn"
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-xs font-bold text-white shadow-md shadow-emerald-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                title="Customer Login / Sign Up"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'bn' ? 'লগইন / সাইন-আপ' : 'Login / Sign Up'}</span>
                <span className="sm:hidden">{language === 'bn' ? 'লগইন' : 'Login'}</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-neutral-800">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === link.id
                    ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                    : 'bg-neutral-900 text-neutral-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {/* Special Button in Mobile: Daily Shop Ledger */}
            <button
              onClick={() => { setMobileMenuOpen(false); handleNavClick('ledger'); }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/30 via-emerald-500/20 to-teal-500/20 border border-amber-500/40 text-amber-300 text-sm font-bold flex items-center justify-between shadow-md"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>{language === 'bn' ? 'দৈনিক দোকানের হিসাব খাতা' : 'Daily Shop Ledger & Tally'}</span>
              </span>
              <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold">Special</span>
            </button>

            {!isAuthenticated ? (
              <button
                onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold flex items-center justify-between shadow-md shadow-emerald-950"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {language === 'bn' ? 'গ্রাহক অ্যাকাউন্ট (লগইন / সাইন-আপ)' : 'Customer Login / Sign Up'}
                </span>
                <span className="text-xs bg-black/30 px-2 py-0.5 rounded text-emerald-200">OTP / Google</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                <div
                  onClick={() => { setMobileMenuOpen(false); handleNavClick('profile'); }}
                  className="flex items-center justify-between text-xs cursor-pointer hover:opacity-80"
                >
                  <div>
                    <strong className="text-white block flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{currentUser?.name}</span>
                    </strong>
                    <span className="text-neutral-400">{currentUser?.email || currentUser?.phone}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                    {language === 'bn' ? 'প্রোফাইল' : 'Profile'}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-neutral-800">
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleNavClick('profile'); }}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold text-center"
                  >
                    {language === 'bn' ? 'অর্ডার হিস্টোরি' : 'Order History'}
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 text-[11px]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Subtle Staff / Admin Portal Access */}
            <button
              onClick={() => { setMobileMenuOpen(false); openAuthModal('admin'); }}
              className="w-full text-left px-3 py-2 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-neutral-500" />
                <span>{language === 'bn' ? 'স্টাফ ও অ্যাডমিন পোর্টাল' : 'Staff & Admin Management Portal'}</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">CMS Access</span>
            </button>
          </div>

          <div className="pt-2 text-xs text-neutral-400 flex items-center justify-between">
            <span>📞 {settings.phonePrimary}</span>
            <span>📍 তেজগাঁও কলেজের পাশে</span>
          </div>
        </div>
      )}
    </header>
  );
};
