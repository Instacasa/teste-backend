import CreateComment from "@/useCases/comment/createComment";
import ListComment from "@/useCases/comment/listComment";
import CommentRepository from "@database/repositories/commentRepository";
import PostRepository from "@database/repositories/postRepository";
import UserRepository from "@database/repositories/userRepository";
import Post from "@domains/post";
import User from "@domains/user";
import CommentModel from "@models/commentModel";
import PostModel from "@models/postModel";
import UserModel from "@models/userModel";
import { CommentInterface, PostInterface, UserInterface } from "@types";

describe("List Comment", () => {
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

  test("Should list comment", async () => {
    const createComment = new CreateComment();
    const listComment = new ListComment();
    const partialComment: Partial<CommentInterface> = {
      text: "Text text text",
      user,
      post,
    };
    const comment1 = await createComment.execute(
      post.id,
      user.id,
      partialComment
    );
    const comment2 = await createComment.execute(post.id, user.id, {
      ...partialComment,
      text: "Teste 2",
    });
    const listedComment = await listComment.execute(post.id);
    expect(listedComment).toHaveLength(2);
  });
});
