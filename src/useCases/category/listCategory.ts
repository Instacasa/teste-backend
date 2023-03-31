import { CategoryRepository } from '@repositories';
import { CategoryInterface, RepositoryInterface } from '@types';

export class ListCategoryUseCase {
  repository: RepositoryInterface<CategoryInterface>;

  constructor() {
    this.repository = new CategoryRepository();
  }

  public execute = async (): Promise<CategoryInterface[]> => {
    return await this.repository.list();
  };
}