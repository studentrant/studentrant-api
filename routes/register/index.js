import express          from "express";
import * as controller  from "../../controllers/register.js";
import middleware       from "../../middlewares/validator.js";

export const register = express.Router();

register.post(
    "/reg-first-step",
    [
        middleware.UserNameValidator,
        middleware.PasswordValidator,
        middleware.EmailValidator,
    ],
    controller.firstRegStep
);
register.patch(
    "/reg-last-step",
    [
        middleware.CheckCountry,
        middleware.CheckInterests
    ],
    controller.lastRegStep
);
register.patch(
    "/verification/:token",
    [
        middleware.CheckVerificationToken
    ],
    controller.verifcationToken
);
