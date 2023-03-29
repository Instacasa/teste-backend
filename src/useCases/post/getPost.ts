import PostRepository from '@database/repositories/postRepository';
import { RepositoryInterface, PostInterface } from '@types';

class GetPost {
  repository: RepositoryInterface<PostInterface>;

  constructor() {
    this.repository = new PostRepository();
  }


  public execute = async (id: number): Promise<PostInterface> => {
    return await this.repository.get(id);
  };

}

export default GetPost;