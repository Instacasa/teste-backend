import CategoryRepository from "@database/repositories/categoryRepository";
import { RepositoryInterface, CategoryInterface } from "@types";

class ListCategoryUseCase {
  repository: RepositoryInterface<CategoryInterface>;

  constructor() {
    this.repository = new CategoryRepository();
  }

  public execute = async (): Promise<CategoryInterface[]> => {
    try {
      return await this.repository.list();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default ListCategoryUseCase;
