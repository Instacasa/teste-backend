import { CreatePostUseCase, GetPostUseCase } from '@useCases';
import { PostRepository, UserRepository } from '@repositories';
import { User } from '@domains';
import { NotFoundError } from '@errors';
import { PostModel, UserModel } from '@models';
import { PostInterface, UserInterface } from '@types';

describe('Get Post', () => {
  let createPost: CreatePostUseCase;
  let getPost: GetPostUseCase;
  let repository: PostRepository<PostInterface, PostModel>;
  let user: UserInterface;
  beforeAll(async () => {
    createPost = new CreatePostUseCase();
    getPost = new GetPostUseCase();
    repository = new PostRepository<PostInterface, PostModel>();

    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
  });
  
  beforeEach(async () => {
    await repository.deleteAll();
  });
  
  test('Should get post', async () => {
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
    const post = await createPost.execute(user.id, partialPost);
    const gettedPost = await getPost.execute(post.id);
    expect(gettedPost.title).toEqual('Teste');
  });

  test('Shouldn\'t get inexistent post', async () => {
    await expect(() => 
      getPost.execute(0)
    ).rejects.toThrowError(new NotFoundError('post with id 0 can\'t be found.'));
  });
});