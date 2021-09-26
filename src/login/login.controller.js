import bcrypt from 'bcryptjs';

import loginConstants from './login.constant.js';
import { NotFoundException } from '../core/exceptions.service.js';

export default class Login {
  constructor(Utils, usersCollection) {
    this.passwordUtils = new Utils.PasswordUtils(bcrypt);
    this.utils = Utils;
    this.usersCollection = usersCollection;
  }

  async __checkForUserExistence({ email, username, password }) {
    const {
      exists, data,
    } = await this.utils.DbUtils.ResourceExists(
      [this.usersCollection], username ? { username } : { email },
    );

    if (!exists) return loginConstants.INVALID_LOGIN_CREDENTIALS;

    if (
      !await this.passwordUtils.verifyHashPassword(password, data.password)
    ) return loginConstants.INVALID_LOGIN_CREDENTIALS;

    return data;
  }

  async login(req, res, next) {
    const { username, email, password } = req.body;

    try {
      const data = await this.__checkForUserExistence({ username, email, password });

      if (typeof (data) === 'string') throw NotFoundException(data);

      this.utils.Utils.SetSessionObject(req, {
        email: data.email,
        username: data.username,
        userId: data.userId,
        verified: data.verified,
        completeReg: data.completeReg,
      });

      delete data._doc.password;
      delete data._doc._id;
      delete data._doc.__v;

      return res.status(200).json({ status: 200, message: data });
    } catch (ex) {
      return next(ex);
    }
  }
}
