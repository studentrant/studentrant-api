import Trend from '../../controllers/trend.controller.js';
import RantValidators from '../../middlewares/rant.middleware.js';
import RantsCollection from '../../models/dbmodels/rant.model.js';
import TrendsCollection from '../../models/dbmodels/trends.model.js';
import UsersCollection from '../../models/dbmodels/user.model.js';
import RantDbUtils from '../../models/dbutils/rant.db.util.js';
import TrendDbUtils from '../../models/dbutils/trends.db.util.js';
import UserDbUtils from '../../models/dbutils/user.db.util.js';

export default class TrendRoute {
  constructor(routeHandler) {
    this.controller = new Trend({
      Collections: { RantsCollection, UsersCollection, TrendsCollection },
      DBUtils: { RantDbUtils, UserDbUtils, TrendDbUtils },
    });

    routeHandler.get('/:trend', this.getTrends());

    return routeHandler;
  }

  static API_PATH = '/trend'

  getTrends() {
    return [
      RantValidators.VerifyTrend,
      RantValidators.VerifyNumRequest,
      this.controller.getRantsByTrend.bind(this.controller),
    ];
  }
}
