import { UserRepository } from '@repositories';
import { RepositoryInterface, UserInterface } from '@types';

export class ListUserUseCase {
  repository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new UserRepository();
  }


  public execute = async (): Promise<UserInterface[]> => {
    return await this.repository.list();
  };

}