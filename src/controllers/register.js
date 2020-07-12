import * as crypto     from "crypto";
import * as Utils      from "../utils/index.js";
import * as constants  from "../constants/index.js";

import  config from "../config.js";
import  Email  from "../service/email.service.js";


export class Registration {
    
    constructor(RegisterDbUtils,Utils,usersCollection) {
        this.register = new RegisterDbUtils(usersCollection);
        this.utils    = Utils;
        this.usersCollection = usersCollection;
    }

    /**
     * @api { post } /register/reg-first-step First registration step of user
     * @apiName firstRegStep
     * @apiGroup Register
     *
     *
     * @apiParam {object} req.body body data
     * @apiParam {string} req.body[email] email address of user
     * @apiParam {string{5..}} req.body[username] username of user
     * @apiParam {password{8..}} req.body[password] password of user
     * @apiSuccess {Object} res.body response body
     * @apiSuccess {Number} res.body[status] http status code response
     * @apiSuccess {Object} res.body[message] response message to be consumed by the client
     * @apiSuccess {String} res.body.message[email] email address of the user
     * @apiSuccess {String} res.body.message[username] username of the suer
     * @apiSuccess {Boolean=false} res.body.message[completeReg] This value is set to false because the user has not completed the second registration step, if user decides to logout and login back, this property should be check first to know if the user should be taken to the dashboard or the second registration step
     * @apiSuccess {Boolean=false} res.body.message[verified] This value is set to false until the user has verified their email address, if the user has not verified the email address, they should always see a message on their dashboard telling them to verify their email address
     *
     *
     * @apiError INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD username/email field is undefined
     * @apiError INVALID_LOGIN_USERNAME_LENGTH         username length is less than 5
     * @apiError INVALID_LOGIN_PASSWORD_NO_FIELD       password field is undefined
     * @apiError INVALID_LOGIN_PASSWORD_LENGTH         password field is less than 8
     * @apiError INVALID_LOGIN_PASSWORD_NO_DIGIT       password does not contain any number
     * @apiError INVALID_LOGIN_PASSWORD_NO_CHARS       password does not contain any characters
     **/

    async firstRegStep(req,res,next) {
        try {
	    const { email, username, password } = req.body;
	    /**
	     * check for the existence of email
	     * if it does exists the left hand part of the logical or operatior will fill data
	     * if it is null the right part of the logical or operator will fill data
	     *
	     **/
	    const data = await this.register.checkEmail(email) || await this.register.checkUserName(username);

	    if ( data ) return res.status(409).json(
                {
                    status: 409,
                    message: data.email ?
                        constants.registerConstants.EMAIL_ALREADY_EXISTS :
                        constants.registerConstants.USERNAME_ALREADY_EXISTS
                }
	    );

            const result = await this.register.saveNewUser({
                password: await Utils.PasswordUtils.HashPassword(password),
                userId: crypto.createHash("sha256").update(`${username}${email}`).digest("hex"),
                username,
                email
            });
            this.utils.Utils.SetSessionObject(req, result);
            return res.status(201).json({ status: 201, message: result });
        } catch(ex) {
	    return next(ex);
        }
    }


    /**
     * @api { patch } /register/reg-last-step Last registration step of user
     * @apiName lastRegStep
     * @apiGroup Register
     *
     *
     * @apiParam {object} req.body body data
     * @apiParam {string} req.body[country] country of the user
     * @apiParam {array}  req.body[interests] what the user is interested in (we would use their interest to show them rants)
     * @apiSuccess {Object} res.body response body
     * @apiSuccess {Number} res.body[status] http status code response
     * @apiSuccess {Object} res.body[message] response message to be consumed by the client
     * @apiSuccess {String} res.body.message[email] email address of the user
     * @apiSuccess {String} res.body.message[username] username of the suer
     * @apiSuccess {Boolean=true} res.body.message[completeReg] This value is set to true because the user has completed the registration step
     * @apiSuccess {Boolean=false} res.body.message[verified] This value is set to false until the user has verified their email address, if the user has not verified the email address, they should always see a message on their dashboard telling them to verify their email address
     *
     *
     * @apiError COUNTRY_PROPERTY_UNDEFINED      country is undefined
     * @apiError INVALID_COUNTRY_LENGTH          country length is less than 1
     * @apiError NO_INTEREST_FIELD               interests is undefined
     * @apiError NO_ARRAY_INTEREST               interests is not an array field
     * @apiError NO_INTEREST_LENGTH              interest array length is 0
     **/

    async lastRegStep(req,res,next) {

        const { country, interests } = req.body;

        try {

            const email = await this.utils.Utils.ExtractSessionObjectData(req, "email");
            const result = await this.register.updateNewUserDetails({
                criteria: { email },
                data: {
                    $set: {
                        country,
                        interests,
                        completeReg: true,
                        verificationLink: await this.utils.Utils.UniqueCodeGenerator(req, email)
                    }
                },
                options: {
                    new: true,
                    fields: {
                        password: false,
                        dateOfReg: false,
                        _id: false,
                        __v: false,
                    }
                }
            });

            if (config.get("env") !== "test")
                delete result.verificationLink;

            Promise.resolve((new Email(req)).sendEmailVerification(email));
            return res.status(201).json({ status: 201, message: result });

        } catch (ex) {
            return next(ex);
        }
    }

    async verificationToken (req, res, next) {
        const { token } = req.params;
        try {
            const userData = await this.register.updateNewUserDetails({
                criteria: { verificationLink: token },
                data: { $unset: { verificationLink: 1 }, $set: { verified: true } },
                options: { new: true, fields: { password: false, _id: false, __v: false, dateOfReg: false } }
            });
            return res.status(200).json({ status: 200, message: userData });
        } catch (ex) {
            return next(ex);
        }
    }
}
