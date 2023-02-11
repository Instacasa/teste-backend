import { Router } from "express";
import { CategoryController } from "@controllers";

class CategoryRoute {
  router: Router;

  static instance: CategoryRoute;

  constructor() {
    this.createRouter();
  }

  createRouter = () => {
    const categoryController = new CategoryController();
    this.router = Router();
    this.router.get(
      "/",
      categoryController.listCategory.bind(categoryController)
    );
    this.router.get(
      "/:id",
      categoryController.getCategory.bind(categoryController)
    );
    this.router.post(
      "/:userId",
      categoryController.createCategory.bind(categoryController)
    );
    this.router.patch(
      "/:userId/edit/:id",
      categoryController.updateCategory.bind(categoryController)
    );
    this.router.delete(
      "/:userId/remove/:id",
      categoryController.deleteCategory.bind(categoryController)
    );
    return this.router;
  };

  public static router = (): Router => {
    if (!CategoryRoute.instance) {
      CategoryRoute.instance = new CategoryRoute();
    }
    return CategoryRoute.instance.router;
  };
}

export default CategoryRoute;
