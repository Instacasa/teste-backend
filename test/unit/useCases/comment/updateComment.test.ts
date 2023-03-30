import CreateComment from '@/useCases/comment/createComment';
import UpdateComment from '@/useCases/comment/updateComment';
import CommentRepository from '@database/repositories/commentRepository';
import UserRepository from '@database/repositories/userRepository';
import { ValidationError } from '@libs/errors/validationError';
import { CommentInterface, PostInterface, UserInterface } from '@types';
import PostRepository from '@database/repositories/postRepository';
import { Post, User } from '@domains';
import { CommentModel, UserModel, PostModel } from '@models';

describe('Update Comment', () => {

  let user: UserInterface;
  let post: PostInterface;
  beforeAll(async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
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

  test('Should update comment title', async () => {
    const createComment = new CreateComment();
    const updateComment = new UpdateComment();
    const partialComment: Partial<CommentInterface> = { text: 'Text text text', user, post };
    const comment = await createComment.execute(post.id, user.id, partialComment);
    comment.text = 'Test Update';
    const updatedComment = await updateComment.execute(post.id, user.id, comment.id, comment);
    expect(updatedComment.text).toEqual('Test Update');
  });

  test('Shouldn\'t update comment text to empty/null', async () => {
    const createComment = new CreateComment();
    const updateComment = new UpdateComment();
    const partialComment: Partial<CommentInterface> = {text: 'Text text text', user, post };
    const comment = await createComment.execute(post.id, user.id, partialComment);
    try {
      await updateComment.execute(post.id, user.id, comment.id, {...comment, text: ''});
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O texto do comentário é obrigatório');
    }
  });

  test('Shouldn\'t update comment if user isn\'t the owner', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    const newUser = await userRepository.create(new User({name: 'new User', isAdmin: false}));
    const createComment = new CreateComment();
    const updateComment = new UpdateComment();
    const partialComment: Partial<CommentInterface> = { text: 'Text text text', user, post };
    const comment = await createComment.execute(post.id, user.id, partialComment);
    try {
      await updateComment.execute(post.id, newUser.id, comment.id, {...comment, text: ''});
    } catch(error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('Apenas o autor pode editar a publicação');
    }
  });
});