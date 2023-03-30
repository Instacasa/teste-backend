import { PostRepository } from '@repositories';
import { RepositoryInterface, PostInterface } from '@types';

class ListPost {
  repository: RepositoryInterface<PostInterface>;

  constructor() {
    this.repository = new PostRepository();
  }


  public execute = async (): Promise<PostInterface[]> => {
    return await this.repository.list();
  };

}

export default ListPost;