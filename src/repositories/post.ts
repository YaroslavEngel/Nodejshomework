import type { db as prismaDb } from '../prisma/db.js';
import type { Post } from '../domain/post/entity.js';
import type { PostRepository } from '../domain/post/repository.js';
import type { CreatePostDto } from '../dto/post_dto.js';

type Db = typeof prismaDb;

export const createPostRepository = (db: Db): PostRepository => {
  const getAll = async (
    category?: string | undefined,
    take?: number | undefined,
  ): Promise<Post[]> => {
    const posts = db.orm.public.Post;

    if (category && take !== undefined) {
      return await posts.where({ category }).orderBy((p) => p.id.asc()).limit(take).all();
    }

    if (category) {
      return await posts.where({ category }).orderBy((p) => p.id.asc()).all();
    }

    if (take !== undefined) {
      return await posts.orderBy((p) => p.id.asc()).limit(take).all();
    }

    return await posts.orderBy((p) => p.id.asc()).all();
  };

  const getById = async (id: number): Promise<Post | undefined> => {
    const post = await db.orm.public.Post.first({ id });
    return post ?? undefined;
  };

  const addPost = async (data: CreatePostDto): Promise<Post> => {
    return await db.orm.public.Post.create({
      title: data.title,
      content: data.content,
      author: data.author ?? 'Anonymous',
      category: data.category ?? 'general',
    });
  };

  return { getAll, getById, addPost };
};