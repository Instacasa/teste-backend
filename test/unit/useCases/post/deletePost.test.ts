import { CreatePostUseCase, DeletePostUseCase, GetPostUseCase } from '@useCases';
import { PostRepository, UserRepository } from '@repositories';
import { User } from '@domains';
import { NotFoundError, ValidationError } from '@errors';
import { PostModel, UserModel } from '@models';
import { PostInterface, UserInterface } from '@types';

describe('Delete Post', () => {
  let user: UserInterface;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let postRepository: PostRepository<PostInterface, PostModel>;
  beforeAll(async () => {
    userRepository = new UserRepository<UserInterface, UserModel>();
    postRepository = new PostRepository<PostInterface, PostModel>();
    user = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
  });
  
  beforeEach(async () => {
    await postRepository.deleteAll();
  });
  
  test('Should delete post if user is the owner', async () => {
    const createPost = new CreatePostUseCase();
    const deletePost = new DeletePostUseCase();
    const getPost = new GetPostUseCase();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
    const post = await createPost.execute(user.id, partialPost);
    await deletePost.execute(user.id, post.id);
    await expect(() => 
      getPost.execute(post.id)
    ).rejects.toThrowError(new NotFoundError(`post with id ${post.id} can't be found.`));
  });

  test('Should delete post if user is the admin', async () => {
    const admin = await userRepository.create(new User({name: 'Admin', isAdmin: true}));
    const createPost = new CreatePostUseCase();
    const deletePost = new DeletePostUseCase();
    const getPost = new GetPostUseCase();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
    const post = await createPost.execute(user.id, partialPost);
    await deletePost.execute(admin.id, post.id);
    await expect(() => 
      getPost.execute(post.id)
    ).rejects.toThrowError(new NotFoundError(`post with id ${post.id} can't be found.`));
  });

  test('Shouldn\'t delete inexistent post', async () => {
    const deletePost = new DeletePostUseCase();
    await expect(() => 
      deletePost.execute(user.id, 0)
    ).rejects.toThrowError(new NotFoundError('post with id 0 can\'t be found.'));
  });

  test('Shouldn\'t delete post if user is not admin', async () => {
    const admin = await userRepository.create(new User({name: 'Admin', isAdmin: false}));
    const createPost = new CreatePostUseCase();
    const deletePost = new DeletePostUseCase();
    const getPost = new GetPostUseCase();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
    const post = await createPost.execute(user.id, partialPost);
    await expect(() => 
      deletePost.execute(admin.id, post.id)
    ).rejects.toThrowError(new ValidationError('Apenas o autor ou administradores podem excluir publicações'));
  });
});