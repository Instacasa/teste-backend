import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import { ValidationError } from '@libs/errors/validationError';
import { PostInterface, RepositoryInterface, UserInterface } from '@types';

class DeletePost {
  repository: RepositoryInterface<PostInterface>;
  userRepository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new PostRepository();
    this.userRepository = new UserRepository();
  }


  public execute = async (userId: number, id: number): Promise<void> => {
    try {
      const user = await this.userRepository.get(userId);
      const post = await this.repository.get(id);
      if (!user.isAdmin && user.id !== post.user.id) {
        throw new ValidationError('Apenas o autor ou administradores podem excluir publicações');
      }
      await this.repository.delete(post.id);      
    } catch(error) {
      console.log(error);
      throw error;
    }
  };

}

export default DeletePost;