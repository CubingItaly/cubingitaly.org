import { Router } from "express";
import { CITeamsRepo } from "../db/repositories/db.ci.teams.repo";
import { getCustomRepository } from "typeorm";
import { DBTeam } from "../db/entity/db.team";
import { CiUsersRepo } from "../db/repositories/db.ci.users.repo";
import { CIUser } from "../models/ci.user.model";
import { CITeam } from "../models/ci.team.model";
import { TeamResponse } from "../models/responses/team.response.model";
import { TeamsResponse } from "../models/responses/teams.response.model";
import { RESPONSE_STATUS } from "../models/enums/response.statuses";
import { Serialize } from "cerialize";
import { UsersResponse } from "../models/responses/users.response.model";

const teamsRouter: Router = Router();


teamsRouter.get("/", (req, res) => {
    let team_repo: CITeamsRepo = getCustomRepository(CITeamsRepo);
    team_repo.findTeams().then(db_teams => {
        let teams: CITeam[] = [];
        db_teams.forEach(db_team => teams.push(db_team._transform()));
        let response: TeamsResponse = new TeamsResponse();
        response.status = RESPONSE_STATUS.OK;
        response.teams = teams;
        res.send(JSON.stringify(Serialize(response)));
    });
});

teamsRouter.get("/:id", (req, res) => {
    let team_repo: CITeamsRepo = getCustomRepository(CITeamsRepo);
    team_repo.findTeamById(req.params.id).then(db_team => {
        let team: CITeam = db_team._transform();
        let response: TeamResponse = new TeamResponse();
        response.status = RESPONSE_STATUS.OK;
        response.team = team;
        res.send(JSON.stringify(Serialize(response)));
    });
});

teamsRouter.get("/:id/members", (req, res) => {
    let team_repo: CITeamsRepo = getCustomRepository(CITeamsRepo);
    team_repo.findTeamById(req.params.id).then(db_team => {
        let user_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
        user_repo.findAllByTeam(db_team).then(db_users => {
            let users: CIUser[] = [];
            db_users.forEach(db_user => users.push(db_user._transform()));
            let response: UsersResponse = new UsersResponse();
            response.status = RESPONSE_STATUS.OK;
            response.users = users;
            res.json(db_users);
        });
    });
});




export { teamsRouter };
