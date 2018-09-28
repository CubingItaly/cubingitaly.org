import * as passport from 'passport';
import { Strategy as WCAStrategy } from 'passport-wca';
import { keys } from '../secrets/keys';
import { UserModel } from '../models/classes/user.model';
import { Deserialize } from 'cerialize';
import { UserRepository } from '../db/repository/user.repository';
import { getCustomRepository } from 'typeorm';
import { UserEntity } from '../db/entity/user.entity';

const authURL = "https://staging.worldcubeassociation.org/oauth/authorize";
const tokenURL = "https://staging.worldcubeassociation.org/oauth/token";
const profileURL = "https://staging.worldcubeassociation.org/api/v0/me";

passport.use(new WCAStrategy({
    clientID: keys.wca.client_id,
    clientSecret: keys.wca.client_secret,
    callbackURL: keys.wca.redirect_uri,
    scope: keys.wca.scope,
    userAgent: keys.wca.user_agent,
    authorizationURL: authURL,
    tokenURL: tokenURL,
    userProfileURL: profileURL
},
    async (accessToken, refreshToken, profile, done) => {
        const user: UserModel = Deserialize(profile._json.me, UserModel);
        const userRepo: UserRepository = getCustomRepository(UserRepository);
        let dbUser: UserEntity = new UserEntity();
        dbUser._assimilate(user);
        dbUser = await userRepo.updateUser(dbUser);
        done(null, user);
    }));


passport.serializeUser((user: UserModel, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    const userRepo: UserRepository = getCustomRepository(UserRepository);
    let dbUser: UserEntity = await userRepo.getUserById(id);
    done(null, dbUser._transform());
});