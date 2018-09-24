import { getCustomRepository } from "typeorm";
import { sendError } from "../../shared/error.utils";
import { Router } from "express";
//# we need this because otherwise passport doesn't work
import * as passport from "passport";
import { PageRepository } from "../../db/repository/page.repository";
import { PageEntity } from "../../db/entity/page.entity";
import { getUser, isLoggedIn, verifyLogin } from "../../shared/login.utils";
import { canAdminPages, canCreatePages, canEditPages, canPublishPages } from '../../shared/tutorial.permissions.utils';
import { query, validationResult, Result } from "express-validator/check";
import { PageModel } from "../../models/classes/page.model";
import { Deserialize } from "cerialize";
import { UserEntity } from "../../db/entity/user.entity";
import { sanitize } from "./sanitizer";


const router: Router = Router();

function getPageRepository(): PageRepository {
    return getCustomRepository(PageRepository);
}

function pageIsInTheBody(req, res, next) {
    let page: PageModel = Deserialize(req.body.page, PageModel) || null;
    let id: number = Number(req.params.id);
    if (page !== undefined && page !== null && page.id === id) {
        next();
    } else {
        return sendError(res, 400, "Bad request. The request is malformed. Page is missing");
    }
}

async function pageAlreadyExist(req, res, next) {
    let page: PageModel = Deserialize(req.body.page, PageModel);
    let exists: boolean = await getPageRepository().checkIfPageExists(page.id);
    if (!exists) {
        next();
    } else {
        return sendError(res, 400, "Bad request. The requested page already exists.");
    }
}

async function pageExists(req, res, next) {
    let page: PageModel = Deserialize(req.body.page, PageModel);
    let exists: boolean = await getPageRepository().checkIfPageExists(page.id);
    if (exists) {
        next();
    } else {
        return sendError(res, 404, "The requested page doesn't exist.");
    }
}


router.get("/:id", async (req, res) => {
    let id: number = Number(req.params.id);
    let repo: PageRepository = getPageRepository();
    let exists: boolean = await repo.checkIfPageExists(id);
    if (exists) {
        let page: PageEntity = await repo.getPage(id);
        if (page.isPublic || (isLoggedIn(req) && getUser(req).canViewPrivatePages())) {
            res.status(200).json(page._transform());
        } else {
            return sendError(res, 404, "The requested resource does not exist.")
        }
    } else {
        return sendError(res, 404, "The requested resource does not exist.");
    }
});


router.put("/:id", pageIsInTheBody, verifyLogin, canEditPages, pageExists, async (req, res) => {
    let page: PageModel = req.body.page;
    let dbPage: PageEntity = new PageEntity();
    dbPage._assimilate(page);
    let user: UserEntity = new UserEntity();
    user._assimilate(getUser(req));
    dbPage = await getPageRepository().updatePage(dbPage, user);
    return res.status(200).json(dbPage._transform());
});


export { router }