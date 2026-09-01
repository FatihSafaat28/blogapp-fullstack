import path from 'path';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma.js';
import { AppError } from '../../middlewares/error.middleware.js';
import {
  CreateDraftInput,
  UpdatePostInput,
  DashboardQueryInput,
} from './posts.schema.js';
import {
  sanitizeHtmlContent,
  calculateReadingTime,
  extractExcerpt,
  generateUniqueSlug,
  slugify,
} from './posts.helper.js';
import {
  mediaCleanupService,
  extractImageUrlsFromHtml,
} from '../media/media-cleanup.service.js';
import { mediaService } from '../media/media.service.js';

export class PostsService {
  async createDraft(authorId: string, input: CreateDraftInput) {
    const title = input.title || 'Untitled Post';
    const slug = await generateUniqueSlug(prisma, authorId, title);

    const post = await prisma.post.create({
      data: {
        authorId,
        title,
        slug,
        contentHtml: '',
        contentJson: {},
        readingTimeMinutes: 1,
        published: false,
      },
    });

    return post;
  }

  async getPostForEdit(postId: string, authorId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        postTags: {
          include: { tag: true },
        },
      },
    });

    if (!post) {
      throw new AppError('Artikel tidak ditemukan.', 404);
    }

    if (post.authorId !== authorId) {
      throw new AppError('Akses ditolak. Anda bukan penulis artikel ini.', 403);
    }

    return post;
  }

  async autoSavePost(postId: string, authorId: string, input: UpdatePostInput) {
    const existing = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existing) {
      throw new AppError('Artikel tidak ditemukan.', 404);
    }

    if (existing.authorId !== authorId) {
      throw new AppError('Akses ditolak.', 403);
    }

    const dataToUpdate: Prisma.PostUpdateInput = {};

    if (input.title !== undefined) {
      dataToUpdate.title = input.title;
      if (!input.slug) {
        dataToUpdate.slug = await generateUniqueSlug(
          prisma,
          authorId,
          input.title,
          postId
        );
      }
    }

    if (input.slug !== undefined && input.slug.trim()) {
      const formattedSlug = slugify(input.slug);
      const isSlugTaken = await prisma.post.findFirst({
        where: {
          authorId,
          slug: formattedSlug,
          NOT: { id: postId },
        },
      });

      if (isSlugTaken) {
        throw new AppError('Slug URL ini sudah digunakan pada artikel Anda yang lain.', 409);
      }
      dataToUpdate.slug = formattedSlug;
    }

    if (input.contentHtml !== undefined) {
      const sanitized = sanitizeHtmlContent(input.contentHtml);
      dataToUpdate.contentHtml = sanitized;
      dataToUpdate.readingTimeMinutes = calculateReadingTime(sanitized);

      if (input.excerpt === undefined && !existing.excerpt) {
        dataToUpdate.excerpt = extractExcerpt(sanitized);
      }
    }

    if (input.contentJson !== undefined) {
      dataToUpdate.contentJson = input.contentJson as Prisma.InputJsonValue;
    }

    if (input.excerpt !== undefined) {
      dataToUpdate.excerpt = input.excerpt;
    }

    if (input.coverImage !== undefined) {
      dataToUpdate.coverImage = input.coverImage;
    }

    // Handle tag relationships
    if (input.tags !== undefined) {
      await prisma.postTag.deleteMany({ where: { postId } });

      const tagRecords = await Promise.all(
        input.tags.map(async (tagName) => {
          const cleanName = tagName.trim();
          const cleanSlug = slugify(cleanName);
          return prisma.tag.upsert({
            where: { slug: cleanSlug },
            create: { name: cleanName, slug: cleanSlug },
            update: {},
          });
        })
      );

      await prisma.postTag.createMany({
        data: tagRecords.map((tag) => ({
          postId,
          tagId: tag.id,
        })),
      });
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: dataToUpdate,
      include: {
        postTags: {
          include: { tag: true },
        },
      },
    });

    return updated;
  }

  async togglePublish(postId: string, authorId: string, published: boolean) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError('Artikel tidak ditemukan.', 404);
    }

    if (post.authorId !== authorId) {
      throw new AppError('Akses ditolak.', 403);
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        published,
        publishedAt: published ? post.publishedAt || new Date() : null,
      },
      include: {
        postTags: { include: { tag: true } },
      },
    });

    return updated;
  }

  async deletePost(postId: string, authorId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError('Artikel tidak ditemukan.', 404);
    }

    if (post.authorId !== authorId) {
      throw new AppError('Akses ditolak.', 403);
    }

    // Kumpulkan kandidat URL gambar yang diasosiasikan dengan artikel ini
    const candidateUrls: string[] = [];
    if (post.coverImage && post.coverImage.startsWith('/uploads/')) {
      candidateUrls.push(post.coverImage);
    }
    if (post.contentHtml) {
      candidateUrls.push(...extractImageUrlsFromHtml(post.contentHtml));
    }

    // Hapus artikel dari database
    await prisma.post.delete({
      where: { id: postId },
    });

    // Bersihkan file fisik gambar jika tidak digunakan oleh artikel/user lain
    if (candidateUrls.length > 0) {
      try {
        const activeFiles = await mediaCleanupService.getActiveFileNames();
        for (const url of candidateUrls) {
          const filename = path.basename(url);
          if (!activeFiles.has(filename)) {
            await mediaService.deleteFileIfExists(url);
          }
        }
      } catch (err) {
        console.error('[DeletePost Media Cleanup Error]:', err);
      }
    }

    return { message: 'Artikel berhasil dihapus permanen.' };
  }

  async getDashboardPosts(authorId: string, query: DashboardQueryInput) {
    const { status, search, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = { authorId };

    if (status === 'published') where.published = true;
    if (status === 'draft') where.published = false;

    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { excerpt: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          postTags: {
            include: { tag: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const postsService = new PostsService();
