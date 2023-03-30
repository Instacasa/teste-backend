import connection from '@libs/database';
import { NotFoundError } from '@libs/errors/notFoundError';
import { RepositoryInterface } from '@types';
import { EntityNotFoundError, EntityTarget, FindOptionsOrder, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

export class BaseRepository<Interface, Model extends ObjectLiteral> implements RepositoryInterface<Interface> {
  private model: any;
  private domain: any;

  constructor(model: EntityTarget<Model>, domain: any) {
    this.model = model;
    this.domain = domain;
  }

  private repository = async (): Promise<Repository<Model>> => {
    return await (await connection).getRepository<Model>(this.model);
  };

  public list = async (): Promise<Interface[]> => {
    const repository = await this.repository();
    const list = await repository.find({order: {id: 'DESC'} as unknown as FindOptionsOrder<Model>});
    return list.map(element => new this.domain(element));
  };

  public get = async (id: number): Promise<Interface> => {
    const repository = await this.repository();
    const find = { where: { id } };
    try {
      const element = await repository.findOneOrFail(find as unknown as FindOptionsWhere<Model>);
      return new this.domain(element);
    } catch(error) {
      if(error instanceof EntityNotFoundError) {
        throw new NotFoundError(`${repository.metadata.tableName} with id ${id} can't be found.`);
      }
      throw error;
    }
  };

  public create = async (data: Interface): Promise<Interface> => {
    const repository = await this.repository();
    const element = await repository.save(new this.model(data));
    return new this.domain(element);
  };

  public update = async (data: Interface): Promise<Interface> => {
    const repository = await this.repository();
    const element = await repository.save(new this.model(data));
    return new this.domain(element);
  };

  public delete = async (id: number):  Promise<void> => {
    const repository = await this.repository();
    await repository.delete(id);
  };

  public deleteAll = async ():  Promise<void> => {
    const repository = await this.repository();
    await repository.delete({});
  };
  
}