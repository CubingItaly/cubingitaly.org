import { UserModel } from "../models/classes/user.model";
import { Deserialize } from "cerialize";
import { return403 } from "./error.utils";


/**
 * Returns true if the user is authenticated
 * @param req 
 */
export function isLoggedIn(req): boolean {
    return req.isAuthenticated();
}


/**
 * If the user is authenticated, proceed to the next operation, otherwise returns an error to the client
 * 
 * @param res 
 * @param next 
 */
export function verifyLogin(req, res, next): void {
    if (req.isAuthenticated()) {
        next();
    } else {
        return403(res);
    }
}


/**
 * Returns the logged in user
 * @param req 
 * @param res 
 */
export function getUser(req): UserModel {
    return Deserialize(req.user, UserModel);
}

