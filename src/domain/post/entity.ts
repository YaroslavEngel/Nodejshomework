import type { Category } from '../category/entity.js';

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  categoryId: number;
  category: Category;
}