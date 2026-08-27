import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { registerSchema, loginSchema } from './auth.schema.js';

const isProduction = process.env.NODE_ENV === 'production';

export class AuthController {
  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    rememberMe = false
  ) {
    const refreshMaxAge = rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 hari
      : 7 * 24 * 60 * 60 * 1000;  // 7 hari

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 menit
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: refreshMaxAge,
    });
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    });
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await authService.register(validatedData);

      this.setAuthCookies(res, result.accessToken, result.refreshToken, false);

      res.status(201).json({
        success: true,
        message: 'Pendaftaran berhasil. Selamat datang di Avian Blog!',
        data: { user: result.user },
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);

      this.setAuthCookies(
        res,
        result.accessToken,
        result.refreshToken,
        result.rememberMe
      );

      res.status(200).json({
        success: true,
        message: 'Login berhasil.',
        data: { user: result.user },
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.refreshToken;
      const result = await authService.refreshToken(token);

      this.setAuthCookies(res, result.accessToken, result.refreshToken, false);

      res.status(200).json({
        success: true,
        message: 'Token berhasil diperbarui.',
        data: { user: result.user },
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: Request, res: Response) => {
    this.clearAuthCookies(res);
    res.status(200).json({
      success: true,
      message: 'Logout berhasil. Sesi telah ditutup.',
    });
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const user = await authService.getMe(userId);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
