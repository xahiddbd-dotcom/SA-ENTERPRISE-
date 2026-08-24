import React from 'react';
import { useData } from '../../context/DataContext';
import { BackgroundPatternType, BackgroundWallpaperPreset, BackgroundOverlayTint } from '../../types';

export const WALLPAPER_PRESETS: Record<Exclude<BackgroundWallpaperPreset, 'none' | 'custom'>, { name: string; nameBn: string; url: string; category: string }> = {
  dark_modern_geometric: {
    name: 'Obsidian Geometric 3D',
    nameBn: 'অ্যাবস্ট্রাক্ট জ্যামিতিক ডার্ক',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=80',
    category: 'Abstract'
  },
  cyber_workspace: {
    name: 'Cyber IT Workstation',
    nameBn: 'সাইবার আইটি ওয়ার্কস্টেশন',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2000&q=80',
    category: 'Tech'
  },
  printing_press: {
    name: 'Modern Print Press & Studio',
    nameBn: 'আধুনিক প্রিন্টিং প্রেস স্টুডিও',
    url: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=2000&q=80',
    category: 'Printing'
  },
  digital_matrix: {
    name: 'Digital Cyber Grid Stream',
    nameBn: 'ডিজিটাল সাইবার ম্যাট্রিক্স গ্রিড',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=80',
    category: 'Cyber'
  },
  tech_glow: {
    name: 'Deep Emerald Quantum Glow',
    nameBn: 'কোয়ান্টাম এমারেল্ড গ্লো',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
    category: 'Glow'
  }
};

export const PATTERN_PRESETS: Record<Exclude<BackgroundPatternType, 'none'>, { name: string; nameBn: string; desc: string }> = {
  grid: {
    name: 'Blueprint Tech Grid',
    nameBn: 'টেকনিক্যাল ব্লুপ্রিন্ট গ্রিড',
    desc: 'Fine engineering millimeter grid lines'
  },
  dots: {
    name: 'Subtle Matrix Dots',
    nameBn: 'ম্যাট্রিক্স ডট পয়েন্টস',
    desc: 'Evenly spaced modern digital dot array'
  },
  circuit: {
    name: 'Cyber PCB Circuit',
    nameBn: 'সাইবার সার্কিট পাথ',
    desc: 'Futuristic electronic logic board pathways'
  },
  hexagons: {
    name: 'Honeycomb Hex Matrix',
    nameBn: 'হানি-কম্ব হেক্সাগন',
    desc: 'Interlocking geometric tech honeycomb'
  },
  diagonal_stripes: {
    name: 'Carbon Studio Slants',
    nameBn: 'কার্বন ফাইবার স্ট্রাইপস',
    desc: 'Subtle 45° angled architectural studio lines'
  },
  paper_grain: {
    name: 'Artisan Paper Fiber',
    nameBn: 'প্রিমিয়াম পেপার ফাইবার',
    desc: 'Authentic stationery paper and card texture'
  },
  mesh_glow: {
    name: 'Ambient Aura Orbs',
    nameBn: 'অ্যাম্বিয়েন্ট অরা মেশ গ্লো',
    desc: 'Soft ethereal glowing radiance orbs'
  }
};

export const TINT_PRESETS: Record<BackgroundOverlayTint, { name: string; bgClass: string; hex: string }> = {
  dark: { name: 'Deep Charcoal (Default)', bgClass: 'bg-neutral-950/85', hex: '#0a0a0a' },
  emerald: { name: 'Emerald Forest Dark', bgClass: 'bg-[#04140e]/90', hex: '#04140e' },
  navy: { name: 'Midnight Deep Navy', bgClass: 'bg-[#050f1f]/90', hex: '#050f1f' },
  slate: { name: 'Graphite Slate Gray', bgClass: 'bg-[#0b111e]/90', hex: '#0b111e' },
  pure_black: { name: 'OLED Pure Black', bgClass: 'bg-black/92', hex: '#000000' }
};

export const BackgroundLayer: React.FC = () => {
  const { settings } = useData();

  const backgroundType = settings.backgroundType || 'combo';
  const texturePattern = settings.texturePattern || 'grid';
  const textureOpacity = (settings.textureOpacity ?? 15) / 100;
  const wallpaperPreset = settings.wallpaperPreset || 'dark_modern_geometric';
  const customWallpaperUrl = settings.customWallpaperUrl || '';
  const wallpaperOpacity = (settings.wallpaperOpacity ?? 25) / 100;
  const wallpaperBlur = settings.wallpaperBlur ?? 3;
  const wallpaperFixed = settings.wallpaperFixed !== false;
  const tint = settings.backgroundOverlayTint || 'dark';

  // Determine wallpaper image source
  let activeWallpaperUrl = '';
  if (wallpaperPreset === 'custom' && customWallpaperUrl.trim()) {
    activeWallpaperUrl = customWallpaperUrl.trim();
  } else if (wallpaperPreset !== 'none' && WALLPAPER_PRESETS[wallpaperPreset as keyof typeof WALLPAPER_PRESETS]) {
    activeWallpaperUrl = WALLPAPER_PRESETS[wallpaperPreset as keyof typeof WALLPAPER_PRESETS].url;
  }

  const shouldRenderWallpaper = (backgroundType === 'wallpaper' || backgroundType === 'combo') && activeWallpaperUrl && wallpaperPreset !== 'none';
  const shouldRenderTexture = (backgroundType === 'texture' || backgroundType === 'combo') && texturePattern !== 'none';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden select-none"
    >
      {/* BASE COLOR TINT */}
      <div className="absolute inset-0 bg-neutral-950" />

      {/* 1. WALLPAPER LAYER */}
      {shouldRenderWallpaper && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${wallpaperFixed ? 'bg-fixed' : ''}`}
          style={{
            backgroundImage: `url(${activeWallpaperUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: wallpaperOpacity,
            filter: `blur(${wallpaperBlur}px)`
          }}
        />
      )}

      {/* 2. OVERLAY TINT FOR LEGIBILITY */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          TINT_PRESETS[tint]?.bgClass || 'bg-neutral-950/85'
        }`}
      />

      {/* 3. SVG TEXTURE & GEOMETRIC PATTERN LAYER */}
      {shouldRenderTexture && (
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: textureOpacity }}
        >
          {texturePattern === 'grid' && (
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="bg-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
                  <path d="M 200 0 L 0 0 0 200" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#bg-grid-pattern)" />
            </svg>
          )}

          {texturePattern === 'dots' && (
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="bg-dots-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.5)" />
                  <circle cx="14" cy="14" r="0.75" fill="rgba(16,185,129,0.4)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#bg-dots-pattern)" />
            </svg>
          )}

          {texturePattern === 'circuit' && (
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="bg-circuit-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M10 10 h30 v20 h20 v30 h-15 v15 h-35 z" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="0.8" />
                  <path d="M60 10 h30 v40 h-20 v20 h20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                  <circle cx="10" cy="10" r="2.5" fill="rgba(16,185,129,0.6)" />
                  <circle cx="40" cy="30" r="2" fill="rgba(255,255,255,0.5)" />
                  <circle cx="60" cy="60" r="2.5" fill="rgba(16,185,129,0.6)" />
                  <circle cx="90" cy="50" r="2" fill="rgba(255,255,255,0.5)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#bg-circuit-pattern)" />
            </svg>
          )}

          {texturePattern === 'hexagons' && (
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="bg-hex-pattern" width="56" height="96" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
                  <path
                    d="M28,0 L56,16 L56,48 L28,64 L0,48 L0,16 Z M28,48 L56,64 L56,96 L28,112 L0,96 L0,64 Z"
                    fill="none"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="0.7"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#bg-hex-pattern)" />
            </svg>
          )}

          {texturePattern === 'diagonal_stripes' && (
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="bg-stripes-pattern" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="30" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                  <line x1="15" y1="0" x2="15" y2="30" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#bg-stripes-pattern)" />
            </svg>
          )}

          {texturePattern === 'paper_grain' && (
            <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
              <filter id="bg-noise-filter">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.25 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#bg-noise-filter)" />
            </svg>
          )}

          {texturePattern === 'mesh_glow' && (
            <div className="absolute inset-0">
              <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/20 blur-[100px] pointer-events-none" />
              <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-teal-500/15 blur-[120px] pointer-events-none" />
              <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full bg-emerald-600/15 blur-[140px] pointer-events-none" />
            </div>
          )}
        </div>
      )}

      {/* 4. SOFT RADIAL VIGNETTE FOR SIGHTLINE FOCUS */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />
    </div>
  );
};
