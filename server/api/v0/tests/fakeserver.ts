import { json, urlencoded } from "body-parser";
import * as compression from 'compression';
import * as express from 'express';
import * as session from 'express-session';
import * as expressSanitizer from 'express-sanitizer';
import { keys } from '../../../secrets/keys';
import * as passport from 'passport';


//Router files
import { router as authRoutes } from '../auth.api';
import { router as articleRoutes } from '../article.api';
import { router as teamRoutes } from '../team.api';
import { router as userRoutes } from '../user.api';
import { router as categoryRoutes } from '../category.api';

const app: express.Application = express();



app.disable("x-powered-by");
app.use(json());
app.use(compression());
app.use(urlencoded({ extended: true }));
app.use(expressSanitizer());

app.use(session(
    {
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
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

export { app };
