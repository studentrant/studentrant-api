const http = require("http");
const constants = require("../constants/");
class Auth {
    static CheckFirstRegStep(req,res,next) {
	if ( req.session.user )
	    return next();
	return res.status(412).json({ message: constants.authConstants.INVALID_REGISTRATION_STEP, status: 412 });
	
    }
}


module.exports = Auth;
