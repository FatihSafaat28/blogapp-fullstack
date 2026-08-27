import { Router } from 'express';
import { mediaController } from './media.controller.js';
import { authGuard } from '../../middlewares/auth.middleware.js';
import { uploadMiddleware } from '../../middlewares/upload.middleware.js';

const router = Router();

// Endpoint upload gambar (hanya user terautentikasi, maks 5MB)
router.post(
  '/upload',
  authGuard,
  uploadMiddleware.single('file'),
  mediaController.upload
);

export default router;
