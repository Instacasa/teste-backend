import { CategoryRepository } from '@repositories';
import { CategoryInterface, RepositoryInterface } from '@types';

export class GetCategoryUseCase {
  repository: RepositoryInterface<CategoryInterface>;

  constructor() {
    this.repository = new CategoryRepository();
  }

  public execute = async (id: number): Promise<CategoryInterface> => {
    return await this.repository.get(id);
  };
}