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
import { Card } from '../shared/components/ui/Display/Card';
import { EmptyState } from '../shared/components/ui/Display/EmptyState';
import { Avatar } from '../shared/components/ui/Display/Avatar';
import { Badge } from '../shared/components/ui/Display/Badge';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { SettingsPage } from '../features/settings/pages/SettingsPage';
import {
  Sparkle,
  ArrowRight,
  NotePencil,
  Article,
  ChartLineUp,
  FileText,
  ChartBar,
  Eye,
  Clock,
} from '@phosphor-icons/react';

/* --------------------------------------------------------------------------
   EDITORIAL HOMEPAGE (Taste-Skill Masterpiece)
   -------------------------------------------------------------------------- */

const HomePage: React.FC = () => {
  return (
    <div className="relative">
      {/* 1. HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        {/* Editorial Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted border border-line text-ink text-xs font-mono mb-8">
          <Sparkle weight="bold" size={13} className="text-warning" />
          <span>Ruang Publikasi Penulis & Pemikir</span>
        </div>

        {/* Display Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-ink tracking-tight leading-[1.12] mb-6 max-w-4xl mx-auto">
          Tempat ide besar ditulis dengan tenang, <br className="hidden sm:inline" />
          <em className="italic text-ink-muted">dan dibaca dengan seksama.</em>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-ink-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          Ruang menulis cerdas yang memadukan studio editor Tiptap, halaman profil publik bersahaja ala Substack, dan pengalaman membaca nyaman tanpa kebisingan iklan.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
          <Link to="/register">
            <Button variant="primary" size="lg" iconSuffix={<ArrowRight weight="bold" size={16} />}>
              Mulai Menulis Gratis
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Buka Studio Tulisan
            </Button>
          </Link>
        </div>

        {/* Minimalist Micro Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-ink-muted">
          <span className="px-2.5 py-1 rounded bg-muted border border-line">✦ Ghost Editor</span>
          <span className="px-2.5 py-1 rounded bg-muted border border-line">✦ Domain @username</span>
          <span className="px-2.5 py-1 rounded bg-muted border border-line">✦ Overreacted Reader</span>
          <span className="px-2.5 py-1 rounded bg-muted border border-line">✦ 60m Deduplicated Analytics</span>
        </div>
      </section>

      {/* 2. FEATURED LIVE ARTICLE SHOWCASE (EDITORIAL TILE) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="p-1 rounded-2xl bg-muted/50 border border-line">
          <div className="p-6 sm:p-8 rounded-[14px] bg-card border border-line shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-line-subtle">
              <div className="flex items-center gap-3">
                <Avatar
                  src="https://picsum.photos/seed/fatih-writer/80/80"
                  name="Fatih Safaat"
                  size="md"
                />
                <div>
                  <h4 className="text-sm font-semibold text-ink">Fatih Safaat</h4>
                  <p className="text-xs text-ink-muted font-mono">avianblog.com/@fatihsafaat</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-ink-muted font-mono">
                <span className="inline-flex items-center gap-1"><Clock size={14} /> 5 min baca</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1"><Eye size={14} /> 1,420 pembaca</span>
              </div>
            </div>

            <span className="inline-block text-xs font-mono uppercase tracking-wider text-warning mb-2 font-semibold">
              ✦ Catatan Arsitektur
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-ink tracking-tight mb-3">
              Membangun Ruang Menulis yang Tidak Menuntut Waktumu
            </h2>
            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed mb-6 line-clamp-2">
              Di tengah era konten instan, kita merindukan platform sederhana di mana teks berbobot dihargai, tipografi dirawat, dan pembaca tidak dibombardir pop-up banner.
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-line-subtle text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="tag">#webdev</Badge>
                <Badge variant="tag">#writing</Badge>
              </div>
              <Link to="/register" className="font-semibold text-ink underline underline-offset-4 hover:text-ink-secondary">
                Baca simulasi artikel ➔
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE PILLARS BENTO GRID */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-serif text-3xl font-medium text-ink mb-2">
            Tiga Pilar Avian Studio
          </h2>
          <p className="text-sm text-ink-secondary">
            Didesain khusus untuk menghadirkan kenyamanan menulis dan kemudahan membaca.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl bg-card border border-line shadow-xs hover:border-ink-muted transition-colors">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-ink mb-5">
              <NotePencil size={20} weight="bold" />
            </div>
            <h3 className="font-serif font-medium text-xl text-ink mb-2">
              Ghost-Style Studio
            </h3>
            <p className="text-sm text-ink-secondary leading-relaxed">
              Editor Tiptap yang responsif dengan auto-save 1.5 detik, sliding drawer untuk cover WebP, dan kustomisasi slug artikel.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-card border border-line shadow-xs hover:border-ink-muted transition-colors">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-ink mb-5">
              <Article size={20} weight="bold" />
            </div>
            <h3 className="font-serif font-medium text-xl text-ink mb-2">
              Profil Publik Substack
            </h3>
            <p className="text-sm text-ink-secondary leading-relaxed">
              Domain profil personal eksklusif <code className="text-xs px-1.5 py-0.5 rounded bg-muted text-ink font-mono">/@username</code> untuk menampilkan seluruh arsip tulisanmu.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-card border border-line shadow-xs hover:border-ink-muted transition-colors">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-ink mb-5">
              <ChartLineUp size={20} weight="bold" />
            </div>
            <h3 className="font-serif font-medium text-xl text-ink mb-2">
              Statistik Akurat 60 Menit
            </h3>
            <p className="text-sm text-ink-secondary leading-relaxed">
              Deduplikasi view counter cerdas dengan visual grafik Recharts untuk memantau performa tanpa manipulasi refresh.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WARM WRITER INVITATION BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 text-center">
        <div className="p-8 sm:p-12 rounded-2xl bg-muted border border-line">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-ink mb-3">
            Mulai Cerita Pertamamu Hari Ini.
          </h2>
          <p className="text-sm text-ink-secondary max-w-md mx-auto mb-8 leading-relaxed">
            Gratis selamanya untuk penulis mandiri. Buat akun dalam hitungan detik dan nikmati ruang menulis yang lapang.
          </p>
          <Link to="/register">
            <Button variant="primary" size="lg" iconSuffix={<ArrowRight weight="bold" size={16} />}>
              Daftar Penulis Baru
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

/* --------------------------------------------------------------------------
   DASHBOARD PLACEHOLDERS
   -------------------------------------------------------------------------- */

const DashboardPostsPlaceholder: React.FC = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-ink">
          Semua Artikel
        </h2>
        <p className="text-sm text-ink-muted">Kelola dan publikasikan karya tulismu.</p>
      </div>
      <Link to="/editor/new">
        <Button variant="primary" size="sm" iconPrefix={<NotePencil size={14} weight="bold" />} >
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
    <h2 className="text-2xl font-bold font-heading text-ink mb-2">
      Statistik Pembaca
    </h2>
    <p className="text-sm text-ink-muted mb-6">Pantau pertumbuhan pembaca artikelmu.</p>
    <Card hoverLift>
      <EmptyState
        icon={<ChartBar size={32} />}
        title="Data analitik siap dikumpulkan"
        description="Grafik tren 7 & 30 hari akan tampil otomatis setelah artikelmu dibaca."
      />
    </Card>
  </div>
);

const EditorPlaceholder: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  return (
    <div className="min-h-screen bg-canvas p-6 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold font-heading text-ink mb-2">
        {id ? `Ghost Editor - Post #${id}` : 'Ghost Editor - Draf Baru'}
      </h2>
      <p className="text-sm text-ink-muted mb-6">Tiptap rich text editor (Phase 5)</p>
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
    <h1 className="font-serif text-6xl font-bold text-ink mb-4">404</h1>
    <h2 className="text-2xl font-medium text-ink mb-2">
      Halaman Tidak Ditemukan
    </h2>
    <p className="text-sm text-ink-muted max-w-sm mb-6">
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* 3. Protected Dashboard Routes (ProtectedRoute + DashboardLayout) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/posts" replace />} />
            <Route path="posts" element={<DashboardPostsPlaceholder />} />
            <Route path="analytics" element={<DashboardAnalyticsPlaceholder />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fullscreen Ghost Editor */}
          <Route path="/editor/new" element={<EditorPlaceholder />} />
          <Route path="/editor/:id" element={<EditorPlaceholder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
