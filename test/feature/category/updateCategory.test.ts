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

  test('Should update category by id', async () => {
    let [ category ] : CategoryInterface[] = mockCategories([{}]);
    category = await repository.create(category);
    const { body } = await request()
      .patch(`/categories/${category.id}/user/${admin.id}`)
      .send({
        label: 'New label'
      })
      .expect(httpStatus.OK);
    expect(body.label).toEqual('New label');
  });

  test('Shouldn\'t update inexistent category', async () => {
    const { body } = await request()
      .patch(`/categories/0/user/${admin.id}`)
      .send({
        label: 'New label'
      })
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual('NotFoundError');
  });

  test('Shouldn\'t allow to update category without been admin', async () => {
    let simpleUser: UserInterface = new User({name: 'Simple User', isAdmin: false});
    simpleUser.active = true;
    simpleUser = await userRepository.create(simpleUser);
    let [ category ] : CategoryInterface[] = mockCategories([{}]);
    category = await repository.create(category);
    const { body } = await request()
      .patch(`/categories/${category.id}/user/${simpleUser.id}`)
      .send({
        label: 'New label'
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t allow to update category text to null/empty', async () => {
    let [ category ] : CategoryInterface[] = mockCategories([{}]);
    category = await repository.create(category);
    const { body } = await request()
      .patch(`/categories/${category.id}/user/${admin.id}`)
      .send({
        label: ''
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });
});