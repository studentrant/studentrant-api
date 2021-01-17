import Login from '../../controllers/login.controller.js';
import middleware from '../../middlewares/validator.middleware.js';
import UsersCollection from '../../models/dbmodels/user.model.js';
import * as Utils from '../../utils/index.util.js';

export default class LoginRoute {
  constructor(routeHandler) {
    this.controller = new Login(
      Utils,
      UsersCollection,
    );
    routeHandler.post('/', this.loginUser());
    return routeHandler;
  }

  static API_PATH = '/login';

  loginUser() {
    return [
      middleware.UserNameAndEmailValidator,
      middleware.PasswordValidator,
      this.controller.login.bind(this.controller),
    ];
  }
}
