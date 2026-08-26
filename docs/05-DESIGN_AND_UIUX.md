# 🎨 Design System & UI/UX Guidelines

Dokumen ini mendefinisikan panduan visual, palet warna, tipografi, dan referensi tata letak (*layout*) untuk platform blog.

---

## 1. 🎭 Inspirasi & Filosofi Desain

Platform ini menggabungkan 3 kekuatan desain web publishing terbaik di dunia:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           FILOSOFI DESAIN                                 │
├───────────────────┬───────────────────────────┬───────────────────────────┤
│    GHOST CMS      │         SUBSTACK          │        OVERREACTED        │
│ (Creator Studio)  │   (Personal Blog Page)    │   (Article Reading View)  │
├───────────────────┼───────────────────────────┼───────────────────────────┤
│ • Sidebar minimal │ • Hero author header card │ • Max width teks ~720px   │
│ • Sliding drawer  │ • Clean post cards & tags │ • Distraction-free        │
│ • Auto-save badge │ • Identitas `@:username`  │ • Tipografi nyaman        │
│ • Visual charts   │ • Social profile links    │ • Clean syntax code block │
└───────────────────┴───────────────────────────┴───────────────────────────┘
```

---

## 2. 🎨 CSS Variables & Design Tokens (`index.css`)

Semua styling menggunakan **Vanilla CSS Modules** dengan sistem token terpusat:

```css
:root {
  /* Colors - Light Theme */
  --bg-primary: #fcfcfd;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f4f5f7;
  --bg-glass: rgba(255, 255, 255, 0.85);

  --text-primary: #121826;
  --text-secondary: #4b5563;
  --text-muted: #9ca3af;
  --text-inverse: #ffffff;

  --accent-primary: #3b82f6;       /* Modern Indigo / Blue */
  --accent-hover: #2563eb;
  --accent-subtle: #eff6ff;
  
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;

  /* Borders & Shadows */
  --border-color: #e5e7eb;
  --border-subtle: #f3f4f6;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.07);

  /* Typography */
  --font-sans: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Border Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark Theme Support */
[data-theme='dark'] {
  --bg-primary: #0a0c10;
  --bg-secondary: #12161f;
  --bg-tertiary: #1a202c;
  --bg-glass: rgba(18, 22, 31, 0.85);

  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-muted: #6b7280;

  --border-color: #272f3d;
  --border-subtle: #1e2430;
  --accent-subtle: rgba(59, 130, 246, 0.15);
}
```

---

## 3. 📐 Layout Breakdown

### A. Dashboard Creator Studio (Ghost Style)
* **Sidebar**: Lebar tetap ~240px dengan ikon navigasi (Lucide Icons: Posts, Analytics, Settings, Visit Blog).
* **Top Header**: Breadcrumbs, indikator auto-save ("Saved" badge warna hijau), dan tombol aksi utama.
* **Editor Space**: Teks judul berukuran besar (`h1`), Tiptap editing body luas tanpa border yang mengganggu, floating/sticky format toolbar.
* **Sliding Settings Drawer**: Slide-in dari sisi kanan layar (lebar ~360px) untuk cover image, custom slug, tags, excerpt, dan publish toggle.

### B. Personal Blog Landing Page (Substack Style `/@:username`)
* **Hero Container**:
  * Tengah-atas: Avatar besar berbingkai halus.
  * Nama author dengan font tebal (`Outfit`), bio deskripsi 1-2 baris, dan link ikon sosial media.
  * Navigasi tab: *Articles*, *About*.
* **Feed Grid**:
  * Kartu artikel dengan hover lift effect (`transform: translateY(-2px)`).
  * Menampilkan cover thumbnail, tanggal rilis, estimasi reading time, dan judul artikel tebal.

### C. Single Article Reader (Overreacted Style `/@:username/:postSlug`)
* **Reading Container**: Maksimal lebar `720px` di tengah layar (*centered*).
* **Typography**:
  * Line height: `1.75` untuk kenyamanan membaca artikel panjang.
  * Heading margin yang proporsional.
  * Blockquote bergaris aksen vertikal di kiri dengan background lembut.
  * Gambar di dalam artikel memiliki border radius `10px` dan shadow halus.
  * Code blocks dengan syntax styling kontras dan tombol *Copy Code*.
