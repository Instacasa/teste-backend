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
  
  test('Should update post by id', async () => {
    let [ category2 ] : CategoryInterface[] = mockCategories([{label: 'Another category'}]);
    category2 = await categoryRepository.create(category2);

    let [post]: PostInterface[] = mockPosts([{user}]);
    post = await repository.create(post);
    const { body } = await request()
      .patch(`/posts/${post.id}/user/${user.id}`)
      .send({
        title: 'test',
        categories: [{id: category2.id, label: category2.label}]
      })
      .expect(httpStatus.OK);
    expect(body.title).toEqual('test');
    expect(body.categories).toHaveLength(1);
  });

  test('Shouldn\'t update inexistent post', async () => {
    const { body } = await request()
      .patch(`/posts/0/user/${user.id}`)
      .send({
        title: 'New title'
      })
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual('NotFoundError');
  });

  test('Shouldn\'t allow to update post without been the owner', async () => {
    let user2: UserInterface = new User({name: 'Admin', isAdmin: true});
    user2.active = true;
    user2 = await userRepository.create(user2);
    let [post]: PostInterface[] = mockPosts([{user}]);
    post = await repository.create(post);
    const { body } = await request()
      .patch(`/posts/${post.id}/user/${user2.id}`)
      .send({
        text: 'New text'
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t allow to update post text to null/empty', async () => {
    let [post]: PostInterface[] = mockPosts([{user}]);
    post = await repository.create(post);
    const { body } = await request()
      .patch(`/posts/${post.id}/user/${user.id}`)
      .send({
        text: ''
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });
});