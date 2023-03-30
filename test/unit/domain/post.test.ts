import { ValidationError } from '@errors';
import { Post, User } from '@domains';
import { mockPosts, mockUsers } from '@mocks';
import { faker } from '@faker-js/faker';

describe('Post', () => {
  test('should create a valid post', () => {
    const [ user ] = mockUsers([{ id: +faker.random.numeric(6), active: true }]);
    const [ post ] = mockPosts([{ user }]);
    expect(post).toBeInstanceOf(Post);
    expect(post.user).toBeInstanceOf(User);
  });

  test('should\'t create post by inactive users', () => {
    const [ user ] = mockUsers([{ id: 123456, active: false }]);
    expect(() => mockPosts([{ user }]))
      .toThrow(new ValidationError('O autor está inativo'));
  });

  test('shouldn\'t create post without title', () => {
    const [ user ] = mockUsers([{ id: +faker.random.numeric(6), active: true }]);
    try {
      mockPosts([{ title: '', user }]);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O título da publicação é obrigatório');
    }
  });

  test('shouldn\'t create post without text', () => {
    const [ user ] = mockUsers([{ id: +faker.random.numeric(6), active: true }]);
    try {
      mockPosts([{ text: '', user }]);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O texto da publicação é obrigatório');
    }
  });

  test('shouldn\'t create post without author', () => {
    try {
      mockPosts([{}]);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O autor da publicação é obrigatório');
    }
  });

});