import React from 'react';
import { Link } from 'react-router-dom';
import { List, ArrowSquareOut } from '@phosphor-icons/react';
import { useAuthStore } from '../../../features/auth/stores/authStore';
import { ThemeToggle } from '../ui/Theme/ThemeToggle';

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
    <header className="h-16 px-4 sm:px-6 bg-glass backdrop-blur-md border-b border-line flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
      {/* Left: Mobile Menu Trigger + Title */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-ink-secondary hover:bg-muted transition-colors cursor-pointer"
            onClick={onToggleSidebar}
            aria-label="Buka menu navigasi"
          >
            <List size={20} />
          </button>
        )}
        <h1 className="font-heading font-bold text-lg text-ink">
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-secondary hover:text-ink border border-line hover:border-ink transition-all"
          >
            <span>Lihat Blog Publik</span>
            <ArrowSquareOut size={13} />
          </Link>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
};
