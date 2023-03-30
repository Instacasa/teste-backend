import { PostRepository, UserRepository } from '@repositories';
import { PostInterface, UserInterface } from '@types';
import { NotFoundError } from '@errors';
import { User, Post } from '@domains';
import { PostModel, UserModel } from '@models';

describe('Post Repository', () => {

  beforeEach(async () => {
    const repository = new PostRepository<PostInterface, PostModel>();
    await repository.deleteAll();
  });

  test('Should create new element on database', async () => {
    let user: UserInterface = new User({ name: 'Test', isAdmin: true });
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = await userRepository.create(user);
    const post = new Post({title: 'Test', text: 'text test', user});

    const repository = new PostRepository<PostInterface, PostModel>();
    const newPost = await repository.create(post);
    expect(newPost.id).toBeDefined();
    expect(newPost.id).toBeGreaterThan(0);
    expect(newPost.title).toEqual(post.title);
    expect(newPost.user.id).toEqual(user.id);
  });

  test('Should update elemente on database', async () => {
    let user: UserInterface = new User({ name: 'Test', isAdmin: true });
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = await userRepository.create(user);
    let post: PostInterface = new Post({title: 'Test', text: 'text test', user});

    const repository = new PostRepository<PostInterface, PostModel>();
    post = await repository.create(post);
    post.title = 'Updated title';
    const udpatedPost = await repository.update(post);

    expect(udpatedPost.id).toBeDefined();
    expect(udpatedPost.id).toBeGreaterThan(0);
    expect(udpatedPost.title).toEqual('Updated title');
  });

  test('Should get post by id', async () => {
    let user: UserInterface = new User({ name: 'Test', isAdmin: true });
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = await userRepository.create(user);
    let post: PostInterface = new Post({title: 'Test', text: 'text test',  user});

    const repository = new PostRepository<PostInterface, PostModel>();
    post = await repository.create(post);
    const persistedPost = await repository.get(post.id);
    expect(persistedPost.id).toEqual(post.id);
    expect(persistedPost.title).toEqual(post.title);
  });
  

  test('Should get list of post', async () => {
    let user: UserInterface = new User({ name: 'Test', isAdmin: true });
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = await userRepository.create(user);
    let post1: PostInterface = new Post({title: 'Test 1', text: 'text test', user});
    let post2: PostInterface = new Post({title: 'Test 2', text: 'text test', user});
    let post3: PostInterface = new Post({title: 'Test 3', text: 'text test', user});

    const repository = new PostRepository<PostInterface, PostModel>();
    post1 = await repository.create(post1);
    post2 = await repository.create(post2);
    post3 = await repository.create(post3);
    const persistedPost = await repository.list();
    expect(persistedPost).toHaveLength(3);
    expect(persistedPost[0].title).toEqual(post3.title);
  });
  

  test('Should delete a post', async () => {
    let user: UserInterface = new User({ name: 'Test', isAdmin: true });
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = await userRepository.create(user);
    let post1: PostInterface = new Post({ title: 'Test 1', text: 'text test', user });
    let post2: PostInterface = new Post({ title: 'Test 2', text: 'text test', user });
    let post3: PostInterface = new Post({ title: 'Test 3', text: 'text test', user });

    const repository = new PostRepository<PostInterface, PostModel>();
    post1 = await repository.create(post1);
    post2 = await repository.create(post2);
    post3 = await repository.create(post3);
    await repository.delete(post2.id);
    try {
      await repository.get(post2.id);
    } catch(error) {
      expect(error as Error).toBeInstanceOf(NotFoundError);
    }
  });
  
});