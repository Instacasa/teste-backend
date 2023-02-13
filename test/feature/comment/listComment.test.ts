import CommentRepository from "@database/repositories/commentRepository";
import PostRepository from "@database/repositories/postRepository";
import UserRepository from "@database/repositories/userRepository";
import Comment from "@domains/comment";
import Post from "@domains/post";
import User from "@domains/user";
import CommentModel from "@models/commentModel";
import PostModel from "@models/postModel";
import UserModel from "@models/userModel";
import { CommentInterface, PostInterface, UserInterface } from "@types";
import httpStatus from "http-status";
import request from "../request";

describe("Comment", () => {
  beforeEach(async () => {
    const repository = new CommentRepository<CommentInterface, CommentModel>();
    await repository.deleteAll();
  });

  test("Should get comment by id", async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let postOwner: UserInterface = new User({ name: "Admin", isAdmin: true });
    postOwner.active = true;
    postOwner = await userRepository.create(postOwner);
    let user: UserInterface = new User({ name: "Admin", isAdmin: false });
    user.active = true;
    user = await userRepository.create(user);
    const postRepository = new PostRepository();
    let post: PostInterface = new Post({
      title: "Post",
      text: "Text text text",
      user: postOwner,
    });
    post = await postRepository.create(post);
    const commentRepository = new CommentRepository<
      CommentInterface,
      CommentModel
    >();
    const comment: CommentInterface = new Comment({
      text: "Text text text",
      user,
      post,
    });
    await commentRepository.create(comment);
    await commentRepository.create(comment);
    await commentRepository.create(comment);
    const { body } = await request()
      .get(`/posts/${post.id}/comments`)
      .expect(httpStatus.OK);

    expect(body).toHaveLength(3);
  });

  test("Shouldn't get inexistent comment", async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let postOwner: UserInterface = new User({ name: "Admin", isAdmin: true });
    postOwner.active = true;
    postOwner = await userRepository.create(postOwner);
    let user: UserInterface = new User({ name: "Admin", isAdmin: false });
    user.active = true;
    user = await userRepository.create(user);
    const postRepository = new PostRepository();
    let post: PostInterface = new Post({
      title: "Post",
      text: "Text text text",
      user: postOwner,
    });
    post = await postRepository.create(post);
    const { body } = await request()
      .get(`/posts/${post.id}/comments`)
      .expect(httpStatus.OK);
    expect(body).toHaveLength(0);
  });
});
