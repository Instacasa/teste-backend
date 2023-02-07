import CommentModel from '@models/commentModel';
import Comment from '@/domains/comment';
import BaseRepository from './baseRepository';

class CommentRepository<CommentInterface, CommentModel> extends BaseRepository<CommentInterface, CommentModel> {
  constructor() {
    super(CommentModel, Comment);
  }
}

export default CommentRepository;