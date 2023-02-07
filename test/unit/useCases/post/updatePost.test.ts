import CreatePost from '@/useCases/post/createPost';
import UpdatePost from '@/useCases/post/updatePost';
import CommentRepository from '@database/repositories/commentRepository';
import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import User from '@domains/user';
import Comment from '@/domains/comment';
import { ValidationError } from '@libs/errors/validationError';
import CommentModel from '@models/commentModel';
import PostModel from '@models/postModel';
import UserModel from '@models/userModel';
import { CommentInterface, PostInterface, UserInterface } from '@types';

describe('Update Post', () => {
  
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

  test('Should update post title', async () => {
    const createPost = new CreatePost();
    const updatePost = new UpdatePost();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
    const post = await createPost.execute(user.id, partialPost);
    post.title = 'Test Update';
    const updatedPost = await updatePost.execute(user.id, post.id, post);
    expect(updatedPost.title).toEqual('Test Update');
  });

  test('Shouldn\'t update post title to empty/null', async () => {
    const createPost = new CreatePost();
    const updatePost = new UpdatePost();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
    const post = await createPost.execute(user.id, partialPost);
    try {
      await updatePost.execute(user.id, post.id, {...post, title: ''});
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O título da publicação é obrigatório');
    }
  });

  test('Shouldn\'t update post if user isn\'t the owner', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    const newUser = await userRepository.create(new User({name: 'new User', isAdmin: false}));
    const createPost = new CreatePost();
    const updatePost = new UpdatePost();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
    const post = await createPost.execute(user.id, partialPost);
    try {
      await updatePost.execute(newUser.id, post.id, {...post, title: ''});
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('Apenas o autor pode editar a publicação');
    }
  });

  test('Shouldn\'t allow update if post has comments', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    const newUser = await userRepository.create(new User({name: 'new User', isAdmin: false}));
    const createPost = new CreatePost();
    const updatePost = new UpdatePost();
    const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
    const post = await createPost.execute(user.id, partialPost);
    const commentRepository = new CommentRepository<CommentInterface, CommentModel>();
    const newComment = await commentRepository.create(new Comment({text: 'new comment', user: newUser, post}));
    try {
      await updatePost.execute(user.id, post.id, {...post, title: 'Teste 2'});
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('Publicações já comentadas não podem ser editadas');
    }
  });
});