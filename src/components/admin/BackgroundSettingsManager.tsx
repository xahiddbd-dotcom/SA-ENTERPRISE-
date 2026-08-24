import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import {
  BackgroundPatternType,
  BackgroundWallpaperPreset,
  BackgroundOverlayTint,
  WebsiteSettings
} from '../../types';
import {
  WALLPAPER_PRESETS,
  PATTERN_PRESETS,
  TINT_PRESETS
} from '../common/BackgroundLayer';
import {
  Palette,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Save,
  CheckCircle2,
  RefreshCw,
  Eye,
  Sliders,
  Maximize2,
  Lock,
  Grid,
  Check
} from 'lucide-react';

interface BackgroundSettingsManagerProps {
  onSaved?: () => void;
}

export const BackgroundSettingsManager: React.FC<BackgroundSettingsManagerProps> = ({ onSaved }) => {
  const { language } = useLanguage();
  const { settings, updateSettings } = useData();

  // Local form state
  const [backgroundType, setBackgroundType] = useState<'default' | 'texture' | 'wallpaper' | 'combo'>(
    settings.backgroundType || 'combo'
  );
  const [texturePattern, setTexturePattern] = useState<BackgroundPatternType>(
    settings.texturePattern || 'grid'
  );
  const [textureOpacity, setTextureOpacity] = useState<number>(
    settings.textureOpacity ?? 15
  );
  const [wallpaperPreset, setWallpaperPreset] = useState<BackgroundWallpaperPreset>(
    settings.wallpaperPreset || 'dark_modern_geometric'
  );
  const [customWallpaperUrl, setCustomWallpaperUrl] = useState<string>(
    settings.customWallpaperUrl || ''
  );
  const [wallpaperOpacity, setWallpaperOpacity] = useState<number>(
    settings.wallpaperOpacity ?? 25
  );
  const [wallpaperBlur, setWallpaperBlur] = useState<number>(
    settings.wallpaperBlur ?? 3
  );
  const [wallpaperFixed, setWallpaperFixed] = useState<boolean>(
    settings.wallpaperFixed !== false
  );
  const [backgroundOverlayTint, setBackgroundOverlayTint] = useState<BackgroundOverlayTint>(
    settings.backgroundOverlayTint || 'dark'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Determine active preview wallpaper URL
  let previewWallpaperUrl = '';
  if (wallpaperPreset === 'custom' && customWallpaperUrl.trim()) {
    previewWallpaperUrl = customWallpaperUrl.trim();
  } else if (wallpaperPreset !== 'none' && WALLPAPER_PRESETS[wallpaperPreset as keyof typeof WALLPAPER_PRESETS]) {
    previewWallpaperUrl = WALLPAPER_PRESETS[wallpaperPreset as keyof typeof WALLPAPER_PRESETS].url;
  }

  // Quick Preset Themes
  const applyQuickTheme = (theme: {
    bgType: 'default' | 'texture' | 'wallpaper' | 'combo';
    pattern: BackgroundPatternType;
    patternOp: number;
    wpPreset: BackgroundWallpaperPreset;
    customUrl?: string;
    wpOp: number;
    wpBlur: number;
    tint: BackgroundOverlayTint;
  }) => {
    setBackgroundType(theme.bgType);
    setTexturePattern(theme.pattern);
    setTextureOpacity(theme.patternOp);
    setWallpaperPreset(theme.wpPreset);
    if (theme.customUrl !== undefined) setCustomWallpaperUrl(theme.customUrl);
    setWallpaperOpacity(theme.wpOp);
    setWallpaperBlur(theme.wpBlur);
    setBackgroundOverlayTint(theme.tint);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Partial<WebsiteSettings> = {
      backgroundType,
      texturePattern,
      textureOpacity,
      wallpaperPreset,
      customWallpaperUrl,
      wallpaperOpacity,
      wallpaperBlur,
      wallpaperFixed,
      backgroundOverlayTint
    };

    updateSettings(updates);
    setSavedSuccess(true);
    if (onSaved) onSaved();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    setBackgroundType('combo');
    setTexturePattern('grid');
    setTextureOpacity(15);
    setWallpaperPreset('dark_modern_geometric');
    setCustomWallpaperUrl('');
    setWallpaperOpacity(25);
    setWallpaperBlur(3);
    setWallpaperFixed(true);
    setBackgroundOverlayTint('dark');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-400" />
            <span>
              {language === 'bn'
                ? 'ওয়েবসাইট ব্যাকগ্রাউন্ড টেক্সচার ও ওয়ালপেপার সেটিংস'
                : 'Website Background Texture & Wallpaper Customizer'}
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {language === 'bn'
              ? 'সাইটের ব্যাকগ্রাউন্ডে আধুনিক জ্যামিতিক টেক্সচার প্যাটার্ন, ফুল এইচডি ওয়ালপেপার এবং ডার্ক কালার টিন্ট কাস্টমাইজ করুন।'
              : 'Configure real-time vector textures, high-definition wallpapers, blur depth, and ambient overlay tints.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ডিফল্ট রিসেট' : 'Reset Defaults'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="font-semibold">
            {language === 'bn'
              ? 'ব্যাকগ্রাউন্ড ও ওয়ালপেপার সেটিংস সফলভাবে সেভ করা হয়েছে এবং পুরো সাইটে লাইভ অ্যাপ্লাই হয়েছে!'
              : 'Background texture & wallpaper settings saved and applied live across the entire website!'}
          </span>
        </div>
      )}

      {/* QUICK PRESET BARS */}
      <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2.5 shadow-md">
        <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'bn' ? 'এক ক্লিকে দ্রুত থিম স্টাইল নির্বাচন' : '1-Click Curated Theme Styles'}</span>
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <button
            type="button"
            onClick={() => applyQuickTheme({
              bgType: 'combo',
              pattern: 'grid',
              patternOp: 20,
              wpPreset: 'dark_modern_geometric',
              wpOp: 30,
              wpBlur: 3,
              tint: 'dark'
            })}
            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="text-xs font-bold text-white group-hover:text-emerald-400 flex items-center justify-between">
              <span>Obsidian Grid</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] text-neutral-400">Tech geometry + grid</span>
          </button>

          <button
            type="button"
            onClick={() => applyQuickTheme({
              bgType: 'combo',
              pattern: 'circuit',
              patternOp: 25,
              wpPreset: 'cyber_workspace',
              wpOp: 28,
              wpBlur: 2,
              tint: 'navy'
            })}
            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 hover:border-teal-500/50 text-left transition-all group"
          >
            <div className="text-xs font-bold text-white group-hover:text-teal-400 flex items-center justify-between">
              <span>Cyber Studio</span>
              <span className="w-2 h-2 rounded-full bg-teal-400" />
            </div>
            <span className="text-[10px] text-neutral-400">Cyber traces + navy</span>
          </button>

          <button
            type="button"
            onClick={() => applyQuickTheme({
              bgType: 'combo',
              pattern: 'paper_grain',
              patternOp: 20,
              wpPreset: 'printing_press',
              wpOp: 25,
              wpBlur: 4,
              tint: 'emerald'
            })}
            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="text-xs font-bold text-white group-hover:text-emerald-400 flex items-center justify-between">
              <span>Print Artisan</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] text-neutral-400">Paper grain + press</span>
          </button>

          <button
            type="button"
            onClick={() => applyQuickTheme({
              bgType: 'combo',
              pattern: 'hexagons',
              patternOp: 18,
              wpPreset: 'digital_matrix',
              wpOp: 25,
              wpBlur: 2,
              tint: 'slate'
            })}
            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 hover:border-blue-500/50 text-left transition-all group"
          >
            <div className="text-xs font-bold text-white group-hover:text-blue-400 flex items-center justify-between">
              <span>Hex Matrix</span>
              <span className="w-2 h-2 rounded-full bg-blue-400" />
            </div>
            <span className="text-[10px] text-neutral-400">Honeycomb + matrix</span>
          </button>

          <button
            type="button"
            onClick={() => applyQuickTheme({
              bgType: 'texture',
              pattern: 'mesh_glow',
              patternOp: 35,
              wpPreset: 'none',
              wpOp: 0,
              wpBlur: 0,
              tint: 'pure_black'
            })}
            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 hover:border-purple-500/50 text-left transition-all group"
          >
            <div className="text-xs font-bold text-white group-hover:text-purple-400 flex items-center justify-between">
              <span>Aura Minimal</span>
              <span className="w-2 h-2 rounded-full bg-purple-400" />
            </div>
            <span className="text-[10px] text-neutral-400">Pure black + soft orbs</span>
          </button>
        </div>
      </div>

      {/* LIVE PREVIEW & CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / TOP: LIVE INTERACTIVE PREVIEW CARD */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? 'লাইভ ব্যাকগ্রাউন্ড প্রিভিউ' : 'Live Interactive Preview'}</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              Live Rendering
            </span>
          </div>

          {/* Interactive Mockup Container */}
          <div className="relative h-96 w-full rounded-3xl overflow-hidden border-2 border-neutral-800 shadow-2xl p-5 flex flex-col justify-between select-none">
            {/* Background Layer Preview */}
            <div className="absolute inset-0 bg-neutral-950 -z-30" />

            {/* Wallpaper Layer */}
            {(backgroundType === 'wallpaper' || backgroundType === 'combo') && previewWallpaperUrl && wallpaperPreset !== 'none' && (
              <div
                className="absolute inset-0 -z-20"
                style={{
                  backgroundImage: `url(${previewWallpaperUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: wallpaperOpacity / 100,
                  filter: `blur(${wallpaperBlur}px)`
                }}
              />
            )}

            {/* Overlay Tint */}
            <div
              className={`absolute inset-0 -z-10 transition-colors ${
                TINT_PRESETS[backgroundOverlayTint]?.bgClass || 'bg-neutral-950/85'
              }`}
            />

            {/* Texture Pattern Preview */}
            {(backgroundType === 'texture' || backgroundType === 'combo') && texturePattern !== 'none' && (
              <div
                className="absolute inset-0 -z-10"
                style={{ opacity: textureOpacity / 100 }}
              >
                {texturePattern === 'grid' && (
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="preview-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
                        <path d="M 120 0 L 0 0 0 120" fill="none" stroke="rgba(16,185,129,0.35)" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#preview-grid)" />
                  </svg>
                )}

                {texturePattern === 'dots' && (
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="preview-dots" width="16" height="16" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.5)" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#preview-dots)" />
                  </svg>
                )}

                {texturePattern === 'circuit' && (
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="preview-circuit" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M10 10 h20 v15 h15 v20 h-10" fill="none" stroke="rgba(16,185,129,0.5)" strokeWidth="0.8" />
                        <circle cx="10" cy="10" r="2" fill="rgba(16,185,129,0.7)" />
                        <circle cx="45" cy="45" r="2" fill="rgba(255,255,255,0.6)" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#preview-circuit)" />
                  </svg>
                )}

                {texturePattern === 'hexagons' && (
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="preview-hex" width="36" height="60" patternUnits="userSpaceOnUse">
                        <path d="M18,0 L36,10 L36,30 L18,40 L0,30 L0,10 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#preview-hex)" />
                  </svg>
                )}

                {texturePattern === 'diagonal_stripes' && (
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="preview-stripes" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#preview-stripes)" />
                  </svg>
                )}

                {texturePattern === 'paper_grain' && (
                  <div className="w-full h-full bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:8px_8px]" />
                )}

                {texturePattern === 'mesh_glow' && (
                  <div className="absolute inset-0">
                    <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-emerald-500/30 blur-2xl" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-teal-500/25 blur-2xl" />
                  </div>
                )}
              </div>
            )}

            {/* Mock Header */}
            <div className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-neutral-950 font-black text-xs">
                  SE
                </div>
                <div>
                  <span className="text-xs font-bold text-white leading-none block">Saiful Enterprise</span>
                  <span className="text-[9px] text-neutral-400 font-mono">Beside Tejgaon College</span>
                </div>
              </div>
              <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                Online
              </div>
            </div>

            {/* Mock Center Card Content */}
            <div className="bg-neutral-900/85 backdrop-blur-md border border-neutral-700/60 rounded-2xl p-4 space-y-2.5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Online Application Desk</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  Fast Processing
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Experience crystal-clear typography and responsive design over customizable high-tech backdrops.
              </p>
              <div className="flex gap-2 pt-1">
                <div className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[10px] shadow-sm">
                  Apply Now
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 text-[10px] border border-neutral-700">
                  Services
                </div>
              </div>
            </div>

            {/* Mock Footer Pill */}
            <div className="text-center text-[10px] text-neutral-400 font-mono">
              Pattern: <strong className="text-emerald-400">{texturePattern}</strong> ({textureOpacity}%) • Tint: <strong className="text-emerald-400">{backgroundOverlayTint}</strong>
            </div>
          </div>
        </div>

        {/* RIGHT / MAIN: CONTROL FORM */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-xl">
          {/* 1. BACKGROUND MODE TOGGLE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-200 block uppercase tracking-wider">
              {language === 'bn' ? '১. ব্যাকগ্রাউন্ড মোড' : '1. Background Composition Mode'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'combo', label: 'Combo (Wallpaper + Texture)', icon: Layers },
                { id: 'texture', label: 'Texture Pattern Only', icon: Grid },
                { id: 'wallpaper', label: 'Wallpaper Only', icon: ImageIcon },
                { id: 'default', label: 'Solid Charcoal', icon: Palette }
              ].map(m => {
                const Icon = m.icon;
                const isSelected = backgroundType === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setBackgroundType(m.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-neutral-500'}`} />
                    <span className="text-xs font-bold leading-tight">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. TEXTURE PATTERNS SELECTOR */}
          {(backgroundType === 'texture' || backgroundType === 'combo') && (
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-200 flex items-center gap-1.5 uppercase tracking-wider">
                  <Grid className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'bn' ? '২. ভেক্টর টেক্সচার ও জ্যামিতিক প্যাটার্ন' : '2. Vector Texture Pattern'}</span>
                </label>
                <span className="text-[11px] text-neutral-400 font-mono">
                  Opacity: <strong>{textureOpacity}%</strong>
                </span>
              </div>

              {/* Texture Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.entries(PATTERN_PRESETS).map(([key, item]) => {
                  const isSelected = texturePattern === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTexturePattern(key as BackgroundPatternType)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-950/70 border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md'
                          : 'bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold truncate">{item.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-neutral-400 line-clamp-2 leading-tight">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Texture Opacity Slider */}
              <div className="pt-2 bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800 space-y-1.5">
                <div className="flex justify-between text-xs text-neutral-300 font-semibold">
                  <span>Pattern Visibility Opacity</span>
                  <span className="font-mono text-emerald-400">{textureOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={textureOpacity}
                  onChange={e => setTextureOpacity(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>5% (Subtle Whisper)</span>
                  <span>30% (Standard)</span>
                  <span>60% (High Contrast)</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. WALLPAPER GALLERY & CUSTOM URL */}
          {(backgroundType === 'wallpaper' || backgroundType === 'combo') && (
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <label className="text-xs font-bold text-neutral-200 flex items-center gap-1.5 uppercase tracking-wider">
                <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                <span>{language === 'bn' ? '৩. ওয়ালপেপার প্রিসেট গ্যালারি' : '3. High-Definition Wallpaper Presets'}</span>
              </label>

              {/* Wallpaper Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(WALLPAPER_PRESETS).map(([key, item]) => {
                  const isSelected = wallpaperPreset === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setWallpaperPreset(key as BackgroundWallpaperPreset)}
                      className={`group relative h-24 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                        isSelected
                          ? 'border-emerald-500 shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-500/50'
                          : 'border-neutral-800 hover:border-neutral-700 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2.5 flex flex-col justify-end">
                        <span className="text-xs font-bold text-white leading-tight drop-shadow truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-emerald-300 font-mono">{item.category}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 p-1 rounded-full bg-emerald-500 text-neutral-950 shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Custom Wallpaper Option */}
                <div
                  onClick={() => setWallpaperPreset('custom')}
                  className={`group relative h-24 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all p-3 flex flex-col justify-between ${
                    wallpaperPreset === 'custom'
                      ? 'border-emerald-500 bg-emerald-950/60 shadow-lg ring-2 ring-emerald-500/50'
                      : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Custom URL</span>
                    {wallpaperPreset === 'custom' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-[10px] text-neutral-400">Use any external HD image link</p>
                </div>
              </div>

              {/* Custom Image URL Field */}
              {wallpaperPreset === 'custom' && (
                <div className="bg-neutral-950/70 p-3.5 rounded-2xl border border-neutral-800 space-y-2 animate-in fade-in">
                  <label className="text-xs font-semibold text-neutral-300 block">
                    Custom Wallpaper Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={customWallpaperUrl}
                    onChange={e => setCustomWallpaperUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  {customWallpaperUrl && (
                    <p className="text-[10px] text-emerald-400">Custom URL linked.</p>
                  )}
                </div>
              )}

              {/* Wallpaper Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800">
                {/* Opacity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-neutral-300 font-semibold">
                    <span>Wallpaper Opacity</span>
                    <span className="font-mono text-emerald-400">{wallpaperOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="75"
                    step="1"
                    value={wallpaperOpacity}
                    onChange={e => setWallpaperOpacity(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Blur */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-neutral-300 font-semibold">
                    <span>Depth Blur</span>
                    <span className="font-mono text-emerald-400">{wallpaperBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={wallpaperBlur}
                    onChange={e => setWallpaperBlur(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. OVERLAY COLOR TINT & ATTACHMENT */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <label className="text-xs font-bold text-neutral-200 flex items-center gap-1.5 uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? '৪. ওভারলে কালার টিন্ট' : '4. Ambient Background Overlay Tint'}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {Object.entries(TINT_PRESETS).map(([key, item]) => {
                const isSelected = backgroundOverlayTint === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setBackgroundOverlayTint(key as BackgroundOverlayTint)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-neutral-800 border-emerald-500 text-white ring-1 ring-emerald-500/50'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span className="text-[11px] font-bold truncate">{item.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Fixed Toggle */}
            <div className="pt-2 flex items-center justify-between p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800">
              <div>
                <span className="text-xs font-bold text-white block">Fixed Background Perspective</span>
                <span className="text-[11px] text-neutral-400">Keep wallpaper anchored while scrolling pages</span>
              </div>
              <button
                type="button"
                onClick={() => setWallpaperFixed(!wallpaperFixed)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  wallpaperFixed ? 'bg-emerald-600' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    wallpaperFixed ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* SUBMIT ACTIONS */}
          <div className="pt-4 flex items-center justify-between border-t border-neutral-800">
            <span className="text-[11px] text-neutral-400">
              Changes apply instantly across public and admin interfaces.
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'bn' ? 'ব্যাকগ্রাউন্ড সেটিংস সেভ করুন' : 'Save & Apply Background'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
