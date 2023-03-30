import CreateComment from '@/useCases/comment/createComment';
import GetComment from '@/useCases/comment/getComment';
import CommentRepository from '@database/repositories/commentRepository';
import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import { NotFoundError } from '@libs/errors/notFoundError';
import { Post, User } from '@domains';
import { CommentModel, PostModel, UserModel } from '@models';
import { CommentInterface, PostInterface, UserInterface } from '@types';

describe('Get Comment', () => {

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
  
  test('Should get comment', async () => {
    const createComment = new CreateComment();
    const getComment = new GetComment();
    const partialComment: Partial<CommentInterface> = { text: 'Text text text', user, post };
    const comment = await createComment.execute(post.id, user.id, partialComment);
    const getedComment = await getComment.execute(post.id, comment.id);
    expect(getedComment.text).toEqual('Text text text');
  });

  test('Shouldn\'t get inexistent comment', async () => {
    const getComment = new GetComment();
    try {
      await getComment.execute(post.id, 0);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(NotFoundError);
      expect((error as Error).message).toEqual('comment with id 0 can\'t be found.');
    }
  });
});