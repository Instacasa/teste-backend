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
});