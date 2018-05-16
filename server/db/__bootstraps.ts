import { BaseCommonRepository } from "./BaseCommonRepository";
import { getCustomRepository } from "typeorm";
import { BaseEntity } from "typeorm/repository/BaseEntity";
import { CITeamsRepo } from "./repositories/db.ci.teams.repo";
import { CiUsersRepo } from "./repositories/db.ci.users.repo";
import { CIRolesRepo } from "./repositories/db.ci.roles.repo";
import { CIArticleCategoriesRepository } from "./repositories/db.ci.article.categories.repo";
import { CIArticlesRepository } from "./repositories/db.ci.article.repo";

/**
 * Holds all the custom repositories that needs to run a custom function check when the database connection is available (init).
 * 
 * @export
 * @returns {BaseCommonRepository<BaseEntity>[]} 
 */
export function _BOOTSTRAPS(): BaseCommonRepository<BaseEntity>[] {
  return [
    getCustomRepository(CITeamsRepo),
    getCustomRepository(CIArticleCategoriesRepository),
    getCustomRepository(CiUsersRepo),
    getCustomRepository(CIRolesRepo),
    getCustomRepository(CIArticlesRepository)
  ];
}