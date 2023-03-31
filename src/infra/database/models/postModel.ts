import { CategoryInterface, CommentInterface, PostInterface, UserInterface } from '@types';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, ObjectLiteral, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryModel, CommentModel, UserModel } from '@models';

@Entity({ name: 'post' })
export class PostModel implements ObjectLiteral, PostInterface {
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

  @ManyToMany(() => CategoryModel, { eager: true })
  @JoinTable({
    name: 'post_categories',
    joinColumns: [{ name: 'post_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'category_id', referencedColumnName: 'id' }],
  })
    categories?: CategoryInterface[];

  constructor(data: PostInterface) {
    this.id = data?.id;
    this.title = data?.title;
    this.text = data?.text;
    this.user = data?.user;
  }

}