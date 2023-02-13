import { UserInterface } from '@types';
import { Column, Entity, ObjectLiteral, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
class UserModel implements ObjectLiteral, UserInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  active: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  constructor(data: UserInterface) {
    this.id = data?.id;
    this.name = data?.name;
    this.active = data?.active;
    this.isAdmin = data?.isAdmin;
  }
}

export default UserModel;
