import CommentRepository from '@database/repositories/commentRepository';
import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import { Comment, Post, User } from '@domains';
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
  
  test('Should update comment by id', async () => {
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
      .patch(`/posts/${post.id}/comments/${comment.id}/user/${user.id}`)
      .send({
        text: 'test'
      })
      .expect(httpStatus.OK);
    expect(body.text).toEqual('test');
  });

  test('Shouldn\'t update inexistent comment', async () => {
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
    
    const { body } = await request()
      .patch(`/posts/${post.id}/comments/0/user/${user.id}`)
      .send({
        text: ''
      })
      .expect(httpStatus.NOT_FOUND);
    expect(body.error.name).toEqual('NotFoundError');
  });

  test('Shouldn\'t allow to update comment without been the owner', async () => {
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
      .patch(`/posts/${post.id}/comments/${comment.id}/user/${postOwner.id}`)
      .send({
        text: ''
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });

  test('Shouldn\'t allow to update comment text to null', async () => {
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
      .patch(`/posts/${post.id}/comments/${comment.id}/user/${user.id}`)
      .send({
        text: ''
      })
      .expect(httpStatus.BAD_REQUEST);
    expect(body.error.name).toEqual('ValidationError');
  });
});