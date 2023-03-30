import { UserModel } from '@models';
import { User } from '@domains';
import BaseRepository from './baseRepository';

class UserRepository<UserInterface, UserModel> extends BaseRepository<UserInterface, UserModel> {
  constructor() {
    super(UserModel, User);
  }
}

export default UserRepository;