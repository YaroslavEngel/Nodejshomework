import { Router } from 'express';
import type { createPostHandler } from '../handlers/post.js';

export const createPostRouter = (postHandler: ReturnType<typeof createPostHandler>) => {
  const router = Router();

  router.get('/posts', postHandler.getPosts);
  router.get('/posts/:id', postHandler.getPostById);
  router.post('/posts', postHandler.createPost);

  return router;
};