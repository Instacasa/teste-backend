import { PostRepository, UserRepository } from '@repositories';
import { User } from '@domains';
import { PostModel, UserModel } from '@models';
import { PostInterface, UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';
import { mockPosts } from '@mocks';

describe('Post', () => {

  let repository: PostRepository<PostInterface, PostModel>;
  let userRepository: UserRepository<UserInterface, UserModel>;
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
  
  test('Should update post by id', async () => {
    let [post]: PostInterface[] = mockPosts([{user}]);
    post = await repository.create(post);
    const { body } = await request()
      .patch(`/posts/${post.id}/user/${user.id}`)
      .send({
        title: 'test'
      })
      .expect(httpStatus.OK);
    expect(body.title).toEqual('test');
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