import UsersCollection from '../ranter/ranter.model.js';

import * as Utils from '../utils/index.util.js';

import Login from './login.controller.js';
import LoginMiddlewareValidator from './login.middleware-validator.js';

export default class LoginRoute {
  constructor(routeHandler) {
    this.controller = new Login(
      Utils,
      UsersCollection,
    );
    this.loginValidator = new LoginMiddlewareValidator();
    routeHandler.post('/', this.loginUser());
    return routeHandler;
  }

  static API_PATH = '/login';

  loginUser() {
    return [
      this.loginValidator.userNameAndEmailValidator,
      this.loginValidator.passwordValidator,
      this.controller.login.bind(this.controller),
    ];
  }
}
