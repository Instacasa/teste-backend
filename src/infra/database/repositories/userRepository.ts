import { UserModel } from '@models';
import { User } from '@domains';
import { BaseRepository } from '@repositories';

export class UserRepository<UserInterface, UserModel> extends BaseRepository<UserInterface, UserModel> {
  constructor() {
    super(UserModel, User);
  }
}
