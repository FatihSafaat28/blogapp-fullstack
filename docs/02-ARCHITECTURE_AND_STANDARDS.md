# 🏛️ Architecture & Clean Code Standards

Dokumen ini mendefinisikan aturan rekayasa perangkat lunak, konvensi penamaan, dan arsitektur kode untuk **Frontend** dan **Backend**. Semua developer dan AI assistant **wajib** mematuhi aturan ini.

---

## 1. 📏 Golden Rule: Maksimal 300 Baris Kode per File (< 300 LOC)

> [!IMPORTANT]
> **Tidak ada file sumber (source file) yang boleh melebihi 300 baris kode.**

### Cara Memecah File yang Membengkak:
1. **Frontend View**: Jika sebuah komponen JSX panjang, pecah menjadi sub-komponen terpisah di dalam folder `components/` (misalnya: `PostEditorHeader.tsx`, `PostEditorToolbar.tsx`, `PostEditorDrawer.tsx`).
2. **Frontend Presenter**: Jika sebuah custom hook logic terlalu gemuk, pisahkan helper state atau sub-handlers ke hook yang lebih spesifik (misalnya: `usePostAutoSave.ts`, `usePostSettings.ts`).
3. **Backend Service**: Jika file service memuat banyak domain query, pecah ke sub-service atau helper terdedikasi (misalnya: `posts-analytics.helper.ts`, `posts-slug.helper.ts`).

---

## 2. 🎨 Frontend Architecture: MVP (Model-View-Presenter) Pattern

Untuk menjaga pemisahan tanggung jawab (*Separation of Concerns*) dan keterbacaan yang tinggi, setiap fitur di frontend mengadopsi pola **MVP**:

```
                       ┌────────────────────────┐
                       │   View (*.view.tsx)    │
                       │   Murni JSX & Styling  │
                       └───────────▲────────────┘
                                   │ Props & Events
                                   │
                       ┌───────────┴────────────┐
                       │ Presenter (use*.ts)    │
                       │ State, Handlers, Form  │
                       └───────────▲────────────┘
                                   │ Calls API / Queries
                                   │
                       ┌───────────┴────────────┐
                       │ Model (*.service.ts)   │
                       │ TanStack Query, Types  │
                       └────────────────────────┘
```

### Struktur Folder Fitur Frontend:
```
frontend/src/features/dashboard/posts/
├── components/                  # [VIEW] Sub-komponen visual kecil (< 150 LOC)
│   ├── PostCard.tsx
│   ├── PostFilterTabs.tsx
│   ├── PostEditorToolbar.tsx
│   └── PostSettingsDrawer.tsx
├── hooks/                       # [PRESENTER] Logic, event handlers, validation
│   ├── usePostListPresenter.ts
│   ├── usePostEditorPresenter.ts
│   └── usePostAutoSave.ts
├── services/                    # [MODEL] Data fetching, API calls, TanStack Query
│   ├── posts.api.ts
│   └── posts.queries.ts
├── types/                       # Definisi TypeScript interface
│   └── post.types.ts
└── pages/                       # Orchestrator halaman untuk Router (Pure Tailwind CSS)
    ├── PostListPage.tsx
    └── PostEditorPage.tsx
```

### 🚨 Aturan Wajib: Component-First
Sebelum menyusun JSX di file View atau Page:
1. Cek folder `src/shared/components/ui/` (atau katalog di `docs/05-DESIGN_AND_UIUX.md`).
2. Gunakan komponen UI yang telah disediakan (`Button`, `Input`, `Select`, `Textarea`, `Checkbox`, `TagInput`, `ImageUpload`, `Avatar`, `Badge`, `Card`, `Tabs`, `Pagination`, `Divider`, `EmptyState`, `ShareButtons`, `Modal`, `Drawer`, `Dropdown`, `Tooltip`, `Alert`, `Spinner`, `Skeleton`, `ReadingProgressBar`, `ThemeToggle`, `Toast`).
3. Dilarang menulis tag input/button/alert/badge/modal secara manual jika sudah tersedia komponen resminya.

### ♿ Standar Aksesibilitas (a11y) & HTML Best Practice:
1. **Form & Label Binding**: Seluruh elemen form wajib memiliki keterkaitan label eksplisit menggunakan `htmlFor` dan `id` (dikelola otomatis oleh `useId()` pada komponen atom `Input`, `Textarea`, `Select`, `TagInput`, `ImageUpload`).
2. **Accessible Names**: Setiap tombol yang hanya menampilkan ikon (*icon-only button*) wajib memiliki atribut `aria-label` yang deskriptif.
3. **WAI-ARIA Roles**: Dialog modal/drawer wajib menyematkan `role="dialog"` dan `aria-modal="true"`; tabs wajib `role="tablist"` dan `role="tab"`; status loading wajib `role="status"`.

---

## 3. ⚙️ Backend Architecture: Feature-based Modular Layer

Backend Express mengadopsi arsitektur modular berbasis domain (fitur). Setiap modul bertanggung jawab penuh atas domain bisnisnya sendiri.

```
backend/src/modules/posts/
├── posts.routes.ts       # Endpoint Express & middleware guards
├── posts.controller.ts   # Parsing HTTP req, status code, format response
├── posts.service.ts      # Business logic, Prisma ORM queries, sanitasi
├── posts.schema.ts       # Zod validation schemas (Body, Query, Params)
└── posts.types.ts        # Type definitions & DTOs
```

### Tanggung Jawab Tiap Lapisan Backend:
1. **Routes (`*.routes.ts`)**:
   - Mendaftarkan endpoint (e.g. `router.post('/auto-save', authGuard, validateBody(autoSaveSchema), controller.autoSave)`).
   - Menghubungkan middleware otentikasi & validasi Zod.
2. **Controller (`*.controller.ts`)**:
   - Mengambil data dari `req.body`, `req.params`, `req.query`, atau `req.user`.
   - Memanggil method di `Service`.
   - Mengembalikan response JSON standar `res.status(200).json({ success: true, data })`.
   - Tidak boleh memuat logic bisnis berat atau query database langsung.
3. **Service (`*.service.ts`)**:
   - Memproses data, kalkulasi waktu baca, query ke database via Prisma Client.
   - Melempar `AppError` jika terjadi kondisi abnormal (e.g. `NotFoundError`, `UnauthorizedError`).
4. **Schema (`*.schema.ts`)**:
   - Validasi data input runtime menggunakan **Zod** untuk menjamin *Type-Safety*.

---

## 4. 🔤 Konvensi Penamaan & Standar Kode

### Penamaan File:
- **Komponen React**: `PascalCase.tsx` (contoh: `PostCard.tsx`, `SettingsDrawer.tsx`).
- **Hooks / Presenter**: `camelCase.ts` berawalan `use` (contoh: `usePostEditorPresenter.ts`).
- **Modul Backend & Service**: `kebab-case` atau `domain.layer.ts` (contoh: `posts.service.ts`, `auth.controller.ts`).
- **CSS Modules**: `PascalCase.module.css` (contoh: `PostEditor.module.css`).

### TypeScript & Typing Rules:
- **Dilarang menggunakan `any`**. Gunakan `unknown` jika tipe belum diketahui dan lakukan type narrowing.
- Gunakan `interface` untuk struktur objek model dan `type` untuk union/utility types.
- Selalu gunakan `strict: true` pada `tsconfig.json`.

---

## 5. 🛡️ Penanganan Error & Format Response Standar

Semua response API dikembalikan dalam format yang seragam:

### Response Sukses:
```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": { ... }
}
```

### Response Gagal (Error):
```json
{
  "success": false,
  "message": "Pesan error yang ramah pengguna",
  "errors": [
    { "field": "email", "message": "Format email tidak valid" }
  ]
}
```

### Global Error Handler:
Semua controller di-wrap dengan `asyncHandler` atau ditangkap oleh middleware error global di `backend/src/middlewares/error.middleware.ts`.

---

## 6. 🌐 Graphify Knowledge Graph & Dependency Health

Untuk menjaga agar codebase tetap modular, type-safe, dan bebas dari *cyclic dependency* maupun *God Nodes* (file yang melanggar batas `< 300 LOC`), proyek ini menggunakan **Graphify**:

* **Topological Code Exploration**: Memanfaatkan `graph.json` dan `graphify query` untuk navigasi kode secara presisi antar sesi.
* **Audit Trail**: Memanfaatkan laporan audit `graphify-out/GRAPH_REPORT.md` untuk memantau modularitas modul Backend dan Frontend.
* **Automatic Graph Sync**: Melakukan update incremental (`/graphify . --update`) setelah menyelesaikan setiap fitur utama.
