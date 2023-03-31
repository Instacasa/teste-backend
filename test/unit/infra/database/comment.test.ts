import { CommentRepository, UserRepository, PostRepository } from '@repositories';
import { CommentInterface, PostInterface, UserInterface } from '@types';
import { NotFoundError } from '@errors';
import { CommentModel, UserModel, PostModel } from '@models';
import { mockComments, mockPosts, mockUsers } from '@mocks';

const commentRepository = new CommentRepository<CommentInterface, CommentModel>();
const userRepository = new UserRepository<UserInterface, UserModel>();
const postRepository = new PostRepository<PostInterface, PostModel>();

describe('Comment Repository', () => {

  beforeEach(async () => {
    await commentRepository.deleteAll();
  });

  test('Should create new element on database', async () => {
    let [ user ]: UserInterface[] = mockUsers([{ isAdmin: true }]);
    user = await userRepository.create(user);

    let [ post ]: PostInterface[] = mockPosts([{ user }]);
    post = await postRepository.create(post);

    const [ comment ] = mockComments([{ user, post }]);

    const newComment = await commentRepository.create(comment);
    expect(newComment.id).toBeDefined();
    expect(newComment.id).toBeGreaterThan(0);
    expect(newComment.text).toEqual(comment.text);
    expect(newComment.user.id).toEqual(user.id);
    expect(newComment.post.id).toEqual(post.id);
  });

  test('Should update elemente on database', async () => {
    let [ user ]: UserInterface[] = mockUsers([{ isAdmin: true }]);
    user = await userRepository.create(user);

    let [ post ]: PostInterface[] = mockPosts([{ user }]);
    post = await postRepository.create(post);

    let [ comment ]: CommentInterface[] = mockComments([{ user, post }]);

    comment = await commentRepository.create(comment);
    comment.text = 'Updated text';
    const udpatedComment = await commentRepository.update(comment);

    expect(udpatedComment.id).toBeDefined();
    expect(udpatedComment.id).toBeGreaterThan(0);
    expect(udpatedComment.text).toEqual('Updated text');
  });

  test('Should get comment by id', async () => {
    let [ user ]: UserInterface[] = mockUsers([{ isAdmin: true }]);
    user = await userRepository.create(user);

    let [ post ]: PostInterface[] = mockPosts([{ user }]);
    post = await postRepository.create(post);

    let [ comment ]: CommentInterface[] = mockComments([{ user, post }]);

    comment = await commentRepository.create(comment);
    const persistedComment = await commentRepository.get(comment.id);
    expect(persistedComment.id).toEqual(comment.id);
    expect(persistedComment.text).toEqual(comment.text);
  });
  

  test('Should get list of comment', async () => {
    let [ user ]: UserInterface[] = mockUsers([{ isAdmin: true }]);
    user = await userRepository.create(user);

    let [ post ]: PostInterface[] = mockPosts([{ user }]);
    post = await postRepository.create(post);

    let [ comment1, comment2, comment3 ]: CommentInterface[]
      = mockComments([{ user, post }, { user, post }, { user, post }]);

    comment1 = await commentRepository.create(comment1);
    comment2 = await commentRepository.create(comment2);
    comment3 = await commentRepository.create(comment3);
    const persistedComment = await commentRepository.list();
    expect(persistedComment).toHaveLength(3);
    expect(persistedComment[0].text).toEqual(comment3.text);
  });
  

  test('Should delete a comment', async () => {
    let [ user ]: UserInterface[] = mockUsers([{ isAdmin: true }]);
    user = await userRepository.create(user);

    let [ post ]: PostInterface[] = mockPosts([{ user }]);
    post = await postRepository.create(post);

    let [ comment1, comment2, comment3 ]: CommentInterface[]
      = mockComments([{ user, post }, { user, post }, { user, post }]);

    comment1 = await commentRepository.create(comment1);
    comment2 = await commentRepository.create(comment2);
    comment3 = await commentRepository.create(comment3);
    await commentRepository.delete(comment2.id);

    await expect(commentRepository.get(comment2.id))
      .rejects
      .toThrow(NotFoundError);
  });
  
});