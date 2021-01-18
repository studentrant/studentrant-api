import * as constants from '../constants/index.constant.js';
import {
  NotFoundException,
} from '../core/exceptions.service.js';
import TrendingService from '../service/trending.service.js';

export default class Trend {
  constructor({ Collections, DBUtils }) {
    this.trendingService = new TrendingService(
      new DBUtils.TrendDbUtils(Collections.TrendingCollection),
      new DBUtils.RantDbUtils(Collections.RantsCollection),
      new DBUtils.TrendDbUtils(Collections.TrendingCollection),
    );
  }

  async getRantsByTrend(req, res, next) {
    const { trend: trendName } = req.params;
    const { numRequest } = req.query;

    try {
      const trendIds = await this.trendingService.getPaginatedTrend(trendName, numRequest);

      if (trendIds.length === 0) {
        throw NotFoundException(
          constants.rantConstants.RANT_READ_EXHAUSTED,
        );
      }

      const result = this.trendingService.getTrends(trendIds);

      if (result.length === 0) {
        throw NotFoundException(
          constants.rantConstants.RANT_READ_EXHAUSTED,
        );
      }

      return res.status(200).json(
        {
          status: 200,
          message: { rant: result },
        },
      );
    } catch (ex) {
      return next(ex);
    }
  }
}
