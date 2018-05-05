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
import { usersRouter } from "./users";

const teamsRouter: Router = Router();


teamsRouter.get("/", async (req, res) => {
    let team_repo: CITeamsRepo = getCustomRepository(CITeamsRepo);
    let db_teams: DBTeam[] = await team_repo.findTeams();
    let teams: CITeam[] = [];
    db_teams.forEach(team => teams.push(team._transform()));
    let response: TeamsResponse = new TeamsResponse();
    response.status = RESPONSE_STATUS.OK;
    response.teams = teams;
    res.send(JSON.stringify(Serialize(teams)));
});

teamsRouter.get("/:id", async (req, res) => {
    let team_repo: CITeamsRepo = getCustomRepository(CITeamsRepo);
    let db_team: DBTeam = await team_repo.findTeamById(req.params.id);
    let response: TeamResponse = new TeamResponse();
    response.status = RESPONSE_STATUS.OK;
    response.team = db_team._transform();
    res.send(JSON.stringify(Serialize(response)));
});

teamsRouter.get("/:id/members", async (req, res) => {
    let team_repo: CITeamsRepo = getCustomRepository(CITeamsRepo);
    let team: DBTeam = await team_repo.findTeamById(req.params.id);

    let user_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
    let db_users: DBUser[] = await user_repo.findAllByTeam(team);

    let users: CIUser[] = [];
    db_users.forEach(db_user => users.push(db_user._transform()));

    let response: UsersResponse = new UsersResponse();
    response.status = RESPONSE_STATUS.OK;
    response.users = users;
    res.send(JSON.stringify(Serialize(response)));
});




export { teamsRouter };
