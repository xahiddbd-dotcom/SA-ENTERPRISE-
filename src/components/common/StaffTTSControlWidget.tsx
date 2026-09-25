import React, { useState } from 'react';
import { useTTSNotification, TTSAnnouncementItem } from '../../context/TTSNotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Volume2,
  VolumeX,
  Bell,
  Settings,
  X,
  Play,
  Square,
  Sparkles,
  ShoppingBag,
  Headphones,
  CheckCircle,
  Sliders,
  History,
  RotateCcw,
  AlertTriangle,
  Radio
} from 'lucide-react';

interface StaffTTSControlWidgetProps {
  variant?: 'floating' | 'embedded' | 'compact';
}

export const StaffTTSControlWidget: React.FC<StaffTTSControlWidgetProps> = ({
  variant = 'floating'
}) => {
  const { language } = useLanguage();
  const { currentUser, isStaffOrAdmin } = useAuth();
  const { assistanceRequests } = useData();
  const {
    ttsSettings,
    updateTtsSettings,
    testOrderAlert,
    testAssistanceAlert,
    recentAnnouncements,
    replayAnnouncement,
    clearAnnouncements,
    isSpeaking,
    stopSpeaking,
    audioUnlocked,
    unlockAudio
  } = useTTSNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'history' | 'queue'>('settings');

  // Count pending assistance requests
  const pendingRequests = assistanceRequests.filter(r => r.status === 'pending');

  const toggleSound = () => {
    unlockAudio();
    updateTtsSettings({ enabled: !ttsSettings.enabled });
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 rounded-xl px-2.5 py-1">
        <button
          onClick={toggleSound}
          title={ttsSettings.enabled ? 'Voice alerts ON' : 'Voice alerts MUTED'}
          className={`p-1 rounded-lg transition-colors ${
            ttsSettings.enabled ? 'text-emerald-400 hover:bg-emerald-950/60' : 'text-neutral-500 hover:bg-neutral-800'
          }`}
        >
          {ttsSettings.enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="text-[11px] font-semibold text-neutral-300 hover:text-white flex items-center gap-1"
        >
          <span>TTS Alert</span>
          {pendingRequests.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Floating Widget (Rendered for staff/admin or when active) */}
      {variant === 'floating' && (
        <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2 animate-fade-in print:hidden">
          <div className="relative group">
            <button
              onClick={() => {
                unlockAudio();
                setIsOpen(true);
              }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-full shadow-2xl backdrop-blur-md border transition-all duration-300 ${
                ttsSettings.enabled
                  ? 'bg-neutral-900/95 border-emerald-500/50 text-white hover:border-emerald-400 hover:scale-105 shadow-emerald-950/50'
                  : 'bg-neutral-900/90 border-neutral-700 text-neutral-400 hover:text-white'
              }`}
            >
              <div className="relative">
                {ttsSettings.enabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                ) : (
                  <VolumeX className="w-4 h-4 text-neutral-500" />
                )}
                {isSpeaking && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                )}
              </div>

              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold leading-none">
                    {ttsSettings.enabled ? 'Staff Voice Alert' : 'Alerts Muted'}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                    ttsSettings.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {ttsSettings.language.toUpperCase()}
                  </span>
                </div>
              </div>

              {pendingRequests.length > 0 && (
                <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold rounded-full bg-rose-600 text-white shadow-md animate-bounce">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Embedded Banner / Bar in Staff Portal & POS */}
      {variant === 'embedded' && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-900/90 border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              ttsSettings.enabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-neutral-800 border-neutral-700 text-neutral-500'
            }`}>
              {ttsSettings.enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {language === 'bn' ? 'স্টাফ টেক্সট-টু-স্পিচ ভয়েস নোটিফিকেশন' : 'Staff Text-to-Speech Voice Alerts'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  ttsSettings.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {ttsSettings.enabled
                    ? language === 'bn' ? 'চালু আছে' : 'Active'
                    : language === 'bn' ? 'বন্ধ' : 'Muted'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {language === 'bn'
                  ? `নতুন অনলাইন অর্ডার ও গ্রাহক সহায়তা অনুরোধ এলে স্বয়ংক্রিয়ভাবে কথা বলবে (${ttsSettings.language === 'bn' ? 'বাংলা' : ttsSettings.language === 'en' ? 'English' : 'দ্বিভাষিক'})`
                  : `Automated speech alerts for new customer orders and assistance requests (${ttsSettings.language.toUpperCase()})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                ttsSettings.enabled
                  ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {ttsSettings.enabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{ttsSettings.enabled ? (language === 'bn' ? 'মিউট করুন' : 'Mute Voice') : (language === 'bn' ? 'চালু করুন' : 'Enable Voice')}</span>
            </button>

            <button
              onClick={testOrderAlert}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium flex items-center gap-1 transition-colors"
              title="Test Order Announcement"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? 'অর্ডার টেস্ট' : 'Test Order'}</span>
            </button>

            <button
              onClick={testAssistanceAlert}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium flex items-center gap-1 transition-colors"
              title="Test Assistance Announcement"
            >
              <Headphones className="w-3.5 h-3.5 text-teal-400" />
              <span>{language === 'bn' ? 'সহায়তা টেস্ট' : 'Test Help'}</span>
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="TTS Audio Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Control Modal & History Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{language === 'bn' ? 'স্টাফ ভয়েস নোটিফিকেশন সিস্টেম' : 'Staff Text-To-Speech System'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                      v2.5
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {language === 'bn'
                      ? 'অর্ডার ও কাস্টমার সহায়তার জন্য রিয়েল-টাইম বাংলা ও ইংরেজি অডিও স্পিচ'
                      : 'Real-time text-to-speech engine for orders and customer queries'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-500 text-rose-300 text-xs font-bold flex items-center gap-1 animate-pulse"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-navigation tabs */}
            <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ভয়েস সেটিংস' : 'Voice Controls'}</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'history'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'অ্যালার্ট হিস্ট্রি' : 'Announcement Log'}</span>
                {recentAnnouncements.length > 0 && (
                  <span className="text-[10px] px-1.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                    {recentAnnouncements.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('queue')}
                className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'queue'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'গ্রাহক অনুরোধ কিউ' : 'Assistance Queue'}</span>
                {pendingRequests.length > 0 && (
                  <span className="text-[10px] px-1.5 rounded-full bg-rose-600 text-white font-mono font-bold">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              {activeTab === 'settings' && (
                <div className="space-y-4 text-xs">
                  {/* Master Toggles */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">
                          {language === 'bn' ? 'ভয়েস স্পিচ অ্যালার্ট' : 'Speech Voice'}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {ttsSettings.enabled ? 'Enabled' : 'Muted'}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={ttsSettings.enabled}
                        onChange={e => {
                          unlockAudio();
                          updateTtsSettings({ enabled: e.target.checked });
                        }}
                        className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">
                          {language === 'bn' ? 'মিউজিক্যাল চাইম' : 'Audio Chime'}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {ttsSettings.chimeEnabled ? 'Dual-Tone Bell' : 'Off'}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={ttsSettings.chimeEnabled}
                        onChange={e => updateTtsSettings({ chimeEnabled: e.target.checked })}
                        className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1.5">
                      {language === 'bn' ? 'ঘোষণার ভাষা (Voice Language):' : 'Announcement Language:'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'bn', label: 'বাংলা (Bengali)' },
                        { id: 'en', label: 'English' },
                        { id: 'bilingual', label: 'Bilingual (উভয়)' }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => updateTtsSettings({ language: item.id as any })}
                          className={`p-2 rounded-xl border text-center transition-all font-semibold ${
                            ttsSettings.language === item.id
                              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-300">
                        {language === 'bn' ? 'সাউন্ড ভলিউম' : 'Voice Volume'}
                      </span>
                      <span className="font-mono text-emerald-400">
                        {Math.round(ttsSettings.volume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={ttsSettings.volume}
                      onChange={e => updateTtsSettings({ volume: parseFloat(e.target.value) })}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Rate / Speed Slider */}
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-300">
                        {language === 'bn' ? 'কথা বলার গতি (Speed)' : 'Speech Rate'}
                      </span>
                      <span className="font-mono text-emerald-400">
                        {ttsSettings.rate}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.3"
                      step="0.05"
                      value={ttsSettings.rate}
                      onChange={e => updateTtsSettings({ rate: parseFloat(e.target.value) })}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Event Triggers */}
                  <div className="space-y-2">
                    <span className="block text-neutral-300 font-semibold">
                      {language === 'bn' ? 'কোন কোন ঘটনায় ভয়েস অ্যালার্ট বাজবে:' : 'Trigger Events:'}
                    </span>
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ttsSettings.announceNewOrders}
                        onChange={e => updateTtsSettings({ announceNewOrders: e.target.checked })}
                        className="w-4 h-4 accent-emerald-500 rounded"
                      />
                      <span>
                        {language === 'bn'
                          ? '🛍️ নতুন অনলাইন অর্ডার এলে ঘোষণা করুন'
                          : '🛍️ Announce when a new order is received'}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ttsSettings.announceAssistanceRequests}
                        onChange={e => updateTtsSettings({ announceAssistanceRequests: e.target.checked })}
                        className="w-4 h-4 accent-emerald-500 rounded"
                      />
                      <span>
                        {language === 'bn'
                          ? '🛎️ গ্রাহক সহায়তা অনুরোধ পাঠালে তাৎক্ষণিক ঘোষণা করুন'
                          : '🛎️ Announce when a customer requests assistance'}
                      </span>
                    </label>
                  </div>

                  {/* Test Section */}
                  <div className="pt-2 border-t border-neutral-800">
                    <span className="block text-neutral-400 font-semibold mb-2">
                      {language === 'bn' ? 'অডিও স্পিকার টেস্ট করুন:' : 'Test Audio Announcement:'}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={testOrderAlert}
                        className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <ShoppingBag className="w-4 h-4 text-emerald-400" />
                        <span>{language === 'bn' ? 'টেস্ট নতুন অর্ডার' : 'Test Order Alert'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={testAssistanceAlert}
                        className="py-2.5 px-3 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/40 text-teal-300 font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <Headphones className="w-4 h-4 text-teal-400" />
                        <span>{language === 'bn' ? 'টেস্ট সহায়তা ডাক' : 'Test Help Alert'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400 pb-1">
                    <span>{language === 'bn' ? 'সাম্প্রতিক সম্প্রচারিত অ্যালার্টসমূহ' : 'Recent Spoken Alerts'}</span>
                    {recentAnnouncements.length > 0 && (
                      <button
                        onClick={clearAnnouncements}
                        className="text-rose-400 hover:underline"
                      >
                        {language === 'bn' ? 'হিস্ট্রি মুছুন' : 'Clear Log'}
                      </button>
                    )}
                  </div>

                  {recentAnnouncements.length === 0 ? (
                    <div className="text-center py-10 text-neutral-500 text-xs">
                      {language === 'bn' ? 'এখনো কোনো অ্যালার্ট রেকর্ড নেই।' : 'No announcement history recorded yet.'}
                    </div>
                  ) : (
                    recentAnnouncements.map(ann => (
                      <div
                        key={ann.id}
                        className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                              ann.type === 'order'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-teal-500/20 text-teal-300'
                            }`}>
                              {ann.type}
                            </span>
                            <span className="font-semibold text-white truncate">
                              {language === 'bn' ? ann.titleBn : ann.title}
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              {new Date(ann.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-neutral-400 text-[11px] leading-relaxed">
                            {language === 'bn' ? ann.textBn : ann.textEn}
                          </p>
                        </div>

                        <button
                          onClick={() => replayAnnouncement(ann.id)}
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400 hover:text-emerald-300 transition-colors shrink-0"
                          title="Play Announcement Again"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'queue' && (
                <div className="space-y-3">
                  <div className="text-xs text-neutral-400">
                    {language === 'bn'
                      ? 'দোকানে আগত গ্রাহক সহায়তা অনুরোধ তালিকা'
                      : 'Customer assistance requests requiring staff attention'}
                  </div>

                  {assistanceRequests.length === 0 ? (
                    <div className="text-center py-10 text-neutral-500 text-xs">
                      {language === 'bn' ? 'কোনো সক্রিয় সহায়তা অনুরোধ নেই।' : 'No assistance requests found.'}
                    </div>
                  ) : (
                    assistanceRequests.map(req => (
                      <div
                        key={req.id}
                        className={`p-3 rounded-xl border space-y-2 text-xs transition-colors ${
                          req.status === 'pending'
                            ? 'bg-rose-950/20 border-rose-500/40'
                            : req.status === 'attending'
                            ? 'bg-amber-950/20 border-amber-500/40'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white">{req.requestNumber}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              req.status === 'pending'
                                ? 'bg-rose-500/20 text-rose-300 animate-pulse'
                                : req.status === 'attending'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-neutral-400">
                            {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div>
                          <p className="font-semibold text-white">
                            {language === 'bn' ? req.topicBn : req.topic}
                          </p>
                          <p className="text-[11px] text-neutral-300">
                            গ্রাহক: <strong>{req.customerName}</strong> {req.customerPhone ? `(${req.customerPhone})` : ''} • অবস্থান: <span className="text-emerald-400">{req.location}</span>
                          </p>
                          {req.notes && (
                            <p className="text-[11px] text-neutral-400 italic mt-0.5">
                              "{req.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Radio className={`w-3.5 h-3.5 ${ttsSettings.enabled ? 'text-emerald-400 animate-pulse' : 'text-neutral-500'}`} />
                <span>Audio Engine: {audioUnlocked ? 'Ready & Unlocked' : 'Click page to unlock'}</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
