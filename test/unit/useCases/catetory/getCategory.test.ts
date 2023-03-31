import { User } from '@domains';
import { NotFoundError } from '@errors';
import { faker } from '@faker-js/faker';
import { CategoryModel, UserModel } from '@models';
import { CategoryRepository, UserRepository } from '@repositories';
import { CategoryInterface, UserInterface } from '@types';
import { CreateCategoryUseCase, GetCategoryUseCase } from '@useCases';

describe('Get Category', () => {
  let createCategory: CreateCategoryUseCase;
  let getCategory: GetCategoryUseCase;
  let repository: CategoryRepository<CategoryInterface, CategoryModel>;
  let user: UserInterface;
  beforeAll(async () => {
    createCategory = new CreateCategoryUseCase();
    getCategory = new GetCategoryUseCase();
    repository = new CategoryRepository<CategoryInterface, CategoryModel>();

    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({name: 'Normal user', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    await repository.deleteAll();
  });

  test('Should get category', async () => {
    const partialCategory: Partial<CategoryInterface> = { label: faker.lorem.word() };
    const category = await createCategory.execute(user.id, partialCategory);
    const gettedCategory = await getCategory.execute(category.id);
    expect(gettedCategory.label).toEqual(partialCategory.label);
  });

  test('Shouldn\'t get inexistent category', async () => {
    await expect(() => 
      getCategory.execute(0)
    ).rejects.toThrowError(new NotFoundError('category with id 0 can\'t be found.'));
  });
});