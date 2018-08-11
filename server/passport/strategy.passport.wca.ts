import * as passport from 'passport';
import * as WCAStrategy from 'passport-wca';
import { keys } from '../secrets/keys';
import { UserRepository } from '../db/repositories/user.repository';
import { UserModel } from '../models/classes/user.model';
import { Deserialize } from 'cerialize';
import { UserEntity } from '../db/entity/user.entity';
import { getCustomRepository } from 'typeorm';

const authUrl = (process.env.NODE_ENV == "production") ? "https://www.worldcubeassociation.org/oauth/authorize" : "https://staging.worldcubeassociation.org/oauth/authorize";
const tokUrl = (process.env.NODE_ENV == "production") ? "https://www.worldcubeassociation.org/oauth/token" : "https://staging.worldcubeassociation.org/oauth/token";
const userProfileURL = (process.env.NODE_ENV == "production") ? "https://www.worldcubeassociation.org/api/v0/me" : "https://staging.worldcubeassociation.org/api/v0/me";

function getUserRepository(): UserRepository {
    const repository: UserRepository = getCustomRepository(UserRepository);
    return repository;
}

passport.use(new WCAStrategy({
    uthorizationURL: authUrl,
    tokenURL: tokUrl,
    userProfileURL,
    clientID: keys.wca.client_id,
    clientSecret: keys.wca.client_secret,
    callbackURL: keys.wca.redirect_uri,
    userAgent: keys.wca.user_agent,
    scope: keys.wca.scope
},
    /** Callback function called after the WCA Website send the data */
    async function (accessTokem, refreshToken, profile, done) {

        const userRepo: UserRepository = getUserRepository();
        /** Convert the user from the json to a UserModel */
        let modelUser: UserModel = Deserialize(profile._json.me, UserModel);
        /** Convert the UserModel into a UserEntity */
        let dbUser: UserEntity = new UserEntity();
        dbUser._assimilate(modelUser);

        /** Store the user in the database */
        dbUser = await userRepo.updateUser(dbUser);

        /** Return the UserModel that is used for the session */
        done(null, dbUser._transform());

    }));


passport.serializeUser((user: UserModel, done) => {
    done(null, user.id);
})


passport.deserializeUser(async (id: number, done) => {
    const userRepo: UserRepository = getUserRepository();
    let dbUser: UserEntity = await userRepo.getUserById(id);
    done(null, dbUser._transform());
})



