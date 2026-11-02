import type { Post } from '../domain/post/entity.js';
import type { CreatePostDto } from '../dto/post_dto.js';
import type { NotFoundError } from '../domain/errors.js';

export interface PostService {
  getPosts(params?: {
    category?: string | undefined;
    take?: number | undefined;
  }): Promise<Post[]>;
  getPost(id: number): Promise<Post>;
  createPost(data: CreatePostDto): Promise<Post>;
  NotFoundError: typeof NotFoundError;
}