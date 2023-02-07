import CommentRepository from '@database/repositories/commentRepository';
import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import Comment from '@domains/comment';
import Post from '@domains/post';
import User from '@domains/user';
import CommentModel from '@models/commentModel';
import PostModel from '@models/postModel';
import UserModel from '@models/userModel';
import { CommentInterface, PostInterface, UserInterface } from '@types';
import httpStatus from 'http-status';
import request from '../request';

describe('Comment', () => {

  beforeEach(async () => {
    const repository = new CommentRepository<CommentInterface, CommentModel>();
    await repository.deleteAll();
  });
  
  test('Should delete comment by admins', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let postOwner: UserInterface = new User({name: 'Admin', isAdmin: true});
    postOwner.active = true;
    postOwner = await userRepository.create(postOwner);
    let user: UserInterface = new User({name: 'Admin', isAdmin: false});
    user.active = true;
    user = await userRepository.create(user);
    const postRepository = new PostRepository<PostInterface, PostModel>();
    let post: PostInterface = new Post({title: 'Post', text: 'Text text text', user: postOwner});
    post = await postRepository.create(post);
    const commentRepository = new CommentRepository<CommentInterface, CommentModel>();
    let comment: CommentInterface = new Comment({text: 'Text text text', user});
    comment = await commentRepository.create(comment);

    const { body } = await request()
      .delete(`/posts/${post.id}/comments/${comment.id}/user/${postOwner.id}`)
      .expect(httpStatus.ACCEPTED);
  });
  
  test('Should delete comment by owner', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let postOwner: UserInterface = new User({name: 'Admin', isAdmin: true});
    postOwner.active = true;
    postOwner = await userRepository.create(postOwner);
    let user: UserInterface = new User({name: 'Admin', isAdmin: false});
    user.active = true;
    user = await userRepository.create(user);
    const postRepository = new PostRepository<PostInterface, PostModel>();
    let post: PostInterface = new Post({title: 'Post', text: 'Text text text', user: postOwner});
    post = await postRepository.create(post);
    const commentRepository = new CommentRepository<CommentInterface, CommentModel>();
    let comment: CommentInterface = new Comment({text: 'Text text text', user});
    comment = await commentRepository.create(comment);

    const { body } = await request()
      .delete(`/posts/${post.id}/comments/${comment.id}/user/${user.id}`)
      .expect(httpStatus.ACCEPTED);
  });

  test('Shouldn\'t delete inexistent comment', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let postOwner: UserInterface = new User({name: 'Admin', isAdmin: true});
    postOwner.active = true;
    postOwner = await userRepository.create(postOwner);
    let user: UserInterface = new User({name: 'Admin', isAdmin: false});
    user.active = true;
    user = await userRepository.create(user);
    const postRepository = new PostRepository<PostInterface, PostModel>();
    let post: PostInterface = new Post({title: 'Post', text: 'Text text text', user: postOwner});
    post = await postRepository.create(post);
    const commentRepository = new CommentRepository<CommentInterface, CommentModel>();
    let comment: CommentInterface = new Comment({text: 'Text text text', user});
    comment = await commentRepository.create(comment);

    const { body } = await request()
      .delete(`/posts/${post.id}/comments/0/user/${user.id}`)
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual('NotFoundError');
  });

  test('Shouldn\'t allow to delete comment without been an admin or owner', async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    let postOwner: UserInterface = new User({name: 'Admin', isAdmin: false});
    postOwner.active = true;
    postOwner = await userRepository.create(postOwner);
    let user: UserInterface = new User({name: 'Admin', isAdmin: false});
    user.active = true;
    user = await userRepository.create(user);
    const postRepository = new PostRepository<PostInterface, PostModel>();
    let post: PostInterface = new Post({title: 'Post', text: 'Text text text', user: postOwner});
    post = await postRepository.create(post);
    const commentRepository = new CommentRepository<CommentInterface, CommentModel>();
    let comment: CommentInterface = new Comment({text: 'Text text text', user});
    comment = await commentRepository.create(comment);

    const { body } = await request()
      .delete(`/posts/${post.id}/comments/${comment.id}/user/${postOwner.id}`)
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });
});