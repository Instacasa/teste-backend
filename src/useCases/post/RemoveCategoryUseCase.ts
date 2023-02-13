import CategoryRepository from '@database/repositories/categoryRepository';
import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import { ValidationError } from '@libs/errors/validationError';
import { CategoryInterface, PostInterface, RepositoryInterface, UserInterface } from '@types';

class RemoveCategoryUseCase {
  postRepository: RepositoryInterface<PostInterface>;
  userRepository: RepositoryInterface<UserInterface>;
  categoryRepository: RepositoryInterface<CategoryInterface>;

  constructor() {
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
    this.categoryRepository = new CategoryRepository();
  }

  public execute = async (userId: number, id: number, categoryId: number): Promise<void> => {
    try {
      const user = await this.userRepository.get(userId);

      const post = await this.postRepository.get(id);

      if (!user.isAdmin && user.id !== post.user.id) {
        throw new ValidationError(
          'Apenas o autor ou administradores podem excluir categorias de um post',
        );
      }

      if (!user.active) {
        throw new ValidationError('Apenas usuários ativos podem realizar essa ação');
      }

      const foundCategory = await this.categoryRepository.get(categoryId);

      post.categories.forEach((item, index) => {
        if (item.id === foundCategory.id) delete post.categories[index];
      });

      await this.postRepository.update(post);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default RemoveCategoryUseCase;
