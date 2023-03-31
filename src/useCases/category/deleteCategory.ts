import { ValidationError } from '@errors';
import { CategoryRepository, UserRepository } from '@repositories';
import { CategoryInterface, RepositoryInterface, UserInterface } from '@types';

export class DeleteCategoryUseCase {
  repository: RepositoryInterface<CategoryInterface>;
  userRepository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new CategoryRepository();
    this.userRepository = new UserRepository();
  }

  public execute = async (userId: number, id: number): Promise<void> => {
    const user = await this.userRepository.get(userId);
    const category = await this.repository.get(id);
    if (!user.isAdmin) {
      throw new ValidationError('Apenas administradores podem excluir categorias');
    }
    await this.repository.delete(category.id);
  };
}