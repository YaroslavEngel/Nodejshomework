import type { db as prismaDb } from '../prisma/db.js';
import type { Category } from '../domain/category/entity.js';
import type { CategoryRepository } from '../domain/category/repository.js';
import type { CreateCategoryDto } from '../dto/category_dto.js';
import { ConflictError } from '../domain/errors.js';

type Db = typeof prismaDb;

export const createCategoryRepository = (db: Db): CategoryRepository => {
  const getAll = async (): Promise<Category[]> => {
    return await db.orm.public.Category.orderBy((c) => c.id.asc()).all();
  };

  const getById = async (id: number): Promise<Category | undefined> => {
    const category = await db.orm.public.Category.first({ id });
    return category ?? undefined;
  };

  const create = async (data: CreateCategoryDto): Promise<Category> => {
    try {
      return await db.orm.public.Category.create({ name: data.name });
    } catch (error) {
      if (error instanceof Error && 'sqlState' in error && error.sqlState === '23505') {
        throw new ConflictError(`Category "${data.name}" already exists`);
      }
      throw error;
    }
  };

  return { getAll, getById, create };
};