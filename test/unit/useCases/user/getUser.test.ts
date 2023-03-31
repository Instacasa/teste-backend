import { CreateUserUseCase, GetUserUseCase } from '@useCases';
import { UserRepository } from '@repositories';
import { NotFoundError } from '@errors';
import { UserModel } from '@models';
import { UserInterface } from '@types';

describe('Get User', () => {
  
  beforeEach(async () => {
    const repository = new UserRepository<UserInterface, UserModel>();
    await repository.deleteAll();
  });
  
  test('Should get user', async () => {
    const createUser = new CreateUserUseCase();
    const getUser = new GetUserUseCase();
    const partialUser: Partial<UserInterface> = {
      name: 'Teste', isAdmin: true, active: true
    };
    const user = await createUser.execute(partialUser);
    const getedUser = await getUser.execute(user.id);
    expect(getedUser.name).toEqual('Teste');
  });

  test('Shouldn\'t get inexistent user', async () => {
    const getUser = new GetUserUseCase();
    await expect(() => 
      getUser.execute(0)
    ).rejects.toThrowError(new NotFoundError('user with id 0 can\'t be found.'));
  });
});