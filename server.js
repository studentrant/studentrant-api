
import * as express    from "express";
import * as bodyParser from "body-parser";
import * as helmet     from "helmet";
import * as session    from "express-session";
import * as MongoStore from "connect-mongodb-session";
import * as con        from "./models/con.js";
import * as routes     from "./routes/index.js";
import * as config     from "./config.js";

const app = express();

const sessionStore = session({
    secret: config.get("session_secret"),
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        uri: config.get("dbConnectionString.connString"),
        collection: "session"
    })
});


app.set("PORT", config.get("SERVER.PORT"));

app.use(sessionStore);
app.use(helmet());
app.use(bodyParser.json());

app.use("/login", routes.login);
app.use("/register", routes.register);


app.use("*", (req, res, next) => {
    return next(`route ${req.path} does not exists`);
});

app.use((err, req, res, next) => {
    return res.status(500).json({ status: 500, message: err.message });
});


app.listen(app.get("PORT"), () => {
    console.log(`listening on port ${app.get("PORT")}`);
});


export default app;
