import { CreateUserUseCase, UpdateUserUseCase } from '@useCases';
import { UserRepository } from '@repositories';
import { User } from '@domains';
import { ValidationError } from '@errors';
import { UserModel } from '@models';
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
    const createUser = new CreateUserUseCase();
    const updateUser = new UpdateUserUseCase();
    const partialUser: Partial<UserInterface> = {
      name: 'Teste', isAdmin: true, active: true
    };
    const newUser: UserInterface = await createUser.execute(partialUser);
    newUser.name = 'Test Update';
    const updatedUser = await updateUser.execute(user.id, newUser.id, newUser);
    expect(updatedUser.name).toEqual('Test Update');
  });

  test('Shouldn\'t update user name to empty/null', async () => {
    const createUser = new CreateUserUseCase();
    const updateUser = new UpdateUserUseCase();
    const partialUser: Partial<UserInterface> = {
      name: 'Teste', isAdmin: true, active: true
    };
    const newUser = await createUser.execute(partialUser);
    await expect(() => 
      updateUser.execute(user.id, newUser.id, {...newUser, name: ''})
    ).rejects.toThrowError(new ValidationError('O nome do usuário é obrigatório'));
  });
});