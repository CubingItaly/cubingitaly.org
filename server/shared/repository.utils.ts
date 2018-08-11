import { UserRepository } from "../db/repositories/user.repository";
import { getCustomRepository } from "typeorm";
import { TeamRepository } from "../db/repositories/team.repository";
import { UserModel } from "../models/classes/user.model";
import { UserEntity } from "../db/entity/user.entity";
import { TeamModel } from "../models/classes/team.model";
import { TeamEntity } from "../db/entity/team.entity";
import { RoleRepository } from "../db/repositories/role.repository";
import { RoleModel } from "../models/classes/role.model";
import { RoleEntity } from "../db/entity/role.entity";
import { ArticleCategoryRepository } from "../db/repositories/category.repository";
import { ArticleCategoryModel } from "../models/classes/category.model";
import { ArticleCategoryEntity } from "../db/entity/category.entity";

export function getUserRepository(): UserRepository {
    return getCustomRepository(UserRepository);
}

export function getUserEntity(user: UserModel): UserEntity {
    let dbUser: UserEntity = new UserEntity();
    dbUser._assimilate(user);
    return dbUser;
}

export function getTeamRepository(): TeamRepository {
    return getCustomRepository(TeamRepository);
}

export function getTeamEntity(team: TeamModel): TeamEntity {
    let dbTeam: TeamEntity = new TeamEntity();
    dbTeam._assimilate(team);
    return dbTeam;
}

export function getRoleRepository(): RoleRepository {
    return getCustomRepository(RoleRepository);
}

export function getRoleEntity(role: RoleModel): RoleEntity {
    let dbRole: RoleEntity = new RoleEntity();
    dbRole._assimilate(role);
    return dbRole;
}

export function getCategoryRepository(): ArticleCategoryRepository {
    return getCustomRepository(ArticleCategoryRepository);
}

export function getCategoryEntity(category: ArticleCategoryModel): ArticleCategoryEntity {
    let dbCategory: ArticleCategoryEntity = new ArticleCategoryEntity();
    dbCategory._assimilate(category);
    return dbCategory;
}