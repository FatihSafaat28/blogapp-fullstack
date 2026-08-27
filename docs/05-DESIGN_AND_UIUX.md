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

## 2. 🎨 Tailwind CSS v4 & Design Tokens (`index.css`)

Seluruh styling frontend menggunakan **Tailwind CSS v4** (`@tailwindcss/vite` & `@tailwindcss/typography`) yang disatukan dengan token CSS Variables di blok `@theme`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --font-heading: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --color-accent-primary: var(--accent-primary);
  --color-accent-hover: var(--accent-hover);
  --color-accent-subtle: var(--accent-subtle);
  
  --color-bg-primary: var(--bg-primary);
  --color-bg-secondary: var(--bg-secondary);
  --color-bg-tertiary: var(--bg-tertiary);
  --color-bg-glass: var(--bg-glass);

  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--text-muted);
}
```

### 🧩 25 Shared UI Atoms Suite (`src/shared/components/ui/`)
Seluruh komponen UI Atoms menggunakan **Pure Tailwind CSS v4** tanpa ketergantungan file `.module.css` ekstra:
1. **Form & Input (7)**: `Button.tsx`, `Input.tsx`, `Textarea.tsx`, `Select.tsx`, `Checkbox.tsx`, `TagInput.tsx`, `ImageUpload.tsx`.
2. **Data Display (7)**: `Badge.tsx`, `Card.tsx` (*glassmorphism & hoverLift*), `Avatar.tsx` (*smart initials*), `Tabs.tsx`, `Pagination.tsx`, `Divider.tsx`, `EmptyState.tsx`, `ShareButtons.tsx`.
3. **Overlays & Feedback (8)**: `Modal.tsx`, `Drawer.tsx`, `Dropdown.tsx`, `Tooltip.tsx`, `Alert.tsx`, `Spinner.tsx`, `Skeleton.tsx`, `ReadingProgressBar.tsx`.
4. **Theme & Toast (3)**: `ThemeToggle.tsx`, `Toast.tsx` + `ToastContext.tsx` + `useToast.ts`.

---

## 3. 📐 Layout Breakdown

### A. Dashboard Creator Studio (Ghost Style)
```
┌─────────────────┬──────────────────────────────────────────────────────────────────────┐
│ [Logo] Avian    │ 🔍 [ Cari artikel di draf / terbit... ]        [+ Write New Post ➔]  │
├─────────────────┼──────────────────────────────────────────────────────────────────────┤
│ 👤 Fatih Blog   │ 📝 ARTIKEL SAYA                                                      │
│    @fatih       │                                                                      │
│                 │ [ Semua (14) ]   [ Terbit / Published (9) ]   [ Draf / Drafts (5) ]  │
│ ─────────────── │ ───────────────────────────────────────────────────────────────────  │
│ 📝 Posts        │                                                                      │
│ 📈 Analytics    │ ┌──────────────────────────────────────────────────────────────────┐ │
│ ⚙️ Settings     │ │ 🌟 Memahami Driver Adapter di Prisma 7                           │ │
│                 │ │    🏷️ Web Dev · ⏱️ 5 min read · 👁️ 1,420 views                    │ │
│ ─────────────── │ │    Terbit: 26 Agu 2026                 [ 🟢 PUBLISHED ]  [ ••• ] │ │
│ 🌐 Jelajahi     │ ├──────────────────────────────────────────────────────────────────┤ │
│    Artikel (↗)  │ │ 📝 Catatan Arsitektur Multi-User PERN                            │ │
│ 🌐 Kunjungi     │ │    🏷️ Architecture · ⏱️ 3 min read · 👁️ 0 views                 │ │
│    Blog Saya ↗  │ │    Terakhir diedit: 2 menit yang lalu  [ ⚪ DRAFT ]      [ ••• ] │ │
│ ─────────────── │ └──────────────────────────────────────────────────────────────────┘ │
│ 🚪 Logout       │                                                                      │
└─────────────────┴──────────────────────────────────────────────────────────────────────┘
```
* **Sidebar**: Lebar tetap ~240px dengan ikon navigasi:
  * 📝 **Posts** (`/dashboard/posts`) &mdash; Kelola draf dan artikel terbit.
  * 📈 **Analytics** (`/dashboard/analytics`) &mdash; Pantau grafik pembaca.
  * ⚙️ **Settings** (`/dashboard/settings`) &mdash; Profil dan kustomisasi judul blog.
  * 🌐 **Jelajahi Artikel (`/explore`)** &mdash; Pintasan cepat untuk membaca artikel kreator lain di feed explore.
  * 🌐 **Kunjungi Blog Saya (`/@:username`)** &mdash; Membuka personal blog publik di tab baru.
  * 🚪 **Logout** &mdash; Keluar dari akun dengan aman.
* **Top Header**: Search input artikel dashboard, dan tombol aksi utama **`[+ Write New Post]`**.
* **Editor Space**: Teks judul besar (`h1`), Tiptap editing body luas tanpa border mengganggu, floating/sticky format toolbar.
* **Sliding Settings Drawer**: Slide-in dari sisi kanan layar (lebar ~360px) untuk cover image WebP, custom slug, tags, excerpt, dan publish toggle.

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

### D. Landing Page Layout (`/`)
* **Hero Banner**: Menyambut pengunjung dengan tagline percaya diri, background gradient halus, dan dua tombol CTA utama (*Start Writing* & *Explore Stories*).
* **Featured Bento Grid**: Menampilkan 1 artikel sorotan utama dengan cover WebP lebar + 2 artikel populer minggu ini di sisi kanan.
* **Global Story Grid**: Responsive 3-kolom grid (desktop) / 1-kolom (mobile) untuk artikel pilihan lintas kreator.

### E. Explore Discovery Hub Layout (`/explore`)
* **Discovery Header**: Search bar sentral dengan shortcut keyboard + Tab Filter Cerdas (*Trending*, *For You*, *Latest*) + Baris Tag Pills yang dapat di-scroll horizontal.
* **Split Layout 2-Kolom**:
  * **Kolom Kiri (70%)**: Feed artikel terkurasi dengan kartu artikel komprehensif (author avatar, badge tag, excerpt 2 baris, waktu baca, tanggal rilis, view counter, dan cover thumbnail).
  * **Kolom Kanan / Sidebar (30%)**:
    * Widget *Top Writers to Follow* (avatar, nama, bio, tombol `Kunjungi Blog ➔`).
    * Widget *Trending Topics Cloud* (#tag dengan counter artikel).
    * Filter Durasi Baca (*Quick Reads* < 4 min vs *Deep Dives* > 8 min).
