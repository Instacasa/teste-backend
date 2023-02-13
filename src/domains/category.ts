import { ValidationError } from '@libs/errors/validationError';
import { CategoryInterface } from '@types';

class Category implements CategoryInterface {
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
      throw new ValidationError('O nome da categoria é obrigatório');
    }
    this._label = newValue;
  }

  constructor(data: Partial<CategoryInterface>) {
    this.id = data?.id;
    this.label = data?.label;
  }
}

export default Category;
