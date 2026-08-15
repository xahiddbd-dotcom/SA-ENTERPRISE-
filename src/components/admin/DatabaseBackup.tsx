import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  FileJson,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
  Eye,
  EyeOff,
  Trash2,
  Clock,
  Layers,
  Package,
  FileCheck,
  Users,
  ShoppingBag,
  HardDrive,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';

interface ParsedBackupInfo {
  version?: string;
  system?: string;
  exportedAt?: string;
  exportedBy?: string;
  servicesCount?: number;
  productsCount?: number;
  applicationsCount?: number;
  ordersCount?: number;
  staffCount?: number;
  posSalesCount?: number;
  expensesCount?: number;
  hasSettings?: boolean;
  rawJson?: string;
  filename?: string;
}

export const DatabaseBackup: React.FC = () => {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const {
    services,
    products,
    applications,
    orders,
    staff,
    posSales,
    expenses,
    settings,
    activityLogs,
    exportDatabaseJSON,
    importDatabaseJSON,
    resetAllData,
    logActivity
  } = useData();

  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [parsedBackup, setParsedBackup] = useState<ParsedBackupInfo | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(() => {
    return localStorage.getItem('se_last_backup_timestamp');
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate current database footprint
  const currentJsonString = exportDatabaseJSON();
  const estimatedSizeKb = (new Blob([currentJsonString]).size / 1024).toFixed(2);

  // Total records across database
  const totalRecords =
    services.length +
    products.length +
    applications.length +
    orders.length +
    staff.length +
    posSales.length +
    expenses.length +
    activityLogs.length;

  const handleDownloadBackup = () => {
    setIsExporting(true);
    try {
      const now = new Date();
      const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `saiful-enterprise-backup-${dateStr}.json`;

      const jsonStr = exportDatabaseJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const timestampStr = now.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      localStorage.setItem('se_last_backup_timestamp', timestampStr);
      setLastBackupTime(timestampStr);

      logActivity(
        'Database Backup Created',
        `Exported full database backup (${estimatedSizeKb} KB, ${totalRecords} records) to ${filename}`,
        currentUser ? { id: currentUser.id, name: currentUser.name, role: currentUser.role } : undefined
      );
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  const handleCopyClipboard = () => {
    const jsonStr = exportDatabaseJSON();
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestoreError(null);
    setRestoreSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setRestoreError(language === 'bn' ? 'অনুগ্রহ করে শুধুমাত্র বৈধ .json ব্যাকআপ ফাইল আপলোড করুন।' : 'Please upload a valid .json backup file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        // Analyze and validate backup content
        const info: ParsedBackupInfo = {
          version: parsed.version || '1.0.0',
          system: parsed.system || 'Saiful Enterprise Data File',
          exportedAt: parsed.exportedAt ? new Date(parsed.exportedAt).toLocaleString() : 'Unknown Date',
          exportedBy: parsed.exportedBy || 'System Administrator',
          servicesCount: Array.isArray(parsed.services) ? parsed.services.length : 0,
          productsCount: Array.isArray(parsed.products) ? parsed.products.length : 0,
          applicationsCount: Array.isArray(parsed.applications) ? parsed.applications.length : 0,
          ordersCount: Array.isArray(parsed.orders) ? parsed.orders.length : 0,
          staffCount: Array.isArray(parsed.staff) ? parsed.staff.length : 0,
          posSalesCount: Array.isArray(parsed.posSales) ? parsed.posSales.length : 0,
          expensesCount: Array.isArray(parsed.expenses) ? parsed.expenses.length : 0,
          hasSettings: !!parsed.settings,
          rawJson: content,
          filename: file.name
        };

        setParsedBackup(info);
      } catch (err: any) {
        setRestoreError(language === 'bn' ? 'ফাইলটি সঠিক JSON ফরম্যাটে নেই। ত্রুটি: ' + err.message : 'Invalid JSON format in uploaded file: ' + err.message);
        setParsedBackup(null);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = () => {
    if (!parsedBackup || !parsedBackup.rawJson) return;

    setIsRestoring(true);
    setRestoreError(null);
    setRestoreSuccess(null);

    try {
      const success = importDatabaseJSON(parsedBackup.rawJson);
      if (success) {
        setRestoreSuccess(
          language === 'bn'
            ? `ডাটাবেজ সফলভাবে রিস্টোর হয়েছে! ${parsedBackup.filename} থেকে ডাটা আপডেট করা হয়েছে।`
            : `Database successfully restored from ${parsedBackup.filename}!`
        );

        logActivity(
          'Database Restored',
          `Restored system data from ${parsedBackup.filename} (${parsedBackup.servicesCount} services, ${parsedBackup.productsCount} products, ${parsedBackup.applicationsCount} applications)`,
          currentUser ? { id: currentUser.id, name: currentUser.name, role: currentUser.role } : undefined
        );

        setParsedBackup(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setRestoreError(language === 'bn' ? 'ডাটাবেজ রিস্টোর করতে ব্যর্থ হয়েছে। ফরম্যাট সঠিক কিনা পরীক্ষা করুন।' : 'Failed to restore database. Please verify the JSON schema format.');
      }
    } catch (err: any) {
      setRestoreError(err.message || 'Error occurred while restoring database');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleFactoryReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    setRestoreSuccess(language === 'bn' ? 'সিস্টেম ডাটা ফ্যাক্টরি সেটিংসে রিসেট করা হয়েছে।' : 'System database reset to initial factory demo state.');
    logActivity('Factory Reset', 'Database reset to initial factory demo configuration', currentUser ? { id: currentUser.id, name: currentUser.name, role: currentUser.role } : undefined);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                {language === 'bn' ? 'ডাটাবেজ ব্যাকআপ ও রিস্টোর' : 'Database Backup & Restore'}
              </h1>
              <p className="text-xs text-neutral-400">
                {language === 'bn'
                  ? 'সাইফুল এন্টারপ্রাইজের সমস্ত ডাটা (সার্ভিস, পেপার স্টক, আবেদন, অর্ডার, হিসাব) ব্যাকআপ ও রিস্টোর করুন।'
                  : 'Manage complete system data backups, export snapshots, and restore from JSON files.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadBackup}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all"
          >
            {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{language === 'bn' ? 'ব্যাকআপ ডাউনলোড করুন (.json)' : 'Download Backup (.json)'}</span>
          </button>
        </div>
      </div>

      {/* Status Alerts */}
      {restoreSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{restoreSuccess}</span>
          </div>
          <button onClick={() => setRestoreSuccess(null)} className="text-emerald-400 hover:text-white font-bold">
            Dismiss
          </button>
        </div>
      )}

      {restoreError && (
        <div className="p-4 bg-rose-950/60 border border-rose-500/40 rounded-2xl flex items-center justify-between gap-3 text-xs text-rose-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{restoreError}</span>
          </div>
          <button onClick={() => setRestoreError(null)} className="text-rose-400 hover:text-white font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>{language === 'bn' ? 'সিস্টেম স্টোরেজ' : 'Storage Size'}</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{estimatedSizeKb} KB</p>
          <p className="text-[11px] text-neutral-400">{totalRecords} {language === 'bn' ? 'মোট রেকর্ড' : 'total entities'}</p>
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>{language === 'bn' ? 'সার্ভিস ও স্টক' : 'Catalog & Paper'}</span>
            <Package className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{services.length + products.length}</p>
          <p className="text-[11px] text-neutral-400">{services.length} services, {products.length} paper SKUs</p>
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>{language === 'bn' ? 'আবেদন ও অর্ডার' : 'Apps & Orders'}</span>
            <FileCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-extrabold text-white font-mono">{applications.length + orders.length}</p>
          <p className="text-[11px] text-neutral-400">{applications.length} apps, {orders.length} orders</p>
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>{language === 'bn' ? 'শেষ ব্যাকআপ' : 'Last Backup'}</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xs font-bold text-white truncate">{lastBackupTime || (language === 'bn' ? 'এখনো নেওয়া হয়নি' : 'Not generated yet')}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> {language === 'bn' ? 'সুরক্ষিত ও প্রস্তুত' : 'Protected & Ready'}
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid: Export / Download + Upload / Restore */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLUMN 1: DOWNLOAD & BACKUP CREATOR */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {language === 'bn' ? '১. ডাটাবেজ ব্যাকআপ তৈরি ও ডাউনলোড' : '1. Export & Download System Backup'}
                  </h2>
                  <p className="text-xs text-neutral-400">
                    {language === 'bn'
                      ? 'সম্পূর্ণ সিস্টেম ডাটা একটি একক JSON ফাইলে ডাউনলোড করুন।'
                      : 'Download a clean, structured JSON snapshot of all current store data.'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 font-mono font-bold border border-emerald-800/40">
                JSON v2.4
              </span>
            </div>

            {/* Collection breakdown list */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                {language === 'bn' ? 'ব্যাকআপে যা যা অন্তর্ভুক্ত থাকবে:' : 'Included In Backup Payload:'}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-emerald-400" /> Services & Categories</span>
                  <span className="font-mono font-bold text-white">{services.length}</span>
                </div>
                <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-sky-400" /> Paper Catalog & GSM</span>
                  <span className="font-mono font-bold text-white">{products.length}</span>
                </div>
                <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-1.5"><FileCheck className="w-3.5 h-3.5 text-amber-400" /> Online Applications</span>
                  <span className="font-mono font-bold text-white">{applications.length}</span>
                </div>
                <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-1.5"><ShoppingBag className="w-3.5 h-3.5 text-purple-400" /> E-Commerce Orders</span>
                  <span className="font-mono font-bold text-white">{orders.length}</span>
                </div>
                <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-emerald-400" /> POS Sales & Invoices</span>
                  <span className="font-mono font-bold text-white">{posSales.length}</span>
                </div>
                <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-cyan-400" /> Staff & Operators</span>
                  <span className="font-mono font-bold text-white">{staff.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={handleDownloadBackup}
                disabled={isExporting}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all"
              >
                {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{language === 'bn' ? 'সরাসরি ব্যাকআপ ডাউনলোড করুন' : 'Download Complete Backup File'}</span>
              </button>

              <button
                onClick={handleCopyClipboard}
                className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-2 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'JSON কপি করুন' : 'Copy JSON')}</span>
              </button>

              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white font-bold text-xs flex items-center gap-2 border border-neutral-800 transition-all"
              >
                {showRawJson ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showRawJson ? 'Hide Viewer' : 'Inspect JSON'}</span>
              </button>
            </div>

            {/* Collapsible JSON Viewer */}
            {showRawJson && (
              <div className="mt-4 p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[11px] text-neutral-400 border-b border-neutral-800 pb-1.5">
                  <span className="font-mono">preview: database-payload.json</span>
                  <span>{estimatedSizeKb} KB</span>
                </div>
                <pre className="max-h-60 overflow-y-auto text-[10px] font-mono text-emerald-400/90 leading-relaxed scrollbar-thin">
                  {currentJsonString}
                </pre>
              </div>
            )}
          </div>

          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {language === 'bn'
                ? 'নিয়মিত ব্যাকআপ সংরক্ষণ করলে যেকোনো সময় পুরো শপ ডাটা পুনরায় ফিরে পাওয়া সম্ভব।'
                : 'Backups are stored offline securely in JSON format and can be restored on any device instantly.'}
            </span>
          </div>
        </div>

        {/* COLUMN 2: UPLOAD & RESTORE BACKUP */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-950/60 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {language === 'bn' ? '২. ব্যাকআপ ফাইল আপলোড ও রিস্টোর' : '2. Upload & Restore Database'}
                  </h2>
                  <p className="text-xs text-neutral-400">
                    {language === 'bn'
                      ? 'পূর্বে সেভ করা .json ফাইল নির্বাচন করে সিস্টেমে ডাটা রিস্টোর করুন।'
                      : 'Upload a previously generated .json file to restore system data.'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-sky-950 text-sky-400 font-mono font-bold border border-sky-800/40">
                Import
              </span>
            </div>

            {/* Drag & Drop / File Input Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-neutral-700 hover:border-emerald-500/70 bg-neutral-950/50 hover:bg-neutral-950 rounded-2xl text-center cursor-pointer transition-all space-y-3 group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json,application/json"
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 group-hover:bg-emerald-950/80 border border-neutral-800 group-hover:border-emerald-500/40 text-neutral-400 group-hover:text-emerald-400 flex items-center justify-center mx-auto transition-all">
                <FileJson className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {language === 'bn' ? 'ব্যাকআপ .json ফাইল এখানে ক্লিক করে আপলোড করুন' : 'Click to select or drop backup .json file'}
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Supports valid Saiful Enterprise JSON backup files
                </p>
              </div>
            </div>

            {/* PRE-RESTORE INSPECTION CARD (When file is chosen and parsed) */}
            {parsedBackup && (
              <div className="p-4 bg-neutral-950 border border-sky-500/40 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                      {parsedBackup.filename}
                    </h4>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {parsedBackup.exportedAt}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-neutral-900 rounded-lg">
                    <p className="text-neutral-400 text-[10px]">Services</p>
                    <p className="font-bold font-mono text-emerald-400">{parsedBackup.servicesCount}</p>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded-lg">
                    <p className="text-neutral-400 text-[10px]">Products</p>
                    <p className="font-bold font-mono text-sky-400">{parsedBackup.productsCount}</p>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded-lg">
                    <p className="text-neutral-400 text-[10px]">Applications</p>
                    <p className="font-bold font-mono text-amber-400">{parsedBackup.applicationsCount}</p>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-center gap-2 text-[11px] text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    {language === 'bn'
                      ? 'সতর্কতা: রিস্টোর করলে বর্তমান ডাটা ওভাররাইট হয়ে যাবে।'
                      : 'Warning: Executing restore will update current database state with this backup.'}
                  </span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setParsedBackup(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition-all"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>

                  <button
                    onClick={handleExecuteRestore}
                    disabled={isRestoring}
                    className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-950 transition-all"
                  >
                    {isRestoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>{language === 'bn' ? 'রিস্টোর নিশ্চিত করুন' : 'Confirm & Restore'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              {language === 'bn'
                ? 'রিস্টোর করার আগে বর্তমান ডাটার একটি নতুন ব্যাকআপ ডাউনলোড করে রাখা সুপারিশকৃত।'
                : 'Tip: You can download a quick snapshot of the current state before applying older backups.'}
            </span>
          </div>
        </div>
      </div>

      {/* Safety & Danger Zone: Factory Reset */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'bn' ? 'ফ্যাক্টরি ডেমো ডাটা রিসেট' : 'Factory Demo Data Reset'}
              </h3>
              <p className="text-xs text-neutral-400">
                {language === 'bn'
                  ? 'সমস্ত কাস্টম এন্ট্রি মুছে ফেলে প্রারম্ভিক ডেমো ডাটা (সার্ভিস, পেপার, স্টক) ফিরিয়ে আনুন।'
                  : 'Clear all custom logs and restore default Tejgaon College services, paper catalogs, and demo records.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-2 transition-all shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{language === 'bn' ? 'ফ্যাক্টরি রিসেট করুন' : 'Reset to Default State'}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Confirm Factory Reset?'}
              </h3>
              <p className="text-xs text-neutral-400">
                {language === 'bn'
                  ? 'এই পদক্ষেপটি সমস্ত বর্তমান পরিবর্তন মুছে দেবে এবং প্রাথমিক ডেমো ডাটা লোড করবে।'
                  : 'This action will reset services, products, orders, applications, and financial records to initial demo defaults.'}
              </p>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl text-xs text-neutral-300 border border-neutral-800 space-y-1">
              <p className="font-semibold text-white">Current Statistics:</p>
              <p>• {services.length} Services, {products.length} Products</p>
              <p>• {applications.length} Applications, {orders.length} Orders</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition-all"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleFactoryReset}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950 transition-all"
              >
                {language === 'bn' ? 'হ্যাঁ, রিসেট করুন' : 'Yes, Reset Database'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
