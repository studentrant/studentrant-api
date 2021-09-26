import Registration from './register.controller.js';
import RegisterMiddlewarevValidator from './register.middleware-validator.js';
import UsersCollection from '../ranter/ranter.model.js';
import UserDbUtils from '../ranter/ranter.db.util.js';
import { Utils, PasswordUtils } from '../utils/index.util.js';

export default class RegisterRoute {
  constructor(routeHandler, config) {
    this.controller = new Registration({
      Collections: { UsersCollection },
      DBUtils: { UserDbUtils },
      Utils: { Utils, PasswordUtils },
      config,
    });
    this.registrationValidator = new RegisterMiddlewarevValidator();
    routeHandler.post('/reg-first-step', this.firstRegistrationStep());
    routeHandler.patch('/reg-last-step', this.lastRegistrationStep());
    routeHandler.patch('/verification/:token', this.tokenVerification());
    return routeHandler;
  }

  static API_PATH = '/register';

  firstRegistrationStep() {
    return [
      this.registrationValidator.userNameValidator,
      this.registrationValidator.passwordValidator,
      this.registrationValidator.emailValidator,
      this.controller.firstRegStep.bind(this.controller),
    ];
  }

  lastRegistrationStep() {
    return [
      this.registrationValidator.checkCountry,
      this.registrationValidator.checkInterests,
      this.controller.lastRegStep.bind(this.controller),
    ];
  }

  tokenVerification() {
    return [
      this.registrationValidator.checkVerificationToken,
      this.controller.verificationToken.bind(this.controller),
    ];
  }
}
