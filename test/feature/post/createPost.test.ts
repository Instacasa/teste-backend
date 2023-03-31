import { CategoryRepository, PostRepository, UserRepository } from '@repositories';
import { CategoryModel, PostModel, UserModel } from '@models';
import { CategoryInterface, PostInterface, UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';
import { mockUsers } from '@mocks';
import { faker } from '@faker-js/faker';
import { User } from '@domains';
import { mockCategories } from '@mocks/category';

describe('Post', () => {

  let categoryRepository: CategoryRepository<CategoryInterface, CategoryModel>;
  let repository: PostRepository<PostInterface, PostModel>;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let user : UserInterface;
  let category : CategoryInterface;

  beforeAll(async() => {
    categoryRepository = new CategoryRepository<CategoryInterface, CategoryModel>();
    userRepository = new UserRepository<UserInterface, UserModel>();
    repository = new PostRepository<PostInterface, PostModel>();

    user = new User({name: 'Simple user', isAdmin: false});
    user.active = true;
    user = await userRepository.create(user);

    [ category ] = mockCategories([{}]);
    category = await categoryRepository.create(category);
  });

  beforeEach(async () => {
    await repository.deleteAll();
  });

  test('Should create new post', async () => {
    const response = await request()
      .post(`/posts/user/${user.id}`)
      .send({
        title: 'Teste post',
        text: faker.lorem.paragraph(),
        categories: [
          {
            id: category.id,
            label: category.label
          }
        ]
      })
      .expect(httpStatus.CREATED);
    
    expect(response.body.id).toBeDefined();
    expect(response.body.title).toEqual('Teste post');
  });

  test('Shouldn\'t allow to create new post if user is inactive', async () => {
    let [ inactiveUser ]: UserInterface[] = mockUsers([{isAdmin: false}]);
    inactiveUser = await userRepository.create(inactiveUser);
    const { body } = await request()
      .post(`/posts/user/${inactiveUser.id}`)
      .send({
        title: faker.lorem.sentence(),
        text: faker.lorem.paragraph(),
        categories: [
          {
            id: category.id,
            label: category.label
          }
        ]
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t create new post without title', async () => {
    const { body } = await request()
      .post(`/posts/user/${user.id}`)
      .send({
        text: faker.lorem.paragraph(),
        categories: [
          {
            id: category.id,
            label: category.label
          }
        ]
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t create new post without text', async () => {
    const { body } = await request()
      .post(`/posts/user/${user.id}`)
      .send({
        title: faker.lorem.sentence(),
        categories: [
          {
            id: category.id,
            label: category.label
          }
        ]
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t create new post without category', async () => {
    const { body } = await request()
      .post(`/posts/user/${user.id}`)
      .send({
        title: faker.lorem.sentence(),
        text: faker.lorem.paragraph()
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t create new post with inexistent user', async () => {
    let [ category ] : CategoryInterface[] = mockCategories([{}]);
    category = await categoryRepository.create(category);

    const { body } = await request()
      .post(`/posts/user/${0}`)
      .send({
        title: faker.lorem.sentence(),
        text: faker.lorem.paragraph(),
        categories: [category]
      })
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual('NotFoundError');
  });
});