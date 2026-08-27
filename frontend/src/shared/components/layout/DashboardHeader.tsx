import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/stores/authStore';
import { ThemeToggle } from '../ui/Theme/ThemeToggle';
import { Menu, ExternalLink } from 'lucide-react';

export interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onToggleSidebar,
  title = 'Creator Studio',
}) => {
  const { user } = useAuthStore();

  return (
    <header className="h-16 px-4 sm:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
      {/* Left: Mobile Menu Trigger + Title */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={onToggleSidebar}
            aria-label="Buka menu navigasi"
          >
            <Menu size={20} />
          </button>
        )}
        <h1 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">
          {title}
        </h1>
      </div>

      {/* Right: Quick Blog Link & Theme Toggle */}
      <div className="flex items-center gap-3">
        {user && (
          <Link
            to={`/@${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all"
          >
            <span>Lihat Blog Publik</span>
            <ExternalLink size={13} />
          </Link>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
};
