import { CI_DB } from './db/ci_db';
import { json, urlencoded } from "body-parser";
import * as compression from 'compression';
import * as express from 'express';
import * as path from 'path';
import * as passport from 'passport';
import * as session from 'express-session';
import { keys } from './secrets/keys';

//Routers files
import { authRouter } from "./routes/auth";

// Retrieve production and development url for further configuration.
import { production_url, development_url } from "./config";
import { teamsRouter } from './routes/teams';
import { _ROUTES_ } from './routes/_ROUTES_';
import { DefaultRouter } from './routes/DefaultRouter.class';

const db: CI_DB = new CI_DB();

db.initDefaultValues().then(() => {
  console.log('db successfully initialized');
});

const app: express.Application = express();

/**
 * Handles the urls allowed to do cross-origin calls.
 */
const urlWhitelist: string[] = [
  production_url,
  development_url
];


app.disable("x-powered-by");
app.use(json());
app.use(compression());
app.use(urlencoded({ extended: true }));

app.use(session(
  {
    secret:keys.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: keys.session.cookie
  }
));
app.use(passport.initialize());
app.use(passport.session());

_ROUTES_.forEach((r: DefaultRouter) => {
  console.log('loading router for path:');
  console.log(r.absolutePath);
  app.use(r.absolutePath, r.getRouter());
})

// api routes
app.use("/auth", authRouter);
//app.use("/teams", teamsRouter);

if (app.get("env") === "production") {
  // in production mode run application from dist folder
  app.use(express.static(path.join(__dirname, "/../client")));
}


// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next) => {
  const err = new Error("Not Found");
  next(err);
});

// production error handler
// no stacktrace leaked to user
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {

  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message,
  });
});

export { app, db };
