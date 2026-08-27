export const authOpenApiPaths = {
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
      summary: 'Masuk / Login Akun',
      description: 'Autentikasi dengan email/username dan password.',
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
              },
            },
          },
        },
      },
      responses: {
        '200': { description: 'Login berhasil, token disimpan di Cookie' },
        '401': { description: 'Kredensial tidak valid' },
      },
    },
  },
  '/api/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Dapatkan Sesi User Saat Ini',
      description: 'Mengembalikan data profil pengguna yang sedang login.',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      responses: {
        '200': { description: 'Data user berhasil diambil' },
        '401': { description: 'Tidak terautentikasi' },
      },
    },
  },
  '/api/auth/refresh-token': {
    post: {
      tags: ['Auth'],
      summary: 'Perbarui Access Token',
      description: 'Menghasilkan access token baru dari refresh token cookie.',
      responses: {
        '200': { description: 'Token berhasil diperbarui' },
        '401': { description: 'Refresh token tidak valid atau kedaluwarsa' },
      },
    },
  },
  '/api/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Keluar / Logout Akun',
      description: 'Menghapus token autentikasi di browser.',
      responses: {
        '200': { description: 'Logout berhasil' },
      },
    },
  },
};
