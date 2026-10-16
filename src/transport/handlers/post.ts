import type { Request, Response } from 'express';
import type { PostService } from '../../services/post.types.js';
import type { CreatePostDto, GetPostsQueryDto } from '../../dto/post_dto.js';

export const createPostHandler = (postService: PostService) => {
  const getPosts = async (
    req: Request<{}, {}, {}, GetPostsQueryDto>,
    res: Response,
  ): Promise<Response> => {
    const { category, take } = req.query;

    if (take !== undefined && (!/^\d+$/.test(take) || Number(take) <= 0)) {
      return res.status(422).json({
        message: 'Validation error',
        errors: ['Query parameter take must be positive integer'],
      });
    }

    const posts = await postService.getPosts({
      category,
      take: take !== undefined ? Number(take) : undefined,
    });

    return res.status(200).json(posts);
  };

  const getPostById = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> => {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    try {
      const post = await postService.getPost(Number(id));
      return res.status(200).json(post);
    } catch (error) {
      if (error instanceof postService.NotFoundError) {
        return res.status(404).json({ message: error.message });
      }

      throw error;
    }
  };

  const createPost = async (
    req: Request<{}, {}, CreatePostDto>,
    res: Response,
  ): Promise<Response> => {
    const { title, content, author, categoryId } = req.body ?? {};

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({ message: 'categoryId must be a positive integer' });
    }

    const errors: string[] = [];

    if (!title || typeof title !== 'string' || !title.trim()) {
      errors.push('"title" is required and must be a non-empty string');
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      errors.push('"content" is required and must be a non-empty string');
    }

    if (author !== undefined && typeof author !== 'string') {
      errors.push('"author" must be a string');
    }

    if (errors.length > 0) {
      return res.status(422).json({
        message: 'Validation error',
        errors,
      });
    }

    try {
      const newPost = await postService.createPost({ title, content, author, categoryId });
      return res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof postService.NotFoundError) {
        return res.status(404).json({ message: error.message });
      }

      throw error;
    }
  };

  return {
    getPosts,
    getPostById,
    createPost,
  };
};