import { User } from '@domains';
import { UserInterface } from '@types';
import { faker } from '@faker-js/faker';

export const mockUsers = (users: Array<Partial<UserInterface>>): Array<User> => users.map((userData) => {
  return new User({...userData,
    name: userData.name ?? faker.name.fullName()
  });
});
