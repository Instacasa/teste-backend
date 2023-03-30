import { UserRepository } from '@repositories';
import { RepositoryInterface, UserInterface } from '@types';

class ListUser {
  repository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new UserRepository();
  }


  public execute = async (): Promise<UserInterface[]> => {
    return await this.repository.list();
  };

}

export default ListUser;