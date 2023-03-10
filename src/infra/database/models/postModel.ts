import { CommentInterface, PostInterface, UserInterface } from '@types';
import { Column, Entity, ManyToOne, ObjectLiteral, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import CommentModel from './commentModel';
import UserModel from './userModel';

@Entity({ name: 'post' })
class PostModel implements ObjectLiteral, PostInterface {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    title: string;

  @Column()
    text: string;
  
  @ManyToOne(() => UserModel, { eager: true })
    user: UserInterface;

  @OneToMany(() => CommentModel, comment => comment.post, { eager: true })
    comments?: CommentInterface[];

  constructor(data: PostInterface) {
    this.id = data?.id;
    this.title = data?.title;
    this.text = data?.text;
    this.user = data?.user;
  }

}

export default PostModel;