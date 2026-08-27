import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useParams,
} from 'react-router-dom';
import { PublicLayout } from '../shared/components/layout/PublicLayout';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { Button } from '../shared/components/ui/Form/Button';
import { Badge } from '../shared/components/ui/Display/Badge';
import { Card } from '../shared/components/ui/Display/Card';
import { EmptyState } from '../shared/components/ui/Display/EmptyState';
import {
  Sparkles,
  ArrowRight,
  FileText,
  BarChart3,
  Settings,
  PenSquare,
} from 'lucide-react';

/* --------------------------------------------------------------------------
   TEMPORARY PLACEHOLDER VIEWS FOR UPCOMING PHASES
   -------------------------------------------------------------------------- */

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-16 pb-20 text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-xs">
        <Sparkles size={14} /> Fullstack PERN Blog Platform Live
      </div>

      <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-6">
        Publishing Modern untuk{' '}
        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Kreator Digital
        </span>
      </h1>

      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        Platform penerbitan artikel modern dengan Ghost-style Creator Studio, Substack-style Personal Profile, dan Overreacted-style Reader View.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link to="/login">
          <Button variant="primary" size="lg" iconSuffix={<ArrowRight size={18} />}>
            Buka Creator Studio
          </Button>
        </Link>
        <Link to="/register">
          <Button variant="secondary" size="lg">
            Daftar Penulis
          </Button>
        </Link>
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
        <Badge variant="published">Ghost Editor</Badge>
        <Badge variant="accent">TanStack Query v5</Badge>
        <Badge variant="published">Tailwind CSS v4</Badge>
        <Badge variant="draft">Zustand Auth</Badge>
      </div>
    </div>
  );
};

const DashboardPostsPlaceholder: React.FC = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100">
          Semua Artikel
        </h2>
        <p className="text-sm text-slate-500">Kelola dan publikasikan karya tulismu.</p>
      </div>
      <Link to="/editor/new">
        <Button variant="primary" size="sm" iconPrefix={<PenSquare size={14} />}>
          Tulis Artikel
        </Button>
      </Link>
    </div>
    <Card hoverLift>
      <EmptyState
        icon={<FileText size={32} />}
        title="Belum ada draf atau artikel"
        description="Mulai menulis artikel pertamamu di editor cerdas Ghost-style."
        actionLabel="Mulai Menulis"
        onAction={() => window.location.assign('/editor/new')}
      />
    </Card>
  </div>
);

const DashboardAnalyticsPlaceholder: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100 mb-2">
      Statistik Pembaca
    </h2>
    <p className="text-sm text-slate-500 mb-6">Pantau pertumbuhan pembaca artikelmu.</p>
    <Card hoverLift>
      <EmptyState
        icon={<BarChart3 size={32} />}
        title="Data analitik siap dikumpulkan"
        description="Grafik tren 7 & 30 hari akan tampil otomatis setelah artikelmu dibaca."
      />
    </Card>
  </div>
);

const DashboardSettingsPlaceholder: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100 mb-2">
      Pengaturan Blog & Profil
    </h2>
    <p className="text-sm text-slate-500 mb-6">Kustomisasi bio, avatar, dan tautan sosial.</p>
    <Card hoverLift>
      <EmptyState
        icon={<Settings size={32} />}
        title="Form Pengaturan (Phase 4)"
        description="Form profil terintegrasi React Hook Form & Zod siap diimplementasikan."
      />
    </Card>
  </div>
);

const EditorPlaceholder: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100 mb-2">
        {id ? `Ghost Editor - Post #${id}` : 'Ghost Editor - Draf Baru'}
      </h2>
      <p className="text-sm text-slate-500 mb-6">Tiptap rich text editor (Phase 5)</p>
      <Link to="/dashboard/posts">
        <Button variant="secondary" size="md">
          ← Kembali ke Dashboard
        </Button>
      </Link>
    </div>
  );
};

const NotFoundPage: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
    <h1 className="font-heading text-6xl font-extrabold text-indigo-600 mb-4">404</h1>
    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
      Halaman Tidak Ditemukan
    </h2>
    <p className="text-sm text-slate-500 max-w-sm mb-6">
      Tautan yang kamu tuju mungkin telah dihapus atau tidak tersedia.
    </p>
    <Link to="/">
      <Button variant="primary" size="md">
        Kembali ke Beranda
      </Button>
    </Link>
  </div>
);

/* --------------------------------------------------------------------------
   ROUTER ORCHESTRATION
   -------------------------------------------------------------------------- */

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Routes (PublicLayout) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/@:username" element={<HomePage />} />
          <Route path="/@:username/:slug" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* 2. Guest Only Routes (PublicOnlyRoute) */}
        <Route element={<PublicOnlyRoute />}>
          <Route
            path="/login"
            element={
              <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
                <Card className="max-w-md w-full p-8 text-center">
                  <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100 mb-2">
                    Masuk ke Akun
                  </h2>
                  <p className="text-sm text-slate-500 mb-6">Halaman Login (Phase 4)</p>
                  <Link to="/">
                    <Button variant="outline" size="sm">
                      ← Kembali ke Beranda
                    </Button>
                  </Link>
                </Card>
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
                <Card className="max-w-md w-full p-8 text-center">
                  <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-slate-100 mb-2">
                    Daftar Penulis Baru
                  </h2>
                  <p className="text-sm text-slate-500 mb-6">Halaman Register (Phase 4)</p>
                  <Link to="/">
                    <Button variant="outline" size="sm">
                      ← Kembali ke Beranda
                    </Button>
                  </Link>
                </Card>
              </div>
            }
          />
        </Route>

        {/* 3. Protected Dashboard Routes (ProtectedRoute + DashboardLayout) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/posts" replace />} />
            <Route path="posts" element={<DashboardPostsPlaceholder />} />
            <Route path="analytics" element={<DashboardAnalyticsPlaceholder />} />
            <Route path="settings" element={<DashboardSettingsPlaceholder />} />
          </Route>

          {/* Fullscreen Ghost Editor */}
          <Route path="/editor/new" element={<EditorPlaceholder />} />
          <Route path="/editor/:id" element={<EditorPlaceholder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
