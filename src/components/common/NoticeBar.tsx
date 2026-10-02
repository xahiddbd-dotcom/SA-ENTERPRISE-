import React from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { Megaphone, X } from 'lucide-react';

export const NoticeBar: React.FC = () => {
  const { settings } = useData();
  const { language } = useLanguage();
  const [dismissed, setDismissed] = React.useState(false);

  if (!settings.showNoticeBanner || dismissed) return null;

  return (
    <div
      id="notice-banner"
      className="bg-emerald-50 dark:bg-neutral-900 border-b border-emerald-200 dark:border-neutral-800 text-xs py-2 px-4 text-emerald-950 dark:text-neutral-200 flex items-center justify-between transition-colors shadow-2xs"
    >
      <div className="container mx-auto flex items-center justify-center gap-2 text-center font-medium overflow-hidden">
        <Megaphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="truncate text-xs font-semibold text-emerald-900 dark:text-neutral-200">
          {language === 'bn' ? settings.noticeBannerBn : settings.noticeBanner}
        </span>
      </div>
      <button
        id="dismiss-notice-btn"
        onClick={() => setDismissed(true)}
        className="text-emerald-700 hover:text-emerald-950 dark:text-neutral-400 dark:hover:text-white p-1 rounded-lg transition-colors shrink-0"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
