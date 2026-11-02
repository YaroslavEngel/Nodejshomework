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
    let categoryId: number | undefined;

    if (category) {
      const found = await db.orm.public.Category.first({ name: category });

      if (!found) {
        return [];
      }

      categoryId = found.id;
    }

    if (categoryId !== undefined && take !== undefined) {
      return await posts
        .where({ categoryId })
        .include('category')
        .include('author', (u) => u.select('id', 'email'))
        .orderBy((p) => p.id.asc())
        .limit(take)
        .all();
    }

    if (categoryId !== undefined) {
      return await posts
        .where({ categoryId })
        .include('category')
        .include('author', (u) => u.select('id', 'email'))
        .orderBy((p) => p.id.asc())
        .all();
    }

    if (take !== undefined) {
      return await posts
        .include('category')
        .include('author', (u) => u.select('id', 'email'))
        .orderBy((p) => p.id.asc())
        .limit(take)
        .all();
    }

    return await posts
      .include('category')
      .include('author', (u) => u.select('id', 'email'))
      .orderBy((p) => p.id.asc())
      .all();
  };

  const getById = async (id: number): Promise<Post | undefined> => {
    const post = await db.orm.public.Post
      .where({ id })
      .include('category')
      .include('author', (u) => u.select('id', 'email'))
      .first();

    return post ?? undefined;
  };

  const addPost = async (data: CreatePostDto): Promise<Post> => {
    const created = await db.orm.public.Post.create({
      title: data.title,
      content: data.content,
      categoryId: data.categoryId,
      authorId: data.authorId,
    });

    const post = await getById(created.id);

    if (!post) {
      throw new Error('Post was not found after creation');
    }

    return post;
  };

  return { getAll, getById, addPost };
};