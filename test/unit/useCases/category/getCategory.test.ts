import CategoryRepository from '@database/repositories/categoryRepository';
import UserRepository from '@database/repositories/userRepository';
import User from '@domains/user';
import { NotFoundError } from '@libs/errors/notFoundError';
import UserModel from '@models/userModel';
import { CategoryInterface, UserInterface } from '@types';
import { CreateCategoryUseCase, GetCategoryUseCase } from '@useCases/category';

describe('Get Category', () => {
  let user: UserInterface;
  beforeAll(async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({ name: 'Admin', isAdmin: true });
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    const repository = new CategoryRepository();
    await repository.deleteAll();
  });

  test('Should get category', async () => {
    const createCagetoryUseCase = new CreateCategoryUseCase();
    const getCategoryUseCase = new GetCategoryUseCase();
    const partialCategory: Partial<CategoryInterface> = {
      label: 'Test',
    };
    const createdCategory = await createCagetoryUseCase.execute(user.id, partialCategory);
    const getedCategory = await getCategoryUseCase.execute(createdCategory.id);
    expect(getedCategory.label).toEqual('Test');
  });

  test("Shouldn't get inexistent category", async () => {
    const getCategoryUseCase = new GetCategoryUseCase();
    try {
      await getCategoryUseCase.execute(0);
    } catch (error) {
      expect(error as Error).toBeInstanceOf(NotFoundError);
      expect((error as Error).message).toEqual("category with id 0 can't be found.");
    }
  });
});
