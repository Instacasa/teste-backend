import { CommentModel } from '@models';
import { Comment } from '@domains';
import { BaseRepository } from '@repositories';

export class CommentRepository<CommentInterface, CommentModel> extends BaseRepository<CommentInterface, CommentModel> {
  constructor() {
    super(CommentModel, Comment);
  }
}