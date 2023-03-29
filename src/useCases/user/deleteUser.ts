import UserRepository from '@database/repositories/userRepository';
import { ValidationError } from '@libs/errors/validationError';
import { RepositoryInterface, UserInterface } from '@types';

class DeleteUser {
  repository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new UserRepository();
  }


  public execute = async (userId: number, id: number): Promise<void> => {
    const admin = await this.repository.get(userId);
    if (!admin.isAdmin) {
      throw new ValidationError('Apenas administradores podem excluir usuários');
    }
    const user = await this.repository.get(id);
    if (user.isAdmin) {
      throw new ValidationError('Administradores não podem set excluídos');
    }
    await this.repository.delete(user.id);      
  };

}

export default DeleteUser;