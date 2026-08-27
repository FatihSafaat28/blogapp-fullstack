import { Router } from 'express';
import { usersController } from './users.controller.js';
import { authGuard } from '../../middlewares/auth.middleware.js';

const router = Router();

// Endpoint publik: Profil kreator untuk Substack-style page (/@:username)
router.get('/public/:username', usersController.getPublicProfile);

// Endpoint terautentikasi: Update profil & identitas blog di /dashboard/settings
router.patch('/profile', authGuard, usersController.updateProfile);

// Endpoint terautentikasi: Ringkasan statistik akun untuk sidebar dashboard
router.get('/me/stats', authGuard, usersController.getMyStats);

export default router;
