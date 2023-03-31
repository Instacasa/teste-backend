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
  let admin: UserInterface;
  let user: UserInterface;
  beforeAll(async () => {
    userRepository = new UserRepository<UserInterface, UserModel>();
    repository = new PostRepository<PostInterface, PostModel>();

    let admin: UserInterface = new User({name: 'Admin', isAdmin: true});
    admin.active = true;
    admin = await userRepository.create(admin);

    let user: UserInterface = new User({name: 'Simple user', isAdmin: false});
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    await repository.deleteAll();
  });
  
  test('Should delete post by admins', async () => {    
    let [post]: PostInterface[] = mockPosts([{user}]);
    post = await repository.create(post);
    await request()
      .delete(`/posts/${post.id}/user/${admin.id}`)
      .expect(httpStatus.ACCEPTED);
  });
  
  test('Should delete post by owner', async () => {
    let [post]: PostInterface[] = mockPosts([{user}]);
    post = await repository.create(post);
    await request()
      .delete(`/posts/${post.id}/user/${user.id}`)
      .expect(httpStatus.ACCEPTED);
  });

  test('Shouldn\'t delete inexistent post', async () => {
    const { body } = await request()
      .delete(`/posts/0/user/${user.id}`)
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual('NotFoundError');
  });

  test('Shouldn\'t allow to delete post without been an admin or owner', async () => {
    let [post]: PostInterface[] = mockPosts([{user: admin}]);
    post = await repository.create(post);
    const { body } = await request()
      .delete(`/posts/${post.id}/user/${user.id}`)
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });
});