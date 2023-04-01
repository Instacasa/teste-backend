import { PostRepository } from '@repositories';
import { PostInterface, PostRepositoryInterface } from '@types';

export class ListPostByUserUseCase {
  repository: PostRepositoryInterface<PostInterface>;

  constructor() {
    this.repository = new PostRepository();
  }

  public execute = async (id: number): Promise<PostInterface[]> => {
    return await this.repository.listByUser(id);
  };

}
