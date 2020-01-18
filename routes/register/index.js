const express = require("express");
const register = express.Router();

const controller = require("../../controllers/register.js");
const AuthMiddleware = require("../../middlewares/auth.js");


const ValidatorMiddleware = require("../../middlewares/validator.js");

register.post(
    "/reg-first-step",
    (req,res,next) => {
        console.log(req.body);
        next();
    },
    [
	ValidatorMiddleware.UserNameValidator,
	ValidatorMiddleware.PasswordValidator,
	ValidatorMiddleware.EmailValidator,
    ],
    controller.firstRegStep
);
// register.post(
//     "/reg-last-step",
//     [
// 	AuthMiddleware.CheckFirstRegStep,
// 	ValidatorMiddleware.CheckAvatar,
// 	ValidatorMiddleware.CheckCountry,
// 	ValidatorMiddleware.CheckInterests
//     ],
//     controller.lastRegStep
// );

module.exports = register;
