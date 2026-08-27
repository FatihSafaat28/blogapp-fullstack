import { Request, Response, NextFunction } from 'express';
import { mediaService } from './media.service.js';
import { AppError } from '../../middlewares/error.middleware.js';

export class MediaController {
  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError(
          'File gambar wajib diunggah pada field "file".',
          400
        );
      }

      const result = await mediaService.processAndSaveImage(req.file);

      res.status(201).json({
        success: true,
        message:
          'Gambar berhasil diunggah dan dikonversi ke WebP teroptimasi.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const mediaController = new MediaController();
