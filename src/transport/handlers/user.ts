import type { Request, Response } from 'express';
import type { UserService } from '../../services/user.types.js';
import type { RegisterDto, LoginDto } from '../../dto/user_dto.js';
import { ConflictError, UnauthorizedError } from '../../domain/errors.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createUserHandler = (userService: UserService) => {
  const register = async (
    req: Request<{}, {}, RegisterDto>,
    res: Response,
  ): Promise<Response> => {
    const { email, password } = req.body ?? {};
    const errors: string[] = [];

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      errors.push('"email" must be a valid email');
    }

    if (typeof password !== 'string' || password.length < 6) {
      errors.push('"password" must be a string with at least 6 characters');
    }

    if (errors.length > 0) {
      return res.status(422).json({ message: 'Validation error', errors });
    }

    try {
      const user = await userService.register({ email, password });
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof ConflictError) {
        return res.status(409).json({ message: error.message });
      }

      throw error;
    }
  };

  const login = async (
    req: Request<{}, {}, LoginDto>,
    res: Response,
  ): Promise<Response> => {
    const { email, password } = req.body ?? {};
    const errors: string[] = [];

    if (typeof email !== 'string' || !email.trim()) {
      errors.push('"email" is required and must be a non-empty string');
    }

    if (typeof password !== 'string' || !password) {
      errors.push('"password" is required and must be a non-empty string');
    }

    if (errors.length > 0) {
      return res.status(422).json({ message: 'Validation error', errors });
    }

    try {
      const { user, accessToken } = await userService.login({ email, password });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
      });

      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return res.status(401).json({ message: error.message });
      }

      throw error;
    }
  };

  return { register, login };
};