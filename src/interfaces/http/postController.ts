import CreatePost from '@/useCases/post/createPost';
import DeletePost from '@/useCases/post/deletePost';
import GetPost from '@/useCases/post/getPost';
import ListPost from '@/useCases/post/listPost';
import UpdatePost from '@/useCases/post/updatePost';
import { ValidationError } from '@libs/errors/validationError';
import { PostInterface } from '@types';
import { NextFunction, Router, Request, Response} from 'express';
import httpStatus from 'http-status';

class PostController {
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

  serialize = (post: PostInterface): PostInterface => {
    return {
      id: post.id,
      title: post.title,
      text: post.text,
      user: {id: post.user.id, name: post.user.name, active: post.user.active, isAdmin: post.user.isAdmin},
    };
  };

  getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new GetPost();
      const data = await useCase.execute(Number(req.params.id));
      res.status(httpStatus.OK).json(this.serialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  listPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new ListPost();
      const data = await useCase.execute();
      res.status(httpStatus.OK).json(data.map(this.serialize));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new CreatePost();
      const data = await useCase.execute(Number(req.params.userId), req.body);
      res.status(httpStatus.CREATED).json(this.serialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new UpdatePost();
      const data = await useCase.execute(Number(req.params.userId), Number(req.params.id), req.body);
      res.status(httpStatus.OK).json(this.serialize(data));
    } catch(error) {
      res.status((error as ValidationError).status).json({error: (error as ValidationError), message: (error as ValidationError).message});
    }
  };

  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const useCase = new DeletePost();
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

export default PostController;