import { v4 as uuid4 } from 'uuid';

import { rantEnums } from '../enums/rants.enums.js';

import PostRantService from './post-rant.service.js';

export default class Trending extends PostRantService {
  constructor(trendingDBUtils, rantDbUtils, userDbUtils) {
    super(rantDbUtils, userDbUtils);
    this.trendingDBUtils = trendingDBUtils;
  }

  async createTrendIfExists({ text, identifier, col }) {
    const chunkWithHashTag = this.#getTrendFromText(text);
    if (chunkWithHashTag.length === 0) return;
    await this.trendingDbUtils.createOrUpdateTrend({
      query: { trendName: { $in: chunkWithHashTag } },
      update: [
        {
          $set: {
            trendId: { $IfNull: ['$trendId', uuid4()] },
            trendName: '$trendName',
          },
        },
        {
          $group: {
            trend: { $push: { againstCollection: col, uniqueIdentifier: identifier } },
          },
        },
      ],
      options: { upsert: true },
    });
  }

  async getPaginatedTrend(trendName, numRequest) {
    return this.trendingDBUtils.getTrendsAggregation({
      matchTrendName: { $match: { trendName } },
      unwindTrends: { $unwind: '$trend' },
      skipAlreadyViewed: { $skip: rantEnums.RANTS_LOAD_LIMIT * numRequest },
      limitTrends: { $limit: rantEnums.RANTS_LOAD_LIMIT },
    });
  }

  async getTrends(trendIds, trendName) {
    const rantsTrend = [];
    const rantCommentsTrend = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const { againstCollection, uniqueIdentifier } of trendIds) {
      if (againstCollection === 'rant') rantsTrend.push(uniqueIdentifier);
      else rantCommentsTrend.push('rantcomment');
    }

    return Promise.all([
      await this.#getTrendForRants(trendName, rantsTrend),
    ]);
  }

  async #getTrendForRants (trendName, rantsTrendIds) {
    return this.getRantFromAggregation(
      {
        /**
         * already used in the controller
         * where we got the the trendIds
         * */
        numRequest: 0,
        matchBy: { rantId: { $in: rantsTrendIds }, deleted: false },
        rantCount: await this.trendingDBUtils.getTotalTrendRants({ trendName }).trend.length,
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
