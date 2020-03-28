const sendgrid     = require("@sendgrid/mail");
const config       = require("../config.js");
const { users }    = require("../models/dbmodels/");

sendgrid.setApiKey(config.get("sendGrid.api_key"));

class Email {

    constructor(req) {
	console.log(config.get("sendGrid.api_key"), 'hello world');
	this.req       = req;
	this.sendEmail = sendgrid;
	this.fromEmail = "studentranters@studentrant.com";
	this.fromName  = "Student Ranters";
	this.verificationUrl = `${config.get("SERVER.HOST")}:${config.get("SERVER.PORT")}/register/verification/`;
    }


    static async GetUserTemplateData(to_email) {
	return await users.findOne({ email: to_email }, { verificationLink: true , username: true }).lean();
    }


    async sendEmailVerification(to_email) {
	try {
	    const { username: user, verificationLink } = await Email.GetUserTemplateData(to_email);
	    return await this.sendEmail.send({
		from: {
		    email: this.fromEmail,
		    name : this.fromName
		},
		dynamic_template_data: { user, verificationLink: `${this.verificationUrl}/${verificationLink}` },
		personalizations: [
                    {
			to: to_email
                    }
		],
		template_id: config.get("sendGrid.templateIds.email_verification")
	    });
	} catch(ex) {
	    throw ex;
	}
    }
}

module.exports = Email;
