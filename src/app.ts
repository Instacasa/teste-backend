import ApplicationRouter from '@interfacesHttp/router';
import MainRouter from '@libs/router';
import WebServer from '@libs/webServer';
import connection from '@libs/database';

class Application {
  public webServer: WebServer;

  constructor() {
    const mainRouter = MainRouter.router();
    const applicationRouter = ApplicationRouter.router();
    mainRouter.use('/', applicationRouter);
    this.webServer = new WebServer(mainRouter);
  }

  public start = async (): Promise<void> => {
    await connection;
    await this.webServer.start();
  };

}

export default Application;
