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

  test('Should get user by id', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    const user: UserInterface = new User({name: 'User', isAdmin: true});
    user.active = true;
    await userRepository.create(user);
    await userRepository.create(user);
    await userRepository.create(user);
    const { body } = await request()
      .get('/users/')
      .expect(httpStatus.OK);
    
    expect(body).toHaveLength(3);
  });

  test('Shouldn\'t get inexistent user', async () => {
    const { body } = await request()
      .get('/users/')
      .expect(httpStatus.OK);
    expect(body).toHaveLength(0);
  });
});