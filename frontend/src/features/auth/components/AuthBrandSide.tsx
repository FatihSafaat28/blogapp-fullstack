import React from 'react';
import { Link } from 'react-router-dom';
import { PenNib, Sparkle } from '@phosphor-icons/react';
import { Avatar } from '../../../shared/components/ui/Display/Avatar';

interface AuthBrandSideProps {
  tag?: string;
  quote: string;
  subtext: string;
  authorName?: string;
  authorHandle?: string;
  authorAvatar?: string;
}

export const AuthBrandSide: React.FC<AuthBrandSideProps> = ({
  tag = 'Ruang Gagasan',
  quote,
  subtext,
  authorName = 'Fatih Safaat',
  authorHandle = 'avianblog.com/@fatihsafaat',
  authorAvatar = 'https://picsum.photos/seed/fatih-writer/120/120',
}) => {
  return (
    <div className="hidden md:flex flex-col justify-between p-10 lg:p-12 bg-muted border-r border-line transition-colors">
      {/* Brand Top Header with Link to Homepage */}
      <Link
        to="/"
        className="inline-flex items-center gap-2.5 font-bold text-lg tracking-tight text-ink group w-fit cursor-pointer"
        title="Kembali ke Beranda"
      >
        <div className="w-7 h-7 rounded-md bg-brand text-ink-inverse flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform">
          <PenNib weight="bold" size={15} />
        </div>
        <span className="font-heading font-bold group-hover:text-ink-secondary transition-colors">
          Avian Blog
        </span>
      </Link>

      {/* Center Manifesto / Quote */}
      <div className="my-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted mb-3 tracking-wide uppercase font-mono">
          <Sparkle weight="bold" size={13} className="text-warning" />
          <span>{tag}</span>
        </div>
        <blockquote className="font-serif text-2xl lg:text-[1.7rem] leading-snug font-normal text-ink tracking-tight mb-4">
          {quote}
        </blockquote>
        <p className="text-sm text-ink-secondary leading-relaxed max-w-[36ch]">
          {subtext}
        </p>
      </div>

      {/* Bottom Author Badge */}
      <div className="flex items-center gap-3.5 pt-6 border-t border-line">
        <Avatar src={authorAvatar} name={authorName} size="md" />
        <div>
          <h4 className="text-sm font-semibold text-ink">{authorName}</h4>
          <p className="text-xs text-ink-muted font-mono">{authorHandle}</p>
        </div>
      </div>
    </div>
  );
};
