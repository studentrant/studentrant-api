import EmailService from './email.service.js';
import { RantDbUtils, UserDbUtils, Collection } from '../../__test__/fakes/db.fakes.js';
import config from '../../__test__/fakes/config.fakes.js';


describe('EmailService [Unit]', () => {
  const service = new EmailService(
    new UserDbUtils(Collection),
    config
  );

  describe('::sendEmailVerification', () => {

    let getUserVerificationTokenAndEmailSpy;

    afterEach(() => {
      getUserVerificationTokenAndEmailSpy.calls.reset();
    });

    beforeEach(() => {
      getUserVerificationTokenAndEmailSpy = spyOn(service.userDbUtils, 'getUserVerificationTokenAndEmail');

      spyOn(
        service.sendEmail,
        'send'
      ).and.callFake(() => {});

    });

    it('should send verification link email to user ', async () => {

      getUserVerificationTokenAndEmailSpy.and.resolveTo({
        username: 'test',
        verificationToken: 'hello_world'
      });

      await service.sendEmailVerification('test@example.com');

    });

  });
})
