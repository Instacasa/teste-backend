import { CategoryModel } from '@models';
import { BaseRepository } from './baseRepository';

export class CategoryRepository<CategoryInterface, CategoryModel> extends BaseRepository<CategoryInterface, CategoryModel>{
  constructor() {
    super(CategoryModel, Comment);
  }
}