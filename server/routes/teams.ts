import { checkAuth } from "./auth";
import { Router } from "express";
import { TeamResponse } from "../models/responses/teams.response.model";
import { CITeamsRepo } from "../db/repositories/db.ci.teams.repo";
import { getCustomRepository } from "typeorm";
import { DBTeam } from "../db/entity/db.team";
import { RESPONSE_STATUS } from "../models/enums/response.statuses";
import { Serialize } from "cerialize";

const teamsRouter: Router = Router();

/**
 * Manages the logout and destroyes the session
 */
teamsRouter.get("/teamsList", checkAuth, async (req, res) => {
  const response =  new TeamResponse();
  const teamsRepo: CITeamsRepo = getCustomRepository(CITeamsRepo);
  try {
    // acquire all the available teams
    console.log('inside teams list');
    const teamsList = await teamsRepo.selectAll();
    // convert the teams to the default instance, then set it to the correct response field.
    response.teamsList = teamsList.map((t: DBTeam) => {
      return t._transform();
    });
    // Cool. If everything is okay, set the response to ok.
    response.status = RESPONSE_STATUS.OK;
  }
  catch (e) {
    console.log('An exception occurred while elaborating a client teamsList request, the error is:');
    console.log(e);
    response.teamsList = [];
    response.status = RESPONSE_STATUS.ERROR;
  }
  res.send(JSON.stringify(Serialize(response)));
});

export { teamsRouter };