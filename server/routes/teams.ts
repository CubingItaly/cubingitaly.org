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
import { DBUser } from "../db/entity/db.user";

const teamsRouter: Router = Router();


teamsRouter.get("/", async (req, res) => {
    const response: TeamsResponse = new TeamsResponse();
    const team_repo: CITeamsRepo = getCustomRepository(CITeamsRepo);
    try {
        let db_teams: DBTeam[] = await team_repo.findTeams();
        response.teams = db_teams.map((t: DBTeam) => {
            return t._transform();
        });
        response.status = RESPONSE_STATUS.OK;
    } catch (e) {
        response.error = "An error occurred while processing the request";
        response.status = RESPONSE_STATUS.ERROR;
    }
    res.send(JSON.stringify(Serialize(response)));
});

teamsRouter.get("/:id", async (req, res) => {
    const response: TeamResponse = new TeamResponse();
    const team_repo: CITeamsRepo = getCustomRepository(CITeamsRepo);
    try {
        let db_team: DBTeam = await team_repo.findTeamById(req.params.id);
        response.team = db_team._transform();
        response.status = RESPONSE_STATUS.OK;
    } catch (e) {
        response.error = "An error occurred while processing the request";
        response.status = RESPONSE_STATUS.ERROR;
    }
    res.send(JSON.stringify(Serialize(response)));
});

teamsRouter.get("/:id/members", async (req, res) => {
    const response: UsersResponse = new UsersResponse();
    const team_repo: CITeamsRepo = getCustomRepository(CITeamsRepo);
    const user_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
    try {
        let team: DBTeam = await team_repo.findTeamById(req.params.id);
        let db_users: DBUser[] = await user_repo.findAllByTeam(team);
        response.users = db_users.map((u: DBUser) => {
            return u._transform();
        });
        response.status = RESPONSE_STATUS.OK;
    } catch (e) {
        response.error = "An error occurred while processing the request";
        response.status = RESPONSE_STATUS.ERROR;
    }
    res.send(JSON.stringify(Serialize(response)));
});




export { teamsRouter };
