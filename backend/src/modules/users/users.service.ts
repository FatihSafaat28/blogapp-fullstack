import { prisma } from '../../config/prisma.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { mediaService } from '../media/media.service.js';
import { UpdateProfileInput } from './users.schema.js';

export class UsersService {
  async getPublicProfile(username: string) {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: {
        id: true,
        fullName: true,
        username: true,
        bio: true,
        avatar: true,
        blogTitle: true,
        socialTwitter: true,
        socialGithub: true,
        socialLinkedin: true,
        createdAt: true,
        _count: {
          select: {
            posts: {
              where: { published: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new AppError(`Profil kreator @${username} tidak ditemukan.`, 404);
    }

    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      blogTitle: user.blogTitle,
      socialTwitter: user.socialTwitter,
      socialGithub: user.socialGithub,
      socialLinkedin: user.socialLinkedin,
      totalPublishedPosts: user._count.posts,
      joinedAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new AppError('Pengguna tidak ditemukan.', 404);
    }

    // Jika avatar diperbarui atau dihapus, bersihkan file avatar lama dari server
    if (data.avatar !== undefined && data.avatar !== existingUser.avatar) {
      if (existingUser.avatar) {
        await mediaService.deleteFileIfExists(existingUser.avatar);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
        ...(data.blogTitle !== undefined && { blogTitle: data.blogTitle }),
        ...(data.socialTwitter !== undefined && {
          socialTwitter: data.socialTwitter,
        }),
        ...(data.socialGithub !== undefined && {
          socialGithub: data.socialGithub,
        }),
        ...(data.socialLinkedin !== undefined && {
          socialLinkedin: data.socialLinkedin,
        }),
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        blogTitle: true,
        socialTwitter: true,
        socialGithub: true,
        socialLinkedin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async getMyStats(userId: string) {
    const [totalPosts, publishedPosts, draftPosts, viewsAggregate] =
      await Promise.all([
        prisma.post.count({ where: { authorId: userId } }),
        prisma.post.count({ where: { authorId: userId, published: true } }),
        prisma.post.count({ where: { authorId: userId, published: false } }),
        prisma.post.aggregate({
          where: { authorId: userId },
          _sum: { viewCount: true },
        }),
      ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews: viewsAggregate._sum.viewCount || 0,
    };
  }
}

export const usersService = new UsersService();
