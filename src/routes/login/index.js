import middleware      from "../../middlewares/validator.js";
import * as Utils      from "../../utils/index.js";
import Login           from "../../controllers/login.js";
import { usersCollection } from "../../models/dbmodels/index.js";

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
