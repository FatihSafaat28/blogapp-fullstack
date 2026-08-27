export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Avian Blog - REST API Reference & Studio',
    version: '1.0.0',
    description:
      'Dokumentasi dan studio interaktif untuk seluruh endpoint REST API Multi-User PERN Blog Platform.',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  tags: [
    { name: 'System', description: 'System health & diagnostic endpoints' },
    { name: 'Auth', description: 'Authentication & Session management endpoints' },
    { name: 'Media', description: 'Image upload & WebP conversion endpoints' },
    { name: 'Users', description: 'Creator profile & settings endpoints' },
    { name: 'Posts', description: 'Articles CRUD, auto-save, and explore feeds' },
    { name: 'Analytics', description: 'Smart 60m view tracking & creator insights' },
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['System'],
        summary: 'Health Check',
        description: 'Memeriksa status operasional server backend Express.',
        responses: {
          '200': { description: 'Server beroperasi normal' },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Pendaftaran Akun Baru',
        description: 'Mendaftarkan pengguna baru dengan email dan username unik.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'username', 'email', 'password'],
                properties: {
                  fullName: { type: 'string', example: 'Fatih Safaat' },
                  username: { type: 'string', example: 'fatih' },
                  email: { type: 'string', example: 'fatih@example.com' },
                  password: { type: 'string', example: 'Password123' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Pendaftaran berhasil' },
          '400': { description: 'Validasi input gagal' },
          '409': { description: 'Email atau username sudah terdaftar' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Masuk Akun (Login)',
        description: 'Autentikasi pengguna menggunakan email/username & password.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['identifier', 'password'],
                properties: {
                  identifier: { type: 'string', example: 'fatih' },
                  password: { type: 'string', example: 'Password123' },
                  rememberMe: { type: 'boolean', example: true },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login berhasil, cookie terpasang' },
          '401': { description: 'Kredensial tidak valid' },
        },
      },
    },
    '/api/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Perbarui Token Sesi',
        description: 'Menerbitkan access token baru berdasarkan refresh token di cookie.',
        responses: {
          '200': { description: 'Token berhasil diperbarui' },
          '401': { description: 'Refresh token tidak valid atau kedaluwarsa' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Keluar Akun (Logout)',
        description: 'Menghapus cookie sesi autentikasi dari browser.',
        responses: {
          '200': { description: 'Logout berhasil' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Ambil Profil Pengguna Saat Ini',
        description: 'Mengambil data lengkap profil kreator yang sedang login.',
        responses: {
          '200': { description: 'Profil berhasil diambil' },
          '401': { description: 'Belum login / token tidak valid' },
        },
      },
    },
    '/api/media/upload': {
      post: {
        tags: ['Media'],
        summary: 'Upload & Konversi Gambar ke WebP',
        description:
          'Mengunggah gambar (JPG, PNG, WEBP, GIF maks 5MB) dan mengonversinya secara otomatis ke format WebP teroptimasi.',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File gambar yang akan diunggah (JPG, PNG, WEBP, GIF)',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Gambar berhasil diunggah dan dikonversi ke WebP' },
          '400': { description: 'Format file tidak didukung atau ukuran > 5MB' },
          '401': { description: 'Belum login / Unauthorized' },
        },
      },
    },
    '/api/users/public/{username}': {
      get: {
        tags: ['Users'],
        summary: 'Ambil Profil Publik Kreator',
        description:
          'Mengambil profil publik kreator untuk ditampilkan pada halaman Substack-style (/@:username).',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'fatih' },
          },
        ],
        responses: {
          '200': { description: 'Profil publik berhasil diambil' },
          '404': { description: 'Kreator tidak ditemukan' },
        },
      },
    },
    '/api/users/profile': {
      patch: {
        tags: ['Users'],
        summary: 'Update Profil & Identitas Blog',
        description:
          'Memperbarui informasi profil, bio, avatar WebP, judul blog, dan tautan sosial media di /dashboard/settings.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullName: { type: 'string', example: 'Fatih Safaat' },
                  bio: {
                    type: 'string',
                    example: 'Software Engineer & Fullstack PERN Developer',
                  },
                  avatar: {
                    type: 'string',
                    example: '/uploads/img-avatar.webp',
                  },
                  blogTitle: { type: 'string', example: "Fatih's Tech Journal" },
                  socialTwitter: { type: 'string', example: 'fatihsafaat' },
                  socialGithub: { type: 'string', example: 'FatihSafaat28' },
                  socialLinkedin: { type: 'string', example: 'fatihsafaat' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Profil berhasil diperbarui' },
          '400': { description: 'Validasi input gagal' },
          '401': { description: 'Belum login / Unauthorized' },
        },
      },
    },
    '/api/users/me/stats': {
      get: {
        tags: ['Users'],
        summary: 'Ambil Statistik Dashboard Akun Sendiri',
        description:
          'Mengambil ringkasan jumlah post terbit, draf, dan akumulasi view untuk sidebar dashboard.',
        responses: {
          '200': { description: 'Statistik berhasil diambil' },
          '401': { description: 'Belum login / Unauthorized' },
        },
      },
    },
    '/api/posts/public': {
      get: {
        tags: ['Posts'],
        summary: 'Feed Explore Publik (Trending, For You, Latest)',
        description:
          'Mengambil feed artikel publik berdasarkan tab algoritma sorting, tag filter, pencarian, dan pagination.',
        parameters: [
          {
            name: 'tab',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['trending', 'for-you', 'latest'],
              default: 'trending',
            },
          },
          { name: 'tag', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          '200': { description: 'Feed explore berhasil diambil' },
        },
      },
    },
    '/api/posts/public/author/{username}': {
      get: {
        tags: ['Posts'],
        summary: 'Daftar Artikel Terbit Milik Kreator',
        description:
          'Mengambil seluruh artikel terbit milik satu kreator untuk halaman Substack-style (/@:username).',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'fatih' },
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          '200': { description: 'Artikel kreator berhasil diambil' },
          '404': { description: 'Kreator tidak ditemukan' },
        },
      },
    },
    '/api/posts/public/detail/{username}/{slug}': {
      get: {
        tags: ['Posts'],
        summary: 'Detail Artikel Tunggal (Halaman Pembaca)',
        description:
          'Mengambil konten artikel lengkap untuk dibaca di halaman /@:username/:slug.',
        parameters: [
          {
            name: 'username',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'fatih' },
          },
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: 'memahami-driver-adapter-di-prisma-7',
            },
          },
        ],
        responses: {
          '200': { description: 'Artikel berhasil diambil' },
          '404': { description: 'Artikel tidak ditemukan' },
        },
      },
    },
    '/api/posts/draft': {
      post: {
        tags: ['Posts'],
        summary: 'Buat Draf Artikel Baru (Creator Studio)',
        description:
          'Membuat draf artikel baru (rate limit 10 post / 15m) untuk dibuka di Tiptap editor.',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    example: 'Catatan Arsitektur Multi-User PERN',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Draf berhasil dibuat' },
          '401': { description: 'Unauthorized' },
          '429': { description: 'Rate limit terlampaui (maks 10 post / 15m)' },
        },
      },
    },
    '/api/posts/dashboard': {
      get: {
        tags: ['Posts'],
        summary: 'Daftar Artikel Dashboard Kreator',
        description:
          'Mengambil daftar artikel milik akun sendiri dengan filter status (all, published, draft).',
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['all', 'published', 'draft'],
              default: 'all',
            },
          },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          '200': { description: 'Daftar artikel dashboard berhasil diambil' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/posts/dashboard/{id}': {
      get: {
        tags: ['Posts'],
        summary: 'Ambil Detail Draf/Artikel untuk Editor',
        description:
          'Mengambil data lengkap artikel (HTML, JSON, tags, slug) untuk dimuat ke Tiptap editor.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'Data artikel berhasil diambil' },
          '403': { description: 'Bukan pemilik artikel' },
          '404': { description: 'Artikel tidak ditemukan' },
        },
      },
    },
    '/api/posts/{id}': {
      put: {
        tags: ['Posts'],
        summary: 'Auto-Save & Update Artikel',
        description:
          'Menyimpan perubahan tulisan, sanitasi HTML otomatis, kalkulasi waktu baca, dan sinkronisasi tag.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: {
                    type: 'string',
                    example: 'Memahami Driver Adapter di Prisma 7',
                  },
                  slug: {
                    type: 'string',
                    example: 'memahami-driver-adapter-di-prisma-7',
                  },
                  coverImage: {
                    type: 'string',
                    example: '/uploads/img-cover.webp',
                  },
                  contentHtml: {
                    type: 'string',
                    example:
                      '<h2>Pendahuluan</h2><p>Prisma 7 membawa arsitektur driver adapter baru...</p>',
                  },
                  excerpt: {
                    type: 'string',
                    example:
                      'Panduan mendalam tentang arsitektur driver adapter pada Prisma 7.',
                  },
                  tags: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Prisma', 'PostgreSQL', 'NodeJS'],
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Artikel berhasil disimpan' },
          '400': { description: 'Validasi gagal' },
          '403': { description: 'Bukan pemilik artikel' },
        },
      },
      delete: {
        tags: ['Posts'],
        summary: 'Hapus Artikel Permanen',
        description:
          'Menghapus artikel secara permanen dari database (hanya pemilik artikel).',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'Artikel berhasil dihapus' },
          '403': { description: 'Bukan pemilik artikel' },
        },
      },
    },
    '/api/posts/{id}/publish': {
      patch: {
        tags: ['Posts'],
        summary: 'Toggle Status Publikasi Artikel',
        description:
          'Mengubah status artikel dari draf ke publik (published: true) atau sebaliknya.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['published'],
                properties: {
                  published: { type: 'boolean', example: true },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Status publikasi berhasil diperbarui' },
          '403': { description: 'Bukan pemilik artikel' },
        },
      },
    },
    '/api/analytics/views/{postId}': {
      post: {
        tags: ['Analytics'],
        summary: 'Catat View Artikel (Deduplikasi 60 Menit)',
        description:
          'Mencatat pembaca artikel secara anonim (mencegah F5 spam dengan membatasi 1 view per 60 menit).',
        parameters: [
          {
            name: 'postId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'UUID artikel yang sedang dibaca',
          },
        ],
        responses: {
          '200': { description: 'Status pencatatan view berhasil' },
          '404': { description: 'Artikel tidak ditemukan atau belum terbit' },
        },
      },
    },
    '/api/analytics/dashboard': {
      get: {
        tags: ['Analytics'],
        summary: 'Data Grafik & Statistik Dashboard Kreator',
        description:
          'Mengambil akumulasi total view, tren harian 7/30 hari (untuk grafik Recharts), dan top 5 artikel terpopuler.',
        parameters: [
          {
            name: 'range',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['7d', '30d'],
              default: '7d',
            },
            description: 'Rentang waktu data analitik',
          },
        ],
        responses: {
          '200': { description: 'Data analitik dashboard berhasil diambil' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
  },
};

