import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { db } from './prisma/db.js';
import { createPostRepository } from './repositories/post.js';
import { createCategoryRepository } from './repositories/category.js';
import { createUserRepository } from './repositories/user.js';
import { createPostService } from './services/post.js';
import { createCategoryService } from './services/category.js';
import { createUserService } from './services/user.js';
import type { PasswordHasher, TokenSign } from './services/user.types.js';
import { createPostHandler } from './transport/handlers/post.js';
import { createCategoryHandler } from './transport/handlers/category.js';
import { createUserHandler } from './transport/handlers/user.js';
import { createPostRouter } from './transport/routers/post.js';
import { createCategoryRouter } from './transport/routers/category.js';
import { createUserRouter } from './transport/routers/user.js';

const app = express();
const PORT = process.env.PORT || 3000;

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not set in .env');
}
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());

const passwordHasher: PasswordHasher = {
  hash: (password) => argon2.hash(password),
  verify: (hash, password) => argon2.verify(hash, password),
};

const tokenSign: TokenSign = {
  signAccessToken: (userId) =>
    jwt.sign({ sub: String(userId) }, jwtSecret, { expiresIn: '1h' }),
};

const postRepository = createPostRepository(db);
const categoryRepository = createCategoryRepository(db);
const userRepository = createUserRepository(db);

const postService = createPostService(postRepository, categoryRepository, userRepository);
const categoryService = createCategoryService(categoryRepository);
const userService = createUserService(userRepository, passwordHasher, tokenSign);

const postHandler = createPostHandler(postService);
const categoryHandler = createCategoryHandler(categoryService);
const userHandler = createUserHandler(userService);

app.use('/', createPostRouter(postHandler));
app.use('/', createCategoryRouter(categoryHandler));
app.use('/', createUserRouter(userHandler));

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