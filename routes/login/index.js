"use strict";
const express    = require("express");
const login      = express.Router();

const controller = require("../../controllers/login.js");
const middleware = require("../../middlewares/validator.js");

login.post("/", [
    middleware.UserNameAndEmailValidator,
    middleware.PasswordValidator,
],controller.login);

module.exports = login;
