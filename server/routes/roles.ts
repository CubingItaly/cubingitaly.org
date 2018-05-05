import { Router } from "express";
import { CIUser } from "../models/ci.user.model";
import { Deserialize } from "cerialize";
import { CITeam } from "../models/ci.team.model";
import { CITeamsRepo } from "../db/repositories/db.ci.teams.repo";
import { getCustomRepository } from "typeorm";
import { DBTeam } from "../db/entity/db.team";
import { CiUsersRepo } from "../db/repositories/db.ci.users.repo";
import { DBUser } from "../db/entity/db.user";
import { CIRolesRepo } from "../db/repositories/db.ci.roles.repo";


const rolesRouter: Router = Router();

function authController(req, res, next): void {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.json({ "error": "you are not authorized" });
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
    let user: DBUser = await user_repo.findSimplifiedUserById(id);
    return user;
}


rolesRouter.delete("/remove", authController, (req, res) => {
    getTeam(req.query.team).then(team => {
        if (canAdminTeams(req) || canManageTeam(req, team._transform())) {
            getUser(req.query.user).then(user => {
                let role_repo: CIRolesRepo = getCustomRepository(CIRolesRepo);
                let db
                role_repo.removeRole(user, team).then(() => res.json({ "ok": "deleted" })
                );
            });
        } else {
            res.json({ "error": "you can't" });
        };
    });
});

rolesRouter.post("/add", authController, (req, res) => {
    console.log("add role request received");
    getTeam(req.query.team).then(team => {
        if (canAdminTeams(req) || canManageTeam(req, team._transform())) {
            getUser(req.query.user).then(user => {
                let role_repo: CIRolesRepo = getCustomRepository(CIRolesRepo);
                let leader: boolean = req.query.leader || false;
                role_repo.addRole(user, team, leader).then(() => res.json({ "ok": "deleted" })
                );
            });
        } else {
            res.json({ "error": "you can't" });
        }
    });
});





export { rolesRouter };