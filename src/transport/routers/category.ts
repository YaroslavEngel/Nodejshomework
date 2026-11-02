import { Router } from 'express';
import type { createCategoryHandler } from '../handlers/category.js';

export const createCategoryRouter = (
  categoryHandler: ReturnType<typeof createCategoryHandler>,
) => {
  const router = Router();

  router.get('/categories', categoryHandler.getCategories);
  router.get('/categories/:id', categoryHandler.getCategoryById);
  router.post('/categories', categoryHandler.createCategory);

  return router;
};