"use strict";

const bcrypt = require("bcryptjs");
const constants = require("../constants/");

module.exports = class PasswordUtils {
    static HashPassword(password) {
        try {
	    return bcrypt.hashSync(password,constants.registerConstants.BCRYPT_SALT);
        } catch(ex) {
	    throw ex;
        }
    }

    static VerifyHashPassword(plaintextPassword,hashedPassword) {
        try {
	    if ( bcrypt.compareSync(plaintextPassword, hashedPassword) )
                return true;
	    return false;
        } catch(ex) {
	    throw ex;
        }
    }
};
