import { PostRepository } from '@repositories';
import { RepositoryInterface, PostInterface } from '@types';

export class ListPostUseCase {
  repository: RepositoryInterface<PostInterface>;

  constructor() {
    this.repository = new PostRepository();
  }


  public execute = async (): Promise<PostInterface[]> => {
    return await this.repository.list();
  };

}
