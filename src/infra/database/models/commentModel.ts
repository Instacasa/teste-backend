import { CommentInterface, PostInterface, UserInterface } from '@types';
import { Column, Entity, ManyToOne, ObjectLiteral, PrimaryGeneratedColumn } from 'typeorm';
import { PostModel, UserModel } from '@models';

@Entity({ name: 'comment' })
export class CommentModel implements ObjectLiteral, CommentInterface {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    text: string;

  @ManyToOne(() => PostModel, post => post.comments)
    post: PostInterface;

  @ManyToOne(() => UserModel, { eager: true })
    user: UserInterface;

  constructor(data: CommentInterface) {
    this.id = data?.id;
    this.text = data?.text;
    this.user = data?.user;
    this.post = data?.post;
  }
}