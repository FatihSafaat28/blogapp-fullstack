import { Request, Response, NextFunction } from 'express';
import { postsService } from './posts.service.js';
import { postsFeedService } from './posts-feed.service.js';
import {
  createDraftSchema,
  updatePostSchema,
  publishToggleSchema,
  exploreQuerySchema,
  dashboardQuerySchema,
} from './posts.schema.js';

export class PostsController {
  // 1. Create Draft
  createDraft = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = req.user!.id;
      const validatedData = createDraftSchema.parse(req.body);
      const post = await postsService.createDraft(authorId, validatedData);

      res.status(201).json({
        success: true,
        message: 'Draf artikel baru berhasil dibuat.',
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  };

  // 2. Auto-Save / Update Post
  autoSavePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = req.user!.id;
      const postId = req.params.id as string;
      const validatedData = updatePostSchema.parse(req.body);
      const post = await postsService.autoSavePost(postId, authorId, validatedData);

      res.status(200).json({
        success: true,
        message: 'Artikel berhasil disimpan.',
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  };

  // 3. Toggle Publish
  togglePublish = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = req.user!.id;
      const postId = req.params.id as string;
      const { published } = publishToggleSchema.parse(req.body);
      const post = await postsService.togglePublish(postId, authorId, published);

      res.status(200).json({
        success: true,
        message: published
          ? 'Artikel berhasil dipublikasikan!'
          : 'Artikel telah dikembalikan ke draf.',
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  };

  // 4. Delete Post
  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = req.user!.id;
      const postId = req.params.id as string;
      const result = await postsService.deletePost(postId, authorId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  // 5. Dashboard Post List
  getDashboardPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = req.user!.id;
      const query = dashboardQuerySchema.parse(req.query);
      const result = await postsService.getDashboardPosts(authorId, query);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // 6. Get Post Data for Editor
  getPostForEdit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = req.user!.id;
      const postId = req.params.id as string;
      const post = await postsService.getPostForEdit(postId, authorId);

      res.status(200).json({
        success: true,
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  };

  // 7. Explore Feed
  getExploreFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = exploreQuerySchema.parse(req.query);
      const result = await postsFeedService.getExploreFeed(query);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // 8. Public Author Articles
  getAuthorPublicPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const username = req.params.username as string;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const result = await postsFeedService.getAuthorPublicPosts(username, page, limit);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // 9. Single Public Article
  getPublicPostBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const username = req.params.username as string;
      const slug = req.params.slug as string;
      const post = await postsFeedService.getPublicPostBySlug(username, slug);

      res.status(200).json({
        success: true,
        data: { post },
      });
    } catch (error) {
      next(error);
    }
  };
}

export const postsController = new PostsController();
