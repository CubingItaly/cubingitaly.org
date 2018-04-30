import { AbstractRepository, Repository } from "typeorm";
import { BaseEntity } from "typeorm/repository/BaseEntity";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";

/**
 * Defines a common base repository structure that every custom repository should properly extend.
 * 
 * @export
 * @abstract
 * @class BaseCommonRepository
 * @extends {AbstractRepository<T>}
 * @template T 
 */
export abstract class BaseCommonRepository<T extends BaseEntity> extends AbstractRepository<T> {
  /**
   * Defines the master entity of this repository.
   * 
   * @abstract
   * @type {string}
   * @memberof BaseCommonRepository
   */
  public abstract _entityIdentifier: string;

  /**
   * Defines the default values that needs to be created in the database bootstrap phase for that repository specifically.
   * 
   * @abstract
   * @returns {Promise<void>} 
   * @memberof BaseCommonRepository
   */
  public abstract async InitDefaults(): Promise<void>;

  /**
   * Returns the master repository of this custom repository.
   * 
   * @readonly
   * @type {Repository<T>}
   * @memberof BaseCommonRepository
   */
  public get rootRepository(): Repository<T> {
    return this.repository;
  }

  /**
   * Exposes a generic find function accepting a generic expression as an argument.
   * 
   * @param {FindManyOptions<T>} e 
   * @returns {Promise<T[]>} 
   * @memberof BaseCommonRepository
   */
  public async find(e: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(e);
  }
}
