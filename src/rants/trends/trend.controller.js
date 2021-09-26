import rantConstants from '../rant.constant.js';
import {
  NotFoundException,
} from '../../core/exceptions.service.js';
import TrendingService from './trending.service.js';

export default class Trend {
  constructor({ Collections, DBUtils }) {
    this.trendingService = new TrendingService(
      new DBUtils.TrendDbUtils(Collections.TrendsCollection),
      new DBUtils.RantDbUtils(Collections.RantsCollection),
      new DBUtils.UserDbUtils(Collections.UsersCollection),
      new DBUtils.ReplyRantDbUtils(Collections.ReplyRantCollection),
    );
  }

  async getRantsByTrend(req, res, next) {
    const { trend: trendName } = req.params;
    const { numRequest } = req.query;

    try {
      const trendIds = await this.trendingService.getPaginatedTrend(trendName, numRequest);
      if (trendIds.length === 0) {
        throw NotFoundException(
          rantConstants.RANT_READ_EXHAUSTED,
        );
      }

      const result = await this.trendingService.getTrends(trendIds, trendName);

      if (!result) {
        throw NotFoundException(
          rantConstants.RANT_READ_EXHAUSTED,
        );
      }

      return res.status(200).json(
        {
          status: 200,
          message: result,
        },
      );
    } catch (ex) {
      return next(ex);
    }
  }
}
