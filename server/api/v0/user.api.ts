import { UserModel } from "../../models/classes/user.model";
import { UserRepository } from "../../db/repository/user.repository";
import { getCustomRepository } from "typeorm";
import { UserEntity } from "../../db/entity/user.entity";
import { sendError } from "../../shared/error.utils";
import { Router } from "express";
//# we need this because otherwise passport doesn't work
import * as passport from "passport";
import { isLoggedIn, getUser } from "../../shared/login.utils";

const router: Router = Router();

/**
 * Instantiate a UserRepository and return it
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
router.get("/me", async (req, res) => {
    if (!isLoggedIn(req)) {
        return res.status(200).json({});
    }
    await sendUserFromRepository(req, res, getUser(req).id, false);
});

/**
 * Get a specific user with all his personal data including the roles
 */
router.get("/:id", async (req, res) => {
    await sendUserFromRepository(req, res, req.params.id, false);
});

/**
 * Get a specific user with all his personal data but the roles
 */
router.get("/:id/short", async (req, res) => {
    await sendUserFromRepository(req, res, req.params.id, true);
});

/**
 * Retrieve a specific user from the database and send it to the client
 * If the user doesn't exist, return error 404
 *
 * @param {*} req
 * @param {*} res
 * @param {number} id
 * @param {boolean} short
 * @returns {Promise<void>}
 */
async function sendUserFromRepository(req, res, id: number, short: boolean): Promise<void> {
    id = Number(id);
    let userRepo: UserRepository = getUserRepository();
    let exist: boolean = await userRepo.checkIfUserExists(id);
    if (exist) {
        let dbUser: UserEntity = short ? await userRepo.getShortUserById(id) : await userRepo.getUserById(id);
        let modelUser: UserModel = dbUser._transform();
        return res.status(200).json(modelUser);
    } else {
        return sendError(res, 404, "The requested user does not exist.");
    }
}

/**
 * Search between the users and return the list of those matching the name
 */
router.get("/", async (req, res) => {
    let userRepo: UserRepository = getUserRepository();
    let dbUsers: UserEntity[] = await userRepo.findUsersByName(req.query.name || "");
    let modelUsers: UserModel[] = dbUsers.map((user: UserEntity) => user._transform());
    return res.status(200).json(modelUsers);
});


export { router }