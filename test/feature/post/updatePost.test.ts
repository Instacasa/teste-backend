import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import { Post, User } from '@domains';
import PostModel from '@models/postModel';
import UserModel from '@models/userModel';
import { PostInterface, UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';

describe('Post', () => {

  beforeEach(async () => {
    const repository = new PostRepository<PostInterface, PostModel>();
    await repository.deleteAll();
  });
  
  test('Should update post by id', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let user: UserInterface = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
    const postRepository = new PostRepository<PostInterface, PostModel>();
    let post: PostInterface = new Post({title: 'Post', text: 'Text text text', user});
    post = await postRepository.create(post);
    const { body } = await request()
      .patch(`/posts/${post.id}/user/${user.id}`)
      .send({
        title: 'test'
      })
      .expect(httpStatus.OK);
    expect(body.title).toEqual('test');
  });

  test('Shouldn\'t update inexistent post', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let user: UserInterface = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
    const { body } = await request()
      .patch(`/posts/0/user/${user.id}`)
      .send({
        title: ''
      })
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual('NotFoundError');
  });

  test('Shouldn\'t allow to update post without been the owner', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let user: UserInterface = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
    let user2: UserInterface = new User({name: 'Admin', isAdmin: true});
    user2.active = true;
    user2 = await userRepository.create(user2);
    const postRepository = new PostRepository<PostInterface, PostModel>();
    let post: PostInterface = new Post({title: 'Post', text: 'Text text text', user});
    post = await postRepository.create(post);
    const { body } = await request()
      .patch(`/posts/${post.id}/user/${user2.id}`)
      .send({
        label: ''
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t allow to update post text to null', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let user: UserInterface = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
    const postRepository = new PostRepository<PostInterface, PostModel>();
    let post: PostInterface = new Post({title: 'Post', text: 'Text text text', user});
    post = await postRepository.create(post);
    const { body } = await request()
      .patch(`/posts/${post.id}/user/${user.id}`)
      .send({
        text: ''
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });
});