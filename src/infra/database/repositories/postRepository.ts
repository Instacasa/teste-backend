import { PostModel } from '@models';
import { Post } from '@domains';
import BaseRepository from './baseRepository';

class PostRepository<PostInterface, PostModel> extends BaseRepository<PostInterface, PostModel> {
  constructor() {
    super(PostModel, Post);
  }
}

export default PostRepository;