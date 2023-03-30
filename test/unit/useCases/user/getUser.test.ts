import CreateUser from '@/useCases/user/createUser';
import GetUser from '@/useCases/user/getUser';
import UserRepository from '@database/repositories/userRepository';
import { NotFoundError } from '@libs/errors/notFoundError';
import { UserModel } from '@models';
import { UserInterface } from '@types';

describe('Get User', () => {
  
  beforeEach(async () => {
    const repository = new UserRepository<UserInterface, UserModel>();
    await repository.deleteAll();
  });
  
  test('Should get user', async () => {
    const createUser = new CreateUser();
    const getUser = new GetUser();
    const partialUser: Partial<UserInterface> = {
      name: 'Teste', isAdmin: true, active: true
    };
    const user = await createUser.execute(partialUser);
    const getedUser = await getUser.execute(user.id);
    expect(getedUser.name).toEqual('Teste');
  });

  test('Shouldn\'t get inexistent user', async () => {
    const getUser = new GetUser();
    try {
      await getUser.execute(0);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(NotFoundError);
      expect((error as Error).message).toEqual('user with id 0 can\'t be found.');
    }
  });
});