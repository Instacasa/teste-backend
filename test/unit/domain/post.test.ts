import { ValidationError } from '@errors';
import { Post, User } from '@domains';
import { mockPosts, mockUsers } from '@mocks';

describe('Post', () => {
  test('should create a valid post', () => {
    const [ user ] = mockUsers([{ active: true }]);
    const [ post ] = mockPosts([{ user }]);
    expect(post).toBeInstanceOf(Post);
    expect(post.user).toBeInstanceOf(User);
  });

  test('shouldn\'t create post without title', () => {
    const [ user ] = mockUsers([{ active: true }]);
    try {
      mockPosts([{ title: '', user }]);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O título da publicação é obrigatório');
    }
  });

  test('shouldn\'t create post without text', () => {
    const [ user ] = mockUsers([{ active: true }]);
    try {
      mockPosts([{ text: '', user }]);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O texto da publicação é obrigatório');
    }
  });

});