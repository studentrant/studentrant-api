import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import * as constants from '../constants/index.constant.js';
import { RegisterService } from '../service/register.service.js';
import { ExistsException } from '../core/exceptions.service.js';

export default class Registration {
  constructor(
    RegisterDbUtils,
    Email,
    Utils,
    PasswordUtils,
    usersCollection,
    config,
  ) {
    this.Utils = Utils;
    this.passwordUtils = new PasswordUtils(bcrypt);
    this.registerService = new RegisterService(
      new RegisterDbUtils(usersCollection),
      Utils,
    );
    this.email = new Email(config);
    this.env = config.get('env');
  }

  async firstRegStep(req, res, next) {
    try {
      const { email, username, password } = req.body;
      const data = await this.registerService.checkUserExistence(email, username);

      if (data) {
        throw ExistsException(
          data.email
            ? constants.registerConstants.EMAIL_ALREADY_EXISTS
            : constants.registerConstants.USERNAME_ALREADY_EXISTS,
        );
      }

      const result = await this.registerService.saveUser({
        userId: uuid(),
        username,
        password: await this.passwordUtils.hashPassword(password),
        email,
      });

      this.Utils.SetSessionObject(req, result);

      return res.status(201).json({ status: 201, message: result });
    } catch (ex) {
      return next(ex);
    }
  }

  async lastRegStep(req, res, next) {
    const { country, interests } = req.body;

    try {
      const email = await this.Utils.ExtractSessionObjectData(req, 'email');
      const verificationLink = await this.Utils.UniqueCodeGenerator(email);
      const result = await this.registerService.updateUserAndCompletetReg({
        email, country, interests, verificationLink,
      });

      if (this.env !== 'test') delete result.verificationLink;

      Promise.resolve(
        this.email.sendEmailVerification(email),
      );

      return res.status(201).json({ status: 201, message: result });
    } catch (ex) {
      return next(ex);
    }
  }

  async verificationToken(req, res, next) {
    const { token } = req.params;
    try {
      const userData = await this.registerService.verifyValidationTokenAndSetVerified(token);
      return res.status(200).json({ status: 200, message: userData });
    } catch (ex) {
      return next(ex);
    }
  }
}
