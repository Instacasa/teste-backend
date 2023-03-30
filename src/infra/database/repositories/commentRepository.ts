import { CommentModel } from '@models';
import { Comment } from '@domains';
import BaseRepository from './baseRepository';

class CommentRepository<CommentInterface, CommentModel> extends BaseRepository<CommentInterface, CommentModel> {
  constructor() {
    super(CommentModel, Comment);
  }
}

export default CommentRepository;