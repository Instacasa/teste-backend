import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import { User } from '@domains';
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

  test('Should create new post', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let admin: UserInterface = new User({name: 'Admin', isAdmin: false});
    admin.active = true;
    admin = await userRepository.create(admin);
    const response = await request()
      .post(`/posts/user/${admin.id}`)
      .send({
        title: 'Teste post',
        text: 'text text text'
      })
      .expect(httpStatus.CREATED);
    
    expect(response.body.id).toBeDefined();
    expect(response.body.title).toEqual('Teste post');
  });

  test('Shouldn\'t allow to create new post if user is inactive', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let admin: UserInterface = new User({name: 'Admin', isAdmin: false});
    admin = await userRepository.create(admin);
    const { body } = await request()
      .post(`/posts/user/${admin.id}`)
      .send({
        title: 'Teste post',
        text: 'text text text'
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t create new post without title', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let admin: UserInterface = new User({name: 'Admin', isAdmin: false});
    admin.active = true;
    admin = await userRepository.create(admin);
    const { body } = await request()
      .post(`/posts/user/${admin.id}`)
      .send({
        text: 'text text text'
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t create new post without text', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let admin: UserInterface = new User({name: 'Admin', isAdmin: false});
    admin.active = true;
    admin = await userRepository.create(admin);
    const { body } = await request()
      .post(`/posts/user/${admin.id}`)
      .send({
        title: 'Teste post',
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });
});