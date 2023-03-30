import CommentRepository from '@database/repositories/commentRepository';
import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import { Post, User } from '@domains';
import CommentModel from '@models/commentModel';
import PostModel from '@models/postModel';
import UserModel from '@models/userModel';
import { CommentInterface, PostInterface, UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';

describe('Comment', () => {

  beforeEach(async () => {
    const repository = new CommentRepository<CommentInterface, CommentModel>();
    await repository.deleteAll();
  });

  test('Should create new comment', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let postOwner: UserInterface = new User({name: 'Admin', isAdmin: false});
    postOwner.active = true;
    postOwner = await userRepository.create(postOwner);
    let user: UserInterface = new User({name: 'Admin', isAdmin: false});
    user.active = true;
    user = await userRepository.create(user);
    const postRepository = new PostRepository<PostInterface, PostModel>();
    let post: PostInterface = new Post({title: 'Post', text: 'Text text text', user: postOwner});
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
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let postOwner: UserInterface = new User({name: 'Admin', isAdmin: false});
    postOwner.active = true;
    postOwner = await userRepository.create(postOwner);
    let user: UserInterface = new User({name: 'Admin', isAdmin: false});
    user = await userRepository.create(user);
    const postRepository = new PostRepository<PostInterface, PostModel>();
    let post: PostInterface = new Post({title: 'Post', text: 'Text text text', user: postOwner});
    post = await postRepository.create(post);

    const { body } = await request()
      .post(`/posts/${post.id}/comments/user/${user.id}`)
      .send({
        text: 'text text text'
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t create new comment without text', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let postOwner: UserInterface = new User({name: 'Admin', isAdmin: false});
    postOwner.active = true;
    postOwner = await userRepository.create(postOwner);
    let user: UserInterface = new User({name: 'Admin', isAdmin: false});
    user.active = true;
    user = await userRepository.create(user);
    const postRepository = new PostRepository<PostInterface, PostModel>();
    let post: PostInterface = new Post({title: 'Post', text: 'Text text text', user: postOwner});
    post = await postRepository.create(post);
    const { body } = await request()
      .post(`/posts/${post.id}/comments/user/${user.id}`)
      .send({
        title: 'Teste comment',
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });
});