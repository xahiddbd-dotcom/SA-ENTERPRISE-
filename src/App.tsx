import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NoticeBar } from './components/common/NoticeBar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Hero } from './components/public/Hero';
import { TejgaonSpecial } from './components/public/TejgaonSpecial';
import { ServicesSection } from './components/public/ServicesSection';
import { ShopSection } from './components/public/ShopSection';
import { ProductSlider } from './components/public/ProductSlider';
import { TeamSection } from './components/public/TeamSection';
import { ApplicationTracker } from './components/public/ApplicationTracker';
import { UserProfile } from './components/public/UserProfile';
import { TrustSection } from './components/public/TrustSection';
import { ContactSection } from './components/public/ContactSection';
import { CartModal } from './components/public/CartModal';
import { AuthModal } from './components/public/AuthModal';
import { GlobalSearchModal } from './components/public/GlobalSearchModal';
import { StaffPortal } from './components/staff/StaffPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminDirectLogin } from './components/admin/AdminDirectLogin';
import { DailyShopLedger } from './components/admin/DailyShopLedger';
import { POSCounter } from './components/pos/POSCounter';
import { DynamicSEO } from './components/common/DynamicSEO';
import { PWAInstallPrompt } from './components/common/PWAInstallPrompt';
import { BackgroundLayer } from './components/common/BackgroundLayer';
import { Shield, Lock } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, isAuthenticated, isAdmin, isSuperAdmin, isStaffOrAdmin, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'staff' | 'admin'>('login');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [trackerInitialId, setTrackerInitialId] = useState<string>('');

  const handleOpenAuth = (mode: 'login' | 'register' | 'staff' | 'admin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenTrackerWithId = (id: string) => {
    setTrackerInitialId(id);
    setActiveTab('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Admin CMS is active and authenticated as Admin, render the dedicated standalone Full CMS workspace
  if (activeTab === 'admin' && isAuthenticated && (isSuperAdmin || isAdmin)) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
        <AdminDashboard onExitToStore={() => setActiveTab('home')} />
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={targetView => {
            if (targetView) setActiveTab(targetView);
          }}
        />
        <GlobalSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onSelectService={() => setActiveTab('services')}
          onSelectApplication={appId => handleOpenTrackerWithId(appId)}
          onSelectProduct={() => setActiveTab('shop')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-neutral-950 relative">
      {/* Dynamic Background Pattern & Wallpaper System */}
      <BackgroundLayer />

      {/* Dynamic SEO Meta Tag Manager */}
      <DynamicSEO currentTab={activeTab} />

      {/* PWA Install Prompt and Offline Banner */}
      <PWAInstallPrompt />

      {/* Top Notice */}
      <NoticeBar />

      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCart={() => setIsCartOpen(true)}
        openAuthModal={handleOpenAuth}
        openSearchModal={() => setIsSearchModalOpen(true)}
      />

      {/* Dynamic Main Body */}
      <main className="flex-1">
        {/* PUBLIC HOME */}
        {activeTab === 'home' && (
          <>
            <Hero setActiveTab={setActiveTab} />
            {/* 30-35s Auto Product Slider */}
            <ProductSlider openCart={() => setIsCartOpen(true)} />
            <TejgaonSpecial onSelectService={() => setActiveTab('services')} />
            <ServicesSection onOpenTrackerWithId={handleOpenTrackerWithId} />
            <ShopSection openCart={() => setIsCartOpen(true)} />
            {/* Staff & Founder Profiles Section */}
            <TeamSection />
            <TrustSection />
            <ContactSection />
          </>
        )}

        {/* ABOUT & TEAM */}
        {activeTab === 'about' && (
          <div className="space-y-8 pt-4">
            <TeamSection />
            <TrustSection />
          </div>
        )}

        {/* SERVICES CATALOG */}
        {activeTab === 'services' && (
          <div className="space-y-6 pt-4">
            <TejgaonSpecial onSelectService={() => setActiveTab('services')} />
            <ServicesSection onOpenTrackerWithId={handleOpenTrackerWithId} />
          </div>
        )}

        {/* E-COMMERCE SHOP */}
        {activeTab === 'shop' && (
          <div className="pt-4">
            <ShopSection openCart={() => setIsCartOpen(true)} />
          </div>
        )}

        {/* APPLICATION TRACKER */}
        {activeTab === 'tracker' && (
          <div className="pt-6">
            <ApplicationTracker initialSearchId={trackerInitialId} />
          </div>
        )}

        {/* CUSTOMER PROFILE & ORDER HISTORY (SECURE & PAGINATED) */}
        {activeTab === 'profile' && (
          <div className="pt-4">
            <UserProfile
              onNavigate={setActiveTab}
              onOpenTrackerWithId={handleOpenTrackerWithId}
              onOpenAuthModal={handleOpenAuth}
              onOpenCart={() => setIsCartOpen(true)}
            />
          </div>
        )}

        {/* CONTACT & LOCATION */}
        {activeTab === 'contact' && (
          <div className="pt-6">
            <ContactSection />
          </div>
        )}

        {/* DAILY SHOP LEDGER (দৈনিক দোকানের হিসাব খাতা - Authorized Staff & Admin only) */}
        {activeTab === 'ledger' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            {isAuthenticated && isStaffOrAdmin ? (
              <DailyShopLedger onNavigate={setActiveTab} />
            ) : (
              <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md mx-auto p-8 space-y-4 shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">দৈনিক হিসাব খাতা প্রবেশাধিকার সংরক্ষিত</h2>
                <p className="text-xs text-neutral-400">
                  দোকানের আর্থিক হিসাব খাতা দেখতে স্টাফ অথবা অ্যাডমিন হিসেবে অনুমোদিত লগইন থাকতে হবে।
                </p>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
                  >
                    হোমপেজে ফিরুন
                  </button>
                  <button
                    onClick={() => handleOpenAuth('admin')}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all"
                  >
                    লগইন করুন
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* POS COUNTER (Accessible directly or via portal) */}
        {activeTab === 'pos' && (
          <div className="max-w-7xl mx-auto py-6">
            <POSCounter />
          </div>
        )}

        {/* STAFF & OPERATOR PORTAL */}
        {activeTab === 'staff' && (
          <div className="max-w-7xl mx-auto py-6">
            {isAuthenticated && isStaffOrAdmin ? (
              <StaffPortal onOpenPOS={() => setActiveTab('pos')} />
            ) : (
              <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md mx-auto p-8 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Staff & Operator Authentication</h2>
                <p className="text-xs text-neutral-400">
                  Please log in with your authorized Employee credentials to access customer service queues and the POS cashier counter.
                </p>
                <button
                  onClick={() => handleOpenAuth('staff')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Log In as Staff Member
                </button>
              </div>
            )}
          </div>
        )}

        {/* ADMIN LOGIN GATEWAY */}
        {activeTab === 'admin' && (
          <AdminDirectLogin
            onSuccess={() => setActiveTab('admin')}
            onExitToHome={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} openAuthModal={handleOpenAuth} />

      {/* Global Modals */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenAuthModal={handleOpenAuth}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={targetView => {
          if (targetView) setActiveTab(targetView);
        }}
      />

      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectService={() => setActiveTab('services')}
        onSelectApplication={appId => handleOpenTrackerWithId(appId)}
        onSelectProduct={() => setActiveTab('shop')}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <AuthProvider>
          <MainLayout />
        </AuthProvider>
      </DataProvider>
    </LanguageProvider>
  );
}
