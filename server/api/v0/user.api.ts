import { UserModel } from "../../models/classes/user.model";
import { UserRepository } from "../../db/repositories/user.repository";
import { getCustomRepository } from "typeorm";
import { UserEntity } from "../../db/entity/user.entity";
import { return404 } from "../../shared/error.utils";
import { Router } from "express";
/** We need this even if it's not used because otherwise we can't access to some methods and attributes */
import * as passport from "passport";
import { verifyLogin } from "../../shared/login.utils";
const router: Router = Router();

/**
 * Instantiates a UserRepository and returns it
 *
 * @returns {UserRepository}
 */
function getUserRepository(): UserRepository {
    const repository: UserRepository = getCustomRepository(UserRepository);
    return repository;
}

/**
 * If the user is logged in, return his information
 */
router.get("/me", verifyLogin, (req, res) => {
    console.log("ciao");
    sendUserFromRepository(req, res, req.user.id, false);
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

/**
 * Retrieves a specific user from the database and sends it to the client
 * If the user doesn't exist, returns error 404
 *
 * @param {*} req
 * @param {*} res
 * @param {number} id
 * @param {boolean} short
 * @returns {Promise<void>}
 */
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