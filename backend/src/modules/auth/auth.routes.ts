import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authGuard } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/me', authGuard, authController.getMe);

export default router;
