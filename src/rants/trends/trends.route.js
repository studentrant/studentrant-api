import Trend from './trend.controller.js';
import RantMiddlewareValidators from '../rant.middleware.js';
import RantsCollection from '../post-rant/post-rant.model.js';
import ReplyRantCollection from '../reply-rant/reply-rant.model.js';
import TrendsCollection from './trends.model.js';
import UsersCollection from '../../ranter/ranter.model.js';
import ReplyRantDbUtils from '../reply-rant/reply-rant.db.util.js';
import RantDbUtils from '../post-rant/post-rant.db.util.js';
import TrendDbUtils from './trends.db.util.js';
import UserDbUtils from '../../ranter/ranter.db.util.js';

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

    this.rantValidators = new RantMiddlewareValidators();

    routeHandler.get('/:trend', this.getTrends());

    return routeHandler;
  }

  static API_PATH = '/trend'

  getTrends() {
    return [
      this.rantValidators.verifyTrend,
      this.rantValidators.verifyNumRequest,
      this.controller.getRantsByTrend.bind(this.controller),
    ];
  }
}
