export type AdminThemeKey = 
  | 'emerald' 
  | 'midnight' 
  | 'amethyst' 
  | 'amber' 
  | 'crimson' 
  | 'nordic_light';

export interface AdminThemeConfig {
  id: AdminThemeKey;
  name: string;
  nameBn: string;
  dotColor: string;
  headerBg: string;
  sidebarBg: string;
  mainBg: string;
  cardBg: string;
  cardBgSecondary: string;
  borderColor: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentText: string;
  accentBg: string;
  accentBadge: string;
  primaryGradient: string;
  buttonClass: string;
  activeSidebarItem: string;
  inactiveSidebarItem: string;
  inputBg: string;
  shadowColor: string;
}

export const ADMIN_THEMES: Record<AdminThemeKey, AdminThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'Emerald Forest (Dark)',
    nameBn: 'এমারেল্ড গ্রিন (ডার্ক)',
    dotColor: '#10b981',
    headerBg: 'bg-neutral-900/95',
    sidebarBg: 'bg-neutral-900',
    mainBg: 'bg-neutral-950',
    cardBg: 'bg-neutral-900',
    cardBgSecondary: 'bg-neutral-950',
    borderColor: 'border-neutral-800',
    textPrimary: 'text-white',
    textSecondary: 'text-neutral-300',
    textMuted: 'text-neutral-400',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-950',
    accentBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    primaryGradient: 'bg-gradient-to-r from-emerald-600 to-teal-600',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    activeSidebarItem: 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-950',
    inactiveSidebarItem: 'text-neutral-400 hover:bg-neutral-800 hover:text-white',
    inputBg: 'bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500',
    shadowColor: 'shadow-emerald-950'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Sapphire (Cyber Blue)',
    nameBn: 'মিডনাইট ব্লু (সাইবার স্যাফায়ার)',
    dotColor: '#06b6d4',
    headerBg: 'bg-slate-900/95',
    sidebarBg: 'bg-slate-900',
    mainBg: 'bg-slate-950',
    cardBg: 'bg-slate-900',
    cardBgSecondary: 'bg-slate-950',
    borderColor: 'border-slate-800',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-950',
    accentBadge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    primaryGradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500',
    buttonClass: 'bg-blue-600 hover:bg-cyan-600 text-white',
    activeSidebarItem: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-lg shadow-blue-950',
    inactiveSidebarItem: 'text-slate-400 hover:bg-slate-800 hover:text-white',
    inputBg: 'bg-slate-950 border-slate-800 text-white focus:border-cyan-500',
    shadowColor: 'shadow-cyan-950'
  },
  amethyst: {
    id: 'amethyst',
    name: 'Royal Amethyst (Deep Violet)',
    nameBn: 'রয়্যাল ভায়োলেট (পার্পল)',
    dotColor: '#a855f7',
    headerBg: 'bg-zinc-900/95',
    sidebarBg: 'bg-zinc-900',
    mainBg: 'bg-zinc-950',
    cardBg: 'bg-zinc-900',
    cardBgSecondary: 'bg-zinc-950',
    borderColor: 'border-zinc-800',
    textPrimary: 'text-white',
    textSecondary: 'text-zinc-300',
    textMuted: 'text-zinc-400',
    accentText: 'text-purple-400',
    accentBg: 'bg-purple-950',
    accentBadge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    primaryGradient: 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600',
    buttonClass: 'bg-purple-600 hover:bg-fuchsia-600 text-white',
    activeSidebarItem: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-950',
    inactiveSidebarItem: 'text-zinc-400 hover:bg-zinc-800 hover:text-white',
    inputBg: 'bg-zinc-950 border-zinc-800 text-white focus:border-purple-500',
    shadowColor: 'shadow-purple-950'
  },
  amber: {
    id: 'amber',
    name: 'Espresso Gold (Warm Amber)',
    nameBn: 'অ্যাম্বার গোল্ড (এসপ্রেসো)',
    dotColor: '#f59e0b',
    headerBg: 'bg-stone-900/95',
    sidebarBg: 'bg-stone-900',
    mainBg: 'bg-stone-950',
    cardBg: 'bg-stone-900',
    cardBgSecondary: 'bg-stone-950',
    borderColor: 'border-stone-800',
    textPrimary: 'text-stone-50',
    textSecondary: 'text-stone-300',
    textMuted: 'text-stone-400',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-950',
    accentBadge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    primaryGradient: 'bg-gradient-to-r from-amber-600 to-orange-600',
    buttonClass: 'bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold',
    activeSidebarItem: 'bg-gradient-to-r from-amber-600 to-orange-600 text-stone-950 font-bold shadow-lg shadow-amber-950',
    inactiveSidebarItem: 'text-stone-400 hover:bg-stone-800 hover:text-white',
    inputBg: 'bg-stone-950 border-stone-800 text-stone-100 focus:border-amber-500',
    shadowColor: 'shadow-amber-950'
  },
  crimson: {
    id: 'crimson',
    name: 'Executive Crimson (Ruby Slate)',
    nameBn: 'ক্রিমসন রুবি (এক্সিকিউটিভ রেড)',
    dotColor: '#f43f5e',
    headerBg: 'bg-neutral-900/95',
    sidebarBg: 'bg-neutral-900',
    mainBg: 'bg-neutral-950',
    cardBg: 'bg-neutral-900',
    cardBgSecondary: 'bg-neutral-950',
    borderColor: 'border-rose-950/60',
    textPrimary: 'text-white',
    textSecondary: 'text-neutral-300',
    textMuted: 'text-neutral-400',
    accentText: 'text-rose-400',
    accentBg: 'bg-rose-950',
    accentBadge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    primaryGradient: 'bg-gradient-to-r from-rose-600 to-red-600',
    buttonClass: 'bg-rose-600 hover:bg-rose-500 text-white font-bold',
    activeSidebarItem: 'bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold shadow-lg shadow-rose-950',
    inactiveSidebarItem: 'text-neutral-400 hover:bg-neutral-800 hover:text-white',
    inputBg: 'bg-neutral-950 border-neutral-800 text-white focus:border-rose-500',
    shadowColor: 'shadow-rose-950'
  },
  nordic_light: {
    id: 'nordic_light',
    name: 'Nordic Clean (High-Contrast Light)',
    nameBn: 'নরডিক লাইট (পরিচ্ছন্ন সাদা ও স্লেট)',
    dotColor: '#4f46e5',
    headerBg: 'bg-white/95',
    sidebarBg: 'bg-white',
    mainBg: 'bg-slate-100',
    cardBg: 'bg-white',
    cardBgSecondary: 'bg-slate-50',
    borderColor: 'border-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textMuted: 'text-slate-500',
    accentText: 'text-indigo-600',
    accentBg: 'bg-indigo-50',
    accentBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    primaryGradient: 'bg-gradient-to-r from-indigo-600 to-emerald-600',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold',
    activeSidebarItem: 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-200',
    inactiveSidebarItem: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    inputBg: 'bg-white border-slate-300 text-slate-900 focus:border-indigo-600',
    shadowColor: 'shadow-slate-300'
  }
};
