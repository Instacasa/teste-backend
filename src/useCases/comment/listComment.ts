import PostRepository from '@database/repositories/postRepository';
import { RepositoryInterface, CommentInterface, PostInterface } from '@types';

class ListComment {
  repository: RepositoryInterface<PostInterface>;

  constructor() {
    this.repository = new PostRepository();
  }


  public execute = async (postId: number): Promise<CommentInterface[]> => {
    try {
      const post: PostInterface = await this.repository.get(postId);
      return post.comments;
    } catch(error) {
      console.log(error);
      throw error;
    }
  };

}

export default ListComment;