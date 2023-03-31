import { User } from '@domains';
import { mockCategories } from '@mocks/category';
import { CategoryModel, UserModel } from '@models';
import { CategoryRepository, UserRepository } from '@repositories';
import { CategoryInterface, UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';

describe('Category', () => {
  let repository: CategoryRepository<CategoryInterface, CategoryModel>;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let admin: UserInterface;
  let user: UserInterface;
  beforeAll(async () => {
    userRepository = new UserRepository<UserInterface, UserModel>();
    repository = new CategoryRepository<CategoryInterface, CategoryModel>();

    admin = new User({name: 'Admin', isAdmin: true});
    admin.active = true;
    admin = await userRepository.create(admin);

    user = new User({name: 'Simple user', isAdmin: false});
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    await repository.deleteAll();
  });
  
  test('Should delete category by admins', async () => {    
    let [category]: CategoryInterface[] = mockCategories([{}]);
    category = await repository.create(category);
    await request()
      .delete(`/categories/${category.id}/user/${admin.id}`)
      .expect(httpStatus.ACCEPTED);
  });

  test('Shouldn\'t delete inexistent category', async () => {
    const { body } = await request()
      .delete(`/categories/0/user/${admin.id}`)
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual('NotFoundError');
  });

  test('Shouldn\'t allow to delete category without been an admin', async () => {
    let [category]: CategoryInterface[] = mockCategories([{}]);
    category = await repository.create(category);
    const { body } = await request()
      .delete(`/categories/${category.id}/user/${user.id}`)
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });
});