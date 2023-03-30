import { CommentInterface, PostInterface, UserInterface } from '@types';

export const commentSerialize = (comment: Partial<CommentInterface>): Partial<CommentInterface> => {
  return {
    id: comment.id,
    text: comment.text
  };
};

export const postSerialize = (post: PostInterface): PostInterface => {
  return {
    id: post.id,
    title: post.title,
    text: post.text,
    user: {id: post.user.id, name: post.user.name, active: post.user.active, isAdmin: post.user.isAdmin},
  };
};

export const userSerialize = (user: UserInterface): UserInterface => {
  return {
    id: user.id,
    name: user.name,
    active: user.active,
    isAdmin: user.isAdmin,
  };
};