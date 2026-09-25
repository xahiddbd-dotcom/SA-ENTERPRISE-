import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { triggerThanosSnap } from '../common/ThanosSnapEffect';
import { EmployeeOfTheMonthCard } from '../public/EmployeeOfTheMonthCard';
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
  Check
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
    updateSettings({
      employeeOfTheMonth: {
        enabled,
        name: name.trim(),
        nameBn: nameBn.trim(),
        role: role.trim(),
        roleBn: roleBn.trim(),
        photo: photo.trim(),
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
    </div>
  );
};
