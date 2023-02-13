import CategoryRepository from '@database/repositories/categoryRepository';
import { RepositoryInterface, CategoryInterface } from '@types';

class GetCategoryUseCase {
  repository: RepositoryInterface<CategoryInterface>;

  constructor() {
    this.repository = new CategoryRepository();
  }

  public execute = async (id: number): Promise<CategoryInterface> => {
    try {
      return await this.repository.get(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default GetCategoryUseCase;
