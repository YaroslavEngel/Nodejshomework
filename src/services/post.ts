import type { PostRepository } from '../domain/post/repository.js';
import type { PostService } from './post.types.js';
import { NotFoundError } from './post.types.js';

export const createPostService = (postRepository: PostRepository): PostService => {
  const getPosts: PostService['getPosts'] = ({ category, take } = {}) => {
    return postRepository.getAll(category, take);
  };

  const getPost: PostService['getPost'] = async (id) => {
    const post = await postRepository.getById(id);

    if (!post) {
      throw new NotFoundError(`Post with id ${id} was not found`);
    }

    return post;
  };

  const createPost: PostService['createPost'] = (data) => {
    return postRepository.addPost(data);
  };

  return {
    getPosts,
    getPost,
    createPost,
    NotFoundError,
  };
};