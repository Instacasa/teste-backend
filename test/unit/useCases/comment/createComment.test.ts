import { CommentRepository, PostRepository, UserRepository } from '@repositories';
import { ValidationError } from '@errors';
import { CommentInterface, PostInterface, UserInterface } from '@types';
import { Comment, Post, User } from '@domains';
import { CommentModel, PostModel, UserModel } from '@models';
import { CreateCommentUseCase } from '@useCases';

describe('Create Comment', () => {

  let user: UserInterface;
  let post: PostInterface;
  let userRepository: UserRepository<UserInterface, UserModel>;
  let createComment: CreateCommentUseCase;
  beforeAll(async () => {
    createComment = new CreateCommentUseCase();
    userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({name: 'user'});
    let user2: UserInterface = new User({name: 'user 2'});
    user.active = true;
    user2.active = true;
    user = await userRepository.create(user);
    user2 = await userRepository.create(user2);
    const postRepository = new PostRepository<PostInterface, PostModel>();
    post = await postRepository.create(new Post({ title: 'Teste', text: 'Text text text', user: user2 }));
  });

  beforeEach(async () => {
    const repository = new CommentRepository<CommentInterface, CommentModel>();
    await repository.deleteAll();
  });

  test('Should create new comment if user is active', async () => {
    const partialComment: Partial<CommentInterface> = { text: 'Text text text', post };
    const comment = await createComment.execute(post.id, user.id, partialComment);
    expect(comment).toBeInstanceOf(Comment);
  });

  test('Shouldn\'t create new comment if user isn\'t active', async () => {
    const newUser = await userRepository.create(new User({name: 'User', isAdmin: false, active: false}));
    const partialComment: Partial<CommentInterface> = { text: 'Text text text', post };

    await expect(() => 
      createComment.execute(post.id, newUser.id, partialComment)
    ).rejects.toThrowError(new ValidationError('Apenas usuários ativos podem comentar'));
  });

  test('Shouldn\'t create comment without text', async () => {
    const partialComment: Partial<CommentInterface> = { text: '', post };
    await expect(() => 
      createComment.execute(post.id, user.id, partialComment)
    ).rejects.toThrowError(new ValidationError('O texto do comentário é obrigatório'));
  });
  
});