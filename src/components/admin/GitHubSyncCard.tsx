import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import {
  GitBranch,
  Github,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  UploadCloud,
  DownloadCloud,
  HelpCircle,
  Save,
  Check,
  FolderGit2
} from 'lucide-react';
import { GitHubSyncSettings } from '../../types';

interface GitHubRepoInfo {
  fullName: string;
  private: boolean;
  defaultBranch: string;
  permissions?: {
    push?: boolean;
    pull?: boolean;
    admin?: boolean;
  };
}

export const GitHubSyncCard: React.FC = () => {
  const { language } = useLanguage();
  const { logActivity } = useData();

  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showToken, setShowToken] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const [form, setForm] = useState<GitHubSyncSettings>({
    enabled: false,
    token: '',
    hasToken: false,
    owner: 'sent9696',
    repo: 'saiful-enterprise',
    branch: 'main',
    filePath: 'data/database.json',
    commitAuthorName: 'Saiful Enterprise CMS',
    commitAuthorEmail: 'sent9696@gmail.com',
    lastSyncStatus: 'idle'
  });

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [testedRepo, setTestedRepo] = useState<GitHubRepoInfo | null>(null);

  // Fetch current config on load
  const loadConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/github/config');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.config) {
          setForm(prev => ({
            ...prev,
            ...data.config,
            // Keep token blank in input if user hasn't typed a new one, but keep hasToken flag
            token: ''
          }));
        }
      }
    } catch (err: any) {
      console.warn('Failed to load GitHub config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // Save GitHub Configuration
  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/github/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (data.success) {
        setForm(prev => ({
          ...prev,
          ...data.config,
          token: ''
        }));
        setStatusMessage({
          type: 'success',
          text: language === 'bn' ? 'গিটহাব কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!' : 'GitHub configuration saved successfully!'
        });
        logActivity('GitHub Sync Configured', `Updated repository settings for ${form.owner}/${form.repo}`);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || (language === 'bn' ? 'সংরক্ষণ ব্যর্থ হয়েছে।' : 'Failed to save configuration.')
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Error communicating with server'
      });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage(null), 6000);
    }
  };

  // Test Connection
  const handleTestConnection = async () => {
    setTesting(true);
    setStatusMessage(null);
    setTestedRepo(null);

    try {
      const res = await fetch('/api/github/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: form.token,
          owner: form.owner,
          repo: form.repo
        })
      });
      const data = await res.json();

      if (data.success) {
        setTestedRepo(data.repo);
        setStatusMessage({
          type: 'success',
          text: language === 'bn'
            ? `সংযোগ সফল! "${data.repo.fullName}" রিপোজিটরির সাথে সংযোগ স্থাপিত হয়েছে।`
            : `Connected successfully to GitHub repository: ${data.repo.fullName}`
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || (language === 'bn' ? 'গিটহাবের সাথে সংযোগ স্থাপন সম্ভব হয়নি।' : 'GitHub connection failed.')
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Network error during test'
      });
    } finally {
      setTesting(false);
    }
  };

  // Push Live Database to GitHub
  const handlePushNow = async () => {
    setSyncing(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/github/sync', {
        method: 'POST'
      });
      const data = await res.json();

      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: language === 'bn'
            ? 'ওয়েবসাইটের সম্পূর্ণ ডাটাবেজ সফলভাবে GitHub-এ কমিট ও পুশ হয়েছে!'
            : 'Website database successfully committed and pushed to GitHub!'
        });
        await loadConfig();
        logActivity('GitHub Manual Sync', `Pushed live database to GitHub (${data.commitSha?.slice(0, 7)})`);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || (language === 'bn' ? 'গিটহাবে ডাটা পুশ ব্যর্থ হয়েছে।' : 'Failed to push to GitHub.')
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Error pushing to GitHub'
      });
    } finally {
      setSyncing(false);
    }
  };

  // Pull Database from GitHub
  const handlePullFromGitHub = async () => {
    if (!window.confirm(
      language === 'bn'
        ? 'আপনি কি নিশ্চিত যে GitHub-এ থাকা ডাটা দিয়ে বর্তমান ওয়েবসাইট ডাটাবেজ প্রতিস্থাপন করতে চান?'
        : 'Are you sure you want to pull and overwrite local website data with the file on GitHub?'
    )) {
      return;
    }

    setPulling(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/github/pull', {
        method: 'POST'
      });
      const data = await res.json();

      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: language === 'bn'
            ? 'GitHub থেকে ডাটাবেজ সফলভাবে লোড হয়েছে! পেজ রিলোড হচ্ছে...'
            : 'Database loaded from GitHub successfully! Reloading...'
        });
        logActivity('GitHub Pull', `Restored database state from GitHub repository`);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || (language === 'bn' ? 'GitHub থেকে ডাটা পুল করা যায়নি।' : 'Failed to pull from GitHub.')
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Error pulling from GitHub'
      });
    } finally {
      setPulling(false);
    }
  };

  const cleanOwner = form.owner.trim();
  const cleanRepo = form.repo.trim().replace(/^https:\/\/github\.com\//, '').replace(/^\//, '');
  const repoUrl = cleanOwner && cleanRepo ? `https://github.com/${cleanOwner}/${cleanRepo}` : null;
  const fileUrl = repoUrl && form.filePath ? `${repoUrl}/blob/${form.branch || 'main'}/${form.filePath}` : null;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-white shadow-lg">
            <Github className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {language === 'bn' ? 'গিটহাব লাইভ অটো-সিঙ্ক (GitHub Live Sync)' : 'GitHub Live Auto-Sync & Cloud Storage'}
              </h3>
              {form.enabled ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {language === 'bn' ? 'অটো-সিঙ্ক সক্রিয়' : 'Live Sync Active'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500"></span>
                  {language === 'bn' ? 'স্থগিত (Paused)' : 'Sync Paused'}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {language === 'bn'
                ? 'ওয়েবসাইটে যেকোনো তথ্য আপডেট বা পরিবর্তন করলে তা স্বয়ংক্রিয়ভাবে আপনার GitHub ফাইলেও সেভ হয়ে যাবে।'
                : 'Automatically mirror every website edit, catalog update, and transaction directly to your GitHub repository.'}
            </p>
          </div>
        </div>

        {/* Quick Help Guide Button */}
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors border border-neutral-700 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'bn' ? 'কিভাবে সেটআপ করবেন?' : 'Setup Guide'}</span>
        </button>
      </div>

      {/* Guide Accordion */}
      {showGuide && (
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/80 border border-emerald-500/30 text-xs text-neutral-300 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'bn' ? 'GitHub টোকেন ও সিঙ্ক নির্দেশিকা' : 'GitHub Token & Setup Instructions'}</span>
            </h4>
            <a
              href="https://github.com/settings/tokens/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>{language === 'bn' ? 'নতুন টোকেন তৈরি করুন' : 'Generate Token on GitHub'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px]">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="font-bold text-white block">১. পার্সোনাল অ্যাক্সেস টোকেন (PAT)</span>
              <p className="text-neutral-400">
                GitHub Settings &gt; Developer settings &gt; Personal access tokens থেকে একটি টোকেন বানান। এতে <code className="text-emerald-400 bg-neutral-950 px-1 py-0.5 rounded">repo</code> পারমিশন টিক চিহ্ন দিন।
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="font-bold text-white block">২. রিপোজিটরি নাম দিন</span>
              <p className="text-neutral-400">
                আপনার গিটহাব ইউজারনেম (e.g. <code className="text-emerald-400">sent9696</code>) এবং রিপোজিটরির নাম (e.g. <code className="text-emerald-400">saiful-enterprise</code>) লিখুন।
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="font-bold text-white block">৩. অটো-সিঙ্ক চালু করুন</span>
              <p className="text-neutral-400">
                &ldquo;রিয়েল-টাইম অটো-সিঙ্ক&rdquo; চালু রাখুন। এরপর সাইটে যেকোনো কিছু এডিট করলেই GitHub-এ সরাসরি কমিট হয়ে যাবে!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Notice */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-rose-950/70 border border-rose-500/40 text-rose-300'
              : 'bg-blue-950/70 border border-blue-500/40 text-blue-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span className="leading-relaxed">{statusMessage.text}</span>
        </div>
      )}

      {/* Main Configuration Form */}
      <form onSubmit={handleSaveConfig} className="space-y-4">
        {/* Toggle Bar */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white block">
              {language === 'bn' ? 'রিয়েল-টাইম স্বয়ংক্রিয় সিঙ্ক (Enable Live Auto-Sync)' : 'Enable Real-Time Auto Sync'}
            </span>
            <p className="text-[11px] text-neutral-400">
              {language === 'bn'
                ? 'সক্রিয় থাকলে ওয়েবসাইটে যেকোনো আপডেট (সার্ভিস, প্রোডাক্ট, অর্ডার, সেটিংস) ৩ সেকেন্ডের মধ্যে GitHub ফাইলেও সেভ হবে।'
                : 'When enabled, every modification persists directly to your GitHub repository without manual exports.'}
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={e => setForm({ ...form, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* GitHub Personal Access Token */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
              <span>{language === 'bn' ? 'গিটহাব অ্যাক্সেস টোকেন (PAT) *' : 'GitHub Access Token (PAT) *'}</span>
              {form.hasToken && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {language === 'bn' ? 'টোকেন সেভ করা আছে' : 'Token Saved'}
                </span>
              )}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showToken ? 'text' : 'password'}
                value={form.token || ''}
                onChange={e => setForm({ ...form, token: e.target.value })}
                placeholder={form.hasToken ? '••••••••••••••••••••••••••••••' : 'ghp_xxxxxxxxxxxxxxxxxxxx'}
                className="w-full pl-9 pr-10 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                title={showToken ? 'Hide token' : 'Show token'}
              >
                {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">
              {language === 'bn' ? 'খালি রাখলে পূর্বের টোকেন বহাল থাকবে' : 'Leave blank to keep existing token'}
            </p>
          </div>

          {/* Repo Owner */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              {language === 'bn' ? 'GitHub ইউজারনেম / অর্গানাইজেশন' : 'GitHub Username / Org'}
            </label>
            <input
              type="text"
              required
              value={form.owner}
              onChange={e => setForm({ ...form, owner: e.target.value })}
              placeholder="e.g. sent9696"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Repo Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              {language === 'bn' ? 'রিপোজিটরির নাম (Repository Name)' : 'Repository Name'}
            </label>
            <input
              type="text"
              required
              value={form.repo}
              onChange={e => setForm({ ...form, repo: e.target.value })}
              placeholder="e.g. saiful-enterprise"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              {language === 'bn' ? 'টার্গেট ব্রাঞ্চ (Branch)' : 'Target Branch'}
            </label>
            <div className="relative">
              <GitBranch className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={form.branch || 'main'}
                onChange={e => setForm({ ...form, branch: e.target.value })}
                placeholder="main"
                className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* File Path */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              {language === 'bn' ? 'ফাইল পাথ (File Path in Repository)' : 'File Path in Repo'}
            </label>
            <div className="relative">
              <FolderGit2 className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={form.filePath || 'data/database.json'}
                onChange={e => setForm({ ...form, filePath: e.target.value })}
                placeholder="data/database.json"
                className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Sync Status Info Strip */}
        <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">{language === 'bn' ? 'সর্বশেষ সিঙ্ক:' : 'Last Synced:'}</span>
            <span className="font-mono text-white">
              {form.lastSyncTime ? new Date(form.lastSyncTime).toLocaleString() : (language === 'bn' ? 'এখনও সিঙ্ক হয়নি' : 'Never')}
            </span>
            {form.lastCommitSha && (
              <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-emerald-400 border border-neutral-700">
                SHA: {form.lastCommitSha.slice(0, 7)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:underline"
              >
                <span>{language === 'bn' ? 'GitHub-এ ফাইল দেখুন' : 'View File on GitHub'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Save Settings */}
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-950 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? (language === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (language === 'bn' ? 'সেটিংস সংরক্ষণ করুন' : 'Save Settings')}</span>
          </button>

          {/* Test Connection */}
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className={`w-3.5 h-3.5 text-blue-400 ${testing ? 'animate-pulse' : ''}`} />
            <span>{testing ? (language === 'bn' ? 'পরীক্ষা করা হচ্ছে...' : 'Testing...') : (language === 'bn' ? 'সংযোগ পরীক্ষা করুন' : 'Test Connection')}</span>
          </button>

          {/* Push to GitHub Now */}
          <button
            type="button"
            onClick={handlePushNow}
            disabled={syncing || (!form.hasToken && !form.token)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-40"
          >
            <UploadCloud className={`w-3.5 h-3.5 ${syncing ? 'animate-bounce' : ''}`} />
            <span>{syncing ? (language === 'bn' ? 'পুশ হচ্ছে...' : 'Pushing...') : (language === 'bn' ? 'এখনই GitHub-এ পুশ করুন' : 'Push to GitHub Now')}</span>
          </button>

          {/* Pull from GitHub */}
          <button
            type="button"
            onClick={handlePullFromGitHub}
            disabled={pulling || (!form.hasToken && !form.token)}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-40"
            title="Download database.json from GitHub and hydrate site"
          >
            <DownloadCloud className={`w-3.5 h-3.5 text-amber-400 ${pulling ? 'animate-spin' : ''}`} />
            <span>{pulling ? (language === 'bn' ? 'পুল হচ্ছে...' : 'Pulling...') : (language === 'bn' ? 'GitHub থেকে ডাটা আনুন' : 'Pull from GitHub')}</span>
          </button>
        </div>
      </form>

      {/* Connection Success Details Badge */}
      {testedRepo && (
        <div className="p-3.5 rounded-2xl bg-neutral-950 border border-emerald-500/30 text-xs text-neutral-300 flex items-center justify-between flex-wrap gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>{testedRepo.fullName}</strong> ({testedRepo.private ? 'Private' : 'Public'}, branch:{' '}
              {testedRepo.defaultBranch})
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">
            Push permission: {testedRepo.permissions?.push ? 'Yes' : 'No'}
          </span>
        </div>
      )}
    </div>
  );
};
