"use strict";

require("./models/con.js");
const config       = require("./config.js");
const express      = require("express");
const bodyPars     = require("body-parser");
const helmet       = require("helmet");
const session      = require("express-session");
const MongoStore   = require("connect-mongodb-session")(session);
const app          = express();

const routes       = require("./routes/");
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
app.use(bodyPars.json());


app.use("/login", routes.login );
app.use("/register", routes.register);


app.use("*", (req,res,next) => {
    return next(`route ${req.path} does not exists`);
});

app.use((err,req,res,next) => {
    return res.status(500).json({ status: 500, message: err.message});
});


app.listen(app.get("PORT"), () => {
    console.log(`listening on port ${app.get("PORT")}`);
});


module.exports = app;
