import postRepository from '../repositories/post.js';
import type { Post } from '../repositories/post.js';
import type { CreatePostDto } from '../dto/post_dto.js';

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

const getPosts = (
  { category, take }: { category?: string | undefined; take?: number | undefined } = {}): Post[] => {
  return postRepository.getAll(category, take);
};

const getPost=(id: number) => {
  const post = postRepository.getById(id);

  if (!post) {
    throw new NotFoundError(`Post with id ${id} was not found`);
  }

  return post;
}

const createPost=(data: CreatePostDto) => {
  return postRepository.addPost(data);
}

export default {
  getPosts,
  getPost,
  createPost,
  NotFoundError,
};