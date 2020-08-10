import middleware      from "../../middlewares/validator.middleware.js";
import * as Utils      from "../../utils/index.util.js";
import Login           from "../../controllers/login.controller.js";
import { usersCollection } from "../../models/dbmodels/index.model.js";

export class LoginRoute {
    constructor(routeHandler) {
        this.controller = new Login(
	    Utils,
	    usersCollection
        );
        routeHandler.post("/", this.loginUser());
        return routeHandler;
    }

    static API_PATH = "/login";
    
    loginUser() {
        return [
	    middleware.UserNameAndEmailValidator,
	    middleware.PasswordValidator,
	    this.controller.login.bind(this.controller)
        ];
    }
}
