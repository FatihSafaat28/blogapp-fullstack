import { Request, Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service.js';
import {
  recordViewParamSchema,
  dashboardAnalyticsQuerySchema,
} from './analytics.schema.js';
import { generateReaderHash } from './analytics.helper.js';

export class AnalyticsController {
  recordView = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { postId } = recordViewParamSchema.parse(req.params);

      const ip =
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress ||
        req.ip ||
        '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'Unknown-Browser';
      const userId = req.user?.id;

      const readerHash = generateReaderHash(ip, userAgent, userId);
      const result = await analyticsService.recordView(postId, readerHash);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getDashboardAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authorId = req.user!.id;
      const { range } = dashboardAnalyticsQuerySchema.parse(req.query);
      const analytics = await analyticsService.getDashboardAnalytics(
        authorId,
        range
      );

      res.status(200).json({
        success: true,
        data: { analytics },
      });
    } catch (error) {
      next(error);
    }
  };
}

export const analyticsController = new AnalyticsController();
