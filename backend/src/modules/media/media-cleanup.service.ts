import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { prisma } from '../../config/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const UPLOADS_DIR = path.resolve(__dirname, '../../../uploads');

export interface CleanupResult {
  totalScanned: number;
  totalActive: number;
  totalDeleted: number;
  bytesFreed: number;
  deletedFiles: string[];
}

/**
 * Ekstraksi seluruh URL gambar berawalan /uploads/ dari teks HTML
 */
export function extractImageUrlsFromHtml(html?: string | null): string[] {
  if (!html) return [];
  const urls: string[] = [];
  const regex = /\/uploads\/[a-zA-Z0-9_\-\.]+/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    urls.push(match[0]);
  }
  return urls;
}

export class MediaCleanupService {
  /**
   * Mengumpulkan semua nama file gambar yang sedang aktif digunakan di database
   */
  async getActiveFileNames(): Promise<Set<string>> {
    const activeFiles = new Set<string>();

    // 1. Ambil avatar user
    const users = await prisma.user.findMany({
      select: { avatar: true },
      where: { avatar: { not: null } },
    });
    for (const u of users) {
      if (u.avatar && u.avatar.startsWith('/uploads/')) {
        activeFiles.add(path.basename(u.avatar));
      }
    }

    // 2. Ambil coverImage dan contentHtml dari semua Post
    const posts = await prisma.post.findMany({
      select: { coverImage: true, contentHtml: true },
    });
    for (const p of posts) {
      if (p.coverImage && p.coverImage.startsWith('/uploads/')) {
        activeFiles.add(path.basename(p.coverImage));
      }
      if (p.contentHtml) {
        const bodyUrls = extractImageUrlsFromHtml(p.contentHtml);
        for (const url of bodyUrls) {
          activeFiles.add(path.basename(url));
        }
      }
    }

    return activeFiles;
  }

  /**
   * Menjalankan pembersihan file media yatim (orphaned media)
   */
  async cleanOrphanedMedia(): Promise<CleanupResult> {
    try {
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
      const diskFiles = await fs.readdir(UPLOADS_DIR);
      const activeFiles = await this.getActiveFileNames();

      const deletedFiles: string[] = [];
      let bytesFreed = 0;

      for (const file of diskFiles) {
        if (file === '.gitkeep' || file.startsWith('.')) continue;

        if (!activeFiles.has(file)) {
          const filePath = path.join(UPLOADS_DIR, file);
          try {
            const stat = await fs.stat(filePath);
            bytesFreed += stat.size;
            await fs.unlink(filePath);
            deletedFiles.push(file);
          } catch {
            // Abaikan jika file sudah tidak ada
          }
        }
      }

      return {
        totalScanned: diskFiles.length,
        totalActive: activeFiles.size,
        totalDeleted: deletedFiles.length,
        bytesFreed,
        deletedFiles,
      };
    } catch (error) {
      console.error('[Media Cleanup] Gagal menjalankan pembersihan:', error);
      throw error;
    }
  }

  /**
   * Menjadwalkan background cron runner di server Node.js
   */
  startCleanupScheduler(intervalMs = 24 * 60 * 60 * 1000) {
    // Jalankan 5 detik setelah server menyala (non-blocking)
    setTimeout(async () => {
      try {
        const result = await this.cleanOrphanedMedia();
        if (result.totalDeleted > 0) {
          const sizeKb = (result.bytesFreed / 1024).toFixed(1);
          console.log(
            `[Media Cleanup] 🧹 Pembersihan otomatis: ${result.totalDeleted} file yatim dihapus (${sizeKb} KB dibebaskan).`
          );
        }
      } catch {
        // Safe catch
      }
    }, 5000);

    // Jalankan berkala sesuai interval
    return setInterval(async () => {
      try {
        const result = await this.cleanOrphanedMedia();
        if (result.totalDeleted > 0) {
          const sizeKb = (result.bytesFreed / 1024).toFixed(1);
          console.log(
            `[Media Cleanup] 🧹 Pembersihan berkala: ${result.totalDeleted} file yatim dihapus (${sizeKb} KB dibebaskan).`
          );
        }
      } catch {
        // Safe catch
      }
    }, intervalMs);
  }
}

export const mediaCleanupService = new MediaCleanupService();
