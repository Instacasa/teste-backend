import UserRepository from '@database/repositories/userRepository';
import { RepositoryInterface, UserInterface } from '@types';

class ListUser {
  repository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new UserRepository();
  }


  public execute = async (): Promise<UserInterface[]> => {
    try {
      return await this.repository.list();
    } catch(error) {
      console.log(error);
      throw error;
    }
  };

}

export default ListUser;