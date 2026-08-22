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
  ChevronDown
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
    { id: 'applications', label: t('applications') },
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
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
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

          {/* User Account / Staff / Admin buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  id="header-admin-cms-shortcut"
                  onClick={() => handleNavClick('admin')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white shadow-md shadow-emerald-950 hover:brightness-110 transition-all border border-emerald-400/30 animate-pulse"
                  title="Open Admin CMS Control Panel"
                >
                  <Shield className="w-3.5 h-3.5 text-white" />
                  <span>Admin CMS</span>
                </button>
              )}

              {isStaff && !isAdmin && (
                <button
                  id="header-staff-pos-shortcut"
                  onClick={() => handleNavClick('pos')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900/60 transition-all"
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-sm text-neutral-200 hover:border-emerald-500 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                    {currentUser?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-neutral-800">
                      <p className="text-xs text-neutral-400">{currentUser?.email || currentUser?.phone}</p>
                      <p className="text-xs font-semibold text-emerald-400 capitalize">
                        {currentUser?.role.replace('_', ' ')}
                      </p>
                    </div>

                    {isAdmin && (
                      <button
                        id="dropdown-admin-link"
                        onClick={() => handleNavClick('admin')}
                        className="w-full text-left px-4 py-2.5 text-sm text-emerald-400 font-semibold hover:bg-emerald-950/40 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span>অ্যাডমিন ফুল প্যানেল (Full CMS)</span>
                      </button>
                    )}

                    {isStaff && (
                      <button
                        id="dropdown-staff-link"
                        onClick={() => handleNavClick('staff')}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-emerald-400 flex items-center gap-2"
                      >
                        <FileCheck className="w-4 h-4 text-teal-400" />
                        <span>{t('staff_login')} / POS</span>
                      </button>
                    )}

                    <button
                      id="dropdown-applications-link"
                      onClick={() => handleNavClick('applications')}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-emerald-400 flex items-center gap-2"
                    >
                      <FileCheck className="w-4 h-4 text-neutral-400" />
                      <span>{t('applications')}</span>
                    </button>

                    <div className="border-t border-neutral-800 my-1"></div>

                    <button
                      id="dropdown-logout-btn"
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                id="portal-login-btn"
                onClick={() => openAuthModal('staff')}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:border-emerald-500/40 transition-colors"
                title="Staff / Operator Login"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('staff_login')}</span>
              </button>

              <button
                id="header-login-btn"
                onClick={() => openAuthModal('admin')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white shadow-md shadow-emerald-950 hover:brightness-110 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('admin_login')}</span>
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
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-neutral-800">
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

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); handleNavClick('admin'); }}
              className="w-full text-left px-3 py-2.5 rounded-lg bg-emerald-950/40 border border-emerald-600/30 text-emerald-400 text-sm font-semibold flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {t('admin_login')}
              </span>
              <span className="text-xs bg-emerald-900 px-2 py-0.5 rounded text-white">Full CMS</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); handleNavClick('staff'); }}
              className="w-full text-left px-3 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-teal-400 text-sm font-semibold flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                {t('staff_login')} / POS Counter
              </span>
              <span className="text-xs bg-neutral-800 px-2 py-0.5 rounded text-neutral-300">Staff Portal</span>
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
