import { CategoryRepository, UserRepository } from '@repositories';
import { ValidationError } from '@errors';
import { CategoryInterface, RepositoryInterface, UserInterface } from '@types';

export class UpdateCategoryUseCase {
  repository: RepositoryInterface<CategoryInterface>;
  userRepository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new CategoryRepository();
    this.userRepository = new UserRepository();
  }

  public execute = async (userId: number, id: number, data: Partial<CategoryInterface>): Promise<CategoryInterface> => {
    const user = await this.userRepository.get(userId);
    const category = await this.repository.get(id);
    if (!user.isAdmin) {
      throw new ValidationError('Apenas administradores podem editar a categoria');
    }
    
    category.label = data.label ?? category.label;
    const n = await this.repository.update(category);
    return n;
  };

}
