import type { CategoryRepository } from '../domain/category/repository.js';
import type { CategoryService } from './category.types.js';
import { NotFoundError, ConflictError } from '../domain/errors.js';

export const createCategoryService = (
  categoryRepository: CategoryRepository,
): CategoryService => {
  const getCategories: CategoryService['getCategories'] = () => {
    return categoryRepository.getAll();
  };

  const getCategory: CategoryService['getCategory'] = async (id) => {
    const category = await categoryRepository.getById(id);

    if (!category) {
      throw new NotFoundError(`Category with id ${id} was not found`);
    }

    return category;
  };

  const createCategory: CategoryService['createCategory'] = (data) => {
    return categoryRepository.create(data);
  };

  return { getCategories, getCategory, createCategory, NotFoundError, ConflictError };
};