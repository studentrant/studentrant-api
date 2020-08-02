import * as constants  from "../constants/index.js";

import  config from "../config.js";
import { RegisterService } from "../service/register.service.js";
import { ExistsException } from "../service/exceptions.service.js";

export class Registration {

    constructor(
        RegisterDbUtils,
        Email,
        Utils,
        usersCollection
    ) {
        this.utils = Utils;
        this.usersCollection = usersCollection;
        this.registerService = new RegisterService(
	    new RegisterDbUtils(usersCollection),
	    Utils
        );
        this.email = Email;
    }

    async firstRegStep(req,res,next) {

        try {

	    const { email, username, password } = req.body;
	    const data = await this.registerService.checkUserExistence(email,username);

	    if ( data ) {
                throw ExistsException(
		    data.email ?
                        constants.registerConstants.EMAIL_ALREADY_EXISTS :
                        constants.registerConstants.USERNAME_ALREADY_EXISTS
                );
	    }

            const result = await this.registerService.saveUser({
                username,
                password : await this.utils.PasswordUtils.HashPassword(password),
                email
	    });

            this.utils.Utils.SetSessionObject(req, result);

            return res.status(201).json({ status: 201, message: result });

        } catch(ex) {
	    return next(ex);
        }
    }

    async lastRegStep(req,res,next) {

        const { country, interests } = req.body;

        try {

	    const email            = await this.utils.Utils.ExtractSessionObjectData(req, "email");
	    const verificationLink = await this.utils.Utils.UniqueCodeGenerator(email);
            const result           = await this.registerService.updateUserAndCompletetReg({email, country, interests , verificationLink });

            if (config.get("env") !== "test")
                delete result.verificationLink;

	    const sendEmail = new this.email(req);

	    Promise.resolve(
                sendEmail.sendEmailVerification(email)
	    );

            return res.status(201).json({ status: 201, message: result });

        } catch (ex) {
	    return next(ex);
        }
    }

    async verificationToken (req, res, next) {
        const { token } = req.params;
        try {
            const userData = await this.registerService.verifyValidationTokenAndSetVerified(token);
	    return res.status(200).json({ status: 200, message: userData });
        } catch (ex) {
            return next(ex);
        }
    }
}
