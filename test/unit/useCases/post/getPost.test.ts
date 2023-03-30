import CreatePost from '@/useCases/post/createPost';
import GetPost from '@/useCases/post/getPost';
import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import { User } from '@domains';
import { NotFoundError } from '@libs/errors/notFoundError';
import { PostModel, UserModel } from '@models';
import { PostInterface, UserInterface } from '@types';

describe('Get Post', () => {

  let user: UserInterface;
  beforeAll(async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
  });
  
  beforeEach(async () => {
    const repository = new PostRepository<PostInterface, PostModel>();
    await repository.deleteAll();
  });
  
  test('Should get post', async () => {
    const createPost = new CreatePost();
    const getPost = new GetPost();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
    const post = await createPost.execute(user.id, partialPost);
    const getedPost = await getPost.execute(post.id);
    expect(getedPost.title).toEqual('Teste');
  });

  test('Shouldn\'t get inexistent post', async () => {
    const getPost = new GetPost();
    try {
      await getPost.execute(0);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(NotFoundError);
      expect((error as Error).message).toEqual('post with id 0 can\'t be found.');
    }
  });
});