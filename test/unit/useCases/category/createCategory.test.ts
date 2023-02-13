import CategoryRepository from '@database/repositories/categoryRepository';
import UserRepository from '@database/repositories/userRepository';
import User from '@domains/user';
import Category from '@domains/category';
import { ValidationError } from '@libs/errors/validationError';
import UserModel from '@models/userModel';
import CategoryModel from '@models/categoryModel';
import { CategoryInterface, UserInterface } from '@types';
import { CreateCategoryUseCase } from '@useCases/category';

describe('Create Category', () => {
  let user: UserInterface;
  beforeAll(async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({ name: 'Admin', isAdmin: true });
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    const repository = new CategoryRepository<CategoryInterface, CategoryModel>();
    await repository.deleteAll();
  });

  test('Should create new category', async () => {
    const useCase = new CreateCategoryUseCase();
    const partialCategory: Partial<CategoryInterface> = {
      label: 'Teste',
    };
    const category = await useCase.execute(user.id, partialCategory);
    expect(category).toBeInstanceOf(Category);
  });

  test("Shouldn't create category without label", async () => {
    const useCase = new CreateCategoryUseCase();
    const partialCategory: Partial<CategoryInterface> = {};
    try {
      await useCase.execute(user.id, partialCategory);
    } catch (error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O nome da categoria é obrigatório');
    }
  });
});
