import { json, urlencoded } from "body-parser";
import * as compression from 'compression';
import * as express from 'express';
import * as path from 'path';
import * as session from 'express-session';
import * as expressSanitizer from 'express-sanitizer';
import { keys } from './secrets/keys';
import * as passport from 'passport';
import './passport/strategy.passport.wca';
import * as sslRedirect from 'heroku-ssl-redirect';

//Router files
import { router as authRoutes } from './api/v0/auth.api';
import { router as articleRoutes } from './api/v0/article.api';
import { router as teamRoutes } from './api/v0/team.api';
import { router as userRoutes } from './api/v0/user.api';
import { router as categoryRoutes } from './api/v0/category.api';
import { router as pageRoutes } from './api/v0/page.api';
import { router as tutorialRoutes } from './api/v0/tutorial.api';
import { router as contactRoutes } from './api/v0/contact.api';

// Retrieve production and development url for further configuration.
import { production_url, development_url } from "./config";
import { getConnection, Repository, getRepository } from 'typeorm';
import { Session } from './db/entity/session.entity';
import { TypeormStore } from 'typeorm-store';

export function getApp() {
  let app: express.Application = express();

  /**
   * Handles the urls allowed to do cross-origin calls.
   */
  const urlWhitelist: string[] = [
    production_url,
    development_url
  ];


  app.disable("x-powered-by");
  app.use(json({ limit: '8mb' }));
  app.use(compression());
  app.use(urlencoded({ limit: '8mb', extended: true }));
  app.use(expressSanitizer());

  let repo = getConnection().getRepository(Session);
  app.use(session(
    {
      secret: keys.session.secret,
      resave: true,
      saveUninitialized: false,
      cookie: keys.session.cookie,
      store: new TypeormStore({ repository: repo })
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
  app.use("/api/v0/pages", pageRoutes);
  app.use("/api/v0/tutorial", tutorialRoutes);
  app.use("/api/v0/contact",contactRoutes);



  if (app.get("env") === "production") {
    app.use(sslRedirect());
    // in production mode run application from dist folder
    app.use(express.static(path.join(__dirname, "/../client")));
    app.use("/*", function (req, res) {
      res.sendFile(path.join(__dirname, "/../client/index.html"));
    });
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

  return app;
}
