import Category from "@/domains/category";
import CategoryRepository from "@database/repositories/categoryRepository";
import UserRepository from "@database/repositories/userRepository";
import { ValidationError } from "@libs/errors/validationError";
import { RepositoryInterface, CategoryInterface, UserInterface } from "@types";

class CreateCategoryUseCase {
  categoryRepository: RepositoryInterface<CategoryInterface>;
  userRepository: RepositoryInterface<UserInterface>;

  constructor() {
    this.categoryRepository = new CategoryRepository();
    this.userRepository = new UserRepository();
  }

  public execute = async (
    userId: number,
    data: Partial<CategoryInterface>
  ): Promise<CategoryInterface> => {
    try {
      const user = await this.userRepository.get(userId);

      if (!user.isAdmin)
        throw new ValidationError(
          "Apenas administradores podem criar categorias"
        );

      if (!user.active)
        throw new ValidationError(
          "Apenas administradores ativos podem realizar essa ação"
        );

      const category = new Category(data);
      return await this.categoryRepository.create(category);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default CreateCategoryUseCase;
