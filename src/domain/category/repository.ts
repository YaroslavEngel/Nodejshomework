import type { Category } from './entity.js';
import type { CreateCategoryDto } from '../../dto/category_dto.js';

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: number): Promise<Category | undefined>;
  create(data: CreateCategoryDto): Promise<Category>;
}