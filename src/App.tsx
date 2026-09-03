import React, { useState, useEffect, useMemo } from 'react';
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
import { PageProofHeader } from './components/common/PageProofHeader';
import { parseCurrentRoute, updateBrowserUrl } from './utils/navigation';
import { Shield, Lock } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, isAuthenticated, isAdmin, isSuperAdmin, isStaffOrAdmin, logout } = useAuth();

  // Read initial route from URL parameters, path, or hash on initial page load
  const [activeTab, setActiveTabState] = useState<string>(() => parseCurrentRoute().tab || 'home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(() => parseCurrentRoute().productId || null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(() => parseCurrentRoute().serviceId || null);
  const [trackerInitialId, setTrackerInitialId] = useState<string>(() => parseCurrentRoute().trackerId || '');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'staff' | 'admin'>('login');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Sync browser back/forward history buttons & hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const route = parseCurrentRoute();
      setActiveTabState(route.tab || 'home');
      setSelectedProductId(route.productId || null);
      setSelectedServiceId(route.serviceId || null);
      if (route.trackerId) {
        setTrackerInitialId(route.trackerId);
      }
    };

    // Run once on mount to handle any initial route parameters
    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (tab !== 'shop') setSelectedProductId(null);
    if (tab !== 'services') setSelectedServiceId(null);
    updateBrowserUrl({ tab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId: string | null) => {
    setSelectedProductId(productId);
    if (productId) {
      setActiveTabState('shop');
      updateBrowserUrl({
        tab: 'shop',
        productId: productId
      });
    } else {
      updateBrowserUrl({
        tab: activeTab
      });
    }
  };

  const handleSelectService = (serviceId: string | null) => {
    setSelectedServiceId(serviceId);
    if (serviceId) {
      setActiveTabState('services');
      updateBrowserUrl({
        tab: 'services',
        serviceId: serviceId
      });
    } else {
      updateBrowserUrl({
        tab: activeTab
      });
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register' | 'staff' | 'admin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenTrackerWithId = (id: string) => {
    setTrackerInitialId(id);
    setActiveTabState('tracker');
    updateBrowserUrl({ tab: 'tracker', trackerId: id });
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
          onSelectService={serviceId => {
            setActiveTab('services');
            if (serviceId) handleSelectService(serviceId);
          }}
          onSelectApplication={appId => handleOpenTrackerWithId(appId)}
          onSelectProduct={prodId => {
            setActiveTab('shop');
            if (prodId) handleSelectProduct(prodId);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-neutral-950 relative">
      {/* Dynamic Background Pattern & Wallpaper System */}
      <BackgroundLayer />

      {/* Dynamic SEO Meta Tag Manager */}
      <DynamicSEO
        currentTab={activeTab}
        activeProductId={selectedProductId}
        activeServiceId={selectedServiceId}
      />

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
            <TejgaonSpecial
              onSelectService={(serviceId) => {
                setActiveTab('services');
                if (serviceId) handleSelectService(serviceId);
              }}
            />
            <ServicesSection
              onOpenTrackerWithId={handleOpenTrackerWithId}
              initialServiceId={selectedServiceId}
              onServiceSelect={handleSelectService}
            />
            <ShopSection
              openCart={() => setIsCartOpen(true)}
              initialProductId={selectedProductId}
              onProductSelect={handleSelectProduct}
            />
            {/* Staff & Founder Profiles Section */}
            <TeamSection />
            <TrustSection />
            <ContactSection />
          </>
        )}

        {/* ABOUT & TEAM */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <PageProofHeader
              tab="about"
              title="আমাদের প্রতিষ্ঠান ও টিম পরিচিতি"
              badge="আমাদের সম্পর্কে"
              description="ফার্মগেট ও ইন্দিরা রোডে দীর্ঘ ১৫+ বছরের বিশ্বস্ত সেবা, অভিজ্ঞ কম্পিউটার টিম ও প্রতিষ্ঠাতা পরিচিতি"
              onNavigateHome={() => setActiveTab('home')}
            />
            <div className="space-y-8">
              <TeamSection />
              <TrustSection />
            </div>
          </div>
        )}

        {/* SERVICES CATALOG */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <PageProofHeader
              tab="services"
              title="সকল ডিজিটাল সেবা ও অনলাইন আবেদন ক্যাটালগ"
              badge="সেবাসমূহ"
              description="তেজগাঁও কলেজ ভর্তি ফরম, জাতীয় বিশ্ববিদ্যালয়, পুলিশ ক্লিয়ারেন্স, পাসপোর্ট ও সরকারি চাকরির আবেদন"
              onNavigateHome={() => setActiveTab('home')}
            />
            <TejgaonSpecial
              onSelectService={(serviceId) => {
                setActiveTab('services');
                if (serviceId) handleSelectService(serviceId);
              }}
            />
            <ServicesSection
              onOpenTrackerWithId={handleOpenTrackerWithId}
              initialServiceId={selectedServiceId}
              onServiceSelect={handleSelectService}
            />
          </div>
        )}

        {/* E-COMMERCE SHOP */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            <PageProofHeader
              tab="shop"
              title="পেপার, স্টেশনারি ও অফিস সাপ্লাই শপ"
              badge="শপ / প্রোডাক্ট"
              description="প্রিমিয়াম ডাবল এ ফটোকপি পেপার, পেপারওয়ান, এ৪ ৭০/৮০ জিএসএম, কার্টিজ পেপার ও অফিস স্টেশনারি"
              onNavigateHome={() => setActiveTab('home')}
            />
            <ShopSection
              openCart={() => setIsCartOpen(true)}
              initialProductId={selectedProductId}
              onProductSelect={handleSelectProduct}
            />
          </div>
        )}

        {/* APPLICATION TRACKER */}
        {activeTab === 'tracker' && (
          <div className="space-y-6">
            <PageProofHeader
              tab="tracker"
              title="আবেদন ট্র্যাকিং ও ডেলিভারি স্ট্যাটাস"
              badge="ট্র্যাকার"
              description="আপনার আবেদন নম্বর (যেমন: APP-2024-XXXX) দিয়ে সরাসরি ডেলিভারি অগ্রগতি ও রসিদ যাচাই করুন"
              onNavigateHome={() => setActiveTab('home')}
            />
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
          <div className="space-y-6">
            <PageProofHeader
              tab="contact"
              title="দোকানের সরাসরি লোকেশন ও যোগাযোগের তথ্য"
              badge="যোগাযোগ"
              description="ইন্দিরা রোড, ফার্মগেট, ঢাকা - সরাসরি কল, হোয়াটসঅ্যাপ সাপোর্ট ও গুগল ম্যাপ ডিরেকশন"
              onNavigateHome={() => setActiveTab('home')}
            />
            <ContactSection />
          </div>
        )}

        {/* DAILY SHOP LEDGER (দৈনিক দোকানের হিসাব খাতা - Authorized Staff & Admin only) */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            <PageProofHeader
              tab="ledger"
              title="দৈনিক দোকানের হিসাব খাতা ও জুডিশিয়াল স্ট্যাম্প রেজিস্টার"
              badge="হিসাব খাতা"
              description="জুডিশিয়াল স্ট্যাম্প, কার্টিজ পেপার বিক্রয় রেজিস্টার ও ক্যাশ রিকনসিলিয়েশন"
              onNavigateHome={() => setActiveTab('home')}
            />
            <div className="max-w-7xl mx-auto px-4 py-2">
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
