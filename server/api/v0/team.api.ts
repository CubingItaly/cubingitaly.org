import { Router, Request, Response } from "express";
import { Serialize } from "cerialize";
import * as permissionsUtil from '../../shared/permission.utils';
import * as loginUtil from '../../shared/login.utils';
import { getTeamRepository, getUserRepository } from "../../shared/repository.utils";
import { TeamRepository } from "../../db/repositories/team.repository";
import { TeamEntity } from "../../db/entity/team.entity";
import { TeamModel } from "../../models/classes/team.model";
import { return404 } from "../../shared/error.utils";
import { UserRepository } from "../../db/repositories/user.repository";
import { UserEntity } from "../../db/entity/user.entity";
import { UserModel } from "../../models/classes/user.model";

const router: Router = Router();


/**
 * Get the list of all the teams, without the roles 
 */
router.get("/", async (req: Request, res: Response) => {
    const teamRepo: TeamRepository = getTeamRepository();
    let dbTeams: TeamEntity[] = await teamRepo.getTeams();
    console.log(dbTeams);
    let modelTeams: TeamModel[] = dbTeams.map((team: TeamEntity) => team._transform());
    res.status(200).send(modelTeams);
});


/**
 * Gets a specific team with no roles
 */
router.get("/:team", async (req: Request, res: Response) => {
    const teamRepo: TeamRepository = getTeamRepository();
    let exist: boolean = await teamRepo.checkIfTeamExistsById(req.params.team || "");
    if (exist) {
        let dbTeam: TeamEntity = await teamRepo.getTeamById(req.params.team);
        res.status(200).send(dbTeam._transform());
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
        res.status(200).send(modelUsers);
    } else {
        return404(res);
    }
});


/**
 * Add a new member to a team
 */
router.post("/:team/members", loginUtil.verifyLogin, async (req: Request, res: Response) => {

});


/**
 * Remove a member from a team
 */
router.delete("/:team/members/:member", loginUtil.verifyLogin, async (req: Request, res: Response) => {

});


/**
 * Add a leader to a team, if he's not in the team also adds him
 */
router.put("/:team/leaders", loginUtil.verifyLogin, async (req: Request, res: Response) => {

});


/**
 * Demote a user from leader of a team to a simple user
 */
router.delete("/:team/leaders/:member", loginUtil.verifyLogin, async (req: Request, res: Response) => {

});

export { router }