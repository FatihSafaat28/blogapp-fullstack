import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from './auth.controller.js';
import { authGuard } from '../../middlewares/auth.middleware.js';

const router = Router();

// Rate limiter anti brute-force untuk login dan pendaftaran akun (15 menit maks 15 request)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan autentikasi. Silakan coba lagi setelah 15 menit.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/me', authGuard, authController.getMe);

export default router;
