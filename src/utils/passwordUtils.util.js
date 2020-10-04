import bcrypt from 'bcryptjs';
import * as constants from '../constants/index.constant.js';

export default class PasswordUtils {
  static HashPassword(password) {
    return bcrypt.hashSync(password, constants.registerConstants.BCRYPT_SALT);
  }

  static VerifyHashPassword(plaintextPassword, hashedPassword) {
    if (bcrypt.compareSync(plaintextPassword, hashedPassword)) return true;
    return false;
  }
}
