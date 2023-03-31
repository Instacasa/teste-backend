import { CreatePostUseCase, DeletePostUseCase, GetPostUseCase } from '@useCases';
import { CategoryRepository, PostRepository, UserRepository } from '@repositories';
import { User } from '@domains';
import { NotFoundError, ValidationError } from '@errors';
import { CategoryModel, PostModel, UserModel } from '@models';
import { CategoryInterface, PostInterface, UserInterface } from '@types';
import { mockCategories } from '@mocks/category';

describe('Delete Post', () => {
  let createPost: CreatePostUseCase;
  let deletePost: DeletePostUseCase;
  let getPost: GetPostUseCase;
  let categoryRepository: CategoryRepository<CategoryInterface, CategoryModel>;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let postRepository: PostRepository<PostInterface, PostModel>;
  let user: UserInterface;
  let category : CategoryInterface;
  beforeAll(async () => {
    createPost = new CreatePostUseCase();
    deletePost = new DeletePostUseCase();
    getPost = new GetPostUseCase();
    categoryRepository = new CategoryRepository<CategoryInterface, CategoryModel>();
    userRepository = new UserRepository<UserInterface, UserModel>();
    postRepository = new PostRepository<PostInterface, PostModel>();
    user = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);

    [ category ] = mockCategories([{}]);
    category = await categoryRepository.create(category);
  });
  
  beforeEach(async () => {
    await postRepository.deleteAll();
  });
  
  test('Should delete post if user is the owner', async () => {
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Text text text',
      user,
      categories: [{id: category.id, label: category.label}]
    };
    const post = await createPost.execute(user.id, partialPost);
    await deletePost.execute(user.id, post.id);
    await expect(() => 
      getPost.execute(post.id)
    ).rejects.toThrowError(new NotFoundError(`post with id ${post.id} can't be found.`));
  });

  test('Should delete post if user is the admin', async () => {
    const admin = await userRepository.create(new User({name: 'Admin', isAdmin: true}));
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Text text text',
      user,
      categories: [{id: category.id, label: category.label}]
    };
    const post = await createPost.execute(user.id, partialPost);
    await deletePost.execute(admin.id, post.id);
    await expect(() => 
      getPost.execute(post.id)
    ).rejects.toThrowError(new NotFoundError(`post with id ${post.id} can't be found.`));
  });

  test('Shouldn\'t delete inexistent post', async () => {
    const deletePost = new DeletePostUseCase();
    await expect(() => 
      deletePost.execute(user.id, 0)
    ).rejects.toThrowError(new NotFoundError('post with id 0 can\'t be found.'));
  });

  test('Shouldn\'t delete post if user is not admin', async () => {
    const simpleUser = await userRepository.create(new User({name: 'Simple user', isAdmin: false}));
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Text text text',
      user,
      categories: [{id: category.id, label: category.label}]
    };
    const post = await createPost.execute(user.id, partialPost);
    await expect(() => 
      deletePost.execute(simpleUser.id, post.id)
    ).rejects.toThrowError(new ValidationError('Apenas o autor ou administradores podem excluir publicações'));
  });
});