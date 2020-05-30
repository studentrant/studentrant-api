import * as express from "express";
import * as controller from "../../controllers/login.js";
import * as ValidatorMiddleware from "../../middlewares/validator.js";

export const register = express.Router();

register.post(
    "/reg-first-step",
    [
        ValidatorMiddleware.UserNameValidator,
        ValidatorMiddleware.PasswordValidator,
        ValidatorMiddleware.EmailValidator,
    ],
    controller.firstRegStep
);
register.patch(
    "/reg-last-step",
    [
        ValidatorMiddleware.CheckCountry,
        ValidatorMiddleware.CheckInterests
    ],
    controller.lastRegStep
);
register.patch(
    "/verification/:token",
    [
        ValidatorMiddleware.CheckVerificationToken
    ],
    controller.verifcationToken
);
