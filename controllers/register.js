const constants = require("../constants/");
const Utils     = require("../utils/");
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

	const result = await (
	    new users({
		password: await Utils.PasswordUtils.HashPassword(password),
		username,
		email
	    })
	).save();

	result._doc.password = undefined;
	result._doc._id      = undefined;

	return res.status(201).json({ status: 201 , message: result });


    } catch(ex) {
	return next(ex);
    }
};


module.exports.lastRegStep = async ( req , res , next ) => {
};
