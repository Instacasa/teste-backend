import { ValidationError } from '@libs/errors';
import { CategoryInterface } from '@types';

export class Category implements CategoryInterface {
  private _id?: number;
  public get id(): number | undefined {
    return this._id;
  }
  public set id(newValue: number | undefined) {
    this._id = newValue;
  }

  private _label: string;
  public get label(): string {
    return this._label;
  }
  public set label(newValue: string) {
    if (!newValue || !newValue.trim()) {
      throw new ValidationError('O rótulo da categoria é obrigatório');
    }
    this._label = newValue;
  }

  constructor(data: Partial<CategoryInterface>) {
    this._id = data.id;
    this.label = data.label;
  }
}