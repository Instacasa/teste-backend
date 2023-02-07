import PostRepository from '@database/repositories/postRepository';
import { RepositoryInterface, PostInterface } from '@types';

class GetPost {
  repository: RepositoryInterface<PostInterface>;

  constructor() {
    this.repository = new PostRepository();
  }


  public execute = async (id: number): Promise<PostInterface> => {
    try {
      return await this.repository.get(id);
    } catch(error) {
      console.log(error);
      throw error;
    }
  };

}

export default GetPost;