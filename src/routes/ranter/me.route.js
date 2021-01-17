import User from '../../controllers/ranter.controller.js';
import RantValidators from '../../middlewares/rant.middleware.js';
import UsersCollection from '../../models/dbmodels/user.model.js';
import UserDbUtils from '../../models/dbutils/user.db.util.js';
import { Utils } from '../../utils/index.util.js';

export default class Me {
  constructor(routeHandler) {
    this.controller = new User(
      UserDbUtils,
      UsersCollection,
      Utils,
    );

    routeHandler.patch('/update/tags', this.updateTags());
    // routeHandler.patch("/update/image", this.updateImage());
    routeHandler.patch('/update/settings', this.updateSettings());
    routeHandler.patch('/update/account-state', this.updateAccountState());

    return routeHandler;
  }

  static API_PATH = '/me'

  updateTags() {
    return [
      RantValidators.VerifyRantTags,
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
