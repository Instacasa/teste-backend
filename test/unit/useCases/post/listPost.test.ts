import { CreatePostUseCase, ListPostUseCase } from '@useCases';
import { CategoryRepository, PostRepository, UserRepository } from '@repositories';
import { User } from '@domains';
import { CategoryModel, PostModel, UserModel } from '@models';
import { CategoryInterface, PostInterface, UserInterface } from '@types';
import { mockCategories } from '@mocks/category';

describe('List Post', () => {

  let categoryRepository: CategoryRepository<CategoryInterface, CategoryModel>;
  let user: UserInterface;
  let category : CategoryInterface;
  beforeAll(async () => {
    categoryRepository = new CategoryRepository<CategoryInterface, CategoryModel>();
    const userRepository = new UserRepository<UserInterface, UserModel>();
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

  test('Should list post', async () => {
    const createPost = new CreatePostUseCase();
    const listPost = new ListPostUseCase();
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Text text text',
      user,
      categories: [{id: category.id, label: category.label}] 
    };
    const post1 = await createPost.execute(user.id, partialPost);
    const post2 = await createPost.execute(user.id, {...partialPost, title: 'Teste 2'});
    const listedPost = await listPost.execute();
    expect(listedPost).toHaveLength(2);
    expect(listedPost[0].id).toEqual(post2.id);
    expect(listedPost[1].id).toEqual(post1.id);
  });
});