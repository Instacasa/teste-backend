import  { Post } from '@domains';
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
    const user = await this.userRepository.get(userId);
    if (!user.active) {
      throw new ValidationError('Apenas usuários ativos podem publicar');
    }
    const post = new Post({...data, user});
    return await this.repository.create(post);
  };

}

export default CreatePost;