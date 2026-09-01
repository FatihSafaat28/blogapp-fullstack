export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface EditorTag {
  id: string;
  name: string;
  slug: string;
}

export interface PostDetail {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  contentHtml: string;
  contentJson?: unknown;
  excerpt: string | null;
  coverImage: string | null;
  readingTimeMinutes: number;
  published: boolean;
  publishedAt: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  postTags?: {
    id: string;
    postId: string;
    tagId: string;
    tag: EditorTag;
  }[];
}

export interface AutoSavePayload {
  title: string;
  slug?: string;
  coverImage?: string | null;
  contentHtml: string;
  contentJson?: unknown;
  excerpt?: string | null;
  tags?: string[];
}

export interface PostDetailResponse {
  success: boolean;
  message?: string;
  data: {
    post: PostDetail;
  };
}

export interface AutoSaveResponse {
  success: boolean;
  message: string;
  data: {
    post: PostDetail;
  };
}
