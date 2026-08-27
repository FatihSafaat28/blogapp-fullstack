import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { postsController } from './posts.controller.js';
import { authGuard } from '../../middlewares/auth.middleware.js';

const router = Router();

// Anti-spam limiter: Maksimal 10 pembuatan artikel baru per 15 menit
const createPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      'Terlalu banyak pembuatan draf artikel. Harap tunggu beberapa saat sebelum membuat draf baru.',
  },
});

// ==========================================
// 🌐 PUBLIC ENDPOINTS (Eksplorasi & Pembaca)
// ==========================================

// Feed Explore (Trending, For You, Latest)
router.get('/public', postsController.getExploreFeed);

// Daftar artikel terbit milik 1 kreator (/@:username)
router.get('/public/author/:username', postsController.getAuthorPublicPosts);

// Detail artikel tunggal untuk halaman baca (/@:username/:slug)
router.get('/public/detail/:username/:slug', postsController.getPublicPostBySlug);

// ==========================================
// 🔒 PRIVATE ENDPOINTS (Dashboard & Creator Studio)
// ==========================================

// Buat draf baru
router.post('/draft', authGuard, createPostLimiter, postsController.createDraft);

// Daftar artikel milik akun sendiri di dashboard
router.get('/dashboard', authGuard, postsController.getDashboardPosts);

// Ambil detail draf/artikel untuk diedit di Tiptap Studio
router.get('/dashboard/:id', authGuard, postsController.getPostForEdit);

// Auto-save update artikel
router.put('/:id', authGuard, postsController.autoSavePost);

// Toggle status publish / unpublish
router.patch('/:id/publish', authGuard, postsController.togglePublish);

// Hapus artikel permanen
router.delete('/:id', authGuard, postsController.deletePost);

export default router;
