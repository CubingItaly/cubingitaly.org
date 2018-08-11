import { BaseCommonRepository } from "./BaseCommonRepository";
import { getCustomRepository } from "typeorm";
import { BaseEntity } from "typeorm/repository/BaseEntity";
import { TeamRepository } from "./repositories/team.repository";
import { ArticleCategoryRepository } from "./repositories/category.repository";
import { UserRepository } from "./repositories/user.repository";
import { RoleRepository } from "./repositories/role.repository";
import { ArticleRepository } from "./repositories/article.repository";
import { SinglePageRepository } from "./repositories/singlepage.repository";
import { PageCollectionRepository } from "./repositories/pagecollection.repository";

/**
 * Holds all the custom repositories that needs to run a custom function check when the database connection is available (init).
 * 
 * @export
 * @returns {BaseCommonRepository<BaseEntity>[]} 
 */
export function _BOOTSTRAPS(): BaseCommonRepository<BaseEntity>[] {
  return [
    getCustomRepository(UserRepository),
    getCustomRepository(TeamRepository),
    getCustomRepository(ArticleCategoryRepository),
    getCustomRepository(RoleRepository),
    getCustomRepository(ArticleRepository),
    getCustomRepository(SinglePageRepository),
    getCustomRepository(PageCollectionRepository)
  ];
}