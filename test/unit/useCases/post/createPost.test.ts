import { CreatePostUseCase } from '@useCases';
import { CategoryRepository, PostRepository, UserRepository } from '@repositories';
import { Post, User } from '@domains';
import { NotFoundError, ValidationError } from '@errors';
import { CategoryModel, PostModel, UserModel } from '@models';
import { CategoryInterface, PostInterface, UserInterface } from '@types';
import { mockCategories } from '@mocks/category';

describe('Create Post', () => {

  let user: UserInterface;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let categoryRepository: CategoryRepository<CategoryInterface, CategoryModel>;
  let category : CategoryInterface;
  beforeAll(async () => {
    userRepository = new UserRepository<UserInterface, UserModel>();
    categoryRepository = new CategoryRepository<CategoryInterface, CategoryModel>();

    user = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);

    [ category ] = mockCategories([{}]);
    category = await categoryRepository.create(category);
  });

  beforeEach(async () => {
    const repository = new PostRepository<PostInterface, PostModel>();
    await repository.deleteAll();
  });

  test('Should create new post if user is active', async () => {
    const createPost = new CreatePostUseCase();
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Text text text',
      categories: [{id: category.id, label: category.label}]
    };
    const post = await createPost.execute(user.id, partialPost);
    expect(post).toBeInstanceOf(Post);
  });

  test('Shouldn\'t create new post if user isn\'t active', async () => {
    const newUser = await userRepository.create(new User({name: 'User', isAdmin: false, active: false}));
    const createPost = new CreatePostUseCase();
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Text text text',
      categories: [{id: category.id, label: category.label}] 
    };
    await expect(() => 
      createPost.execute(newUser.id, partialPost)
    ).rejects.toThrowError(new ValidationError('Apenas usuários ativos podem publicar'));
  });

  test('Shouldn\'t create post without title', async () => {
    const createPost = new CreatePostUseCase();
    const partialPost: Partial<PostInterface> = {
      title: '',
      text: 'Text text text',
      categories: [{id: category.id, label: category.label}] 
    };
    await expect(() => 
      createPost.execute(user.id, partialPost)
    ).rejects.toThrowError(new ValidationError('O título da publicação é obrigatório'));
  });

  test('Shouldn\'t create post without text', async () => {
    const createPost = new CreatePostUseCase();
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: '',
      categories: [{id: category.id, label: category.label}] 
    };
    await expect(() => 
      createPost.execute(user.id, partialPost)
    ).rejects.toThrowError(new ValidationError('O texto da publicação é obrigatório'));
  });

  test('Shouldn\'t create post without category', async () => {
    const createPost = new CreatePostUseCase();
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Teste teste'
    };
    await expect(() => 
      createPost.execute(user.id, partialPost)
    ).rejects.toThrowError(new ValidationError('Publicações precisam possuir pelo menos uma categoria'));
  });

  test('Shouldn\'t create post inexistent user', async () => {
    const createPost = new CreatePostUseCase();
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Text text text',
      categories: [{id: category.id, label: category.label}] 
    };
    await expect(() => 
      createPost.execute(0, partialPost)
    ).rejects.toThrowError(new NotFoundError('user with id 0 can\'t be found.'));
  });
  
});