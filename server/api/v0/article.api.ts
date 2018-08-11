import { Router, Request, Response } from "express";
import * as loginUtil from '../../shared/login.utils';
import { Deserialize, Serialize } from "cerialize";

const router: Router = Router();

/**
 * 
 */
router.get("/", async (req: Request, res: Response) => {

});


export { router }