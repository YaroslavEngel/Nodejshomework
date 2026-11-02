import { Router } from 'express';
import type { createUserHandler } from '../handlers/user.js';

export const createUserRouter = (
  userHandler: ReturnType<typeof createUserHandler>,
) => {
  const router = Router();

  router.post('/auth/register', userHandler.register);
  router.post('/auth/login', userHandler.login);

  return router;
};