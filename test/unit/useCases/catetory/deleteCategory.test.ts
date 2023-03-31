import { User } from '@domains';
import { faker } from '@faker-js/faker';
import { NotFoundError, ValidationError } from '@errors';
import { CategoryModel, UserModel } from '@models';
import { CategoryRepository, UserRepository } from '@repositories';
import { CategoryInterface, UserInterface } from '@types';
import { CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoryUseCase } from '@useCases';

describe('Delete Category', () => {
  let createCategory: CreateCategoryUseCase;
  let deleteCategory: DeleteCategoryUseCase;
  let getCategory: GetCategoryUseCase;
  let user: UserInterface;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let categoryRepository: CategoryRepository<CategoryInterface, CategoryModel>;
  beforeAll(async () => {
    createCategory = new CreateCategoryUseCase();
    deleteCategory = new DeleteCategoryUseCase();
    getCategory = new GetCategoryUseCase();
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
    const partialCategory: Partial<CategoryInterface> = { label: faker.lorem.word() };
    const category = await createCategory.execute(user.id, partialCategory);
    await deleteCategory.execute(user.id, category.id);
    await expect(() => 
      getCategory.execute(category.id)
    ).rejects.toThrowError(new NotFoundError(`category with id ${category.id} can't be found.`));
  });

  test('Shouldn\'t delete category if user isn\'t admin', async () => {
    const simpleUser = await userRepository.create(new User({name: 'Simple user', isAdmin: false}));
    const partialCategory: Partial<CategoryInterface> = { label: faker.lorem.word() };
    const category = await createCategory.execute(user.id, partialCategory);
    await expect(() => 
      deleteCategory.execute(simpleUser.id, category.id)
    ).rejects.toThrowError(new ValidationError('Apenas administradores podem excluir categorias'));
  });
});