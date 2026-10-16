import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { db } from './prisma/db.js';
import { createPostRepository } from './repositories/post.js';
import { createCategoryRepository } from './repositories/category.js';
import { createPostService } from './services/post.js';
import { createCategoryService } from './services/category.js';
import { createPostHandler } from './transport/handlers/post.js';
import { createCategoryHandler } from './transport/handlers/category.js';
import { createPostRouter } from './transport/routers/post.js';
import { createCategoryRouter } from './transport/routers/category.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const postRepository = createPostRepository(db);
const categoryRepository = createCategoryRepository(db);

const postService = createPostService(postRepository, categoryRepository);
const categoryService = createCategoryService(categoryRepository);

const postHandler = createPostHandler(postService);
const categoryHandler = createCategoryHandler(categoryService);

const postRouter = createPostRouter(postHandler);
const categoryRouter = createCategoryRouter(categoryHandler);

app.use('/', postRouter);
app.use('/', categoryRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`forum-api is running on http://localhost:${PORT}`);
});