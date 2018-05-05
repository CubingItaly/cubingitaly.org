import { Router } from "express";
import { app } from "../app";
import { CiUsersRepo } from "../db/repositories/db.ci.users.repo";
import { getCustomRepository } from "typeorm";
import { DBUser } from "../db/entity/db.user";
import { GenericResponse } from "../models/responses/generic.response.model";
import { RESPONSE_STATUS } from "../models/enums/response.statuses";
import { CIUser } from "../models/ci.user.model";
import { Deserialize } from "cerialize";



const usersRouter: Router = Router();

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

usersRouter.get("/:id", async (req, res) => {
    let user_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
    let db_user: DBUser = await user_repo.findUserById(req.params.id);
    res.json(db_user._transform());
});

usersRouter.get("/:id/short", async (req, res) => {
    let user_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
    let db_user: DBUser = await user_repo.findShortUserById(req.params.id);
    res.json(db_user._transform());
});


usersRouter.get("/:id/sensible", authController, async (req, res) => {
    let user: CIUser = Deserialize(req.user, CIUser);
    if (user.canAdminUsers()) {
        let user_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
        let db_user: DBUser = await user_repo.findSensibleUserById(req.params.id);
        res.json(db_user._transform());
    }else{
        let response: GenericResponse = new GenericResponse();
        response.status = RESPONSE_STATUS.ERROR
        response.error = "Action not authorized";
        res.status(403);
        res.json(response);
    }

});


export { usersRouter }