import * as passport from 'passport';

import { Strategy as WCAStrategy } from 'passport-wca';
import { Deserialize } from 'cerialize';
import { keys } from '../secrets/keys';
import { wca_user } from '../models/wca_user.model';
import { db } from '../app';
import { Repository } from 'typeorm';
import { DB_User } from '../db/entity/db.user';
import { DB_TeamUser } from '../db/entity/db.team_user';
import { DB_Team } from '../db/entity/db.team';


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
    const user_repo: Repository<DB_User> = conn.manager.getRepository(DB_User);
    //query the db to obtain the user, if already exists
    let foundUser = await user_repo.findOne(user);
    if (foundUser) {
      //We update the user in the DB even if there's no changes
      foundUser._assimilate(user);
      await user_repo.save(foundUser);

      done(null, user);
    } else {
      let db_user = new DB_User();
      db_user._assimilate(user);
      await user_repo.save(db_user);
      await addCheckIfAdmin(db_user);
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
    return conn.manager.getRepository(DB_User);
  }).then((repo) => {
    //Find the user by id
    return repo.findOneById(id);
  }).then((user) => {
    //Generate a new {wca_user} and call the callback function
    let des_usr: wca_user = user._transform();
    done(null, des_usr);
  });

});

/**
 * Checks whether the new user is marked as admin and in case adds him to the admins team
 * 
 * @param {DB_User} user 
 */
async function addCheckIfAdmin(user: DB_User) {
  if (user.id == keys.admin.id) {
    console.log("User is admin, giving admin role");

    let conn = await db.connect();
    let tu_repo: Repository<DB_TeamUser> = conn.manager.getRepository(DB_TeamUser);
    let team_repo: Repository<DB_Team> = conn.manager.getRepository(DB_Team);

    const DB_TEAM: DB_Team = await team_repo.findOne({shortname: keys.admin.shortname});

    const DB_TU: DB_TeamUser = new DB_TeamUser();
    DB_TU.user = user;
    DB_TU.team = DB_TEAM;
    DB_TU.is_leader = true;

    tu_repo.save(DB_TU);
  }

}
