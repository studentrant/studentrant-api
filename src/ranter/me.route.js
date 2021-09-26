import User from './ranter.controller.js';
import RantMiddlewareValidators from '../rants/rant.middleware.js';
import UsersCollection from '../ranter/ranter.model.js';
import UserDbUtils from '../ranter/ranter.db.util.js';
import { Utils } from '../utils/index.util.js';

export default class Me {
  constructor(routeHandler) {
    this.controller = new User(
      UserDbUtils,
      UsersCollection,
      Utils,
    );
    this.rantValidators = new RantMiddlewareValidators();

    routeHandler.patch('/update/tags', this.updateTags());
    // routeHandler.patch("/update/image", this.updateImage());
    routeHandler.patch('/update/settings', this.updateSettings());
    routeHandler.patch('/update/account-state', this.updateAccountState());

    return routeHandler;
  }

  static API_PATH = '/me'

  updateTags() {
    return [
      this.rantValidators.verifyRantTags,
      this.controller.updateTags.bind(this.controller),
    ];
  }

  updateSettings() {
    return [

    ];
  }

  updateAccountState() {
    return [

    ];
  }
}
