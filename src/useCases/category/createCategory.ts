import { Category } from '@domains';
import { ValidationError } from '@libs/errors';
import { CategoryRepository, UserRepository } from '@repositories';
import { CategoryInterface, RepositoryInterface, UserInterface } from '@types';

export class CreateCategoryUseCase {
  repository: RepositoryInterface<CategoryInterface>;
  userRepository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new CategoryRepository();
    this.userRepository = new UserRepository();
  }
  
  public execute = async (userId: number, data: Partial<CategoryInterface>): Promise<CategoryInterface> => {
    const admin = await this.userRepository.get(userId);
    if (!admin.isAdmin) {
      throw new ValidationError('Apenas administradores podem criar categorias');
    }
    const category = new Category({...data});
    return await this.repository.create(category);
  };  
}