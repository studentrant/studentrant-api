import express         from "express";
import middleware      from "../../middlewares/validator.js";
import * as controller from "../../controllers/login.js";

export const login = express.Router();

login.post("/", [
    middleware.UserNameAndEmailValidator,
    middleware.PasswordValidator,
], controller.login);
