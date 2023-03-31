import { mockCategories } from '@mocks/category';
import { CategoryModel, UserModel } from '@models';
import { CategoryRepository, UserRepository } from '@repositories';
import { CategoryInterface, UserInterface } from '@types';

describe('Category Repository', () => {
  let categoryRepository: CategoryRepository<CategoryInterface, CategoryModel>;
  let userRepository: UserRepository<UserInterface, UserModel>;

  beforeEach(async () => {
    categoryRepository = new CategoryRepository<CategoryInterface, CategoryModel>();
    userRepository = new UserRepository<UserInterface, UserModel>();
    await categoryRepository.deleteAll();
  });

  test('Should create new element on database', async () => {
    const [ category ]: CategoryInterface[] = mockCategories([{}]);
    const newCategory = await categoryRepository.create(category);

    expect(newCategory.id).toBeDefined();
    expect(newCategory.id).toBeGreaterThan(0);
    expect(newCategory.label).toEqual(category.label);
  });
});