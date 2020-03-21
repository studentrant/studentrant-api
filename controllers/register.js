const crypto    = require("crypto");
const constants = require("../constants/");
const Utils     = require("../utils/");
const RegisterDbUtils = require("../models/dbutils/register.db.util.js");
const { users } = require("../models/dbmodels/");

module.exports.firstRegStep = async ( req , res , next ) => {

    const { email , username, password } = req.body;

    try {

	let { exists, error, data, ex } = await Utils.DbUtils.ResourceExists([ users ], { email });

	if ( ! exists && error ) throw ex;
	if ( exists && ! error )
	    return res.status(409).json({ status: 409, message: constants.registerConstants.EMAIL_ALREADY_EXISTS });

	({ exists, error, data , ex } = await Utils.DbUtils.ResourceExists([ users ], { username }));

	if ( ! exists && error ) throw ex;
	if ( exists && ! error )
	    return res.status(409).json({ status: 409, message: constants.registerConstants.USERNAME_ALREADY_EXISTS });

	const result = await RegisterDbUtils.SaveNewUser({
	    password : await Utils.PasswordUtils.HashPassword(password),
	    userId   : crypto.createHash("sha256").update(`${username}${email}`).digest("hex"),
	    username,
	    email
	});

	Utils.Utils.SetSessionObject(req,result);
	return res.status(201).json({ status: 201 , message: result });

    } catch(ex) {
	console.log(ex);
	return next(ex);
    }
};


module.exports.lastRegStep = async ( req , res , next ) => {
    const { country, interests } = req.body;
    try {
	const email  = await Utils.Utils.ExtractSessionObjectData(req,"email");
	const result = await RegisterDbUtils.UpdateNewUserDetails({
	    criteria: { email },
	    data    : { country, interests },
	    options : { new: true, fields: { password: false } }
	});
	return res.status(204).json({ status: 204  , message: result });
    } catch(ex) {
	return next(ex);
    }
};
