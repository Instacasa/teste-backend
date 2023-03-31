import { ValidationError } from '@errors';
import { categorySerialize } from '@serializers';
import { CreateCategoryUseCase, UpdateCategoryUseCase } from '@useCases';
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
    // this.router.get('/', this.listCategory);
    // this.router.get('/:id', this.getPost);
    this.router.post('/user/:userId', this.createCategory);
    this.router.patch('/:id/user/:userId', this.updateCategory);
    // this.router.delete('/:id/user/:userId', this.deletePost);
    return this.router;
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

  public static router = (): Router => {
    if (!CategoryController.instance) {
      CategoryController.instance = new CategoryController();
    }
    return CategoryController.instance.router;
  };
}