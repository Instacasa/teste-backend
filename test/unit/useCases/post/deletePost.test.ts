import CreatePost from '@/useCases/post/createPost';
import DeletePost from '@/useCases/post/deletePost';
import GetPost from '@/useCases/post/getPost';
import { PostRepository, UserRepository } from '@repositories';
import { User } from '@domains';
import { NotFoundError } from '@libs/errors/notFoundError';
import { ValidationError } from '@libs/errors/validationError';
import { PostModel, UserModel } from '@models';
import { PostInterface, UserInterface } from '@types';

describe('Delete Post', () => {
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
  
  describe('User is admin', () => {

    test('Should delete post if user is the owner', async () => {
      const createPost = new CreatePost();
      const deletePost = new DeletePost();
      const getPost = new GetPost();
      const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
      const post = await createPost.execute(user.id, partialPost);
      await deletePost.execute(user.id, post.id);

      try {
        await getPost.execute(post.id);
      } catch(error) {
        expect(error as Error).toBeInstanceOf(NotFoundError);
        expect((error as Error).message).toEqual(`post with id ${post.id} can't be found.`);
      }
    });

    test('Should delete post if user is the admin', async () => {
      const userRepository = new UserRepository<UserInterface, UserModel>();
      const admin = await userRepository.create(new User({name: 'Admin', isAdmin: true}));
      const createPost = new CreatePost();
      const deletePost = new DeletePost();
      const getPost = new GetPost();
      const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
      const post = await createPost.execute(user.id, partialPost);
      await deletePost.execute(admin.id, post.id);

      try {
        await getPost.execute(post.id);
      } catch(error) {
        expect(error as Error).toBeInstanceOf(NotFoundError);
        expect((error as Error).message).toEqual(`post with id ${post.id} can't be found.`);
      }
    });

    test('Shouldn\'t delete inexistent post', async () => {
      const deletePost = new DeletePost();
      try {
        await deletePost.execute(user.id, 0);
      } catch(error) {
        expect(error as Error).toBeInstanceOf(NotFoundError);
        expect((error as Error).message).toEqual('post with id 0 can\'t be found.');
      }
    });

    test('Shouldn\'t delete post id user is not admin neither ', async () => {
      const userRepository = new UserRepository<UserInterface, UserModel>();
      const admin = await userRepository.create(new User({name: 'Admin', isAdmin: true}));
      const createPost = new CreatePost();
      const deletePost = new DeletePost();
      const getPost = new GetPost();
      const partialPost: Partial<PostInterface> = { title: 'Teste', text: 'Text text text', user };
      const post = await createPost.execute(user.id, partialPost);
      try {
        await deletePost.execute(admin.id, post.id);
      } catch(error) {
        expect(error as Error).toBeInstanceOf(ValidationError);
        expect((error as Error).message).toEqual('Apenas o autor ou administradores podem excluir publicações');
      }
    });
  });
});