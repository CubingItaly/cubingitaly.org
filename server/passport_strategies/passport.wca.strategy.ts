import * as passport from 'passport';

import { Strategy as WCAStrategy } from 'passport-wca';
import { Deserialize } from 'cerialize';
import { keys } from '../secrets/keys';
import { CIUser } from '../models/ci.user.model';
import { CiUsersRepo } from '../db/repositories/db.ci.users.repo'
import { getCustomRepository } from 'typeorm';
import { DBUser } from '../db/entity/db.user';

const authUrl = (process.env.NODE_ENV == "production") ? "https://www.worldcubeassociation.org/oauth/authorize" : "https://staging.worldcubeassociation.org/oauth/authorize";
const tokUrl = (process.env.NODE_ENV == "production") ? "https://www.worldcubeassociation.org/oauth/token" : "https://staging.worldcubeassociation.org/oauth/token";
const userProfileURL = (process.env.NODE_ENV == "production") ? "https://www.worldcubeassociation.org/api/v0/me" : "https://staging.worldcubeassociation.org/api/v0/me";
// Define the wca strategy
passport.use(new WCAStrategy({
  authorizationURL: authUrl,
  tokenURL: tokUrl,
  userProfileURL,
  clientID: keys.wca.client_id,
  clientSecret: keys.wca.client_secret,
  callbackURL: keys.wca.redirect_uri,
  userAgent: keys.wca.user_agent,
  scope: keys.wca.scope
},
  async function (accessToken, refreshToken, profile, done) {
    //Extracts a CI User from the data received from the WCA server
    const user: CIUser = Deserialize(profile._json.me, CIUser);
    //Retrieves the CIUsersRepo
    const users_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
    //Generates a new DBUser
    let db_user: DBUser = new DBUser();
    db_user._assimilate(user);
    //calls the method to manage the user login with the database
    users_repo.loginUser(db_user);

    done(null, user);
  }
));

passport.serializeUser((user: CIUser, done) => {
  done(null, user.id);
});


passport.deserializeUser((id: number, done) => {
  const users_repo: CiUsersRepo = getCustomRepository(CiUsersRepo);
  users_repo.findUserById(id).then(user => {
    done(null,user._transform());
  })
});
