import * as constants from '../constants/index.constant.js';
import Trend from './trend.controller.js';
import req from '../../__test__/fakes/req.fake.js';
import res from '../../__test__/fakes/res.fake.js';
import next from '../../__test__/fakes/next.fake.js';
import {
  TrendDbUtils,
  ReplyRantDbUtils,
  RantDbUtils,
  Collection,
  UserDbUtils
} from '../../__test__/fakes/db.fakes.js';

describe("Trends [Unit]", () => {

  const controller = new Trend(
    {
      Collections: {
        RantsCollection     : Collection,
        UsersCollection     : Collection,
        TrendsCollection    : Collection,
        ReplyRantCollection : Collection
      },
      DBUtils: { RantDbUtils, UserDbUtils, TrendDbUtils, ReplyRantDbUtils }
    }
  );

  describe("::getRantsByTrend", () => {
    let getPaginatedTrendSpy;
    let getTrendsSpy;

    beforeEach(() => {
      getPaginatedTrendSpy = spyOn(controller.trendingService, 'getPaginatedTrend');
      getTrendsSpy = spyOn(controller.trendingService, 'getTrends');
    });

    afterEach(() => {
      getPaginatedTrendSpy.calls.reset();
      getTrendsSpy.calls.reset();
    });

    beforeAll(() => {
      req.params = { trend: "#test" };
      req.query = { numRequest: 0 };
    });

    it('should return not found error if there is no trendIds of #test ', async () => {
      getPaginatedTrendSpy.and.resolveTo([])
      const result = await controller.getRantsByTrend(req,res,next);
      expect(controller.trendingService.getTrends).not.toHaveBeenCalled();
      expect(controller.trendingService.getPaginatedTrend).toHaveBeenCalled();
      expect(controller.trendingService.getPaginatedTrend).toHaveBeenCalledWith(req.params.trend, req.query.numRequest);
      expect(result.status).toEqual(404);
      expect(result.message).toEqual(
        constants.rantConstants.RANT_READ_EXHAUSTED
      );
    });

    it('should return not found error if we have exhausted the reads or there was not found for that #test', async () => {
      getPaginatedTrendSpy.and.resolveTo([ 'xxx', 'xxx', 'xxx'])
      getTrendsSpy.and.resolveTo(null);
      const result = await controller.getRantsByTrend(req,res,next);
      expect(controller.trendingService.getPaginatedTrend).toHaveBeenCalled();
      expect(controller.trendingService.getPaginatedTrend).toHaveBeenCalledWith(req.params.trend, req.query.numRequest);
      expect(controller.trendingService.getTrends).toHaveBeenCalled();
      expect(controller.trendingService.getTrends).toHaveBeenCalledWith([ 'xxx', 'xxx', 'xxx'], req.params.trend);
      expect(result.status).toEqual(404);
      expect(result.message).toEqual(
        constants.rantConstants.RANT_READ_EXHAUSTED
      );
    })

    it('should return matched trends', async () => {
      getPaginatedTrendSpy.and.resolveTo([ 'xxx', 'xxx', 'xxx'])
      getTrendsSpy.and.resolveTo(
        {
          rantsTrend: [ {} , {} ],
          rantCommentsTrends: [ {} ],
          hasMore: true
        }
      );
      const result = JSON.parse(await controller.getRantsByTrend(req,res,next));
      expect(controller.trendingService.getPaginatedTrend).toHaveBeenCalled();
      expect(controller.trendingService.getPaginatedTrend).toHaveBeenCalledWith(req.params.trend, req.query.numRequest);
      expect(controller.trendingService.getTrends).toHaveBeenCalled();
      expect(controller.trendingService.getTrends).toHaveBeenCalledWith([ 'xxx', 'xxx', 'xxx'], req.params.trend);
      expect(result.status).toEqual(200);
      expect(result.message).toEqual(
        {
          rantsTrend: [ {} , {} ],
          rantCommentsTrends: [ {} ],
          hasMore: true
        }
      )
    })

    it('should throw error if something bad happen', async () => {
      getPaginatedTrendSpy.and.throwError('x');
      await controller.getRantsByTrend(req,res,next);
      expect(controller.trendingService.getPaginatedTrend).toThrow(new Error('x'));
    });

    it('should throw error if something bad happen', async () => {
      getPaginatedTrendSpy.and.resolveTo([ 'xxx', 'xxx', 'xxx'])
      getTrendsSpy.and.throwError('x');
      await controller.getRantsByTrend(req,res,next);
      expect(controller.trendingService.getPaginatedTrend).toHaveBeenCalled();
      expect(controller.trendingService.getPaginatedTrend).toHaveBeenCalledWith(req.params.trend, req.query.numRequest);
      expect(controller.trendingService.getTrends).toThrow(new Error('x'));
    });
  });

});
