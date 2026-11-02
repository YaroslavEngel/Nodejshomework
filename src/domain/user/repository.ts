import type { User } from './entity.js';

export interface CreateUserData {
  email: string;
  passwordHash: string;
}

export interface UserRepository {
  createUser(data: CreateUserData): Promise<User>;
  getByEmail(email: string): Promise<User | undefined>;
  getById(id: number): Promise<User | undefined>;
}