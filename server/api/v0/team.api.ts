import { Router, Request, Response } from "express";
import { verifyLogin, getUser } from "../../shared/login.utils";
import { TeamRepository } from "../../db/repositories/team.repository";
import { TeamEntity } from "../../db/entity/team.entity";
import { TeamModel } from "../../models/classes/team.model";
import { return404, return403, return400 } from "../../shared/error.utils";
import { UserRepository } from "../../db/repositories/user.repository";
import { UserEntity } from "../../db/entity/user.entity";
import { UserModel } from "../../models/classes/user.model";
/** We need this even if it's not used because otherwise we can't access to some methods and attributes */
import * as passport from "passport";
import { getCustomRepository } from "typeorm";
import { RoleRepository } from "../../db/repositories/role.repository";
import { RoleEntity } from "../../db/entity/role.entity";

const router: Router = Router();

/**
 * Instantiates a UserRepository and returns it
 *
 * @returns {UserRepository}
 */
function getUserRepository(): UserRepository {
    const repository: UserRepository = getCustomRepository(UserRepository);
    return repository;
}

/**
 * Instantiates a TeamRepository and returns it
 *
 * @returns {TeamRepository}
 */
function getTeamRepository(): TeamRepository {
    const repository: TeamRepository = getCustomRepository(TeamRepository);
    return repository;
}

/**
 * Instantiates a RoleRepository and returns it
 *
 * @returns {RoleRepository}
 */
function getRoleRepository(): RoleRepository {
    const repository: RoleRepository = getCustomRepository(RoleRepository);
    return repository;
}

/**
 * Checks in the databse if the team exists
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function checkIfTeamExist(req, res, next) {
    const teamRepo: TeamRepository = getTeamRepository();
    let exist: boolean = await teamRepo.checkIfTeamExistsById(req.params.team || "");
    if (exist) {
        next();
    } else {
        return404(res);
    }
}

/**
 * Searchs for a team by id in the databse and return the entity
 *
 * @param {*} id
 * @returns {Promise<TeamEntity>}
 */
async function getTeam(id): Promise<TeamEntity> {
    const teamRepo: TeamRepository = getTeamRepository();
    return await teamRepo.getTeamById(id);
}

/**
 * Searchs for user by id in the database and return the entity
 *
 * @param {*} id
 * @returns {Promise<UserEntity>}
 */
async function getMember(id): Promise<UserEntity> {
    const userRepo: UserRepository = getUserRepository();
    return await userRepo.getUserById(id);
}

/**
 * Checks if the user can manage a team, if he can calls the next function
 * If the user hasn't the permissions, returns 403 error.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function checkIfCanManageTeam(req, res, next) {
    let dbTeam: TeamEntity = await getTeam(req.params.team);
    let user: UserModel = getUser(req);
    if (user.canManageTeam(dbTeam._transform()) || user.canAdminTeams) {
        next();
    } else {
        return403(res);
    }
}

/**
 * Checks if the user can admin a team, if he can calls the next function
 * If the user hasn't the permissions, returns 403 error.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function checkIfCanAdminTeam(req, res, next) {
    let dbTeam: TeamEntity = await getTeam(req.params.team);
    let user: UserModel = getUser(req);
    if (user.canAdminTeams) {
        next();
    } else {
        return403(res);
    }
}

/**
 * Checks if the request is well formed and the user id was sent within the body
 * If the user is not present, returns a 400 error.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function checkIfUserIsInTheRequest(req, res, next) {
    let member: number = req.body.member || null;
    if (member !== null && member !== undefined) {
        next();
    }
    else {
        return400(res);
    }
}

/**
 * Checks if a member exists for the id sent in the request
 * If it doesn't exist, return a 404 error.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function checkIfUserExist(req, res, next) {
    let member: number = req.params.member || req.body.member;
    const userRepo: UserRepository = getUserRepository();
    let exist: boolean = await userRepo.checkIfUserExistsById(member);
    if (exist) {
        next();
    } else {
        return404(res);
    }
}


/**
 * Get the list of all the teams, without the roles 
 */
router.get("/", async (req: Request, res: Response) => {
    const teamRepo: TeamRepository = getTeamRepository();
    let dbTeams: TeamEntity[] = await teamRepo.getTeams();
    console.log(dbTeams);
    let modelTeams: TeamModel[] = dbTeams.map((team: TeamEntity) => team._transform());
    res.status(200).json(modelTeams);
});


/**
 * Gets a specific team with no roles
 */
router.get("/:team", async (req: Request, res: Response) => {
    const teamRepo: TeamRepository = getTeamRepository();
    let exist: boolean = await teamRepo.checkIfTeamExistsById(req.params.team || "");
    if (exist) {
        let dbTeam: TeamEntity = await teamRepo.getTeamById(req.params.team);
        res.status(200).json(dbTeam._transform());
    } else {
        return404(res);
    }
});


/**
 * Gets the list of the roles of a specific team
 */
router.get("/:team/members", async (req: Request, res: Response) => {
    const teamRepo: TeamRepository = getTeamRepository();
    let exist: boolean = await teamRepo.checkIfTeamExistsById(req.params.team || "");
    if (exist) {
        const userRepo: UserRepository = getUserRepository();
        let dbTeam: TeamEntity = await teamRepo.getTeamById(req.params.team);
        let dbUsers: UserEntity[] = await userRepo.findUsersByTeam(dbTeam);
        let modelUsers: UserModel[] = dbUsers.map((user: UserEntity) => user._transform());
        res.status(200).json(modelUsers);
    } else {
        return404(res);
    }
});


/**
 * Add a new member to a team
 * The member's id is passed in the body
 */
router.post("/:team/members", verifyLogin, checkIfTeamExist, checkIfCanManageTeam, checkIfUserIsInTheRequest, checkIfUserExist, async (req: Request, res: Response) => {
    const roleRepo: RoleRepository = getRoleRepository();
    let team: TeamEntity = await getTeam(req.params.team);
    let user: UserEntity = await getMember(req.params.member);
    let role: RoleEntity = await roleRepo.addRole(user, team);
    res.status(200).json(role._transform());
});


/**
 * Remove a member from a team
 */
router.delete("/:team/members/:member", verifyLogin, checkIfTeamExist, checkIfCanManageTeam, checkIfUserExist, async (req: Request, res: Response) => {
    const roleRepo: RoleRepository = getRoleRepository();
    let team: TeamEntity = await getTeam(req.params.team);
    let user: UserEntity = await getMember(req.params.member);
    await roleRepo.removeRole(user, team);
    res.status(200);
});


/**
 * Add a leader to a team, if he's not in the team also adds him
 */
router.put("/:team/leaders", verifyLogin, checkIfTeamExist, checkIfCanAdminTeam, checkIfUserExist, async (req: Request, res: Response) => {
    const roleRepo: RoleRepository = getRoleRepository();
    let team: TeamEntity = await getTeam(req.params.team);
    let user: UserEntity = await getMember(req.params.member);
    let role: RoleEntity = await roleRepo.addLeader(user, team);
    res.status(200).json(role._transform());
});


/**
 * Demote a user from leader of a team to a simple member
 */
router.delete("/:team/leaders/:member", verifyLogin, checkIfTeamExist, checkIfCanAdminTeam, checkIfUserExist, async (req: Request, res: Response) => {
    const roleRepo: RoleRepository = getRoleRepository();
    let team: TeamEntity = await getTeam(req.params.team);
    let user: UserEntity = await getMember(req.params.member);
    await roleRepo.removeLeader(user, team);
});

export { router }