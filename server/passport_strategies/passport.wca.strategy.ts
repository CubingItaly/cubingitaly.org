import * as passport from 'passport';

import { Strategy as WCAStrategy } from 'passport-wca';
import { Deserialize } from 'cerialize';
import { keys } from '../secrets/keys';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../db/repositories/user.repository';
import { UserModel } from '../models/classes/user.model';
import { UserEntity } from '../db/entity/user.entity';

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
    const user: UserModel = Deserialize(profile._json.me, UserModel);
    //Retrieves the CIUsersRepo
    const users_repo: UserRepository = getCustomRepository(UserRepository);
    //Generates a new DBUser
    let db_user: UserEntity = new UserEntity();
    db_user._assimilate(user);
    //calls the method to manage the user login with the database
    db_user = await users_repo.updateUser(db_user);

    done(null, db_user._transform());
  }
));

passport.serializeUser((user: UserModel, done) => {
  done(null, user.id);
});


passport.deserializeUser((id: number, done) => {
  const users_repo: UserRepository = getCustomRepository(UserRepository);
  users_repo.getUserById(id).then(user => {
    done(null,user._transform());
  })
});
