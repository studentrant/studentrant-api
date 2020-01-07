"use strict";
const express    = require("express");
const login      = express.Router();

const controller = require("../../controllers/login.js");
const middleware = require("../../middlewares/validator.js");
//const middleware = require("../../middlewares/auth.js");

login.post("/", [
    middleware.UserNameValidator,
    middleware.PasswordValidator
], controller.login);

module.exports = login;
