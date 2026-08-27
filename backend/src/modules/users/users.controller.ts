import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service.js';
import { updateProfileSchema, usernameParamSchema } from './users.schema.js';

export class UsersController {
  getPublicProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { username } = usernameParamSchema.parse(req.params);
      const profile = await usersService.getPublicProfile(username);

      res.status(200).json({
        success: true,
        data: { profile },
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const validatedData = updateProfileSchema.parse(req.body);
      const user = await usersService.updateProfile(userId, validatedData);

      res.status(200).json({
        success: true,
        message: 'Profil berhasil diperbarui.',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  getMyStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const stats = await usersService.getMyStats(userId);

      res.status(200).json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      next(error);
    }
  };
}

export const usersController = new UsersController();
