import { NotFoundError } from '@libs/errors';
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

  test('Should update element on database', async () => {
    let [ category ]: CategoryInterface[] = mockCategories([{}]);
    category = await categoryRepository.create(category);
    category.label = 'Updated label';
    const updatedCategory = await categoryRepository.update(category);

    expect(updatedCategory.id).toBeDefined();
    expect(updatedCategory.id).toBeGreaterThan(0);
    expect(updatedCategory.label).toEqual('Updated label');
  });

  test('Should get category by id', async () => {
    let [ category ]: CategoryInterface[] = mockCategories([{}]);
    category = await categoryRepository.create(category);

    const persistedCategory = await categoryRepository.get(category.id);
    expect(persistedCategory.id).toEqual(category.id);
    expect(persistedCategory.label).toEqual(category.label);
  });

  test('Should get list of categories', async () => {
    let [category1, category2, category3]: CategoryInterface[]
      = mockCategories([{}, {}, {}]);
    
    category1 = await categoryRepository.create(category1);
    category2 = await categoryRepository.create(category2);
    category3 = await categoryRepository.create(category3);

    const persistedCategories = await categoryRepository.list();
    expect(persistedCategories).toHaveLength(3);
    expect(persistedCategories[0].label).toEqual(category3.label);
  });

  test('Should delete a category', async () => {
    let [category1, category2, category3]: CategoryInterface[]
      = mockCategories([{}, {}, {}]);

    category1 = await categoryRepository.create(category1);
    category2 = await categoryRepository.create(category2);
    category3 = await categoryRepository.create(category3);

    await categoryRepository.delete(category2.id);

    await expect(categoryRepository.get(category2.id))
      .rejects
      .toThrowError(new NotFoundError(`category with id ${category2.id} can't be found.`));
  });
});