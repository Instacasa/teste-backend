import { ValidationError } from '@errors';
import { postSerialize } from '@serializers'; 
import { CreatePostUseCase, DeletePostUseCase, GetPostUseCase, ListPostUseCase, UpdatePostUseCase } from '@useCases';
import { NextFunction, Router, Request, Response} from 'express';
import httpStatus from 'http-status';

export class PostController {
  router: Router;

  static instance: PostController;

  constructor() {
    this.createRouter();
  }

  createRouter = () => {
    this.router = Router();
    this.router.get('/', this.listPost);
    this.router.get('/:id', this.getPost);
    this.router.post('/user/:userId', this.createPost);
    this.router.patch('/:id/user/:userId', this.updatePost);
    this.router.delete('/:id/user/:userId', this.deletePost);
    return this.router;
  };

  getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new GetPostUseCase();
      const data = await useCase.execute(Number(req.params.id));
      res.status(httpStatus.OK).json(postSerialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  listPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new ListPostUseCase();
      const data = await useCase.execute();
      res.status(httpStatus.OK).json(data.map(postSerialize));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new CreatePostUseCase();
      const data = await useCase.execute(Number(req.params.userId), req.body);
      res.status(httpStatus.CREATED).json(postSerialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new UpdatePostUseCase();
      const data = await useCase.execute(Number(req.params.userId), Number(req.params.id), req.body);
      res.status(httpStatus.OK).json(postSerialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new DeletePostUseCase();
      await useCase.execute(Number(req.params.userId), Number(req.params.id));
      res.status(httpStatus.ACCEPTED).send();
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  public static router = (): Router => {
    if (!PostController.instance) {
      PostController.instance = new PostController();
    }
    return PostController.instance.router;
  };
}
