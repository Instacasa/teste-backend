import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import { ValidationError } from '@libs/errors/validationError';
import { PostInterface, RepositoryInterface, UserInterface } from '@types';

class UpdatePost {
  repository: RepositoryInterface<PostInterface>;
  userRepository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new PostRepository();
    this.userRepository = new UserRepository();
  }

  public execute = async (
    userId: number,
    id: number,
    data: Partial<PostInterface>,
  ): Promise<PostInterface> => {
    try {
      const user = await this.userRepository.get(userId);
      const post = await this.repository.get(id);
      if (user.id !== post.user.id) {
        throw new ValidationError('Apenas o autor pode editar a publicação');
      }
      if (post.comments?.length > 0) {
        throw new ValidationError('Publicações já comentadas não podem ser editadas');
      }

      post.title = data.title ?? post.title;
      post.text = data.text ?? post.text;

      return await this.repository.update(post);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default UpdatePost;
