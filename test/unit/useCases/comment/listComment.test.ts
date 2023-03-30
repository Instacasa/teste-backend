import { CommentRepository, PostRepository, UserRepository } from '@repositories';
import { Post, User } from '@domains';
import { CommentModel, PostModel, UserModel } from '@models';
import { CommentInterface, PostInterface, UserInterface } from '@types';
import { CreateCommentUseCase, ListCommentUseCase } from '@useCases';

describe('List Comment', () => {

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

  test('Should list comment', async () => {
    const createComment = new CreateCommentUseCase();
    const listComment = new ListCommentUseCase();
    const partialComment: Partial<CommentInterface> = { text: 'Text text text', user, post };
    const comment1 = await createComment.execute(post.id, user.id, partialComment);
    const comment2 = await createComment.execute(post.id, user.id, {...partialComment, text: 'Teste 2'});
    const listedComment = await listComment.execute(post.id, );
    expect(listedComment).toHaveLength(2);
  });
});