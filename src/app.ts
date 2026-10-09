import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createPostRepository } from './repositories/post.js';
import { createPostService } from './services/post.js';
import { createPostHandler } from './transport/handlers/post.js';
import { createPostRouter } from './transport/routers/post.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const postRepository = createPostRepository();
const postService = createPostService(postRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler);

app.use('/', postRouter);

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