import CommentRepository from '@database/repositories/commentRepository';
import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import { ValidationError } from '@libs/errors/validationError';
import { CommentInterface, PostInterface, RepositoryInterface, UserInterface } from '@types';

class DeleteComment {
  repository: RepositoryInterface<CommentInterface>;
  userRepository: RepositoryInterface<UserInterface>;
  postRepository: RepositoryInterface<PostInterface>;

  constructor() {
    this.repository = new CommentRepository();
    this.userRepository = new UserRepository();
    this.postRepository = new PostRepository();
  }


  public execute = async (postId: number, userId: number, id: number): Promise<void> => {
    try {
      const user = await this.userRepository.get(userId);
      await this.postRepository.get(postId);
      const comment = await this.repository.get(id);
      if (!user.isAdmin && user.id !== comment.user.id) {
        throw new ValidationError('Apenas o autor ou administradores podem excluir comentários');
      }
      await this.repository.delete(comment.id);      
    } catch(error) {
      console.log(error);
      throw error;
    }
  };

}

export default DeleteComment;