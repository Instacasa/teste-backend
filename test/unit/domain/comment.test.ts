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

  test('should create comment without post', () => {
    const [ user ] = mockUsers([{ active: true }]);
    const [ comment ] = mockComments([{ user }]);
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.user).toBeInstanceOf(User);
    expect(comment.post).toBeUndefined();
  });

  test('shouldn\'t create comment without text', () => {
    const [ user, author ] = mockUsers([{ active: true }, { active: true }]);
    const [ post ] = mockPosts([{ user: author }]);
    try {
      mockComments([{ text: '', post, user }]);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O texto do comentário é obrigatório');
    }
  });

  test('shouldn\'t create comment without user', () => {
    const [ author ] = mockUsers([{ active: true }]);
    const [ post ] = mockPosts([{ user: author }]);
    try {
      mockComments([{ post }]);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O autor do comentário é obrigatório');
    }
  });
  
});