import * as passport from 'passport';

import { Strategy as WCAStrategy } from 'passport-wca';
import { Deserialize } from 'cerialize';
import { keys } from '../secrets/keys';
import { wca_user } from '../models/wca_user.model';
import { DB_User } from '../db/entity/db.user';

const authUrl =  (process.env.NODE_ENV === "production") ? "https://www.worldcubeassociation.org/oauth/authorize" : "https://staging.worldcubeassociation.org/oauth/authorize";
const tokUrl = (process.env.NODE_ENV === "production") ? "https://www.worldcubeassociation.org/oauth/token" : "https://staging.worldcubeassociation.org/oauth/token";

// Define the wca strategy
passport.use(new WCAStrategy({
  authorizationURL:  authUrl,
  tokenURL: tokUrl,
  clientID: keys.wca.client_id,
  clientSecret: keys.wca.client_secret,
  callbackURL: keys.wca.redirect_uri,
  userAgent: keys.wca.user_agent,
  scope: keys.wca.scope
},
  async function (accessToken, refreshToken, profile, done) {

    //create a new user with the json received from the wca server
    const user: wca_user = Deserialize(profile._json.me, wca_user)
    //convert it to a DB_User
    let db_wca_user: DB_User = new DB_User();
    db_wca_user._assimilate(user);

    //Checks whether the user already exists in the DB, if yes, update it. Otherwise insert it
    const user_exists: boolean = await DB_User.getIfExists(db_wca_user);
    if (user_exists) {
      console.log("updating user");
      await DB_User.updateUser(db_wca_user);
    } else {
      console.log("creating user");
      await DB_User.createUser(db_wca_user);
    }

    done(null, user);
  }
));

passport.serializeUser((user: wca_user, done) => {
  done(null, user.id);
});


passport.deserializeUser((id, done) => {
  DB_User.getModelUserById(id).then(usr => done(null, usr));
});
