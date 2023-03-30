import { userSerialize } from '@serializers';
import { ValidationError } from '@libs/errors/validationError';
import { NextFunction, Router, Request, Response} from 'express';
import httpStatus from 'http-status';
import { CreateUserUseCase, DeleteUserUseCase, GetUserUseCase, ListUserUseCase, UpdateUserUseCase } from '@useCases';

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

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new GetUserUseCase();
      const data = await useCase.execute(Number(req.params.id));
      res.status(httpStatus.OK).json(userSerialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  listUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new ListUserUseCase();
      const data = await useCase.execute();
      res.status(httpStatus.OK).json(data.map(userSerialize));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new CreateUserUseCase();
      const data = await useCase.execute(req.body);
      res.status(httpStatus.CREATED).json(userSerialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new UpdateUserUseCase();
      const data = await useCase.execute(Number(req.params.userId), Number(req.params.id), req.body);
      res.status(httpStatus.OK).json(userSerialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new DeleteUserUseCase();
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