import * as constants from '../constants/index.constant.js';

export default class PasswordUtils {
  constructor(bcrypt) {
    this.bcrypt = bcrypt;
  }

  hashPassword(password) {
    return this.bcrypt.hashSync(
      password,
      constants.registerConstants.BCRYPT_SALT,
    );
  }

  verifyHashPassword(plaintextPassword, hashedPassword) {
    if (this.bcrypt.compareSync(plaintextPassword, hashedPassword)) return true;
    return false;
  }
}
