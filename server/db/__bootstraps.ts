import { ci_teams_repo } from "./repositories/ci_teams_repo";
import { ci_users_repo } from "./repositories/ci_users_repo";
import { BaseCommonRepository } from "./BaseCommonRepository";
import { getCustomRepository } from "typeorm";
import { BaseEntity } from "typeorm/repository/BaseEntity";

/**
 * Holds all the custom repositories that needs to run a custom function check when the database connection is available (init).
 * 
 * @export
 * @returns {BaseCommonRepository<BaseEntity>[]} 
 */
export function _BOOTSTRAPS(): BaseCommonRepository<BaseEntity>[] {
  return [
    getCustomRepository(ci_teams_repo),
    getCustomRepository(ci_users_repo)
  ];
}