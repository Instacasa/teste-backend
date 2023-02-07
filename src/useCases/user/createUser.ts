import User from '@/domains/user';
import UserRepository from '@database/repositories/userRepository';
import { RepositoryInterface, UserInterface } from '@types';

class CreateUser {
  repository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new UserRepository();
  }


  public execute = async (data: Partial<UserInterface>): Promise<UserInterface> => {
    try {
      const user = new User(data);
      return await this.repository.create(user);
    } catch(error) {
      console.log(error);
      throw error;
    }
  };

}

export default CreateUser;