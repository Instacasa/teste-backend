import { CommentRepository, PostRepository, UserRepository } from '@repositories';
import { NotFoundError, ValidationError } from '@errors';
import { CommentInterface, PostInterface, UserInterface } from '@types';
import { Post, User } from '@domains';
import { CommentModel, PostModel, UserModel } from '@models';
import { CreateCommentUseCase, DeleteCommentUseCase, GetCommentUseCase } from '@useCases';

describe('Delete Comment', () => {

  let user: UserInterface;
  let post: PostInterface;
  let userRepository: UserRepository<UserInterface, UserModel>;
  beforeAll(async () => {
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
  
  test('Should delete comment if user is the owner', async () => {
    const createComment = new CreateCommentUseCase();
    const deleteComment = new DeleteCommentUseCase();
    const getComment = new GetCommentUseCase();
    const partialComment: Partial<CommentInterface> = { text: 'Text text text', user, post };
    const comment = await createComment.execute(post.id, user.id, partialComment);
    await deleteComment.execute(post.id, user.id, comment.id);

    await expect(() => 
      getComment.execute(post.id, comment.id)
    ).rejects.toThrowError(new NotFoundError(`comment with id ${comment.id} can't be found.`));
  });

  test('Should delete comment if user is the admin', async () => {
    const admin = await userRepository.create(new User({name: 'Admin', isAdmin: true}));
    const createComment = new CreateCommentUseCase();
    const deleteComment = new DeleteCommentUseCase();
    const getComment = new GetCommentUseCase();
    const partialComment: Partial<CommentInterface> = { text: 'Text text text', user, post };
    const comment = await createComment.execute(post.id, user.id, partialComment);
    await deleteComment.execute(post.id, admin.id, comment.id);

    await expect(() => 
      getComment.execute(post.id, comment.id)
    ).rejects.toThrowError(new NotFoundError(`comment with id ${comment.id} can't be found.`));
  });

  test('Shouldn\'t delete inexistent comment', async () => {
    const deleteComment = new DeleteCommentUseCase();
    
    await expect(() => 
      deleteComment.execute(post.id, user.id, 0)
    ).rejects.toThrowError(new NotFoundError('comment with id 0 can\'t be found.'));
  });

  test('Shouldn\'t delete comment id user is not admin neither ', async () => {
    const admin = await userRepository.create(new User({name: 'Admin', isAdmin: false}));
    const createComment = new CreateCommentUseCase();
    const deleteComment = new DeleteCommentUseCase();
    const getComment = new GetCommentUseCase();
    const partialComment: Partial<CommentInterface> = { text: 'Text text text', user, post };
    const comment = await createComment.execute(post.id, user.id, partialComment);
    
    await expect(() => 
      deleteComment.execute(post.id, admin.id, comment.id)
    ).rejects.toThrowError(new ValidationError('Apenas o autor ou administradores podem excluir comentários'));
  });
});