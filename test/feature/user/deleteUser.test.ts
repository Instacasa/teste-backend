import UserRepository from '@database/repositories/userRepository';
import { User } from '@domains';
import { UserModel } from '@models';
import { UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';

describe('User', () => {

  beforeEach(async () => {
    const repository = new UserRepository<UserInterface, UserModel>();
    await repository.deleteAll();
  });
  
  test('Should delete user by id', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let admin: UserInterface = new User({name: 'Admin', isAdmin: true});
    admin.active = true;
    admin = await userRepository.create(admin);
    let user: UserInterface = new User({name: 'user', isAdmin: false});
    user.active = true;
    user = await userRepository.create(user);
    const { body } = await request()
      .delete(`/users/${admin.id}/remove/${user.id}`)
      .expect(httpStatus.ACCEPTED);
  });

  test('Shouldn\'t delete inexistent user', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let admin: UserInterface = new User({name: 'Admin', isAdmin: true});
    admin.active = true;
    admin = await userRepository.create(admin);
    const { body } = await request()
      .delete(`/users/${admin.id}/remove/0`)
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual('NotFoundError');
  });

  test('Shouldn\'t allow to delete user without been an admin', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let admin: UserInterface = new User({name: 'Admin', isAdmin: false});
    admin.active = true;
    admin = await userRepository.create(admin);
    let user: UserInterface = new User({name: 'user', isAdmin: false});
    user.active = true;
    user = await userRepository.create(user);
    const { body } = await request()
      .delete(`/users/${admin.id}/remove/${user.id}`)
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });
});