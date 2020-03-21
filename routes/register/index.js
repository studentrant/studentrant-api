const express  = require("express");
const register = express.Router();

const controller          = require("../../controllers/register.js");
const AuthMiddleware      = require("../../middlewares/auth.js");
const ValidatorMiddleware = require("../../middlewares/validator.js");


register.post(
    "/reg-first-step",
    [
	ValidatorMiddleware.UserNameValidator,
	ValidatorMiddleware.PasswordValidator,
	ValidatorMiddleware.EmailValidator,
    ],
    controller.firstRegStep
);
register.put(
    "/reg-last-step",
    [
	//AuthMiddleware.CheckFirstRegStep,
	//ValidatorMiddleware.CheckAvatar,
	ValidatorMiddleware.CheckCountry,
	ValidatorMiddleware.CheckInterests
    ],
    controller.lastRegStep
);

module.exports = register;
