import loginConstants from './login.constant.js';
import registerConstants from '../registration/register.constant.js';
import { BadValueException } from '../core/exceptions.service.js';

export default class LoginMiddlewareValidator {
  passwordValidator(req, res, next) {
    if (!req.body.password) {
      throw BadValueException(
        loginConstants.INVALID_LOGIN_PASSWORD_NO_FIELD,
      );
    }

    if (req.body.password.length < 8) {
      throw BadValueException(
        loginConstants.INVALID_LOGIN_PASSWORD_LENGTH,
      );
    }

    if (!/\d/.test(req.body.password)) {
      throw BadValueException(
        loginConstants.INVALID_LOGIN_PASSWORD_NO_DIGIT,
      );
    }

    if (!/[A-Z]/.test(req.body.password)) {
      throw BadValueException(
        loginConstants.INVALID_LOGIN_PASSWORD_NO_UPPER_CASE,
      );
    }

    if (!/[a-z]/.test(req.body.password)) {
      throw BadValueException(
        loginConstants.INVALID_LOGIN_PASSWORD_NO_LOWER_CASE,
      );
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(req.body.password)) {
      throw BadValueException(
        loginConstants.INVALID_LOGIN_PASSWORD_NO_SPECIAL_CHARACTER,
      );
    }

    return next();
  }

  userNameValidator(req, res, next) {
    if (!req.body.username) {
      throw BadValueException(
        loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD,
      );
    }

    if (req.body.username.length < 5) {
      throw BadValueException(
        loginConstants.INVALID_LOGIN_USERNAME_LENGTH,
      );
    }

    return next();
  }

  userNameAndEmailValidator(req, res, next) {
    if (!req.body.username && !req.body.email) {
      throw BadValueException(
        loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD,
      );
    }

    if (req.body.username && req.body.username.length < 5) {
      throw BadValueException(
        loginConstants.INVALID_LOGIN_USERNAME_LENGTH,
      );
    }

    if (req.body.email && ! registerConstants.EMAIL_REGEXP.test(req.body.email)) {
      throw BadValueException(
        loginConstants.INVALID_EMAIL,
      );
    }

    return next();
  }

  emailValidator(req, res, next) {
    if (!req.body.email) {
      throw BadValueException(
        registerConstants.NO_EMAIL_FIELD,
      );
    }

    if (!registerConstants.EMAIL_REGEXP.test(req.body.email)) {
      throw BadValueException(
        loginConstants.INVALID_EMAIL,
      );
    }

    return next();
  }

  checkVerificationToken(req, res, next) {
    const { token } = req.params;
    if (!token) {
      throw BadValueException(
        registerConstants.INVALID_VERIFICATION_TOKEN,
      );
    }
    return next();
  }
}
