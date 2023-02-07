import CreateComment from '@/useCases/comment/createComment';
import DeleteComment from '@/useCases/comment/deleteComment';
import GetComment from '@/useCases/comment/getComment';
import ListComment from '@/useCases/comment/listComment';
import UpdateComment from '@/useCases/comment/updateComment';
import { ValidationError } from '@libs/errors/validationError';
import { CommentInterface } from '@types';
import { NextFunction, Router, Request, Response} from 'express';
import httpStatus from 'http-status';

class CommentController {
  router: Router;

  static instance: CommentController;

  constructor() {
    this.createRouter();
  }

  createRouter = () => {
    this.router = Router();
    this.router.get('/:postId/comments', this.listComment);
    this.router.get('/:postId/comments/:id', this.getComment);
    this.router.post('/:postId/comments/user/:userId', this.createComment);
    this.router.patch('/:postId/comments/:id/user/:userId', this.updateComment);
    this.router.delete('/:postId/comments/:id/user/:userId', this.deleteComment);
    return this.router;
  };

  serialize = (comment: Partial<CommentInterface>): Partial<CommentInterface> => {
    return {
      id: comment.id,
      text: comment.text
    };
  };

  getComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new GetComment();
      const data = await useCase.execute(Number(req.params.postId), Number(req.params.id));
      res.status(httpStatus.OK).json(this.serialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  listComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new ListComment();
      const data = await useCase.execute(Number(req.params.postId));
      res.status(httpStatus.OK).json(data.map(this.serialize));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new CreateComment();
      const data = await useCase.execute(Number(req.params.postId), Number(req.params.userId), req.body);
      res.status(httpStatus.CREATED).json(this.serialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new UpdateComment();
      const data = await useCase.execute(Number(req.params.postId), Number(req.params.userId), Number(req.params.id), req.body);
      res.status(httpStatus.OK).json(this.serialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new DeleteComment();
      const data = await useCase.execute(Number(req.params.postId), Number(req.params.userId), Number(req.params.id));
      res.status(httpStatus.ACCEPTED).send();
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  public static router = (): Router => {
    if (!CommentController.instance) {
      CommentController.instance = new CommentController();
    }
    return CommentController.instance.router;
  };
}

export default CommentController;