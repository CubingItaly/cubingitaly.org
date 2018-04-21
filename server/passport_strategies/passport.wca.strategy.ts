import * as passport from 'passport';

import { Strategy as WCAStrategy } from 'passport-wca';
import { Deserialize } from 'cerialize';
import { keys } from '../secrets/keys';
import { wca_user } from '../models/wca_user.model';
import { db } from '../app';
import { Repository } from 'typeorm';
import { User } from '../db/entity/db.user';


// Define the wca strategy
passport.use(new WCAStrategy({
  clientID: keys.wca.client_id,
  clientSecret: keys.wca.client_secret,
  callbackURL: keys.wca.redirect_uri,
  userAgent: keys.wca.user_agent,
  scope: keys.wca.scope
},
  async function (accessToken, refreshToken, profile, done) {

    //create a new user with the json received from the wca server
    const user: wca_user = Deserialize(profile._json.me, wca_user)

    //connect to the db and get the User repo
    const conn = await db.connect();
    const user_repo: Repository<User> = conn.manager.getRepository(User);
    //query the db to obtain the user, if already exists
    let foundUser = await user_repo.findOne(user);
    if (foundUser) {
      //We update the user in the DB even if there's no changes
      foundUser._assimilate(user);
      await user_repo.save(foundUser);

      done(null, user);
    } else {
      let db_user = new User();
      db_user._assimilate(user);
      await user_repo.save(db_user);

      done(null, user);
    }

  }
));

passport.serializeUser((user: wca_user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
 
  //connect to the DB
  db.connect().then((conn) => {
    //get the User repo
    return conn.manager.getRepository(User);
  }).then((repo) => {
    //Find the user by id
    return repo.findOneById(id);
  }).then((user) => {
    //Generate a new {wca_user} and call the callback function
    done(null, user._transform());
  });
  
});