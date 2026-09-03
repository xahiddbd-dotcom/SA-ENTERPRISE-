import React, { useState } from 'react';
import { Share2, Check, Copy, Link as LinkIcon } from 'lucide-react';
import { buildUrl, copyToClipboard } from '../../utils/navigation';
import { useLanguage } from '../../context/LanguageContext';

interface ShareProofButtonProps {
  type: 'product' | 'service' | 'tracker' | 'tab';
  id?: string;
  title?: string;
  variant?: 'icon-only' | 'badge' | 'button' | 'pill';
  className?: string;
  onCopied?: (url: string) => void;
}

export const ShareProofButton: React.FC<ShareProofButtonProps> = ({
  type,
  id,
  title,
  variant = 'button',
  className = '',
  onCopied
}) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    switch (type) {
      case 'product':
        return buildUrl({ tab: 'shop', productId: id });
      case 'service':
        return buildUrl({ tab: 'services', serviceId: id });
      case 'tracker':
        return buildUrl({ tab: 'tracker', trackerId: id });
      default:
        return buildUrl({ tab: id || 'home' });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const shareUrl = getUrl();
    const shareTitle = title || (language === 'bn' ? 'সাইফুল এন্টারপ্রাইজ' : 'Saiful Enterprise');

    // Try Web Share API on mobile if supported
    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: shareTitle,
          text: language === 'bn' 
            ? `${shareTitle} - বিস্তারিত ও প্রমাণ লিঙ্ক:` 
            : `${shareTitle} - Details & Proof Link:`,
          url: shareUrl
        });
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        if (onCopied) onCopied(shareUrl);
        return;
      } catch (err: any) {
        // User cancelled or share failed, fallback to copy to clipboard
        if (err?.name === 'AbortError') return;
      }
    }

    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      if (onCopied) onCopied(shareUrl);
    }
  };

  // 1. Icon-only variant (great for top corners of cards)
  if (variant === 'icon-only') {
    return (
      <button
        type="button"
        onClick={handleShare}
        title={language === 'bn' ? 'প্রমাণ লিঙ্ক কপি করুন' : 'Copy Proof Link'}
        className={`p-2 rounded-xl backdrop-blur-md transition-all duration-200 ${
          copied
            ? 'bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/40 scale-105'
            : 'bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 shadow-md'
        } ${className}`}
      >
        {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Share2 className="w-3.5 h-3.5" />}
      </button>
    );
  }

  // 2. Badge variant (compact with small text)
  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={handleShare}
        title={language === 'bn' ? 'প্রমাণ লিঙ্ক কপি করুন' : 'Copy Proof Link'}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 ${
          copied
            ? 'bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/30'
            : 'bg-neutral-800/80 hover:bg-neutral-700/90 text-neutral-300 hover:text-white border border-neutral-700/60'
        } ${className}`}
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 stroke-[3]" />
            <span>{language === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-3 h-3 text-emerald-400" />
            <span>{language === 'bn' ? 'লিঙ্ক কপি' : 'Share Link'}</span>
          </>
        )}
      </button>
    );
  }

  // 3. Pill variant
  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
          copied
            ? 'bg-emerald-500 text-neutral-950 shadow-md'
            : 'bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-emerald-500/30'
        } ${className}`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{language === 'bn' ? 'লিঙ্ক কপি হয়েছে!' : 'Link Copied!'}</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'প্রমাণ লিঙ্ক শেয়ার' : 'Share Proof Link'}</span>
          </>
        )}
      </button>
    );
  }

  // 4. Default Button variant (prominent with rich styling)
  return (
    <button
      type="button"
      onClick={handleShare}
      className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all duration-200 shadow-md ${
        copied
          ? 'bg-emerald-500 text-neutral-950 shadow-emerald-500/30 scale-[1.02]'
          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 hover:border-emerald-500/50'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 stroke-[3] text-neutral-950" />
          <span>{language === 'bn' ? 'প্রমাণ লিঙ্ক কপি হয়েছে!' : 'Proof Link Copied!'}</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'bn' ? 'প্রমাণ লিঙ্ক কপি করুন' : 'Copy Proof Link'}</span>
        </>
      )}
    </button>
  );
};
