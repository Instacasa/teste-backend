import { CategoryRepository, CommentRepository, PostRepository, UserRepository } from '@repositories';
import { ValidationError } from '@errors';
import { CategoryModel, CommentModel, PostModel, UserModel } from '@models';
import { CategoryInterface, CommentInterface, PostInterface, UserInterface } from '@types';
import { User, Comment } from '@domains';
import { CreatePostUseCase, UpdatePostUseCase } from '@useCases';
import { mockCategories } from '@mocks/category';
import { mockUsers } from '@mocks';

describe('Update Post', () => {
  
  let createPost: CreatePostUseCase;
  let updatePost: UpdatePostUseCase;
  let categoryRepository: CategoryRepository<CategoryInterface, CategoryModel>;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let user: UserInterface;
  let category : CategoryInterface;
  beforeAll(async () => {
    createPost = new CreatePostUseCase();
    updatePost = new UpdatePostUseCase();
    categoryRepository = new CategoryRepository<CategoryInterface, CategoryModel>();
    userRepository = new UserRepository<UserInterface, UserModel>();
    
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

  test('Should update post title', async () => {
    const partialPost: Partial<PostInterface> = { 
      title: 'Teste',
      text: 'Text text text',
      user,
      categories: [{id: category.id, label: category.label}] 
    };
    const post = await createPost.execute(user.id, partialPost);
    post.title = 'Test Update';
    const updatedPost = await updatePost.execute(user.id, post.id, post);
    expect(updatedPost.title).toEqual('Test Update');
  });

  test('Should update post categories by admin', async () => {
    const partialPost: Partial<PostInterface> = { 
      title: 'Teste',
      text: 'Text text text',
      user,
      categories: [{id: category.id, label: category.label}] 
    };
    const post = await createPost.execute(user.id, partialPost);
    let [ category2 ] : CategoryInterface[] = mockCategories([{label: 'Another category'}]);
    category2 = await categoryRepository.create(category2);

    const updatedPost = await updatePost.execute(user.id, post.id, {
      categories: [{id: category2.id, label: category2.label}]
    });
    expect(updatedPost.categories[0].id).toEqual(category2.id);
    expect(updatedPost.categories[0].label).toEqual('Another category');
  });

  test('Should update post categories by owner', async () => {
    let [simpleUser] : UserInterface[] = mockUsers([{isAdmin: false}]);
    simpleUser.active = true;
    simpleUser = await userRepository.create(simpleUser);

    const partialPost: Partial<PostInterface> = { 
      title: 'Teste',
      text: 'Text text text',
      categories: [{id: category.id, label: category.label}] 
    };
    const post = await createPost.execute(simpleUser.id, partialPost);
    let [ category2 ] : CategoryInterface[] = mockCategories([{label: 'Another category'}]);
    category2 = await categoryRepository.create(category2);

    const updatedPost = await updatePost.execute(simpleUser.id, post.id, {
      categories: [{id: category2.id, label: category2.label}]
    });
    expect(updatedPost.categories[0].id).toEqual(category2.id);
    expect(updatedPost.categories[0].label).toEqual('Another category');
  });

  test('Shouldn\'t update post title to empty/null', async () => {
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Text text text',
      user,
      categories: [{id: category.id, label: category.label}]
    };
    const post = await createPost.execute(user.id, partialPost);
    await expect(() => 
      updatePost.execute(user.id, post.id, {...post, title: ''})
    ).rejects.toThrowError(new ValidationError('O título da publicação é obrigatório'));
  });

  test('Shouldn\'t update post if user isn\'t the owner', async () => {
    const newUser = await userRepository.create(new User({name: 'new User', isAdmin: false}));
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Text text text',
      user,
      categories: [{id: category.id, label: category.label}]
    };
    const post = await createPost.execute(user.id, partialPost);
    await expect(() => 
      updatePost.execute(newUser.id, post.id, {...post, title: ''})
    ).rejects.toThrowError(new ValidationError('Apenas o autor pode editar a publicação'));
  });

  test('Shouldn\'t allow update if post has comments', async () => {
    const newUser = await userRepository.create(new User({name: 'new User', isAdmin: false}));
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Text text text',
      user,
      categories: [{id: category.id, label: category.label}]
    };
    const post = await createPost.execute(user.id, partialPost);
    const commentRepository = new CommentRepository<CommentInterface, CommentModel>();
    await commentRepository.create(new Comment({text: 'new comment', user: newUser, post}));
    await expect(() => 
      updatePost.execute(user.id, post.id, {...post, title: 'Teste 2'})
    ).rejects.toThrowError(new ValidationError('Publicações já comentadas não podem ser editadas'));
  });
});