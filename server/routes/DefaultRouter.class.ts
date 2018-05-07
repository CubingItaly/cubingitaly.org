import { IRouterMatcher, Router } from "express";

/**
 * Defines the common pattern that each single router should respect.
 * 
 * @export
 * @abstract
 * @class DefaultRouter
 */
export abstract class DefaultRouter {
  /**
   * Defines the absolute path of this router.
   * 
   * @abstract
   * @type {string}
   * @memberof DefaultRouter
   */
  public abstract absolutePath: string;

  /**
   * Handles the router object instance.
   * 
   * @protected
   * @type {Router}
   * @memberof DefaultRouter
   */
  protected routerObj: Router;

  /**
   * Creates a new instance of the local router.
   * @memberof DefaultRouter
   */
  constructor() {
    this.routerObj = Router();
  }

  /**
   * Defines the available relative paths of this router.
   * 
   * @abstract
   * @memberof DefaultRouter
   */
  public abstract initRelativePaths(): void;

  /**
   * Inits the relative paths and returns the elaborated router.
   * 
   * @returns {Router} 
   * @memberof DefaultRouter
   */
  public getRouter(): Router {
    this.initRelativePaths();
    return this.routerObj;
  }
}
