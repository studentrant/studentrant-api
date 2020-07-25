export class RegisterService {

    constructor(registerDbUtils,Utils) {
        RegisterService.__DBUTILS = this.registerDbUtils = registerDbUtils;
        this.utils = Utils;
    }

    static async UpdateUserDetails(lookup,updateOperation) {
        return await RegisterService.__DBUTILS.updateNewUserDetails({
            criteria: { [lookup[0]]: lookup[1] },
            data: { ...updateOperation },
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
    }

    async checkUserExistence(email,username) {
        return await this.registerDbUtils.checkEmail(email) || await this.registerDbUtils.checkUserName(username);
    }

    async saveUser({ username, password, email }) {
        const result   = await this.registerDbUtils.saveNewUser({
	    username,
	    email,
	    password
        });
        return result;
    }

    async verifyValidationTokenAndSetVerified(token) {
        return await RegisterService.UpdateUserDetails(
	    [ "verificationLink",  token ],
	    {
                $unset: { verificationLink: 1 },
                $set: { verified: true }
	    }
        );
    }

    async updateUserAndCompletetReg(values) {
        return await RegisterService.UpdateUserDetails(
	    [ "email", values.email ],
	    {
                $set: { ...values, completeReg: true }
	    }
        );
    }
}
