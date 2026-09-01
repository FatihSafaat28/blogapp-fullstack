import { mediaCleanupService } from '../src/modules/media/media-cleanup.service.js';
import { prisma } from '../src/config/prisma.js';

async function main() {
  console.log('🧹 [Media Cleanup CLI] Memulai audit dan pembersihan file yatim...');

  try {
    const result = await mediaCleanupService.cleanOrphanedMedia();

    console.log('----------------------------------------------------');
    console.log(`📁 Total File di Folder Uploads : ${result.totalScanned}`);
    console.log(`✅ Total File Aktif di Database : ${result.totalActive}`);
    console.log(`🗑️  Total File Yatim Dihapus     : ${result.totalDeleted}`);
    console.log(`💾 Ruang Disk yang Dibebaskan   : ${(result.bytesFreed / 1024).toFixed(1)} KB`);

    if (result.deletedFiles.length > 0) {
      console.log('📋 Daftar file yang dihapus:');
      result.deletedFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
      });
    } else {
      console.log('✨ Storage bersih! Tidak ada file yatim yang tertinggal.');
    }
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('❌ Gagal menjalankan pembersihan media:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
