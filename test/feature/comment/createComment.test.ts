import { CommentRepository, PostRepository, UserRepository } from '@repositories';
import { User } from '@domains';
import { CommentModel, PostModel, UserModel } from '@models';
import { CommentInterface, PostInterface, UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';
import { mockPosts } from '@mocks';

describe('Comment', () => {
  let postRepository: PostRepository<PostInterface, PostModel>;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let repository: CommentRepository<CommentInterface, CommentModel>;
  let postOwner: UserInterface;
  let user: UserInterface;
  beforeAll(async () => {
    postRepository = new PostRepository<PostInterface, PostModel>();
    userRepository = new UserRepository<UserInterface, UserModel>();
    repository = new CommentRepository<CommentInterface, CommentModel>();

    postOwner = new User({name: 'Post Owner', isAdmin: false});
    postOwner.active = true;
    postOwner = await userRepository.create(postOwner);

    user = new User({name: 'Admin', isAdmin: false});
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    await repository.deleteAll();
  });

  test('Should create new comment', async () => {
    let [post]: PostInterface[] = mockPosts([{user: postOwner}]);
    post = await postRepository.create(post);

    const response = await request()
      .post(`/posts/${post.id}/comments/user/${user.id}`)
      .send({
        text: 'comment'
      })
      .expect(httpStatus.CREATED);
    
    expect(response.body.id).toBeDefined();
    expect(response.body.text).toEqual('comment');
  });

  test('Shouldn\'t allow to create new comment if user is inactive', async () => {
    let inactiveUser: UserInterface = new User({name: 'Inactive user', isAdmin: false});
    inactiveUser = await userRepository.create(inactiveUser);

    let [post]: PostInterface[] = mockPosts([{user: postOwner}]);
    post = await postRepository.create(post);

    const { body } = await request()
      .post(`/posts/${post.id}/comments/user/${inactiveUser.id}`)
      .send({
        text: 'text text text'
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t create new comment without text', async () => {
    let [post]: PostInterface[] = mockPosts([{user: postOwner}]);
    post = await postRepository.create(post);
    const { body } = await request()
      .post(`/posts/${post.id}/comments/user/${user.id}`)
      .send({
        text: '',
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });
});