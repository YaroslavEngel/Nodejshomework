import type { Category } from '../domain/category/entity.js';
import type { CreateCategoryDto } from '../dto/category_dto.js';
import type { NotFoundError, ConflictError } from '../domain/errors.js';

export interface CategoryService {
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category>;
  createCategory(data: CreateCategoryDto): Promise<Category>;
  NotFoundError: typeof NotFoundError;
  ConflictError: typeof ConflictError;
}