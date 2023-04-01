import { Post } from '@domains';
import { PostModel } from '@models';
import { BaseRepository } from '@repositories';
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

export class PostRepository<PostInterface, PostModel> extends BaseRepository<PostInterface, PostModel> {
  constructor() {
    super(PostModel, Post);
  }

  public listByUser = async (id: number): Promise<Post[]> => {
    const repository = await this.repository();
    const list = await repository.find({
      where: { user: { id }} as unknown as FindOptionsWhere<PostModel>,
      order: {id: 'DESC'} as unknown as FindOptionsOrder<PostModel>});
    return list.map(element => new Post(element));
  };

}
