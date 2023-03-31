import { User } from '@domains';
import { faker } from '@faker-js/faker';
import { mockUsers } from '@mocks';
import { CategoryModel, UserModel } from '@models';
import { CategoryRepository, UserRepository } from '@repositories';
import { CategoryInterface, UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';

describe('Category', () => {

  let repository: CategoryRepository<CategoryInterface, CategoryModel>;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let admin : UserInterface;
  beforeAll(async () => {
    userRepository = new UserRepository<UserInterface, UserModel>();
    repository = new CategoryRepository<CategoryInterface, CategoryModel>();

    admin = new User({name: 'Admin', isAdmin: true});
    admin.active = true;
    admin = await userRepository.create(admin);
  });

  beforeEach(async () => {
    await repository.deleteAll();
  });

  test('Should create new category', async () => {
    const response = await request()
      .post(`/categories/user/${admin.id}`)
      .send({
        label: 'Label test'
      })
      .expect(httpStatus.CREATED);
    
    expect(response.body.id).toBeDefined();
    expect(response.body.label).toEqual('Label test');
  });

  test('Shouldn\'t allow to create new category by simple user', async () => {
    let [ simpleUser ]: UserInterface[] = mockUsers([{isAdmin: false}]);
    simpleUser = await userRepository.create(simpleUser);
    const { body } = await request()
      .post(`/categories/user/${simpleUser.id}`)
      .send({
        label: faker.lorem.word()
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t create new category without label', async () => {
    const { body } = await request()
      .post(`/categories/user/${admin.id}`)
      .send({
        label: ''
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t create new category with inexistent user', async () => {
    const { body } = await request()
      .post(`/categories/user/${0}`)
      .send({
        label: faker.lorem.word()
      })
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual('NotFoundError');
  });

});