import { ValidationError } from '@errors';
import { UserInterface } from '@types';

export class User implements UserInterface {
  private _id?: number;
  public get id(): number | undefined {
    return this._id;
  }
  public set id(newValue: number | undefined) {
    this._id = newValue;
  }

  private _name: string;
  public get name(): string {
    return this._name;
  }
  public set name(newValue: string) {
    if (!newValue || !newValue.trim()) {
      throw new ValidationError('O nome do usuário é obrigatório');
    }
    this._name = newValue;
  }

  private _active: boolean;
  public get active(): boolean {
    return this._active;
  }
  private set active(newValue: boolean) {
    this._active = newValue;
  }

  public readonly isAdmin: boolean;
  
  constructor(data: Partial<UserInterface>) {
    this.id = data?.id;
    this.name = data?.name;
    this.active = !this.id ? false : data?.active ?? false;
    this.isAdmin = data?.isAdmin ?? false;
  }

  public activate = (adminUser: User) => {
    if (!adminUser.isAdmin) {
      throw new ValidationError('Apenas usuários administradores podem ativar e desativar usuários');
    }
    this.active = true;
  };

  public deactivate = (adminUser: User) => {
    if (!adminUser.isAdmin) {
      throw new ValidationError('Apenas usuários administradores podem ativar e desativar usuários');
    }
    this.active = false;
  };
}
