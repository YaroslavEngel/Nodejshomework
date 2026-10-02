import type { Post } from '../domain/post/entity.js';
import type { CreatePostDto } from '../dto/post_dto.js';

export interface PostService {
  getPosts(params?: { category?: string | undefined; take?: number | undefined }): Post[];
  getPost(id: number): Post;
  createPost(data: CreatePostDto): Promise<Post>;
  NotFoundError: typeof NotFoundError;
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}