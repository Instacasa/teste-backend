import CreateUser from '@/useCases/user/createUser';
import UpdateUser from '@/useCases/user/updateUser';
import UserRepository from '@database/repositories/userRepository';
import { User } from '@domains';
import { ValidationError } from '@libs/errors/validationError';
import UserModel from '@models/userModel';
import { UserInterface } from '@types';

describe('Update User', () => {
  
  let user: UserInterface;  
  beforeEach(async () => {
    const repository = new UserRepository<UserInterface, UserModel>();
    await repository.deleteAll();

    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
  });

  test('Should update user name', async () => {
    const createUser = new CreateUser();
    const updateUser = new UpdateUser();
    const partialUser: Partial<UserInterface> = {
      name: 'Teste', isAdmin: true, active: true
    };
    const newUser: UserInterface = await createUser.execute(partialUser);
    newUser.name = 'Test Update';
    const updatedUser = await updateUser.execute(user.id, newUser.id, newUser);
    expect(updatedUser.name).toEqual('Test Update');
  });

  test('Shouldn\'t update user name to empty/null', async () => {
    const createUser = new CreateUser();
    const updateUser = new UpdateUser();
    const partialUser: Partial<UserInterface> = {
      name: 'Teste', isAdmin: true, active: true
    };
    const newUser = await createUser.execute(partialUser);
    try {
      await updateUser.execute(user.id, newUser.id, {...newUser, name: ''});
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O nome do usuário é obrigatório');
    }
  });
});