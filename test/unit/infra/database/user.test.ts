import { UserRepository } from '@repositories';
import { UserInterface } from '@types';
import { NotFoundError } from '@errors';
import { UserModel } from '@models';
import { mockUsers } from '@mocks';

const userRepository = new UserRepository<UserInterface, UserModel>();

describe('User Repository', () => {

  beforeEach(async () => {
    await userRepository.deleteAll();
  });

  test('Should create new element on database', async () => {
    const [ user ]: UserInterface[] = mockUsers([{ isAdmin: true }]);

    const newUser = await userRepository.create(user);
    expect(newUser.id).toBeDefined();
    expect(newUser.id).toBeGreaterThan(0);
    expect(newUser.name).toEqual(user.name);
    expect(newUser.active).toBeFalsy();
  });

  test('Should update elemente on database', async () => {
    let [ user ]: UserInterface[] = mockUsers([{ isAdmin: true }]);

    user = await userRepository.create(user);
    user.name = 'Updated Name';
    const udpatedUser = await userRepository.update(user);

    expect(udpatedUser.id).toBeDefined();
    expect(udpatedUser.id).toBeGreaterThan(0);
    expect(udpatedUser.name).toEqual('Updated Name');
  });

  test('Should get user by id', async () => {
    let [ user ]: UserInterface[] = mockUsers([{ isAdmin: true }]);

    user = await userRepository.create(user);
    const persistedUser = await userRepository.get(user.id);
    expect(persistedUser.id).toEqual(user.id);
    expect(persistedUser.name).toEqual(user.name);
  });
  

  test('Should get list of user', async () => {
    let [ user1, user2, user3 ]: UserInterface[] = mockUsers([{ isAdmin: true }, { isAdmin: true }, { isAdmin: true }]);

    user1 = await userRepository.create(user1);
    user2 = await userRepository.create(user2);
    user3 = await userRepository.create(user3);
    const persistedUser = await userRepository.list();
    expect(persistedUser).toHaveLength(3);
    expect(persistedUser[0].name).toEqual(user3.name);
  });
  

  test('Should delete a user', async () => {
    let [user1, user2, user3]: UserInterface[] = mockUsers([{ isAdmin: true }, { isAdmin: true }, { isAdmin: true }]);

    user1 = await userRepository.create(user1);
    user2 = await userRepository.create(user2);
    user3 = await userRepository.create(user3);
    await userRepository.delete(user2.id);

    const persistedUser1 = await userRepository.get(user1.id);
    const persistedUser3 = await userRepository.get(user3.id);

    expect(persistedUser1.id).toEqual(user1.id);
    expect(persistedUser3.id).toEqual(user3.id);

    await expect(userRepository.get(user2.id))
      .rejects
      .toThrow(NotFoundError);
  });
  
});