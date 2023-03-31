import { User } from '@domains';
import { faker } from '@faker-js/faker';
import { CategoryModel, UserModel } from '@models';
import { CategoryRepository, UserRepository } from '@repositories';
import { CategoryInterface, UserInterface } from '@types';
import { CreateCategoryUseCase, ListCategoryUseCase } from '@useCases';

describe('List category', () => {
  let createCategory: CreateCategoryUseCase;
  let listCategory: ListCategoryUseCase;
  let repository: CategoryRepository<CategoryInterface, CategoryModel>;
  let user: UserInterface;
  beforeAll(async () => {
    createCategory = new CreateCategoryUseCase();
    listCategory = new ListCategoryUseCase();
    repository = new CategoryRepository<CategoryInterface, CategoryModel>();

    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({name: 'Normal user', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    await repository.deleteAll();
  });

  test('Should list category', async () => {
    const partialCategory: Partial<CategoryInterface> = { label: faker.lorem.word() };
    const category1 = await createCategory.execute(user.id, partialCategory);
    const category2 = await createCategory.execute(user.id, {...partialCategory, label: faker.lorem.word()});
    const listedCategory = await listCategory.execute();
    expect(listedCategory).toHaveLength(2);
    expect(listedCategory[0].id).toEqual(category2.id);
    expect(listedCategory[1].id).toEqual(category1.id);
  });
});