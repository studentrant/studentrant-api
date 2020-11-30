export class RegisterService {
  constructor(registerDbUtils, Utils) {
    RegisterService.__DBUTILS = this.registerDbUtils = registerDbUtils;
    this.utils = Utils;
  }

  static UpdateUserDetails(lookup, updateOperation) {
    return RegisterService.__DBUTILS.updateUserInfo({
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

  saveUser(data) {
    return this.registerDbUtils.saveNewUser(data);
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

  getVerificationToken(userId) {
    return this.registerDbUtils.getUserVerificationToken(userId);
  }
}

export default RegisterService;
