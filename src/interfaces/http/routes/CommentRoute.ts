import { Router } from "express";
import { CommentController } from "@controllers";

class CommentRoute {
  router: Router;

  static instance: CommentRoute;

  constructor() {
    this.createRouter();
  }

  createRouter = () => {
    const commentController = new CommentController();
    this.router = Router();
    this.router.get(
      "/:postId/comments",
      commentController.listComment.bind(commentController)
    );
    this.router.get(
      "/:postId/comments/:id",
      commentController.getComment.bind(commentController)
    );
    this.router.post(
      "/:postId/comments/user/:userId",
      commentController.createComment.bind(commentController)
    );
    this.router.patch(
      "/:postId/comments/:id/user/:userId",
      commentController.updateComment.bind(commentController)
    );
    this.router.delete(
      "/:postId/comments/:id/user/:userId",
      commentController.deleteComment.bind(commentController)
    );
    return this.router;
  };

  public static router = (): Router => {
    if (!CommentRoute.instance) {
      CommentRoute.instance = new CommentRoute();
    }
    return CommentRoute.instance.router;
  };
}

export default CommentRoute;
