export const analyticsOpenApiPaths = {
  '/api/analytics/views/{postId}': {
    post: {
      tags: ['Analytics'],
      summary: 'Catat View Artikel (Deduplikasi 60 Menit)',
      parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
      responses: {
        '200': { description: 'Status pencatatan view artikel' },
      },
    },
  },
  '/api/analytics/dashboard': {
    get: {
      tags: ['Analytics'],
      summary: 'Statistik & Analitik Dashboard',
      security: [{ bearerAuth: [] }, { cookieAuth: [] }],
      parameters: [
        { name: 'range', in: 'query', schema: { type: 'string', enum: ['7d', '30d'], default: '7d' } },
      ],
      responses: {
        '200': { description: 'Data agregasi analitik berhasil diambil' },
      },
    },
  },
};
