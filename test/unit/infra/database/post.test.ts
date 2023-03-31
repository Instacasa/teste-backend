import { PostRepository, UserRepository } from '@repositories';
import { PostInterface, UserInterface } from '@types';
import { NotFoundError } from '@errors';
import { PostModel, UserModel } from '@models';
import { mockPosts, mockUsers } from '@mocks';

const userRepository = new UserRepository<UserInterface, UserModel>();
const postRepository = new PostRepository<PostInterface, PostModel>();

describe('Post Repository', () => {

  beforeEach(async () => {
    await userRepository.deleteAll();
    await postRepository.deleteAll();
  });

  test('Should create new element on database', async () => {
    let [ user ]: UserInterface[] = mockUsers([{ isAdmin: true }]);
    user = await userRepository.create(user);
    user.active = true;
    const [ post ] = mockPosts([{user}]);

    const newPost = await postRepository.create(post);
    expect(newPost.id).toBeDefined();
    expect(newPost.id).toBeGreaterThan(0);
    expect(newPost.title).toEqual(post.title);
    expect(newPost.user.id).toEqual(user.id);
  });

  test('Should update element on database', async () => {
    let [ user ]: UserInterface[] = mockUsers([{ isAdmin: true }]);
    user = await userRepository.create(user);
    user.active = true;

    let [ post ]: PostInterface[] = mockPosts([{user}]);

    post = await postRepository.create(post);
    post.title = 'Updated title';
    const udpatedPost = await postRepository.update(post);

    expect(udpatedPost.id).toBeDefined();
    expect(udpatedPost.id).toBeGreaterThan(0);
    expect(udpatedPost.title).toEqual('Updated title');
  });

  test('Should get post by id', async () => {
    let [ user ]: UserInterface[] = mockUsers([{ isAdmin: true }]);
    user = await userRepository.create(user);
    user.active = true;
    
    let [ post ]: PostInterface[] = mockPosts([{user}]);
    post = await postRepository.create(post);
    const persistedPost = await postRepository.get(post.id);
    
    expect(persistedPost.id).toEqual(post.id);
    expect(persistedPost.title).toEqual(post.title);
  });
  

  test('Should get list of post', async () => {
    let [ user ]: UserInterface[] = mockUsers([{ isAdmin: true }]);
    user = await userRepository.create(user);
    user.active = true;
    
    let [post1, post2, post3] : PostInterface[] = mockPosts([{user}, {user}, {user}]);
    post1 = await postRepository.create(post1);
    post2 = await postRepository.create(post2);
    post3 = await postRepository.create(post3);

    const persistedPost = await postRepository.list();
    expect(persistedPost).toHaveLength(3);
    expect(persistedPost[0].title).toEqual(post3.title);
  });

  test('Should delete a post', async () => {
    let [ user ] : UserInterface[] = mockUsers([{ isAdmin: true }]);
    user = await userRepository.create(user);
    user.active = true;
    
    const [post1, post2, post3] = mockPosts([{user}, {user}, {user}]);
    const persistentPost1 = await postRepository.create(post1);
    const persistentPost2 = await postRepository.create(post2);
    const persistentPost3 = await postRepository.create(post3);
    
    await postRepository.delete(persistentPost2.id);
    const savedPost1 = await postRepository.get(persistentPost1.id);
    const savedPost3 = await postRepository.get(persistentPost3.id);

    expect(savedPost1.id).toEqual(savedPost1.id);
    expect(savedPost3.id).toEqual(savedPost3.id);
    await expect(() => postRepository.get(persistentPost2.id))
      .rejects
      .toThrow(NotFoundError);
  });
  
});