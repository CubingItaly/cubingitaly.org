import { BaseCommonRepository } from "./BaseCommonRepository";
import { getCustomRepository } from "typeorm";
import { BaseEntity } from "typeorm/repository/BaseEntity";
import { TeamRepository } from "./repository/team.repository";
import { ArticleCategoryRepository } from "./repository/category.repository";
import { UserRepository } from "./repository/user.repository";
import { RoleRepository } from "./repository/role.repository";
import { ArticleRepository } from "./repository/article.repository";
import { PageRepository } from "./repository/page.repository";
import { TutorialRepository } from "./repository/tutorial.repository";

/**
 * Holds all the custom repository that needs to run a custom function check when the database connection is available (init).
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
    getCustomRepository(PageRepository),
    getCustomRepository(TutorialRepository)
  ];
}