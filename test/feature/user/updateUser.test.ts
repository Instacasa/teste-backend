import UserRepository from '@database/repositories/userRepository';
import User from '@domains/user';
import UserModel from '@models/userModel';
import { UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';

describe('User', () => {

  beforeEach(async () => {
    const repository = new UserRepository<UserInterface, UserModel>();
    await repository.deleteAll();
  });
  
  test('Should update user by id', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let admin: UserInterface = new User({name: 'Admin', isAdmin: true});
    admin.active = true;
    admin = await userRepository.create(admin);
    let user: UserInterface = new User({name: 'user', isAdmin: false});
    user.active = true;
    user = await userRepository.create(user);
    const { body } = await request()
      .patch(`/users/${admin.id}/edit/${user.id}`)
      .send({
        name: 'test'
      })
      .expect(httpStatus.OK);

    expect(body.name).toEqual('test');
  });

  test('Shouldn\'t update inexistent user', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let admin: UserInterface = new User({name: 'Admin', isAdmin: true});
    admin.active = true;
    admin = await userRepository.create(admin);
    const response = await request()
      .patch(`/users/${admin.id}/edit/0`)
      .send({
        name: ''
      })
      .expect(httpStatus.NOT_FOUND);
    expect(response.body.error.name).toEqual('NotFoundError');
  });

  test('Shouldn\'t allow to update user without been an admin', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let admin: UserInterface = new User({name: 'Admin', isAdmin: false});
    admin.active = true;
    admin = await userRepository.create(admin);
    let user: UserInterface = new User({name: 'user', isAdmin: false});
    user.active = true;
    user = await userRepository.create(user);
    const { body } = await request()
      .patch(`/users/${admin.id}/edit/${user.id}`)
      .send({
        name: ''
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });
});