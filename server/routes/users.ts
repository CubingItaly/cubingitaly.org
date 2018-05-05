import { Router } from "express";
import { app } from "../app";
import { CiUsersRepo } from "../db/repositories/db.ci.users.repo";
import { getCustomRepository } from "typeorm";



const usersRouter: Router = Router();


usersRouter.get("/:id/basic", (req, res) => {
    let user_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
    user_repo.findSimplifiedUserById(req.params.id).then(user => {
        res.json(user);
    })
});

usersRouter.get("/:id/public", (req, res) => {
    let user_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
    user_repo.findPublicUserById(req.params.id).then(user => {
        res.json(user);
    })
});

usersRouter.get("/:id/complete", (req, res) => {
    let user_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
    user_repo.findCompleteUserById(req.params.id).then(user => {
        res.json(user);
    })
});


export { usersRouter }