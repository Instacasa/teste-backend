import { PostRepository } from '@repositories';
import { RepositoryInterface, CommentInterface, PostInterface } from '@types';

export class ListCommentUseCase {
  repository: RepositoryInterface<PostInterface>;

  constructor() {
    this.repository = new PostRepository();
  }


  public execute = async (postId: number): Promise<CommentInterface[]> => {
    const post: PostInterface = await this.repository.get(postId);
    return post.comments;
  };

}