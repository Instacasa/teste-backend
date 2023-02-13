import CreateComment from "@/useCases/comment/createComment";
import DeleteComment from "@/useCases/comment/deleteComment";
import GetComment from "@/useCases/comment/getComment";
import CommentRepository from "@database/repositories/commentRepository";
import PostRepository from "@database/repositories/postRepository";
import UserRepository from "@database/repositories/userRepository";
import Post from "@domains/post";
import User from "@domains/user";

import { NotFoundError } from "@libs/errors/notFoundError";
import { ValidationError } from "@libs/errors/validationError";
import CommentModel from "@models/commentModel";
import PostModel from "@models/postModel";
import UserModel from "@models/userModel";
import { CommentInterface, PostInterface, UserInterface } from "@types";

describe("Delete Comment", () => {
  let user: UserInterface;
  let post: PostInterface;
  beforeAll(async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({ name: "user" });
    let user2: UserInterface = new User({ name: "user 2" });
    user.active = true;
    user2.active = true;
    user = await userRepository.create(user);
    user2 = await userRepository.create(user2);
    const postRepository = new PostRepository();
    post = await postRepository.create(
      new Post({ title: "Teste", text: "Text text text", user: user2 })
    );
  });

  beforeEach(async () => {
    const repository = new CommentRepository<CommentInterface, CommentModel>();
    await repository.deleteAll();
  });

  describe("User is admin", () => {
    test("Should delete comment if user is the owner", async () => {
      const createComment = new CreateComment();
      const deleteComment = new DeleteComment();
      const getComment = new GetComment();
      const partialComment: Partial<CommentInterface> = {
        text: "Text text text",
        user,
        post,
      };
      const comment = await createComment.execute(
        post.id,
        user.id,
        partialComment
      );
      await deleteComment.execute(post.id, user.id, comment.id);

      try {
        await getComment.execute(post.id, comment.id);
      } catch (error) {
        expect(error as Error).toBeInstanceOf(NotFoundError);
        expect((error as Error).message).toEqual(
          `comment with id ${comment.id} can't be found.`
        );
      }
    });

    test("Should delete comment if user is the admin", async () => {
      const userRepository = new UserRepository<UserInterface, UserModel>();
      const admin = await userRepository.create(
        new User({ name: "Admin", isAdmin: true })
      );
      const createComment = new CreateComment();
      const deleteComment = new DeleteComment();
      const getComment = new GetComment();
      const partialComment: Partial<CommentInterface> = {
        text: "Text text text",
        user,
        post,
      };
      const comment = await createComment.execute(
        post.id,
        user.id,
        partialComment
      );
      await deleteComment.execute(post.id, admin.id, comment.id);

      try {
        await getComment.execute(post.id, comment.id);
      } catch (error) {
        expect(error as Error).toBeInstanceOf(NotFoundError);
        expect((error as Error).message).toEqual(
          `comment with id ${comment.id} can't be found.`
        );
      }
    });

    test("Shouldn't delete inexistent comment", async () => {
      const deleteComment = new DeleteComment();
      try {
        await deleteComment.execute(post.id, user.id, 0);
      } catch (error) {
        expect(error as Error).toBeInstanceOf(NotFoundError);
        expect((error as Error).message).toEqual(
          "comment with id 0 can't be found."
        );
      }
    });

    test("Shouldn't delete comment id user is not admin neither ", async () => {
      const userRepository = new UserRepository<UserInterface, UserModel>();
      const admin = await userRepository.create(
        new User({ name: "Admin", isAdmin: true })
      );
      const createComment = new CreateComment();
      const deleteComment = new DeleteComment();
      const getComment = new GetComment();
      const partialComment: Partial<CommentInterface> = {
        text: "Text text text",
        user,
        post,
      };
      const comment = await createComment.execute(
        post.id,
        user.id,
        partialComment
      );
      try {
        await deleteComment.execute(post.id, admin.id, comment.id);
      } catch (error) {
        expect(error as Error).toBeInstanceOf(ValidationError);
        expect((error as Error).message).toEqual(
          "Apenas o autor ou administradores podem excluir comentários"
        );
      }
    });
  });
});
