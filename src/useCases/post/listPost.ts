import PostRepository from '@database/repositories/postRepository';
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