import Post from '@/domains/post';
import User from '@/domains/user';
import Comment from '@/domains/comment';
import { ValidationError } from '@libs/errors/validationError';
import { CommentInterface, PostInterface } from '@types';

describe('Comment', () => {
  test('should create a valid Comment', () => {
    const user = new User({ name: 'test user', active: true});
    const author = new User({ name: 'test author', active: true});
    const post = new Post({ 
      title: 'teste Post', 
      text: 'testes testes testes testes',
      user: author
    });
    const data: CommentInterface = {
      text: 'text text text text',
      user,
      post,
    };
    const comment = new Comment(data);
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.user).toBeInstanceOf(User);
  });

  test('shouldn\'t create post without title', () => {
    const user = new User({ name: 'teste user', active: true});
    const data: PostInterface = { 
      title: '', 
      text: 'testes testes testes testes',
      user: user
    };
    try {
      const post = new Post(data);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O título da publicação é obrigatório');
    }
  });
});