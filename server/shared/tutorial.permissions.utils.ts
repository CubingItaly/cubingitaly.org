import { getUser } from "./login.utils";
import { sendError } from './error.utils';


export function canAdminTutorials(req, res, next) {
    if (getUser(req).canAdminTutorials()) {
        next();
    } else {
        sendError(res, 403, "Operation not authorized, you don't have enough permissions to perform this request.");
    }
}


export function canEditPages(req, res, next) {
    if (getUser(req).canEditPages()) {
        next();
    } else {
        sendError(res, 403, "Operation not authorized, you don't have enough permissions to perform this request.");
    }
}


export function canPublishTutorials(req, res, next) {
    if (getUser(req).canPublishTutorials()) {
        next();
    } else {
        return sendError(res, 403, "Operation not authorized, you don't have enough permissions to perform this request.");
    }
}


export function canCreateTutorials(req, res, next) {
    if (getUser(req).canCreateTutorials()) {
        next();
    } else {
        return sendError(res, 403, "Operation not authorized, you don't have enough permissions to perform this request.");
    }
}