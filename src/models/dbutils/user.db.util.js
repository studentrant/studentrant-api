export default class UserDbUtils {
  constructor(usersCollection) {
    this.UsersCollection = usersCollection;
  }

  async saveNewUser(data) {
    await (new this.UsersCollection(data).save());
    return this.UsersCollection.findOne({ email: data.email }, {
      password: false,
      _id: false,
      __v: false,
      dateOfReg: false,
    }).lean();
  }

  updateUserInfo({ criteria, data, options }) {
    return this.UsersCollection.findOneAndUpdate(criteria, data, options);
  }

  verifyUserRegTokenAndGetData(token) {
    return this.UsersCollection.findOneAndUpdate(
      { verificationToken: token },
      { $unset: { verificationToken: 1 } },
      {
        new: false,
        fields: {
          password: false, _id: false, __v: false, dateOfReg: false,
        },
      },
    ).lean();
  }

  checkUserName(username) {
    return this.checkUserExists('username', username);
  }

  checkEmail(email) {
    return this.checkUserExists('email', email);
  }

  checkUserExists(key, value) {
    return this.UsersCollection.findOne({ [key]: value }, { [key]: true });
  }

  get(userId) {
    return this.UsersCollection.findOne(
      { userId },
      {
        passwod: false,
        verified: false,
        completeReg: false,
        verificationToken: false,
      },
    );
  }

  getUserVerificationToken(userId) {
    return this.UsersCollection.findOne(
      { userId },
      { verificationToken: true },
    );
  }

  getUserVerificationTokenAndEmail(userEmailAddress) {
    return this.UsersCollection.findOne(
      { email: userEmailAddress },
      { verificationToken: true, username: true },
    );
  }
}
