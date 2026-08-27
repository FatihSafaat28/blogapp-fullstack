import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from './error.middleware.js';

/**
 * Extract token from HttpOnly cookie or Authorization header
 */
const extractToken = (req: Request): string | null => {
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
};

/**
 * Guard middleware for private/protected routes
 */
export const authGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new AppError('Akses ditolak. Silakan login terlebih dahulu.', 401);
    }

    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        bio: true,
        avatar: true,
        blogTitle: true,
        socialTwitter: true,
        socialGithub: true,
        socialLinkedin: true,
        socialWebsite: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('Sesi pengguna tidak valid atau akun telah dihapus.', 401);
    }

    req.user = user;
    next();
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as { name: string }).name === 'TokenExpiredError'
    ) {
      next(new AppError('Token telah kedaluwarsa. Silakan refresh sesi Anda.', 401));
      return;
    }
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as { name: string }).name === 'JsonWebTokenError'
    ) {
      next(new AppError('Token tidak valid.', 401));
      return;
    }
    next(error);
  }
};

/**
 * Optional Auth middleware for public routes (e.g., view tracking)
 */
export const optionalAuthGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    if (!token) {
      return next();
    }

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        bio: true,
        avatar: true,
        blogTitle: true,
        socialTwitter: true,
        socialGithub: true,
        socialLinkedin: true,
        socialWebsite: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (user) {
      req.user = user;
    }
    next();
  } catch {
    // If token invalid/expired in optional guard, silently continue as guest
    next();
  }
};
