import { getCustomRepository } from "typeorm";
import { sendError } from "../../shared/error.utils";
import { Router } from "express";
//# we need this because otherwise passport doesn't work
import * as passport from "passport";
import { getUser, isLoggedIn, verifyLogin } from "../../shared/login.utils";
import { TutorialRepository } from "../../db/repository/tutorial.repository";
import { canAdminTutorials, canEditPages, canCreateTutorials, canPublishTutorials } from '../../shared/tutorial.permissions.utils';
import { validationResult, Result, param, body } from "express-validator/check";
import { TutorialEntity } from "../../db/entity/tutorial.entity";
import { TutorialModel } from "../../models/classes/tutorial.model";
import { UserEntity } from "../../db/entity/user.entity";
import { Deserialize } from "cerialize";
import { PageModel } from "../../models/classes/page.model";
import { PageEntity } from "../../db/entity/page.entity";
import { PageRepository } from "../../db/repository/page.repository";
import { sanitize } from "./sanitizer";

const router: Router = Router();

function getTutorialRepository(): TutorialRepository {
    return getCustomRepository(TutorialRepository);
}

function getPageRepository(): PageRepository {
    return getCustomRepository(PageRepository);
}

function getUserEntity(req): UserEntity {
    let user: UserEntity = new UserEntity();
    user._assimilate(getUser(req));
    return user;
}

function titleIsInTheBody(req, res, next) {
    let title: string = req.body.title;
    if (title !== undefined && title !== null) {
        next();
    } else {
        return sendError(res, 400, "Bad request. The title of the new tutorial is not in the request");
    }
}

function tutorialIsInTheBody(req, res, next) {
    let tutorial: TutorialModel = Deserialize(req.body.tutorial, TutorialModel);
    if (tutorial !== undefined && tutorial !== null && tutorial.id === req.params.id) {
        next();
    } else {
        return sendError(res, 400, "Bad request. The tutorial is not in the request");
    }
}

async function tutorialExists(req, res, next) {
    let id: string = req.params.id;
    let repo: TutorialRepository = getTutorialRepository();
    let exists: boolean = await repo.checkIfTutorialExists(id);
    if (exists) {
        next();
    } else {
        sendError(res, 404, "The requested tutorial does not exist.");
    }
}

async function pageIsInTheTutorial(req, res, next) {
    let tutorialId: string = req.params.id;
    let pageId: number = Number(req.params.page);
    let isIn: boolean = await getTutorialRepository().pageIsInTutorial(tutorialId, pageId);
    if (isIn) {
        next();
    } else {
        sendError(res, 404, "The requested page does not exists");
    }
}

function pageIsInTheBody(req, res, next) {
    let page: PageModel = Deserialize(req.body.page, PageModel) || null;
    if (page !== undefined && page !== null) {
        next();
    } else {
        return sendError(res, 400, "Bad request. The request is malformed. Page is missing");
    }
}

function sanitizePage(req, res, next) {
    let tmp: string = req.sanitize(req.body.page.title) || "";
    req.body.page.title = tmp.substr(0, 120);
    req.body.page.content = sanitize(req.body.page.content);
    next();
}

function sanitizeTutorial(req, res, next) {
    req.body.tutorial.title = req.sanitize(req.body.tutorial.title);
    next();
}

router.get("/", async (req, res) => {
    let repo: TutorialRepository = getTutorialRepository();
    let dbTutorial: TutorialEntity[] = await repo.getTutorials();
    let model: TutorialModel[] = dbTutorial.map(c => c._transform());
    res.status(200).json(model);
});

router.get("/admin", verifyLogin, canEditPages, async (req, res) => {
    let repo: TutorialRepository = getTutorialRepository();
    let dbTutorial: TutorialEntity[] = await repo.adminGetTutorials();
    let model: TutorialModel[] = dbTutorial.map(c => c._transform());
    res.status(200).json(model);
});


router.post("/", verifyLogin, canCreateTutorials, titleIsInTheBody, async (req, res) => {
    let title: string = req.body.title;
    let user: UserEntity = getUserEntity(req);
    let dbTutorial: TutorialEntity = await getTutorialRepository().createTutorial(title, user);
    return res.status(200).json(dbTutorial._transform());

});

router.delete("/:id", verifyLogin, canAdminTutorials, async (req, res) => {
    let id: string = req.params.id;
    await getTutorialRepository().deleteTutorial(id);
    return res.status(200).send({});
});

router.get("/:id", async (req, res) => {
    let id: string = req.params.id;
    let dbTutorial: TutorialEntity = await getTutorialRepository().getTutorial(id);
    if (dbTutorial !== undefined && dbTutorial !== null && (dbTutorial.isPublic || (isLoggedIn(req) && getUser(req).canEditPages()))) {
        return res.status(200).send(dbTutorial._transform());
    } else {
        sendError(res, 404, "The requested resource does not exist.");
    }
});

router.get("/:id/admin", verifyLogin, canEditPages, async (req, res) => {
    let id: string = req.params.id;
    let dbTutorial: TutorialEntity = await getTutorialRepository().adminGetTutorial(id);
    if (dbTutorial !== undefined && dbTutorial !== null) {
        return res.status(200).send(dbTutorial._transform());
    } else {
        sendError(res, 404, "The requested resource does not exist.");
    }
});

router.put("/:id", verifyLogin, canEditPages, tutorialIsInTheBody, tutorialExists, sanitizeTutorial, async (req, res) => {
    let tutorial: TutorialModel = Deserialize(req.body.tutorial, TutorialModel);
    let repo: TutorialRepository = getTutorialRepository();
    let user: UserEntity = getUserEntity(req);
    let dbTutorial: TutorialEntity = new TutorialEntity();
    dbTutorial._assimilate(tutorial);
    dbTutorial = await repo.updateTutorial(dbTutorial, user);
    res.status(200).json(dbTutorial._transform());
});

router.put("/:id/admin", verifyLogin, canPublishTutorials, tutorialIsInTheBody, tutorialExists, sanitizeTutorial, async (req, res) => {
    let tutorial: TutorialModel = Deserialize(req.body.tutorial, TutorialModel);
    let user: UserEntity = getUserEntity(req);
    let repo: TutorialRepository = getTutorialRepository();
    let dbTutorial: TutorialEntity = new TutorialEntity();
    dbTutorial._assimilate(tutorial);
    dbTutorial = await repo.adminUpdateTutorial(dbTutorial, user);
    res.status(200).json(dbTutorial._transform());
});

router.post("/:id/pages", verifyLogin, canEditPages, tutorialExists, pageIsInTheBody, sanitizePage, async (req, res) => {
    let page: PageModel = Deserialize(req.body.page, PageModel);
    let tutorialId: string = req.params.id;
    let repo: TutorialRepository = getTutorialRepository();
    let dbPage: PageEntity = new PageEntity();
    dbPage._assimilate(page);
    let user: UserEntity = getUserEntity(req);
    let tutorial: TutorialEntity = await repo.addPage(tutorialId, dbPage, user);
    res.status(200).json(tutorial._transform());
});

router.delete("/:id/pages/:page", verifyLogin, canEditPages, tutorialExists, [param('page').isNumeric()], pageIsInTheTutorial, async (req, res) => {
    let error: Result = validationResult(req);
    if (!error.isEmpty()) {
        return sendError(res, 400, "Bad request. The request is malformed.");
    }
    let page: number = Number(req.params.page);
    let tutorial: string = req.params.id;
    let repo: TutorialRepository = getTutorialRepository();
    let user: UserEntity = getUserEntity(req);
    let dbTutorial: TutorialEntity = await repo.removePage(tutorial, page, user);
    res.status(200).json(dbTutorial._transform());
});

router.put("/:id/pages/:page", verifyLogin, canEditPages, tutorialExists, [param('page').isNumeric(), body('delta').isNumeric()], pageIsInTheTutorial, async (req, res) => {
    let error: Result = validationResult(req);
    if (!error.isEmpty()) {
        return sendError(res, 400, "Bad request. The request is malformed.");
    }
    let pageId: number = Number(req.params.page);
    let delta: number = Number(req.body.delta);
    let page: PageEntity = await getPageRepository().getPage(pageId);
    if ((page.indexInTutorial + delta) < 0) {
        sendError(res, 405, "Action not allowed.");
    } else {
        let repo: TutorialRepository = getTutorialRepository();
        let user: UserEntity = getUserEntity(req);
        let tutorial: TutorialEntity = await repo.movePage(req.params.id, page.id, delta, user);
        res.status(200).json(tutorial._transform());
    }
});



export { router }