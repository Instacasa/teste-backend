import CreatePost from "@/useCases/post/createPost";
import ListPost from "@/useCases/post/listPost";
import PostRepository from "@database/repositories/postRepository";
import UserRepository from "@database/repositories/userRepository";
import User from "@domains/user";
import PostModel from "@models/postModel";
import UserModel from "@models/userModel";
import { PostInterface, UserInterface } from "@types";

describe("List Post", () => {
  let user: UserInterface;
  beforeAll(async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({ name: "Admin", isAdmin: true });
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    const repository = new PostRepository();
    await repository.deleteAll();
  });

  test("Should list post", async () => {
    const createPost = new CreatePost();
    const listPost = new ListPost();
    const partialPost: Partial<PostInterface> = {
      title: "Teste",
      text: "Text text text",
      user,
    };
    const post1 = await createPost.execute(user.id, partialPost);
    const post2 = await createPost.execute(user.id, {
      ...partialPost,
      title: "Teste 2",
    });
    const listedPost = await listPost.execute();
    expect(listedPost).toHaveLength(2);
    expect(listedPost[0].id).toEqual(post2.id);
    expect(listedPost[1].id).toEqual(post1.id);
  });
});
