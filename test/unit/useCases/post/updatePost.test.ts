import { CommentRepository, PostRepository, UserRepository } from '@repositories';
import { ValidationError } from '@errors';
import { CommentModel, PostModel, UserModel } from '@models';
import { CommentInterface, PostInterface, UserInterface } from '@types';
import { User, Comment } from '@domains';
import { CreatePostUseCase, UpdatePostUseCase } from '@useCases';

describe('Update Post', () => {
  
  let user: UserInterface;
  let userRepository: UserRepository<UserInterface, UserModel>;
  beforeAll(async () => {
    userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({name: 'Admin', isAdmin: true});
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    const repository = new PostRepository<PostInterface, PostModel>();
    await repository.deleteAll();
  });

  test('Should update post title', async () => {
    const createPost = new CreatePostUseCase();
    const updatePost = new UpdatePostUseCase();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
    const post = await createPost.execute(user.id, partialPost);
    post.title = 'Test Update';
    const updatedPost = await updatePost.execute(user.id, post.id, post);
    expect(updatedPost.title).toEqual('Test Update');
  });

  test('Shouldn\'t update post title to empty/null', async () => {
    const createPost = new CreatePostUseCase();
    const updatePost = new UpdatePostUseCase();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
    const post = await createPost.execute(user.id, partialPost);
    await expect(() => 
      updatePost.execute(user.id, post.id, {...post, title: ''})
    ).rejects.toThrowError(new ValidationError('O título da publicação é obrigatório'));
  });

  test('Shouldn\'t update post if user isn\'t the owner', async () => {
    const newUser = await userRepository.create(new User({name: 'new User', isAdmin: false}));
    const createPost = new CreatePostUseCase();
    const updatePost = new UpdatePostUseCase();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
    const post = await createPost.execute(user.id, partialPost);
    await expect(() => 
      updatePost.execute(newUser.id, post.id, {...post, title: ''})
    ).rejects.toThrowError(new ValidationError('Apenas o autor pode editar a publicação'));
  });

  test('Shouldn\'t allow update if post has comments', async () => {
    const newUser = await userRepository.create(new User({name: 'new User', isAdmin: false}));
    const createPost = new CreatePostUseCase();
    const updatePost = new UpdatePostUseCase();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
    const post = await createPost.execute(user.id, partialPost);
    const commentRepository = new CommentRepository<CommentInterface, CommentModel>();
    await commentRepository.create(new Comment({text: 'new comment', user: newUser, post}));
    await expect(() => 
      updatePost.execute(user.id, post.id, {...post, title: 'Teste 2'})
    ).rejects.toThrowError(new ValidationError('Publicações já comentadas não podem ser editadas'));
  });
});