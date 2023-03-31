import  { Post } from '@domains';
import { UserRepository, PostRepository } from '@repositories';
import { ValidationError } from '@errors';
import { RepositoryInterface, PostInterface, UserInterface } from '@types';

export class CreatePostUseCase {
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
    if (!data.categories?.length) {
      throw new ValidationError('Publicações precisam possuir pelo menos uma categoria');
    }
    const post = new Post({...data, user});
    return await this.repository.create(post);
  };

}
