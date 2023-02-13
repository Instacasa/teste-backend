import CategoryRepository from '@database/repositories/categoryRepository';
import UserRepository from '@database/repositories/userRepository';
import PostRepository from '@database/repositories/postRepository';
import { ValidationError } from '@libs/errors/validationError';
import { RepositoryInterface, CategoryInterface, UserInterface, PostInterface } from '@types';

class DeleteCategoryUseCase {
  categoryRepository: RepositoryInterface<CategoryInterface>;
  userRepository: RepositoryInterface<UserInterface>;
  postRepository: RepositoryInterface<PostInterface>;

  constructor() {
    this.categoryRepository = new CategoryRepository();
    this.userRepository = new UserRepository();
    this.postRepository = new PostRepository();
  }

  public execute = async (userId: number, id: number): Promise<void> => {
    try {
      const user = await this.userRepository.get(userId);

      if (!user.isAdmin)
        throw new ValidationError('Apenas administradores podem excluir categorias');

      if (!user.active)
        throw new ValidationError('Apenas administradores ativos podem realizar essa ação');

      //const posts = await this.postRepository.get(userId);

      //TODO: verificar a existencia de posts relacionados caso sim não será realizada a ação.
      await this.categoryRepository.delete(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default DeleteCategoryUseCase;
