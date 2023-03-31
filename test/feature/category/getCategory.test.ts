import { mockCategories } from '@mocks/category';
import { CategoryModel } from '@models';
import { CategoryRepository } from '@repositories';
import { CategoryInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';

describe('Category', () => {
  let repository: CategoryRepository<CategoryInterface, CategoryModel>;
  beforeAll(async() => {
    repository = new CategoryRepository<CategoryInterface, CategoryModel>();
  });

  beforeEach(async () => {
    await repository.deleteAll();
  });

  test('Should get category by id', async () => {
    let [ category ]: CategoryInterface[] = mockCategories([{label: 'Label'}]);
    category = await repository.create(category);
    const { body } = await request()
      .get(`/categories/${category.id}`)
      .expect(httpStatus.OK);
    
    expect(body.id).toBeDefined();
    expect(body.label).toEqual('Label');
  });

  test('Shouldn\'t get inexistent category', async () => {
    const { body } = await request()
      .get('/categories/0')
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual('NotFoundError');
  });
});