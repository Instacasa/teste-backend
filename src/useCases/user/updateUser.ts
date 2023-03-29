import UserRepository from '@database/repositories/userRepository';
import { ValidationError } from '@libs/errors/validationError';
import { RepositoryInterface, UserInterface } from '@types';

class UpdateUser {
  repository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new UserRepository();
  }


  public execute = async (userId: number, id: number, data: Partial<UserInterface>): Promise<UserInterface> => {
    const admin = await this.repository.get(userId);
    if (!admin.isAdmin) {
      throw new ValidationError('Apenas administradores podem editar usuários');
    }
    const user = await this.repository.get(id);
    user.name = data.name ?? user.name;
    user.active = data.active ?? user.active;
    return await this.repository.update(user);
  };

}

export default UpdateUser;