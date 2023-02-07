import Post from '@/domains/post';
import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import { ValidationError } from '@libs/errors/validationError';
import { RepositoryInterface, PostInterface, UserInterface } from '@types';

class CreatePost {
  repository: RepositoryInterface<PostInterface>;
  userRepository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new PostRepository();
    this.userRepository = new UserRepository();
  }

  public execute = async (userId:number, data: Partial<PostInterface>): Promise<PostInterface> => {
    try {
      const user = await this.userRepository.get(userId);
      if (!user.active) {
        throw new ValidationError('Apenas usuários ativos podem publicar');
      }
      const post = new Post({...data, user});
      return await this.repository.create(post);
    } catch(error) {
      console.log(error);
      throw error;
    }
  };

}

export default CreatePost;