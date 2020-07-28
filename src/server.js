import "./models/con.js"; // eslint-disable-line
import express     from "express";
import bodyParser  from "body-parser";
import helmet      from "helmet";
import session     from "express-session";
import mongoStore  from "connect-mongodb-session";
import betterLogging from "better-logging";
import config      from "./config.js";
import mountRoutes from "./mountRoutes.js";

import { badExceptionConstants }  from "./constants/index.js";
import * as routes from "./routes/index.js";

const app = express();

const sessionStore = session({
    secret: config.get("session_secret"),
    resave: true,
    saveUninitialized: true,
    store: new (mongoStore(session))({
        uri: config.get("dbConnectionString.connString"),
        collection: "session"
    })
});


if ( process.env.NODE_ENV !== "test" )
    betterLogging(console);

app.set("PORT", config.get("SERVER.PORT"));
app.use(sessionStore);
app.use(helmet());
app.use(bodyParser.json());


mountRoutes(
    app,
    [
        routes.RegisterRoute,
        routes.LoginRoute,
        routes.RantRoute
    ]
);

app.use("*", (req, res, next) => {
    return next(`route ${req.path} does not exists`);
});

// eslint-disable-next-line
app.use((err, req, res, next) => {
    const { status, message } = err.errorDetails ?
        err.errorDetails :
        {
	    status: 500,
	    message: process.env.NODE_ENV === "production" ?
                badExceptionConstants :
                err.message
        };
    if ( process.env.NODE_ENV !== "production" && status === 500 )
        console.error(err,message);
    return res.status(status).json({ status, message });
});


app.listen(app.get("PORT"), () => {
    console.log(`listening on port ${app.get("PORT")}`);
});

export default app;
