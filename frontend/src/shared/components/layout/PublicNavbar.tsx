import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/stores/authStore';
import { Button } from '../ui/Form/Button';
import { Avatar } from '../ui/Display/Avatar';
import { Dropdown } from '../ui/Overlay/Dropdown';
import { ThemeToggle } from '../ui/Theme/ThemeToggle';
import {
  Feather,
  PenSquare,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Compass,
} from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Studio',
      icon: <LayoutDashboard size={15} />,
      onClick: () => navigate('/dashboard/posts'),
    },
    {
      id: 'profile',
      label: `Profil Saya (@${user?.username || ''})`,
      icon: <User size={15} />,
      onClick: () => navigate(`/@${user?.username}`),
    },
    {
      id: 'settings',
      label: 'Pengaturan Akun',
      icon: <Settings size={15} />,
      onClick: () => navigate('/dashboard/settings'),
    },
    {
      id: 'logout',
      label: 'Keluar',
      icon: <LogOut size={15} />,
      isDanger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Feather size={19} />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-100">
            Avian<span className="text-indigo-600 dark:text-indigo-400">.</span>
          </span>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-400">
          <Link
            to="/"
            className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Compass size={16} /> Explore Feed
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link to="/editor/new" className="hidden sm:inline-block">
                <Button
                  variant="primary"
                  size="sm"
                  iconPrefix={<PenSquare size={14} />}
                >
                  Tulis Cerita
                </Button>
              </Link>

              <Dropdown
                trigger={
                  <button className="flex items-center cursor-pointer rounded-full ring-2 ring-transparent hover:ring-indigo-500/30 transition-all">
                    <Avatar
                      src={user.avatar}
                      name={user.fullName || user.username}
                      size="sm"
                    />
                  </button>
                }
                items={userMenuItems}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Masuk
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Mulai Menulis
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
