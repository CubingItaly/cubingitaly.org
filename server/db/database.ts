import "reflect-metadata";
import { createConnection, getManager } from 'typeorm';
// Avoid confusion between "connection" from @angular/http and "connection" from typeorm.
import { Connection as TypeormConnection } from "typeorm/connection/Connection";
import { EntityManager } from "typeorm/entity-manager/EntityManager";

export class DB {
  /**
   * Handles the database connection promise object.
   * 
   * @protected
   * @type {Promise<TypeormConnection>}
   * @memberof DB
   */
  protected db_connection: Promise<TypeormConnection>;

  /**
   * Istantiate the database connection.
   * @memberof DB
   */
  constructor() {
    this.db_connection = createConnection();
  }

  /**
   * Asyncronous database connection.
   * 
   * @returns {Promise<TypeormConnection>} 
   * @memberof DB
   */
  public async connect(): Promise<TypeormConnection> {
    return await this.db_connection;
  }

  /**
   * Returns the existing EntityManager out of an existing init.
   * 
   * @static
   * @returns {EntityManager} 
   * @memberof DB
   */
  public static retrieveManager(): EntityManager {
    return getManager();
  }
}

