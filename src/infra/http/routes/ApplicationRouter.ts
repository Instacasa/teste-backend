import { Router } from "express";
import CommentRoute from "./CommentRoute";
import PostRoute from "./PostRoute";
import UserRoute from "./UserRoute";

class ApplicationRouter {
  router: Router;

  static instance: ApplicationRouter;

  constructor() {
    this.router = Router();
    this.router.use("/users", UserRoute.router());
    this.router.use("/posts", PostRoute.router());
    this.router.use("/posts", CommentRoute.router());
  }

  public static router = (): Router => {
    if (!ApplicationRouter.instance) {
      ApplicationRouter.instance = new ApplicationRouter();
    }
    return ApplicationRouter.instance.router;
  };
}

export default ApplicationRouter;
