import { Category } from '@domains';
import { faker } from '@faker-js/faker';
import { CategoryInterface } from '@types';

export const mockCategories = (categories: Array<Partial<CategoryInterface>>): Array<Category> => 
  categories.map((categoryData) => {
    return new Category({
      ...categoryData,
      label: categoryData.label ?? faker.lorem.sentence(2)
    });
  });