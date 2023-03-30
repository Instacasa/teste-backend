import { ValidationError } from '@errors';
import { UserInterface } from '@types';
import { User } from '@domains';
import { mockUsers } from '@mocks';
import { faker } from '@faker-js/faker';

describe('User', () => {
  test('should create a valid user inactive and not admin', () => {
    const [ user ] = mockUsers([{ active: false, isAdmin: false }]);
    expect(user).toBeInstanceOf(User);
    expect(user.active).toBeFalsy();
    expect(user.isAdmin).toBeFalsy();
  });

  test('should new users without id turn always inactive', () => {
    const [ user ] = mockUsers([{ active: true, isAdmin: false }]);
    expect(user).toBeInstanceOf(User);
    expect(user.active).toBeFalsy();
    expect(user.isAdmin).toBeFalsy();
  });

  test('shouldn\'t create user without name', () => {
    try {
      mockUsers([{ id: +faker.random.numeric(5), name: '', active: true, isAdmin: true }]);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O nome do usuário é obrigatório');
    }
  });

  test('should allow admins to activate users', () => {
    const adminData: UserInterface = { id: 1, name: 'Admin', active: true, isAdmin: true };
    const userData: UserInterface = { id: 1, name: 'Admin', active: false, isAdmin: false };

    const admin = new User(adminData);
    const user = new User(userData);

    expect(user.active).toBeFalsy();

    user.activate(admin);

    expect(user.active).toBeTruthy();
  });

  test('shouldn\'t allow non admins to activate users', () => {
    const adminData: UserInterface = { id: 1, name: 'Admin', active: true, isAdmin: false };
    const userData: UserInterface = { id: 1, name: 'Admin', active: false, isAdmin: false };

    const admin = new User(adminData);
    const user = new User(userData);

    expect(user.active).toBeFalsy();
    try { 
      user.activate(admin);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('Apenas usuários administradores podem ativar e desativar usuários');
    }

    expect(user.active).toBeFalsy();
  });

  test('should allow admins to deactivate users', () => {
    const adminData: UserInterface = { id: 1, name: 'Admin', active: true, isAdmin: true };
    const userData: UserInterface = { id: 1, name: 'Admin', active: true, isAdmin: false };

    const admin = new User(adminData);
    const user = new User(userData);

    expect(user.active).toBeTruthy();

    user.deactivate(admin);

    expect(user.active).toBeFalsy();
  });

  test('shouldn\'t allow non admins to deactivate users', () => {
    const adminData: UserInterface = { id: 1, name: 'Admin', active: true, isAdmin: false };
    const userData: UserInterface = { id: 1, name: 'Admin', active: true, isAdmin: false };

    const admin = new User(adminData);
    const user = new User(userData);

    expect(user.active).toBeTruthy();
    try { 
      user.deactivate(admin);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('Apenas usuários administradores podem ativar e desativar usuários');
    }

    expect(user.active).toBeTruthy();
  });
});