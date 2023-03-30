import { ValidationError } from '@errors';
import {  User, Comment } from '@domains';
import { mockComments, mockPosts, mockUsers } from '@mocks';

describe('Comment', () => {
  test('should create a valid Comment', () => {
    const [ user, author ] = mockUsers([{ active: true }, { active: true }]);
    const [ post ] = mockPosts([{ user: author }]);
    const [ comment ] = mockComments([{ user, post }]);
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.user).toBeInstanceOf(User);
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
});