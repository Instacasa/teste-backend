import { UserRepository } from '@repositories';
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
    let user: UserInterface = new User({name: 'User', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
    const { body } = await request()
      .get(`/users/${user.id}`)
      .expect(httpStatus.OK);
    
    expect(body.id).toBeDefined();
    expect(body.name).toEqual('User');
  });

  test('Shouldn\'t get inexistent user', async () => {
    const { body } = await request()
      .get('/users/0')
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual('NotFoundError');
  });
});