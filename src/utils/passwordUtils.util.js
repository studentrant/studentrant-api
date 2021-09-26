export default class PasswordUtils {
  constructor(bcrypt) {
    this.BCRYPT_SALT = 10,
    this.bcrypt = bcrypt;
  }

  hashPassword(password) {
    return this.bcrypt.hashSync(
      password,
      this.BCRYPT_SALT
    );
  }

  verifyHashPassword(plaintextPassword, hashedPassword) {
    if (this.bcrypt.compareSync(plaintextPassword, hashedPassword)) return true;
    return false;
  }
}
