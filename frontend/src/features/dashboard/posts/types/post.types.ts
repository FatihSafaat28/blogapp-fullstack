export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface PostTagItem {
  id: string;
  postId: string;
  tagId: string;
  tag: Tag;
}

export interface PostListItem {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  contentHtml: string;
  excerpt: string | null;
  coverImage: string | null;
  readingTimeMinutes: number;
  published: boolean;
  publishedAt: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  postTags?: PostTagItem[];
}

export interface DashboardQueryParams {
  status?: 'all' | 'published' | 'draft';
  search?: string;
  page?: number;
  limit?: number;
}

export interface DashboardPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DashboardPostsResponse {
  success: boolean;
  message?: string;
  data: {
    posts: PostListItem[];
    pagination: DashboardPagination;
  };
}

export interface TogglePublishResponse {
  success: boolean;
  message: string;
  data: {
    post: PostListItem;
  };
}

export interface CreateDraftResponse {
  success: boolean;
  message: string;
  data: {
    post: PostListItem;
  };
}
