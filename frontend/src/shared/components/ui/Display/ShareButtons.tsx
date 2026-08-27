import React, { useState } from 'react';
import { Link2, Check, Twitter, Linkedin } from 'lucide-react';

export interface ShareButtonsProps {
  url?: string;
  title?: string;
  className?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Artikel menarik di Blog',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleTwitterShare = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedinShare = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <button
        type="button"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 shadow-sm ${
          copied
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700'
            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600'
        }`}
        onClick={handleCopyLink}
        title="Salin Tautan"
      >
        {copied ? <Check size={14} /> : <Link2 size={14} />}
        <span>{copied ? 'Tersalin! ✅' : 'Salin Tautan'}</span>
      </button>

      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 transition-all duration-150 shadow-sm"
        onClick={handleTwitterShare}
        title="Bagikan ke Twitter / X"
      >
        <Twitter size={14} />
        <span>Twitter</span>
      </button>

      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 transition-all duration-150 shadow-sm"
        onClick={handleLinkedinShare}
        title="Bagikan ke LinkedIn"
      >
        <Linkedin size={14} />
        <span>LinkedIn</span>
      </button>
    </div>
  );
};
