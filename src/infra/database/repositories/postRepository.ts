import PostModel from "@models/postModel";
import Post from "@/domains/post";
import BaseRepository from "./baseRepository";
import { FindOptionsWhere } from "typeorm";
import { PostInterface, PostRepositoryInterface } from "@types";

class PostRepository
  extends BaseRepository<PostInterface, PostModel>
  implements PostRepositoryInterface
{
  constructor() {
    super(PostModel, Post);
  }

  listByUser = async (userId: number): Promise<PostInterface[]> => {
    const repository = await this.repository(); //TODO: corrigir tipagem
    const list = await repository.find({
      where: {
        user: { id: userId },
      } as unknown as FindOptionsWhere<PostModel>,
    });
    return list.map((element) => new this.domain(element));
  };
}

export default PostRepository;
