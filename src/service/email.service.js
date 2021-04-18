import sendgrid from '@sendgrid/mail';

import UsersCollection from '../models/dbmodels/user.model.js';

export default class Email {
  constructor(config) {
    sendgrid.setApiKey(config.get('sendGrid.apiKey'));
    this.sendEmail = sendgrid;
    this.fromEmail = 'studentranters@studentrant.com';
    this.fromName = 'Student Ranters';
    this.verificationUrl = `${config.get('SERVER.HOST')}:${config.get('SERVER.PORT')}/register/verification/`;
    this.config = config;
  }

  static GetUserTemplateData(toEmail) {
    return UsersCollection.findOne(
      { email: toEmail },
      { verificationToken: true, username: true },
    ).lean();
  }

  async sendEmailVerification(toEmail) {
    const { username: user, verificationToken } = await Email.GetUserTemplateData(toEmail);
    return this.sendEmail.send({
      from: {
        email: this.fromEmail,
        name: this.fromName,
      },
      dynamic_template_data: { user, verificationToken: `${this.verificationUrl}/${verificationToken}` },
      personalizations: [
        {
          to: toEmail,
        },
      ],
      template_id: this.config.get('sendGrid.templateIds.emailVerification'),
    });
  }
}
