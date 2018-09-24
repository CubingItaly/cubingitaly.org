import { getUser } from "./login.utils";
import { sendError } from './error.utils';

export function canAdminPages(req, res, next) {
    if (getUser(req).canAdminPages()) {
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


export function canPublishPages(req, res, next) {
    if (getUser(req).canPublishPages()) {
        next();
    } else {
        return sendError(res, 403, "Operation not authorized, you don't have enough permissions to perform this request.");
    }
}


export function canCreatePages(req, res, next) {
    if (getUser(req).canCreatePages()) {
        next();
    } else {
        return sendError(res, 403, "Operation not authorized, you don't have enough permissions to perform this request.");
    }
}