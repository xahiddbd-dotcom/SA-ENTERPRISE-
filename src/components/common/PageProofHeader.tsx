import React, { useState } from 'react';
import { Home, ChevronRight, Copy, Check, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { copyToClipboard, buildWhatsAppShareUrl, buildUrl } from '../../utils/navigation';

interface PageProofHeaderProps {
  tab: string;
  title: string;
  badge: string;
  description?: string;
  onNavigateHome?: () => void;
}

export const PageProofHeader: React.FC<PageProofHeaderProps> = ({
  tab,
  title,
  badge,
  description,
  onNavigateHome
}) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const pageUrl = buildUrl({ tab });

  const handleCopy = async () => {
    const success = await copyToClipboard(pageUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = buildWhatsAppShareUrl(title, pageUrl);

  return (
    <div
      id={`page-proof-header-${tab}`}
      className="bg-neutral-900/80 border-b border-neutral-800 backdrop-blur-sm -mt-2 mb-6"
    >
      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2.5">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
          </button>
          <ChevronRight className="w-3 h-3 text-neutral-600" />
          <span className="text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            {badge}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title & Description */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
            </h1>
            {description && (
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
                {description}
              </p>
            )}
          </div>

          {/* Canonical Proof Link Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-neutral-950/80 border border-emerald-900/40 rounded-xl p-2 sm:px-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">
                {language === 'bn' ? 'পেজ লিঙ্ক:' : 'Page Link:'}
              </span>
            </div>

            <input
              type="text"
              readOnly
              value={pageUrl}
              onFocus={(e) => e.target.select()}
              className="bg-neutral-900/90 text-neutral-300 font-mono text-[11px] sm:text-xs px-2.5 py-1 rounded-md border border-neutral-800 w-44 sm:w-64 outline-none truncate select-all"
              aria-label="Direct Page URL"
            />

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
              }`}
              title={language === 'bn' ? 'পেজ লিঙ্ক কপি করুন' : 'Copy page URL'}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
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
              className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 transition-colors"
              title={language === 'bn' ? 'WhatsApp এ এই পেজ শেয়ার করুন' : 'Share this page on WhatsApp'}
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>

            <a
              href={pageUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
              title={language === 'bn' ? 'নতুন উইন্ডোতে খুলুন' : 'Open in new window'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
