import * as constants from "../constants/index.js";
import { users } from "../models/dbmodels/index.js";


export default class Login {

    constructor(utils) {
	this.utils = utils;
    }

    async __checkForUserExistence(res,next, { email, username , password }) {
	const { exists, error, data, ex } = await this.utils.DbUtils.ResourceExists(
	    [users], username ? { username } : { email }
        );

        if (!exists && error)return next(ex);
        if (!exists && !error)
	    return res.status(404).json({
		status: 404,
		message: constants.loginConstants.INVALID_LOGIN_CREDENTIALS
	    });

        if (!this.utils.PasswordUtils.VerifyHashPassword(password, data.password))
	    return res.status(404).json({
		status: 404,
		message: constants.loginConstants.INVALID_LOGIN_CREDENTIALS
	    });

	return data;
    }

    async login(req,res,next) {

	const { username, email, password } = req.body;

	try {

	    const data = await this.__checkForUserExistence(res,next, { username, email, password } );

	    if ( res.headersSent ) return res;

            this.utils.Utils.SetSessionObject(req, {
		email       : data.email,
		username    : data.username,
		userId      : data.userId,
		verified    : data.verified,
		completeReg : data.completeReg
            });

            delete data._doc.password;
            delete data._doc._id;
	    delete data._doc.__v;

            return res.status(200).json({ status: 200, message: data });

	} catch (ex) {
            return next(ex);
	}
    }
}
