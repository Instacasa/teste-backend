import { Router } from 'express';
import { PostController } from '@controllers';

class PostRoute {
  router: Router;

  static instance: PostRoute;

  constructor() {
    this.createRouter();
  }

  createRouter = () => {
    const postController = new PostController();
    this.router = Router();
    this.router.get('/', postController.listPost.bind(postController));
    this.router.get('/user/:userId', postController.listPostByUser.bind(postController));
    this.router.get('/:id', postController.getPost.bind(postController));
    this.router.post('/user/:userId', postController.createPost.bind(postController));
    this.router.patch('/:id/user/:userId', postController.updatePost.bind(postController));
    this.router.delete('/:id/user/:userId', postController.deletePost.bind(postController));
    this.router.post(
      '/:id/user/:userId/category/:categoryId',
      postController.addCategory.bind(postController),
    );
    this.router.delete(
      '/:id/user/:userId/category/:categoryId',
      postController.removeCategory.bind(postController),
    );
    return this.router;
  };

  public static router = (): Router => {
    if (!PostRoute.instance) {
      PostRoute.instance = new PostRoute();
    }
    return PostRoute.instance.router;
  };
}

export default PostRoute;
