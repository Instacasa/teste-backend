import { UserRepository } from '@repositories';
import { UserModel } from '@models';
import { UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';

describe('User', () => {

  beforeEach(async () => {
    const repository = new UserRepository<UserInterface, UserModel>();
    await repository.deleteAll();
  });

  test('Should create new user', async () => {
    const response = await request()
      .post('/users')
      .send({
        name: 'Teste user'
      })
      .expect(httpStatus.CREATED);
    
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toEqual('Teste user');
  });

  test('Shouldn\'t create new user without name', async () => {
    const { body } = await request()
      .post('/users')
      .send({
        name: ''
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });
});