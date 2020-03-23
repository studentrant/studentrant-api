const sendgrid = require("@sendgrid/mail");
const config   = require("../config.js");

sendgrid.setApiKey(config.get("sendGrid_Api_Key"));

class Email {
    constructor(req) {
	this.req = req;
	this.sendEmail = sendgrid;
    }
}
