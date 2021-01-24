import { v4 as uuid4 } from 'uuid';

import { rantEnums } from '../enums/rants.enums.js';

import PostRantService from './post-rant.service.js';

export default class Trending extends PostRantService {
  constructor(trendingDbUtils, rantDbUtils, userDbUtils) {
    super(rantDbUtils, userDbUtils);
    this.trendingDbUtils = trendingDbUtils;
  }

  async createTrendIfExists({ text, identifier, col }) {
    const chunkWithHashTag = this.#getTrendFromText(text);
    if (chunkWithHashTag.length === 0) return;
    await this.trendingDbUtils.createOrUpdateTrend({
      query: { trendName: { $in: chunkWithHashTag } },
      update: {
        $setOnInsert: { trendId: uuid4() },
        $push: { trend: { againstCollection: col, uniqueIdentifier: identifier } },
      },
      options: { upsert: true },
    });
  }

  async getPaginatedTrend(trendName, numRequest) {
    return this.trendingDbUtils.getTrendsAggregation({
      matchTrendName: { $match: { trendName } },
      unwindTrends: { $unwind: '$trend' },
      removeFields: { $project: { _id: false, 'trend._id': false } },
      skipAlreadyViewed: { $skip: rantEnums.RANTS_LOAD_LIMIT * numRequest },
      limitTrends: { $limit: rantEnums.RANTS_LOAD_LIMIT },
    });
  }

  async getTrends(trendIds, trendName) {
    const rantsTrend = [];
    const rantCommentsTrend = [];
    const trendResult = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const { trend: { againstCollection, uniqueIdentifier } } of trendIds) {
      if (againstCollection === 'rant') rantsTrend.push(uniqueIdentifier);
      else rantCommentsTrend.push('rantcomment');
    }

    if (rantsTrend.length && rantCommentsTrend.length) return null;

    trendResult.rantsTrend = rantsTrend.length === 0
      ? null
      : await this.#getTrendForRants(trendName, rantsTrend);

    trendResult.rantCommentsTrend = trendResult.length === 0
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

    // pending implementation
    // trendResult.rantCommentsTrend = trendResult.rantCommentsTrend?.blablal

    delete trendResult.rantsTrend?.hasMore;
    delete trendResult.rantCommentsTrend?.hasMore;

    return trendResult;
  }

  async #getTrendForRantComments () {
    return {};
  }

  async #getTrendForRants (trendName, rantsTrendIds) {
    const rantCount = (
      await this.trendingDbUtils.getTotalTrendRants({ trendName })
    ).trend.length;
    return this.getRantFromAggregation(
      {
        /**
         * already used in the controller
         * where we got the the trendIds
         * */
        numRequest: 0,
        rantCount,
        matchBy: { rantId: { $in: rantsTrendIds }, deleted: false },
        calculateNext: rantEnums.RANTS_LOAD_LIMIT,
      },
    );
  }

  #getTrendFromText (text) {
    const markedAsTrend = text.split(' ').filter(
      (chunk) => chunk.startsWith('#'),
    );
    return markedAsTrend;
  }
}
