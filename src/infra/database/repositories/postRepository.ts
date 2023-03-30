import { PostModel } from '@models';
import { Post } from '@domains';
import { BaseRepository } from '@repositories';

export class PostRepository<PostInterface, PostModel> extends BaseRepository<PostInterface, PostModel> {
  constructor() {
    super(PostModel, Post);
  }
}
