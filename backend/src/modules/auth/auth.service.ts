import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { AppError } from '../../middlewares/error.middleware.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  TokenPayload,
  RefreshTokenPayload,
} from '../../utils/jwt.js';
import { RegisterInput, LoginInput } from './auth.schema.js';

export class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { username: input.username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === input.email) {
        throw new AppError('Email sudah terdaftar. Gunakan email lain.', 409);
      }
      if (existingUser.username === input.username) {
        throw new AppError('Username sudah digunakan. Pilih username lain.', 409);
      }
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        username: input.username,
        email: input.email,
        passwordHash: hashedPassword,
        blogTitle: `${input.fullName}'s Blog`,
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
      },
    });

    const accessPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const refreshPayload: RefreshTokenPayload = {
      userId: user.id,
    };

    const accessToken = generateAccessToken(accessPayload);
    const refreshToken = generateRefreshToken(refreshPayload, '7d');

    return { user, accessToken, refreshToken };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: input.identifier },
          { username: input.identifier },
        ],
      },
    });

    if (!user) {
      throw new AppError('Email/username atau password tidak valid.', 401);
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Email/username atau password tidak valid.', 401);
    }

    const accessPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const refreshPayload: RefreshTokenPayload = {
      userId: user.id,
    };

    const refreshExpiry = input.rememberMe ? '30d' : '7d';
    const accessToken = generateAccessToken(accessPayload);
    const refreshToken = generateRefreshToken(refreshPayload, refreshExpiry);

    const { passwordHash: _, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
      rememberMe: input.rememberMe,
    };
  }

  async refreshToken(token?: string) {
    if (!token) {
      throw new AppError('Sesi telah berakhir. Silakan login kembali.', 401);
    }

    const payload = verifyRefreshToken(token);
    if (!payload || !payload.userId) {
      throw new AppError('Refresh token tidak valid atau telah kedaluwarsa.', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
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
      },
    });

    if (!user) {
      throw new AppError('Pengguna tidak ditemukan.', 401);
    }

    const accessPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const refreshPayload: RefreshTokenPayload = {
      userId: user.id,
    };

    const newAccessToken = generateAccessToken(accessPayload);
    const newRefreshToken = generateRefreshToken(refreshPayload, '7d');

    return {
      user,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      },
    });

    if (!user) {
      throw new AppError('Data pengguna tidak ditemukan.', 404);
    }

    return user;
  }
}

export const authService = new AuthService();
