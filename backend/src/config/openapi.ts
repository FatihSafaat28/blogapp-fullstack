import { authOpenApiPaths } from './openapi/auth.docs.js';
import { postsOpenApiPaths } from './openapi/posts.docs.js';
import { analyticsOpenApiPaths } from './openapi/analytics.docs.js';
import { usersOpenApiPaths } from './openapi/users.docs.js';

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
    ...authOpenApiPaths,
    ...postsOpenApiPaths,
    ...analyticsOpenApiPaths,
    ...usersOpenApiPaths,
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
      },
    },
  },
};
