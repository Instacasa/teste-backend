import { PostRepository, UserRepository } from '@repositories';
import { User } from '@domains';
import { PostModel, UserModel } from '@models';
import { PostInterface, UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';
import { mockPosts } from '@mocks';

describe('Post', () => {

  let userRepository: UserRepository<UserInterface, UserModel>;
  let repository: PostRepository<PostInterface, PostModel>;
  let user: UserInterface;
  beforeAll(async () => {
    userRepository = new UserRepository<UserInterface, UserModel>();
    repository = new PostRepository<PostInterface, PostModel>();

    user = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    await repository.deleteAll();
  });

  test('Should get post by id', async () => {
    let [ post ]: PostInterface[] = mockPosts([{title: 'Post', user}]);
    post = await repository.create(post);
    const { body } = await request()
      .get(`/posts/${post.id}`)
      .expect(httpStatus.OK);
    
    expect(body.id).toBeDefined();
    expect(body.title).toEqual('Post');
  });

  test('Shouldn\'t get inexistent post', async () => {
    const { body } = await request()
      .get('/posts/0')
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual('NotFoundError');
  });
});