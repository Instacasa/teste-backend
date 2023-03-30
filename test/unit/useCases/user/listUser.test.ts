import { UserRepository } from '@repositories';
import { UserModel } from '@models';
import { UserInterface } from '@types';
import { CreateUserUseCase, ListUserUseCase } from '@useCases';

describe('List User', () => {

  beforeEach(async () => {
    const repository = new UserRepository<UserInterface, UserModel>();
    await repository.deleteAll();
  });

  test('Should list user', async () => {
    const createUser = new CreateUserUseCase();
    const listUser = new ListUserUseCase();
    const partialUser: Partial<UserInterface> = {
      name: 'Teste', isAdmin: true, active: true
    };
    const user1 = await createUser.execute(partialUser);
    const user2 = await createUser.execute({...partialUser, name: 'Teste 2'});
    const listedUser = await listUser.execute();
    expect(listedUser).toHaveLength(2);
    expect(listedUser[0].id).toEqual(user2.id);
    expect(listedUser[1].id).toEqual(user1.id);
  });
});