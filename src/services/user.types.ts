import type { PublicUser } from '../domain/user/entity.js';
import type { RegisterDto, LoginDto } from '../dto/user_dto.js';

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  verify(hash: string, password: string): Promise<boolean>;
}

export interface TokenSign {
  signAccessToken(userId: number): string;
}

export interface UserService {
  register(input: RegisterDto): Promise<PublicUser>;
  login(input: LoginDto): Promise<{ user: PublicUser; accessToken: string }>;
}