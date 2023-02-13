import CommentModel from "@models/commentModel";
import CommentRepository from "@database/repositories/commentRepository";
import Comment from "@/domains/comment";
import { CommentInterface, PostInterface, UserInterface } from "@types";
import { NotFoundError } from "@libs/errors/notFoundError";
import UserRepository from "@database/repositories/userRepository";
import UserModel from "@models/userModel";
import User from "@domains/user";
import Post from "@domains/post";
import PostRepository from "@database/repositories/postRepository";
import PostModel from "@models/postModel";

describe("Comment Repository", () => {
  beforeEach(async () => {
    const repository = new CommentRepository<CommentInterface, CommentModel>();
    await repository.deleteAll();
  });

  test("Should create new element on database", async () => {
    let user: UserInterface = new User({ name: "Test", isAdmin: true });
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = await userRepository.create(user);

    let post: PostInterface = new Post({
      title: "Test",
      text: "text test",
      user,
    });
    const postRepository = new PostRepository();
    post = await postRepository.create(post);

    const comment = new Comment({ text: "text test", user, post });
    const repository = new CommentRepository<CommentInterface, CommentModel>();

    const newComment = await repository.create(comment);
    expect(newComment.id).toBeDefined();
    expect(newComment.id).toBeGreaterThan(0);
    expect(newComment.text).toEqual(comment.text);
    expect(newComment.user.id).toEqual(user.id);
    expect(newComment.post.id).toEqual(post.id);
  });

  test("Should update elemente on database", async () => {
    let user: UserInterface = new User({ name: "Test", isAdmin: true });
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = await userRepository.create(user);

    let post: PostInterface = new Post({
      title: "Test",
      text: "text test",
      user,
    });
    const postRepository = new PostRepository();
    post = await postRepository.create(post);

    let comment: CommentInterface = new Comment({
      text: "text test",
      user,
      post,
    });

    const repository = new CommentRepository<CommentInterface, CommentModel>();
    comment = await repository.create(comment);
    comment.text = "Updated text";
    const udpatedComment = await repository.update(comment);

    expect(udpatedComment.id).toBeDefined();
    expect(udpatedComment.id).toBeGreaterThan(0);
    expect(udpatedComment.text).toEqual("Updated text");
  });

  test("Should get comment by id", async () => {
    let user: UserInterface = new User({ name: "Test", isAdmin: true });
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = await userRepository.create(user);

    let post: PostInterface = new Post({
      title: "Test",
      text: "text test",
      user,
    });
    const postRepository = new PostRepository();
    post = await postRepository.create(post);

    let comment: CommentInterface = new Comment({
      text: "text test",
      user,
      post,
    });

    const repository = new CommentRepository<CommentInterface, CommentModel>();
    comment = await repository.create(comment);
    const persistedComment = await repository.get(comment.id);
    expect(persistedComment.id).toEqual(comment.id);
    expect(persistedComment.text).toEqual(comment.text);
  });

  test("Should get list of comment", async () => {
    let user: UserInterface = new User({ name: "Test", isAdmin: true });
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = await userRepository.create(user);

    let post: PostInterface = new Post({
      title: "Test",
      text: "text test",
      user,
    });
    const postRepository = new PostRepository();
    post = await postRepository.create(post);

    let comment1: CommentInterface = new Comment({
      text: "text test",
      user,
      post,
    });
    let comment2: CommentInterface = new Comment({
      text: "text test",
      user,
      post,
    });
    let comment3: CommentInterface = new Comment({
      text: "text test",
      user,
      post,
    });

    const repository = new CommentRepository<CommentInterface, CommentModel>();
    comment1 = await repository.create(comment1);
    comment2 = await repository.create(comment2);
    comment3 = await repository.create(comment3);
    const persistedComment = await repository.list();
    expect(persistedComment).toHaveLength(3);
    expect(persistedComment[0].text).toEqual(comment3.text);
  });

  test("Should delete a comment", async () => {
    let user: UserInterface = new User({ name: "Test", isAdmin: true });
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = await userRepository.create(user);

    let post: PostInterface = new Post({
      title: "Test",
      text: "text test",
      user,
    });
    const postRepository = new PostRepository();
    post = await postRepository.create(post);

    let comment1: CommentInterface = new Comment({
      text: "text test",
      user,
      post,
    });
    let comment2: CommentInterface = new Comment({
      text: "text test",
      user,
      post,
    });
    let comment3: CommentInterface = new Comment({
      text: "text test",
      user,
      post,
    });

    const repository = new CommentRepository<CommentInterface, CommentModel>();
    comment1 = await repository.create(comment1);
    comment2 = await repository.create(comment2);
    comment3 = await repository.create(comment3);
    await repository.delete(comment2.id);
    try {
      await repository.get(comment2.id);
    } catch (error) {
      expect(error as Error).toBeInstanceOf(NotFoundError);
    }
  });
});
