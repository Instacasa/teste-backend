import CreateComment from '@/useCases/comment/createComment';
import DeleteComment from '@/useCases/comment/deleteComment';
import GetComment from '@/useCases/comment/getComment';
import ListComment from '@/useCases/comment/listComment';
import UpdateComment from '@/useCases/comment/updateComment';
import { ValidationError } from '@libs/errors/validationError';
import { CommentInterface } from '@types';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

class CommentController {
  serialize = (comment: Partial<CommentInterface>): Partial<CommentInterface> => {
    return {
      id: comment.id,
      text: comment.text,
    };
  };

  getComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new GetComment();
      const data = await useCase.execute(Number(req.params.postId), Number(req.params.id));
      res.status(httpStatus.OK).json(this.serialize(data));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  listComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new ListComment();
      const data = await useCase.execute(Number(req.params.postId));
      res.status(httpStatus.OK).json(data.map(this.serialize));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new CreateComment();
      const data = await useCase.execute(
        Number(req.params.postId),
        Number(req.params.userId),
        req.body,
      );
      res.status(httpStatus.CREATED).json(this.serialize(data));
    } catch (error) {
      res.status((error as ValidationError).status).json({
        error: error as ValidationError,
        message: (error as ValidationError).message,
      });
    }
  };

  updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new UpdateComment();
      const data = await useCase.execute(
        Number(req.params.postId),
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

  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new DeleteComment();
      const data = await useCase.execute(
        Number(req.params.postId),
        Number(req.params.userId),
        Number(req.params.id),
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

export default CommentController;
