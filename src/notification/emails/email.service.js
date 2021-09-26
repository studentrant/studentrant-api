import sendgrid from '@sendgrid/mail';

export default class Email {
  constructor(userDbUtils, config) {
    sendgrid.setApiKey(config.get('sendGrid.apiKey'));
    this.sendEmail = sendgrid;
    this.fromEmail = 'studentranters@studentrant.com';
    this.fromName = 'Student Ranters';
    this.verificationUrl = `${config.get('SERVER.HOST')}:${config.get('SERVER.PORT')}/register/verification/`;
    this.config = config;
    this.userDbUtils = userDbUtils;
  }

 #getUserTemplateData (userEmailAddress) {
   return this.userDbUtils.getUserVerificationTokenAndEmail(
     userEmailAddress,
   );
 }

 async sendEmailVerification(userEmailAddress) {
   const { username: user, verificationToken } = await this.#getUserTemplateData(userEmailAddress);
   return this.sendEmail.send({
     from: {
       email: this.fromEmail,
       name: this.fromName,
     },
     dynamic_template_data: { user, verificationToken: `${this.verificationUrl}/${verificationToken}` },
     personalizations: [
       {
         to: userEmailAddress,
       },
     ],
     template_id: this.config.get('sendGrid.templateIds.emailVerification'),
   });
 }
}
