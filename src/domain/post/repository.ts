import type { Post } from './entity.js';
import type { CreatePostDto } from '../../dto/post_dto.js';

export interface PostRepository {
  getAll(category?: string | undefined, take?: number | undefined): Post[];
  getById(id: number): Post | undefined;
  addPost(data: CreatePostDto): Promise<Post>;
}