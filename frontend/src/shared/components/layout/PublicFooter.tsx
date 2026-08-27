import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Heart } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Feather size={15} />
            </div>
            <span className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">
              Avian Blog
            </span>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Platform penerbitan artikel modern untuk para kreator, pemikir, dan pembaca berkelas.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Beranda
          </Link>
          <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Masuk Creator
          </Link>
          <Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Daftar Penulis
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 justify-center">
          <span>Dibuat dengan</span>
          <Heart size={12} className="text-rose-500 fill-rose-500" />
          <span>menggunakan PERN Stack</span>
        </div>
      </div>
    </footer>
  );
};
