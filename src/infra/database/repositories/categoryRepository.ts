import CategoryModel from "@models/categoryModel";
import Category from "@/domains/category";
import BaseRepository from "./baseRepository";

class CategoryRepository<
  CategoryInterface,
  CategoryModel
> extends BaseRepository<CategoryInterface, CategoryModel> {
  constructor() {
    super(CategoryModel, Category);
  }
}

export default CategoryRepository;
