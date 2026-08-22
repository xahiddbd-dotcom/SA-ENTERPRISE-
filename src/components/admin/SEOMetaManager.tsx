import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { SectionSEO } from '../../types';
import {
  Globe,
  Search,
  Share2,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Smartphone,
  Monitor,
  Eye,
  FileText,
  Tag
} from 'lucide-react';

export const SEOMetaManager: React.FC = () => {
  const { language } = useLanguage();
  const { seoSettings, updateSectionSEO, resetSectionSEO, settings } = useData();

  const [activeSection, setActiveSection] = useState<string>('home');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const sections = [
    { key: 'home', labelBn: 'হোম পেজ (Home)', labelEn: 'Home Page (/)' },
    { key: 'services', labelBn: 'সকল সেবা ক্যাটালগ (Services)', labelEn: 'Services Catalog (/services)' },
    { key: 'shop', labelBn: 'পেপার ও স্টেশনারি শপ (Shop)', labelEn: 'Paper & Printing Shop (/shop)' },
    { key: 'tracker', labelBn: 'আবেদন ট্র্যাকিং (Tracker)', labelEn: 'Application Tracker (/tracker)' },
    { key: 'about', labelBn: 'আমাদের সম্পর্কে (About)', labelEn: 'About Us (/about)' },
    { key: 'contact', labelBn: 'যোগাযোগ ও লোকেশন (Contact)', labelEn: 'Contact Us (/contact)' }
  ];

  const currentSEO: SectionSEO = seoSettings[activeSection] || {
    sectionId: activeSection,
    title: `${settings.businessName} | Digital Services`,
    titleBn: `${settings.businessNameBn} | ডিজিটাল সেবা`,
    description: settings.tagline || '',
    descriptionBn: settings.taglineBn || '',
    keywords: 'Saiful Enterprise, Farmgate, Tejgaon, Indira Road',
    ogTitle: settings.businessName || '',
    ogDescription: settings.tagline || '',
    ogImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop',
    ogType: 'website',
    canonicalUrl: `https://saifulenterprise.com/${activeSection === 'home' ? '' : activeSection}`
  };

  const handleFieldChange = (field: keyof SectionSEO, value: string) => {
    updateSectionSEO(activeSection, { [field]: value });
  };

  const handleSave = () => {
    setSaveStatus(language === 'bn' ? 'মেটা ট্যাগ ও এসইও (SEO) সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' : 'SEO Meta Tags saved successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleReset = () => {
    if (window.confirm(language === 'bn' ? 'আপনি কি ডিফল্ট এসইও সেটিংসে ফিরে যেতে চান?' : 'Reset to default SEO settings for this section?')) {
      resetSectionSEO(activeSection);
      setSaveStatus(language === 'bn' ? 'ডিফল্ট এসইও সেটিংস রিস্টোর করা হয়েছে' : 'Default SEO restored');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Globe className="w-5 h-5" />
            <h3 className="font-bold text-lg text-white">
              {language === 'bn' ? 'ডাইনামিক এসইও ও মেটা ট্যাগ ম্যানেজার (Dynamic SEO & Meta CMS)' : 'Dynamic SEO & Open Graph Meta Manager'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            {language === 'bn'
              ? 'গুগল সার্চ ও সোশ্যাল মিডিয়া শেয়ারের জন্য পেজ টাইটেল, মেটা ডেসক্রিপশন, কিওয়ার্ড ও প্রিভিউ ছবি কাস্টমাইজ করুন।'
              : 'Customize Google search snippets, Open Graph social share cards, titles and meta descriptions for each page.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save SEO'}</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Section Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-neutral-950 p-2 rounded-2xl border border-neutral-800 text-xs font-semibold">
        {sections.map(sec => (
          <button
            key={sec.key}
            type="button"
            onClick={() => setActiveSection(sec.key)}
            className={`py-2.5 px-3 rounded-xl transition-all text-center leading-tight truncate ${
              activeSection === sec.key
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            {language === 'bn' ? sec.labelBn : sec.labelEn}
          </button>
        ))}
      </div>

      {/* Main Form & Live Previews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4 p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-neutral-800">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'মেটা ট্যাগ সম্পাদনা' : 'Edit Meta Tags'}</span>
          </h4>

          {/* Title Tag Bangla & English */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-300">
                  {language === 'bn' ? 'পেজ টাইটেল ট্যাগ (বাংলা)' : 'Page Title Tag (Bangla)'}
                </label>
                <span className={`text-[10px] font-mono ${(currentSEO.titleBn?.length || 0) > 60 ? 'text-amber-400' : 'text-neutral-500'}`}>
                  {currentSEO.titleBn?.length || 0} / 60 chars
                </span>
              </div>
              <input
                type="text"
                value={currentSEO.titleBn || ''}
                onChange={e => handleFieldChange('titleBn', e.target.value)}
                placeholder="যেমন: সাইফুল এন্টারপ্রাইজ | ডিজিটাল সার্ভিস..."
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-300">
                  {language === 'bn' ? 'পেজ টাইটেল ট্যাগ (English)' : 'Page Title Tag (English)'}
                </label>
                <span className={`text-[10px] font-mono ${(currentSEO.title?.length || 0) > 60 ? 'text-amber-400' : 'text-neutral-500'}`}>
                  {currentSEO.title?.length || 0} / 60 chars
                </span>
              </div>
              <input
                type="text"
                value={currentSEO.title || ''}
                onChange={e => handleFieldChange('title', e.target.value)}
                placeholder="e.g. Saiful Enterprise | Digital Service Hub"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Meta Description Bangla & English */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-300">
                  {language === 'bn' ? 'মেটা ডেসক্রিপশন (বাংলা)' : 'Meta Description (Bangla)'}
                </label>
                <span className={`text-[10px] font-mono ${(currentSEO.descriptionBn?.length || 0) > 160 ? 'text-amber-400' : 'text-neutral-500'}`}>
                  {currentSEO.descriptionBn?.length || 0} / 160 chars
                </span>
              </div>
              <textarea
                rows={2}
                value={currentSEO.descriptionBn || ''}
                onChange={e => handleFieldChange('descriptionBn', e.target.value)}
                placeholder="গুগল সার্চে প্রদর্শিত সংক্ষিপ্ত বিবরণ..."
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-300">
                  {language === 'bn' ? 'মেটা ডেসক্রিপশন (English)' : 'Meta Description (English)'}
                </label>
                <span className={`text-[10px] font-mono ${(currentSEO.description?.length || 0) > 160 ? 'text-amber-400' : 'text-neutral-500'}`}>
                  {currentSEO.description?.length || 0} / 160 chars
                </span>
              </div>
              <textarea
                rows={2}
                value={currentSEO.description || ''}
                onChange={e => handleFieldChange('description', e.target.value)}
                placeholder="Brief description shown in Google results..."
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Keywords & Canonical URL */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {language === 'bn' ? 'এসইও কিওয়ার্ডসমূহ (কমা দিয়ে আলাদা করুন)' : 'Meta Keywords (Comma separated)'}
              </label>
              <input
                type="text"
                value={currentSEO.keywords || ''}
                onChange={e => handleFieldChange('keywords', e.target.value)}
                placeholder="Saiful Enterprise, photocopy, Farmgate, Tejgaon college admission"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {language === 'bn' ? 'ক্যানোনিকাল লিংক (Canonical URL)' : 'Canonical URL'}
              </label>
              <input
                type="url"
                value={currentSEO.canonicalUrl || ''}
                onChange={e => handleFieldChange('canonicalUrl', e.target.value)}
                placeholder="https://saifulenterprise.com/"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Open Graph Social Sharing */}
          <div className="pt-2 border-t border-neutral-800 space-y-3">
            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'bn' ? 'সোশ্যাল মিডিয়া শেয়ারিং (Open Graph & WhatsApp Card)' : 'Open Graph & Social Share Config'}</span>
            </h5>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {language === 'bn' ? 'সোশ্যাল শেয়ার ব্যানার ছবি (OG Image URL)' : 'Social Share Banner Image URL'}
              </label>
              <input
                type="url"
                value={currentSEO.ogImage || ''}
                onChange={e => handleFieldChange('ogImage', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  OG Title
                </label>
                <input
                  type="text"
                  value={currentSEO.ogTitle || ''}
                  onChange={e => handleFieldChange('ogTitle', e.target.value)}
                  placeholder="Saiful Enterprise"
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  OG Description
                </label>
                <input
                  type="text"
                  value={currentSEO.ogDescription || ''}
                  onChange={e => handleFieldChange('ogDescription', e.target.value)}
                  placeholder="Best printing and digital hub"
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Google Search Result Preview */}
          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Search className="w-4 h-4" />
                <span>Google Search Snippet</span>
              </div>
              <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Google Result Card */}
            <div className={`p-4 rounded-2xl bg-white text-black font-sans shadow-md space-y-1 ${previewDevice === 'mobile' ? 'max-w-[320px] mx-auto' : ''}`}>
              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] font-bold text-white">
                  SE
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[11px] font-medium text-neutral-900">Saiful Enterprise</span>
                  <span className="text-[10px] text-neutral-500 truncate max-w-[200px]">{currentSEO.canonicalUrl || 'https://saifulenterprise.com'}</span>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-tight pt-1">
                {currentSEO.titleBn || currentSEO.title || 'Saiful Enterprise - Digital Service Hub'}
              </h3>

              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2 pt-0.5">
                {currentSEO.descriptionBn || currentSEO.description || 'Computer typing, photocopy, admission forms and online application center in Farmgate, Dhaka.'}
              </p>
            </div>
          </div>

          {/* Social Share Card Preview (Facebook / WhatsApp / LinkedIn) */}
          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs border-b border-neutral-800 pb-2">
              <Share2 className="w-4 h-4" />
              <span>Facebook & WhatsApp Preview</span>
            </div>

            <div className="rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-lg">
              {currentSEO.ogImage && (
                <div className="h-36 w-full overflow-hidden bg-neutral-900">
                  <img src={currentSEO.ogImage} alt="OG Banner" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-3 bg-neutral-900 space-y-1">
                <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider block">
                  SAIFULENTERPRISE.COM
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-1">
                  {currentSEO.ogTitle || currentSEO.titleBn || currentSEO.title || 'Saiful Enterprise'}
                </h4>
                <p className="text-[11px] text-neutral-400 line-clamp-2">
                  {currentSEO.ogDescription || currentSEO.descriptionBn || currentSEO.description || 'Fast online services, admissions & laser printing.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
