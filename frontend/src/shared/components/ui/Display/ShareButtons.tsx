import React, { useState } from 'react';
import { Link, Check, TwitterLogo, LinkedinLogo } from '@phosphor-icons/react';

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
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 shadow-xs cursor-pointer ${
          copied
            ? 'bg-success-bg text-success border-success-border'
            : 'bg-card text-ink-secondary border-line hover:border-ink hover:text-ink'
        }`}
        onClick={handleCopyLink}
        title="Salin Tautan"
      >
        {copied ? <Check size={14} weight="bold" /> : <Link size={14} />}
        <span>{copied ? 'Tersalin! ✅' : 'Salin Tautan'}</span>
      </button>

      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-card text-ink-secondary border border-line hover:border-ink hover:text-ink transition-all duration-150 shadow-xs cursor-pointer"
        onClick={handleTwitterShare}
        title="Bagikan ke Twitter / X"
      >
        <TwitterLogo size={14} />
        <span>Twitter</span>
      </button>

      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-card text-ink-secondary border border-line hover:border-ink hover:text-ink transition-all duration-150 shadow-xs cursor-pointer"
        onClick={handleLinkedinShare}
        title="Bagikan ke LinkedIn"
      >
        <LinkedinLogo size={14} />
        <span>LinkedIn</span>
      </button>
    </div>
  );
};
