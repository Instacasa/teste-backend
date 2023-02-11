import { Router } from "express";
import { UserController } from "@controllers";

class UserRoute {
  router: Router;

  static instance: UserRoute;

  constructor() {
    this.createRouter();
  }

  createRouter = () => {
    const userController = new UserController();
    this.router = Router();
    this.router.get("/", userController.listUser.bind(userController));
    this.router.get("/:id", userController.getUser.bind(userController));
    this.router.post("/", userController.createUser.bind(userController));
    this.router.patch(
      "/:userId/edit/:id",
      userController.updateUser.bind(userController)
    );
    this.router.delete(
      "/:userId/remove/:id",
      userController.deleteUser.bind(userController)
    );
    return this.router;
  };

  public static router = (): Router => {
    if (!UserRoute.instance) {
      UserRoute.instance = new UserRoute();
    }
    return UserRoute.instance.router;
  };
}

export default UserRoute;
