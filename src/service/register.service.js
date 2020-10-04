export class RegisterService {
  constructor(registerDbUtils, Utils) {
    RegisterService.__DBUTILS = this.registerDbUtils = registerDbUtils;
    this.utils = Utils;
  }

  static UpdateUserDetails(lookup, updateOperation) {
    return RegisterService.__DBUTILS.updateNewUserDetails({
      criteria: { [lookup[0]]: lookup[1] },
      data: { ...updateOperation },
      options: {
        new: true,
        fields: {
          password: false,
          dateOfReg: false,
          _id: false,
          __v: false,
        },
      },
    });
  }

  async checkUserExistence(email, username) {
    /* eslint-disable no-return-await */
    return await this.registerDbUtils.checkEmail(email)
      || await this.registerDbUtils.checkUserName(username);
    /* eslint-enable no-return-await */
  }

  saveUser({ username, password, email }) {
    return this.registerDbUtils.saveNewUser({
      username,
      email,
      password,
    });
  }

  verifyValidationTokenAndSetVerified(token) {
    return RegisterService.UpdateUserDetails(
      ['verificationLink', token],
      {
        $unset: { verificationLink: 1 },
        $set: { verified: true },
      },
    );
  }

  updateUserAndCompletetReg(values) {
    return RegisterService.UpdateUserDetails(
      ['email', values.email],
      {
        $set: { ...values, completeReg: true },
      },
    );
  }
}

export default RegisterService;
