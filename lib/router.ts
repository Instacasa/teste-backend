import { Router } from 'express';

class MainRouter {
  router: Router;

  static instance: MainRouter;

  constructor() {
    this.router = Router();
  }

  public static router = (): Router => {
    if (!MainRouter.instance) {
      MainRouter.instance = new MainRouter();
    }
    return MainRouter.instance.router;
  };
}

export default MainRouter;