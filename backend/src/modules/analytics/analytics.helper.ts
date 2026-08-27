import crypto from 'crypto';

/**
 * Generate Hash SHA-256 Anonim untuk Reader Fingerprint
 */
export const generateReaderHash = (
  ip: string,
  userAgent: string,
  userId?: string
): string => {
  const rawSignature = `${ip.trim()}::${userAgent.trim()}::${userId || 'anonymous'}`;
  return crypto.createHash('sha256').update(rawSignature).digest('hex');
};

/**
 * Buat array deret tanggal format YYYY-MM-DD ke belakang
 */
export const generateDateSeries = (
  days: number
): { date: string; views: number }[] => {
  const result: { date: string; views: number }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result.push({ date: dateStr, views: 0 });
  }

  return result;
};
