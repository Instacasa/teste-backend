import { UserRepository } from '@repositories';
import { RepositoryInterface, UserInterface } from '@types';

class GetUser {
  repository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new UserRepository();
  }


  public execute = async (id: number): Promise<UserInterface> => {
    return await this.repository.get(id);
  };

}

export default GetUser;