import { ValidationError } from '@libs/errors/validationError';
import { CommentInterface, PostInterface, UserInterface } from '@types';
import { Post, User } from '@domains';

export class Comment implements CommentInterface {
  
  private _id?: number;
  public get id(): number | undefined {
    return this._id;
  }
  public set id(newValue: number | undefined) {
    this._id = newValue;
  }

  private _text: string;
  public get text(): string {
    return this._text;
  }
  public set text(newValue: string) {
    if (!newValue || !newValue.trim()) {
      throw new ValidationError('O texto do comentário é obrigatório');
    }
    this._text = newValue;
  }

  private _user: UserInterface;
  public get user(): UserInterface {
    return this._user;
  }
  public set user(newValue: UserInterface) {
    if (!newValue) {
      throw new ValidationError('O autor do comentário é obrigatório');
    }
    this._user = new User(newValue);
  }

  private _post?: PostInterface;
  public get post(): PostInterface | undefined {
    return this._post;
  }
  public set post(newValue: PostInterface) {
    if (!newValue) {
      return;
    }
    this._post = new Post(newValue);
  }
  
  constructor(data: Partial<CommentInterface>) {
    this.id = data.id;
    this.text = data.text;
    this.user = data.user;
    this.post = data.post;
  }
}