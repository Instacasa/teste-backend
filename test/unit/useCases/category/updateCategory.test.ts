import CreatePost from '@/useCases/post/createPost';
import UpdatePost from '@/useCases/post/updatePost';
import CommentRepository from '@database/repositories/commentRepository';
import PostRepository from '@database/repositories/postRepository';
import UserRepository from '@database/repositories/userRepository';
import User from '@domains/user';
import Comment from '@/domains/comment';
import { ValidationError } from '@libs/errors/validationError';
import CommentModel from '@models/commentModel';
import UserModel from '@models/userModel';
import { CategoryInterface, CommentInterface, PostInterface, UserInterface } from '@types';
import { CreateCategoryUseCase, UpdateCategoryUseCase } from '@useCases/category';

describe('Update Category', () => {
  let user: UserInterface;
  beforeAll(async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    user = new User({ name: 'Admin', isAdmin: true });
    user.active = true;
    user = await userRepository.create(user);
  });

  beforeEach(async () => {
    const repository = new PostRepository();
    await repository.deleteAll();
  });

  test('Should update category label', async () => {
    const createCategoryUseCase = new CreateCategoryUseCase();
    const updateCategoryUseCase = new UpdateCategoryUseCase();
    const partialCategory: Partial<CategoryInterface> = {
      label: 'Test',
    };
    const category = await createCategoryUseCase.execute(user.id, partialCategory);
    category.label = 'Test Update';
    const updatedCategory = await updateCategoryUseCase.execute(user.id, category.id, category);
    expect(updatedCategory.label).toEqual('Test Update');
  });

  test("Shouldn't update category label to empty/null", async () => {
    const createCategoryUseCase = new CreateCategoryUseCase();
    const updateCategoryUseCase = new UpdateCategoryUseCase();
    const partialCategory: Partial<CategoryInterface> = {
      label: 'Test',
    };
    const category = await createCategoryUseCase.execute(user.id, partialCategory);
    try {
      await updateCategoryUseCase.execute(user.id, category.id, { ...category, label: '' });
    } catch (error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('O nome da categoria é obrigatório');
    }
  });

  test("Shouldn't update category if user isn't the admin", async () => {
    const userRepository = new UserRepository<UserInterface, UserModel>();
    const newUser = await userRepository.create(new User({ name: 'new User', isAdmin: false }));
    const createCategoryUseCase = new CreateCategoryUseCase();
    const updateCategoryUseCase = new UpdateCategoryUseCase();
    const partialCategory: Partial<CategoryInterface> = {
      label: 'Test',
    };
    const category = await createCategoryUseCase.execute(user.id, partialCategory);
    try {
      await updateCategoryUseCase.execute(newUser.id, category.id, { ...category, label: '' });
    } catch (error) {
      expect(error as Error).toBeInstanceOf(ValidationError);
      expect((error as Error).message).toEqual('Apenas administradores podem atualizar categorias');
    }
  });
});
