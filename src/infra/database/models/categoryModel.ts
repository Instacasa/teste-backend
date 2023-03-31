import { CategoryInterface } from '@types';
import { Column, Entity, ObjectLiteral, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'category' })
export class CategoryModel implements ObjectLiteral, CategoryInterface {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    label: string;
  
  constructor(data: CategoryInterface) {
    this.id = data?.id;
    this.label = data?.label;
  }
}