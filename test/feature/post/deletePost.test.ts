import PostRepository from "@database/repositories/postRepository";
import UserRepository from "@database/repositories/userRepository";
import Post from "@domains/post";
import User from "@domains/user";
import PostModel from "@models/postModel";
import UserModel from "@models/userModel";
import { PostInterface, UserInterface } from "@types";
import httpStatus from "http-status";
import request from "../request";

describe("Post", () => {
  beforeEach(async () => {
    const repository = new PostRepository();
    await repository.deleteAll();
  });

  test("Should delete post by admins", async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let admin: UserInterface = new User({ name: "Admin", isAdmin: true });
    admin.active = true;
    admin = await userRepository.create(admin);
    let user: UserInterface = new User({ name: "Admin", isAdmin: true });
    user.active = true;
    user = await userRepository.create(user);
    const postRepository = new PostRepository();
    let post: PostInterface = new Post({
      title: "Post",
      text: "Text text text",
      user,
    });
    post = await postRepository.create(post);
    const { body } = await request()
      .delete(`/posts/${post.id}/user/${admin.id}`)
      .expect(httpStatus.ACCEPTED);
  });

  test("Should delete post by owner", async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let user: UserInterface = new User({ name: "Admin", isAdmin: true });
    user.active = true;
    user = await userRepository.create(user);
    const postRepository = new PostRepository();
    let post: PostInterface = new Post({
      title: "Post",
      text: "Text text text",
      user,
    });
    post = await postRepository.create(post);
    const { body } = await request()
      .delete(`/posts/${post.id}/user/${user.id}`)
      .expect(httpStatus.ACCEPTED);
  });

  test("Shouldn't delete inexistent post", async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let user: UserInterface = new User({ name: "Admin", isAdmin: true });
    user.active = true;
    user = await userRepository.create(user);
    const { body } = await request()
      .delete(`/posts/0/user/${user.id}`)
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual("NotFoundError");
  });

  test("Shouldn't allow to delete post without been an admin or owner", async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let admin: UserInterface = new User({ name: "Admin", isAdmin: true });
    admin.active = true;
    admin = await userRepository.create(admin);
    let user: UserInterface = new User({ name: "Admin", isAdmin: false });
    user.active = true;
    user = await userRepository.create(user);
    const postRepository = new PostRepository();
    let post: PostInterface = new Post({
      title: "Post",
      text: "Text text text",
      user: admin,
    });
    post = await postRepository.create(post);
    const { body } = await request()
      .delete(`/posts/${post.id}/user/${user.id}`)
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual("ValidationError");
  });
});
