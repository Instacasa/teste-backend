import { User } from '@domains';
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
    expect(response.body.title).toEqual('Label test');
  });

});