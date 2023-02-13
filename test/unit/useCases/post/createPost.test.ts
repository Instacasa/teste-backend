import CreatePost from '@/useCases/post/createPost';
import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import Post from '@domains/post';
import User from '@domains/user';
import { ValidationError } from '@libs/errors/validationError';
import UserModel from '@models/userModel';
import { PostInterface, UserInterface } from '@types';

describe('Create Post', () => {
  let user: UserInterface;
  beforeAll(async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({ name: 'Admin', isAdmin: true });
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    const repository = new PostRepository();
    await repository.deleteAll();
  });

  test('Should create new post if user is active', async () => {
    const createPost = new CreatePost();
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Text text text',
    };
    const post = await createPost.execute(user.id, partialPost);
    expect(post).toBeInstanceOf(Post);
  });

  test("Shouldn't create new post if user isn't active", async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    const newUser = await userRepository.create(
      new User({ name: 'User', isAdmin: false, active: false }),
    );
    const createPost = new CreatePost();
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Text text text',
    };
    try {
      const post = await createPost.execute(newUser.id, partialPost);
    } catch (error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('Apenas usuários ativos podem publicar');
    }
  });

  test("Shouldn't create post without title", async () => {
    const createPost = new CreatePost();
    const partialPost: Partial<PostInterface> = {
      title: '',
      text: 'Text text text',
    };
    try {
      const post = await createPost.execute(user.id, partialPost);
    } catch (error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O título da publicação é obrigatório');
    }
  });

  test("Shouldn't create post without text", async () => {
    const createPost = new CreatePost();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: '' };
    try {
      const post = await createPost.execute(user.id, partialPost);
    } catch (error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O texto da publicação é obrigatório');
    }
  });

  test("Shouldn't create post without user", async () => {
    const createPost = new CreatePost();
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Text text text',
    };
    try {
      const post = await createPost.execute(user.id, partialPost);
    } catch (error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O autor da publicação é obrigatório');
    }
  });
});
