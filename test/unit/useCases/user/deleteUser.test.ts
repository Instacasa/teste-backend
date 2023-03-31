import { UserRepository } from '@repositories';
import { User } from '@domains';
import { NotFoundError } from '@errors';
import { UserModel } from '@models';
import { UserInterface } from '@types';
import { CreateUserUseCase, DeleteUserUseCase, GetUserUseCase } from '@useCases';

describe('Delete User', () => {
  
  let user: UserInterface;  
  beforeEach(async () => {
    const repository = new UserRepository<UserInterface, UserModel>();
    await repository.deleteAll();

    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
  });
  
  test('Should delete user by admin', async () => {
    const createUser = new CreateUserUseCase();
    const deleteUser = new DeleteUserUseCase();
    const getUser = new GetUserUseCase();
    const partialUser: Partial<UserInterface> = {
      name: 'Teste', isAdmin: false, active: true
    };
    const newUser = await createUser.execute(partialUser);
    await deleteUser.execute(user.id, newUser.id);
    await expect(() => 
      getUser.execute(newUser.id)
    ).rejects.toThrowError(new NotFoundError(`user with id ${newUser.id} can't be found.`));
  });

  test('Shouldn\'t delete inexistent user', async () => {
    const deleteUser = new DeleteUserUseCase();
    await expect(() => 
      deleteUser.execute(user.id, 0)
    ).rejects.toThrowError(new NotFoundError('user with id 0 can\'t be found.'));
  });
});