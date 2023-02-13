import { ApplicationRouter } from '@routes';
import MainRouter from '@libs/router';
import WebServer from '@libs/webServer';
import supertest from 'supertest';

const mainRouter = MainRouter.router();
const applicationRouter = ApplicationRouter.router();
mainRouter.use('/', applicationRouter);
const server = new WebServer(mainRouter);
export default (): supertest.SuperTest<supertest.Test> => supertest(server.express);
