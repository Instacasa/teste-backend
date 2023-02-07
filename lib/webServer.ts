import config from '@config';
import express, { Express, Router } from 'express';

class WebServer {
  express: Express;
  constructor(router: Router) {
    this.express = express();
    this.express.use(express.json());
    this.express.use('/', router);
  }

  start = async (): Promise<void> => {
    this.express.listen(config.web.port, () => {
      console.info(`Listening at port ${config.web.port}`);
    });
  };
}

export default WebServer;