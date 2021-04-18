import Trend from '../../controllers/trend.controller.js';
import RantValidators from '../../middlewares/rant.middleware.js';
import RantsCollection from '../../models/dbmodels/rant.model.js';
import ReplyRantCollection from '../../models/dbmodels/rantcomments.model.js';
import TrendsCollection from '../../models/dbmodels/trends.model.js';
import UsersCollection from '../../models/dbmodels/user.model.js';
import ReplyRantDbUtils from '../../models/dbutils/rant-reply.db.util.js';
import RantDbUtils from '../../models/dbutils/rant.db.util.js';
import TrendDbUtils from '../../models/dbutils/trends.db.util.js';
import UserDbUtils from '../../models/dbutils/user.db.util.js';

export default class TrendRoute {
  constructor(routeHandler) {
    this.controller = new Trend({
      Collections: {
        RantsCollection, UsersCollection, TrendsCollection, ReplyRantCollection,
      },
      DBUtils: {
        RantDbUtils, UserDbUtils, TrendDbUtils, ReplyRantDbUtils,
      },
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
