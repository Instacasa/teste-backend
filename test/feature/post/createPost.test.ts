import { PostRepository, UserRepository } from '@repositories';
import { PostModel, UserModel } from '@models';
import { PostInterface, UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';
import { mockUsers } from '@mocks';
import { faker } from '@faker-js/faker';

const userRepository = new UserRepository<UserInterface, UserModel>();
const postRepository = new PostRepository<PostInterface, PostModel>();


describe('Post', () => {

  beforeEach(async () => {
    await postRepository.deleteAll();
    await userRepository.deleteAll();
  });

  test('Should create new post', async () => {
    let [ admin ]: UserInterface[] = mockUsers([{isAdmin: false}]);
    admin.active = true;
    admin = await userRepository.create(admin);
    const response = await request()
      .post(`/posts/user/${admin.id}`)
      .send({
        title: 'Teste post',
        text: faker.lorem.paragraph()
      })
      .expect(httpStatus.CREATED);
    
    expect(response.body.id).toBeDefined();
    expect(response.body.title).toEqual('Teste post');
  });

  test('Shouldn\'t allow to create new post if user is inactive', async () => {
    let [ admin ]: UserInterface[] = mockUsers([{isAdmin: false}]);
    admin = await userRepository.create(admin);
    const { body } = await request()
      .post(`/posts/user/${admin.id}`)
      .send({
        title: faker.lorem.sentence(),
        text: faker.lorem.paragraph()
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t create new post without title', async () => {
    let [ admin ]: UserInterface[] = mockUsers([{isAdmin: false}]);
    admin.active = true;
    admin = await userRepository.create(admin);
    const { body } = await request()
      .post(`/posts/user/${admin.id}`)
      .send({
        text: faker.lorem.paragraph()
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t create new post without text', async () => {
    let [ admin ]: UserInterface[] = mockUsers([{isAdmin: false}]);
    admin.active = true;
    admin = await userRepository.create(admin);
    const { body } = await request()
      .post(`/posts/user/${admin.id}`)
      .send({
        text: faker.lorem.paragraph()
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t create new post with inexistent user', async () => {
    const { body } = await request()
      .post(`/posts/user/${+faker.random.numeric(6)}`)
      .send({
        title: faker.lorem.sentence(),
        text: faker.lorem.paragraph()
      })
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual('NotFoundError');
  });
});