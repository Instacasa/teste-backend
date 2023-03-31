export interface UserInterface {
  id?: number;
  name: string;
  active: boolean;
  isAdmin: boolean;
}

export interface PostInterface {
  id?: number;
  title: string;
  text: string;
  user?: UserInterface;
  comments?: CommentInterface[];
}

export interface CommentInterface {
  id?: number;
  text: string;
  post: PostInterface;
  user: UserInterface;
}

export interface CategoryInterface {
  id?: number;
  label: string;
}

export interface RepositoryInterface<Interface> {
  list: () => Promise<Interface[]>;
  get: (id: number) => Promise<Interface>;
  create: (data: Interface) => Promise<Interface>;
  update: (data: Interface) => Promise<Interface>;
  delete: (id: number) => Promise<void>;
  deleteAll: () => Promise<void>;
}