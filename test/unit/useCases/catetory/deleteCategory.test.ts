import { User } from '@domains';
import { faker } from '@faker-js/faker';
import { NotFoundError } from '@errors';
import { CategoryModel, UserModel } from '@models';
import { CategoryRepository, UserRepository } from '@repositories';
import { CategoryInterface, UserInterface } from '@types';
import { CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoryUseCase } from '@useCases';

describe('Delete Category', () => {
  let user: UserInterface;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let categoryRepository: CategoryRepository<CategoryInterface, CategoryModel>;
  beforeAll(async () => {
    categoryRepository = new CategoryRepository<CategoryInterface, CategoryModel>();
    userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({ name: 'Admin', isAdmin: true });
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    await categoryRepository.deleteAll();
  });

  test('Should delete category if user is the admin', async () => {
    const createCategory = new CreateCategoryUseCase();
    const deleteCategory = new DeleteCategoryUseCase();
    const getCategory = new GetCategoryUseCase();
    const partialCategory: Partial<CategoryInterface> = { label: faker.lorem.word() };
    const category = await createCategory.execute(user.id, partialCategory);
    await deleteCategory.execute(user.id, category.id);
    await expect(() => 
      getCategory.execute(category.id)
    ).rejects.toThrowError(new NotFoundError(`category with id ${category.id} can't be found.`));
  });

});