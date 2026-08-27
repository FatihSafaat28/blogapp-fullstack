import { Router } from 'express';
import { analyticsController } from './analytics.controller.js';
import {
  authGuard,
  optionalAuthGuard,
} from '../../middlewares/auth.middleware.js';

const router = Router();

// Endpoint publik pencatatan view artikel (mendukung pembaca anonim maupun login)
router.post(
  '/views/:postId',
  optionalAuthGuard,
  analyticsController.recordView
);

// Endpoint privat dashboard statistik (hanya kreator terautentikasi)
router.get(
  '/dashboard',
  authGuard,
  analyticsController.getDashboardAnalytics
);

export default router;
