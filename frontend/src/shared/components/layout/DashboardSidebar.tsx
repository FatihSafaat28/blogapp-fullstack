import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  PenNib,
  Article,
  ChartLineUp,
  Gear,
  ArrowSquareOut,
  SignOut,
  X,
} from '@phosphor-icons/react';
import { useAuthStore } from '../../../features/auth/stores/authStore';
import { Avatar } from '../ui/Display/Avatar';
import { WritePostButton } from '../common/WritePostButton';

export const DashboardSidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard/posts', label: 'Semua Artikel', icon: <Article size={18} /> },
    { to: '/dashboard/analytics', label: 'Statistik & Analitik', icon: <ChartLineUp size={18} /> },
    { to: '/dashboard/settings', label: 'Pengaturan Blog', icon: <Gear size={18} /> },
  ];

  return (
    <aside className="w-64 h-full bg-card border-r border-line flex flex-col justify-between p-4 select-none transition-colors">
      <div className="flex flex-col gap-6">
        {/* Studio Brand */}
        <div className="flex items-center justify-between px-2">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-ink-inverse shadow-xs">
              <PenNib size={17} weight="bold" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base tracking-tight text-ink">
                Avian<span className="text-ink-muted">.</span>
              </span>
              <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider">
                Creator Studio
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              type="button"
              className="lg:hidden p-1 text-ink-muted hover:text-ink rounded-lg cursor-pointer"
              onClick={onClose}
              aria-label="Tutup menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Action Button */}
        <WritePostButton
          size="md"
          fullWidth
          iconType="pencil"
          onBeforeCreate={onClose}
        >
          Tulis Cerita Baru
        </WritePostButton>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-muted text-ink border border-line'
                    : 'text-ink-secondary hover:bg-muted/60 hover:text-ink'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Footer */}
      <div className="flex flex-col gap-2 pt-4 border-t border-line">
        {user && (
          <Link
            to={`/@${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/60 transition-colors group"
            title="Buka Blog Publik"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar src={user.avatar} name={user.fullName || user.username} size="sm" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-ink truncate">
                  {user.fullName || user.username}
                </span>
                <span className="text-[11px] text-ink-muted truncate">@{user.username}</span>
              </div>
            </div>
            <ArrowSquareOut size={14} className="text-ink-muted group-hover:text-ink transition-colors shrink-0" />
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-danger hover:bg-danger-bg transition-colors text-left cursor-pointer"
        >
          <SignOut size={15} />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
};
