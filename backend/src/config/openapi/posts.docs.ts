export const postsOpenApiPaths = {
  '/api/posts/explore': {
    get: {
      tags: ['Posts'],
      summary: 'Explore Feed (Trending, For You, Latest)',
      description: 'Mengambil daftar artikel publik berdasarkan tab feed.',
      parameters: [
        {
          name: 'tab',
          in: 'query',
          schema: { type: 'string', enum: ['trending', 'for-you', 'latest'], default: 'trending' },
        },
        { name: 'tag', in: 'query', schema: { type: 'string' } },
        { name: 'search', in: 'query', schema: { type: 'string' } },
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
      ],
      responses: {
        '200': { description: 'Daftar artikel feed berhasil diambil' },
      },
    },
  },
  '/api/posts/draft': {
    post: {
      tags: ['Posts'],
      summary: 'Buat Draf Artikel Baru',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { title: { type: 'string', example: 'Panduan Arsitektur PERN' } },
            },
          },
        },
      },
      responses: {
        '201': { description: 'Draf artikel baru berhasil dibuat' },
      },
    },
  },
  '/api/posts/{id}/autosave': {
    put: {
      tags: ['Posts'],
      summary: 'Auto-Save Konten Artikel',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        '200': { description: 'Artikel berhasil disimpan' },
      },
    },
  },
  '/api/posts/{id}/publish': {
    patch: {
      tags: ['Posts'],
      summary: 'Toggle Publish / Unpublish Artikel',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['published'],
              properties: { published: { type: 'boolean', example: true } },
            },
          },
        },
      },
      responses: {
        '200': { description: 'Status publikasi berhasil diubah' },
      },
    },
  },
  '/api/posts/dashboard': {
    get: {
      tags: ['Posts'],
      summary: 'Daftar Artikel di Dashboard Studio',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      responses: {
        '200': { description: 'Daftar artikel penulis berhasil diambil' },
      },
    },
  },
  '/api/posts/read/{authorUsername}/{slug}': {
    get: {
      tags: ['Posts'],
      summary: 'Baca Artikel Lengkap (Reader View)',
      parameters: [
        { name: 'authorUsername', in: 'path', required: true, schema: { type: 'string' } },
        { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
      ],
      responses: {
        '200': { description: 'Data artikel berhasil diambil' },
        '404': { description: 'Artikel tidak ditemukan' },
      },
    },
  },
  '/api/posts/{id}': {
    delete: {
      tags: ['Posts'],
      summary: 'Hapus Artikel Permanen',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        '200': { description: 'Artikel berhasil dihapus' },
      },
    },
  },
};
