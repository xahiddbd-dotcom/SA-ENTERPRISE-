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
import { ApplicationTracker } from './components/public/ApplicationTracker';
import { TrustSection } from './components/public/TrustSection';
import { ContactSection } from './components/public/ContactSection';
import { CartModal } from './components/public/CartModal';
import { AuthModal } from './components/public/AuthModal';
import { GlobalSearchModal } from './components/public/GlobalSearchModal';
import { StaffPortal } from './components/staff/StaffPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { POSCounter } from './components/pos/POSCounter';
import { Shield, Lock } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, isAuthenticated, isSuperAdmin, isStaffOrAdmin } = useAuth();

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

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-neutral-950">
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
            <TejgaonSpecial onSelectService={() => setActiveTab('services')} />
            <ServicesSection onOpenTrackerWithId={handleOpenTrackerWithId} />
            <ShopSection openCart={() => setIsCartOpen(true)} />
            <TrustSection />
            <ContactSection />
          </>
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

        {/* CONTACT & LOCATION */}
        {activeTab === 'contact' && (
          <div className="pt-6">
            <ContactSection />
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
                  Please log in with your Employee ID and password to access customer queues and POS counter.
                </p>
                <div className="p-3 bg-neutral-950 rounded-xl text-xs font-mono text-neutral-300 border border-neutral-800">
                  Staff ID: <strong>SE-EMP-001</strong> | Pass: <strong>staff123</strong>
                </div>
                <button
                  onClick={() => handleOpenAuth('staff')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950"
                >
                  Log In as Staff Member
                </button>
              </div>
            )}
          </div>
        )}

        {/* ADMIN DASHBOARD (WordPress-style CMS) */}
        {activeTab === 'admin' && (
          <div>
            {isAuthenticated && isSuperAdmin ? (
              <AdminDashboard />
            ) : (
              <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md mx-auto p-8 space-y-4 my-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white">Admin CMS Access</h2>
                <p className="text-xs text-neutral-400">
                  Restricted portal for Saiful Enterprise management, pricing configuration, stock control, and financial reporting.
                </p>
                <div className="p-3 bg-neutral-950 rounded-xl text-xs font-mono text-neutral-300 border border-neutral-800">
                  Admin User: <strong>admin</strong> | Pass: <strong>admin123</strong>
                </div>
                <button
                  onClick={() => handleOpenAuth('admin')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950"
                >
                  Log In to Admin Panel
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} openAuthModal={handleOpenAuth} />

      {/* Global Modals */}
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
