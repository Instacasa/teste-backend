import { CommentRepository, PostRepository } from '@repositories';
import { RepositoryInterface, CommentInterface, PostInterface } from '@types';

class GetComment {
  repository: RepositoryInterface<CommentInterface>;
  postRepository: RepositoryInterface<PostInterface>;

  constructor() {
    this.repository = new CommentRepository();
    this.postRepository = new PostRepository();
  }


  public execute = async (postId: number, id: number): Promise<CommentInterface> => {
    await this.postRepository.get(postId);
    return await this.repository.get(id);
  };

}

export default GetComment;