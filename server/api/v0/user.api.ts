import { Router } from "express";
import { UserModel } from "../../models/classes/user.model";
import { UserRepository } from "../../db/repositories/user.repository";
import { getCustomRepository } from "typeorm";
import { UserEntity } from "../../db/entity/user.entity";
import { return404 } from "../../shared/error.utils";

const router: Router = Router();


function getUserRepository(): UserRepository {
    const repository: UserRepository = getCustomRepository(UserRepository);
    return repository;
}


/**
 * If the user is logged in, return his information
 */
router.get("/me", (req, res) => {
    sendUserFromRepository(req, res, 0, false);
});


/**
 * Get a specific user with all his personal data including the roles
 */
router.get("/:id", async (req, res) => {
    sendUserFromRepository(req, res, req.params.id, false);
});


/**
 * Get a specific user with all his personal data but the roles
 */
router.get("/:id/short", async (req, res) => {
    sendUserFromRepository(req, res, req.params.id, true);
});

async function sendUserFromRepository(req, res, id: number, short: boolean): Promise<void> {
    let userRepo: UserRepository = getUserRepository();
    let exist: boolean = await userRepo.checkIfUserExistsById(req.params.id || "");
    if (exist) {
        let dbUser: UserEntity = short ? await userRepo.getShortUserById(id) : await userRepo.getUserById(id);
        let modelUser: UserModel = dbUser._transform();
        res.status(200).send(modelUser);
    } else {
        return404(res);
    }
}


/**
 * Search between the users and get a list  
 */
router.get("/", async (req, res) => {
    let userRepo: UserRepository = getUserRepository();
    let dbUsers: UserEntity[] = await userRepo.findUsersByName(req.query.name || "");
    let modelUsers: UserModel[] = dbUsers.map((user: UserEntity) => user._transform());
    res.status(200).send(modelUsers);
});


export { router }