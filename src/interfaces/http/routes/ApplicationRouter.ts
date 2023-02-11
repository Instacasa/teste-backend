import { Router } from "express";
import CommentRoute from "./CommentRoute";
import PostRoute from "./PostRoute";
import UserRoute from "./UserRoute";
import CategoryRoute from "./CategoryRoute";

class ApplicationRouter {
  router: Router;

  static instance: ApplicationRouter;

  constructor() {
    this.router = Router();
    this.router.use("/users", UserRoute.router());
    this.router.use("/posts", PostRoute.router());
    this.router.use("/posts", CommentRoute.router());
    this.router.use("/categories", CategoryRoute.router());
  }

  public static router = (): Router => {
    if (!ApplicationRouter.instance) {
      ApplicationRouter.instance = new ApplicationRouter();
    }
    return ApplicationRouter.instance.router;
  };
}

export default ApplicationRouter;
