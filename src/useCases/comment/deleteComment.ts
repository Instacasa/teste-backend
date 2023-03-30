import { CommentRepository, UserRepository, PostRepository } from '@repositories';
import { ValidationError } from '@errors';
import { CommentInterface, PostInterface, RepositoryInterface, UserInterface } from '@types';

export class DeleteCommentUseCase {
  repository: RepositoryInterface<CommentInterface>;
  userRepository: RepositoryInterface<UserInterface>;
  postRepository: RepositoryInterface<PostInterface>;

  constructor() {
    this.repository = new CommentRepository();
    this.userRepository = new UserRepository();
    this.postRepository = new PostRepository();
  }


  public execute = async (postId: number, userId: number, id: number): Promise<void> => {
    const user = await this.userRepository.get(userId);
    await this.postRepository.get(postId);
    const comment = await this.repository.get(id);
    if (!user.isAdmin && user.id !== comment.user.id) {
      throw new ValidationError('Apenas o autor ou administradores podem excluir comentários');
    }
    await this.repository.delete(comment.id);      
  };

}