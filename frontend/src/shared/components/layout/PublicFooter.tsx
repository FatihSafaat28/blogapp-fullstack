import React from 'react';
import { Link } from 'react-router-dom';
import { PenNib, Heart } from '@phosphor-icons/react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-line bg-canvas py-14 mt-auto transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Top Tier: Clean Editorial Identity */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-line-subtle">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-brand text-ink-inverse flex items-center justify-center">
                <PenNib weight="bold" size={14} />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight text-ink">
                Avian Blog
              </span>
            </Link>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Platform publikasi tulisan bergaya editorial tenang. Dibuat untuk menghargai gagasan berkualitas dan kenyamanan membaca tanpa distraksi.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-xs font-medium text-ink-secondary">
            <div className="flex flex-col gap-2.5">
              <span className="text-ink font-semibold uppercase tracking-wider text-[11px]">
                Navigasi
              </span>
              <Link to="/" className="hover:text-ink transition-colors">
                Beranda
              </Link>
              <Link to="/login" className="hover:text-ink transition-colors">
                Studio Penulis
              </Link>
              <Link to="/register" className="hover:text-ink transition-colors">
                Mulai Menulis
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Taste Signature */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-ink-muted">
          <div>
            © {new Date().getFullYear()} Avian Blog. Seluruh hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-1">
            <span>Didesain dengan</span>
            <Heart weight="fill" size={13} className="text-danger inline" />
            <span>untuk para penulis mandiri.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
