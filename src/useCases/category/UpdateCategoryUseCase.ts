import CategoryRepository from '@database/repositories/categoryRepository';
import UserRepository from '@database/repositories/userRepository';
import { ValidationError } from '@libs/errors/validationError';
import { RepositoryInterface, CategoryInterface, UserInterface } from '@types';

class UpdateCategoryUseCase {
  categoryRepository: RepositoryInterface<CategoryInterface>;
  userRepository: RepositoryInterface<UserInterface>;

  constructor() {
    this.categoryRepository = new CategoryRepository();
    this.userRepository = new UserRepository();
  }

  public execute = async (
    userId: number,
    id: number,
    data: Partial<CategoryInterface>,
  ): Promise<CategoryInterface> => {
    try {
      const user = await this.userRepository.get(userId);

      if (!user.isAdmin)
        throw new ValidationError('Apenas administradores podem atualizar categorias');

      if (!user.active)
        throw new ValidationError('Apenas administradores ativos podem realizar essa ação');

      const category = await this.categoryRepository.get(id);

      if (data.label) category.label = data.label;

      return await this.categoryRepository.update(category);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default UpdateCategoryUseCase;
