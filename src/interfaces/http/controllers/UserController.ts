import CreateUser from '@/useCases/user/createUser';
import DeleteUser from '@/useCases/user/deleteUser';
import GetUser from '@/useCases/user/getUser';
import ListUser from '@/useCases/user/listUser';
import UpdateUser from '@/useCases/user/updateUser';
import UserRepository from '@database/repositories/userRepository';
import User from '@domains/user';
import { ValidationError } from '@libs/errors/validationError';
import UserModel from '@models/userModel';
import { UserInterface } from '@types';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

class UserController {
  constructor() {
    const user: UserInterface = new User({ name: 'Test', isAdmin: true });
    const userRepository = new UserRepository<UserInterface, UserModel>();
    userRepository.create(user);
  }

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
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  public listUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new ListUser();
      const data = await useCase.execute();
      res.status(httpStatus.OK).json(data.map(this.serialize));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new CreateUser();
      const data = await useCase.execute(req.body);
      res.status(httpStatus.CREATED).json(this.serialize(data));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new UpdateUser();
      const data = await useCase.execute(
        Number(req.params.userId),
        Number(req.params.id),
        req.body,
      );
      res.status(httpStatus.OK).json(this.serialize(data));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new DeleteUser();
      const data = await useCase.execute(Number(req.params.userId), Number(req.params.id));
      res.status(httpStatus.ACCEPTED).send();
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };
}

export default UserController;
