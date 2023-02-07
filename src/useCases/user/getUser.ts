import UserRepository from '@database/repositories/userRepository';
import { RepositoryInterface, UserInterface } from '@types';

class GetUser {
  repository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new UserRepository();
  }


  public execute = async (id: number): Promise<UserInterface> => {
    try {
      return await this.repository.get(id);
    } catch(error) {
      console.log(error);
      throw error;
    }
  };

}

export default GetUser;