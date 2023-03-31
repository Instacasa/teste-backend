import { ValidationError } from '@errors';
import { categorySerialize } from '@serializers';
import { CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoryUseCase, ListCategoryUseCase, UpdateCategoryUseCase } from '@useCases';
import { NextFunction, Router, Request, Response } from 'express';
import httpStatus from 'http-status';

export class CategoryController {
  router: Router;

  static instance: CategoryController;

  constructor() {
    this.createRouter();
  }

  createRouter = () => {
    this.router = Router();
    this.router.get('/', this.listCategory);
    this.router.get('/:id', this.getCategory);
    this.router.post('/user/:userId', this.createCategory);
    this.router.patch('/:id/user/:userId', this.updateCategory);
    this.router.delete('/:id/user/:userId', this.deleteCategory);
    return this.router;
  };

  listCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new ListCategoryUseCase();
      const data = await useCase.execute();
      res.status(httpStatus.OK).json(data.map(categorySerialize));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new GetCategoryUseCase();
      const data = await useCase.execute(Number(req.params.id));
      res.status(httpStatus.OK).json(categorySerialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new CreateCategoryUseCase();
      const data = await useCase.execute(Number(req.params.userId), req.body);
      res.status(httpStatus.CREATED).json(categorySerialize(data));
    } catch (error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new UpdateCategoryUseCase();
      const data = await useCase.execute(Number(req.params.userId), Number(req.params.id), req.body);
      res.status(httpStatus.OK).json(categorySerialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new DeleteCategoryUseCase();
      await useCase.execute(Number(req.params.userId), Number(req.params.id));
      res.status(httpStatus.ACCEPTED).send();
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  public static router = (): Router => {
    if (!CategoryController.instance) {
      CategoryController.instance = new CategoryController();
    }
    return CategoryController.instance.router;
  };
}