import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const StarterHome: React.FC = () => {
  return (
    <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 1rem',
          borderRadius: '9999px',
          background: 'var(--accent-subtle)',
          color: 'var(--accent-primary)',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
        }}
      >
        ✨ Phase 0 Initialized & Ready
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
        Multi-User PERN Blog Platform
      </h1>
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '1.125rem',
          maxWidth: '600px',
          margin: '0 auto 2.5rem',
        }}
      >
        Platform blog modern dengan Creator Studio Ghost-style, Personal Page Substack-style, dan Reading View Overreacted-style.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link
          to="/login"
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-primary)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            boxShadow: 'var(--shadow-md)',
          }}
        >
          Masuk ke Dashboard
        </Link>
        <Link
          to="/register"
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
          }}
        >
          Daftar Penulis
        </Link>
      </div>
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StarterHome />} />
        <Route
          path="/login"
          element={
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
              <h2>Halaman Login (Phase 4)</h2>
              <Link to="/" style={{ color: 'var(--accent-primary)', marginTop: '1rem', display: 'inline-block' }}>
                Kembali ke Beranda
              </Link>
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
              <h2>Halaman Register (Phase 4)</h2>
              <Link to="/" style={{ color: 'var(--accent-primary)', marginTop: '1rem', display: 'inline-block' }}>
                Kembali ke Beranda
              </Link>
            </div>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
              <h2>Dashboard Studio (Phase 5)</h2>
              <Link to="/" style={{ color: 'var(--accent-primary)', marginTop: '1rem', display: 'inline-block' }}>
                Kembali ke Beranda
              </Link>
            </div>
          }
        />
        <Route
          path="/@:username"
          element={
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
              <h2>Personal Blog Creator (Phase 7)</h2>
            </div>
          }
        />
        <Route
          path="/@:username/:slug"
          element={
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
              <h2>Article Reader (Phase 7)</h2>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
