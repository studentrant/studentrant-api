import * as constants from '../constants/index.constant.js';
import { BadValueException } from '../core/exceptions.service.js';

export default class ValidatorMiddleware {
  static PasswordValidator(req, res, next) {
    if (!req.body.password) {
      throw BadValueException(
        constants.loginConstants.INVALID_LOGIN_PASSWORD_NO_FIELD,
      );
    }

    if (req.body.password.length < 8) {
      throw BadValueException(
        constants.loginConstants.INVALID_LOGIN_PASSWORD_LENGTH,
      );
    }

    if (!/\d/.test(req.body.password)) {
      throw BadValueException(
        constants.loginConstants.INVALID_LOGIN_PASSWORD_NO_DIGIT,
      );
    }

    if (!/[A-Z]/.test(req.body.password)) {
      throw BadValueException(
        constants.loginConstants.INVALID_LOGIN_PASSWORD_NO_UPPER_CASE,
      );
    }

    if (!/[a-z]/.test(req.body.password)) {
      throw BadValueException(
        constants.loginConstants.INVALID_LOGIN_PASSWORD_NO_LOWER_CASE,
      );
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(req.body.password)) {
      throw BadValueException(
        constants.loginConstants.INVALID_LOGIN_PASSWORD_NO_SPECIAL_CHARACTER,
      );
    }

    return next();
  }

  static UserNameValidator(req, res, next) {
    if (!req.body.username) {
      throw BadValueException(
        constants.loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD,
      );
    }

    if (req.body.username.length < 5) {
      throw BadValueException(
        constants.loginConstants.INVALID_LOGIN_USERNAME_LENGTH,
      );
    }

    return next();
  }

  static UserNameAndEmailValidator(req, res, next) {
    if (!req.body.username && !req.body.email) {
      throw BadValueException(
        constants.loginConstants.INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD,
      );
    }

    if (req.body.username && req.body.username.length < 5) {
      throw BadValueException(
        constants.loginConstants.INVALID_LOGIN_USERNAME_LENGTH,
      );
    }

    if (req.body.email && !constants.registerConstants.EMAIL_REGEXP.test(req.body.email)) {
      throw BadValueException(
        constants.authConstants.INVALID_EMAIL,
      );
    }

    return next();
  }

  static EmailValidator(req, res, next) {
    if (!req.body.email) {
      throw BadValueException(
        constants.authConstants.NO_EMAIL_FIELD,
      );
    }

    if (!constants.registerConstants.EMAIL_REGEXP.test(req.body.email)) {
      throw BadValueException(
        constants.authConstants.INVALID_EMAIL,
      );
    }

    return next();
  }

  static CheckAvatar(req, res, next) {
    if (!req.body.avatar) {
      throw BadValueException(
        constants.authConstants.NO_AVATAR_FIELD,
      );
    }
    return next();
  }

  static CheckCountry(req, res, next) {
    if (!req.body.country) {
      throw BadValueException(
        constants.authConstants.COUNTRY_PROPERTY_UNDEFINED,
      );
    }

    if (req.body.country.length < 2) {
      throw BadValueException(
        constants.authConstants.INVALID_COUNTRY_LENGTH,
      );
    }

    return next();
  }

  static CheckInterests(req, res, next) {
    if (!req.body.interests) {
      throw BadValueException(
        constants.authConstants.NO_INTEREST_FIELD,
      );
    }

    if (!Array.isArray(req.body.interests)) {
      throw BadValueException(
        constants.authConstants.NO_ARRAY_INTERESTS,
      );
    }

    if (req.body.interests.length === 0) {
      throw BadValueException(
        constants.authConstants.NO_INTEREST_LENGTH,
      );
    }

    return next();
  }

  static CheckVerificationToken(req, res, next) {
    const { token } = req.params;
    if (!token) {
      throw BadValueException(
        constants.registerConstants.INVALID_VERIFICATION_TOKEN,
      );
    }
    return next();
  }
}
