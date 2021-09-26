import { v4 as uuid4 } from 'uuid';
import PostRantService from '../post-rant/post-rant.service.js';
import ReplyRantService from '../reply-rant/reply-rant.service.js';

export default class Trending {
  constructor(trendingDbUtils, rantDbUtils, userDbUtils, replyRantDbUtils) {
    this.trendingDbUtils = trendingDbUtils;
    this.postRantService = new PostRantService(rantDbUtils, userDbUtils);
    this.replyRantService = new ReplyRantService(rantDbUtils, replyRantDbUtils);
    this.RANTS_LOAD_LIMIT = 20;
  }

  async createTrendIfExists({ text, identifier, col }) {
    const chunkWithHashTag = this.#getTrendFromText(text);
    // eslint-disable-next-line no-restricted-syntax
    for (const chunk of chunkWithHashTag) {
      Promise.resolve(
        this.trendingDbUtils.createOrUpdateTrend({
          query: { trendName: chunk },
          update: {
            $setOnInsert: { trendId: uuid4() },
            $push: { trend: { againstCollection: col, uniqueIdentifier: identifier } },
          },
          options: { upsert: true },
        }),
      );
    }
  }

  async getPaginatedTrend(trendName, numRequest) {
    return this.trendingDbUtils.getTrendsAggregation({
      matchTrendName: { $match: { trendName } },
      unwindTrends: { $unwind: '$trend' },
      removeFields: { $project: { _id: false, 'trend._id': false } },
      skipAlreadyViewed: { $skip: this.RANTS_LOAD_LIMIT * numRequest },
      limitTrends: { $limit: this.RANTS_LOAD_LIMIT },
    });
  }

  async getTrends(trendIds, trendName) {
    const rantsTrend = [];
    const rantCommentsTrend = [];
    const trendResult = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const { trend: { againstCollection, uniqueIdentifier } } of trendIds) {
      if (againstCollection === 'rant') rantsTrend.push(uniqueIdentifier);
      else rantCommentsTrend.push(uniqueIdentifier);
    }

    if (!rantsTrend.length && !rantCommentsTrend.length) return null;

    trendResult.rantsTrend = rantsTrend.length === 0
      ? null
      : await this.#getTrendForRants(trendName, rantsTrend);

    trendResult.rantCommentsTrend = rantCommentsTrend.length === 0
      ? null
      : await this.#getTrendForRantComments(trendName, rantCommentsTrend);

    /**
     * TODO: After implementation of comments on rant
     *       come back here and impelemnt trends use on rantcomments
     *       and also merge page of rants and rantcomments object just as hasMore property
     * */
    trendResult.hasMore = !!(trendResult.rantsTrend?.hasMore
                             || trendResult.rantCommentsTrend?.hasMore
    );

    trendResult.rantsTrend = trendResult.rantsTrend?.rants;
    trendResult.rantCommentsTrend = trendResult.rantCommentsTrend?.replies;

    delete trendResult.rantsTrend?.hasMore;
    delete trendResult.rantCommentsTrend?.hasMore;

    return trendResult;
  }

  async #getCountOfTrend(trendName) {
    return (await this.trendingDbUtils.getTotalTrendRants({ trendName })).trend.length;
  }

  async #getTrendForRantComments(trendName, replyRantTrendIds) {
    const replyRantCount = await this.#getCountOfTrend(trendName);
    return this.replyRantService.getRantRepliesFromAggregation(
      {
        numRequest: 0,
        replyRantCount,
        matchBy: { rantCommentId: { $in: replyRantTrendIds }, deleted: false },
      },
    );
  }

  async #getTrendForRants(trendName, rantsTrendIds) {
    const rantCount = await this.#getCountOfTrend(trendName);
    return this.postRantService.getRantFromAggregation(
      {
        /**
         * already used in the controller
         * where we got the the trendIds
         * */
        numRequest: 0,
        rantCount,
        matchBy: { rantId: { $in: rantsTrendIds }, deleted: false },
        calculateNext: this.RANTS_LOAD_LIMIT,
      },
    );
  }

  #getTrendFromText(text) {
    const markedAsTrend = text.split(' ').filter(
      (chunk) => chunk.startsWith('#'),
    );
    return markedAsTrend;
  }
}
