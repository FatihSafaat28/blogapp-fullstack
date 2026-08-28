import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { AppError } from '../../middlewares/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../../../uploads');

export interface UploadResult {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  width?: number;
  height?: number;
}

export class MediaService {
  private async ensureUploadsDirectory() {
    try {
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
    } catch {
      // Directory already exists or created
    }
  }

  /**
   * Menghapus file fisik dari folder uploads jika ada
   */
  async deleteFileIfExists(relativeUrl?: string | null): Promise<void> {
    if (!relativeUrl || !relativeUrl.startsWith('/uploads/')) return;
    try {
      const filename = path.basename(relativeUrl);
      const filePath = path.join(UPLOADS_DIR, filename);
      await fs.unlink(filePath);
    } catch {
      // Abaikan jika file memang sudah tidak ada
    }
  }

  async processAndSaveImage(file: Express.Multer.File): Promise<UploadResult> {
    if (!file || !file.buffer) {
      throw new AppError('File gambar tidak ditemukan atau rusak.', 400);
    }

    await this.ensureUploadsDirectory();

    // Content-based SHA-256 hash (Mencegah duplikasi file yang identik)
    const contentHash = crypto
      .createHash('sha256')
      .update(file.buffer)
      .digest('hex')
      .slice(0, 16);

    // Khusus GIF beranimasi, pertahankan ekstensi .gif
    if (file.mimetype === 'image/gif') {
      const filename = `img-${contentHash}.gif`;
      const filePath = path.join(UPLOADS_DIR, filename);

      await fs.writeFile(filePath, file.buffer);
      const stat = await fs.stat(filePath);

      return {
        url: `/uploads/${filename}`,
        filename,
        mimetype: 'image/gif',
        size: stat.size,
      };
    }

    // Untuk JPG, PNG, dan WEBP: Konversi & optimasi ke format WebP (max-width 1600px, quality 80)
    const filename = `img-${contentHash}.webp`;
    const filePath = path.join(UPLOADS_DIR, filename);

    try {
      const sharpInstance = sharp(file.buffer);
      const metadata = await sharpInstance.metadata();

      await sharpInstance
        .resize({
          width: 1600,
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toFile(filePath);

      const stat = await fs.stat(filePath);
      const optimizedMeta = await sharp(filePath).metadata();

      return {
        url: `/uploads/${filename}`,
        filename,
        mimetype: 'image/webp',
        size: stat.size,
        width: optimizedMeta.width || metadata.width,
        height: optimizedMeta.height || metadata.height,
      };
    } catch (err) {
      console.error('[SHARP ERROR]:', err);
      throw new AppError('Gagal memproses dan mengompresi gambar.', 500);
    }
  }
}

export const mediaService = new MediaService();
