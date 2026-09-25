import React from 'react';
import { Home, ChevronRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface PageProofHeaderProps {
  tab: string;
  title: string;
  badge: string;
  description?: string;
  onNavigateHome?: () => void;
}

export const PageProofHeader: React.FC<PageProofHeaderProps> = ({
  tab,
  title,
  badge,
  description,
  onNavigateHome
}) => {
  const { language } = useLanguage();
  const { isDark } = useTheme();

  return (
    <div
      id={`page-header-${tab}`}
      className={`border-b transition-colors duration-200 -mt-2 mb-8 ${
        isDark
          ? 'bg-neutral-900/50 border-neutral-800/80 backdrop-blur-sm'
          : 'bg-white border-slate-200/90 shadow-2xs'
      }`}
    >
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Clean Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs mb-3">
          <button
            onClick={onNavigateHome}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              isDark ? 'text-neutral-400 hover:text-emerald-400' : 'text-slate-500 hover:text-emerald-600'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'হোমপেজ' : 'Home'}</span>
          </button>
          <ChevronRight className={`w-3 h-3 ${isDark ? 'text-neutral-600' : 'text-slate-300'}`} />
          <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
            {badge}
          </span>
        </div>

        {/* Title & Description with welcoming typography */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {title}
            </h1>
            {description && (
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isDark ? 'text-neutral-400' : 'text-slate-600 font-medium'
                }`}
              >
                {description}
              </p>
            )}
          </div>

          {/* Quick Back Action */}
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className={`self-start md:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 shrink-0 ${
                isDark
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
