import { Request, Response, Router, CookieOptions, } from "express";
import '../passport_strategies/passport.wca.strategy';
import * as passport from 'passport';
import { Serialize, Deserialize } from "cerialize";
import { keys } from '../secrets/keys';
import { wca_user } from "../models/wca_user.model";
import { standard_response } from '../models/standard_response.model'
import { RESPONSE_STATUS } from "../models/enums/response.statuses";


const authRouter: Router = Router();

/**
 * Checks whether the user is logged in or not.
 * In case he is not, he gets redirected to the root.
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    //Goes to the next function
    next();
  } else {
    //Here we should manage what happens in case the user is not logged in
    //Perhaps we could create a login page and redirect him there
    console.log("Request from not authenticated user");
    //We use a standard response object
    let std_res: standard_response = new standard_response();
    std_res.status = RESPONSE_STATUS.ERROR;
    std_res.error = "Request from not authenticated user";
    res.send(JSON.stringify(Serialize(std_res)));
  }
}

/**
 * Manages the logout and destroyes the session
 */
authRouter.get("/logout", (req: Request, res: Response) => {
  console.log("Logging out user and redirecting him to root");
  req.logout()
  res.redirect("/");
})

/**
 * Redirects the user to t block of code appends two strings together: "/courses/" and the value of req.params.slug. I then redirect to that URL. If I was using ES6, I could've used a template string. I chose not to do that in this blog post. The reason why is because I wanted to he WCA website to ask for permissions 
 */
authRouter.get("/wca", passport.authenticate('wca'));

/** 
 * Exchanges code for access tocheckAuthken with the WCA website, 
 * then the strategy callback function is called 
 */
authRouter.get('/wca/callback',
  passport.authenticate('wca'),
  function (req, res) {
    /*if (req.isAuthenticated) {
      res.cookie("_authUser", JSON.stringify(Serialize(req.user)),
        <CookieOptions>keys.session.cookie
      );
    }*/
    console.log("Successful login, redirecting user to root")
    res.redirect("/");
  });

/**
 * Returns user info, if he is logged in
 */
authRouter.get("/me", checkAuth, (req, res) => {
  console.log("User recognized, sending info");
  //We use a standard response object
  let std_res: standard_response = new standard_response();
  std_res.status = RESPONSE_STATUS.OK;
  //We need to deserialize because req.user is of type Express.User
  std_res.user = Deserialize(req.user, wca_user);
  res.send(JSON.stringify(Serialize(std_res)));
})


export { authRouter };