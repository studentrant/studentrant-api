import * as constants from "../constants/index.constant.js";
import { NotFoundException } from "../core/exceptions.service.js";

export default class Login {

    constructor(utils,usersCollection) {
        this.utils = utils;
        this.usersCollection = usersCollection;
    }

    async __checkForUserExistence(res,next, { email, username , password }) {

        const { exists, error, data, ex } = await this.utils.DbUtils.ResourceExists(
	    [this.usersCollection], username ? { username } : { email }
        );

        if (!exists && error) throw ex;
        if (!exists && !error) return constants.loginConstants.INVALID_LOGIN_CREDENTIALS;
	
        if (!await this.utils.PasswordUtils.VerifyHashPassword(password, data.password))
	    return constants.loginConstants.INVALID_LOGIN_CREDENTIALS;

        return data;
    }
    
    async login(req,res,next) {

        const { username, email, password } = req.body;

        try {

	    const data = await this.__checkForUserExistence(res,next, { username, email, password } );

	    if ( typeof(data) === "string" )
                throw NotFoundException(data);
	    
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
