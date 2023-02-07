import PostModel from '@models/postModel';
import Post from '@/domains/post';
import BaseRepository from './baseRepository';

class PostRepository<PostInterface, PostModel> extends BaseRepository<PostInterface, PostModel> {
  constructor() {
    super(PostModel, Post);
  }
}

export default PostRepository;