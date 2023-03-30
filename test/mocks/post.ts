import { Post } from '@domains';
import { faker } from '@faker-js/faker';
import { PostInterface } from '@types';

export const mockPosts = (posts: Array<Partial<PostInterface>>): Array<Post> => posts.map((postData) => {
  return new Post({
    ...postData,
    title: postData.title ?? faker.lorem.sentence(20),
    text: postData.text ?? faker.lorem.paragraphs(2)
  });
});