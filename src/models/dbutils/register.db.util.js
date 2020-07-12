
export default class RegisterDbUtils {
    constructor(usersCollection) {
        this.usersCollection = usersCollection;
    }
    async saveNewUser(data) {
        await (new this.usersCollection(data).save());
        return await this.usersCollection.findOne( { email: data.email } , {
	    password: false ,
	    _id: false,
	    __v: false,
	    dateOfReg: false
        }).lean();
    }
    
    async updateNewUserDetails({ criteria , data, options}) {
        return await this.usersCollection.findOneAndUpdate(criteria, data, options);
    }
    
    async verifyUserRegTokenAndGetData(token) {
        return await this.usersCollection.findOneAndUpdate(
	    { verificationLink: token },
	    { $unset: { verificationLink: 1 } },
	    { new: false, fields: { password: false, _id: false, __v: false , dateOfReg: false} }
        ).lean();
    }

    async checkUserName(username) {
        return await this.checkUserExists("username", username);
    }

    async checkEmail(email) {
        return await this.checkUserExists("email", email);
    }

    async checkUserExists(key,value) {
        return await this.usersCollection.findOne({ [key]: value }, { [key]: true });
    }
    
    // static async CheckUserExists(value) {
    // 	const [key] = Object.keys(value);
    // 	return await usersCollection.findOne({ [key] : value[key] }, { [key]: true });
    // }
}
