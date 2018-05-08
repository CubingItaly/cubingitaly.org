import { Router } from "express";
import { app } from "../app";
import { CiUsersRepo } from "../db/repositories/db.ci.users.repo";
import { getCustomRepository } from "typeorm";
import { DBUser } from "../db/entity/db.user";
import { GenericResponse } from "../models/responses/generic.response.model";
import { RESPONSE_STATUS } from "../models/enums/response.statuses";
import { CIUser } from "../models/ci.user.model";
import { Deserialize, Serialize } from "cerialize";
import { UserResponse } from "../models/responses/user.response.model";
import { UsersResponse } from "../models/responses/users.response.model";



const usersRouter: Router = Router();

function authController(req, res, next): void {
    if (req.isAuthenticated()) {
        next();
    } else {
        let response: UserResponse = new UserResponse();
        response.status = RESPONSE_STATUS.ERROR
        response.error = "User not logged in";
        res.status(403);
        res.json(response);
    }
}

usersRouter.get("/:id", async (req, res) => {
    const response: UserResponse = new UserResponse();
    const user_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);

    try {
        let db_user: DBUser = await user_repo.findUserById(req.params.id);
        response.user = db_user._transform();
        response.status = RESPONSE_STATUS.OK
    } catch (e) {
        response.error = "An error occurred while processing the request"
        response.status = RESPONSE_STATUS.ERROR;
    }

    res.send(JSON.stringify(Serialize(response)));
});


usersRouter.get("/:id/short", async (req, res) => {
    const response: UserResponse = new UserResponse();
    const user_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);

    try {
        let db_user: DBUser = await user_repo.findShortUserById(req.params.id);
        response.user = db_user._transform();
        response.status = RESPONSE_STATUS.OK
    } catch (e) {
        response.error = "An error occurred while processing the request"
        response.status = RESPONSE_STATUS.ERROR;
    }

    res.send(JSON.stringify(Serialize(response)));
});


usersRouter.get("/:id/sensible", authController, async (req, res) => {
    const response: UserResponse = new UserResponse();
    let user: CIUser = Deserialize(req.user, CIUser);
    if (user.canAdminUsers()) {
        const user_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
        try {
            let db_user: DBUser = await user_repo.findSensibleUserById(req.params.id);
            response.user = db_user._transform();
            response.status = RESPONSE_STATUS.OK
        } catch (e) {
            response.error = "An error occurred while processing the request"
            response.status = RESPONSE_STATUS.ERROR;
        }
    } else {
        response.status = RESPONSE_STATUS.ERROR
        response.error = "Action not authorized";
        res.status(403);
    }

    res.send(JSON.stringify(Serialize(response)));
});

usersRouter.get("/", async (req, res) => {
    const response: UsersResponse = new UsersResponse();
    const user_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
    try {
        let db_users: DBUser[] = await user_repo.findUsersByName(req.query.name || "");
        response.users = db_users.map((u: DBUser) => u._transform());
        response.status = RESPONSE_STATUS.OK
    } catch (e) {
        response.error = "There was an erro while processing the request";
        console.log(e);
        response.status = RESPONSE_STATUS.ERROR;
    }
    res.send(JSON.stringify(Serialize(response)));
})

export { usersRouter }