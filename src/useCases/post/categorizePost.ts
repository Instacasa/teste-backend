import { UserRepository, PostRepository, CategoryRepository } from '@repositories';
import { ValidationError } from '@errors';
import { CategoryInterface, PostInterface, RepositoryInterface, UserInterface } from '@types';

export class CategorizePostUseCase {
  repository: RepositoryInterface<PostInterface>;
  userRepository: RepositoryInterface<UserInterface>;
  categoryRepository: RepositoryInterface<CategoryInterface>;

  constructor() {
    this.repository = new PostRepository();
    this.userRepository = new UserRepository();
    this.categoryRepository = new CategoryRepository();
  }

  public execute = async (userId: number, id: number, categoryId: number): Promise<PostInterface> => {
    const user = await this.userRepository.get(userId);
    const post = await this.repository.get(id);
    const category = await this.categoryRepository.get(categoryId);

    if (user.id !== post.user.id && !user.isAdmin) {
      throw new ValidationError('Apenas administradores ou o autor podem editar a publicação');
    }
    if (post.comments?.length > 0) {
      throw new ValidationError('Publicações já comentadas não podem ser editadas');
    }

    post.categories = [...post.categories, category];
    const n = await this.repository.update(post);
    return n;
  };

}
