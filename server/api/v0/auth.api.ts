import { Router, Request, Response } from "express";
import * as passport from 'passport';

const router: Router = Router();


/**
 * Logs out the user and then redirects him to the homepage
 */
router.get("/logout", (req: Request, res: Response): void => {
    req.logout();
    res.redirect("/");
});


/**
 * Redirects the user to the WCA website to ask for the permissions 
 */
router.get("/wca", passport.authenticate('wca'));


/**
 * Logs in the user and then redirects him to the root
 */
router.get("/wca/callback", passport.authenticate('wca'), function (req, res) {
    res.status(200).redirect("/");
});


export { router } 
