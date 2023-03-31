import { Router } from 'express';
import { CommentController, PostController, UserController, CategoryController } from '@controllers';

class ApplicationRouter {
  router: Router;

  static instance: ApplicationRouter;

  constructor () {
    this.router = Router();
    this.router.use('/users', UserController.router());
    this.router.use('/posts', PostController.router());
    this.router.use('/posts', CommentController.router());
    this.router.use('/categories', CategoryController.router());
  }

  public static router = (): Router => {
    if (!ApplicationRouter.instance) {
      ApplicationRouter.instance = new ApplicationRouter();
    }
    return ApplicationRouter.instance.router;
  };
}

export default ApplicationRouter;