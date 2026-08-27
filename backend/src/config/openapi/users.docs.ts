export const usersOpenApiPaths = {
  '/api/users/public/{username}': {
    get: {
      tags: ['Users'],
      summary: 'Profil Publik Kreator (Substack-style)',
      parameters: [{ name: 'username', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        '200': { description: 'Data profil kreator berhasil diambil' },
        '404': { description: 'Kreator tidak ditemukan' },
      },
    },
  },
  '/api/users/profile': {
    patch: {
      tags: ['Users'],
      summary: 'Perbarui Profil Pengguna',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                fullName: { type: 'string' },
                bio: { type: 'string' },
                avatar: { type: 'string' },
                blogTitle: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        '200': { description: 'Profil berhasil diperbarui' },
      },
    },
  },
  '/api/users/me/stats': {
    get: {
      tags: ['Users'],
      summary: 'Ringkasan Statistik Akun',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      responses: {
        '200': { description: 'Statistik akun berhasil diambil' },
      },
    },
  },
  '/api/media/upload': {
    post: {
      tags: ['Media'],
      summary: 'Upload Gambar (WebP Conversion)',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['file'],
              properties: { file: { type: 'string', format: 'binary' } },
            },
          },
        },
      },
      responses: {
        '201': { description: 'Gambar berhasil dioptimasi ke WebP dan disimpan' },
      },
    },
  },
};
