import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { ExploreQueryInput } from './posts.schema.js';
import { slugify } from './posts.helper.js';

export class PostsFeedService {
  async getExploreFeed(query: ExploreQueryInput) {
    const { tab, tag, search, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = { published: true };

    if (tag) {
      where.postTags = {
        some: {
          tag: {
            slug: slugify(tag),
          },
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 1. Tab LATEST (Urutan kronologis publikasi)
    if (tab === 'latest') {
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          skip,
          take: limit,
          orderBy: { publishedAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatar: true,
                blogTitle: true,
              },
            },
            postTags: { include: { tag: true } },
          },
        }),
        prisma.post.count({ where }),
      ]);

      return {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    // 2. Tab FOR-YOU (Popularitas & Relevansi)
    if (tab === 'for-you') {
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          skip,
          take: limit,
          orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }],
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatar: true,
                blogTitle: true,
              },
            },
            postTags: { include: { tag: true } },
          },
        }),
        prisma.post.count({ where }),
      ]);

      return {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    // 3. Tab TRENDING (Formula Waktu: Score = Views / (Hours + 2)^1.5)
    const allMatchingPosts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true,
            blogTitle: true,
          },
        },
        postTags: { include: { tag: true } },
      },
    });

    const now = Date.now();
    const scoredPosts = allMatchingPosts.map((post) => {
      const publishedTime = post.publishedAt
        ? new Date(post.publishedAt).getTime()
        : new Date(post.createdAt).getTime();
      const hoursSincePublished = Math.max(
        0,
        (now - publishedTime) / (1000 * 60 * 60)
      );
      const score =
        post.viewCount / Math.pow(hoursSincePublished + 2, 1.5);

      return { post, score };
    });

    scoredPosts.sort((a, b) => b.score - a.score);

    const total = scoredPosts.length;
    const paginated = scoredPosts.slice(skip, skip + limit).map((s) => s.post);

    return {
      posts: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAuthorPublicPosts(username: string, page = 1, limit = 10) {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (!user) {
      throw new AppError(`Kreator @${username} tidak ditemukan.`, 404);
    }

    const skip = (page - 1) * limit;
    const where = {
      authorId: user.id,
      published: true,
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              username: true,
              avatar: true,
              blogTitle: true,
            },
          },
          postTags: { include: { tag: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPublicPostBySlug(username: string, slug: string) {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (!user) {
      throw new AppError(`Kreator @${username} tidak ditemukan.`, 404);
    }

    const post = await prisma.post.findUnique({
      where: {
        authorId_slug: {
          authorId: user.id,
          slug,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true,
            bio: true,
            blogTitle: true,
            socialTwitter: true,
            socialGithub: true,
            socialLinkedin: true,
          },
        },
        postTags: { include: { tag: true } },
      },
    });

    if (!post || !post.published) {
      throw new AppError('Artikel tidak ditemukan atau belum dipublikasikan.', 404);
    }

    return post;
  }
}

export const postsFeedService = new PostsFeedService();
