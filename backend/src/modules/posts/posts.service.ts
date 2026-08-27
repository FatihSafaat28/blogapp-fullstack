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
      include: {
        postTags: {
          include: { tag: true },
        },
      },
    });

    return post;
  }

  async autoSavePost(
    postId: string,
    authorId: string,
    input: UpdatePostInput
  ) {
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { postTags: { include: { tag: true } } },
    });

    if (!existingPost) {
      throw new AppError('Artikel tidak ditemukan.', 404);
    }

    if (existingPost.authorId !== authorId) {
      throw new AppError(
        'Akses ditolak. Anda bukan pemilik artikel ini.',
        403
      );
    }

    const cleanHtml = sanitizeHtmlContent(input.contentHtml || '');
    const readingTimeMinutes = calculateReadingTime(cleanHtml);
    const excerpt = input.excerpt || extractExcerpt(cleanHtml);

    let targetSlug = existingPost.slug;
    if (input.slug && input.slug !== existingPost.slug) {
      targetSlug = await generateUniqueSlug(
        prisma,
        authorId,
        input.slug,
        postId
      );
    }

    // Sinkronisasi tag
    const tagNames = input.tags || [];
    const tagRecords = await Promise.all(
      tagNames.map(async (name) => {
        const tagSlug = slugify(name);
        return prisma.tag.upsert({
          where: { slug: tagSlug },
          update: { name },
          create: { name, slug: tagSlug },
        });
      })
    );

    // Update artikel dan relasi tag
    const updatedPost = await prisma.$transaction(async (tx) => {
      // Hapus tag lama
      await tx.postTag.deleteMany({
        where: { postId },
      });

      // Hubungkan tag baru
      if (tagRecords.length > 0) {
        await tx.postTag.createMany({
          data: tagRecords.map((t) => ({
            postId,
            tagId: t.id,
          })),
        });
      }

      // Update post utama
      return tx.post.update({
        where: { id: postId },
        data: {
          title: input.title,
          slug: targetSlug,
          coverImage: input.coverImage,
          contentHtml: cleanHtml,
          contentJson: input.contentJson ? (input.contentJson as object) : undefined,
          excerpt,
          readingTimeMinutes,
        },
        include: {
          postTags: {
            include: { tag: true },
          },
        },
      });
    });

    return updatedPost;
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

    await prisma.post.delete({
      where: { id: postId },
    });

    return { message: 'Artikel berhasil dihapus permanen.' };
  }

  async getDashboardPosts(authorId: string, query: DashboardQueryInput) {
    const { status, search, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = { authorId };

    if (status === 'published') where.published = true;
    if (status === 'draft') where.published = false;

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
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

  async getPostForEdit(postId: string, authorId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        postTags: { include: { tag: true } },
      },
    });

    if (!post) {
      throw new AppError('Artikel tidak ditemukan.', 404);
    }

    if (post.authorId !== authorId) {
      throw new AppError('Akses ditolak.', 403);
    }

    return post;
  }
}

export const postsService = new PostsService();
