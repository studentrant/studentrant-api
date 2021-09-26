import LoginMiddlewareValidator from '../login/login.middleware-validator.js';
import registerConstants from '../registration/register.constant.js';
import { BadValueException } from '../core/exceptions.service.js';

export default class RegisterMiddlewareValidator extends LoginMiddlewareValidator {
  constructor() {
    super();
  }

  checkInterests(req, res, next) {
    if (!req.body.interests) {
      throw BadValueException(
        registerConstants.NO_INTEREST_FIELD,
      );
    }

    if (!Array.isArray(req.body.interests)) {
      throw BadValueException(
        registerConstants.NO_ARRAY_INTERESTS,
      );
    }

    if (req.body.interests.length === 0) {
      throw BadValueException(
        registerConstants.NO_INTERESTS_LENGTH,
      );
    }

    return next();
  }

  checkCountry(req, res, next) {
    if (!req.body.country) {
      throw BadValueException(
        registerConstants.COUNTRY_PROPERTY_UNDEFINED,
      );
    }

    if (req.body.country.length < 2) {
      throw BadValueException(
        registerConstants.INVALID_COUNTRY_LENGTH,
      );
    }

    return next();
  }

  checkAvatar(req, res, next) {
    if (!req.body.avatar) {
      throw BadValueException(
        registerConstants.NO_AVATAR_FIELD,
      );
    }
    return next();
  }

}
