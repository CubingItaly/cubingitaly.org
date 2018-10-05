import { Router, Request, Response } from "express";
import { verifyLogin, getUser, isLoggedIn } from "../../shared/login.utils";
import { TeamRepository } from "../../db/repository/team.repository";
import { TeamEntity } from "../../db/entity/team.entity";
import { TeamModel } from "../../models/classes/team.model";
import { sendError } from "../../shared/error.utils";
import { UserRepository } from "../../db/repository/user.repository";
import { UserEntity } from "../../db/entity/user.entity";
import { UserModel } from "../../models/classes/user.model";
import { getCustomRepository } from "typeorm";
import { RoleRepository } from "../../db/repository/role.repository";
import { RoleEntity } from "../../db/entity/role.entity";

const router: Router = Router();

/**
 * Instantiates a UserRepository and return it
 *
 * @returns {UserRepository}
 */
function getUserRepository(): UserRepository {
    const repository: UserRepository = getCustomRepository(UserRepository);
    return repository;
}

/**
 * Instantiates a TeamRepository and return it
 *
 * @returns {TeamRepository}
 */
function getTeamRepository(): TeamRepository {
    const repository: TeamRepository = getCustomRepository(TeamRepository);
    return repository;
}

/**
 * Instantiate a RoleRepository and return it
 *
 * @returns {RoleRepository}
 */
function getRoleRepository(): RoleRepository {
    const repository: RoleRepository = getCustomRepository(RoleRepository);
    return repository;
}

/**
 * Check in the databse if the team exists
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function checkIfTeamExist(req, res, next) {
    const teamRepo: TeamRepository = getTeamRepository();
    let exist: boolean = await teamRepo.checkIfTeamExistsById(req.params.team);
    if (exist) {
        next();
    } else {
        return sendError(res, 404, "The requested team does not exist.");
    }
}

/**
 * Search for a team by id in the databse and return the entity
 *
 * @param {*} id
 * @returns {Promise<TeamEntity>}
 */
async function getTeam(id): Promise<TeamEntity> {
    const teamRepo: TeamRepository = getTeamRepository();
    return await teamRepo.getTeamById(id);
}

/**
 * Search for user by id in the database and return the entity
 *
 * @param {*} id
 * @returns {Promise<UserEntity>}
 */
async function getMember(id): Promise<UserEntity> {
    const userRepo: UserRepository = getUserRepository();
    return await userRepo.getUserById(Number(id));
}

/**
 * Check if the user can manage a team, if he can call the next function.
 * If the user hasn't the permissions, return error 403.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function checkIfCanManageTeam(req, res, next) {
    let dbTeam: TeamEntity = await getTeam(req.params.team);
    let user: UserModel = getUser(req);
    if (user.canManageTeam(dbTeam._transform())) {
        next();
    } else {
        return sendError(res, 403, "Operation not authorized, you don't have enough permissions to perform this request.");
    }
}

/**
 * Checks if the user can admin a team, if he can call the next function.
 * If the user hasn't the permissions, return error 403.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function checkIfCanAdminTeam(req, res, next) {
    let user: UserModel = getUser(req);
    if (user.canAdminTeams()) {
        next();
    } else {
        return sendError(res, 403, "Operation not authorized, you don't have enough permissions to perform this request.");
    }
}

/**
 * Check if the request is well formed and if the user id was sent within the body.
 * If the user is not present, return error 400.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function checkIfUserIsInTheRequest(req, res, next) {
    let member: number = Number(req.body.member) || null;
    if (member !== null && member !== undefined) {
        next();
    }
    else {
        return sendError(res, 400, "Bad request. The request is malformed.");
    }
}

/**
 * Check if a member exists for the id sent in the request
 * If it doesn't exist, return a 404 error.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function checkIfUserExist(req, res, next) {
    let member: number = req.params.member || req.body.member;
    const userRepo: UserRepository = getUserRepository();
    let exist: boolean = await userRepo.checkIfUserExists(Number(member));
    if (exist) {
        next();
    } else {
        return sendError(res, 404, "The requested user does not exist");
    }
}


/**
 * Get the list of all the teams, without the roles 
 */
router.get("/", async (req: Request, res: Response) => {
    let dbTeams: TeamEntity[] = await getTeamRepository().getTeams();
    let modelTeams: TeamModel[] = dbTeams.map((team: TeamEntity) => team._transform());
    return res.status(200).json(modelTeams);
});


/**
 * Get a specific team with no roles
 */
router.get("/:team", checkIfTeamExist, async (req: Request, res: Response) => {
    let dbTeam: TeamEntity = await getTeamRepository().getTeamById(req.params.team);
    return res.status(200).json(dbTeam._transform());
});


/**
 * Get the list of the roles of a specific team
 */
router.get("/:team/members", checkIfTeamExist, async (req: Request, res: Response) => {
    let dbTeam: TeamEntity = await getTeamRepository().getTeamById(req.params.team);
    let dbUsers: UserEntity[] = await getUserRepository().findUsersByTeam(dbTeam);
    let modelUsers: UserModel[] = dbUsers.map((user: UserEntity) => user._transform());
    return res.status(200).json(modelUsers);
});


/**
 * Add a new member to a team
 * The member's id is passed in the body
 */
router.post("/:team/members", verifyLogin, checkIfTeamExist, checkIfCanManageTeam, checkIfUserIsInTheRequest, checkIfUserExist, async (req: Request, res: Response) => {
    let team: TeamEntity = await getTeam(req.params.team);
    let user: UserEntity = await getMember(req.body.member);
    let role: RoleEntity = await getRoleRepository().addRole(user, team);
    return res.status(200).json(role._transform());
});


/**
 * Remove a member from a team
 */
router.delete("/:team/members/:member", verifyLogin, checkIfTeamExist, checkIfCanManageTeam, checkIfUserExist, async (req: Request, res: Response) => {
    let team: TeamEntity = await getTeam(req.params.team);
    let user: UserEntity = await getMember(req.params.member);
    await getRoleRepository().removeRole(user, team);
    return res.status(200).send({});
});


/**
 * Add a leader to a team, if he's not in the team also add him
 */
router.put("/:team/leaders", verifyLogin, checkIfTeamExist, checkIfCanAdminTeam, checkIfUserExist, async (req: Request, res: Response) => {
    let team: TeamEntity = await getTeam(req.params.team);
    let user: UserEntity = await getMember(req.body.member);
    let role: RoleEntity = await getRoleRepository().addLeader(user, team);
    return res.status(200).json(role._transform());
});


/**
 * Demote a user from leader of a team to a simple member
 */
router.delete("/:team/leaders/:member", verifyLogin, checkIfTeamExist, checkIfCanAdminTeam, checkIfUserExist, async (req: Request, res: Response) => {
    let team: TeamEntity = await getTeam(req.params.team);
    let user: UserEntity = await getMember(req.params.member);
    let role: RoleEntity = await getRoleRepository().removeLeader(user, team);
    return res.status(200).json(role);
});

export { router }