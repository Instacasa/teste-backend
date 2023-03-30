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
    let post: PostInterface = new Post({title: 'Post', text: 'Text text text', user});
    post = await postRepository.create(post);
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