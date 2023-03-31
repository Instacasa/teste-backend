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

  test('Should get category list', async () => {
    const [ category1, category2, category3 ]: CategoryInterface[] = mockCategories([{}, {}, {}]);
    await repository.create(category1);
    await repository.create(category2);
    await repository.create(category3);
    const { body } = await request()
      .get('/categories/')
      .expect(httpStatus.OK);
    expect(body).toHaveLength(3);
  });

  test('Shouldn\'t get inexistent category', async () => {
    const { body } = await request()
      .get('/categories/')
      .expect(httpStatus.OK);
    expect(body).toHaveLength(0);
  });
});