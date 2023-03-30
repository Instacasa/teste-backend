import { PostRepository } from '@repositories';
import { RepositoryInterface, PostInterface } from '@types';

export class GetPostUseCase {
  repository: RepositoryInterface<PostInterface>;

  constructor() {
    this.repository = new PostRepository();
  }


  public execute = async (id: number): Promise<PostInterface> => {
    return await this.repository.get(id);
  };

}
