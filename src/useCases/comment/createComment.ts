import Comment from '@/domains/comment';
import CommentRepository from '@database/repositories/commentRepository';
import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import { ValidationError } from '@libs/errors/validationError';
import { RepositoryInterface, CommentInterface, UserInterface, PostInterface } from '@types';

class CreateComment {
  repository: RepositoryInterface<CommentInterface>;
  postRepository: RepositoryInterface<PostInterface>;
  userRepository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new CommentRepository();
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
  }

  public execute = async (postId: number, userId: number, data: Partial<CommentInterface>): Promise<CommentInterface> => {
    try {
      const user = await this.userRepository.get(userId);
      const post = await this.postRepository.get(postId);
      if (!user.active) {
        throw new ValidationError('Apenas usuários ativos podem comentar');
      }
      const comment = new Comment({...data, user, post});
      return await this.repository.create(comment);
    } catch(error) {
      console.log(error);
      throw error;
    }
  };

}

export default CreateComment;