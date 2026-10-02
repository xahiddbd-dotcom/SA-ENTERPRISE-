import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { User, SocialLinks } from '../../types';
import {
  Phone,
  MessageSquare,
  Mail,
  Award,
  ShieldCheck,
  Edit,
  Save,
  X,
  Globe,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Clock,
  Briefcase,
  ExternalLink
} from 'lucide-react';

import { EmployeeOfTheMonthCard } from './EmployeeOfTheMonthCard';

export const TeamSection: React.FC = () => {
  const { language } = useLanguage();
  const { staff, updateStaffMember } = useData();
  const { currentUser, isStaffOrAdmin, updateCurrentUserProfile } = useAuth();
  const { isDark } = useTheme();

  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [socialForm, setSocialForm] = useState<SocialLinks>({});
  const [skillsText, setSkillsText] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleOpenEdit = (member: User) => {
    setEditingMember({ ...member });
    setSocialForm(member.socialLinks || {});
    setSkillsText((member.skills || []).join(', '));
    setSaveSuccess(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const parsedSkills = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const updatedData: Partial<User> = {
      name: editingMember.name,
      nameBn: editingMember.nameBn,
      phone: editingMember.phone,
      email: editingMember.email,
      bio: editingMember.bio,
      bioBn: editingMember.bioBn,
      avatar: editingMember.avatar,
      shift: editingMember.shift,
      skills: parsedSkills,
      socialLinks: socialForm
    };

    updateStaffMember(editingMember.id, updatedData);

    // If current logged-in user is editing themselves
    if (currentUser && currentUser.id === editingMember.id) {
      await updateCurrentUserProfile(updatedData);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setEditingMember(null);
      setSaveSuccess(false);
    }, 1200);
  };

  return (
    <section id="team-section" className={`py-16 border-t transition-colors duration-200 relative ${
      isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-transparent border-slate-200'
    }`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
            isDark ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{language === 'bn' ? 'আমাদের মালিক ও দক্ষ কর্মী দল' : 'Owner & Specialized Team'}</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'bn' ? 'পরিচিতি ও ব্যক্তিগত যোগাযোগ' : 'Meet Our Leadership & Staff Team'}
          </h2>
          <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
            {language === 'bn'
              ? 'সাইফুল এন্টারপ্রাইজের প্রতিষ্ঠাতা ও অভিজ্ঞ অপারেটরদের সাথে সরাসরি ফোন, হোয়াটসঅ্যাপ ও সোশ্যাল মিডিয়ায় যুক্ত হোন।'
              : 'Direct hotline, WhatsApp chat, and professional profiles of Saiful Enterprise specialists.'}
          </p>
        </div>

        {/* Employee of the Month Highlight */}
        <div className="mb-12">
          <EmployeeOfTheMonthCard variant="featured" />
        </div>

        {/* Staff & Leadership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map(member => {
            const isOwner = member.role === 'super_admin' || member.role === 'admin';
            const canEdit = isStaffOrAdmin && (currentUser?.role === 'super_admin' || currentUser?.id === member.id);

            return (
              <div
                key={member.id}
                className={`rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                  isOwner
                    ? isDark
                      ? 'bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border-emerald-500/40 shadow-xl shadow-emerald-950/20'
                      : 'bg-gradient-to-b from-white via-emerald-50/30 to-white border-emerald-300 shadow-md'
                    : isDark
                    ? 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                    : 'bg-white border-slate-200 hover:border-emerald-500 shadow-sm'
                }`}
              >
                <div>
                  {/* Top Avatar & Role Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-md"
                        />
                        {isOwner && (
                          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black p-1 rounded-full shadow">
                            <Sparkles className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className={`text-base font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {language === 'bn' && member.nameBn ? member.nameBn : member.name}
                        </h3>
                        <span className={`text-[11px] font-mono block mt-0.5 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                          {member.employeeId || 'SE-LEAD'}
                        </span>
                        <div className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                          isDark
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          <Award className="w-3 h-3 text-emerald-500" />
                          <span>{member.role === 'super_admin' ? (language === 'bn' ? 'মালিক ও প্রধান নির্বাহী' : 'Founder & Lead') : member.role.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    {canEdit && (
                      <button
                        type="button"
                        id={`edit-staff-profile-${member.id}`}
                        onClick={() => handleOpenEdit(member)}
                        className={`p-2 rounded-xl transition-colors ${
                          isDark
                            ? 'bg-neutral-800 hover:bg-emerald-600 text-neutral-300 hover:text-white'
                            : 'bg-slate-100 hover:bg-emerald-600 text-slate-600 hover:text-white'
                        }`}
                        title="Edit Profile Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Bio / Description */}
                  <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-neutral-300' : 'text-slate-600'}`}>
                    {language === 'bn' && member.bioBn ? member.bioBn : (member.bio || 'Digital service specialist and store manager at Saiful Enterprise.')}
                  </p>

                  {/* Skills Pills */}
                  {member.skills && member.skills.length > 0 && (
                    <div className="mb-4">
                      <span className={`text-[10px] uppercase font-bold block mb-1.5 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                        {language === 'bn' ? 'বিশেষ দক্ষতা ও অভিজ্ঞতা:' : 'Expertise & Skills:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {member.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border ${
                              isDark
                                ? 'bg-neutral-950 border-neutral-800 text-emerald-400'
                                : 'bg-slate-50 border-slate-200 text-emerald-700 shadow-2xs'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Shift Timing */}
                  {member.shift && (
                    <div className={`flex items-center gap-1.5 text-xs mb-4 p-2.5 rounded-xl border ${
                      isDark
                        ? 'bg-neutral-950 border-neutral-850 text-neutral-400'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      <Clock className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span><strong>Shift:</strong> {member.shift}</span>
                    </div>
                  )}
                </div>

                {/* Direct Action & Social Media Links */}
                <div className={`pt-4 border-t space-y-3 ${isDark ? 'border-neutral-800' : 'border-slate-100'}`}>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${member.socialLinks?.phone || member.phone}`}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        isDark
                          ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{language === 'bn' ? 'কল করুন' : 'Call'}</span>
                    </a>

                    <a
                      href={`https://wa.me/88${member.socialLinks?.whatsapp || member.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        isDark
                          ? 'bg-emerald-950 hover:bg-emerald-900 border-emerald-500/40 text-emerald-300'
                          : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Social Handles Bar */}
                  {member.socialLinks && (
                    <div className="flex items-center justify-center gap-2 pt-1">
                      {member.socialLinks.facebook && (
                        <a
                          href={member.socialLinks.facebook.startsWith('http') ? member.socialLinks.facebook : `https://${member.socialLinks.facebook}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs transition-colors ${
                            isDark
                              ? 'bg-neutral-950 hover:bg-blue-600/20 text-neutral-400 hover:text-blue-400 border-neutral-800'
                              : 'bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border-slate-200'
                          }`}
                          title="Facebook"
                        >
                          FB
                        </a>
                      )}
                      {member.socialLinks.linkedin && (
                        <a
                          href={member.socialLinks.linkedin.startsWith('http') ? member.socialLinks.linkedin : `https://${member.socialLinks.linkedin}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs transition-colors ${
                            isDark
                              ? 'bg-neutral-950 hover:bg-sky-600/20 text-neutral-400 hover:text-sky-400 border-neutral-800'
                              : 'bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 border-slate-200'
                          }`}
                          title="LinkedIn"
                        >
                          IN
                        </a>
                      )}
                      {member.socialLinks.github && (
                        <a
                          href={member.socialLinks.github.startsWith('http') ? member.socialLinks.github : `https://${member.socialLinks.github}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs transition-colors ${
                            isDark
                              ? 'bg-neutral-950 hover:bg-purple-600/20 text-neutral-400 hover:text-purple-400 border-neutral-800'
                              : 'bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-600 border-slate-200'
                          }`}
                          title="GitHub"
                        >
                          GH
                        </a>
                      )}
                      {member.socialLinks.youtube && (
                        <a
                          href={member.socialLinks.youtube.startsWith('http') ? member.socialLinks.youtube : `https://${member.socialLinks.youtube}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs transition-colors ${
                            isDark
                              ? 'bg-neutral-950 hover:bg-rose-600/20 text-neutral-400 hover:text-rose-400 border-neutral-800'
                              : 'bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-200'
                          }`}
                          title="YouTube"
                        >
                          YT
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs transition-colors ${
                            isDark
                              ? 'bg-neutral-950 hover:bg-amber-600/20 text-neutral-400 hover:text-amber-400 border-neutral-800'
                              : 'bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-600 border-slate-200'
                          }`}
                          title="Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff / Owner Profile Editing Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`border w-full max-w-lg rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl transition-colors ${
            isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex justify-between items-center pb-3 border-b ${
              isDark ? 'border-neutral-800' : 'border-slate-100'
            }`}>
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-emerald-500" />
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'bn' ? 'প্রোফাইল ও সোশ্যাল মিডিয়া সম্পাদনা' : 'Edit Staff & Owner Profile'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                isDark ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{language === 'bn' ? 'প্রোফাইল সফলভাবে আপডেট হয়েছে!' : 'Profile updated successfully!'}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    Name (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.name || ''}
                    onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    Name (Bangla)
                  </label>
                  <input
                    type="text"
                    value={editingMember.nameBn || ''}
                    onChange={e => setEditingMember({ ...editingMember, nameBn: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.phone || ''}
                    onChange={e => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl font-mono focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                  Short Bio (English)
                </label>
                <textarea
                  rows={2}
                  value={editingMember.bio || ''}
                  onChange={e => setEditingMember({ ...editingMember, bio: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-500 ${
                    isDark ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                  Short Bio (Bangla)
                </label>
                <textarea
                  rows={2}
                  value={editingMember.bioBn || ''}
                  onChange={e => setEditingMember({ ...editingMember, bioBn: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-500 ${
                    isDark ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    Shift / Timing
                  </label>
                  <input
                    type="text"
                    value={editingMember.shift || ''}
                    placeholder="e.g. 9:00 AM - 6:00 PM"
                    onChange={e => setEditingMember({ ...editingMember, shift: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={editingMember.avatar || ''}
                    placeholder="https://..."
                    onChange={e => setEditingMember({ ...editingMember, avatar: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                  Expertise & Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skillsText}
                  placeholder="e.g. Online Admissions, Defense Recruitment, Photo Lab"
                  onChange={e => setSkillsText(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-emerald-500 ${
                    isDark ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'bn' ? 'তথ্য সংরক্ষণ করুন' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
