import { Category } from '@domains';
import { ValidationError } from '@libs/errors';
import { mockCategories } from '@mocks/category';

describe('Category', () => {
  test('should create a valid category', () => {
    const [ category ] = mockCategories([{}]);
    expect(category).toBeInstanceOf(Category);
  });

  test('shouldn\'t create category without label', () => {
    expect(() => mockCategories([{label: ''}]))
      .toThrowError(new ValidationError('O rótulo da categoria é obrigatório'));
  });
});