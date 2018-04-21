import { Request, Response, Router, CookieOptions, } from "express";

// Import the WCA passport strategy.
// This will define the passport.use strategy.
import '../passport_strategies/passport.wca.strategy';
import * as passport from 'passport';
import { Serialize, Deserialize } from "cerialize";
import { keys } from '../secrets/keys';
import { wca_user } from "../models/wca_user.model";

/**
 * Login router definition.
 */
const authRouter: Router = Router();


/**
 * Logs out the user by destroying the session
 */
authRouter.get("/logout", (req: Request, res: Response) => {
  req.logout()
  res.redirect("/");
})


/**
 * Asks for the authorization token to the WCA Website
 */
authRouter.get("/wca", passport.authenticate('wca'));

/**
 * 
 */
authRouter.get('/wca/callback',
  passport.authenticate('wca'),
  function (req, res) {
    if (req.isAuthenticated) {
      res.cookie("_authUser", JSON.stringify(Serialize(req.user)),
        <CookieOptions>keys.session.cookie
      );
    }
    res.redirect("/");
  });


authRouter.get("/test", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.json({ error: "devi fare login" });
  }
})
export { authRouter };
