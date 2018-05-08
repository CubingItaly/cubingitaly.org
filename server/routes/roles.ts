import { Router } from "express";
import { CIUser } from "../models/ci.user.model";
import { Deserialize, Serialize } from "cerialize";
import { CITeam } from "../models/ci.team.model";
import { CITeamsRepo } from "../db/repositories/db.ci.teams.repo";
import { getCustomRepository } from "typeorm";
import { DBTeam } from "../db/entity/db.team";
import { CiUsersRepo } from "../db/repositories/db.ci.users.repo";
import { DBUser } from "../db/entity/db.user";
import { CIRolesRepo } from "../db/repositories/db.ci.roles.repo";
import { DBRole } from "../db/entity/db.role";
import { GenericResponse } from "../models/responses/generic.response.model";
import { RESPONSE_STATUS } from "../models/enums/response.statuses";


const rolesRouter: Router = Router();

function authController(req, res, next): void {
    if (req.isAuthenticated()) {
        next();
    } else {
        let response: GenericResponse = new GenericResponse();
        response.status = RESPONSE_STATUS.ERROR
        response.error = "User not logged in";
        res.status(403);
        res.json(response);
    }
}

function canAdminTeams(req): boolean {
    let user: CIUser = Deserialize(req.user, CIUser);
    return user.canAdminTeams();
}

function canManageTeam(req, team: CITeam): boolean {
    let user: CIUser = Deserialize(req.user, CIUser);
    return user.canManageTeam(team);
}

async function getTeam(id: string): Promise<DBTeam> {
    let team_repo: CITeamsRepo = getCustomRepository(CITeamsRepo);
    let team: DBTeam = await team_repo.findTeamById(id);
    return team;
}

async function getUser(id: number): Promise<DBUser> {
    let user_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
    let user: DBUser = await user_repo.findShortUserById(id);
    return user;
}

rolesRouter.delete("/:team/members/:member",authController, async (req, res) => {
    const response: GenericResponse = new GenericResponse();

    const db_team: DBTeam = await getTeam(req.params.team);
    const db_user: DBUser = await getUser(req.params.member);

    if (canAdminTeams(req) || canManageTeam(req, db_team._transform())) {
        try {
            let role_repo: CIRolesRepo = getCustomRepository(CIRolesRepo);
            await role_repo.removeRole(db_user, db_team);
            response.status = RESPONSE_STATUS.OK;
        } catch (e) {
            response.status = RESPONSE_STATUS.ERROR;
            response.error = "An error occurred while processing the request " + e;
        }
    } else {
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "Action not allowed";
        res.status(403);
    }
    res.send(JSON.stringify(Serialize(response)));
});

rolesRouter.post("/:team/members", authController, async (req, res) => {
    const response: GenericResponse = new GenericResponse();

    const db_team: DBTeam = await getTeam(req.params.team);
    const db_user: DBUser = await getUser(req.body.member);

    if (canAdminTeams(req) || canManageTeam(req, db_team._transform())) {
        let role_repo: CIRolesRepo = getCustomRepository(CIRolesRepo);
        await role_repo.addRole(db_user, db_team, false);
        response.status = RESPONSE_STATUS.OK
    } else {
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "Action not allowed";
        res.status(403);
    }

    res.send(JSON.stringify(Serialize(response)));
});

rolesRouter.put("/:team/leaders/:member", authController, async (req, res) => {
    const response: GenericResponse = new GenericResponse();

    const db_team: DBTeam = await getTeam(req.params.team);
    const db_user: DBUser = await getUser(req.params.member);
    const leader: boolean = req.body.leader || false;

    if (canAdminTeams(req)) {
        try {
            let role_repo: CIRolesRepo = getCustomRepository(CIRolesRepo);
            if (leader) {
                await role_repo.promoteLeader(db_user, db_team);
            } else {
                await role_repo.demoteLeader(db_user, db_team);
            }
            response.status = RESPONSE_STATUS.OK
        } catch (e) {
            response.status = RESPONSE_STATUS.ERROR;
            response.error = "An error occurred while processing the request " + e;
        }
    } else {
        response.status = RESPONSE_STATUS.ERROR;
        response.error = "Action not allowed";
        res.status(403);
    }

    res.send(JSON.stringify(Serialize(response)));
});





export { rolesRouter };