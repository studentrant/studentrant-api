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


app.set("PORT", process.env.PORT || 3000);


app.use(helmet());
app.use(bodyPars.json());


app.use("/login", routes.login );
app.use("/register", routes.register);



app.listen(app.get("PORT"), () => {
    console.log(`listening on port ${app.get("PORT")}`);
});


module.exports = app;
