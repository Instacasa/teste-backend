import { User } from '@domains';
import { ValidationError } from '@errors';
import { faker } from '@faker-js/faker';
import { CategoryModel, UserModel } from '@models';
import { CategoryRepository, UserRepository } from '@repositories';
import { CategoryInterface, UserInterface } from '@types';
import { CreateCategoryUseCase, UpdateCategoryUseCase } from '@useCases';

describe('Update category', () => {
  let user: UserInterface;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let createCategory: CreateCategoryUseCase;
  let updateCategory: UpdateCategoryUseCase;
  beforeAll(async () => {
    createCategory = new CreateCategoryUseCase();
    updateCategory = new UpdateCategoryUseCase();
    userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({ name: 'Admin', isAdmin: true });
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    const repository = new CategoryRepository<CategoryInterface, CategoryModel>();
    await repository.deleteAll();
  });

  test('Should update category label', async () => {
    const partialCategory: Partial<CategoryInterface> = { label: faker.lorem.word() };
    const category = await createCategory.execute(user.id, partialCategory);
    await expect(() => 
      updateCategory.execute(user.id, category.id, {...category, label: ''})
    ).rejects.toThrowError(new ValidationError('O rótulo da categoria é obrigatório'));
  });
});