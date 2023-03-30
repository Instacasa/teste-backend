import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import { Post, User } from '@domains';
import { PostModel, UserModel } from '@models';
import { PostInterface, UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';

describe('Post', () => {

  beforeEach(async () => {
    const repository = new PostRepository<PostInterface, PostModel>();
    await repository.deleteAll();
  });

  test('Should get post by id', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let user: UserInterface = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
    const postRepository = new PostRepository<PostInterface, PostModel>();
    const post: PostInterface = new Post({title: 'Post', text: 'Text text text', user});
    await postRepository.create(post);
    await postRepository.create(post);
    await postRepository.create(post);
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
});