import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/stores/authStore';
import { Avatar } from '../ui/Display/Avatar';
import { Button } from '../ui/Form/Button';
import {
  Feather,
  PenSquare,
  FileText,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react';

export const DashboardSidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard/posts', label: 'Semua Artikel', icon: <FileText size={18} /> },
    { to: '/dashboard/analytics', label: 'Statistik & Analitik', icon: <BarChart3 size={18} /> },
    { to: '/dashboard/settings', label: 'Pengaturan Blog', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between p-4 select-none transition-colors">
      <div className="flex flex-col gap-6">
        {/* Studio Brand */}
        <div className="flex items-center justify-between px-2">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/25">
              <Feather size={17} />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">
                Avian<span className="text-indigo-600 dark:text-indigo-400">.</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Creator Studio
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              type="button"
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              onClick={onClose}
              aria-label="Tutup menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Action Button */}
        <Link to="/editor/new" onClick={onClose}>
          <Button variant="primary" size="md" fullWidth iconPrefix={<PenSquare size={16} />}>
            Tulis Artikel Baru
          </Button>
        </Link>

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
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
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
      <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        {user && (
          <Link
            to={`/@${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
            title="Buka Blog Publik"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar src={user.avatar} name={user.fullName || user.username} size="sm" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {user.fullName || user.username}
                </span>
                <span className="text-[11px] text-slate-400 truncate">@{user.username}</span>
              </div>
            </div>
            <ExternalLink size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
          </Link>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
        >
          <LogOut size={15} />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
};
