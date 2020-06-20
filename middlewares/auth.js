// import * as http from "http";
import { authConstants } from "../constants/index.js";
// import Utils from "../utils/index.js";

export default class Auth {
    static IsLogin(req,res,next) {
        if ( req.session.user )
	    return next();
        return res.status(401).json({
	    status: 401,
	    message: authConstants.USER_NOT_LOGGED_IN
        });
    }
}
