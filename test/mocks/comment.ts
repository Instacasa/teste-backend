import { Comment } from '@domains';
import { faker } from '@faker-js/faker';
import { CommentInterface } from '@types';

export const mockComments = (comments: Array<Partial<CommentInterface>>): Array<Comment> => comments.map((commentData) => {
  return new Comment({
    ...commentData,
    text: commentData.text ?? faker.lorem.text()
  });
});