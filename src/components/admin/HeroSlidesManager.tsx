import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { HeroSlide } from '../../types';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
  MoveUp,
  MoveDown,
  Layers
} from 'lucide-react';

export const HeroSlidesManager: React.FC = () => {
  const { language } = useLanguage();
  const { heroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide, settings, updateSettings } = useData();

  const [isAdding, setIsAdding] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [previewSlide, setPreviewSlide] = useState<HeroSlide | null>(null);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<HeroSlide>>({
    type: 'photo',
    src: '',
    tagBn: '',
    tagEn: '',
    titleBn: '',
    titleEn: '',
    descriptionBn: '',
    descriptionEn: '',
    accentColor: 'emerald',
    order: (heroSlides?.length || 0) + 1
  });

  const intervalSeconds = settings.heroIntervalSeconds || 35;

  const handleIntervalChange = (val: number) => {
    updateSettings({ heroIntervalSeconds: val });
    showNotification(language === 'bn' ? `ছবি পরিবর্তনের সময় ${val} সেকেন্ড সেট করা হয়েছে` : `Rotation interval set to ${val} seconds`);
  };

  const showNotification = (msg: string) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const handleOpenAdd = () => {
    setFormData({
      type: 'photo',
      src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1920&auto=format&fit=crop',
      tagBn: 'ডিজিটাল সার্ভিস কাউন্টার',
      tagEn: 'Digital Service Counter',
      titleBn: 'কম্পিউটার ও অনলাইন সেবা কেন্দ্র',
      titleEn: 'Computer & Online Service Center',
      descriptionBn: 'দ্রুত টাইপিং, ভর্তি ফরম ও সরকারি চাকরির আবেদন কেন্দ্র।',
      descriptionEn: 'Fast online application and high-speed laser printing.',
      accentColor: 'emerald',
      order: (heroSlides?.length || 0) + 1
    });
    setEditingSlide(null);
    setIsAdding(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({ ...slide });
    setIsAdding(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.src) {
      alert(language === 'bn' ? 'ছবির লিংক (Image URL) দেওয়া আবশ্যক' : 'Image URL is required');
      return;
    }

    if (editingSlide) {
      updateHeroSlide(editingSlide.id, formData);
      showNotification(language === 'bn' ? 'ছবি ও তথ্য সফলভাবে আপডেট হয়েছে!' : 'Slide updated successfully!');
    } else {
      addHeroSlide(formData as Omit<HeroSlide, 'id'>);
      showNotification(language === 'bn' ? 'নতুন ব্যাকগ্রাউন্ড ছবি সফলভাবে যুক্ত হয়েছে!' : 'New background slide added!');
    }

    setIsAdding(false);
    setEditingSlide(null);
  };

  const handleDelete = (id: string, title?: string) => {
    if (heroSlides.length <= 1) {
      alert(language === 'bn' ? 'কমপক্ষে একটি ব্যাকগ্রাউন্ড ছবি থাকতে হবে!' : 'At least one slide must remain!');
      return;
    }

    if (window.confirm(language === 'bn' ? `আপনি কি "${title || 'এই ছবি'}" টি মুছে ফেলতে চান?` : 'Are you sure you want to delete this slide?')) {
      deleteHeroSlide(id);
      showNotification(language === 'bn' ? 'ছবিটি সফলভাবে মুছে ফেলা হয়েছে!' : 'Slide deleted successfully!');
    }
  };

  // Curated Preset Background Photos for quick pick
  const presetPhotos = [
    {
      title: 'Modern Digital Service Office',
      url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1920&auto=format&fit=crop',
      tagBn: 'ডিজিটাল কাউন্টার',
      tagEn: 'Digital Counter'
    },
    {
      title: 'Laser Printing & Photocopy Machine',
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1920&auto=format&fit=crop',
      tagBn: 'কমার্শিয়াল প্রিন্ট',
      tagEn: 'Commercial Print'
    },
    {
      title: 'Students & College Portal',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop',
      tagBn: 'কলেজ ভর্তি পোর্টাল',
      tagEn: 'College Portal'
    },
    {
      title: 'Paper Reams & Stationery Stock',
      url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1920&auto=format&fit=crop',
      tagBn: 'পেপার ও স্টেশনারি',
      tagEn: 'Paper Depot'
    },
    {
      title: 'Instant Studio & Passport Camera',
      url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1920&auto=format&fit=crop',
      tagBn: 'পাসপোর্ট ছবি স্টুডিও',
      tagEn: 'Studio Photo'
    },
    {
      title: 'Creative Technology & Design Center',
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop',
      tagBn: 'কম্পিউটার টাইপিং ও ডিজাইন',
      tagEn: 'Typing & Design'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <ImageIcon className="w-5 h-5" />
            <h3 className="font-bold text-lg text-white">
              {language === 'bn' ? 'হিরো সেকশন ব্যাকগ্রাউন্ড ছবি ও স্লাইডার পরিচালনা' : 'Hero Section Background Images CMS'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            {language === 'bn'
              ? 'হোমপেজের মূল ব্যানারে ৩০-৪৫ সেকেন্ড পর পর ব্যাকগ্রাউন্ডে ছবি পরিবর্তন হবে। এখান থেকে ছবি যুক্ত ও মুছে ফেলতে পারবেন।'
              : 'Hero banner background automatically cycles photos every 30-45 seconds. Add, edit or delete background slides below.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? '+ নতুন ছবি যুক্ত করুন' : '+ Add New Photo Slide'}</span>
        </button>
      </div>

      {saveNotification && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* Slide Interval Timer Control (30-45s) */}
      <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                {language === 'bn' ? 'ছবি পরিবর্তনের সময়সীমা (Slide Duration)' : 'Slide Rotation Interval (Seconds)'}
              </h4>
              <span className="text-[11px] text-neutral-400">
                {language === 'bn' ? 'গ্রাহকের পছন্দ অনুযায়ী ৩০ থেকে ৪৫ সেকেন্ডের মধ্যে নির্বাচন করুন' : 'User requested interval between 30 to 45 seconds'}
              </span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2">
            {[30, 35, 40, 45].map(sec => (
              <button
                key={sec}
                type="button"
                onClick={() => handleIntervalChange(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                  intervalSeconds === sec
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Range Slider */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-neutral-500">15s</span>
          <input
            type="range"
            min="15"
            max="90"
            step="5"
            value={intervalSeconds}
            onChange={e => handleIntervalChange(parseInt(e.target.value, 10))}
            className="flex-1 accent-emerald-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
          />
          <span className="text-xs font-mono text-neutral-500">90s</span>
          <span className="px-3 py-1 bg-emerald-950 border border-emerald-500/40 rounded-xl text-xs font-mono font-bold text-emerald-300 min-w-[55px] text-center">
            {intervalSeconds}s
          </span>
        </div>
      </div>

      {/* List of Active Slides */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
          <span>{language === 'bn' ? `মোট স্লাইড: ${heroSlides.length} টি` : `Total Slides: ${heroSlides.length}`}</span>
          <span>{language === 'bn' ? 'ড্র্যাগ বা বোতাম চেপে ক্রম পরিবর্তন করতে পারেন' : 'Active slides cycling on Hero'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id || index}
              className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between gap-3 shadow-lg group relative overflow-hidden"
            >
              {/* Background Thumbnail Preview */}
              <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800">
                <img
                  src={slide.src}
                  alt={slide.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                
                {/* Slide Index Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-neutral-700 text-xs font-mono text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>#{index + 1}</span>
                </div>

                {/* Accent Color Badge */}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-neutral-900/90 backdrop-blur-md border border-neutral-700 text-[11px] font-semibold text-emerald-300">
                  {slide.tagBn || slide.tagEn || 'Slide'}
                </div>

                {/* Title & Desc Preview */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-1 drop-shadow-md">
                    {language === 'bn' ? (slide.titleBn || slide.titleEn) : (slide.titleEn || slide.titleBn)}
                  </h4>
                  <p className="text-[11px] text-neutral-300 line-clamp-1 drop-shadow-sm">
                    {language === 'bn' ? (slide.descriptionBn || slide.descriptionEn) : (slide.descriptionEn || slide.descriptionBn)}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80">
                <a
                  href={slide.src}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-neutral-400 hover:text-emerald-400 flex items-center gap-1 font-mono truncate max-w-[180px]"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="truncate">{slide.src}</span>
                </a>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(slide)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-colors"
                    title="Edit Slide Information"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(slide.id, slide.titleBn || slide.titleEn)}
                    className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-rose-100 border border-rose-800/40 transition-colors"
                    title="Delete this slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preset Library Quick Pick */}
      <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{language === 'bn' ? 'প্রি-সেট ছবির গ্যালারি (১-ক্লিকে যুক্ত করুন)' : 'Preset Photo Gallery (1-Click Add)'}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {presetPhotos.map((photo, i) => (
            <div
              key={i}
              className="group relative rounded-2xl overflow-hidden border border-neutral-800 hover:border-emerald-500 bg-neutral-950 cursor-pointer transition-all flex flex-col"
              onClick={() => {
                addHeroSlide({
                  type: 'photo',
                  src: photo.url,
                  tagBn: photo.tagBn,
                  tagEn: photo.tagEn,
                  titleBn: photo.title,
                  titleEn: photo.title,
                  descriptionBn: 'সাইফুল এন্টারপ্রাইজ ডিজিটাল কাউন্টার ও প্রিন্টিং সেবা।',
                  descriptionEn: 'High speed digital printing & online services in Farmgate.',
                  accentColor: 'emerald',
                  order: heroSlides.length + 1
                });
                showNotification(language === 'bn' ? `"${photo.tagBn}" সফলভাবে যুক্ত হয়েছে!` : `"${photo.tagEn}" added!`);
              }}
            >
              <img src={photo.url} alt={photo.title} className="h-24 w-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="p-2 bg-neutral-950/90 text-center">
                <span className="text-[10px] font-bold text-neutral-300 group-hover:text-emerald-400 block truncate">
                  {language === 'bn' ? photo.tagBn : photo.tagEn}
                </span>
                <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">
                  + {language === 'bn' ? 'যুক্ত করুন' : 'Add'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-white">
                {editingSlide 
                  ? (language === 'bn' ? 'স্লাইড তথ্য সম্পাদনা করুন' : 'Edit Slide Details')
                  : (language === 'bn' ? 'নতুন ব্যাকগ্রাউন্ড ছবি যুক্ত করুন' : 'Add New Hero Background Photo')}
              </h3>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
              {/* Image URL with live preview */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {language === 'bn' ? 'ছবির লিংক (Image URL / Unsplash / Direct link) *' : 'Image URL *'}
                </label>
                <input
                  type="url"
                  required
                  value={formData.src}
                  onChange={e => setFormData({ ...formData, src: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {formData.src && (
                <div className="h-32 w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                  <img src={formData.src} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'ট্যাগ (বাংলা)' : 'Tag (Bangla)'}
                  </label>
                  <input
                    type="text"
                    value={formData.tagBn}
                    onChange={e => setFormData({ ...formData, tagBn: e.target.value })}
                    placeholder="যেমন: লাইভ ডিজিটাল কাউন্টার"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'ট্যাগ (English)' : 'Tag (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.tagEn}
                    onChange={e => setFormData({ ...formData, tagEn: e.target.value })}
                    placeholder="e.g. Live Counter"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'ক্যাপশন টাইটেল (বাংলা)' : 'Title (Bangla)'}
                  </label>
                  <input
                    type="text"
                    value={formData.titleBn}
                    onChange={e => setFormData({ ...formData, titleBn: e.target.value })}
                    placeholder="যেমন: কম্পিউটার ও অনলাইন সার্ভিসেস"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'ক্যাপশন টাইটেল (English)' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="e.g. Computer & Online Services"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'সংক্ষিপ্ত বিবরণ (বাংলা)' : 'Description (Bangla)'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionBn}
                    onChange={e => setFormData({ ...formData, descriptionBn: e.target.value })}
                    placeholder="দ্রুত টাইপিং, ভর্তি ফরম ও আবেদন..."
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {language === 'bn' ? 'সংক্ষিপ্ত বিবরণ (English)' : 'Description (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionEn}
                    onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Fast typing, admissions and forms..."
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950"
                >
                  {editingSlide 
                    ? (language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes')
                    : (language === 'bn' ? 'যুক্ত করুন' : 'Add Slide')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
