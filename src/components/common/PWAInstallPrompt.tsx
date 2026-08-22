import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Download, WifiOff, X, Sparkles, CheckCircle2, Smartphone } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user dismissed recently
      const dismissed = localStorage.getItem('se_pwa_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    });

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback instruction for browsers like iOS Safari
      alert(
        language === 'bn'
          ? 'হোম স্ক্রিনে যুক্ত করতে ব্রাউজারের Share / Settings মেনু থেকে "Add to Home Screen" অপশনে চাপুন।'
          : 'To add to Home Screen, tap your browser Share/Menu icon and select "Add to Home Screen".'
      );
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('se_pwa_dismissed', 'true');
  };

  return (
    <>
      {/* Offline Alert Banner */}
      {isOffline && (
        <aside
          aria-label="Offline notification banner"
          className="fixed top-0 inset-x-0 z-50 bg-amber-600 text-white text-xs font-semibold py-2 px-4 shadow-xl flex items-center justify-center gap-2 animate-in slide-in-from-top"
        >
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>
            {language === 'bn'
              ? 'ইন্টারনেট সংযোগ নেই • অফলাইন ক্যাশে সংরক্ষিত সেবা ও তথ্যাদি প্রদর্শিত হচ্ছে।'
              : 'You are currently offline • Browsing cached services and contact details.'}
          </span>
        </aside>
      )}

      {/* PWA Add to Home Screen Prompt Modal / Bar */}
      {showInstallBanner && !installed && (
        <aside
          aria-label="Install mobile app prompt"
          className="fixed bottom-20 sm:bottom-6 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="p-4 rounded-3xl bg-neutral-900/95 border border-emerald-500/40 text-neutral-100 shadow-2xl backdrop-blur-xl flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {language === 'bn' ? 'মোবাইলে অ্যাপ ইনস্টল করুন' : 'Install Saiful Enterprise App'}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {language === 'bn'
                      ? 'অফলাইনে দ্রুত ব্রাউজ ও ১-ট্যাপে আবেদন ট্র্যাকিংয়ের জন্য হোমস্ক্রিনে যুক্ত করুন।'
                      : 'Add to home screen for 1-tap tracking & offline access.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
                aria-label="Dismiss install prompt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-neutral-800">
              <button
                type="button"
                onClick={handleDismiss}
                className="flex-1 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition-colors"
              >
                {language === 'bn' ? 'পরে করব' : 'Later'}
              </button>

              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-950 flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ইনস্টল করুন' : 'Install App'}</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};
