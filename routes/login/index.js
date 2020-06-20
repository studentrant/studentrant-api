import middleware      from "../../middlewares/validator.js";
import * as Utils      from "../../utils/index.js";
import Login           from "../../controllers/login.js";

export class LoginRoute {
    constructor(routeHandler) {
        this.controller = new Login(
	    Utils
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
