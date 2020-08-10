import middleware        from "../../middlewares/validator.middleware.js";
import  Email            from "../../service/email.service.js";
import {Registration}    from "../../controllers/register.controller.js";
import RegisterDbUtils   from "../../models/dbutils/register.db.util.js";
import { usersCollection } from "../../models/dbmodels/index.model.js";

import * as Utils        from "../../utils/index.util.js";

export class RegisterRoute {

    constructor(routeHandler) {
        this.controller    = new Registration(
	    RegisterDbUtils,
	    Email,
	    Utils,
	    usersCollection
        );
        routeHandler.post("/reg-first-step",this.firstRegistrationStep());
        routeHandler.patch("/reg-last-step",this.lastRegistrationStep());
        routeHandler.patch("/verification/:token",this.tokenVerification());
        return routeHandler;
    }

    static API_PATH = "/register";

    firstRegistrationStep() {
        return [
            middleware.UserNameValidator,
            middleware.PasswordValidator,
            middleware.EmailValidator,
	    this.controller.firstRegStep.bind(this.controller)
        ];
    }

    lastRegistrationStep() {
        return [
            middleware.CheckCountry,
            middleware.CheckInterests,
	    this.controller.lastRegStep.bind(this.controller)
        ];
    }

    tokenVerification() {
        return [
	    middleware.CheckVerificationToken,
	    this.controller.verificationToken.bind(this.controller)
        ];
    }
}
