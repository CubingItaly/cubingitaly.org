import { BaseEntity } from "typeorm/repository/BaseEntity";
import { DefaultRouter } from "./DefaultRouter.class";
import { GenericResponse } from "../models/responses/generic.response";
import { RequestHandler, RequestHandlerParams } from "express-serve-static-core";

/**
 * Defines the common EntityRoute definition, allowing to create custom routers by following
 * the default interface that should be followed in order to properly implement each entity.
 * 
 * @export
 * @abstract
 * @class EntityRouter
 * @extends {DefaultRouter}
 * @template T 
 */
export abstract class EntityRouter<T extends BaseEntity> extends DefaultRouter {
  /**
   * Defines the current entity name.
   * This parameter will be used to automatically build the call URIs.
   * 
   * @abstract
   * @type {string}
   * @memberof EntityRouter
   */
  public abstract entityName: string;

  /**
   * Default constructor.
   * @memberof EntityRouter
   */
  constructor() {
    super();
  }

  /**
   * Forces the implementation of the listRouteDefinition.
   * 
   * @abstract
   * @type {RequestHandlerParams}
   * @memberof EntityRouter
   */
  public abstract listRouteDefinition: RequestHandlerParams;

  /**
   * Allows the implementation of the getRouteDefinition.
   * 
   * @abstract
   * @type {RequestHandlerParams}
   * @memberof EntityRouter
   */
  public abstract getRouteDefinitions?: RequestHandlerParams;

  /**
   * Inits the local relative paths automatically.
   * 
   * @memberof EntityRouter
   */
  public initRelativePaths(): void {
    this.routerObj.get('/' + this.entityName + 'List', this.listRouteDefinition);
    
    this.getRouteDefinitions && this.routerObj.get('/' + this.entityName + 'Get', this.getRouteDefinitions);
  }
}