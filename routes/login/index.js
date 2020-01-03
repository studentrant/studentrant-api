"use strict";
const express    = require("express");
const login      = express.Router();

const controller = require("../../controllers/login.js");
//const middleware = require("../../middlewares/auth.js");

login.get("/", controller.login);

module.exports = login;
