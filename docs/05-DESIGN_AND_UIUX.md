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

---

## 2. 🎨 Tailwind CSS v4 & Single Source of Truth (`src/styles/index.css`)

Seluruh styling frontend dikontrol secara terpusat oleh **`src/styles/index.css`** sebagai Single Source of Truth (Design Controller). Token semantik dirancang untuk menghasilkan zero property collision / bebas `cssConflict` di Tailwind CSS v4:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* 1. Controller Variables */
:root {
  --bg-canvas: #FAF9F6;           /* Warm Alabaster Canvas (Light) */
  --bg-card: #FFFFFF;             /* Pure White Paper Surface */
  --bg-muted: #F4F2EB;            /* Warm Off-White Accent / Pill */
  --bg-glass: rgba(250, 249, 246, 0.85);
  --border-line: #E8E6E1;         /* Soft Natural Divider */
  --border-line-subtle: #F0EEEA;
  --text-ink: #18181B;            /* Soft Deep Charcoal */
  --text-ink-secondary: #52525B;
  --text-ink-muted: #A1A1AA;
  --text-ink-inverse: #FFFFFF;
  --brand-primary: #18181B;
  --brand-hover: #27272A;
}

.dark, [data-theme='dark'] {
  --bg-canvas: #121214;           /* Warm Matte Charcoal (Dark) */
  --bg-card: #18181B;             /* Clean Elevated Ink Card */
  --bg-muted: #202024;            /* Dark Subtle Muted Surface */
  --bg-glass: rgba(18, 18, 20, 0.85);
  --border-line: #27272A;
  --border-line-subtle: #1F1F23;
  --text-ink: #F4F4F5;            /* Off-White Alabaster */
  --text-ink-secondary: #A1A1AA;
  --text-ink-muted: #71717A;
  --text-ink-inverse: #18181B;
  --brand-primary: #F4F4F5;
  --brand-hover: #E4E4E7;
}

/* 2. Tailwind v4 @theme Binding (Zero Property Collision) */
@theme {
  --color-canvas: var(--bg-canvas);
  --color-card: var(--bg-card);
  --color-muted: var(--bg-muted);
  --color-glass: var(--bg-glass);
  --color-ink: var(--text-ink);
  --color-ink-secondary: var(--text-ink-secondary);
  --color-ink-muted: var(--text-ink-muted);
  --color-ink-inverse: var(--text-ink-inverse);
  --color-line: var(--border-line);
  --color-line-subtle: var(--border-line-subtle);
  --color-brand: var(--brand-primary);
  --color-brand-hover: var(--brand-hover);
}
```

---

## 3. 🚨 PROTOKOL WAJIB: COMPONENT-FIRST (Cek Komponen Sebelum Coding View)

> [!IMPORTANT]
> **ATURAN MUTLAK KONSISTENSI DESAIN**:
> Sebelum membuat halaman baru, modal baru, form baru, atau widget baru, **DEVELOPER & AI AGENT WAJIB MEMERIKSA DAFTAR KOMPONEN DI `src/shared/components/ui/` TERLEBIH DAHULU**.
> 
> ❌ **DILARANG**: Menulis tag HTML mentah seperti `<button>`, `<input>`, `<select>`, `<textarea>`, `<span className="badge">`, `<div className="alert">`, `<img className="avatar">`, atau `<div className="modal">` secara manual di file page/view.
> ✅ **WAJIB**: Mengimpor dan menggunakan komponen reusable dari `src/shared/components/ui/` (atau `@/shared/components/ui`).

---

## 4. 🧩 Katalog Lengkap 25 UI Components (`src/shared/components/ui/`)

| Kategori | Komponen | Lokasi Import | Kegunaan Utama & Contoh |
|---|---|---|---|
| **Form** | `<Button>` | `shared/components/ui/Form/Button` | Tombol primer, sekunder, ghost, outline, danger. Mendukung `isLoading` (spinner otomatis), `iconPrefix`, `iconSuffix`, `fullWidth`. |
| **Form** | `<Input>` | `shared/components/ui/Form/Input` | Input teks terstandar dengan label, iconPrefix, iconSuffix/toggle password, error message Zod, dan onClear. |
| **Form** | `<Textarea>` | `shared/components/ui/Form/Textarea` | Textarea auto-styled untuk bio, excerpt, atau deskripsi panjang. |
| **Form** | `<Select>` | `shared/components/ui/Form/Select` | Dropdown select kustom dengan icon CaretDown dan styling token. |
| **Form** | `<Checkbox>` | `shared/components/ui/Form/Checkbox` | Checkbox aksesibel dengan indikator centang kustom (*Remember me, accept terms*). |
| **Form** | `<TagInput>` | `shared/components/ui/Form/TagInput` | Input tag artikel interaktif dengan batas maksimal tag dan badge hapus (*Phase 5*). |
| **Form** | `<ImageUpload>` | `shared/components/ui/Form/ImageUpload` | Area drag-and-drop unggah avatar / cover WebP dengan preview (*Phase 4/5*). |
| **Display** | `<Avatar>` | `shared/components/ui/Display/Avatar` | Avatar pengguna dengan fallback inisial pintar & background gradien editorial (*sm, md, lg, xl*). |
| **Display** | `<Badge>` | `shared/components/ui/Display/Badge` | Pill label status artikel (`published`, `draft`, `accent`, `tag`). |
| **Display** | `<Card>` | `shared/components/ui/Display/Card` | Wadah kartu konten dengan varian default, glass, dan efek `hoverLift`. |
| **Display** | `<Tabs>` | `shared/components/ui/Display/Tabs` | Tab navigasi filter konten (*Trending, Latest, Drafts*). |
| **Display** | `<Pagination>` | `shared/components/ui/Display/Pagination` | Komponen navigasi nomor halaman artikel yang responsif. |
| **Display** | `<Divider>` | `shared/components/ui/Display/Divider` | Garis pembatas halus dengan label teks opsional di tengah. |
| **Display** | `<EmptyState>` | `shared/components/ui/Display/EmptyState` | Tampilan placeholder ramah saat artikel atau data analitik masih kosong. |
| **Display** | `<ShareButtons>` | `shared/components/ui/Display/ShareButtons` | Tombol bagikan artikel ke Twitter, LinkedIn, Facebook, dan Salin Tautan. |
| **Overlay** | `<Modal>` | `shared/components/ui/Overlay/Modal` | Dialog modal popup konfirmasi hapus artikel, aksi penting, atau dialog form. |
| **Overlay** | `<Drawer>` | `shared/components/ui/Overlay/Drawer` | Panel sliding kanan Ghost-style untuk pengaturan post & metadata artikel. |
| **Overlay** | `<Dropdown>` | `shared/components/ui/Overlay/Dropdown` | Menu melayang (*floating popover*) untuk profil pengguna dan opsi artikel (`•••`). |
| **Overlay** | `<Tooltip>` | `shared/components/ui/Overlay/Tooltip` | Tooltip petunjuk micro-interaction saat tombol di-hover. |
| **Feedback**| `<Alert>` | `shared/components/ui/Feedback/Alert` | Banner notifikasi inline (`info`, `success`, `warning`, `danger`) untuk server error atau peringatan. |
| **Feedback**| `<Spinner>` | `shared/components/ui/Feedback/Spinner` | Indikator loading memutar dengan ukuran `sm, md, lg`. |
| **Feedback**| `<Skeleton>` | `shared/components/ui/Feedback/Skeleton` | Placeholder loading shimmer saat data artikel sedang di-fetch. |
| **Feedback**| `<ReadingProgressBar>` | `shared/components/ui/Feedback/ReadingProgressBar` | Bar indikator progres baca tipis 3px di bagian paling atas layar artikel. |
| **Theme**   | `<ThemeToggle>` | `shared/components/ui/Theme/ThemeToggle` | Tombol switch instan Light Mode ↔ Dark Mode. |
| **Toast**   | `useToast()` / `<Toast>` | `shared/components/ui/Toast` | Hook & komponen notifikasi pop-up global (*success, error, warning, info*). |

## 5. 🏛️ Standar Desain Resmi & Anti-Slop Guidelines (Wajib Dipatuhi)

Untuk seluruh pengembangan halaman berikutnya (Explore, Dashboard, Post Editor, Personal Blog, Reader View), **wajib mematuhi standar desain berikut**:

### A. Palet Tema & Warna (Warm Editorial vs Matte Charcoal)
- ❌ **DILARANG**: Menggunakan background biru gelap elektrik, ungu neon murahan, atau AI-gradient blob yang berlebihan.
- ☀️ **Light Theme**:
  - Background Canvas: **Warm Alabaster / Architectural Paper** (`#FAF9F6`).
  - Card/Container Surface: **Pure Clean White** (`#FFFFFF`) dengan border `1px solid #E8E6E1`.
  - Teks: **Soft Deep Charcoal** (`#18181B`) & Slate (`#52525B`). Hindari pure black `#000000`.
- 🌙 **Dark Theme**:
  - Background Canvas: **Matte Deep Charcoal / Warm Obsidian** (`#121214`).
  - Card/Container Surface: **Elevated Matte Ink** (`#18181B`) dengan border `1px solid #27272A`.
  - Teks: **Off-White Alabaster** (`#F4F4F5`) & Muted Slate (`#A1A1AA`).

### B. Tipografi Berkelas & Hirarki
1. **Editorial Serif (`font-serif: 'Newsreader'`)**:
   - Digunakan untuk: Judul halaman utama, H1/H2, kutipan manifesto/blockquote, dan heading artikel panjang (*Substack/New Yorker feel*).
   - Pengaturan: `tracking-tight` (`-0.025em`) dengan line-height proporsional.
2. **Modern Sans (`font-sans: 'Inter' / 'Outfit'`)**:
   - Digunakan untuk: Label form, body teks bacaan, menu navigasi, dan tombol aksi.
3. **Monospace (`font-mono: 'JetBrains Mono'`)**:
   - Digunakan untuk: Live username slug (`/@username`), timestamp baca, tag metadata, dan code snippets.

### C. Standar Iconography: **Phosphor Icons (`@phosphor-icons/react`)**
- ❌ **DILARANG**: Mencampur berbagai icon pack dalam satu view.
- ✅ **STANDAR RESMI**: Menggunakan **Phosphor Icons** (`@phosphor-icons/react`) dengan bobot `regular` atau `bold` untuk tampilan yang tegas, bersih, dan berbobot (*weighted stroke*).

### D. UX Writing yang Hangat & Manusiawi (*Friendly UX*)
- Gunakan bahasa yang menyambut dan bersahabat (*"Senang melihatmu kembali"*, *"Tuliskan apa yang kamu pelajari hari ini"*).
- Sertakan *micro-tips* yang membantu (*"💡 Tips: Gunakan kombinasi huruf dan angka"*).
- Berikan *tactile action response* pada tombol (`active:scale-[0.99]`).

---

## 6. 📐 Layout Breakdown

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

---

## 7. ♿ Standar Aksesibilitas Web (a11y) & HTML Best Practices

Untuk memastikan platform dapat diakses oleh semua kalangan (termasuk pengguna screen reader dan keyboard navigation) serta menjaga skor kepatuhan Chrome DevTools tetap 100%:

1. **Form & Label Associations**:
   - Setiap input teks, textarea, dan select **wajib memiliki atribut `id` dan `name`**, serta terhubung langsung dengan elemen `<label htmlFor={id}>`.
   - Komponen UI Kit (`Input`, `Textarea`, `Select`, `TagInput`, `ImageUpload`) mengimplementasikan `React.useId()` secara otomatis sehingga tidak ada field yang terabaikan (*orphaned inputs*).

2. **Accessible Names pada Tombol Icon**:
   - Tombol yang hanya memuat ikon (seperti tombol silang close dialog, tombol ganti tema, tombol hapus, trigger menu) **wajib memiliki atribut `aria-label`** (contoh: `aria-label="Tutup dialog"`).

3. **WAI-ARIA Semantics & Status**:
   - Modal dan Drawer wajib menggunakan `role="dialog"`, `aria-modal="true"`, dan `aria-label={title}`.
   - Tab filter wajib menggunakan `role="tablist"` pada kontainer, serta `role="tab"` dan `aria-selected={isActive}` pada tombol tab.
   - Loading Spinner wajib menggunakan `role="status"` dan `aria-label="Memuat data..."`.
   - Dropdown menu wajib menggunakan `role="menu"` pada popover dan `role="menuitem"` pada opsi-opsinya.
