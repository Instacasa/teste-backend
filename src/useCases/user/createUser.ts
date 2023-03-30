import { User } from '@domains';
import { UserRepository } from '@repositories';
import { RepositoryInterface, UserInterface } from '@types';

export class CreateUserUseCase {
  repository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new UserRepository();
  }


  public execute = async (data: Partial<UserInterface>): Promise<UserInterface> => {
    const user = new User(data);
    return await this.repository.create(user);
  };

}
