import { Router } from "express";
import * as passport from 'passport';
import '../../passport/strategy.passport.wca'
const router: Router = Router();


/**
 * Logs out the user and then redirects him to the homepage
 */
router.delete("/logout", (req, res): void => {
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
