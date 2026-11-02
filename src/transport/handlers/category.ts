import type { Request, Response } from 'express';
import type { CategoryService } from '../../services/category.types.js';
import type { CreateCategoryDto } from '../../dto/category_dto.js';

export const createCategoryHandler = (categoryService: CategoryService) => {
  const getCategories = async (_req: Request, res: Response): Promise<Response> => {
    const categories = await categoryService.getCategories();
    return res.status(200).json(categories);
  };

  const getCategoryById = async (
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> => {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    try {
      const category = await categoryService.getCategory(Number(id));
      return res.status(200).json(category);
    } catch (error) {
      if (error instanceof categoryService.NotFoundError) {
        return res.status(404).json({ message: error.message });
      }

      throw error;
    }
  };

  const createCategory = async (
    req: Request<{}, {}, CreateCategoryDto>,
    res: Response,
  ): Promise<Response> => {
    const { name } = req.body ?? {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(422).json({
        message: 'Validation error',
        errors: ['"name" is required and must be a non-empty string'],
      });
    }

    try {
      const category = await categoryService.createCategory({ name: name.trim() });
      return res.status(201).json(category);
    } catch (error) {
      if (error instanceof categoryService.ConflictError) {
        return res.status(409).json({ message: error.message });
      }

      throw error;
    }
  };

  return { getCategories, getCategoryById, createCategory };
};