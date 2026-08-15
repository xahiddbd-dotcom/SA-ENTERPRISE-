import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { Application } from '../../types';
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
  ArrowRight
} from 'lucide-react';

interface ApplicationTrackerProps {
  initialSearchId?: string;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ initialSearchId }) => {
  const { language, t } = useLanguage();
  const { applications } = useData();

  const [query, setQuery] = useState(initialSearchId || '');
  const [matchedApplication, setMatchedApplication] = useState<Application | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialSearchId) {
      setQuery(initialSearchId);
      const found = applications.find(
        a => a.applicationNumber.toLowerCase() === initialSearchId.toLowerCase() || a.applicantPhone === initialSearchId
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
      a => a.applicationNumber.toLowerCase() === clean || a.applicantPhone.includes(clean)
    );
    setMatchedApplication(found || null);
  };

  const steps: { key: string; labelBn: string; labelEn: string }[] = [
    { key: 'new', labelBn: 'নতুন আবেদন', labelEn: 'Received' },
    { key: 'processing', labelBn: 'প্রক্রিয়াধীন', labelEn: 'Processing' },
    { key: 'submitted', labelBn: 'অনলাইন দাখিল', labelEn: 'Submitted' },
    { key: 'completed', labelBn: 'কাজ সম্পন্ন', labelEn: 'Completed' },
    { key: 'delivered', labelBn: 'ডেলিভারি', labelEn: 'Delivered' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'new': return 0;
      case 'processing': return 1;
      case 'submitted': return 2;
      case 'completed': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  return (
    <section id="application-tracker-section" className="py-16 bg-neutral-950">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <FileCheck className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অনলাইন আবেদন ট্র্যাকিং' : 'Application Live Status'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {language === 'bn' ? 'আবেদনের বর্তমান অবস্থা জানুন' : 'Track Your Application'}
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto">
            {language === 'bn'
              ? 'আপনার আবেদন নম্বর (যেমন: APP-2026-0001) অথবা মোবাইল নম্বর প্রদান করে তাৎক্ষণিক অগ্রগতি দেখুন।'
              : 'Enter your Application ID or mobile phone to track real-time processing.'}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-10">
          <div className="relative flex items-center bg-neutral-900 border-2 border-neutral-800 focus-within:border-emerald-500 rounded-2xl p-2 shadow-xl">
            <Search className="w-5 h-5 text-neutral-400 ml-3 shrink-0" />
            <input
              type="text"
              id="app-tracker-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={language === 'bn' ? 'আবেদন আইডি (APP-2026-0001) বা ফোন নম্বর দিন...' : 'Enter App ID (APP-2026-0001) or Phone...'}
              className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none font-mono"
            />
            <button
              type="submit"
              id="app-tracker-submit-btn"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-md shadow-emerald-950 transition-all active:scale-95"
            >
              {language === 'bn' ? 'খুঁজুন' : 'Track Now'}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-neutral-500">
            <span>{language === 'bn' ? 'স্যাম্পল চেক করতে ক্লিক করুন:' : 'Demo test IDs:'}</span>
            <button
              type="button"
              onClick={() => { setQuery('APP-2026-0001'); setHasSearched(true); setMatchedApplication(applications[0]); }}
              className="text-emerald-400 underline font-mono"
            >
              APP-2026-0001
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => { setQuery('APP-2026-0002'); setHasSearched(true); setMatchedApplication(applications[1]); }}
              className="text-emerald-400 underline font-mono"
            >
              APP-2026-0002
            </button>
          </div>
        </form>

        {/* Results Box */}
        {hasSearched && (
          matchedApplication ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-300">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
                <div>
                  <span className="text-xs text-neutral-400 uppercase font-mono block">
                    {language === 'bn' ? 'আবেদন ট্র্যাকিং নম্বর' : 'Application Tracking ID'}
                  </span>
                  <h3 className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {matchedApplication.applicationNumber}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {matchedApplication.status}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                    matchedApplication.paymentStatus === 'paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40' : 'bg-amber-950 text-amber-400 border border-amber-600/40'
                  }`}>
                    {matchedApplication.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Progress Pipeline */}
              <div className="py-2">
                <div className="grid grid-cols-5 gap-2 relative">
                  {steps.map((step, idx) => {
                    const activeIdx = getStepIndex(matchedApplication.status);
                    const isDone = idx <= activeIdx;
                    const isCurrent = idx === activeIdx;

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/30'
                            : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                        } ${isCurrent ? 'ring-4 ring-emerald-500/30' : ''}`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[10px] sm:text-xs font-semibold ${
                          isDone ? 'text-white' : 'text-neutral-500'
                        }`}>
                          {language === 'bn' ? step.labelBn : step.labelEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-950 p-4 sm:p-5 rounded-xl border border-neutral-800 text-xs">
                <div className="space-y-1">
                  <span className="text-neutral-400 block">{language === 'bn' ? 'সেবার নাম:' : 'Service:'}</span>
                  <span className="text-white font-bold text-sm">
                    {language === 'bn' ? matchedApplication.serviceNameBn : matchedApplication.serviceName}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-400 block">{language === 'bn' ? 'আবেদনকারী:' : 'Applicant:'}</span>
                  <span className="text-neutral-200 font-semibold">{matchedApplication.applicantName}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-400 block">{language === 'bn' ? 'মোবাইল নম্বর:' : 'Phone:'}</span>
                  <span className="text-neutral-200 font-mono">{matchedApplication.applicantPhone}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-neutral-400 block">{language === 'bn' ? 'দাখিলের সময়:' : 'Created Date:'}</span>
                  <span className="text-neutral-300">
                    {new Date(matchedApplication.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Operator Notes */}
              {matchedApplication.notes && (
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-emerald-400 block">
                    {language === 'bn' ? 'অপারেটর আপডেট ও নোট:' : 'Staff Operator Notes:'}
                  </span>
                  <p className="text-xs text-neutral-200 leading-relaxed">
                    {matchedApplication.notes}
                  </p>
                </div>
              )}

              {/* Documents attached */}
              {matchedApplication.documents && matchedApplication.documents.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-neutral-400 uppercase">
                    {language === 'bn' ? 'সংযুক্ত ডকুমেন্ট ও কনফার্মেশন স্লিপ' : 'Documents & Slips'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedApplication.documents.map(doc => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-neutral-200 truncate">{doc.name}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                          {doc.uploadedBy}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'কোনো আবেদন পাওয়া যায়নি' : 'No Application Found'}
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'দয়া করে আপনার আবেদন নম্বর বা ফোন নম্বরটি পুনরায় যাচাই করুন।'
                  : 'Please check your application number or phone number and try again.'}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
};
