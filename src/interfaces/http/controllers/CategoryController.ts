import {
  GetCategoryUseCase,
  ListCategoryUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from "@useCases/category";
import { ValidationError } from "@libs/errors/validationError";
import { CategoryInterface } from "@types";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

class CategoryController {
  serialize = (category: CategoryInterface): CategoryInterface => {
    return {
      id: category.id,
      label: category.label,
    };
  };

  getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new GetCategoryUseCase();
      const data = await useCase.execute(Number(req.params.id));
      res.status(httpStatus.OK).json(this.serialize(data));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  public listCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const useCase = new ListCategoryUseCase();
      const data = await useCase.execute();
      res.status(httpStatus.OK).json(data.map(this.serialize));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new CreateCategoryUseCase();
      const data = await useCase.execute(Number(req.params.userId), req.body);
      res.status(httpStatus.CREATED).json(this.serialize(data));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new UpdateCategoryUseCase();
      const data = await useCase.execute(
        Number(req.params.userId),
        Number(req.params.id),
        req.body
      );
      res.status(httpStatus.OK).json(this.serialize(data));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new DeleteCategoryUseCase();
      const data = await useCase.execute(
        Number(req.params.userId),
        Number(req.params.id)
      );
      res.status(httpStatus.ACCEPTED).send();
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };
}

export default CategoryController;
