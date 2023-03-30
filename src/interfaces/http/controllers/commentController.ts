import CreateComment from '@/useCases/comment/createComment';
import DeleteComment from '@/useCases/comment/deleteComment';
import GetComment from '@/useCases/comment/getComment';
import ListComment from '@/useCases/comment/listComment';
import UpdateComment from '@/useCases/comment/updateComment';
import { commentSerialize } from '@serializers';
import { ValidationError } from '@libs/errors/validationError';
import { NextFunction, Router, Request, Response} from 'express';
import httpStatus from 'http-status';

export class CommentController {
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

  getComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new GetComment();
      const data = await useCase.execute(Number(req.params.postId), Number(req.params.id));
      res.status(httpStatus.OK).json(commentSerialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  listComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new ListComment();
      const data = await useCase.execute(Number(req.params.postId));
      res.status(httpStatus.OK).json(data.map(commentSerialize));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new CreateComment();
      const data = await useCase.execute(Number(req.params.postId), Number(req.params.userId), req.body);
      res.status(httpStatus.CREATED).json(commentSerialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new UpdateComment();
      const data = await useCase.execute(Number(req.params.postId), Number(req.params.userId), Number(req.params.id), req.body);
      res.status(httpStatus.OK).json(commentSerialize(data));
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
