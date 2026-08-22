import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ADMIN_THEMES, AdminThemeKey } from './AdminTheme';
import { Palette, Check, Sparkles } from 'lucide-react';

interface AdminThemeSwitcherProps {
  currentTheme: AdminThemeKey;
  onSelectTheme: (themeKey: AdminThemeKey) => void;
  variant?: 'header-dropdown' | 'settings-grid';
}

export const AdminThemeSwitcher: React.FC<AdminThemeSwitcherProps> = ({
  currentTheme,
  onSelectTheme,
  variant = 'header-dropdown'
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const activeTheme = ADMIN_THEMES[currentTheme] || ADMIN_THEMES.emerald;

  if (variant === 'settings-grid') {
    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'এডমিন প্যানেল থিম নির্বাচন (Admin Panel Theme)' : 'Admin Panel Theme Palette'}</span>
          </h4>
          <p className="text-xs text-neutral-400 mt-1">
            {language === 'bn'
              ? 'শুধুমাত্র এডমিন প্যানেলের ইন্টারফেসের ব্যাকগ্রাউন্ড, সাইডবার ও কালার স্কিম পরিবর্তন করুন।'
              : 'Customize the admin workspace visual look, sidebar contrast, and brand accents.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {(Object.keys(ADMIN_THEMES) as AdminThemeKey[]).map((key) => {
            const theme = ADMIN_THEMES[key];
            const isSelected = currentTheme === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectTheme(key)}
                className={`text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-emerald-500 bg-neutral-900 shadow-xl ring-2 ring-emerald-500/20 scale-[1.02]'
                    : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-700 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: theme.dotColor }}
                    />
                    <span className="text-xs font-bold text-white">
                      {language === 'bn' ? theme.nameBn : theme.name}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-emerald-500 text-neutral-950">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Live Swatch Preview Pill */}
                <div className="h-6 rounded-lg w-full flex overflow-hidden border border-neutral-800">
                  <div className="w-1/3 h-full" style={{ backgroundColor: theme.dotColor }} />
                  <div className={`w-1/3 h-full ${theme.sidebarBg}`} />
                  <div className={`w-1/3 h-full ${theme.mainBg}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Header Dropdown Variant
  return (
    <div className="relative">
      <button
        type="button"
        id="admin-theme-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
        title="Switch Admin Theme"
      >
        <span
          className="w-3 h-3 rounded-full shadow-sm ring-1 ring-white/20"
          style={{ backgroundColor: activeTheme.dotColor }}
        />
        <Palette className="w-3.5 h-3.5 text-neutral-300" />
        <span className="hidden sm:inline">
          {language === 'bn' ? 'থিম' : 'Theme'}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-neutral-800">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                {language === 'bn' ? 'এডমিন প্যানেল থিম' : 'Admin Themes'}
              </span>
              <span className="text-[10px] text-neutral-500">
                {language === 'bn' ? 'পছন্দের কালার স্কিম নির্বাচন করুন' : 'Select your workspace palette'}
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1 py-1">
              {(Object.keys(ADMIN_THEMES) as AdminThemeKey[]).map((key) => {
                const theme = ADMIN_THEMES[key];
                const isSelected = currentTheme === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onSelectTheme(key);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-neutral-800 text-white font-bold'
                        : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: theme.dotColor }}
                      />
                      <span>{language === 'bn' ? theme.nameBn : theme.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
