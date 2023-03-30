import { ValidationError } from '@libs/errors/validationError';
import { PostInterface } from '@types';
import { Post, User } from '@domains';

describe('Post', () => {
  test('should create a valid post', () => {
    const user = new User({ name: 'teste user', active: true});
    const data: PostInterface = { 
      title: 'teste Post', 
      text: 'testes testes testes testes',
      user: user
    };
    const post = new Post(data);
    expect(post).toBeInstanceOf(Post);
    expect(post.user).toBeInstanceOf(User);
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

  test('shouldn\'t create post without text', () => {
    const user = new User({ name: 'teste user', active: true});
    const data: PostInterface = { 
      title: 'teste Post', 
      text: '',
      user: user
    };
    try {
      const post = new Post(data);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O texto da publicação é obrigatório');
    }
  });

});