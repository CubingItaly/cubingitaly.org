import { Router, Request, Response } from "express";
import * as loginUtil from '../../shared/login.utils';
import { Deserialize, Serialize } from "cerialize";
/** We need this even if it's not used because otherwise we can't access to some methods and attributes */
import * as passport from "passport";

const router: Router = Router();

/**
 * 
 */
router.get("/", async (req: Request, res: Response) => {

});


export { router }