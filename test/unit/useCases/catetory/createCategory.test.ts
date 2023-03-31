import { Category, User } from '@domains';
import { faker } from '@faker-js/faker';
import { ValidationError } from '@libs/errors';
import { CategoryModel, UserModel } from '@models';
import { CategoryRepository, UserRepository } from '@repositories';
import { CategoryInterface, UserInterface } from '@types';
import { CreateCategoryUseCase } from '@useCases';

describe('Create Category', () => {
  let user: UserInterface;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let createCategory: CreateCategoryUseCase;
  beforeAll(async () => {
    createCategory = new CreateCategoryUseCase();
    userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({ name: 'Admin', isAdmin: true });
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    const repository = new CategoryRepository<CategoryInterface, CategoryModel>();
    await repository.deleteAll();
  });

  test('Should create new category if user is admin', async () => {
    const partialCategory: Partial<CategoryInterface> = { label: faker.lorem.sentence() };
    const category = await createCategory.execute(user.id, partialCategory);
    expect(category).toBeInstanceOf(Category);
  });

  test('Shouldn\'t create new category if user isn\'t admin', async () => {
    const newUser = await userRepository.create(new User({name: 'User', isAdmin: false}));
    const partialCategory: Partial<CategoryInterface> = { label: faker.lorem.sentence() };
    
    await expect(() => 
      createCategory.execute(newUser.id, partialCategory)
    ).rejects.toThrowError(new ValidationError('Apenas administradores podem criar categorias'));
  });

  test('Shouldn\'t create category without label', async () => {
    const partialCategory: Partial<CategoryInterface> = { label: '' };
    await expect(() => 
      createCategory.execute(user.id, partialCategory)
    ).rejects.toThrowError(new ValidationError('O rótulo da categoria é obrigatório'));
  });
});