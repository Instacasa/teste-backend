import UserModel from '@models/userModel';
import UserRepository from '@database/repositories/userRepository';
import User from '@/domains/user';
import { UserInterface } from '@types';
import { NotFoundError } from '@libs/errors/notFoundError';

describe('User Repository', () => {
  beforeEach(async () => {
    const repository = new UserRepository<UserInterface, UserModel>();
    await repository.deleteAll();
  });

  test('Should create new element on database', async () => {
    const user = new User({
      name: 'Test',
      isAdmin: true,
    });

    const repository = new UserRepository<UserInterface, UserModel>();
    const newUser = await repository.create(user);
    expect(newUser.id).toBeDefined();
    expect(newUser.id).toBeGreaterThan(0);
    expect(newUser.name).toEqual(user.name);
    expect(newUser.active).toBeFalsy();
  });

  test('Should update elemente on database', async () => {
    let user: UserInterface = new User({
      name: 'Test',
      isAdmin: true,
    });

    const repository = new UserRepository<UserInterface, UserModel>();
    user = await repository.create(user);
    user.name = 'Updated Name';
    const udpatedUser = await repository.update(user);

    expect(udpatedUser.id).toBeDefined();
    expect(udpatedUser.id).toBeGreaterThan(0);
    expect(udpatedUser.name).toEqual('Updated Name');
  });

  test('Should get user by id', async () => {
    let user: UserInterface = new User({
      name: 'Test',
      isAdmin: true,
    });

    const repository = new UserRepository<UserInterface, UserModel>();
    user = await repository.create(user);
    const persistedUser = await repository.get(user.id);
    expect(persistedUser.id).toEqual(user.id);
    expect(persistedUser.name).toEqual(user.name);
  });

  test('Should get list of user', async () => {
    let user1: UserInterface = new User({ name: 'Test 1', isAdmin: true });
    let user2: UserInterface = new User({ name: 'Test 2', isAdmin: true });
    let user3: UserInterface = new User({ name: 'Test 3', isAdmin: true });

    const repository = new UserRepository<UserInterface, UserModel>();
    user1 = await repository.create(user1);
    user2 = await repository.create(user2);
    user3 = await repository.create(user3);
    const persistedUser = await repository.list();
    expect(persistedUser).toHaveLength(3);
    expect(persistedUser[0].name).toEqual(user3.name);
  });

  test('Should delete a user', async () => {
    let user1: UserInterface = new User({ name: 'Test 1', isAdmin: true });
    let user2: UserInterface = new User({ name: 'Test 2', isAdmin: true });
    let user3: UserInterface = new User({ name: 'Test 3', isAdmin: true });

    const repository = new UserRepository<UserInterface, UserModel>();
    user1 = await repository.create(user1);
    user2 = await repository.create(user2);
    user3 = await repository.create(user3);
    await repository.delete(user2.id);
    try {
      await repository.get(user2.id);
    } catch (error) {
      expect(error as Error).toBeInstanceOf(NotFoundError);
    }
  });
});
