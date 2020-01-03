"use strict";

require("./models/con.js");

const express   = require("express");
const helmet    = require("helmet");
const app       = express();

const routes    = require("./routes/");


app.set("PORT", process.env.PORT || 3000);


app.use(helmet());



app.use("/login", routes.login );
//app.use("/register", routes.register);



app.listen(app.get("PORT"), () => {
    console.log(`listening on port ${app.get("PORT")}`);
});


module.exports = app;
