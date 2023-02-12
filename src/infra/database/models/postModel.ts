import {
  CategoryInterface,
  CommentInterface,
  PostInterface,
  UserInterface,
} from "@types";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  ObjectLiteral,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import CategoryModel from "./categoryModel";
import CommentModel from "./commentModel";
import UserModel from "./userModel";

@Entity({ name: "post" })
class PostModel implements ObjectLiteral, PostInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @ManyToOne(() => UserModel, { eager: true })
  user: UserInterface;

  @OneToMany(() => CommentModel, (comment) => comment.post, { eager: true })
  comments?: CommentInterface[];

  @ManyToMany(() => CategoryModel, {
    eager: true,
  })
  @JoinTable()
  categories?: CategoryInterface[];

  constructor(data: PostInterface) {
    this.id = data?.id;
    this.title = data?.title;
    this.text = data?.text;
    this.user = data?.user;
    this.categories = data?.categories;
  }
}

export default PostModel;
