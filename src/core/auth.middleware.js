import loginConstants from '../login/login.constant.js';
import { UnAuthorizedAccessException } from '../core/exceptions.service.js';

export default class Auth {
  static IsLogin(req, res, next) {
    if (req.session.user) return next();
    throw UnAuthorizedAccessException(loginConstants.USER_NOT_LOGGED_IN);
  }
}
