import { Category } from '@domains';
import { mockCategories } from '@mocks/category';

describe('Category', () => {
  test('should create a valid category', () => {
    const [ category ] = mockCategories([{}]);
    expect(category).toBeInstanceOf(Category);
  });
});