import CreatePost from "@/useCases/post/createPost";
import DeletePost from "@/useCases/post/deletePost";
import GetPost from "@/useCases/post/getPost";
import ListPost from "@/useCases/post/listPost";
import UpdatePost from "@/useCases/post/updatePost";
import AddCategoryUseCase from "@/useCases/post/AddCategoryUseCase";
import RemoveCategoryUseCase from "@/useCases/post/RemoveCategoryUseCase";
import { ValidationError } from "@libs/errors/validationError";
import { PostInterface } from "@types";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import ListPostByUserUseCase from "@useCases/post/ListPostByUserUseCase";

class PostController {
  serialize = (post: PostInterface): PostInterface => {
    return {
      id: post.id,
      title: post.title,
      text: post.text,
      user: {
        id: post.user.id,
        name: post.user.name,
        active: post.user.active,
        isAdmin: post.user.isAdmin,
      },
      categories: post.categories,
    };
  };

  getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new GetPost();
      const data = await useCase.execute(Number(req.params.id));
      res.status(httpStatus.OK).json(this.serialize(data));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  listPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new ListPost();
      const data = await useCase.execute();
      res.status(httpStatus.OK).json(data.map(this.serialize));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  listPostByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new ListPostByUserUseCase();
      const data = await useCase.execute(Number(req.params.userId));
      res.status(httpStatus.OK).json(data.map(this.serialize));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new CreatePost();
      const data = await useCase.execute(Number(req.params.userId), req.body);
      res.status(httpStatus.CREATED).json(this.serialize(data));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new UpdatePost();
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

  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new DeletePost();
      await useCase.execute(Number(req.params.userId), Number(req.params.id));
      res.status(httpStatus.ACCEPTED).send();
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  addCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new AddCategoryUseCase();
      const data = await useCase.execute(
        Number(req.params.userId),
        Number(req.params.id),
        Number(req.params.categoryId)
      );
      res.status(httpStatus.OK).json(this.serialize(data));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  removeCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new RemoveCategoryUseCase();
      await useCase.execute(
        Number(req.params.userId),
        Number(req.params.id),
        Number(req.params.categoryId)
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

export default PostController;
