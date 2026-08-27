import { prisma } from '../../config/prisma.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { generateDateSeries } from './analytics.helper.js';

export class AnalyticsService {
  /**
   * Catat view artikel dengan deduplikasi 60 menit
   */
  async recordView(postId: string, readerHash: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, published: true, viewCount: true },
    });

    if (!post || !post.published) {
      throw new AppError('Artikel tidak ditemukan atau belum terbit.', 404);
    }

    // Batas waktu 60 menit ke belakang
    const sixtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Cek apakah readerHash sudah tercatat dalam 60 menit terakhir untuk post ini
    const existingLog = await prisma.postViewLog.findFirst({
      where: {
        postId,
        readerHash,
        viewedAt: {
          gte: sixtyMinutesAgo,
        },
      },
      select: { id: true },
    });

    if (existingLog) {
      return {
        recorded: false,
        message: 'View sudah pernah dihitung dalam 60 menit terakhir.',
        currentViews: post.viewCount,
      };
    }

    // Jika unik: catat log dan lakukan atomic increment
    const updatedPost = await prisma.$transaction(async (tx) => {
      await tx.postViewLog.create({
        data: {
          postId,
          readerHash,
        },
      });

      return tx.post.update({
        where: { id: postId },
        data: {
          viewCount: { increment: 1 },
        },
        select: { viewCount: true },
      });
    });

    return {
      recorded: true,
      message: 'View berhasil dicatat.',
      currentViews: updatedPost.viewCount,
    };
  }

  /**
   * Ambil data statistik lengkap untuk Dashboard Analytics
   */
  async getDashboardAnalytics(authorId: string, range: '7d' | '30d') {
    const days = range === '30d' ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // 1. Ambil seluruh post terbit milik author
    const authorPosts = await prisma.post.findMany({
      where: {
        authorId,
        published: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        publishedAt: true,
      },
      orderBy: { viewCount: 'desc' },
    });

    const totalViews = authorPosts.reduce((acc, p) => acc + p.viewCount, 0);
    const topArticles = authorPosts.slice(0, 5);

    const postIds = authorPosts.map((p) => p.id);

    // 2. Ambil seluruh log view dalam rentang waktu yang diminta
    const viewLogs =
      postIds.length > 0
        ? await prisma.postViewLog.findMany({
            where: {
              postId: { in: postIds },
              viewedAt: { gte: startDate },
            },
            select: { viewedAt: true },
          })
        : [];

    // 3. Agregasi data harian untuk grafik Recharts
    const dateMap = new Map<string, number>();
    const dateSeries = generateDateSeries(days);

    dateSeries.forEach((item) => {
      dateMap.set(item.date, 0);
    });

    viewLogs.forEach((log) => {
      const logDate = log.viewedAt.toISOString().split('T')[0];
      if (dateMap.has(logDate)) {
        dateMap.set(logDate, (dateMap.get(logDate) || 0) + 1);
      }
    });

    const dailyTrend = Array.from(dateMap.entries()).map(([date, views]) => ({
      date,
      views,
    }));

    return {
      range,
      totalViews,
      totalPublishedPosts: authorPosts.length,
      dailyTrend,
      topArticles,
    };
  }
}

export const analyticsService = new AnalyticsService();
