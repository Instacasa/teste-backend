import { UserRepository, PostRepository } from '@repositories';
import { ValidationError } from '@errors';
import { PostInterface, RepositoryInterface, UserInterface } from '@types';

export class DeletePostUseCase {
  repository: RepositoryInterface<PostInterface>;
  userRepository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new PostRepository();
    this.userRepository = new UserRepository();
  }


  public execute = async (userId: number, id: number): Promise<void> => {
    const user = await this.userRepository.get(userId);
    const post = await this.repository.get(id);
    if (!user.isAdmin && user.id !== post.user.id) {
      throw new ValidationError('Apenas o autor ou administradores podem excluir publicações');
    }
    await this.repository.delete(post.id);      
  };

}
