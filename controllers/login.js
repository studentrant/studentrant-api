const Validator         = require("../middlewares/validator.js");
const http              = require("http");
const constants         = require("../constants/");
const Utils             = require("../utils/");
const { users }         = require("../models/dbmodels/");

module.exports.login = async ( req ,res , next ) => {
    
    const { username , email, password } = req.body;
    
    try {
	
	const { exists , error, data, ex } = await Utils.DbUtils.ResourceExists(
	    [users], username ? { username } : { email }
	);

	if ( ! exists && error )
	    return next(ex);
	
	if ( ! exists && ! error )
	    return res.status(404).json({ status: 404 , message: constants.loginConstants.INVALID_LOGIN_CREDENTIALS});

	if ( ! Utils.PasswordUtils.VerifyHashPassword(password, data.password) )
	    return res.status(404).json({ status: 404 , message: constants.loginConstants.INVALID_LOGIN_CREDENTIALS});
	
	delete data.password;
	delete data._id;
	
	return res.status(200).json({ status: 200 , message: data });
	
    } catch(ex) {
	return next(ex);
    }
};
