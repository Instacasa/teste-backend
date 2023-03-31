import { CreatePostUseCase, GetPostUseCase } from '@useCases';
import { PostRepository, UserRepository } from '@repositories';
import { User } from '@domains';
import { NotFoundError } from '@errors';
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
    const createPost = new CreatePostUseCase();
    const getPost = new GetPostUseCase();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
    const post = await createPost.execute(user.id, partialPost);
    const getedPost = await getPost.execute(post.id);
    expect(getedPost.title).toEqual('Teste');
  });

  test('Shouldn\'t get inexistent post', async () => {
    const getPost = new GetPostUseCase();
    await expect(() => 
      getPost.execute(0)
    ).rejects.toThrowError(new NotFoundError('post with id 0 can\'t be found.'));
  });
});