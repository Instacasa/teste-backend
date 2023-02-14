import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import User from '@domains/user';
import { NotFoundError } from '@libs/errors/notFoundError';
import { ValidationError } from '@libs/errors/validationError';
import UserModel from '@models/userModel';
import { CategoryInterface, UserInterface } from '@types';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
} from '@useCases/category';

describe('Delete Category', () => {
  let user: UserInterface;
  beforeAll(async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({ name: 'Admin', isAdmin: true });
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    const repository = new PostRepository();
    await repository.deleteAll();
  });

  test('Should delete category if user is the admin', async () => {
    const createCategoryUseCase = new CreateCategoryUseCase();
    const deleteCategoryUseCase = new DeleteCategoryUseCase();
    const getCategoryUseCase = new GetCategoryUseCase();
    const partialCategory: Partial<CategoryInterface> = {
      label: 'Test',
    };
    const category = await createCategoryUseCase.execute(user.id, partialCategory);
    await deleteCategoryUseCase.execute(user.id, category.id);

    try {
      await getCategoryUseCase.execute(category.id);
    } catch (error) {
      expect(error as Error).toBeInstanceOf(NotFoundError);
      expect((error as Error).message).toEqual(`category with id ${category.id} can't be found.`);
    }
  });

  test("Shouldn't delete inexistent category", async () => {
    const deleteCategoryUseCase = new DeleteCategoryUseCase();
    try {
      await deleteCategoryUseCase.execute(user.id, 0);
    } catch (error) {
      expect(error as Error).toBeInstanceOf(NotFoundError);
      expect((error as Error).message).toEqual("category with id 0 can't be found.");
    }
  });

  test("Shouldn't delete category if user isn't the admin", async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    const newUser = await userRepository.create(new User({ name: 'New User', isAdmin: false }));
    const createCategoryUseCase = new CreateCategoryUseCase();
    const deleteCategoryUseCase = new DeleteCategoryUseCase();
    const partialCategory: Partial<CategoryInterface> = {
      label: 'Test',
    };
    const category = await createCategoryUseCase.execute(user.id, partialCategory);
    try {
      await deleteCategoryUseCase.execute(newUser.id, category.id);
    } catch (error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('Apenas administradores podem excluir categorias');
    }
  });
});
