import type { Category } from '../category/entity.js';
import type { PublicUser } from '../user/entity.js';

export interface Post {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  authorId: number;
  category: Category;
  author: PublicUser | null;
}