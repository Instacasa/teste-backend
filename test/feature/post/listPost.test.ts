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

  test('Should get post list', async () => {
    const [ post1, post2, post3 ]: PostInterface[] = mockPosts([{user}, {user}, {user}]);
    await repository.create(post1);
    await repository.create(post2);
    await repository.create(post3);
    const { body } = await request()
      .get('/posts/')
      .expect(httpStatus.OK);
    
    expect(body).toHaveLength(3);
  });

  test('Shouldn\'t get inexistent post', async () => {
    const { body } = await request()
      .get('/posts/')
      .expect(httpStatus.OK);
    expect(body).toHaveLength(0);
  });

  test('Should get post list by user', async () => {
    let anotherUser: UserInterface = new User({name: 'Another User', isAdmin: false});
    anotherUser.active = true;
    anotherUser = await userRepository.create(anotherUser);
    const [ post1, post2, post3 ]: PostInterface[] = mockPosts([{user}, {user: anotherUser}, {user: anotherUser}]);
    await repository.create(post1);
    await repository.create(post2);
    await repository.create(post3);

    const { body } = await request()
      .get(`/posts/user/${anotherUser.id}`)
      .expect(httpStatus.OK);
    
    expect(body).toHaveLength(2);
  });
});