import { CategoryRepository, PostRepository, UserRepository } from '@repositories';
import { CategoryModel, PostModel, UserModel } from '@models';
import { CategoryInterface, PostInterface, UserInterface } from '@types';
import { User } from '@domains';
import { CategorizePostUseCase, CreatePostUseCase, UpdatePostUseCase } from '@useCases';
import { mockCategories } from '@mocks/category';

describe('Categorize Post', () => {
  
  let createPost: CreatePostUseCase;
  let updatePost: UpdatePostUseCase;
  let categorizePost: CategorizePostUseCase;
  let categoryRepository: CategoryRepository<CategoryInterface, CategoryModel>;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let user: UserInterface;
  let category : CategoryInterface;
  beforeAll(async () => {
    createPost = new CreatePostUseCase();
    updatePost = new UpdatePostUseCase();
    categorizePost = new CategorizePostUseCase();
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

  test('Should add a category to a post', async () => {
    const partialPost: Partial<PostInterface> = { 
      title: 'Teste',
      text: 'Text text text',
      user,
      categories: [{id: category.id, label: category.label}] 
    };
    const post = await createPost.execute(user.id, partialPost);

    let [ category2 ] : CategoryInterface[] = mockCategories([{label: 'Another category'}]);
    category2 = await categoryRepository.create(category2);

    const updatedPost = await categorizePost.execute(user.id, post.id, category2.id);
    expect(updatedPost.categories).toHaveLength(2);
  });
});