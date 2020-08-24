import express     from "express";
import bodyParser  from "body-parser";
import helmet      from "helmet";
import betterLogging from "better-logging";

import mountRoutes from "./mountRoutes.js";
import mountGlobalConfigurations from "./mountGlobalConfigurations.js";

import { NotFoundException }      from "./service/exceptions.service.js";
import { badExceptionConstants }  from "./constants/index.constant.js";

import * as routes  from "./routes/index.route.js";
import * as configs from  "./config/index.config.js";

const app = express();

betterLogging(console);

app.set("PORT", configs.config.get("SERVER.PORT"));
app.use(helmet());
app.use(bodyParser.json());


mountGlobalConfigurations(
    app,
    [
        configs.Database,
        configs.Session
    ]
);

mountRoutes(
    app,
    [
        routes.RegisterRoute,
        routes.LoginRoute,
        routes.RantRoute
    ]
);

app.use("*", (req, res, next) => {
    return next(NotFoundException(`route ${req.path} does not exists`));
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
