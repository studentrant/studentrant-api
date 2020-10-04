/* eslint-disable max-classes-per-file */
/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */

export class Collection {
  constructor() {}

  save() {}

  static findOne(value) { return { lean() { return Promise.resolve(value); } }; }

  static updateOne(value) { return { lean() { return Promise.resolve(value); } }; }

  static findOneAndUpdate(value) { return { lean() { return Promise.resolve(value); } }; }
}

export class RegisterDbUtils {
  constructor() {}

  updateNewUserDetails() {}

  checkEmail() {}

  checkUserName() {}

  saveNewUser() {}
}

export class RantDbUtils {
  constructor() {}

  saveRant() {}
}
