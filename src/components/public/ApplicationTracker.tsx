import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { Application, ApplicationStatus } from '../../types';
import {
  Search,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Phone,
  User,
  Calendar,
  Layers,
  ArrowRight,
  Printer,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  FileText,
  BadgePercent,
  X,
  History,
  Share2,
  Copy,
  Check,
  Globe2,
  LockOpen
} from 'lucide-react';

interface ApplicationTrackerProps {
  initialSearchId?: string;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ initialSearchId }) => {
  const { language } = useLanguage();
  const { applications, settings } = useData();

  const [query, setQuery] = useState(initialSearchId || '');
  const [matchedApplication, setMatchedApplication] = useState<Application | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Check URL params on mount or prop update for instant direct no-login tracking link
  useEffect(() => {
    let targetId = initialSearchId;
    if (!targetId && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      targetId = params.get('track') || params.get('tracking') || params.get('id') || params.get('app') || '';
    }

    if (targetId) {
      setQuery(targetId);
      const found = applications.find(
        a => a.applicationNumber.toLowerCase() === targetId!.toLowerCase() ||
             a.applicantPhone.includes(targetId!)
      );
      if (found) {
        setMatchedApplication(found);
        setHasSearched(true);
      }
    }
  }, [initialSearchId, applications]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    setHasSearched(true);
    const found = applications.find(
      a => a.applicationNumber.toLowerCase() === clean ||
           a.applicantPhone.toLowerCase().includes(clean) ||
           a.applicantName.toLowerCase().includes(clean) ||
           (a.applicantEmail && a.applicantEmail.toLowerCase().includes(clean))
    );
    setMatchedApplication(found || null);
  };

  const handleCopyShareLink = (appNumber: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/?track=${encodeURIComponent(appNumber)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const steps: { key: ApplicationStatus; labelBn: string; labelEn: string; descBn: string; descEn: string }[] = [
    {
      key: 'new',
      labelBn: 'আবেদন গ্রহণ',
      labelEn: 'Received',
      descBn: 'আবেদন নথিভুক্ত ও সিস্টেমে অন্তর্ভুক্ত',
      descEn: 'Application logged in database'
    },
    {
      key: 'processing',
      labelBn: 'যাচাই ও প্রসেসিং',
      labelEn: 'Processing',
      descBn: 'অপারেটর দ্বারা ফাইল ও ডাটা ভেরিফিকেশন',
      descEn: 'Verification by desk specialist'
    },
    {
      key: 'submitted',
      labelBn: 'পোর্টালে দাখিল',
      labelEn: 'Submitted',
      descBn: 'অফিসিয়াল সার্ভারে অনলাইন সাবমিশন সম্পন্ন',
      descEn: 'Portal gateway upload complete'
    },
    {
      key: 'completed',
      labelBn: 'কাজ সম্পন্ন',
      labelEn: 'Ready / Done',
      descBn: 'কনফার্মেশন স্লিপ বা সনদ ডাউনলোড প্রস্তুত',
      descEn: 'Slip/Doc generated & ready'
    },
    {
      key: 'delivered',
      labelBn: 'ডেলিভারি',
      labelEn: 'Delivered',
      descBn: 'গ্রাহককে প্রিন্ট বা ফাইল হস্তান্তর সম্পন্ন',
      descEn: 'Delivered to customer'
    }
  ];

  const getStepIndex = (status: ApplicationStatus) => {
    switch (status) {
      case 'new': return 0;
      case 'processing': return 1;
      case 'submitted': return 2;
      case 'completed': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
          labelBn: 'কাজ সম্পন্ন (Ready)',
          labelEn: 'Completed'
        };
      case 'delivered':
        return {
          bg: 'bg-teal-500/15 text-teal-300 border-teal-500/40',
          labelBn: 'ডেলিভারি সম্পন্ন',
          labelEn: 'Delivered'
        };
      case 'submitted':
        return {
          bg: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
          labelBn: 'পোর্টালে দাখিল সম্পন্ন',
          labelEn: 'Submitted to Portal'
        };
      case 'processing':
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
          labelBn: 'প্রক্রিয়াধীন রয়েছে',
          labelEn: 'In Progress'
        };
      case 'cancelled':
        return {
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
          labelBn: 'আবেদন স্থগিত / বাতিল',
          labelEn: 'Cancelled'
        };
      default:
        return {
          bg: 'bg-neutral-800 text-neutral-300 border-neutral-700',
          labelBn: 'নতুন আবেদন (Received)',
          labelEn: 'Received'
        };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="application-tracker-section" className="py-12 sm:py-16 bg-neutral-950 text-neutral-100">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-8 sm:mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'স্মার্ট অনলাইন আবেদন ট্র্যাকিং' : 'Smart Application Live Tracker'}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <LockOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>{language === 'bn' ? 'উন্মুক্ত ট্র্যাকিং • নো-লগইন' : 'Public Access • No Login Required'}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {language === 'bn' ? 'আবেদনের বর্তমান অবস্থা ও হিস্টোরি জানুন' : 'Track Your Application & History'}
          </h2>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {language === 'bn'
              ? 'আপনার আবেদন ট্র্যাকিং আইডি (যেমন: APP-2026-0001) দিয়ে লগইন ছাড়াই যেকোনো সময় তাৎক্ষণিক প্রতিটি ধাপের লাইভ অগ্রগতি, ভেরিফিকেশন ও ডেলিভারি স্লিপ দেখুন।'
              : 'Public, no-login access: Enter your Tracking ID to view real-time timeline logs, specialist updates, and confirmation slips.'}
          </p>
        </div>

        {/* Search Bar - High Contrast & Mobile Friendly */}
        <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto">
          <div className="relative flex items-center bg-neutral-900 border-2 border-neutral-800 focus-within:border-emerald-500 rounded-2xl p-1.5 sm:p-2 shadow-2xl transition-all">
            <Search className="w-5 h-5 text-neutral-400 ml-3 shrink-0" />
            <input
              type="text"
              id="app-tracker-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={language === 'bn' ? 'আবেদন আইডি (APP-2026-0001) বা ফোন নম্বর দিন...' : 'Enter App ID (APP-2026-0001) or Phone...'}
              className="w-full bg-transparent px-3 py-2 text-xs sm:text-base text-white placeholder:text-neutral-500 focus:outline-none font-mono"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setMatchedApplication(null); setHasSearched(false); }}
                className="p-1 text-neutral-400 hover:text-white mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              id="app-tracker-submit-btn"
              className="px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-lg shadow-emerald-950 transition-all active:scale-95"
            >
              {language === 'bn' ? 'অনুসন্ধান' : 'Track Now'}
            </button>
          </div>

          {/* Quick Demo Selector Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-neutral-400">
            <span className="text-[11px] text-neutral-500">{language === 'bn' ? 'টেস্ট আইডি:' : 'Try Demo ID:'}</span>
            {applications.slice(0, 3).map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  setQuery(app.applicationNumber);
                  setHasSearched(true);
                  setMatchedApplication(app);
                }}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/40 text-emerald-400 font-mono text-[11px] transition-colors"
              >
                {app.applicationNumber}
              </button>
            ))}
          </div>
        </form>

        {/* Results Box */}
        {hasSearched && (
          matchedApplication ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-8 animate-in fade-in duration-300">
              {/* Top Summary Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-neutral-400 uppercase font-mono tracking-wider">
                      {language === 'bn' ? 'আবেদন ট্র্যাকিং নম্বর' : 'Application Tracking Number'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {matchedApplication.category}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                    {matchedApplication.applicationNumber}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Badge */}
                  <span className={`text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider border shadow-sm ${getStatusBadge(matchedApplication.status).bg}`}>
                    {language === 'bn' ? getStatusBadge(matchedApplication.status).labelBn : getStatusBadge(matchedApplication.status).labelEn}
                  </span>

                  {/* Payment Status Badge */}
                  <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase border ${
                    matchedApplication.paymentStatus === 'paid'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-600/40'
                      : 'bg-amber-950 text-amber-300 border-amber-600/40'
                  }`}>
                    {matchedApplication.paymentStatus === 'paid' ? 'Fee Paid (৳' + matchedApplication.paidAmount + ')' : 'Payment Pending'}
                  </span>

                  {/* Copy Shareable Link Button */}
                  <button
                    type="button"
                    onClick={() => handleCopyShareLink(matchedApplication.applicationNumber)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-teal-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-teal-500/30"
                    title="Copy Direct Tracking Link"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-teal-400" />}
                    <span>{copiedLink ? (language === 'bn' ? 'লিঙ্ক কপি হয়েছে!' : 'Link Copied!') : (language === 'bn' ? 'ট্র্যাকিং লিঙ্ক' : 'Copy Link')}</span>
                  </button>

                  {/* Print Slip Button */}
                  <button
                    onClick={() => setShowSlipModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700"
                    title="View & Print Slip"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === 'bn' ? 'স্লিপ দেখুন' : 'Slip'}</span>
                  </button>
                </div>
              </div>

              {/* Progress Stepper (Responsive) */}
              <div className="py-2">
                <div className="grid grid-cols-5 gap-1 sm:gap-3 relative">
                  {/* Horizontal Connection Bar */}
                  <div className="absolute top-4 left-4 right-4 h-1 bg-neutral-800 -z-0 hidden sm:block">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500 rounded"
                      style={{
                        width: `${(Math.max(0, getStepIndex(matchedApplication.status)) / 4) * 100}%`
                      }}
                    />
                  </div>

                  {steps.map((step, idx) => {
                    const activeIdx = getStepIndex(matchedApplication.status);
                    const isDone = activeIdx >= 0 && idx <= activeIdx;
                    const isCurrent = idx === activeIdx;

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center relative z-10 space-y-1.5">
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                            isDone
                              ? 'bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/30'
                              : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                          } ${isCurrent ? 'ring-4 ring-emerald-500/30 scale-110' : ''}`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : idx + 1}
                        </div>
                        <span className={`text-[10px] sm:text-xs font-bold block ${
                          isDone ? 'text-white' : 'text-neutral-500'
                        }`}>
                          {language === 'bn' ? step.labelBn : step.labelEn}
                        </span>
                        <span className="text-[9px] text-neutral-500 hidden md:block max-w-[100px] leading-tight">
                          {language === 'bn' ? step.descBn : step.descEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Service & Applicant Details Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-neutral-950 p-4 sm:p-5 rounded-2xl border border-neutral-800 text-xs">
                <div className="space-y-1">
                  <span className="text-neutral-400 block text-[11px]">{language === 'bn' ? 'নির্দিষ্ট সেবা:' : 'Requested Service:'}</span>
                  <span className="text-white font-bold text-sm block">
                    {language === 'bn' ? matchedApplication.serviceNameBn : matchedApplication.serviceName}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-400 block text-[11px]">{language === 'bn' ? 'আবেদনকারী:' : 'Applicant Name:'}</span>
                  <span className="text-neutral-200 font-semibold block">{matchedApplication.applicantName}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-400 block text-[11px]">{language === 'bn' ? 'মোবাইল নম্বর:' : 'Phone Number:'}</span>
                  <span className="text-neutral-200 font-mono block">{matchedApplication.applicantPhone}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-400 block text-[11px]">{language === 'bn' ? 'দাখিলের তারিখ ও সময়:' : 'Created Timestamp:'}</span>
                  <span className="text-neutral-300 block font-mono">
                    {new Date(matchedApplication.createdAt).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}
                  </span>
                </div>

                {matchedApplication.assignedStaffName && (
                  <div className="space-y-1">
                    <span className="text-neutral-400 block text-[11px]">{language === 'bn' ? 'দায়িত্বপ্রাপ্ত অপারেটর:' : 'Assigned Specialist:'}</span>
                    <span className="text-emerald-400 font-semibold block">{matchedApplication.assignedStaffName}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-neutral-400 block text-[11px]">{language === 'bn' ? 'সেবা ফি ও পেমেন্ট মেথড:' : 'Fee & Payment Method:'}</span>
                  <span className="text-neutral-200 font-semibold block">
                    ৳{matchedApplication.amount} ({matchedApplication.paymentMethod?.toUpperCase() || 'Counter'})
                  </span>
                </div>
              </div>

              {/* TIMELINE & AUDIT HISTORY SECTION (আবেদনের প্রতিটি পর্যায়ের বিস্তারিত হিস্টোরি) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      {language === 'bn' ? 'আবেদনের পূর্ণাঙ্গ ট্র্যাকিং হিস্টোরি' : 'Step-by-Step Processing Timeline'}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {matchedApplication.timeline?.length || 1} {language === 'bn' ? 'টি আপডেট' : 'logs recorded'}
                  </span>
                </div>

                <div className="space-y-4 pl-2 sm:pl-4">
                  {matchedApplication.timeline && matchedApplication.timeline.length > 0 ? (
                    matchedApplication.timeline.map((event, idx) => {
                      const isLatest = idx === (matchedApplication.timeline?.length || 0) - 1;
                      return (
                        <div key={event.id || idx} className="relative pl-6 sm:pl-8 pb-4 border-l-2 border-emerald-500/30 last:border-l-transparent last:pb-0">
                          {/* Node Icon */}
                          <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${
                            isLatest
                              ? 'bg-emerald-500 border-emerald-300 ring-4 ring-emerald-500/20'
                              : 'bg-neutral-900 border-emerald-500'
                          }`} />

                          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-2 hover:border-neutral-700 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                                <span>{language === 'bn' ? (event.titleBn || event.title) : event.title}</span>
                                {isLatest && (
                                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold uppercase">
                                    Latest
                                  </span>
                                )}
                              </h5>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                <Clock className="w-3 h-3 inline mr-1 text-neutral-500" />
                                {new Date(event.timestamp).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}
                              </span>
                            </div>

                            <p className="text-xs text-neutral-300 leading-relaxed">
                              {language === 'bn' ? (event.descriptionBn || event.description) : event.description}
                            </p>

                            {event.updatedBy && (
                              <div className="flex items-center gap-2 text-[10px] text-neutral-400 pt-1 border-t border-neutral-900">
                                <User className="w-3 h-3 text-emerald-400" />
                                <span>{language === 'bn' ? 'আপডেটকারী:' : 'Logged by:'} {event.updatedBy}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    /* Fallback default timeline entry */
                    <div className="pl-6 border-l-2 border-emerald-500/30">
                      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white">
                            {language === 'bn' ? 'আবেদন নথিভুক্তকরণ' : 'Application Received'}
                          </h5>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {new Date(matchedApplication.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300">
                          {matchedApplication.notes || (language === 'bn' ? 'আবেদনটি সাফল্যের সাথে সিস্টেমে সংরক্ষিত হয়েছে।' : 'Application saved to desk.')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Attached Documents & Slips */}
              {matchedApplication.documents && matchedApplication.documents.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      {language === 'bn' ? 'সংযুক্ত ডকুমেন্ট ও কনফার্মেশন ফাইল' : 'Attached Documents & Slips'}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {matchedApplication.documents.map(doc => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/40 text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-neutral-200 font-medium block truncate">{doc.name}</span>
                            <span className="text-[10px] text-neutral-500">{doc.uploadedBy} • {doc.type.toUpperCase()}</span>
                          </div>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          download={doc.name}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-emerald-950 text-emerald-400 hover:text-emerald-300 border border-neutral-700 text-[11px] font-semibold flex items-center gap-1 shrink-0 ml-2"
                        >
                          <Download className="w-3 h-3" />
                          <span>{language === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Toolbar & Helpdesk Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-800">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/88${settings?.whatsappNumber || '01540004966'}?text=${encodeURIComponent(
                      `Hello Saiful Enterprise, I want an update regarding my application #${matchedApplication.applicationNumber} (${matchedApplication.serviceName}).`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ হেল্পডেস্কে কথা বলুন' : 'WhatsApp Support'}</span>
                  </a>

                  <a
                    href={`tel:${settings?.phonePrimary || '01540004966'}`}
                    className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{language === 'bn' ? 'কল করুন' : 'Call Desk'}</span>
                  </a>
                </div>

                <button
                  onClick={() => setShowSlipModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all active:scale-95 ml-auto"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ট্র্যাকিং স্লিপ প্রিন্ট করুন' : 'Print Official Slip'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-3 animate-in fade-in duration-200">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'কোনো আবেদন পাওয়া যায়নি' : 'No Application Found'}
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                {language === 'bn'
                  ? 'অনুগ্রহ করে আবেদন ট্র্যাকিং আইডি (যেমন: APP-2026-0001) বা সঠিক মোবাইল নম্বরটি টাইপ করে পুনরায় চেষ্টা করুন।'
                  : 'Please check your tracking number or phone number and try again.'}
              </p>
            </div>
          )
        )}

        {/* MODAL: Printable Official Tracking Slip */}
        {showSlipModal && matchedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white text-neutral-900 w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start pb-4 border-b border-neutral-200">
                <div>
                  <h3 className="text-xl font-extrabold text-neutral-900">
                    {settings?.businessNameBn || 'সাইফুল এন্টারপ্রাইজ'}
                  </h3>
                  <p className="text-xs text-neutral-600">
                    {settings?.taglineBn || 'অনলাইন সেবা, কম্পিউটার কম্পোজ, ফটোস্ট্যাট ও পাইকারি কাগজ সরবরাহকারী'}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    {settings?.addressBn || 'তেজগাঁও কলেজ গেট সংলগ্ন, ফার্মগেট, ঢাকা'} | হেল্পলাইন: {settings?.phonePrimary || '01540004966'}
                  </p>
                </div>
                <button
                  onClick={() => setShowSlipModal(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Slip Header Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                    OFFICIAL APPLICATION CONFIRMATION SLIP
                  </span>
                  <h4 className="text-lg font-extrabold text-emerald-950 font-mono">
                    {matchedApplication.applicationNumber}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block">Date & Time</span>
                  <span className="text-xs font-mono font-bold text-neutral-800">
                    {new Date(matchedApplication.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-neutral-200 rounded-2xl overflow-hidden text-xs">
                <div className="grid grid-cols-2 divide-x divide-neutral-200 bg-neutral-50 p-3 font-semibold text-neutral-700">
                  <span>Particulars</span>
                  <span>Details</span>
                </div>
                <div className="divide-y divide-neutral-200">
                  <div className="grid grid-cols-2 divide-x divide-neutral-200 p-2.5">
                    <span className="text-neutral-500">Service Name:</span>
                    <span className="font-bold text-neutral-900">{matchedApplication.serviceNameBn} ({matchedApplication.serviceName})</span>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-neutral-200 p-2.5">
                    <span className="text-neutral-500">Applicant Name:</span>
                    <span className="font-semibold text-neutral-800">{matchedApplication.applicantName}</span>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-neutral-200 p-2.5">
                    <span className="text-neutral-500">Contact Number:</span>
                    <span className="font-mono text-neutral-800">{matchedApplication.applicantPhone}</span>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-neutral-200 p-2.5">
                    <span className="text-neutral-500">Current Progress Status:</span>
                    <span className="font-bold text-emerald-700 uppercase">{matchedApplication.status}</span>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-neutral-200 p-2.5">
                    <span className="text-neutral-500">Service Fee:</span>
                    <span className="font-bold text-neutral-900">৳{matchedApplication.amount} ({matchedApplication.paymentStatus.toUpperCase()})</span>
                  </div>
                  {matchedApplication.assignedStaffName && (
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 p-2.5">
                      <span className="text-neutral-500">Handling Specialist:</span>
                      <span className="text-neutral-800">{matchedApplication.assignedStaffName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status History inside Slip */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-neutral-700 uppercase block">Audit & Tracking Logs</span>
                <div className="space-y-1.5 text-[11px] bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  {matchedApplication.timeline?.map((ev, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 pb-1 border-b border-neutral-200 last:border-0 last:pb-0">
                      <div>
                        <strong className="text-neutral-800">{ev.titleBn || ev.title}</strong>
                        <p className="text-neutral-600 text-[10px]">{ev.descriptionBn || ev.description}</p>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500 whitespace-nowrap">
                        {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-[10px] text-neutral-500 space-y-1 text-center pt-2 border-t border-neutral-200">
                <p>এটি একটি কম্পিউটার প্রস্তুতকৃত ডিজিটাল রিসিট ও ট্র্যাকিং স্লিপ।</p>
                <p>Tejgaon College Gate Area, Farmgate, Dhaka. Helpline: 01540004966 / 01517992585</p>
              </div>

              {/* Slip Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowSlipModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip Now</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
