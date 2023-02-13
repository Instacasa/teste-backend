import { ValidationError } from '@libs/errors/validationError';
import { CategoryInterface, CommentInterface, PostInterface, UserInterface } from '@types';
import Category from './category';
import Comment from './comment';
import User from './user';

class Post implements PostInterface {
  private _id?: number;
  public get id(): number | undefined {
    return this._id;
  }
  public set id(newValue: number | undefined) {
    this._id = newValue;
  }

  private _title: string;
  public get title(): string {
    return this._title;
  }
  public set title(newValue: string) {
    if (!newValue || !newValue.trim()) {
      throw new ValidationError('O título da publicação é obrigatório');
    }
    this._title = newValue;
  }

  private _text: string;
  public get text(): string {
    return this._text;
  }
  public set text(newValue: string) {
    if (!newValue || !newValue.trim()) {
      throw new ValidationError('O texto da publicação é obrigatório');
    }
    this._text = newValue;
  }

  private _user: UserInterface;
  public get user(): UserInterface {
    return this._user;
  }
  public set user(newValue: UserInterface) {
    if (!newValue) {
      throw new ValidationError('O autor da publicação é obrigatório');
    }
    this._user = new User(newValue);
  }
  comments?: CommentInterface[];
  categories?: CategoryInterface[];

  constructor(data: Partial<PostInterface>) {
    this._id = data.id;
    this.title = data.title;
    this.text = data.text;
    this.user = data.user;
    this.comments = data.comments ? data.comments.map((comment) => new Comment(comment)) : [];
    this.categories = data.categories
      ? data.categories.map((category) => new Category(category))
      : [];
  }
}

export default Post;
