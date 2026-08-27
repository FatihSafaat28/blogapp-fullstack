import sanitizeHtml from 'sanitize-html';
import { PrismaClient } from '@prisma/client';

/**
 * Sanitasi konten HTML dari Tiptap editor untuk proteksi XSS
 */
export const sanitizeHtmlContent = (rawHtml: string): string => {
  if (!rawHtml) return '';

  return sanitizeHtml(rawHtml, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'p',
      'a',
      'ul',
      'ol',
      'nl',
      'li',
      'b',
      'i',
      'strong',
      'em',
      'strike',
      'code',
      'hr',
      'br',
      'div',
      'span',
      'table',
      'thead',
      'caption',
      'tbody',
      'tr',
      'th',
      'td',
      'pre',
      'img',
      'figure',
      'figcaption',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      code: ['class'],
      pre: ['class'],
      div: ['class'],
      span: ['class'],
    },
    allowedSchemes: ['http', 'https', 'data'],
  });
};

/**
 * Hitung estimasi waktu baca (kata / 200 kata per menit)
 */
export const calculateReadingTime = (contentHtml: string): number => {
  if (!contentHtml) return 1;
  const cleanText = contentHtml.replace(/<[^>]*>?/gm, ' ').trim();
  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

/**
 * Ekstrak ringkasan teks otomatis dari paragraf pertama
 */
export const extractExcerpt = (
  contentHtml: string,
  maxLength = 160
): string => {
  if (!contentHtml) return '';
  const cleanText = contentHtml.replace(/<[^>]*>?/gm, ' ').trim();
  if (cleanText.length <= maxLength) return cleanText;
  return `${cleanText.substring(0, maxLength).trim()}...`;
};

/**
 * Konversi teks ke format slug URL-friendly
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Ganti spasi dengan tanda hubung
    .replace(/[^\w-]+/g, '') // Hapus karakter non-alfanumerik
    .replace(/--+/g, '-') // Ganti double strip dengan single
    .replace(/^-+/, '') // Trim strip di awal
    .replace(/-+$/, ''); // Trim strip di akhir
};

/**
 * Generate slug unik per authorId di database
 */
export const generateUniqueSlug = async (
  prismaClient: PrismaClient,
  authorId: string,
  baseText: string,
  excludePostId?: string
): Promise<string> => {
  const baseSlug = slugify(baseText) || 'post';
  let candidateSlug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prismaClient.post.findUnique({
      where: {
        authorId_slug: {
          authorId,
          slug: candidateSlug,
        },
      },
      select: { id: true },
    });

    if (!existing || existing.id === excludePostId) {
      return candidateSlug;
    }

    counter += 1;
    candidateSlug = `${baseSlug}-${counter}`;
  }
};
