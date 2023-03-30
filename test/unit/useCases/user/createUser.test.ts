import CreateUser from '@/useCases/user/createUser';
import { UserRepository } from '@repositories';
import { User } from '@domains';
import { ValidationError } from '@libs/errors/validationError';
import { UserModel } from '@models';
import { UserInterface } from '@types';

describe('Create User', () => {
  
  beforeEach(async () => {
    const repository = new UserRepository<UserInterface, UserModel>();
    await repository.deleteAll();
  });
  
  test('Should create new user', async () => {
    const createUser = new CreateUser();
    const partialUser: Partial<UserInterface> = {
      name: 'Teste', isAdmin: true, active: true
    };
    const user = await createUser.execute(partialUser);
    expect(user).toBeInstanceOf(User);
  });

  test('Shouldn\'t create user without name', async () => {
    const createUser = new CreateUser();
    const partialUser: Partial<UserInterface> = {
      isAdmin: true, active: true
    };
    try {
      const user = await createUser.execute(partialUser);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O nome do usuário é obrigatório');
    }
  });
});