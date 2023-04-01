import { CategoryRepository, PostRepository, UserRepository } from '@repositories';
import { User } from '@domains';
import { CategoryModel, PostModel, UserModel } from '@models';
import { CategoryInterface, PostInterface, UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';
import { mockPosts } from '@mocks';
import { mockCategories } from '@mocks/category';

describe('Post', () => {

  let repository: PostRepository<PostInterface, PostModel>;
  let categoryRepository: CategoryRepository<CategoryInterface, CategoryModel>;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let user: UserInterface;
  beforeAll(async () => {
    categoryRepository = new CategoryRepository<CategoryInterface, CategoryModel>();
    userRepository = new UserRepository<UserInterface, UserModel>();
    repository = new PostRepository<PostInterface, PostModel>();

    user = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    await repository.deleteAll();
  });
  
  test('Should categorize post by id', async () => {
    let [ category2 ] : CategoryInterface[] = mockCategories([{label: 'Another category'}]);
    category2 = await categoryRepository.create(category2);

    let [post]: PostInterface[] = mockPosts([{user}]);
    post = await repository.create(post);
    const { body } = await request()
      .patch(`/posts/${post.id}/user/${user.id}/categorize/${category2.id}`)
      .send({})
      .expect(httpStatus.OK);
    expect(body.categories).toHaveLength(1);
  });
});