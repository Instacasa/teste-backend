import User from '@/domains/user';
import UserRepository from '@database/repositories/userRepository';
import { RepositoryInterface, UserInterface } from '@types';

class CreateUser {
  repository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new UserRepository();
  }


  public execute = async (data: Partial<UserInterface>): Promise<UserInterface> => {
    const user = new User(data);
    return await this.repository.create(user);
  };

}

export default CreateUser;