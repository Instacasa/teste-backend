import User from '@/domains/user';
import { ValidationError } from '@libs/errors/validationError';
import { UserInterface } from '@types';

describe('User', () => {
  test('should create a valid user inactive and not admin', () => {
    const data: UserInterface = { name: 'teste User', active: true, isAdmin: true };
    const user = new User(data);
    expect(user).toBeInstanceOf(User);
    expect(user.active).toBeFalsy();
    expect(user.isAdmin).toBeTruthy();
  });

  test('shouldn\'t create user without name', () => {
    const data: UserInterface = { id: 1, name: '', active: true, isAdmin: true };
    try {
      const user = new User(data);
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