import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/stores/authStore';
import { Button } from '../ui/Form/Button';
import { Avatar } from '../ui/Display/Avatar';
import { Dropdown } from '../ui/Overlay/Dropdown';
import { ThemeToggle } from '../ui/Theme/ThemeToggle';
import { WritePostButton } from '../common/WritePostButton';
import {
  PenNib,
  Compass,
  SquaresFour,
  User as UserIcon,
  Gear,
  SignOut,
} from '@phosphor-icons/react';

export const PublicNavbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userMenuItems = [
    {
      id: 'studio',
      label: 'Studio Tulisan',
      icon: <SquaresFour size={15} />,
      onClick: () => navigate('/dashboard/posts'),
    },
    {
      id: 'profile',
      label: `Profil Publik (@${user?.username || ''})`,
      icon: <UserIcon size={15} />,
      onClick: () => navigate(`/@${user?.username}`),
    },
    {
      id: 'settings',
      label: 'Pengaturan Blog',
      icon: <Gear size={15} />,
      onClick: () => navigate('/dashboard/settings'),
    },
    {
      id: 'logout',
      label: 'Keluar',
      icon: <SignOut size={15} />,
      isDanger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-glass backdrop-blur-md border-b border-line transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 relative flex items-center justify-between">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand text-ink-inverse flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <PenNib weight="bold" size={17} />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-ink">
              Avian<span className="text-ink-muted">.</span>
            </span>
          </Link>
        </div>

        {/* Center: True Absolute Center Nav */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-ink-secondary">
          <Link to="/" className="hover:text-ink transition-colors">
            Beranda
          </Link>
          <Link
            to="/explore"
            className="flex items-center gap-1.5 hover:text-ink transition-colors"
          >
            <Compass size={16} />
            <span>Eksplorasi</span>
          </Link>
        </nav>

        {/* Right Side: Actions & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5">
              <WritePostButton
                size="sm"
                iconType="pencil"
                className="hidden sm:inline-flex"
              >
                Tulis Cerita
              </WritePostButton>

              <Dropdown
                trigger={
                  <button
                    type="button"
                    className="flex items-center cursor-pointer rounded-full ring-2 ring-transparent hover:ring-line transition-all"
                    aria-label="Menu akun pengguna"
                    aria-haspopup="menu"
                  >
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
