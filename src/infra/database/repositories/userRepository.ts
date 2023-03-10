import UserModel from '@models/userModel';
import User from '@/domains/user';
import BaseRepository from './baseRepository';

class UserRepository<UserInterface, UserModel> extends BaseRepository<UserInterface, UserModel> {
  constructor() {
    super(UserModel, User);
  }
}

export default UserRepository;