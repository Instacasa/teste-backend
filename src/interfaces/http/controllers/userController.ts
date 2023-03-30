import CreateUser from '@/useCases/user/createUser';
import DeleteUser from '@/useCases/user/deleteUser';
import GetUser from '@/useCases/user/getUser';
import ListUser from '@/useCases/user/listUser';
import UpdateUser from '@/useCases/user/updateUser';
import { ValidationError } from '@libs/errors/validationError';
import { UserInterface } from '@types';
import { NextFunction, Router, Request, Response} from 'express';
import httpStatus from 'http-status';

export class UserController {
  router: Router;

  static instance: UserController;

  constructor() {
    this.createRouter();
  }

  createRouter = () => {
    this.router = Router();
    this.router.get('/', this.listUser);
    this.router.get('/:id', this.getUser);
    this.router.post('/', this.createUser);
    this.router.patch('/:userId/edit/:id', this.updateUser);
    this.router.delete('/:userId/remove/:id', this.deleteUser);
    return this.router;
  };

  serialize = (user: UserInterface): UserInterface => {
    return {
      id: user.id,
      name: user.name,
      active: user.active,
      isAdmin: user.isAdmin,
    };
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new GetUser();
      const data = await useCase.execute(Number(req.params.id));
      res.status(httpStatus.OK).json(this.serialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  listUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new ListUser();
      const data = await useCase.execute();
      res.status(httpStatus.OK).json(data.map(this.serialize));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new CreateUser();
      const data = await useCase.execute(req.body);
      res.status(httpStatus.CREATED).json(this.serialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new UpdateUser();
      const data = await useCase.execute(Number(req.params.userId), Number(req.params.id), req.body);
      res.status(httpStatus.OK).json(this.serialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new DeleteUser();
      const data = await useCase.execute(Number(req.params.userId), Number(req.params.id));
      res.status(httpStatus.ACCEPTED).send();
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  public static router = (): Router => {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance.router;
  };
}