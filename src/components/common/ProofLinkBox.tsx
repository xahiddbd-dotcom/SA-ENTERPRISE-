import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Share2, MessageCircle, ShieldCheck } from 'lucide-react';
import { copyToClipboard, buildWhatsAppShareUrl } from '../../utils/navigation';
import { useLanguage } from '../../context/LanguageContext';

interface ProofLinkBoxProps {
  url: string;
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  compact?: boolean;
  className?: string;
}

export const ProofLinkBox: React.FC<ProofLinkBoxProps> = ({
  url,
  title,
  subtitle,
  badgeLabel,
  compact = false,
  className = ''
}) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = buildWhatsAppShareUrl(title, url);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 bg-neutral-900/90 border border-emerald-900/40 rounded-xl p-2.5 ${className}`}>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-mono text-emerald-400 truncate select-all">
            {url}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
          }`}
          title={language === 'bn' ? 'লিঙ্ক কপি করুন' : 'Copy link'}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>{language === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
            </>
          )}
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 transition-colors"
          title={language === 'bn' ? 'WhatsApp এ শেয়ার করুন' : 'Share on WhatsApp'}
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </a>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          title={language === 'bn' ? 'নতুন ট্যাবে খুলুন' : 'Open in new tab'}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div
      id="proof-link-card"
      className={`relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-emerald-950/20 p-4 shadow-lg ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>{badgeLabel || (language === 'bn' ? 'সরাসরি প্রমাণ ও শেয়ার লিংক' : 'Official Proof & Direct Link')}</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            {subtitle && (
              <p className="text-[11px] text-neutral-400">{subtitle}</p>
            )}
          </div>
        </div>

        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {language === 'bn' ? 'ভেরিফাইড পেজ' : 'Verified Link'}
        </span>
      </div>

      {/* URL Display Box */}
      <div className="relative flex items-center bg-neutral-950 rounded-lg border border-neutral-800 p-1 pl-3 mb-3">
        <span className="text-neutral-500 text-xs select-none mr-1.5">🔗</span>
        <input
          type="text"
          readOnly
          value={url}
          onFocus={(e) => e.target.select()}
          className="w-full bg-transparent text-xs font-mono text-emerald-400 outline-none select-all cursor-text py-1"
          aria-label="Direct proof URL"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleCopy}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            copied
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
              : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-sm'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>{language === 'bn' ? 'লিঙ্ক কপি সম্পন্ন!' : 'Link Copied!'}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{language === 'bn' ? 'প্রমাণ লিংক কপি করুন' : 'Copy Proof Link'}</span>
            </>
          )}
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>{language === 'bn' ? 'WhatsApp এ পাঠান' : 'Send to WhatsApp'}</span>
        </a>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
          title={language === 'bn' ? 'নতুন ট্যাবে খুলুন' : 'Open in new tab'}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
