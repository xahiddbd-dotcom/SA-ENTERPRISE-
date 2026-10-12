import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
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
  BookOpen,
  Sun,
  Moon,
  Headphones,
  Home,
  Briefcase,
  Info,
  PhoneCall,
  MapPin
} from 'lucide-react';
import { StaffTTSControlWidget } from './StaffTTSControlWidget';
import { CustomerAssistanceModal } from '../public/CustomerAssistanceModal';

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
  const { themeMode, toggleTheme, isDark } = useTheme();
  const { currentUser, isAuthenticated, isAdmin, isStaff, logout } = useAuth();
  const { settings, cartItemCount } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [assistanceModalOpen, setAssistanceModalOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'services', label: t('services'), icon: Briefcase },
    { id: 'shop', label: t('shop'), icon: ShoppingBag },
    { id: 'tracker', label: language === 'bn' ? 'আবেদন ট্র্যাকিং' : 'Tracker', icon: FileCheck },
    { id: 'about', label: t('about'), icon: Info },
    { id: 'contact', label: t('contact'), icon: PhoneCall }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 backdrop-blur-2xl backdrop-saturate-180 border-b transition-all duration-300 ${
        isDark
          ? 'bg-neutral-950/85 border-white/15 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_2px_0_rgba(255,255,255,0.15)]'
          : 'bg-white/95 border-slate-200 text-black shadow-[0_8px_32px_0_rgba(15,23,42,0.08),inset_0_1px_2px_0_rgba(255,255,255,0.9)]'
      }`}
    >
      {/* Top micro bar for direct contact & fast access */}
      <div
        className={`border-b text-[11px] h-[35px] max-h-[35px] px-4 hidden md:flex items-center transition-colors overflow-hidden select-none ${
          isDark
            ? 'bg-white/5 border-white/10 text-white'
            : 'bg-slate-100/90 border-slate-200 text-black font-semibold'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between h-full">
          <div className="flex items-center gap-2.5">
            {/* Live Open/Closed Pulse Beacon (clean text, no shape enclosure) */}
            <div className={`inline-flex items-center gap-1.5 text-[11px] leading-tight transition-colors ${
              settings.isShopOpen !== false
                ? (isDark ? 'text-emerald-400' : 'text-emerald-700 font-bold')
                : (isDark ? 'text-rose-400' : 'text-rose-700 font-bold')
            }`}>
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                {settings.isShopOpen !== false && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    isDark ? 'bg-emerald-400 opacity-75' : 'bg-emerald-600 opacity-75'
                  }`} />
                )}
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  settings.isShopOpen !== false
                    ? (isDark ? 'bg-emerald-400' : 'bg-emerald-600')
                    : (isDark ? 'bg-rose-400' : 'bg-rose-600')
                }`} />
              </span>
              <span className={`tracking-tight font-bold ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                {settings.isShopOpen !== false
                  ? (language === 'bn' ? 'খোলা আছে' : 'Shop Open')
                  : (language === 'bn' ? 'বন্ধ' : 'Closed')}
              </span>
              <span className={isDark ? 'opacity-40 text-white' : 'opacity-40 text-black'}>•</span>
              <span className={`text-[10.5px] font-mono font-bold ${
                isDark ? 'text-white' : 'text-black'
              }`}>
                {language === 'bn' ? settings.openingHoursBn : settings.openingHours}
              </span>
            </div>

            <span className={isDark ? 'text-white/30' : 'text-slate-400'}>|</span>

            {/* Interactive Location Badge with Pin Icon (clean text link, no shape enclosure) */}
            <a
              href={settings.googleMapUrl || 'https://maps.google.com/?q=Tejgaon+College+Indira+Road+Dhaka'}
              target="_blank"
              rel="noreferrer"
              title={language === 'bn' ? 'গুগল ম্যাপে আমাদের লোকেশন দেখুন' : 'View our location on Google Maps'}
              className={`group flex items-center gap-1 text-[11px] leading-tight truncate max-w-sm transition-colors ${
                isDark ? 'text-white/80 hover:text-white' : 'text-black hover:text-slate-800 font-semibold'
              }`}
            >
              <MapPin className="w-3 h-3 text-sky-500 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="truncate">
                {language === 'bn' ? settings.addressBn : settings.address}
              </span>
            </a>
          </div>

          <div className={`flex items-center gap-3 font-semibold text-[11px] ${
            isDark ? 'text-white' : 'text-black'
          }`}>
            <a
              id="header-call-link"
              href={`tel:${settings.phonePrimary}`}
              className={`flex items-center gap-1 transition-colors ${
                isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'
              }`}
            >
              <Phone className={`w-3 h-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span>{settings.phonePrimary}</span>
            </a>
            <a
              id="header-whatsapp-link"
              href={`https://wa.me/88${settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-1 transition-colors ${
                isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'
              }`}
            >
              <MessageSquare className={`w-3 h-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span>{settings.whatsappNumber}</span>
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform shrink-0">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className={`font-bold text-lg leading-tight tracking-tight flex items-center gap-1.5 ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              <span className="font-black tracking-tight">{language === 'bn' ? settings.businessNameBn : settings.businessName}</span>
            </div>
            <div className={`text-[11px] truncate max-w-[200px] sm:max-w-xs ${
              isDark ? 'text-white/70' : 'text-slate-700 font-semibold'
            }`}>
              {language === 'bn' ? 'কম্পিউটার • প্রিন্ট • অনলাইন আবেদন' : 'Digital Services & Online Applications'}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links (iOS Glass Capsule) */}
        <nav
          className={`hidden lg:flex items-center gap-1 p-1 rounded-full border transition-all ${
            isDark
              ? 'bg-white/10 border-white/15 backdrop-blur-md shadow-inner'
              : 'bg-slate-100/90 border-slate-300 backdrop-blur-md shadow-inner'
          }`}
        >
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <a
                key={link.id}
                id={`nav-${link.id}`}
                href={link.id === 'home' ? '/' : `/${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id);
                }}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md font-bold'
                    : isDark
                    ? 'text-white/80 hover:text-white hover:bg-white/15'
                    : 'text-black hover:text-slate-900 hover:bg-slate-200/90 font-semibold'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-white'
                      : isDark
                      ? 'text-white/70 group-hover:text-white'
                      : 'text-slate-700 group-hover:text-black'
                  }`}
                />
                <span className="whitespace-nowrap">{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search button (iOS Water Droplet Style) */}
          <button
            id="global-search-trigger"
            onClick={openSearchModal}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shadow-md ${
              isDark
                ? 'bg-white/10 text-white border border-white/20 shadow-[0_4px_14px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:bg-white/20 hover:scale-105'
                : 'bg-slate-100 text-black border border-slate-300 shadow-[0_4px_14px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] hover:bg-slate-200 hover:scale-105'
            }`}
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Bilingual Language Switcher (iOS Water Droplet Style) - Automatically tucked into Menu on phone/small screen */}
          <button
            id="lang-toggle-btn"
            onClick={toggleLanguage}
            className={`hidden md:flex h-9 px-3.5 rounded-full items-center gap-1.5 text-xs font-semibold transition-all duration-300 active:scale-95 shadow-md ${
              isDark
                ? 'bg-white/10 text-white border border-white/20 shadow-[0_4px_14px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:bg-white/20 hover:scale-105'
                : 'bg-slate-100 text-black border border-slate-300 shadow-[0_4px_14px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] hover:bg-slate-200 hover:scale-105'
            }`}
            title="Switch Language / ভাষা পরিবর্তন করুন"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-bold">{language === 'bn' ? 'বাংলা' : 'EN'}</span>
            <span className="opacity-40 text-[10px]">|</span>
            <span className="opacity-70 text-[11px] font-mono">
              {language === 'bn' ? 'EN' : 'বাং'}
            </span>
          </button>

          {/* Dark / Light Mode Toggle Button (iOS Water Droplet Style) - Automatically tucked into Menu on phone/small screen */}
          <button
            id="theme-mode-toggle-btn"
            onClick={toggleTheme}
            className={`hidden md:flex h-9 px-3.5 rounded-full items-center gap-1.5 text-xs font-bold transition-all duration-300 active:scale-95 shadow-md ${
              isDark
                ? 'bg-white/10 text-amber-300 border border-white/20 shadow-[0_4px_14px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:bg-white/20 hover:scale-105'
                : 'bg-slate-100 text-black border border-slate-300 shadow-[0_4px_14px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] hover:bg-slate-200 hover:scale-105'
            }`}
            title={
              themeMode === 'dark'
                ? (language === 'bn' ? 'লাইট মোড চালু করুন (Switch to Light Mode)' : 'Switch to Light Mode')
                : (language === 'bn' ? 'ডার্ক মোড চালু করুন (Switch to Dark Mode)' : 'Switch to Dark Mode')
            }
          >
            {themeMode === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="hidden sm:inline font-bold">{language === 'bn' ? 'লাইট' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
                <span className="hidden sm:inline font-bold text-black">{language === 'bn' ? 'ডার্ক' : 'Dark'}</span>
              </>
            )}
          </button>

          {/* Shopping Cart button (iOS Water Droplet Style) */}
          <button
            id="header-cart-btn"
            onClick={openCart}
            className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shadow-md ${
              isDark
                ? 'bg-white/10 text-white border border-white/20 shadow-[0_4px_14px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:bg-white/20 hover:scale-105'
                : 'bg-slate-100 text-black border border-slate-300 shadow-[0_4px_14px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] hover:bg-slate-200 hover:scale-105'
            }`}
            title="Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md border border-white">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* User Account / Staff / Admin buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {(isAdmin || isStaff) && (
                <div className="hidden lg:block">
                  <StaffTTSControlWidget variant="compact" />
                </div>
              )}
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

              <div className="relative hidden md:block">
                <button
                  id="user-menu-trigger"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`h-9 px-3.5 rounded-full flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all duration-300 active:scale-95 shadow-md ${
                    isDark
                      ? 'bg-white/10 text-white border border-white/20 shadow-[0_4px_14px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:bg-white/20 hover:scale-105'
                      : 'bg-slate-100 text-black border border-slate-300 shadow-[0_4px_14px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] hover:bg-slate-200 hover:scale-105'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline font-medium max-w-[110px] truncate">
                    {currentUser?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
                {userDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-60 border rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 backdrop-blur-xl ${
                      isDark ? 'bg-neutral-900/95 border-white/20 text-white shadow-2xl' : 'bg-white/95 border-slate-200 text-black shadow-2xl'
                    }`}
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className={`px-4 py-2.5 border-b ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
                      <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-black'}`}>{currentUser?.name}</p>
                      <p className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{currentUser?.email || currentUser?.phone}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 capitalize font-medium">
                        {currentUser?.role === 'customer' ? (language === 'bn' ? 'সম্মানিত গ্রাহক' : 'Customer Account') : currentUser?.role.replace('_', ' ')}
                      </span>
                    </div>

                    <button
                      id="dropdown-profile-orders-link"
                      onClick={() => handleNavClick('profile')}
                      className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                        isDark ? 'text-emerald-400 hover:bg-white/10' : 'text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      <User className="w-4 h-4 text-emerald-500" />
                      <span>{language === 'bn' ? 'আমার প্রোফাইল ও অর্ডার হিস্টোরি' : 'My Profile & Order History'}</span>
                    </button>

                    <button
                      id="dropdown-applications-link"
                      onClick={() => handleNavClick('tracker')}
                      className={`w-full text-left px-4 py-2 text-xs sm:text-sm flex items-center gap-2 ${
                        isDark ? 'text-slate-300 hover:bg-white/10 hover:text-emerald-400' : 'text-slate-800 hover:bg-slate-50 hover:text-emerald-700 font-medium'
                      }`}
                    >
                      <FileCheck className="w-4 h-4 text-emerald-500" />
                      <span>{language === 'bn' ? 'আমার আবেদন ট্র্যাকিং' : 'My Applications Tracker'}</span>
                    </button>

                    <button
                      id="dropdown-cart-link"
                      onClick={openCart}
                      className={`w-full text-left px-4 py-2 text-xs sm:text-sm flex items-center gap-2 ${
                        isDark ? 'text-slate-300 hover:bg-white/10 hover:text-emerald-400' : 'text-slate-800 hover:bg-slate-50 hover:text-emerald-700 font-medium'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-500" />
                      <span>{language === 'bn' ? 'শপিং কার্ট ও অর্ডার' : 'My Cart & Orders'}</span>
                    </button>

                    {isAdmin && (
                      <button
                        id="dropdown-admin-link"
                        onClick={() => handleNavClick('admin')}
                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-t mt-1 pt-2 ${
                          isDark ? 'text-emerald-400 border-white/10 hover:bg-white/10' : 'text-emerald-700 border-slate-100 hover:bg-emerald-50'
                        }`}
                      >
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span>অ্যাডমিন ফুল প্যানেল (CMS)</span>
                      </button>
                    )}

                    {isStaff && (
                      <button
                        id="dropdown-staff-link"
                        onClick={() => handleNavClick('pos')}
                        className={`w-full text-left px-4 py-2 text-xs sm:text-sm flex items-center gap-2 ${
                          isDark ? 'text-teal-400 hover:bg-white/10' : 'text-teal-700 hover:bg-teal-50'
                        }`}
                      >
                        <FileCheck className="w-4 h-4 text-teal-500" />
                        <span>স্টাফ পিওএস (POS Counter)</span>
                      </button>
                    )}

                    <div className={`border-t my-1 ${isDark ? 'border-white/10' : 'border-slate-100'}`}></div>

                    <button
                      id="dropdown-logout-btn"
                      onClick={logout}
                      className={`w-full text-left px-4 py-2 text-xs sm:text-sm flex items-center gap-2 ${
                        isDark ? 'text-rose-400 hover:bg-rose-950/30' : 'text-rose-600 hover:bg-rose-50'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{language === 'bn' ? 'লগ আউট (Log Out)' : 'Log Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1.5">
              {/* Unified Customer / Buyer Account Button (iOS Water Capsule Style) - Automatically tucked into Menu on phone/small screen */}
              <button
                id="customer-account-btn"
                onClick={() => openAuthModal('login')}
                className={`h-9 px-4 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all duration-300 active:scale-95 shadow-md ${
                  isDark
                    ? 'bg-white/10 text-white border border-white/20 shadow-[0_4px_14px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:bg-white/20 hover:scale-105'
                    : 'bg-slate-100 text-black border border-slate-300 shadow-[0_4px_14px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] hover:bg-slate-200 hover:scale-105'
                }`}
                title="Customer Login / Sign Up"
              >
                <User className="w-3.5 h-3.5 text-sky-500" />
                <span className="hidden sm:inline">{language === 'bn' ? 'লগইন / সাইন-আপ' : 'Login / Sign Up'}</span>
                <span className="sm:hidden">{language === 'bn' ? 'লগইন' : 'Login'}</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle (iOS Water Capsule Style) */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shadow-md ${
              isDark
                ? 'bg-white/10 text-white border border-white/20 shadow-[0_4px_14px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:bg-white/20 hover:scale-105'
                : 'bg-slate-100 text-black border border-slate-300 shadow-[0_4px_14px_rgba(15,23,42,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] hover:bg-slate-200 hover:scale-105'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 py-4 space-y-3.5 animate-in slide-in-from-top duration-200 ${
          isDark ? 'bg-neutral-950/95 border-neutral-800 backdrop-blur-xl' : 'bg-white/95 border-slate-200 shadow-xl backdrop-blur-xl'
        }`}>
          {/* Quick Header Controls & Account (Automatically tucked into Menu on Mobile / Small Screen) */}
          <div className="space-y-2 pb-3 border-b border-neutral-800/80 dark:border-neutral-800 light:border-slate-200">
            {/* 1. Customer Account / Login Capsule */}
            {!isAuthenticated ? (
              <button
                id="mobile-customer-account-btn"
                onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                className={`w-full p-2.5 rounded-2xl flex items-center justify-between transition-all duration-200 active:scale-98 shadow-sm ${
                  isDark
                    ? 'bg-neutral-900/90 hover:bg-neutral-800 border border-white/10 text-white'
                    : 'bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block leading-tight">
                      {language === 'bn' ? 'গ্রাহক অ্যাকাউন্ট' : 'Customer Account'}
                    </span>
                    <span className="text-[10px] text-sky-500 font-semibold block">
                      {language === 'bn' ? 'লগইন / সাইন-আপ করুন' : 'Login / Sign Up'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-400/30">
                  OTP / Google
                </span>
              </button>
            ) : (
              <div className={`p-2.5 rounded-2xl border space-y-2 ${
                isDark ? 'bg-neutral-900/90 border-white/10' : 'bg-slate-100 border-slate-200'
              }`}>
                <div
                  onClick={() => { setMobileMenuOpen(false); handleNavClick('profile'); }}
                  className="flex items-center justify-between text-xs cursor-pointer hover:opacity-85"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <strong className={`block text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {currentUser?.name}
                      </strong>
                      <span className={`text-[10px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                        {currentUser?.email || currentUser?.phone}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-bold border border-emerald-500/30">
                    {language === 'bn' ? 'প্রোফাইল' : 'Profile'}
                  </span>
                </div>

                <div className={`flex items-center gap-2 pt-1.5 border-t ${isDark ? 'border-neutral-800' : 'border-slate-200'}`}>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleNavClick('profile'); }}
                    className="flex-1 py-1 rounded-xl bg-emerald-600 text-white text-[11px] font-bold text-center shadow-xs"
                  >
                    {language === 'bn' ? 'অর্ডার হিস্টোরি' : 'Order History'}
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); logout(); }}
                    className={`px-3 py-1 rounded-xl text-[11px] font-medium border ${
                      isDark ? 'bg-rose-950/60 text-rose-300 border-rose-800' : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* 2. Language Switcher & Day/Night Mood Toggle (iPhone Water Droplet Style) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="mobile-lang-toggle-btn"
                onClick={toggleLanguage}
                className={`py-2 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-sm ${
                  isDark
                    ? 'bg-neutral-900/90 text-white border-white/10 hover:border-sky-400/40'
                    : 'bg-slate-100 text-slate-800 border-slate-200 hover:border-sky-400/40'
                }`}
                title="Switch Language / ভাষা পরিবর্তন করুন"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>{language === 'bn' ? 'English (EN)' : 'বাংলা (বাং)'}</span>
              </button>

              <button
                type="button"
                id="mobile-theme-mode-toggle-btn"
                onClick={toggleTheme}
                className={`py-2 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-sm ${
                  isDark
                    ? 'bg-neutral-900/90 text-amber-300 border-white/10 hover:border-amber-400/40'
                    : 'bg-slate-100 text-slate-900 border-slate-200 hover:border-amber-400/40'
                }`}
                title="Toggle Day / Night Mode"
              >
                {themeMode === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{language === 'bn' ? 'লাইট মোড (Day)' : 'Day Mode'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                    <span>{language === 'bn' ? 'ডার্ক মোড (Night)' : 'Night Mode'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className={`grid grid-cols-2 gap-2 pb-2 border-b ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}>
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <a
                  key={link.id}
                  href={link.id === 'home' ? '/' : `/${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.id);
                  }}
                  className={`text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : isDark
                      ? 'bg-neutral-900 text-neutral-300 hover:text-white'
                      : 'bg-white border border-slate-300 text-slate-900 font-bold hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                  <span className="truncate">{link.label}</span>
                </a>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {/* Subtle Staff / Admin Portal Access */}
            <button
              onClick={() => { setMobileMenuOpen(false); openAuthModal('admin'); }}
              className={`w-full text-left px-3 py-2 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                isDark
                  ? 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  : 'bg-white border border-slate-300 text-slate-900 font-bold hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>{language === 'bn' ? 'স্টাফ ও অ্যাডমিন পোর্টাল' : 'Staff & Admin Management Portal'}</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">CMS Access</span>
            </button>
          </div>

          <div className={`pt-2 text-xs flex items-center justify-between ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
            <span>📞 {settings.phonePrimary}</span>
            <span>📍 তেজগাঁও কলেজের পাশে</span>
          </div>
        </div>
      )}

      {/* Customer Assistance Modal */}
      <CustomerAssistanceModal
        isOpen={assistanceModalOpen}
        onClose={() => setAssistanceModalOpen(false)}
      />
    </header>
  );
};
