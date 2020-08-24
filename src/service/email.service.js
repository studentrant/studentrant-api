import sendgrid  from "@sendgrid/mail";
import {config}    from "../config/config.config.js";
import { usersCollection } from "../models/dbmodels/index.model.js";


export default class Email {

    constructor() {
        sendgrid.setApiKey(config.get("sendGrid.apiKey"));
        this.sendEmail = sendgrid;
        this.fromEmail = "studentranters@studentrant.com";
        this.fromName  = "Student Ranters";
        this.verificationUrl = `${config.get("SERVER.HOST")}:${config.get("SERVER.PORT")}/register/verification/`;
    }


    static async GetUserTemplateData(to_email) {
        return await usersCollection.findOne({ email: to_email }, { verificationLink: true , username: true }).lean();
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
                template_id: config.get("sendGrid.templateIds.emailVerification")
	    });
        } catch(ex) {
	    throw ex;
        }
    }
}
