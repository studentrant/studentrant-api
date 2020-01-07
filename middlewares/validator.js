const http      = require("http");
const constants = require("../constants/");
const { check } = require("express-validator");

module.exports = class ValidatorMiddleware {
    static PasswordValidator(req,res,next) {
	if ( ! req.body.password )
	    return res.status(412).json({ status: 412 , message: constants.loginConstants.INVALID_LOGIN_PASSWORD_NO_FIELD});
	if ( req.body.password.length < 8 )
	    return res.status(412).json({ status: 412 , message: constants.loginConstants.INVALID_LOGIN_PASSWORD_LENGTH });
	if ( ! /\d/.test(req.body.password) )
	    return res.status(412).json({ status: 412, message: constants.loginConstants.INVALID_LOGIN_PASSWORD_NO_DIGIT });
	if ( ! /[A-Za-z]/.test(req.body.password) )
	    return res.status(412).json({ status : 412 , message: constants.loginConstants.INVALID_LOGIN_PASSWORD_NO_CHARS });
	return next();
    }
    static UserNameValidator(req,res,next) {
	if ( ! req.body.username )
	    return res.status(412).json({status: 412 , message: constants.loginConstants.INVALID_LOGIN_USERNAME_NO_FIELD});
	if ( req.body.username.length < 5 )
	    return res.status(412).json({ status: 312 , message: constants.loginConstants.INVALID_LOGIN_USERNAME_LENGTH });
	return next();
    }
};
