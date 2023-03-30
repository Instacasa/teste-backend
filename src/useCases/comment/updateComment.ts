import { CommentRepository, UserRepository, PostRepository } from '@repositories';
import { ValidationError } from '@libs/errors/validationError';
import { CommentInterface, PostInterface, RepositoryInterface, UserInterface } from '@types';

class UpdateComment {
  repository: RepositoryInterface<CommentInterface>;
  postRepository: RepositoryInterface<PostInterface>;
  userRepository: RepositoryInterface<UserInterface>;

  constructor() {
    this.repository = new CommentRepository();
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
  }

  public execute = async (postId: number, userId: number, id: number, data: Partial<CommentInterface>): Promise<CommentInterface> => {
    const user = await this.userRepository.get(userId);
    await this.postRepository.get(postId);
    const comment = await this.repository.get(id);
    if (user.id !== comment.user.id) {
      throw new ValidationError('Apenas o autor pode editar a publicação');
    }
    comment.text = data.text ?? comment.text;
    const n = await this.repository.update(comment);
    return n;
  };

}

export default UpdateComment;