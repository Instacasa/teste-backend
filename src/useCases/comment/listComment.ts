import PostRepository from '@database/repositories/postRepository';
import { RepositoryInterface, CommentInterface, PostInterface } from '@types';

class ListComment {
  repository: RepositoryInterface<PostInterface>;

  constructor() {
    this.repository = new PostRepository();
  }


  public execute = async (postId: number): Promise<CommentInterface[]> => {
    const post: PostInterface = await this.repository.get(postId);
    return post.comments;
  };

}

export default ListComment;