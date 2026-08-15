import React from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { Megaphone, X } from 'lucide-react';

export const NoticeBar: React.FC = () => {
  const { settings, updateSettings } = useData();
  const { language } = useLanguage();
  const [dismissed, setDismissed] = React.useState(false);

  if (!settings.showNoticeBanner || dismissed) return null;

  return (
    <div id="notice-banner" className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-amber-950/80 border-b border-emerald-500/20 text-xs py-2 px-4 text-emerald-300 flex items-center justify-between transition-all">
      <div className="container mx-auto flex items-center justify-center gap-2 text-center font-medium overflow-hidden">
        <Megaphone className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
        <span className="truncate">
          {language === 'bn' ? settings.noticeBannerBn : settings.noticeBanner}
        </span>
      </div>
      <button
        id="dismiss-notice-btn"
        onClick={() => setDismissed(true)}
        className="text-neutral-400 hover:text-white p-1 rounded transition-colors shrink-0"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
