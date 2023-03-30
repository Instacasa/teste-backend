import { UserRepository } from '@repositories';
import { RepositoryInterface, UserInterface } from '@types';

export class GetUserUseCase {
  repository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new UserRepository();
  }


  public execute = async (id: number): Promise<UserInterface> => {
    return await this.repository.get(id);
  };

}