# 🤖 AGENTS.md — Protocol & Engineering Standards

Dokumen ini adalah **panduan wajib (instructional manual)** bagi setiap AI Agent / Developer yang bekerja pada repositori **Multi-User PERN Blog Platform**. 

---

## 🔄 1. Protokol Memulai Sesi Baru (New Session Protocol)

Setiap kali kamu berada pada sesi chat baru atau menerima tugas baru, kamu **WAJIB** mengikuti urutan langkah berikut sebelum menulis baris kode apapun:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PROTOKOL SESI KERJA                             │
├────────────────────────────────────────────────────────────────────────┤
│ 1. 📖 BACA DOKUMENTASI    👉 Baca docs/README.md & folder docs/        │
│ 2. 🪵 BACA CHANGELOG      👉 Baca CHANGELOG.md (Cek "Done" & "Next")   │
│ 3. 🌐 QUERY GRAPHIFY      👉 Gunakan graphify query jika butuh konteks │
│ 4. 🎯 BUAT RENCANA KERJA  👉 Susun step-by-step pengerjaan fitur       │
│ 5. ⚡ EKSEKUSI KODE       👉 Terapkan standar clean code (< 300 LOC)   │
│ 6. 🧪 VERIFIKASI / TEST   👉 Pastikan type-safe & build sukses         │
│ 7. 🌐 UPDATE GRAPHIFY     👉 Update knowledge graph (sync kode baru)   │
│ 8. 📝 UPDATE CHANGELOG    👉 Catat hasil di CHANGELOG.md & set "Next"  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📏 2. Aturan Rekayasa Perangkat Lunak (Engineering Guardrails)

### A. Golden Rule: Maksimal 300 Baris per File (< 300 LOC)
* **Dilarang keras** membuat file kode (`.ts`, `.tsx`, `.css`) melebihi **300 baris**.
* Jika sebuah file mencapai 250 baris, **segera pecah**:
  * Di Frontend: Pisahkan sub-komponen visual ke `components/` atau logic ke custom hook `hooks/`.
  * Di Backend: Pisahkan logic query atau helper ke file terpisah.

### B. Frontend MVP Pattern (Model-View-Presenter)
* **Model (`services/`, `types/`)**: Bertanggung jawab atas query data, Axios/Fetch API, tipe data TypeScript, dan cache TanStack Query.
* **Presenter (`hooks/`)**: Bertanggung jawab atas state lokal, form handling, event callbacks, dan logika navigasi.
* **View (`components/`, `pages/`)**: Murni representasi visual JSX + Tailwind CSS v4. Dilarang menaruh logic query atau fetch data langsung di dalam JSX view.

### C. Backend Clean Modular Architecture
* **Routes (`*.routes.ts`)**: Mendaftarkan rute dan middleware validasi Zod + Auth.
* **Controller (`*.controller.ts`)**: Menerima request HTTP, memanggil service, mengembalikan format response seragam. Dilarang memanggil database Prisma secara langsung di controller.
* **Service (`*.service.ts`)**: Tempat logika bisnis dan query database Prisma.
* **Schema (`*.schema.ts`)**: Skema validasi Zod untuk request body, params, dan query.

### D. Zero-Placeholder & Strict Type-Safety
* Dilarang menulis komentar *stub* `// TODO: implement later` pada alur fungsional inti.
* Dilarang menggunakan tipe `any`. Gunakan interface/type eksplisit atau type narrowing.

### E. Sinkronisasi Dokumentasi (`docs/` Sync Rule)
* Jika tokomu mengubah skema database, perbarui `docs/03-DATABASE.md`.
* Jika tokomu menambahkan atau memodifikasi endpoint API, perbarui `docs/04-API_SPECS.md`.

### F. Standar Desain Visual & Anti-Slop (Wajib Dipatuhi)
* **Palet Warna**: Dilarang menggunakan biru gelap elektrik / AI neon gradient. Gunakan **Warm Alabaster** (`#FAF9F6`) & Pure White untuk Light mode, serta **Matte Charcoal** (`#121214`) & Ink Obsidian (`#18181B`) untuk Dark mode.
* **Tipografi**:
  - `font-serif`: **Newsreader** (Judul H1/H2, manifesto, editorial feel).
  - `font-sans`: **Inter** / **Outfit** (UI elements, labels, buttons).
  - `font-mono`: **JetBrains Mono** (Slug URL, meta badges, tags).
* **Iconography**: Wajib menggunakan **Phosphor Icons** (`@phosphor-icons/react`). Dilarang mencampur icon pack.
* **UX Writing**: Gunakan gaya bahasa Indonesia yang hangat, menyambut, dan manusiawi (*friendly UX*).

### G. Protokol Wajib: Component-First
* Sebelum membuat halaman, form, atau view baru, **WAJIB mengecek katalog komponen di `src/shared/components/ui/`** (lihat daftar lengkap di `docs/05-DESIGN_AND_UIUX.md`).
* **Dilarang** menulis tag HTML dasar manual (`<button>`, `<input>`, `<select>`, `<textarea>`, alert div, avatar img, badge pill, modal) jika sudah ada komponen UI resminya. Selalu utamakan konsistensi dan reusability.

### H. Standar Aksesibilitas Web (a11y) & Form Best Practices
* **Form Association**: Setiap form control (`<input>`, `<textarea>`, `<select>`) **WAJIB terhubung dengan `<label>`** via `htmlFor={id}` dan memiliki atribut `id` serta `name` (gunakan `React.useId()` untuk auto-generation).
* **Accessible Names**: Tombol yang hanya berisi ikon (*icon-only button*) **WAJIB memiliki atribut `aria-label`** (contoh: `aria-label="Tutup dialog"`, `aria-label="Menu akun"`).
* **Semantic ARIA Roles**:
  - Modal / Drawer wajib menggunakan `role="dialog"` dan `aria-modal="true"`.
  - Tab navigator wajib menggunakan `role="tablist"`, tombol tab `role="tab"`, dan status `aria-selected`.
  - Loading spinner SVG wajib menggunakan `role="status"` dan `aria-label="Memuat..."`.

---

## 🌐 3. Integrasi & Perawatan Graphify

Graphify digunakan sebagai peta topologi arsitektur kode (GraphRAG) untuk melacak relasi file, dependensi antar modul, dan mendeteksi God Nodes.

### A. Kapan Menggunakan Graphify:
1. **Mencari Konteks & Relasi**: Saat ingin mengetahui hubungan antar komponen/service yang rumit, jalankan query graf:
   * `/graphify query "<pertanyaan alur data>"`
   * `/graphify path "<Node Asal>" "<Node Tujuan>"`
2. **Pembaruan Graf (Sync-on-Complete)**: Setiap kali menyelesaikan satu fase atau fitur baru yang menambah/mengubah file kode:
   * Jalankan pembaruan graf: `/graphify . --update`

---

## 🪵 4. Standar Format `CHANGELOG.md`

Setiap kali menyelesaikan task, update file `CHANGELOG.md` dengan format berikut:

```markdown
### 📌 [YYYY-MM-DD] - <Nama Fitur / Milestone>
- **Completed**:
  - Ringkasan file yang dibuat/diubah.
  - Fitur yang berhasil bekerja dan teruji.
- **Next**:
  - [ ] Rencana aksi selanjutnya untuk sesi berikutnya.
```
