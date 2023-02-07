import CommentRepository from '@database/repositories/commentRepository';
import PostRepository from '@database/repositories/postRepository';
import { RepositoryInterface, CommentInterface, PostInterface } from '@types';

class GetComment {
  repository: RepositoryInterface<CommentInterface>;
  postRepository: RepositoryInterface<PostInterface>;

  constructor() {
    this.repository = new CommentRepository();
    this.postRepository = new PostRepository();
  }


  public execute = async (postId: number, id: number): Promise<CommentInterface> => {
    try {
      await this.postRepository.get(postId);
      return await this.repository.get(id);
    } catch(error) {
      console.log(error);
      throw error;
    }
  };

}

export default GetComment;