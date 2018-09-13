import { Database } from './db/database';
import { json, urlencoded } from "body-parser";
import * as compression from 'compression';
import * as express from 'express';
import * as path from 'path';
import * as session from 'express-session';
import * as expressSanitizer from 'express-sanitizer';
import { keys } from './secrets/keys';
import * as passport from 'passport';
import './passport/strategy.passport.wca';

//Router files
import { router as authRoutes } from './api/v0/auth.api';
import { router as articleRoutes } from './api/v0/article.api';
import { router as teamRoutes } from './api/v0/team.api';
import { router as userRoutes } from './api/v0/user.api';
import { router as categoryRoutes } from './api/v0/category.api';

// Retrieve production and development url for further configuration.
import { production_url, development_url } from "./config";


const db: Database = new Database();
db.createConnection()
  .then(() => db.initDatabase())
  .then(() => console.log('DB successfully initialized'));


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
app.use(expressSanitizer());

app.use(session(
  {
    secret: keys.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: keys.session.cookie
  }
));

app.use(passport.initialize());
app.use(passport.session());

// api routes
app.use("/api/v0/auth", authRoutes);
app.use("/api/v0/teams", teamRoutes);
app.use("/api/v0/users", userRoutes);
app.use("/api/v0/articles", articleRoutes);
app.use("/api/v0/categories", categoryRoutes);


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
