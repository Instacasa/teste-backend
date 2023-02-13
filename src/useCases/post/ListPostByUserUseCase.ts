import PostRepository from '@database/repositories/postRepository';
import { PostInterface, PostRepositoryInterface } from '@types';

class ListPostByUserUseCase {
  postRepository: PostRepositoryInterface;

  constructor() {
    this.postRepository = new PostRepository();
  }

  public execute = async (userId: number): Promise<PostInterface[]> => {
    try {
      return await this.postRepository.listByUser(userId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default ListPostByUserUseCase;
