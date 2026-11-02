import type { db as prismaDb } from '../prisma/db.js';
import type { User } from '../domain/user/entity.js';
import type { CreateUserData, UserRepository } from '../domain/user/repository.js';
import { ConflictError } from '../domain/errors.js';

type Db = typeof prismaDb;

const toUser = (row: { id: number; email: string; password: string }): User => ({
  id: row.id,
  email: row.email,
  passwordHash: row.password,
});

export const createUserRepository = (db: Db): UserRepository => {
  const createUser = async (data: CreateUserData): Promise<User> => {
    try {
      const row = await db.orm.public.User.create({
        email: data.email,
        password: data.passwordHash,
      });
      return toUser(row);
    } catch (error) {
      // 23505 — порушення unique (email вже існує)
      if (error instanceof Error && 'sqlState' in error && error.sqlState === '23505') {
        throw new ConflictError('User with this email already exists');
      }
      throw error;
    }
  };

  const getByEmail = async (email: string): Promise<User | undefined> => {
    const row = await db.orm.public.User.first({ email });
    return row ? toUser(row) : undefined;
  };

  const getById = async (id: number): Promise<User | undefined> => {
    const row = await db.orm.public.User.first({ id });
    return row ? toUser(row) : undefined;
  };

  return { createUser, getByEmail, getById };
};