import { authConstants } from "../constants/index.constant.js";
import { UnAuthorizedAccessException } from "../service/exceptions.service.js";

export default class Auth {
    static IsLogin(req,res,next) {
        if ( req.session.user )
	    return next();
        throw UnAuthorizedAccessException(authConstants.USER_NOT_LOGGED_IN);
    }
}
