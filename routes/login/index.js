
import * as express from "express";
import * as controller from "../../controllers/login.js";
import * as middleware from "../../middlewares/validator.js";

export const login = express.Router();

login.post("/", [
    middleware.UserNameAndEmailValidator,
    middleware.PasswordValidator,
], controller.login);
