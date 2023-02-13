import CategoryRepository from '@database/repositories/categoryRepository';
import UserRepository from '@database/repositories/userRepository';
import User from '@domains/user';
import UserModel from '@models/userModel';
import { CategoryInterface, UserInterface } from '@types';
import { CreateCategoryUseCase, ListCategoryUseCase } from '@useCases/category';

describe('List Category', () => {
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

  test('Should list category', async () => {
    const createCategoryUseCase = new CreateCategoryUseCase();
    const listCategoryUseCase = new ListCategoryUseCase();
    const partialCategory1: Partial<CategoryInterface> = {
      label: 'Test_Category1',
    };
    const partialCategory2: Partial<CategoryInterface> = {
      label: 'Test_Category2',
    };
    const createdCategory1 = await createCategoryUseCase.execute(user.id, partialCategory1);
    const createdCategory2 = await createCategoryUseCase.execute(user.id, partialCategory2);
    const list = await listCategoryUseCase.execute();
    expect(list).toHaveLength(2);
    expect(list[0].id).toEqual(createdCategory2.id);
    expect(list[1].id).toEqual(createdCategory1.id);
  });
});
