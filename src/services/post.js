
import postRepository from '../repositories/post.js';

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

function getPosts({ category, take } = {}) {
  return postRepository.getAll(category, take);
}

function getPost(id) {
  const post = postRepository.getById(id);

  if (!post) {
    throw new NotFoundError(`Post with id ${id} was not found`);
  }

  return post;
}

function createPost(data) {
  return postRepository.addPost(data);
}

export default {
  getPosts,
  getPost,
  createPost,
  NotFoundError,
};