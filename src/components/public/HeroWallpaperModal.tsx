import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Image as ImageIcon,
  X,
  Upload,
  Check,
  Sparkles,
  Sliders,
  Play,
  Pause,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { HeroSlide } from '../../types';

interface HeroWallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlideIndex: number;
  onSelectSlide: (index: number) => void;
}

// 10 Curated Premium HD Wallpapers tailored for Saiful Enterprise
export const PRESET_HERO_WALLPAPERS = [
  {
    id: 'wp_counter',
    titleBn: 'লাইভ ডিজিটাল কাউন্টার ও সাইবার ডেস্ক',
    titleEn: 'Live Digital Counter & Cyber Desk',
    tagBn: 'ডিজিটাল কাউন্টার',
    tagEn: 'Live Digital Counter',
    src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1920&auto=format&fit=crop',
    accent: 'emerald',
    category: 'Workstation'
  },
  {
    id: 'wp_printing',
    titleBn: 'হেভি ডিউটি কালার লেজার ও ফটোকপি প্রেস',
    titleEn: 'Heavy Duty Digital Laser & Print Press',
    tagBn: 'কমার্শিয়াল প্রিন্ট',
    tagEn: 'Commercial Printing',
    src: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1920&auto=format&fit=crop',
    accent: 'sky',
    category: 'Printing'
  },
  {
    id: 'wp_college',
    titleBn: 'তেজগাঁও কলেজ ভর্তি ও অনলাইন পোর্টাল হাব',
    titleEn: 'Tejgaon College Portal & Admission Hub',
    tagBn: 'তেজগাঁও কলেজ',
    tagEn: 'Tejgaon College',
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop',
    accent: 'amber',
    category: 'Education'
  },
  {
    id: 'wp_paper',
    titleBn: 'ডাবল এ, নেভিগেটর ও পেপার ডিপো',
    titleEn: 'Paper One, Double A & Stationery Depot',
    tagBn: 'পেপার ডিপো',
    tagEn: 'Paper Depot',
    src: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1920&auto=format&fit=crop',
    accent: 'purple',
    category: 'Paper'
  },
  {
    id: 'wp_studio',
    titleBn: 'জরুরি ৫ মিনিট পাসপোর্ট ও ভিসা ফটো ল্যাব',
    titleEn: '5-Minute Biometric Passport Photo Lab',
    tagBn: 'স্টুডিও ফটো',
    tagEn: 'Instant Studio',
    src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1920&auto=format&fit=crop',
    accent: 'teal',
    category: 'Studio'
  },
  {
    id: 'wp_abstract_3d',
    titleBn: 'অ্যাবস্ট্রাক্ট জ্যামিতিক থ্রিডি স্টুডিও',
    titleEn: 'Obsidian 3D Geometric Studio',
    tagBn: 'জ্যামিতিক থ্রিডি',
    tagEn: '3D Geometric',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
    accent: 'emerald',
    category: 'Abstract'
  },
  {
    id: 'wp_cyber_matrix',
    titleBn: 'সাইবার ম্যাট্রিক্স ও হাই-টেক কোডিং গ্রিড',
    titleEn: 'Cyber Matrix Digital Grid Stream',
    tagBn: 'সাইবার গ্রিড',
    tagEn: 'Cyber Grid',
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
    accent: 'teal',
    category: 'Cyber'
  },
  {
    id: 'wp_quantum_glow',
    titleBn: 'কোয়ান্টাম এমারেল্ড এনার্জি গ্লো',
    titleEn: 'Quantum Emerald Energy Glow',
    tagBn: 'কোয়ান্টাম গ্লো',
    tagEn: 'Quantum Glow',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    accent: 'emerald',
    category: 'Glow'
  },
  {
    id: 'wp_it_office',
    titleBn: 'আধুনিক গ্লাস আইটি ও কম্পিউটার স্পেস',
    titleEn: 'Modern Glass IT & Computer Space',
    tagBn: 'আইটি স্পেস',
    tagEn: 'IT Space',
    src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80',
    accent: 'blue',
    category: 'Tech'
  },
  {
    id: 'wp_blueprint',
    titleBn: 'প্রকৌশল ব্লুপ্রিন্ট ও টেক আর্কিটেকচার',
    titleEn: 'Engineering Blueprint & Tech Architecture',
    tagBn: 'ব্লুপ্রিন্ট',
    tagEn: 'Blueprint',
    src: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1920&q=80',
    accent: 'sky',
    category: 'Blueprint'
  }
];

export const HeroWallpaperModal: React.FC<HeroWallpaperModalProps> = ({
  isOpen,
  onClose,
  activeSlideIndex,
  onSelectSlide
}) => {
  const { language } = useLanguage();
  const { heroSlides, addHeroSlide, deleteHeroSlide, settings, updateSettings } = useData();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<'presets' | 'add_custom' | 'settings'>('presets');
  const [customUrl, setCustomUrl] = useState('');
  const [customTagBn, setCustomTagBn] = useState('');
  const [customTagEn, setCustomTagEn] = useState('');
  const [customTitleBn, setCustomTitleBn] = useState('');
  const [customTitleEn, setCustomTitleEn] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  if (!isOpen) return null;

  const currentOpacity = typeof settings.heroBackgroundOpacity === 'number' ? settings.heroBackgroundOpacity : 75;

  const handleOpacityChange = (val: number) => {
    updateSettings({ heroBackgroundOpacity: val });
  };

  const handleApplyPreset = (preset: typeof PRESET_HERO_WALLPAPERS[0]) => {
    // Check if preset already exists in heroSlides
    const existingIndex = heroSlides.findIndex(s => s.src === preset.src);
    if (existingIndex >= 0) {
      onSelectSlide(existingIndex);
      setSuccessToast(language === 'bn' ? 'ওয়ালপেপার সক্রিয় করা হয়েছে!' : 'Wallpaper activated!');
      setTimeout(() => setSuccessToast(''), 2000);
      return;
    }

    // Add as new hero slide and activate it
    addHeroSlide({
      type: 'photo',
      src: preset.src,
      tagEn: preset.tagEn,
      tagBn: preset.tagBn,
      titleEn: preset.titleEn,
      titleBn: preset.titleBn,
      descriptionEn: 'High-speed typing, admission forms, defense & government recruitment center in Farmgate.',
      descriptionBn: 'দ্রুত টাইপিং, ভর্তি ফরম, প্রতিরক্ষা বাহিনী ও সরকারি চাকরির আবেদন কেন্দ্র।',
      accentColor: preset.accent,
      order: heroSlides.length + 1
    });

    onSelectSlide(heroSlides.length);
    setSuccessToast(language === 'bn' ? 'নতুন ওয়ালপেপার সফলভাবে যোগ করা হয়েছে!' : 'Wallpaper added & applied!');
    setTimeout(() => setSuccessToast(''), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError(language === 'bn' ? 'অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন' : 'Please select an image file');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setUploadError(language === 'bn' ? 'ফাইল সাইজ ১২ মেগাবাইটের বেশি হওয়া যাবে না' : 'File must be under 12MB');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setCustomUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCustomWallpaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) {
      setUploadError(language === 'bn' ? 'অনুগ্রহ করে ওয়ালপেপারের লিংক দিন অথবা ছবি আপলোড করুন' : 'Provide image URL or upload photo');
      return;
    }

    addHeroSlide({
      type: 'photo',
      src: customUrl.trim(),
      tagEn: customTagEn.trim() || 'Custom Wallpaper',
      tagBn: customTagBn.trim() || 'কাস্টম ওয়ালপেপার',
      titleEn: customTitleEn.trim() || 'Saiful Enterprise Digital Center',
      titleBn: customTitleBn.trim() || 'সাইফুল এন্টারপ্রাইজ ডিজিটাল সেন্টার',
      descriptionEn: 'High-speed typing, admission forms, defense & government recruitment center in Farmgate.',
      descriptionBn: 'দ্রুত টাইপিং, ভর্তি ফরম, প্রতিরক্ষা বাহিনী ও সরকারি চাকরির আবেদন কেন্দ্র।',
      accentColor: 'emerald',
      order: heroSlides.length + 1
    });

    onSelectSlide(heroSlides.length);
    setCustomUrl('');
    setCustomTagBn('');
    setCustomTagEn('');
    setCustomTitleBn('');
    setCustomTitleEn('');
    setSuccessToast(language === 'bn' ? 'কাস্টম ওয়ালপেপার সফলভাবে যুক্ত হয়েছে!' : 'Custom wallpaper added successfully!');
    setTimeout(() => {
      setSuccessToast('');
      setActiveTab('presets');
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`border w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
          isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between transition-colors ${
          isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight flex items-center gap-2">
                <span>{language === 'bn' ? 'হিরো সেকশন ওয়ালপেপার কন্ট্রোল' : 'Hero Section Wallpaper Studio'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  HD Quality
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                {language === 'bn'
                  ? 'আপনার পছন্দের ব্যাকগ্রাউন্ড ওয়ালপেপার বেছে নিন অথবা নতুন ছবি যুক্ত করুন'
                  : 'Select preset background wallpaper or upload your own high-resolution image'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className={`flex items-center gap-2 px-5 pt-3 border-b text-xs font-semibold ${
          isDark ? 'border-neutral-800 bg-neutral-900' : 'border-slate-100 bg-white'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'এইচডি ওয়ালপেপার প্রিসেট' : 'HD Wallpaper Presets'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add_custom')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'add_custom'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নতুন ওয়ালপেপার যোগ করুন' : 'Add Custom Wallpaper'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'উজ্জ্বলতা ও ভিজিবিলিটি' : 'Vibrance & Opacity'}</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {successToast && (
          <div className="mx-5 mt-3 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Body Container */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: CURATED PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                  {language === 'bn' ? '১০টি প্রিমিয়াম ওয়ালপেপার থেকে নির্বাচন করুন:' : 'Select from 10 Curated HD Themes:'}
                </span>
                <span className={`text-[11px] ${isDark ? 'text-neutral-500' : 'text-slate-500'}`}>
                  {language === 'bn' ? 'ক্লিক করলেই হিরো সেকশনে সেট হবে' : 'Click to instantly set'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {PRESET_HERO_WALLPAPERS.map(preset => {
                  const currentSlide = heroSlides[activeSlideIndex];
                  const isCurrent = currentSlide && currentSlide.src === preset.src;

                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-sm ${
                        isCurrent
                          ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-md'
                          : isDark
                          ? 'border-neutral-800 bg-neutral-950 hover:border-emerald-500/50'
                          : 'border-slate-200 bg-slate-50 hover:border-emerald-400'
                      }`}
                    >
                      {/* Thumbnail Preview Image */}
                      <div className="relative h-28 w-full overflow-hidden bg-neutral-900">
                        <img
                          src={preset.src}
                          alt={preset.titleEn}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Category Tag */}
                        <div className="absolute top-2 left-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-emerald-300 font-bold border border-white/20">
                            {language === 'bn' ? preset.tagBn : preset.tagEn}
                          </span>
                        </div>

                        {/* Active Badge */}
                        {isCurrent && (
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-1 shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Info & Action */}
                      <div className="p-3 space-y-1">
                        <h4 className={`text-xs font-bold leading-tight line-clamp-1 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {language === 'bn' ? preset.titleBn : preset.titleEn}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            {isCurrent ? (language === 'bn' ? '✓ সক্রিয় ওয়ালপেপার' : '✓ Active Now') : (language === 'bn' ? 'প্রয়োগ করুন' : 'Apply')}
                          </span>
                          <span className={`text-[10px] uppercase font-mono ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
                            {preset.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Currently Active Slides Carousel List */}
              <div className={`mt-6 pt-5 border-t ${isDark ? 'border-neutral-800' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    {language === 'bn' ? `বর্তমান ক্যারোজেল স্লাইডসমূহ (${heroSlides.length})` : `Active Slides in Carousel (${heroSlides.length})`}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                    {language === 'bn' ? 'যেকোনোটিতে ক্লিক করে সরাসরি যান' : 'Click to jump to slide'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {heroSlides.map((slide, idx) => {
                    const isSelected = idx === activeSlideIndex;
                    return (
                      <div
                        key={slide.id || idx}
                        onClick={() => onSelectSlide(idx)}
                        className={`relative rounded-xl overflow-hidden border p-1 cursor-pointer transition-all ${
                          isSelected
                            ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-500/10'
                            : isDark
                            ? 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="h-16 rounded-lg overflow-hidden relative">
                          <img src={slide.src} alt={slide.titleEn} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30" />
                          <span className="absolute bottom-1 left-1.5 text-[10px] font-mono font-bold text-white drop-shadow">
                            #{idx + 1}
                          </span>
                        </div>
                        <p className={`text-[10px] font-medium truncate mt-1 px-1 ${
                          isDark ? 'text-neutral-300' : 'text-slate-700'
                        }`}>
                          {language === 'bn' ? slide.tagBn : slide.tagEn}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADD CUSTOM WALLPAPER */}
          {activeTab === 'add_custom' && (
            <form onSubmit={handleSaveCustomWallpaper} className="space-y-4 max-w-xl mx-auto">
              <div className={`p-4 rounded-2xl border text-xs space-y-3 ${
                isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Upload className="w-4 h-4" />
                  <span>{language === 'bn' ? '১. ফাইল আপলোড অথবা ইমেজ লিংক পেস্ট করুন' : '1. Upload Photo or Paste Image URL'}</span>
                </div>

                {/* File Drop Area */}
                <div className={`border-2 border-dashed rounded-xl p-4 text-center relative transition-colors ${
                  isDark ? 'border-neutral-700 bg-neutral-900/60 hover:border-emerald-500' : 'border-slate-300 bg-white hover:border-emerald-500'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <ImageIcon className="w-6 h-6 mx-auto mb-1 text-emerald-500" />
                  <p className={`text-xs font-semibold ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>
                    {language === 'bn' ? 'কম্পিউটার বা ফোন থেকে ছবি বাছাই করুন' : 'Choose photo from computer or phone'}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                    JPG, PNG, WebP (Ultra HD 1920x1080 recommended)
                  </p>
                </div>

                {/* Image URL Input */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    {language === 'bn' ? 'অথবা ছবির ডিরেক্ট ওয়েব লিংক দিন:' : 'Or Direct Image URL:'}
                  </label>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={e => setCustomUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:border-emerald-500 transition-colors ${
                      isDark ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* Preview if url exists */}
              {customUrl && (
                <div className={`p-3 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={`text-xs font-bold ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    {language === 'bn' ? 'ওয়ালপেপার প্রিভিউ:' : 'Wallpaper Preview:'}
                  </span>
                  <div className="relative h-40 rounded-xl overflow-hidden border border-neutral-700">
                    <img src={customUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Optional Labels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    {language === 'bn' ? 'ওয়ালপেপার ট্যাগ (বাংলা)' : 'Wallpaper Tag (Bangla)'}
                  </label>
                  <input
                    type="text"
                    value={customTagBn}
                    onChange={e => setCustomTagBn(e.target.value)}
                    placeholder="যেমন: নতুন শপ ব্যানার"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    {language === 'bn' ? 'ওয়ালপেপার ট্যাগ (English)' : 'Wallpaper Tag (English)'}
                  </label>
                  <input
                    type="text"
                    value={customTagEn}
                    onChange={e => setCustomTagEn(e.target.value)}
                    placeholder="e.g. Modern Cyber Desk"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {uploadError && (
                <p className="text-rose-500 text-xs font-semibold">{uploadError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? 'ওয়ালপেপার যুক্ত ও সক্রিয় করুন' : 'Add & Set as Wallpaper'}</span>
              </button>
            </form>
          )}

          {/* TAB 3: VIBRANCE & OPACITY SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-xl mx-auto py-2">
              <div className={`p-5 rounded-2xl border space-y-4 ${
                isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {language === 'bn' ? 'ওয়ালপেপার ভিজিবিলিটি ও ব্রাইটনেস' : 'Wallpaper Visibility & Brightness'}
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                    {language === 'bn'
                      ? 'ব্যাকগ্রাউন্ড ওয়ালপেপার কতটুকু স্পষ্ট দেখা যাবে তা নির্ধারণ করুন।'
                      : 'Control how vividly the background wallpaper shows behind text and cards.'}
                  </p>
                </div>

                {/* Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className={isDark ? 'text-neutral-400' : 'text-slate-600'}>
                      {language === 'bn' ? 'বর্তমান উজ্জ্বলতা:' : 'Active Opacity:'}
                    </span>
                    <span className="text-emerald-500 font-extrabold text-sm">{currentOpacity}%</span>
                  </div>

                  <input
                    type="range"
                    min="30"
                    max="100"
                    step="5"
                    value={currentOpacity}
                    onChange={e => handleOpacityChange(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />

                  {/* Preset Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {[
                      { label: language === 'bn' ? 'কোমল (৫০%)' : 'Subtle (50%)', val: 50 },
                      { label: language === 'bn' ? 'ভারসাম্যপূর্ণ (৭৫%)' : 'Balanced (75%)', val: 75 },
                      { label: language === 'bn' ? 'উজ্জ্বল এইচডি (৯০%)' : 'Vivid HD (90%)', val: 90 }
                    ].map(item => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => handleOpacityChange(item.val)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          currentOpacity === item.val
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : isDark
                            ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Slide Rotation Speed */}
              <div className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'bn' ? 'স্লাইড পরিবর্তনের গতি (Interval)' : 'Slide Rotation Interval'}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '20s (Fast)', val: 20 },
                    { label: '35s (Standard)', val: 35 },
                    { label: '60s (Slow / Calm)', val: 60 }
                  ].map(speed => (
                    <button
                      key={speed.val}
                      type="button"
                      onClick={() => updateSettings({ heroIntervalSeconds: speed.val })}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        (settings.heroIntervalSeconds || 35) === speed.val
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : isDark
                          ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {speed.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${
          isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <span className={isDark ? 'text-neutral-400' : 'text-slate-500'}>
            📍 Saiful Enterprise • Indira Road, Farmgate
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {language === 'bn' ? 'সম্পন্ন / বন্ধ করুন' : 'Done / Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
