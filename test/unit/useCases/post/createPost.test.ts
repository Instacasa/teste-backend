import { CreatePostUseCase } from '@useCases';
import { PostRepository, UserRepository } from '@repositories';
import { Post, User } from '@domains';
import { NotFoundError, ValidationError } from '@errors';
import { PostModel, UserModel } from '@models';
import { PostInterface, UserInterface } from '@types';

describe('Create Post', () => {

  let user: UserInterface;
  let userRepository: UserRepository<UserInterface, UserModel>;
  beforeAll(async () => {
    userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    const repository = new PostRepository<PostInterface, PostModel>();
    await repository.deleteAll();
  });

  test('Should create new post if user is active', async () => {
    const createPost = new CreatePostUseCase();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text' };
    const post = await createPost.execute(user.id, partialPost);
    expect(post).toBeInstanceOf(Post);
  });

  test('Shouldn\'t create new post if user isn\'t active', async () => {
    const newUser = await userRepository.create(new User({name: 'User', isAdmin: false, active: false}));
    const createPost = new CreatePostUseCase();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text' };
    await expect(() => 
      createPost.execute(newUser.id, partialPost)
    ).rejects.toThrowError(new ValidationError('Apenas usuários ativos podem publicar'));
  });

  test('Shouldn\'t create post without title', async () => {
    const createPost = new CreatePostUseCase();
    const partialPost: Partial<PostInterface> = { title: '', text: 'Text text text' };
    await expect(() => 
      createPost.execute(user.id, partialPost)
    ).rejects.toThrowError(new ValidationError('O título da publicação é obrigatório'));
  });

  test('Shouldn\'t create post without text', async () => {
    const createPost = new CreatePostUseCase();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: '' };
    await expect(() => 
      createPost.execute(user.id, partialPost)
    ).rejects.toThrowError(new ValidationError('O texto da publicação é obrigatório'));
  });

  test('Shouldn\'t create post inexistent user', async () => {
    const createPost = new CreatePostUseCase();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text' };
    await expect(() => 
      createPost.execute(0, partialPost)
    ).rejects.toThrowError(new NotFoundError('user with id 0 can\'t be found.'));
  });
  
});