import { CreatePostUseCase, ListPostByUserUseCase, ListPostUseCase } from '@useCases';
import { CategoryRepository, PostRepository, UserRepository } from '@repositories';
import { User } from '@domains';
import { CategoryModel, PostModel, UserModel } from '@models';
import { CategoryInterface, PostInterface, UserInterface } from '@types';
import { mockCategories } from '@mocks/category';

describe('List Post', () => {

  let createPost: CreatePostUseCase;
  let listPost: ListPostUseCase;
  let listPostByUser: ListPostByUserUseCase;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let categoryRepository: CategoryRepository<CategoryInterface, CategoryModel>;
  let repository: PostRepository<PostInterface, PostModel>;
  let user: UserInterface;
  let category : CategoryInterface;
  beforeAll(async () => {
    createPost = new CreatePostUseCase();
    listPost = new ListPostUseCase();
    listPostByUser = new ListPostByUserUseCase();
    categoryRepository = new CategoryRepository<CategoryInterface, CategoryModel>();
    userRepository = new UserRepository<UserInterface, UserModel>();
    repository = new PostRepository<PostInterface, PostModel>();
    user = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);

    [ category ] = mockCategories([{}]);
    category = await categoryRepository.create(category);
  });
  

  beforeEach(async () => {
    await repository.deleteAll();
  });

  test('Should list post', async () => {
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

  test('Should list post by user', async () => {
    const partialPost: Partial<PostInterface> = {
      title: 'Teste',
      text: 'Text text text',
      categories: [{id: category.id, label: category.label}] 
    };
    const post1 = await createPost.execute(user.id, partialPost);

    let anotherUser: UserInterface = new User({name: 'Another User', isAdmin: false});
    anotherUser.active = true;
    anotherUser = await userRepository.create(anotherUser);
    const post2 = await createPost.execute(anotherUser.id, {...partialPost, title: 'Teste 2'});

    const listedPostUser1 = await listPostByUser.execute(user.id);
    expect(listedPostUser1).toHaveLength(1);
    expect(listedPostUser1[0].id).toEqual(post1.id);

    const listedPostUser2 = await listPostByUser.execute(anotherUser.id);
    expect(listedPostUser2).toHaveLength(1);
    expect(listedPostUser2[0].id).toEqual(post2.id);
  });
});