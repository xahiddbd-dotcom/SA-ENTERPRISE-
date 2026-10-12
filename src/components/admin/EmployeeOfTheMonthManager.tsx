import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { triggerThanosSnap } from '../common/ThanosSnapEffect';
import { EmployeeOfTheMonthCard, VideoTributeModal } from '../public/EmployeeOfTheMonthCard';
import { parseVideoSource } from '../../utils/videoUtils';
import {
  Award,
  Save,
  CheckCircle2,
  Sparkles,
  User,
  Image as ImageIcon,
  MessageSquare,
  Calendar,
  Star,
  RefreshCw,
  Eye,
  Sliders,
  Check,
  Upload,
  Video,
  Youtube,
  Link,
  Play,
  ExternalLink,
  Film,
  FileVideo,
  Music,
  AlertCircle,
  Share2
} from 'lucide-react';

const AVATAR_PRESETS = [
  {
    name: 'Jahidul Islam (Original)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Saiful Islam (Founder)',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Smart Professional Male',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Modern Executive Avatar',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Tech Operator Profile',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80'
  }
];

export const EmployeeOfTheMonthManager: React.FC = () => {
  const { language } = useLanguage();
  const { settings, updateSettings, staff } = useData();

  const currentConfig = settings.employeeOfTheMonth || {
    enabled: true,
    name: 'Jahidul Islam',
    nameBn: 'জাহিদুল ইসলাম',
    role: 'Senior Graphic Designer & Master Computer Operator',
    roleBn: 'সিনিয়র গ্রাফিক ডিজাইনার ও মাস্টার কম্পিউটার অপারেটর',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    comment: 'Outstanding dedication to customer satisfaction, fast typing accuracy, and exemplary conduct during rush hours.',
    commentBn: 'গ্রাহক সেবায় অসাধারণ আন্তরিকতা, নির্ভুল ও দ্রুত কম্পিউটার টাইপিং এবং দৈনিক সর্বোচ্চ সেবার সফল নিষ্পত্তির জন্য এই মাসের সেরা কর্মী মনোনীত।',
    month: 'March 2026',
    monthBn: 'মার্চ ২০২৬',
    joinedYear: '২০২২',
    rating: 5
  };

  const [enabled, setEnabled] = useState<boolean>(currentConfig.enabled ?? true);
  const [name, setName] = useState<string>(currentConfig.name || '');
  const [nameBn, setNameBn] = useState<string>(currentConfig.nameBn || '');
  const [role, setRole] = useState<string>(currentConfig.role || '');
  const [roleBn, setRoleBn] = useState<string>(currentConfig.roleBn || '');
  const [photo, setPhoto] = useState<string>(currentConfig.photo || '');
  const [videoUrl, setVideoUrl] = useState<string>(currentConfig.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-young-man-working-with-headphones-40082-large.mp4');
  
  // Dedicated Video Source Tabs: 'youtube' | 'facebook' | 'upload' | 'preset'
  const [videoSourceTab, setVideoSourceTab] = useState<'youtube' | 'facebook' | 'upload' | 'preset'>(() => {
    const v = currentConfig.videoUrl || '';
    if (v.includes('youtube.com') || v.includes('youtu.be')) return 'youtube';
    if (v.includes('facebook.com') || v.includes('fb.watch')) return 'facebook';
    if (v.startsWith('data:') || v.startsWith('blob:')) return 'upload';
    return 'youtube';
  });

  const [youtubeInput, setYoutubeInput] = useState<string>(() => {
    const v = currentConfig.videoUrl || '';
    return (v.includes('youtube.com') || v.includes('youtu.be')) ? v : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  });

  const [facebookInput, setFacebookInput] = useState<string>(() => {
    const v = currentConfig.videoUrl || '';
    return (v.includes('facebook.com') || v.includes('fb.watch')) ? v : '';
  });

  const [uploadedFileName, setUploadedFileName] = useState<string>(currentConfig.uploadedVideoName || '');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isTestModalMuted, setIsTestModalMuted] = useState(false);

  const [comment, setComment] = useState<string>(currentConfig.comment || '');
  const [commentBn, setCommentBn] = useState<string>(currentConfig.commentBn || '');
  const [month, setMonth] = useState<string>(currentConfig.month || 'March 2026');
  const [monthBn, setMonthBn] = useState<string>(currentConfig.monthBn || 'মার্চ ২০২৬');
  const [joinedYear, setJoinedYear] = useState<string>(currentConfig.joinedYear || '২০২২');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick fill from existing Staff
  const handleSelectStaff = (staffId: string) => {
    const member = staff.find(s => s.id === staffId);
    if (!member) return;
    setName(member.name);
    setNameBn(member.nameBn || member.name);
    setRole(member.role === 'super_admin' ? 'Founder & CEO' : member.role === 'service_operator' ? 'Senior Operator' : member.role);
    setRoleBn(member.role === 'super_admin' ? 'প্রতিষ্ঠাতা ও স্বত্বাধিকারী' : 'সিনিয়র কম্পিউটার অপারেটর');
    if (member.avatar) setPhoto(member.avatar);
    setCommentBn(`${member.nameBn || member.name} এই মাসে দায়িত্বশীলতা ও নির্ভুল সেবার জন্য সেরা কর্মী হিসেবে নির্বাচিত হয়েছেন।`);
    setComment(`${member.name} has been selected as Employee of the Month for exceptional performance.`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseVideoSource(videoUrl);
    updateSettings({
      employeeOfTheMonth: {
        enabled,
        name: name.trim(),
        nameBn: nameBn.trim(),
        role: role.trim(),
        roleBn: roleBn.trim(),
        photo: photo.trim(),
        videoUrl: videoUrl.trim(),
        videoType: parsed.type,
        youtubeUrl: parsed.type === 'youtube' ? videoUrl.trim() : youtubeInput.trim(),
        facebookUrl: parsed.type === 'facebook' ? videoUrl.trim() : facebookInput.trim(),
        uploadedVideoName: uploadedFileName,
        comment: comment.trim(),
        commentBn: commentBn.trim(),
        month: month.trim(),
        monthBn: monthBn.trim(),
        joinedYear: joinedYear.trim(),
        rating: 5
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>
              {language === 'bn'
                ? 'মাসের সেরা কর্মী (Employee of the Month) নিয়ন্ত্রণ প্যানেল'
                : 'Employee of the Month Administration'}
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {language === 'bn'
              ? 'কর্মীর ছবি, নাম, পদবী এবং মূল্যায়ন মন্তব্য যুক্ত বা পরিবর্তন করুন। ছবিতে ক্লিক করলে থ্যানোস স্ন্যাপ সক্রিয় হয়।'
              : 'Showcase star employees with photo, recognition comments, and interactive Thanos Snap easter egg.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerThanosSnap}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
            title="Test Thanos Snap Effect"
          >
            <span>🫰</span>
            <span>{language === 'bn' ? 'থ্যানোস স্ন্যাপ টেস্ট' : 'Test Thanos Snap'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            {language === 'bn'
              ? 'মাসের সেরা কর্মী সেটিংস সফলভাবে সংরক্ষিত হয়েছে!'
              : 'Employee of the Month settings saved successfully!'}
          </span>
        </div>
      )}

      {/* Main Grid: Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-5 bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl">
          {/* Master Enable / Disable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div>
              <span className="text-sm font-bold text-white block">
                {language === 'bn' ? 'মাসের সেরা কর্মী প্রদর্শন (On / Off)' : 'Display Employee of the Month'}
              </span>
              <span className="text-xs text-neutral-400">
                {language === 'bn'
                  ? 'ওয়েবসাইটের টিম সেকশন ও হোমপেজে কর্মীর ছবি ও মন্তব্য প্রদর্শন চালু বা বন্ধ করুন'
                  : 'Toggle visibility on website homepage and about/team sections'}
              </span>
            </div>
            <button
              type="button"
              id="admin-eom-toggle"
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-amber-500 shadow-md shadow-amber-950' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Quick Staff Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? 'বর্তমান কর্মীদের মধ্য থেকে নির্বাচন করুন (ঐচ্ছিক)' : 'Quick Select from Staff List'}</span>
            </label>
            <select
              onChange={e => handleSelectStaff(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">-- {language === 'bn' ? 'কর্মী নির্বাচন করুন' : 'Select a team member'} --</option>
              {staff.map(member => (
                <option key={member.id} value={member.id}>
                  {member.nameBn || member.name} — {member.role}
                </option>
              ))}
            </select>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {language === 'bn' ? 'নাম (বাংলা) *' : 'Name (Bangla) *'}
              </label>
              <input
                type="text"
                required
                value={nameBn}
                onChange={e => setNameBn(e.target.value)}
                placeholder="যেমন: জাহিদুল ইসলাম"
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {language === 'bn' ? 'Name (English) *' : 'Name (English) *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Jahidul Islam"
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Role Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {language === 'bn' ? 'পদবী / দায়িত্ব (বাংলা) *' : 'Role / Designation (Bangla) *'}
              </label>
              <input
                type="text"
                required
                value={roleBn}
                onChange={e => setRoleBn(e.target.value)}
                placeholder="সিনিয়র কম্পিউটার অপারেটর"
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {language === 'bn' ? 'Role / Designation (English) *' : 'Role / Designation (English) *'}
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="Senior Computer Operator"
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Month & Tenure */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {language === 'bn' ? 'মাসের নাম (বাংলা)' : 'Month (Bangla)'}
              </label>
              <input
                type="text"
                value={monthBn}
                onChange={e => setMonthBn(e.target.value)}
                placeholder="মার্চ ২০২৬"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {language === 'bn' ? 'Month (English)' : 'Month (English)'}
              </label>
              <input
                type="text"
                value={month}
                onChange={e => setMonth(e.target.value)}
                placeholder="March 2026"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {language === 'bn' ? 'যোগদানের বছর' : 'Joined Year'}
              </label>
              <input
                type="text"
                value={joinedYear}
                onChange={e => setJoinedYear(e.target.value)}
                placeholder="২০২২"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Photo URL & Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-300">
              {language === 'bn' ? 'কর্মীর ছবির লিংক (Photo URL) *' : 'Employee Photo URL *'}
            </label>
            <input
              type="url"
              required
              value={photo}
              onChange={e => setPhoto(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-500"
            />

            {/* Quick Preset Avatars */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[10px] text-neutral-400 self-center">
                {language === 'bn' ? 'প্রিসেট ছবি:' : 'Quick Presets:'}
              </span>
              {AVATAR_PRESETS.map((ap, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPhoto(ap.url)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                    photo === ap.url
                      ? 'bg-amber-500 text-neutral-950 border-amber-400'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {ap.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Dedicated Video Settings Section: YouTube, Facebook, File Upload & Presets */}
          <div className="space-y-4 p-5 rounded-3xl bg-neutral-950/90 border-2 border-amber-500/30 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>
                      {language === 'bn'
                        ? 'কর্মীর সম্মাননা ভিডিও সেটিংস (Video Settings)'
                        : 'Employee Tribute Video Settings'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      🎬 New
                    </span>
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    {language === 'bn'
                      ? 'কর্মীর ছবিতে ক্লিক করলে পেজ ব্লার হয়ে ফুলস্ক্রিনে এই ভিডিও প্লে হবে এবং দুই পাশে রোবট শুভেচ্ছা জানাবে।'
                      : 'Plays fullscreen with blurred backdrop and dual AI robot cheering animations.'}
                  </p>
                </div>
              </div>

              {/* Instant Test Modal Trigger */}
              <button
                type="button"
                onClick={() => setIsTestModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-sky-500/20 hover:from-amber-500/30 hover:to-sky-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-amber-300" />
                <span>{language === 'bn' ? 'প্লেয়ার ও রোবট টেস্ট' : 'Test Player & Robots'}</span>
              </button>
            </div>

            {/* Source Tab Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setVideoSourceTab('youtube');
                  if (youtubeInput) setVideoUrl(youtubeInput);
                }}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  videoSourceTab === 'youtube'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Youtube className="w-4 h-4" />
                <span>YouTube</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setVideoSourceTab('facebook');
                  if (facebookInput) setVideoUrl(facebookInput);
                }}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  videoSourceTab === 'facebook'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/60'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>Facebook</span>
              </button>

              <button
                type="button"
                onClick={() => setVideoSourceTab('upload')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  videoSourceTab === 'upload'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>{language === 'bn' ? 'ফাইল আপলোড' : 'Upload Video'}</span>
              </button>

              <button
                type="button"
                onClick={() => setVideoSourceTab('preset')}
                className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  videoSourceTab === 'preset'
                    ? 'bg-amber-500 text-neutral-950 shadow-lg shadow-amber-950/60 font-black'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'bn' ? 'রেডিমেড প্রিসেট' : 'Presets'}</span>
              </button>
            </div>

            {/* TAB 1: YOUTUBE VIDEO */}
            {videoSourceTab === 'youtube' && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold text-neutral-200 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5 text-red-500" />
                      <span>{language === 'bn' ? 'ইউটিউব ভিডিও লিঙ্ক (YouTube Video Link)' : 'YouTube Video Link'}</span>
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Shorts / Standard / youtu.be সমর্থিত
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={youtubeInput}
                      onChange={e => {
                        const val = e.target.value;
                        setYoutubeInput(val);
                        setVideoUrl(val);
                      }}
                      placeholder="https://www.youtube.com/watch?v=... বা https://youtu.be/..."
                      className="w-full pl-9 pr-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-red-500"
                    />
                    <Youtube className="w-4 h-4 text-red-500 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Parsed YouTube Status & Thumbnail Preview */}
                {(() => {
                  const parsed = parseVideoSource(youtubeInput);
                  if (parsed.type === 'youtube' && parsed.youtubeId) {
                    return (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-red-950/40 border border-red-500/30">
                        <img
                          src={parsed.thumbnailUrl}
                          alt="YouTube Thumbnail"
                          className="w-20 h-14 object-cover rounded-lg border border-red-500/40 shrink-0"
                        />
                        <div className="text-xs space-y-0.5">
                          <span className="font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            {language === 'bn' ? 'সঠিক ইউটিউব ভিডিও চিহ্নিত হয়েছে!' : 'Valid YouTube Video Identified'}
                          </span>
                          <span className="text-[11px] text-neutral-300 block font-mono">
                            Video ID: <span className="text-red-300 font-bold">{parsed.youtubeId}</span>
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="p-2 text-[11px] text-amber-300/80 bg-amber-950/30 border border-amber-500/20 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{language === 'bn' ? 'ইউটিউবের যেকোনো সাধারণ ভিডিও, শর্টস বা শেয়ার লিঙ্ক দিন।' : 'Enter any standard YouTube, Shorts, or youtu.be link.'}</span>
                    </div>
                  );
                })()}

                {/* Quick Examples */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-neutral-400">{language === 'bn' ? 'দ্রুত ডেমো লিঙ্ক:' : 'Quick Demo Links:'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const demo = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
                      setYoutubeInput(demo);
                      setVideoUrl(demo);
                    }}
                    className="px-2 py-0.5 rounded text-[10px] bg-red-900/40 text-red-300 border border-red-500/30 hover:bg-red-800/40"
                  >
                    Demo 1 (Global Hit)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const demo = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';
                      setYoutubeInput(demo);
                      setVideoUrl(demo);
                    }}
                    className="px-2 py-0.5 rounded text-[10px] bg-red-900/40 text-red-300 border border-red-500/30 hover:bg-red-800/40"
                  >
                    Demo 2 (YouTube Classic)
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: FACEBOOK VIDEO */}
            {videoSourceTab === 'facebook' && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold text-neutral-200 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>{language === 'bn' ? 'ফেসবুক ভিডিও লিঙ্ক (Facebook Video Link)' : 'Facebook Video Link'}</span>
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      fb.watch / facebook.com
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={facebookInput}
                      onChange={e => {
                        const val = e.target.value;
                        setFacebookInput(val);
                        setVideoUrl(val);
                      }}
                      placeholder="https://www.facebook.com/.../videos/... বা https://fb.watch/..."
                      className="w-full pl-9 pr-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                    <Share2 className="w-4 h-4 text-blue-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200 space-y-1">
                  <span className="font-bold block text-blue-300">
                    💡 {language === 'bn' ? 'ফেসবুক লিঙ্ক কীভাবে পাবেন?' : 'How to get Facebook video link?'}
                  </span>
                  <p className="text-neutral-300 leading-relaxed text-[11px]">
                    {language === 'bn'
                      ? 'ফেসবুকে ভিডিওটি ওপেন করে "Share" বাটনে ক্লিক করুন, এরপর "Copy Link" নির্বাচন করে এখানে পেস্ট করুন।'
                      : 'Open the video on Facebook, click Share -> Copy Link, and paste it here. Public videos play automatically.'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: FILE UPLOAD */}
            {videoSourceTab === 'upload' && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 animate-in fade-in">
                <label className="block text-xs font-semibold text-neutral-200">
                  {language === 'bn' ? 'কম্পিউটার বা মোবাইল থেকে ভিডিও আপলোড করুন' : 'Upload Video from Computer or Phone'}
                </label>

                {/* Drag & Drop Upload Zone */}
                <label className="relative border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 bg-neutral-950/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group hover:bg-neutral-900">
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 80 * 1024 * 1024) {
                          alert(language === 'bn' ? 'ভিডিও ফাইল সাইজ ৮০MB এর কম হতে হবে।' : 'File size must be under 80MB.');
                          return;
                        }
                        setUploadedFileName(file.name);
                        const reader = new FileReader();
                        reader.onload = ev => {
                          const result = ev.target?.result as string;
                          if (result) {
                            setVideoUrl(result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-center space-y-0.5">
                    <span className="text-xs font-bold text-white block">
                      {uploadedFileName ? `✅ নির্বাচিত: ${uploadedFileName}` : (language === 'bn' ? 'ভিডিও ফাইল নির্বাচন করতে ক্লিক করুন' : 'Click to select video file')}
                    </span>
                    <span className="text-[10px] text-neutral-400 block">
                      MP4, WebM, MOV ফরম্যাট সমর্থিত (সর্বোচ্চ ৮০MB)
                    </span>
                  </div>
                </label>

                {uploadedFileName && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <FileVideo className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold truncate max-w-xs">{uploadedFileName}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Ready
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: CURATED PRESETS */}
            {videoSourceTab === 'preset' && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 animate-in fade-in">
                <span className="text-xs font-semibold text-neutral-200 block">
                  {language === 'bn' ? 'রেডিমেড প্রফেশনাল সম্মাননা ভিডিও প্রিসেট:' : 'Curated Professional Tribute Video Presets:'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      title: 'Workstation Focus & Headphones',
                      titleBn: 'কম্পিউটার ওয়ার্কস্টেশন ও হেডফোন ফোকাস',
                      url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-working-with-headphones-40082-large.mp4',
                      tag: 'Best Operator'
                    },
                    {
                      title: 'Speed Typing & Keyboards',
                      titleBn: 'দ্রুত টাইপিং ও কিবোর্ড একিউরেসি',
                      url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-41221-large.mp4',
                      tag: 'Master Typing'
                    },
                    {
                      title: 'Digital Graphic Design & Creative',
                      titleBn: 'গ্রাফিক ডিজাইন ও ক্রিয়েটিভ স্কিল',
                      url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-996-large.mp4',
                      tag: 'Designer'
                    },
                    {
                      title: 'Customer Service & Desk Support',
                      titleBn: 'কাস্টমার সার্ভিস ও আন্তরিক সেবা',
                      url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-42984-large.mp4',
                      tag: 'Customer Star'
                    }
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => setVideoUrl(p.url)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        videoUrl === p.url
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="text-left space-y-0.5">
                        <span className="text-xs font-bold block">{language === 'bn' ? p.titleBn : p.title}</span>
                        <span className="text-[10px] text-amber-400 font-mono">🏷️ {p.tag}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        videoUrl === p.url ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {videoUrl === p.url ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Play className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Status Bar & Live Test Trigger */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-neutral-300">
                  {language === 'bn' ? 'বর্তমান সোর্স:' : 'Active Video:'}{' '}
                  <span className="font-bold text-amber-300 font-mono">
                    {(() => {
                      const p = parseVideoSource(videoUrl);
                      if (p.type === 'youtube') return 'YouTube Embed';
                      if (p.type === 'facebook') return 'Facebook Video Embed';
                      if (p.type === 'upload') return 'Uploaded Local File';
                      return 'Direct HTML5 MP4';
                    })()}
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsTestModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-neutral-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-950 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-neutral-950" />
                <span>{language === 'bn' ? '🎬 ফুলস্ক্রিন প্লেয়ার ও রোবট টেস্ট' : '🎬 Test Player & AI Robots'}</span>
              </button>
            </div>
          </div>

          {/* Comments & Remarks (তার ব্যাপারে মন্তব্য) */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {language === 'bn' ? 'কর্মীর ব্যাপারে প্রশংসা ও মন্তব্য (বাংলা) *' : 'Appreciation Comments (Bangla) *'}
              </label>
              <textarea
                required
                rows={3}
                value={commentBn}
                onChange={e => setCommentBn(e.target.value)}
                placeholder="গ্রাহক সেবায় অসাধারণ আন্তরিকতা, নির্ভুল ও দ্রুত কম্পিউটার টাইপিং..."
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {language === 'bn' ? 'Appreciation Comments (English) *' : 'Appreciation Comments (English) *'}
              </label>
              <textarea
                required
                rows={2}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Outstanding dedication to customer satisfaction..."
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
            <span className="text-[11px] text-neutral-400">
              {language === 'bn' ? 'সেভ করার সাথে সাথে ওয়েবসাইটে প্রদর্শিত হবে।' : 'Updates take effect immediately.'}
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-950 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'bn' ? 'সেটিংস সেভ করুন' : 'Save Employee Details'}</span>
            </button>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'লাইভ প্রিভিউ (Live Card Preview)' : 'Live Card Preview'}</span>
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {enabled ? (language === 'bn' ? 'ওয়েবসাইটে চালু' : 'Enabled') : (language === 'bn' ? 'ওয়েবসাইটে বন্ধ' : 'Disabled')}
              </span>
            </div>

            {/* Render Preview Card */}
            <div className="scale-95 origin-top">
              <EmployeeOfTheMonthCard variant="featured" />
            </div>

            {/* Thanos Easter Egg Info Box */}
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs space-y-1.5 text-amber-200">
              <div className="flex items-center gap-1.5 font-bold">
                <span>🫰</span>
                <span>{language === 'bn' ? 'থ্যানোস স্ন্যাপ ফিচার তথ্য:' : 'Thanos Snap Feature Info:'}</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                {language === 'bn'
                  ? 'যেকোনো ব্যবহারকারী কর্মীর ছবিতে ক্লিক করলেই পুরো ওয়েবসাইটের উপাদানগুলো থ্যানোসের চুটকির মতো ধূলিকণায় রূপ নিয়ে মিলিয়ে যাবে এবং অডিও বাজবে।'
                  : 'Clicking the photo triggers the full Thanos Snap effect, turning page elements into cosmic ash with sound, plus a Time Stone restore button!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Live Fullscreen Video & AI Robots Test Modal */}
      {isTestModalOpen && (
        <VideoTributeModal
          isOpen={isTestModalOpen}
          onClose={() => setIsTestModalOpen(false)}
          videoUrl={videoUrl}
          name={name || 'কর্মীর নাম'}
          role={role || 'পদবী'}
          month={month || 'মার্চ ২০২৬'}
          comment={comment || commentBn || 'অসাধারণ পারফরম্যান্স ও গ্রাহক সেবা'}
          isMuted={isTestModalMuted}
          setIsMuted={setIsTestModalMuted}
          language={language}
        />
      )}
    </div>
  );
};
