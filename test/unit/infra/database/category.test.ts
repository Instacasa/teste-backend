import { CategoryModel } from '@models';
import { CategoryRepository } from '@repositories';
import { CategoryInterface } from '@types';

describe('Category Repository', () => {
  let categoryRepository: CategoryRepository<CategoryInterface, CategoryModel>;
  beforeEach(async () => {
    categoryRepository = new CategoryRepository<CategoryInterface, CategoryModel>();
    await categoryRepository.deleteAll();
  });
});